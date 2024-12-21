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

export type ReviewStatusPostType = {
    status: string,
    reason: string
}

export type ReviewGet = {
    id: number,
    content: string,
    ratingStar: number,
    createdAt: string,
    updatedAt: string,
    status: string,
    reason: string,
    student: StudentGetType,
    course: CourseGetType,
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
