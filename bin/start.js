const database = require('../src/service/database');
const { server } = require('../src/service/server');
const fileStorage = require('../src/service/fileStorage');
require('../src/lib/configProvider');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

async function Init() {
  console.log(`Using ${process.env.NODE_ENV} config.`);
  await Promise.all([
    // 初始化数据库
    database.ConnectDB(),
    // 初始化文件存储服务
    fileStorage.Init(),
  ]);
  // Express初始化
  const { app } = require('../src/service/express');
  // 开启服务器
  await server.Start(app);
}

// noinspection JSIgnoredPromiseFromCall
Init();
