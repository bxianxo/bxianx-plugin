import lodash from 'lodash'
import { render, Data } from '../components/index.js'
import Theme from './Help/Helptheme.js'

export class BxianxHelp extends plugin {
  constructor () {
    super({
      name: 'Bxianx帮助',
      dsc: 'Bxianxhelp',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: /^#?(ll|不羡仙|Bxianx)(插件)?(帮助|help|指令|菜单|命令)$/i,
          fnc: 'ahelp'
        },
        {
          reg: /^#?(ll|不羡仙|Bxianx)(插件)?表情包帮助$/i,
          fnc: 'bqbhelp'
        },
        {
          reg: /^#?(ll|不羡仙|Bxianx)(插件)?设置帮助$/i,
          fnc: 'settinghelp'
        }
      ]
    })
  }

  async ahelp () {
    return await help(this.e)
  }

  async bqbhelp () {
    return await help1(this.e)
  }

  async settinghelp () {
    return await help2(this.e)
  }
}
async function help (e) {
  let custom = {}
  let help = {}
  let { diyCfg, sysCfg } = await Data.importCfg('help')
  custom = help
  let helpConfig = lodash.defaults(
    diyCfg.helpCfg || {},
    custom.helpCfg,
    sysCfg.helpCfg
  )
  let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList
  let helpGroup = []
  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return true
    }
    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })
    helpGroup.push(group)
  })
  let themeData = await Theme.getThemeData(
    diyCfg.helpCfg || {},
    sysCfg.helpCfg || {}
  )
  return await render(
    'help/index',
    {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    },
    { e, scale: 1 }
  )
}

async function help1 (e) {
  let custom = {}
  let bqbhelp = {}
  let { diyCfg, sysCfg } = await Data.importCfg('help')
  custom = bqbhelp
  let helpConfig = lodash.defaults(
    diyCfg.bqbhelpCfg || {},
    custom.bqbhelpCfg,
    sysCfg.bqbhelpCfg
  )
  let helpList = diyCfg.bqbhelpList || custom.bqbhelpList || sysCfg.bqbhelpList
  let helpGroup = []
  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return true
    }
    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })
    helpGroup.push(group)
  })
  let themeData = await Theme.getThemeData(
    diyCfg.bqbhelpCfg || {},
    sysCfg.bqbhelpCfg || {}
  )
  return await render(
    'help/index',
    {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    },
    { e, scale: 1 }
  )
}
async function help2 (e) {
  let custom = {}
  let settinghelp = {}
  let { diyCfg, sysCfg } = await Data.importCfg('help')
  custom = settinghelp
  let helpConfig = lodash.defaults(
    diyCfg.settinghelpCfg || {},
    custom.settinghelpCfg,
    sysCfg.settinghelpCfg
  )
  let helpList =
    diyCfg.settinghelpList || custom.settinghelpList || sysCfg.settinghelpList
  let helpGroup = []
  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return true
    }
    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })
    helpGroup.push(group)
  })
  let themeData = await Theme.getThemeData(
    diyCfg.settinghelpCfg || {},
    sysCfg.settinghelpCfg || {}
  )
  return await render(
    'help/index',
    {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    },
    { e, scale: 1 }
  )
}
