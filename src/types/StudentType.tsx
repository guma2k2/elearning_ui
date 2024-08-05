export type StudentType = {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    active: boolean,
    photo: any,
    dateOfBirth: string,
    day?: number,
    month?: number,
    year?: number
    password?: string
}

export type StudentGetType = {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    photo: string,
    active: boolean
}