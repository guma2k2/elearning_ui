export type CouponType = {
    id: number,
    discountPercent: number,
    code: string,
    startTime: string,
    endTime: string
}


export type CouponPostType = {
    code: string,
    discountPercent: number
    startTime: string,
    endTime: string
}