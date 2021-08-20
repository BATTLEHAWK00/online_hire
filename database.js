const MongoClient = require('mongodb').MongoClient;
let connection = null
let database = null

// MongoDB Setup
async function ConnectDB() {
    try {
        connection = await MongoClient.connect("mongodb://localhost:27017/online_hire");
        database = connection.db()
        console.log('DB Connected')
    } catch (err) {
        console.log(err)
    }
}

function getColl(coll) {
    return database.collection(coll)
}

module.exports = {
    ConnectDB,
    getColl
}