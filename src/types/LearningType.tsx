import { CourseType } from "./CourseType"

export type LearningType = {
    course: CourseType
    curriculumId?: number
    sectionId?: number
    secondWatched?: number
    type: "lecture" | "quiz"
}