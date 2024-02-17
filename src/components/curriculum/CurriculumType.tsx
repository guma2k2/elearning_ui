import { ILecture, IQuiz } from "../../types/CourseType"

export type CurriculumType = {
    curriculum: ILecture | IQuiz
    sectionId: number
    prevNum?: number
    nextNum?: number
}