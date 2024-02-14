export type CourseType = {
    id?: number
    title: string
    topicId: number
    categoryId: number
    headline?: string
    objectives?: string[]
    requirement?: string[]
    targetAudiences?: string[]
    description?: string
    imageURL?: string
    createdAt?: string
    updatedAt?: string
    free?: boolean
    isPublish?: boolean
    sections: SectionType[]
}

export type SectionType = {
    id?: number
    title: string
    number: number
    objective: string
    curriculums: ICurriculum[]
}

export interface ICurriculum {
    id?: number
    title: string
    number: number
    index?: number
    type: "lecture" | "quiz"
}
export interface ILecture extends ICurriculum {
    videoId: string
    lectureDetails: string
    duration: number
}

export interface IQuiz extends ICurriculum {
    description: string
    questions: Question[]
}

type Question = {
    id?: number
    title: string
    answers: Answer[]
}
type Answer = {
    id?: number
    answerText: string
    reason: string
    correct: boolean
}
