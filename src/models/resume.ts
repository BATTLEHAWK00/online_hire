import { Collection, ObjectId } from 'mongodb';
import { getColl } from '../service/database';

export type ResumeStatus =
  | 'New'
  | 'RequireExam'
  | 'Checking'
  | 'Failed'
  | 'Success';

type ResumeInfoType = 'text' | 'number' | 'date' | 'select';

export interface ResumeInfo {
  [key: string]: {
    type?: ResumeInfoType;
    value?: string;
  };
}

export interface Resume {
  _id?: ObjectId;
  uid?: string;
  submitTime?: Date;
  intention?: string;
  desc?: string;
  status?: ResumeStatus;
  grades?: number;
  infos?: ResumeInfo;
  resumeFiles?: {
    filePath: string;
    contentType: string;
    size: number;
  }[];
}

const coll: Collection<Resume> = getColl('resumes');

class resumesModel {
  static async getResumeList() {
    return coll.find().toArray();
  }

  static async getResumeByID(_id: string) {
    return coll.findOne({ _id: new ObjectId(_id) });
  }

  static async createResume(resume: Resume) {
    resume.submitTime = new Date(Date.now());
    await coll.insertOne(resume);
  }

  static async getResumesByUID(uid: string) {
    return coll.find({ uid }).sort({ _id: -1 }).toArray();
  }
}

export default resumesModel;
