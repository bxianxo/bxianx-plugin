import moment from 'moment'
import { PluginPath } from '../components/index.js'
import YAML from 'yaml'
import fs from 'fs'

let CONFIG_YAML = YAML.parse(
  fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
)
let time = 96 // 数据保留时间，单位: 小时

Bot.on('message.group', async (e) => {
  let imgUrls = []
  let AtQQ = []

  for (let msg of e.message) {
    if (msg.type === 'at') {
      AtQQ.push(msg.qq)
    }
    if (msg.type === 'image') {
      imgUrls.push(msg.url)
    }
  }

  if (!AtQQ.length) return false

  let dateTime = moment().add(time, 'hours').format('YYYY-MM-DD HH:mm:ss')
  let newDate = (new Date(dateTime).getTime() - Date.now()) / 1000

  e.raw_message = e.raw_message.replace(/\[(.*?)\]/g, '').trim()

  if (e.atall) {
    AtQQ = (await e.group.getMemberMap()).map((member) => member[0])
  }

  for (let qq of AtQQ) {
    let data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}_${qq}`))
    let reply = e.source
      ? (await e.group.getChatHistory(e.source.seq, 1)).pop()
      : null
    let atName = e.raw_message.split(' ')
    e.raw_message = e.raw_message.replace(new RegExp(atName[0], 'g'), '')

    let redisData = {
      User: e.user_id,
      message: e.raw_message,
      image: imgUrls,
      name: e.sender.card,
      time: e.time,
      messageId: reply ? reply.message_id : '',
      endTime: dateTime
    }

    if (data) {
      data.push(redisData)
    } else {
      data = [redisData]
    }

    newDate = (new Date(data[0].endTime).getTime() - Date.now()) / 1000
    await redis.set(`Yz:whoAtme:${e.group_id}_${qq}`, JSON.stringify(data), {
      EX: parseInt(newDate)
    })
  }
})

export class whoAtme extends plugin {
  constructor () {
    super({
      name: '谁艾特我',
      dsc: '看看哪个狗崽子天天艾特人',
      event: 'message',
      priority: -114514,
      rule: [
        {
          reg: '^(谁(艾特|@|at)(我|他|她|它)|哪个逼(艾特|@|at)我)$',
          fnc: 'whoAtme'
        },
        {
          reg: '^(/clear_at|清除(艾特|at)数据)$',
          fnc: 'clearAt'
        },
        {
          reg: '^(/clear_all|清除全部(艾特|at)数据)$',
          fnc: 'clearAll',
          permission: 'master'
        }
      ]
    })
  }

  async whoAtme (e) {
    if (!CONFIG_YAML.shuianwo) {
      return logger.info('[Bxianx插件]谁艾特我已关闭')
    }

    if (!e.isGroup) {
      e.reply('只支持群聊使用')
      return false
    }

    let data
    if (e.atBot) {
      e.at = Bot.uin
    }

    const targetQQ = !e.msg.includes('我') ? e.at : e.user_id
    data = JSON.parse(await redis.get(`Yz:whoAtme:${e.group_id}_${targetQQ}`))

    if (!data) {
      e.reply('目前还没有人艾特', true)
      return false
    }

    const msgList = data.map((item) => {
      const msg = [
        item.messageId ? { type: 'reply', id: item.messageId } : '',
        item.message,
        ...item.image.map(() => '\n该消息含有图片,不支持图片消息!')
      ]
        .filter(Boolean)
        .join('')

      return {
        message: `发送者名称: ${item.name}\n发送者QQ: ${item.User}\n发送时间: ${moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')}\n消息内容: ${msg}`
      }
    })

    let forwardMsg = await e.group.makeForwardMsg(msgList)
    if (typeof forwardMsg.data === 'object') {
      if (forwardMsg.data?.meta?.detail) {
        forwardMsg.data.meta.detail.news = [{ text: '点击显示内容' }]
      }
    } else {
      forwardMsg.data = forwardMsg.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(
          /___+/,
          '<title color="#777777" size="26">点击显示内容</title>'
        )
    }
    await e.reply(forwardMsg)
    return false
  }

  async clearAt (e) {
    if (!e.isGroup) {
      e.reply('只支持群聊使用')
      return false
    }
    let data = await redis.get(`Yz:whoAtme:${e.group_id}_${e.user_id}`)
    if (!data) {
      e.reply('目前数据库没有你的at数据,无法清除', true)
      return false
    }
    await redis.del(`Yz:whoAtme:${e.group_id}_${e.user_id}`)
    e.reply('已成功清除', true)
  }

  async clearAll (e) {
    let keys = await redis.keys('Yz:whoAtme:*')
    for (let key of keys) {
      await redis.del(key)
    }
    e.reply('已成功清除全部艾特数据')
  }
}
