import {Collection, ObjectId} from "mongodb";

import {getColl} from '../service/database';

const coll: Collection<User> = getColl('users')

type RoleType = 'manager' | 'applicant'

export interface User {
    _id?: ObjectId,
    userName?: string,
    passwd?: string,
    realName?: string,
    phone?: string,
    role?: RoleType
}

export async function getUserByID(userID: string) {
    const res = await coll.findOne({_id: userID})
    return res
}

export async function getUserByUname(userName: string) {
    const res = await coll.findOne({userName})
    return res
}

export async function createUser(user: User) {
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
