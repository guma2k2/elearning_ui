import { CourseListGetType } from "./CourseType"

export type CartType = {
    id: number,
    course: CourseListGetType,
    buyLater: boolean
}