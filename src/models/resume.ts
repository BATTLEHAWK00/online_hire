import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

export type ResumeStatus =
  | 'New'
  | 'RequireExam'
  | 'Checking'
  | 'Failed'
  | 'Success';

export interface Resume {
  _id?: ObjectId;
  uid?: string;
  submitTime?: Date;
  intention?: string;
  desc?: string;
  status?: ResumeStatus;
  resumeFiles?: {
    filePath: string;
    contentType: string;
    size: number;
  }[];
}

const coll: Collection<Resume> = getColl('resumes');

class resumesModel {
  static async getResumeByID(_id: string) {
    return coll.findOne({ _id: new ObjectId(_id) });
  }

  static async createResume(resume: Resume) {
    resume.submitTime = new Date(Date.now());
    await coll.insertOne(resume);
  }

  static async getResumesByUID(uid: string) {
    const rList = await coll.find({ uid }).toArray();
    return rList;
  }
}

export default resumesModel;
