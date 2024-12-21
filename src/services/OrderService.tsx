import { OrderPostDto, OrderStatusPostType } from "../types/OrderType";
import instance from "../utils/axiosCustomize";

export const save = async (orderPost: OrderPostDto) => {
    const url = "/orders";
    const res = await instance.post(url, orderPost);
    return res;
}


export const getOrderWithPagination = async (current: number, pageSize: number, keyword: string | null, status: string | null) => {
    let url: string = `/admin/orders/paging?pageNum=${current}&pageSize=${pageSize}`
    let keywordParam: string = keyword != null && keyword != "" ? `&keyword=${keyword}` : "";
    let statusParam: string = status != "ALL" ? `&status=${status}` : "";
    let params = url + keywordParam + statusParam
    const res = await instance.get(params);
    return res;
}

export const getOrdersByUser = async () => {
    const url = "/orders/user"
    const res = await instance.get(url);
    return res;
}

export const updateOrderStatus = async (orderId: number, status: string) => {
    const url = `/orders/${orderId}/status/${status}`;
    const res = await instance.put(url);
    return res;
}

export const getBestSellerCourse = async () => {
    const url = "/orders/beseller-courses"
    const res = await instance.get(url);
    return res;
}


export const updateStatusOrder = async (status: OrderStatusPostType, id: number | undefined | string) => {
    const url = `/admin/orders/${id}/status`
    const res = await instance.put(url, status);
    return res;
}


export const OrderStatus: string = "SUCCESS" || "PENDING" || "CANCEL"