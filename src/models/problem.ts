import {Collection, ObjectId} from "mongodb";
import {getColl} from '../service/database';

const coll: Collection<Problem> = getColl('problem')

type ProblemType = SingleChoice | MultipleChoice | ShortAnswer

export interface Problem {
    _id?: ObjectId,
    name?: string,
    createTime?: Date,
    updateTime?: Date,
    createBy?: string,
    content?: ProblemType,
    hidden?: boolean,
    deleted?: boolean,
}

export interface SingleChoice {
    question: string,
    selections: string[],
    answer: number
}

export interface MultipleChoice {
    question: string,
    selections: string[],
    answers: number[]
}

export interface ShortAnswer {
    question: string,
    answer: string
}

class problemModel {
    async getByID(_id: string) {
        const problem = await coll.findOne({_id: new ObjectId(_id)})
        return problem
    }
}

export default problemModel