import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

const coll: Collection<Position> = getColl('positions');

export interface Position {
  _id?: ObjectId;
  name?: string;
  deleted?: boolean;
}

class positionModel {
  static async addPosition(position: Position) {
    const res = await coll.insertOne(position);
    return res;
  }

  static async getPositionByID(_id: string) {
    const res = await coll.findOne({
      _id: new ObjectId(_id),
      deleted: { $ne: true },
    });
    return res;
  }

  static async getPositionByName(name: string) {
    const res = await coll.findOne({ name, deleted: { $ne: true } });
    return res;
  }

  static async getPositionList() {
    const res = await coll.find({ deleted: { $ne: true } }).toArray();
    return res;
  }

  static async deletePosition(_id: string) {
    const res = await coll.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { deleted: true } }
    );
    return res;
  }
}

export default positionModel;
