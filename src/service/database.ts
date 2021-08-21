const {application} = require("express");
const MongoClient = require('mongodb').MongoClient;
let connection = null
let database: { collection: (arg0: any) => any; } | null = null

// MongoDB Setup
async function ConnectDB() {
    try {
        console.log('Connecting to database...')
        connection = await MongoClient.connect("mongodb://localhost:27017/online_hire");
        database = connection.db()
        console.log('Database Connected.')
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

function getColl(coll: any) {
    // @ts-ignore
    return database.collection(coll)
}

module.exports = {
    ConnectDB,
    getColl
}