import { OrderPostDto } from "../types/OrderType";
import instance from "../utils/axiosCustomize";

export const save = async (orderPost: OrderPostDto) => {
    const url = "/orders";
    const res = await instance.post(url, orderPost);
    return res;
}


export const getOrderWithPagination = async (current: number, pageSize: number, keyword: string | null) => {
    let url: string = ""
    if (keyword != null) {
        url = `/admin/orders/paging?pageNum=${current}&pageSize=${pageSize}&orderId=${keyword}`
    } else {
        url = `/admin/orders/paging?pageNum=${current}&pageSize=${pageSize}`
    }
    const res = await instance.get(url);
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


export const OrderStatus: string = "SUCCESS" || "PENDING" || "CANCEL"