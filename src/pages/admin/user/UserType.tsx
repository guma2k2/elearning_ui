export type UserType = {
    key: number;
    id: number;
    photoId: any;
    email: string;
    firstName: string;
    active: boolean
    lastName: string;
    gender: string;
    role: string;
}


export type UserGetDetailType = {
    key: number;
    id: number;
    photoURL: string;
    email: string;
    firstName: string;
    active: boolean
    lastName: string;
    gender: string;
    dateOfBirth: string
    role: string;
}