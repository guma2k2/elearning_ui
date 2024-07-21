export type OrderDetailPostDto = {
    courseId: number | undefined,
    price: number | undefined
}

export type OrderPostDto = {
    orderDetails: OrderDetailPostDto[]
}


export type OrderType = {
    id: number,
    student: string,
    coupon: string,
    createdAt: string,
    status: string,
    totalPrice: number
}