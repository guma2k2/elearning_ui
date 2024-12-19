import { ConfirmPassword, ForgotPasswordRequest, LoginRequest, RegisterRequest, UpdatePasswordRequest, VerifyRequest } from "../types/AuthType";
import instance from "../utils/axiosCustomize";


export const outboundUser = async (code: string) => {
    const url = `auth/outbound/authentication?code=${code}`;
    const res = await instance.post(url);
    return res;
}


export const loginUser = async (request: LoginRequest) => {
    const url = `auth/login`;
    const res = await instance.post(url, request);
    return res;
}



export const registerUser = async (request: RegisterRequest) => {
    const url = `auth/register`;
    const res = await instance.post(url, request);
    return res;
}

export const forgotPassword = async (request: ForgotPasswordRequest) => {
    const url = `auth/forgotpassword?email=${request.email}`;
    const res = await instance.post(url);
    return res;
}

export const updatePassword = async (request: UpdatePasswordRequest) => {
    const url = `auth/password`;
    const res = await instance.put(url, request);
    return res;
}

export const verifyEmail = async (request: VerifyRequest) => {
    const url = `auth/verify`;
    const res = await instance.post(url, request);
    return res;
}

export const resend = async (email: string | undefined) => {
    const url = `auth/resend?email=${email}`;
    const res = await instance.post(url);
    return res;
}