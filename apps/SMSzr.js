import fetch from 'node-fetch';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PluginPath } from '../components/index.js';
import YAML from 'yaml';
import { Client } from 'icqq';

// 模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 YAML 文件的通用函数
async function readYamlFile(filePath) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        return YAML.parse(fileContent);
    } catch (error) {
        console.error(`读取或解析 ${filePath} 文件时出错:`, error);
        return null;
    }
}

// 写入 YAML 文件的通用函数
async function writeYamlFile(filePath, data) {
    try {
        const newYamlContent = YAML.stringify(data);
        await fs.writeFile(filePath, newYamlContent, 'utf8');
        console.log(`${filePath} 文件已更新`);
        return true;
    } catch (error) {
        console.error(`更新 ${filePath} 文件时出错:`, error);
        return false;
    }
}

let CONFIG_YAML = await readYamlFile(join(PluginPath, 'config', 'config.yaml'));

// 创建 icqq 客户端实例
const client = new Client();

// 读取 other.yaml 文件中的 masterQQ 值
async function readMasterQQFromYaml() {
    // 假设当前脚本在 Yunzai/plugins/Bxianx-plugin/apps 目录下
    // 计算 other.yaml 文件的正确路径
    const yamlFilePath = join(__dirname, '../../../config/config/other.yaml');
    const yamlData = await readYamlFile(yamlFilePath);
    return yamlData ? yamlData.masterQQ : null;
}

// 读取 SMSzr.yaml 文件中的短信主人 QQ 号
async function readSmsZrMasterQQ() {
    const yamlFilePath = join(__dirname, '../config/SMS/SMSzr.js');
    const yamlData = await readYamlFile(yamlFilePath);
    return yamlData ? yamlData.SMSzr : null;
}

// 读取短信接口配置信息
async function readSmsConfigFromYaml() {
    const yamlFilePath = join(__dirname, '../config/SMS/SMS.js');
    return await readYamlFile(yamlFilePath);
}

// 更新 SMS.yaml 文件中的短信配置信息
async function updateSmsConfigInYaml(channel, username, key, sign, content) {
    const yamlFilePath = join(__dirname, '../config/SMS/SMS.js');
    const yamlData = {
        channel,
        username,
        key,
        sign,
        content
    };
    return await writeYamlFile(yamlFilePath, yamlData);
}

// 读取 masterQQ 值
const masterQQ = await readMasterQQFromYaml();
// 读取短信主人 QQ 号
const smsZrMasterQQ = await readSmsZrMasterQQ();
// 读取短信接口配置信息
const smsConfig = await readSmsConfigFromYaml();

// 监听群消息事件
client.on('message.group', async (event) => {
    const senderQQ = event.sender.user_id.toString();
    const message = event.raw_message;

    // 检查发送者是否为主人
    const isMaster = senderQQ === smsZrMasterQQ;

    // 检查是否为设置短信配置的指令
    const setConfigRegex = /#短信设置(.*)/;
    const setConfigMatch = message.match(setConfigRegex);

    if (setConfigMatch) {
        if (isMaster) {
            const [channel, username, key, sign, content] = setConfigMatch[1].split(':');
            if (channel && username && key && sign && content) {
                const updated = await updateSmsConfigInYaml(channel, username, key, sign, content);
                if (updated) {
                    await event.reply('短信配置信息已成功更新');
                } else {
                    await event.reply('更新短信配置信息时出错，请稍后再试');
                }
            } else {
                await event.reply('请使用正确的格式 #短信设置通道:用户名:密钥:签名:短信模板 进行设置');
            }
        } else {
            await event.reply('您不是短信主人，没有权限进行设置');
        }
        return;
    }

    // 检查是否为发送短信的指令
    const sendSmsRegex = /#短信发送(\d{11})/;
    const sendSmsMatch = message.match(sendSmsRegex);

    if (sendSmsMatch) {
        if (isMaster) {
            const userProvidedPhone = sendSmsMatch[1];
            if (smsConfig) {
                try {
                    // 调用发送短信的函数，传入用户提供的手机号
                    await sendSms({
                        channel: smsConfig.channel,
                        username: smsConfig.username,
                        key: smsConfig.key,
                        sign: smsConfig.sign,
                        content: smsConfig.content,
                        phone: userProvidedPhone
                    });
                    await event.reply('短信已尝试发送');
                } catch (smsError) {
                    console.error('发送短信时出错:', smsError);
                    await event.reply('发送短信失败');
                }
            } else {
                console.error('未获取到有效的短信接口配置信息');
                await event.reply('短信发送配置信息缺失');
            }
        } else {
            await event.reply('您不是短信主人，没有权限发送短信');
        }
    } else {
        await event.reply('请使用正确的指令格式或没配置，可发送 #短信发送手机号 或 #短信设置通道:用户名:密钥:签名:短信模板');
    }
});

// 定义发送短信的函数
async function sendSms(config) {
    const apiUrl = 'https://sms.zovps.com/sendApi?';
    const signWithBrackets = `【${config.sign}】`;
    const contentWithSign = `${signWithBrackets}${config.content}`;

    const params = {
        channel: config.channel,
        username: config.username,
        key: config.key,
        phone: config.phone,
        content: contentWithSign
    };

    const fullUrl = apiUrl + new URLSearchParams(params).toString();
    // 使用 node-fetch 发送 GET 请求
    const response = await fetch(fullUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('短信发送响应:', data);
    return data;
}