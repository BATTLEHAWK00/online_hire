const database = require('../src/service/database')
const {server} = require('../src/service/server')
const fileStorage = require('../src/service/fileStorage')
const configProvider = require("../src/lib/configProvider");

async function Init() {
    //读取配置文件
    configProvider.Init()
    await Promise.all([
        //初始化数据库
        database.ConnectDB(),
        //初始化文件存储服务
        fileStorage.Init()
    ])
    //Express初始化
    const {app} = require("../src/service/express")
    //开启服务器
    await server.Start(app)
}

const openDefaultBrowser = function (url) {
    const exec = require('child_process').exec;
    switch (process.platform) {
        case "darwin":
            exec('open ' + url);
            break;
        case "win32":
            exec('start ' + url);
            break;
        default:
            exec('xdg-open', [url]);
    }
}

Init().then(r => {
    // openDefaultBrowser(`http://localhost:${configProvider.default.getGlobalConfig().server.port}`)
})