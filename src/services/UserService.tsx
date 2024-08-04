import { UserType } from "../types/UserType";
import instance from "../utils/axiosCustomize";


export const save = async (userPost: UserType) => {
    const url = "/admin/users";
    const res = await instance.post(url, userPost);
    return res;
}

export const update = async (userPost: UserType, userId: number | undefined) => {
    const url = `/admin/users/${userId}`;
    const res = await instance.put(url, userPost);
    return res;
}


export const get = async (userId: number) => {
    const url = `/admin/users/${userId}`
    const res = await instance.get(url);
    return res;
}

export const getUserProfile = async (userId: number) => {
    const url = `/users/${userId}`
    const res = await instance.get(url);
    return res;
}


export const getWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/users/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}