import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

export interface SingleChoice {
  options?: string[];
  answer?: number;
}

export interface MultipleChoice {
  options?: string[];
  answers?: number[];
}

export interface ShortAnswer {
  answer?: string;
}

type ProblemType = SingleChoice | MultipleChoice | ShortAnswer;
type ProblemTypeStr = 'SingleChoice' | 'MultipleChoice' | 'ShortAnswer';

export interface Problem {
  _id?: ObjectId;
  name?: string;
  type?: ProblemTypeStr;
  desc?: string;
  createTime?: Date;
  updateTime?: Date;
  createBy?: string;
  content?: ProblemType;
  hidden?: boolean;
  deleted?: boolean;
}

const coll: Collection<Problem> = getColl('problems');

class problemModel {
  static async getByID(_id: string) {
    const problem = await coll.findOne({
      _id: new ObjectId(_id),
      deleted: { $ne: true },
    });
    return problem;
  }

  static async getProblemList() {
    const problems = await coll.find({ deleted: { $ne: true } }).toArray();
    return problems;
  }

  static async updateProblem(
    _id: string,
    $set: Partial<Problem>,
    $unset?: Partial<Problem> | null
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

  static async createProblem(problem: Problem) {
    if (!problem.createTime) {
      const now = new Date(Date.now());
      problem.createTime = now;
      problem.updateTime = now;
    }
    const res = await coll.insertOne(problem);
    return res;
  }

  static async deleteProblem(_id: string) {
    await coll.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { deleted: true } }
    );
  }
}

export default problemModel;
