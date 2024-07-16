import { OrderPostDto } from "../types/OrderType";
import instance from "../utils/axiosCustomize";

export const save = async (orderPost: OrderPostDto) => {
    const url = "/orders";
    const res = await instance.post(url, orderPost);
    return res;
}


export const updateOrderStatus = async (orderId: number, status: string) => {
    const url = `/orders/${orderId}/status/${status}`;
    const res = await instance.put(url);
    return res;
}

export const OrderStatus: string = "SUCCESS" || "PENDING" || "CANCEL"