import {MongoClient, Db, Collection} from 'mongodb';

let connection: MongoClient | null = null
let database: Db

// MongoDB Setup
export async function ConnectDB() {
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

export function getColl(coll: string) {
    return database.collection(coll)
}
