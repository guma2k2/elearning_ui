import React from "react";

export type UserType = {
    key: React.Key;
    id: number;
    photoId: any;
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