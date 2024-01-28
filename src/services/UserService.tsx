import { UserType } from "../pages/admin/user/UserType";
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