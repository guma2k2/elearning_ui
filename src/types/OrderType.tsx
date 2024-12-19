import { CourseGetType } from "./CourseType"

export type OrderDetailPostDto = {
    courseId: number | undefined,
    price: number | undefined
}

export type OrderPostDto = {
    couponCode?: string | null
    orderDetails: OrderDetailPostDto[]
}

export type OrderStatusPostType = {
    status: string,
    reason: string
}

export type OrderType = {
    id: number,
    student: string,
    coupon: string,
    createdAt: string,
    status: string,
    totalPrice: number,
    reason: string,
    orderDetails: OrderDetailType[]
}

export type OrderDetailType = {
    key?: number
    id: number,
    course: CourseGetType
    price: number
}