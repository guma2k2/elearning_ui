
export type UserType = {
    id: number;
    photo: any;
    photoURL?: string
    email: string;
    firstName: string;
    active: boolean
    lastName: string;
    gender: string;
    role: string;
    password?: string
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

export type UserProfile = {
    id: number,
    fullName: string,
    photo: string,
    averageRating: number,
    numberOfReview: number,
    numberOfStudent: number,
    numberOfCourse: number
}