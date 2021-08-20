const {ConnectDB} = require('./database')

async function init() {
    await ConnectDB()
    const app = require('./express')
    return app
}

module.exports = {
    init
}