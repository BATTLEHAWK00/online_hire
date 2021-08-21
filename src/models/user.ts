const {getColl} = require('../service/database')
const coll = getColl('users')

export async function getUserByID(userID: string) {
    const res = await coll.findOne({_id: userID})
    return res
}

export async function getUserByUname(userName: string) {
    const res = await coll.findOne({userName})
    return res
}

export async function createUser(user: { realName: any; role: string; passwd: any; phone: any; userName: any }) {
    // @ts-ignore
    if (await coll.findOne({userName: user['userName']}))
        return null
    const res = await coll.insertOne(user)
    return res
}

export default {
    getUserByID,
    getUserByUname,
    createUser
}
