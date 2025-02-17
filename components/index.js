import Version from './Version.js'
import Data from './Data.js'
import render from './renderer.js'
const _PATH = process.cwd().replace(/\\/g, '/')
const PluginName = 'Bxianx-plugin'
const PluginPath = `${_PATH}/plugins/${PluginName}`
export { render, Data, Version, _PATH, PluginName, PluginPath }
