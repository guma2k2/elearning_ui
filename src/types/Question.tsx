import { AnswerType } from "./CourseType"

export type QuestionPost = {
    id?: number
    title: string
    quizId?: number
    answers: AnswerType[]
}