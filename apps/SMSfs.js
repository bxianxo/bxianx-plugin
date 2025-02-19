import fs from 'fs';
import { PluginPath } from '../components/index.js';
import YAML from 'yaml';
import * as path from 'path';
import http from 'http';
import { Client } from 'icqq';
import { fileURLToPath } from 'url';

// 获取当前模块的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置文件路径常量
// 修正 other.yaml 文件的路径
const OTHER_YAML_PATH = path.join(__dirname, '../../../config/config/other.yaml');
const SMSZR_YAML_PATH = path.join(__dirname, '../config/SMS/SMSzr.js');
const SMS_CONFIG_YAML_PATH = path.join(__dirname, '../config/SMS/SMS.js');

// 读取配置文件的通用函数
async function readYamlFile(filePath) {
    try {
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        return YAML.parse(fileContent);
    } catch (error) {
        console.error(`读取或解析 ${filePath} 文件时出错:`, error);
        return null; // 这里返回 null 避免抛出错误中断程序
    }
}

// 读取 other.yaml 文件中的 masterQQ 值
async function readMasterQQFromYaml() {
    const yamlData = await readYamlFile(OTHER_YAML_PATH);
    return yamlData ? yamlData.masterQQ : null;
}

// 读取 SMSzr.yaml 文件中的短信主人 QQ 号
async function readSmsZrMasterQQ() {
    const yamlData = await readYamlFile(SMSZR_YAML_PATH);
    return yamlData ? yamlData.SMSzr : null;
}

// 读取短信接口配置信息
async function readSmsConfigFromYaml() {
    return await readYamlFile(SMS_CONFIG_YAML_PATH);
}


// 定义发送短信的函数
async function sendSms(config) {
    const apiUrl = 'http://sms.zovps.com/sendApi?';
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

    return new Promise((resolve, reject) => {
        const req = http.request(fullUrl, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data); // 尝试解析响应数据
                    console.log('短信发送响应:', parsedData);
                    resolve(parsedData);
                } catch (parseError) {
                    console.error('解析短信发送响应时出错:', parseError);
                    reject(parseError);
                }
            });
        }).on('error', (error) => {
            console.error('发送短信时网络出错:', error);
            reject(error);
        });

        req.end();
    });
}

// 监听群消息事件的启动函数
async function startListening() {
    try {
        // 读取配置信息
        const masterQQ = await readMasterQQFromYaml();
        const smsZrMasterQQ = await readSmsZrMasterQQ();
        const smsConfig = await readSmsConfigFromYaml();

        client.on('message.group', async (event) => {
            const senderQQ = event.sender.user_id.toString();

            // 检查发送者 QQ 是否同时存在于 masterQQ 和 SMSzr 中
            const isMasterInBoth = masterQQ && smsZrMasterQQ &&
                (Array.isArray(masterQQ) ? masterQQ.includes(senderQQ) : masterQQ === senderQQ) &&
                smsZrMasterQQ === senderQQ;

            if (isMasterInBoth) {
                console.log('发送者同时满足条件，开始执行后续代码');
                const message = event.raw_message;
                const commandRegex = /#短信发送(\d{11})/;
                const match = message.match(commandRegex);

                if (match) {
                    const userProvidedPhone = match[1];
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
                    await event.reply('请使用正确的格式 #短信发送手机号 来发送短信');
                }
            } else {
                console.log('发送者不满足条件，操作被拒绝');
                await event.reply('您不满足发送短信的条件');
            }
        });
    } catch (error) {
        console.error('初始化监听时出错:', error);
    }
}

// 启动监听
startListening();
