export type PaymentPost = {
    amount: string,
    bankCode: string,
    bankTranNo: string,
    cartType: string,
    payDate: string,
    orderId: string
}


export type PaymentRequestType = {
    amount: number,
    bankCode: string,
    orderId: number
}
export type VNPayResponse = {
    code: string,
    message: string,
    paymentUrl: string
}
