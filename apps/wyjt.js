import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import YAML from 'yaml'
import fs from 'fs'
import { PluginPath } from '../components/index.js'

let CONFIG_YAML = YAML.parse(
  fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
)

export class Example extends plugin {
  constructor () {
    super({
      name: '[bxx]网页截图预览',
      priority: 5000,
      rule: [
        {
          reg: '网页截图(.*)',
          fnc: 'autoScreenshot'
        }
      ]
    })
  }

  async autoScreenshot (e) {
    if (!CONFIG_YAML.wyjt) {
      return logger.info('[Bxianx插件]网页截图已关闭')
    }
    const url = this.extractUrl(e.msg)
    return url ? this.processUrl(url, e) : false
  }

  extractUrl (message) {
    const urlPattern = /https?:\/\/[^\s]+/
    const match = message.match(urlPattern)
    if (match) return this.ensureHttpScheme(match[0])

    const simpleUrlPattern = /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s]*)?/
    const simpleMatch = message.match(simpleUrlPattern)
    return simpleMatch ? this.ensureHttpScheme(simpleMatch[0]) : ''
  }

  ensureHttpScheme (url) {
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `http://${url}`
  }

  async processUrl (url, e) {
    const blockedPrefixes = [
      'http://tencent',
      'http://com.tencent',
      'https://tencent',
      'https://com.tencent'
    ]
    if (blockedPrefixes.some((prefix) => url.startsWith(prefix))) return

    await e.reply('正在等待网页响应，响应后将开始截图，请稍候', false)
    if (url.includes('gchat.qpic.cn')) {
      await e.reply(segment.image(url), true)
    } else {
      await this.captureScreenshot(e, url)
    }
  }

  async captureScreenshot (e, url) {
    try {
      if (!puppeteer.browser) {
        await puppeteer.browserInit()
      }
      const page = await puppeteer.browser.newPage()

      await page.setViewport({ width: 1920, height: 1080 })

      await page.goto(url, { waitUntil: 'load' })

      const screenshotBase64 = await page.screenshot({
        fullPage: true,
        type: 'jpeg',
        quality: 100,
        encoding: 'base64'
      })

      await page.close()
      await e.reply(segment.image(`base64://${screenshotBase64}`), true)
    } catch (error) {
      await e.reply(`[Bxianx-plugin] 网页截图失败: ${error.message}`, true)
    }
  }
}
