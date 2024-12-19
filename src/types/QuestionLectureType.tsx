import { AuthType } from "./AuthType"
import { StudentGetType } from "./StudentType"

export type QuestionLectureType = {
    id: number,
    title: string,
    description: string,
    student: StudentGetType,
    lecture: LectureGetType,
    createdAt: string,
    updatedAt: string,
    answers: AnswerLectureType[]
}

export type AnswerLectureType = {
    id: number,
    content: string,
    user: AuthType,
    createdAt: string,
    updatedAt: string
}
export type LectureGetType = {
    id: number,
    title: string,
    sectionId: number
}

export type QuestionLecturePostType = {
    id?: number
    title: string,
    description: string,
    lectureId: number
}

export type AnswerLecturePostType = {
    id?: number,
    content: string,
    questionLectureId: number
}