import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

const coll: Collection<Questionnaire> = getColl('questionnaire');

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

class questionnaireModel {
  static async getByID(_id: string) {
    const questionnaire = await coll.findOne({
      _id: new ObjectId(_id),
      deleted: { $ne: true },
    });
    return questionnaire;
  }

  static async getQuestionnaireList() {
    const qList = await coll.find({ deleted: { $ne: true } }).toArray();
    return qList;
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
    const res = await coll.findOneAndUpdate({ _id: new ObjectId(_id) }, op, {
      returnDocument: 'after',
    });
    return res;
  }

  static async createQuestionnaire(questionnaire: Questionnaire) {
    if (!questionnaire.createTime) {
      const now = new Date(Date.now());
      questionnaire.createTime = now;
      questionnaire.updateTime = now;
    }
    const res = await coll.insertOne(questionnaire);
    return res;
  }

  static async deleteQuestionnaire(_id: string) {
    await coll.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { deleted: true } }
    );
  }
}

export default questionnaireModel;
