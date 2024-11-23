export type ClassroomType = {
    id: number
    name: string
    description?: string
    image: string

}

export type ClassroomPostType = {
    id: number
    name: string
    description: string
    image: string
    courseId: number
}

export type ClassroomGetType = {
    id: number
    name: string
    description: string
    image: string
    events: (IMeeting | IReference)[]

}

export interface IEvent {
    id: number,
    createdAt: string
}

export interface IMeeting extends IEvent {
    type: "meeting",
    code: string,
    startTime: string,
    endTime: string
}

export interface IReference extends IEvent {
    type: "reference",
    description: string,
    files: ReferenceFileType[]
}

export type ReferenceFileType = {
    id: number,
    fileName: string,
    fileUrl: string
}


export type MeetingPostType = {
    code: string,
    startTime: string,
    endTime: string,
    classroomId: number
}

export type ReferencePostType = {
    description: string,
    classroomId: number
}