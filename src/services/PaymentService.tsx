import { PaymentPost, PaymentRequestType } from "../types/PaymentType";
import instance from "../utils/axiosCustomize";

export const pay = async (request: PaymentRequestType) => {
    const url = "/payments/vn-pay";
    const res = await instance.post(url, request);
    return res;
}


export const savePayment = async (request: PaymentPost) => {
    const url = "/payments/vn-pay-success";
    const res = await instance.post(url, request);
    return res;
}

