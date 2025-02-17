import { PluginName } from '../components/index.js'
import { update as Update } from '../../other/update.js'
export class Bxianxupdate extends plugin {
  constructor () {
    super({
      name: '不羡仙插件更新',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: /^#?(ll|不羡仙|Bxianx)(插件)?(强制)?更新$/i,
          fnc: 'update'
        },
        {
          reg: /^#?(ll|不羡仙|Bxianx)(插件)?更新日志$/i,
          fnc: 'updateLog'
        }
      ]
    })
  }

  async update (e = this.e) {
    const Type = e.msg.includes('强制') ? '#强制更新' : '#更新'
    e.msg = Type + PluginName
    const up = new Update(e)
    up.e = e
    return up.update()
  }

  async updateLog (e = this.e) {
    e.msg = '#更新日志' + PluginName
    const up = new Update(e)
    up.e = e
    return up.updateLog()
  }
}
