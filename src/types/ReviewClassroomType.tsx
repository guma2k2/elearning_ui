import { StudentGetType } from "./StudentType"

export type ReviewClassroomPost = {
    id?: number
    classroomId: number
    content: string
    ratingStar: number
}




export type ReviewClassroomGet = {
    id: number,
    content: string,
    ratingStar: number,
    createdAt: string,
    updatedAt: string,
    status: boolean,
    student: StudentGetType,
}

