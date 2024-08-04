import { QuestionType } from "./CourseType"

export type QuizPost = {
    id?: number
    title: string
    number: number
    description?: string
    sectionId: number
    questions?: QuestionType[]
}