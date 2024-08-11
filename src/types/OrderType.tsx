import { CourseGetType } from "./CourseType"

export type OrderDetailPostDto = {
    courseId: number | undefined,
    price: number | undefined
}

export type OrderPostDto = {
    couponCode?: string | null
    orderDetails: OrderDetailPostDto[]
}


export type OrderType = {
    id: number,
    student: string,
    coupon: string,
    createdAt: string,
    status: string,
    totalPrice: number,
    orderDetails: OrderDetailType[]
}

export type OrderDetailType = {
    key?: number
    id: number,
    course: CourseGetType
    price: number
}