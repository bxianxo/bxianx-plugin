import fs from 'fs';
import { PluginPath } from '../components/index.js';
import YAML from 'yaml';
import plugin from '../../../lib/plugins/plugin.js';
import common from '../../../lib/common/common.js';
import Bot from '../../../lib/bot.js';

// 定义 logger 对象
const logger = console;

// 解析配置文件
let CONFIG_YAML = YAML.parse(
    fs.readFileSync(`${PluginPath}/config/config.yaml`, 'utf8')
);

// 广播消息是否开启延迟 (默认为5秒)
let delays = true;
// 发送消息延迟 (开启延迟后生效)
let Nnumber = 5000;
// 广播消息是否开启随机延迟 (需开启延迟后再开启随机延迟，默认在4到6秒内随机发送消息)
let random_delays = true;

export class example2 extends plugin {
    constructor() {
        super({
            name: '广播通知',
            dsc: '[@不羡仙]广播通知',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '^#(白名单|黑名单)?广播通知$',
                    fnc: 'broadcast'
                }
            ]
        });
    }

    async broadcast(e) {
        // 检查广播通知开关是否开启
        if (!CONFIG_YAML.gbtz) {
            return logger.info('[Bxianx插件]广播通知已关闭');
        }
        if (!e.isMaster) return true;
        await e.reply(`请发送你要广播的内容`);
        this.setContext('broadcast_');
    }

    async broadcast_(e) {
        this.finish('broadcast_');
        let msg = e.msg.match(/^#(白名单|黑名单)?广播通知$/);
        console.log(e.msg);
        const filePath = '../../../config/config/other.yaml';
        console.log('尝试读取的文件路径:', filePath);
        try {
            let otheryaml = await fs.promises.readFile(filePath, 'utf-8');
            let other = YAML.parse(otheryaml);
            if (!msg[1]) {
                let all_group = Array.from(Bot[e.self_id].gl.values());
                let all_groupid = [];
                for (let item of all_group) {
                    all_groupid.push(item.group_id);
                }
                await 发送消息(all_groupid, e.message, e);
                e.reply(`广播已完成`);
                return true;
            } else if (msg[1] === `白名单`) {
                if (other.whiteGroup.length === 0) {
                    e.reply(`白名单为空，广播失败`);
                    return true;
                }
                await 发送消息(other.whiteGroup, e.message, e);
                e.reply(`广播已完成`);
                return true;
            } else if (msg[1] === `黑名单`) {
                if (other.blackGroup.length === 0) {
                    e.reply(`黑名单为空，广播失败`);
                    return true;
                }
                await 发送消息(other.blackGroup, e.message, e);
                e.reply(`广播已完成`);
                return true;
            }
        } catch (error) {
            console.error('读取文件时出错:', error);
            e.reply('读取配置文件时出错，请检查配置文件路径。');
            return true;
        }
    }
}

async function 发送消息(group, message, e) {
    let groupNumber = group.length;
    for (let item of group) {
        groupNumber--;
        let number = 0;
        if (delays) {
            number = Nnumber;
        }
        if (delays && random_delays) {
            number = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000;
        }
        await Bot[e.self_id].pickGroup(item).sendMsg(message)
           .then(() => e.reply(`群${item}消息已送达，等待${number}毫秒后广播下一个群\n剩余${groupNumber}个群`))
           .catch((err) => e.reply(`群${item}消息发送失败，等待${number}毫秒后广播下一个群\n剩余${groupNumber}个群\n错误码:${err.code}\n错误信息:${err.message}`));
        await common.sleep(number);
    }
    return `OK`;
}
