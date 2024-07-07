import { AuthType, LoginRequest } from "../types/AuthType";
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