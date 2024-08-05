import { StudentType } from "../types/StudentType";
import instance from "../utils/axiosCustomize";

export const getWithPagination = async (current: number, pageSize: number, keyword: string | null) => {
    let url: string = ""
    if (keyword != null) {
        url = `/admin/students/paging?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`
    } else {
        url = `/admin/students/paging?pageNum=${current}&pageSize=${pageSize}`
    }
    const res = await instance.get(url);
    return res;
}


export const updateStatus = async (status: boolean, id: number) => {
    const url = `/admin/students/${id}/status/${status}`
    const res = await instance.put(url);
    return res;
}

export const updateStudent = async (userPost: StudentType) => {
    const url = `/students/profile`;
    const res = await instance.put(url, userPost);
    return res;
}
