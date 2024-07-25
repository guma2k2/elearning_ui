import instance from "../utils/axiosCustomize";

export const getWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/students/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}


export const updateStatus = async (status: boolean, id: number) => {
    const url = `/admin/students/${id}/status/${status}`
    const res = await instance.put(url);
    return res;
}

