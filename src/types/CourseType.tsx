import { UserProfile } from "./UserType"

export type CourseType = {
    id: number
    title: string
    topicId: number
    categoryId: number
    level?: string
    headline?: string
    objectives?: string[]
    requirements?: string[]
    targetAudiences?: string[]
    description?: string
    imageURL?: string
    image?: string
    createdAt?: string
    updatedAt?: string
    free?: boolean
    isPublish?: boolean,
    status?: string,
    price: number,
    ratingCount: number,
    averageRating: number,
    totalLectureCourse: number,
    totalDurationCourse: string,
    createdBy: string,
    sections: SectionType[],
    user?: UserProfile,
    learning?: boolean,
    slug: string,
    breadcrumb: string,
    discountedPrice: number,
    reason?: string
}

export type CourseStatusPostType = {
    status: string,
    reason?: string
}

export type CourseGetType = {
    id: number,
    title: string,
    free: boolean,
    image: string,
    price: number,
    discountedPrice: number
}

export type CourseListGetType = {
    id?: number
    title: string
    level?: string
    headline?: string
    slug: string
    image?: string
    isPublish?: boolean
    free?: boolean
    price: number
    totalDurationCourse: string
    totalLectures: number
    averageRating: number
    ratingCount: number
    createdBy: string
    discountedPrice: number
}

export type CourseAssignPromotion = {
    id: number,
    title: string,
    assigned: boolean
}

export type SectionType = {
    id: number
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
    updatedAt: string
    finished: boolean
}
export interface ILecture extends ICurriculum {
    type: "lecture"
    videoId?: string
    lectureDetails?: string
    duration?: number
    formattedDuration: string,
    watchingSecond: number
}

export interface IQuiz extends ICurriculum {
    type: "quiz"
    description: string
    questions?: QuestionType[]
}

export type QuestionType = {
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
