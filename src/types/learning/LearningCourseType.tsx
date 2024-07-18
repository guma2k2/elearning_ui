import { CourseListGetType } from "../CourseType"
import { ReviewGet } from "../ReviewType"

export type LearningCourse = {
    id: number,
    review: ReviewGet,
    course: CourseListGetType,
    percentFinished: number
}