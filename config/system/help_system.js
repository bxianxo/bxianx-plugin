/*
 * 此配置文件为系统使用，请勿修改，否则可能无法正常使用
 *
 * 如需自定义配置请复制修改上一级help_default.js
 *
 **/

export const helpCfg = {
  title: "不羡仙帮助",
  subTitle: "不羡仙 & Bxianx-Plugin",
  columnCount: 3,
  colWidth: 265,
  theme: "all",
  themeExclude: ["default"],
  style: {
    fontColor: "#ceb78b",
    descColor: "#eee",
    contBgColor: "rgba(6, 21, 31, .5)",
    contBgBlur: 3,
    headerBgColor: "rgba(6, 21, 31, .4)",
    rowBgColor1: "rgba(6, 21, 31, .2)",
    rowBgColor2: "rgba(6, 21, 31, .35)",
  },
  bgBlur: false,
};

export const helpList = [
  {
    group: "不羡仙娱乐功能【开发中】",
    list: [
      {
        icon: 32,
        title: "#疯狂星期四",
        desc: "输出一句疯狂星期四",
      },
      {
        icon: 39,
        title: "#随机表情包",
        desc: "获取表情包 详情请查看不羡仙表情包帮助",
      },
    ],
  },
  {
    group: "不羡仙查询功能【开发中】",
    list: [
      {
        icon: 132,
        title: "#谁艾特我",
        desc: "查看4天内的艾特你的人及其内容,不支持face表情",
      },
      {
        icon: 2,
        title: "#头像",
        desc: "获取群友的QQ头像 at就是拿群友的 不艾特就是自己的",
      },
      {
        icon: 3,
        title: "#群头像",
        desc: "获取QQ群头像",
      },
      {
        icon: 3,
        title: "#广播通知",
        desc: "发送所有群聊，可加黑白名单",
      },
      {
        icon: 25,
        title: "#网页截图",
        desc: "网页截图 在命令后加网址",
      },
    ],
  },
  {
    group: "不羡仙工具帮助【开发中】",
    list: [
      {
        icon: 26,
        title: "QQ群：456419844",
        desc: "提交pr或进群反馈",
      },
    ],
  },
  {
    group: "不羡仙仅BOT主可用",
    list: [
      {
        icon: 211,
        title: "#不羡仙表情包帮助",
        desc: "表情包帮助",
      },
      {
        icon: 66,
        title: "#不羡仙设置帮助",
        desc: "设置帮助",
      },
      {
        icon: 67,
        title: "#不羡仙插件更新",
        desc: "更新插件",
      },
    ],
  },
];

export const bqbhelpCfg = {
  title: "表情包帮助",
  subTitle: "不羡仙 & Bxianx-Plugin",
  columnCount: 3,
  colWidth: 265,
  theme: "all",
  themeExclude: ["default"],
  style: {
    fontColor: "#ceb78b",
    descColor: "#eee",
    contBgColor: "rgba(6, 21, 31, .5)",
    contBgBlur: 3,
    headerBgColor: "rgba(6, 21, 31, .4)",
    rowBgColor1: "rgba(6, 21, 31, .2)",
    rowBgColor2: "rgba(6, 21, 31, .35)",
  },
  bgBlur: false,
};

export const bqbhelpList = [
  {
    group: "可不加#前缀 - 动漫角色表情包",
    list: [
      {
        icon: 79,
        title: "#随机猫羽雫(甘城猫猫)表情包",
        desc: "来点Nacho！",
      },
      {
        icon: 42,
        title: "#随机fufu表情包",
        desc: "你就是歌姬吧！",
      },
      {
        icon: 19,
        title: "#随机丛雨表情包",
        desc: "Ciallo～(∠・ω< )⌒☆",
      },
      {
        icon: 131,
        title: "#随机心海表情包",
        desc: "诶嘿嘿心海~",
      },
      {
        icon: 101,
        title: "#随机柴郡表情包",
        desc: "搞什么啊我只是猫咪",
      },
      {
        icon: 56,
        title: "#随机满穗表情包",
        desc: "参见万穗爷",
      },
      {
        icon: 90,
        title: "#随机纳西妲表情包",
        desc: "分享智慧",
      },
    ],
  },
  {
    group: "可不加#前缀 - 其他类型表情包",
    list: [
      {
        icon: 8,
        title: "#随机龙图表情包",
        desc: "攻击性有待提高",
      },
      {
        icon: 318,
        title: "#随机小南梁表情包",
        desc: "被小南梁害惨了",
      },
      {
        icon: 345,
        title: "#随机千恋万花表情包",
        desc: "柚子厨蒸鹅心",
      },
      {
        icon: 294,
        title: "#随机古拉表情包",
        desc: "来点gura！",
      },
      {
        icon: 296,
        title: "#随机猫猫虫表情包",
        desc: "咖波",
      },
      {
        icon: 324,
        title: "#随机诗歌剧表情包",
        desc: "曼波！",
      },
      {
        icon: 321,
        title: "#随机kemomimi表情包",
        desc: "兽耳酱",
      },
      {
        icon: 312,
        title: "#随机表情包",
        desc: "随机输出一张表情包",
      },
    ],
  },
];

export const settinghelpCfg = {
  title: "设置帮助-已适配锅巴",
  subTitle: "Yunzai-Bot & Bxianx-Plugin",
  columnCount: 3,
  colWidth: 265,
  theme: "all",
  themeExclude: ["default"],
  style: {
    fontColor: "#ceb78b",
    descColor: "#eee",
    contBgColor: "rgba(6, 21, 31, .5)",
    contBgBlur: 3,
    headerBgColor: "rgba(6, 21, 31, .4)",
    rowBgColor1: "rgba(6, 21, 31, .2)",
    rowBgColor2: "rgba(6, 21, 31, .35)",
  },
  bgBlur: false,
};

export const settinghelpList = [
  {
    group: "可不加#前缀 - 功能开关设置",
    list: [
      {
        icon: 8,
        title: "#不羡仙设置更新推送开启/关闭",
        desc: "开启/关闭更新推送 默认开启",
      },
      {
        icon: 55,
        title: "#不羡仙设置疯狂星期四开启/关闭",
        desc: "开启/关闭疯狂星期四 默认开启",
      },
      {
        icon: 28,
        title: "#不羡仙设置随机表情包开启/关闭",
        desc: "开启/关闭随机表情包 默认开启",
      },
    ],
  },
  {
    group: "可不加#前缀 - 头像相关设置",
    list: [
      {
        icon: 158,
        title: "#不羡仙设置头像开启/关闭",
        desc: "开启/关闭头像 默认开启",
      },
      {
        icon: 168,
        title: "#不羡仙设置群头像开启/关闭",
        desc: "开启/关闭群头像 默认开启",
      },
    ],
  },
  {
    group: "可不加#前缀 - 图片功能设置",
    list: [
      {
        icon: 178,
        title: "#不羡仙设置举牌开启/关闭",
        desc: "开启/关闭举牌 默认开启",
      },
      {
        icon: 185,
        title: "#不羡仙设置网页截图开启/关闭",
        desc: "开启/关闭网页截图 默认开启",
      },
    ],
  },
];

export const isSys = true;
