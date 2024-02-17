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
    curriculums: (ILecture | IQuiz)[]
}

export interface ICurriculum {
    id?: number
    title: string
    number: number
    index?: number
}
export interface ILecture extends ICurriculum {
    type: "lecture"
    videoId?: string
    lectureDetails?: string
    duration?: number
}

export interface IQuiz extends ICurriculum {
    type: "quiz"
    description: string
    questions?: Question[]
}

export type Question = {
    id?: number
    title: string
    answers: AnswerType[]
}
export type AnswerType = {
    id?: number
    answerText: string
    reason?: string
    correct: boolean
}
