
export type AuthType = {
    id: number;
    photoURL?: string
    email: string;
    firstName: string;
    active: boolean
    lastName: string;
    gender: string;
    role: string;
    accessToken: string
}


export type LoginRequest = {
    email: string,
    password: string
}

export type RegisterRequest = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}