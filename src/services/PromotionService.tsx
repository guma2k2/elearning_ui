import { PromotionPostType } from "../types/PromotionType";
import instance from "../utils/axiosCustomize";

export const getWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/promotions/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}

export const deletePromotion = async (promotionId: number) => {
    const url = `/admin/promotions/${promotionId}`
    const res = await instance.delete(url);
    return res;
}


export const save = async (promotionPost: PromotionPostType) => {
    const url = "/admin/promotions";
    const res = await instance.post(url, promotionPost);
    return res;
}

export const update = async (couponPost: PromotionPostType, promotioinId: number | undefined) => {
    const url = `/admin/promotions/${promotioinId}`;
    const res = await instance.put(url, couponPost);
    return res;
}