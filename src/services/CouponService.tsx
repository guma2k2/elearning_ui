import instance from "../utils/axiosCustomize";

export const getWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/coupons/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}