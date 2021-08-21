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
    gender?: number,
    email?: string,
    desc?: string,
    role?: RoleType
}

class userModel {
    static async getUserByID(_id: string) {
        const res = await coll.findOne({_id: new ObjectId(_id)})
        return res
    }

    static async getUserByUname(userName: string) {
        const res = await coll.findOne({userName})
        return res
    }

    static async createUser(user: User) {
        const res = await coll.insertOne(user)
        return res
    }

    static async updateUser(userId: string, $set?: Partial<User>, $unset?: Partial<User> | null) {
        const op: any = {};
        if ($set && Object.keys($set).length) op.$set = $set;
        if ($unset && Object.keys($unset).length) op.$unset = $unset;
        if (Object.getOwnPropertyNames(op).length === 0) return null;
        const res = await coll.findOneAndUpdate({_id: new ObjectId(userId)}, op, {returnDocument: "after"})
        return res
    }
}

export default userModel