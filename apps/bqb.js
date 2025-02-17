import fs from 'fs'
import { PluginPath } from '../components/index.js'
import YAML from 'yaml'
let CONFIG_YAML = YAML.parse(
  fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
)
export class bqb extends plugin {
  constructor () {
    super({
      name: '表情包',
      dsc: 'bqb',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: /^#?随机(.*)表情包$/,
          fnc: 'bqb'
        }
      ]
    })
  }

  async bqb (e) {
    if (!CONFIG_YAML.sjbqb) {
      return logger.info('[Bxianx插件]随机表情包已关闭')
    }
    const type = e.msg.match(/^#?随机(.*)表情包$/)[1]
    if (
      type !== '甘城' &&
      type !== '' &&
      type !== '猫羽雫' &&
      type !== '甘城猫猫' &&
      type !== 'fufu' &&
      type !== '丛雨' &&
      type !== '小南梁' &&
      type !== '千恋万花' &&
      type !== '古拉' &&
      type !== '心海' &&
      type !== '柴郡猫' &&
      type !== '满穗' &&
      type !== '猫猫虫' &&
      type !== '纳西妲' &&
      type !== '诗歌剧' &&
      type !== '龙图' &&
      type !== 'kemomimi'
    ) {
      await this.e.reply(
        `没有${type}的表情包诶!您可以使用'#表情包帮助'来查看拥有的表情包哦~`
      )
      return true
    }
    if (type === '甘城' || type === '猫羽雫' || type === '甘城猫猫') {
      let data = await fs.readFileSync(`${PluginPath}/config/AllAPI.json`)
      const API = JSON.parse(data)
      let api = API.api5.url + '?name=甘城猫猫'
      await e.reply(segment.image(api))
      return true
    }
    if (!type) {
      let data = await fs.readFileSync(`${PluginPath}/config/AllAPI.json`)
      const API = JSON.parse(data)
      let api = API.api22.url
      await e.reply(segment.image(api))
      return true
    }
    let data = await fs.readFileSync(`${PluginPath}/config/AllAPI.json`)
    const API = JSON.parse(data)
    let api = API.api5.url + `?name=${type}`
    await e.reply(segment.image(api))
    return true
  }
}

