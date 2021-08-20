const {getColl} = require('../database')
const coll = getColl('users')

async function getUserByID(userID) {
    const res = await coll.findOne({_id: userID})
    return res
}

async function getUserByUname(userName) {
    const res = await coll.findOne({userName})
    return res
}

async function createUser(user) {
    if (await coll.findOne({userName: user['userName']}))
        return null
    const res = await coll.insertOne(user)
    return res
}

module.exports = {
    getUserByID,
    getUserByUname,
    createUser
}