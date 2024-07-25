import { OrderPostDto } from "../types/OrderType";
import instance from "../utils/axiosCustomize";

export const save = async (orderPost: OrderPostDto) => {
    const url = "/orders";
    const res = await instance.post(url, orderPost);
    return res;
}


export const getOrderWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/orders/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}

export const updateOrderStatus = async (orderId: number, status: string) => {
    const url = `/orders/${orderId}/status/${status}`;
    const res = await instance.put(url);
    return res;
}

export const OrderStatus: string = "SUCCESS" || "PENDING" || "CANCEL"