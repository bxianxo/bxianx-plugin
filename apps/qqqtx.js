import fs from 'fs'
import { PluginPath } from '../components/index.js'
import YAML from 'yaml'
let CONFIG_YAML = YAML.parse(
  fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
)
export class qqqtx extends plugin {
  constructor () {
    super({
      name: '获取QQ群头像',
      dsc: 'qqqtx',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^[#/]?群头像$',
          fnc: 'qqqtx'
        }
      ]
    })
  }

  async qqqtx (e) {
    if (!CONFIG_YAML.qqqtx) {
      return logger.info('[Bxianx插件]QQ群头像已关闭')
    }
    if (!e.isGroup) {
      return e.reply('[Bxianx插件]QQ群头像只能在群聊中使用', true)
    } else {
      return e.isGroup ? e.reply(segment.image(e.group.getAvatarUrl())) : false
    }
  }
}
