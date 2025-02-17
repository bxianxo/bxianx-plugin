import fetch from 'node-fetch'
import fs from 'fs'
import { PluginPath } from '../components/index.js'
import YAML from 'yaml'
let CONFIG_YAML = YAML.parse(
  fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
)
export class KFC extends plugin {
  constructor () {
    super({
      name: '疯狂星期四',
      dsc: 'KFC',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^[#/]?疯狂星期四$',
          fnc: 'KFC'
        }
      ]
    })
  }

  async KFC (e) {
    if (!CONFIG_YAML.KFC) {
      return logger.info('[Bxianx插件]疯狂星期四已关闭')
    }
    let data = await fs.readFileSync(`${PluginPath}/config/AllAPI.json`)
    const API = JSON.parse(data)
    let api = API.api21.url
    const response = await fetch(api)
    let text = await response.text()
    e.reply(text)
    return true
  }
}
