import fs from 'fs'
import { PluginPath } from '../components/index.js'
import YAML from 'yaml'
let CONFIG_YAML = YAML.parse(
  fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
)
export class jupai extends plugin {
  constructor () {
    super({
      name: '小人举牌',
      dsc: 'jupai',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^[#/]?举牌(.*)$',
          fnc: 'jupai'
        }
      ]
    })
  }

  async jupai (e) {
    if (!CONFIG_YAML.jupai) {
      return logger.info('[Bxianx插件]举牌已关闭')
    }
    const msg = e.msg.match(/^[#/]?举牌(.*)$/)[1]
    let data = await fs.readFileSync(`${PluginPath}/config/AllAPI.json`)
    const API = JSON.parse(data)
    let api = API.api4.url + `?msg=${msg}`
    e.reply([segment.image(`${api}`)])
    return true
  }
}
