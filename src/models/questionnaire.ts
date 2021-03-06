import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

export interface Questionnaire {
  _id?: ObjectId;
  name?: string;
  desc?: string;
  createTime?: Date;
  updateTime?: Date;
  createBy?: string;
  content?: string[];
  hidden?: boolean;
  deleted?: boolean;
}

const coll: Collection<Questionnaire> = getColl('questionnaire');

class questionnaireModel {
  static async getByID(_id: string) {
    return coll.findOne({
      _id: new ObjectId(_id),
      deleted: { $ne: true },
    });
  }

  static async getQuestionnaireList() {
    return coll.find({ deleted: { $ne: true } }).toArray();
  }

  static async updateQuestionnaire(
    _id: string,
    $set: Partial<Questionnaire>,
    $unset?: Partial<Questionnaire> | null
  ) {
    const op: any = {};
    if ($set && Object.keys($set).length) op.$set = $set;
    if ($unset && Object.keys($unset).length) op.$unset = $unset;
    if (Object.getOwnPropertyNames(op).length === 0) return null;
    return coll.findOneAndUpdate({ _id: new ObjectId(_id) }, op, {
      returnDocument: 'after',
    });
  }

  static async createQuestionnaire(questionnaire: Questionnaire) {
    if (!questionnaire.createTime) {
      const now = new Date(Date.now());
      questionnaire.createTime = now;
      questionnaire.updateTime = now;
    }
    return coll.insertOne(questionnaire);
  }

  static async deleteQuestionnaire(_id: string) {
    await coll.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { deleted: true } }
    );
  }
}

export default questionnaireModel;
