export type ReviewPost = {
    courseId: number
    content: string
    ratingStar: number
}


export type ReviewGet = {
    id: number,
    content: string,
    rating: number,
    updated_at?: string
}

