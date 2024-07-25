export type StudentType = {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    active: boolean,
    photo: string,
    dateOfBirth: string
}

export type StudentGetType = {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    photo: string,
    active: boolean
}