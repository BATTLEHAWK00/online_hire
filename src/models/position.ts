import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

export interface Position {
  _id?: ObjectId;
  name?: string;
  deleted?: boolean;
}

const coll: Collection<Position> = getColl('positions');

class positionModel {
  static async addPosition(position: Position) {
    return coll.insertOne(position);
  }

  static async getPositionByID(_id: string) {
    return coll.findOne({
      _id: new ObjectId(_id),
      deleted: { $ne: true },
    });
  }

  static async getPositionByName(name: string) {
    return coll.findOne({ name, deleted: { $ne: true } });
  }

  static async getPositionList() {
    return coll.find({ deleted: { $ne: true } }).toArray();
  }

  static async deletePosition(_id: string) {
    return coll.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { deleted: true } }
    );
  }
}

export default positionModel;
