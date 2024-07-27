import { CourseGetType } from "./CourseType"
import { StudentGetType } from "./StudentType"

export type ReviewPost = {
    courseId: number
    content: string
    ratingStar: number
}

export type ReviewLearningCourse = {
    id: number,
    review: ReviewGet
}


export type ReviewGet = {
    id: number,
    content: string,
    ratingStar: number,
    createdAt: string,
    updatedAt: string,
    status: boolean,
    student: StudentGetType,
    course: CourseGetType
}

export type PageReviewResponse = {
    percentFiveStar: number
    percentFourStar: number
    percentThreeStar: number
    percentTwoStar: number
    percentOneStar: number
    pageNum: number
    pageSize: number
    totalElements: number
    totalPages: number
    content: ReviewGet[]
}

export type ReviewPercent = {
    percentFiveStar: number
    percentFourStar: number
    percentThreeStar: number
    percentTwoStar: number
    percentOneStar: number
}
