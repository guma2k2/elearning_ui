export type OrderDetailPostDto = {
    courseId: number | undefined,
    price: number | undefined
}

export type OrderPostDto = {
    orderDetails: OrderDetailPostDto[]
}