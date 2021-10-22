import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

export type RoleType = 'manager' | 'applicant' | 'admin';

export interface User {
  _id?: ObjectId;
  userName?: string;
  passwd?: string;
  salt?: string;
  realName?: string;
  phone?: string;
  gender?: number;
  email?: string;
  desc?: string;
  role?: RoleType;
}

const coll: Collection<User> = getColl('users');

class userModel {
  static async getUserByID(_id: string) {
    return coll.findOne({ _id: new ObjectId(_id) });
  }

  static async getAdminList() {
    return coll.find({ role: 'admin' }).toArray();
  }

  static async getUserByUname(userName: string) {
    return coll.findOne({ userName });
  }

  static async createUser(user: User) {
    return coll.insertOne(user);
  }

  static async updateUser(
    userId: string,
    $set?: Partial<User>,
    $unset?: Partial<User> | null
  ) {
    const op: any = {};
    if ($set && Object.keys($set).length) op.$set = $set;
    if ($unset && Object.keys($unset).length) op.$unset = $unset;
    if (Object.getOwnPropertyNames(op).length === 0) return null;
    return coll.findOneAndUpdate({ _id: new ObjectId(userId) }, op, {
      returnDocument: 'after',
    });
  }
}

export default userModel;
