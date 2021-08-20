const database = require('../src/service/database')
const server = require('../src/service/server')

async function Init() {
    await database.ConnectDB()
    const app = require("../src/service/express")
    await server.Start(app)
}

Init()