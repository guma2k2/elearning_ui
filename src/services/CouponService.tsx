import { CouponPostType } from "../types/CouponType";
import instance from "../utils/axiosCustomize";

export const getWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/coupons/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}

export const getByCode = async (code: string) => {
    const url = `/coupons/code/${code}`
    const res = await instance.get(url);
    return res;
}
export const deleteCoupon = async (couponId: number) => {
    const url = `/admin/coupons/${couponId}`
    const res = await instance.delete(url);
    return res;
}



export const save = async (couponPost: CouponPostType) => {
    const url = "/admin/coupons";
    const res = await instance.post(url, couponPost);
    return res;
}

export const update = async (couponPost: CouponPostType, couponId: number | undefined) => {
    const url = `/admin/coupons/${couponId}`;
    const res = await instance.put(url, couponPost);
    return res;
}