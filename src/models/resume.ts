import {ObjectId} from "mongodb";

export interface Resume {
    _id: ObjectId,
    uid: string,
    submitTime: Date,
    intention: string,
    resumeFile: string
}

export async function getResumeByID(rid: string) {

}

export async function createResume(resume: Resume) {

}

export async function getResumeByUID(uid: string) {

}