export type PromotionType = {
    id: number,
    discountPercent: number,
    name: string,
    startTime: string,
    endTime: string
}


export type PromotionPostType = {
    name: string,
    discountPercent: number
    startTime: string,
    endTime: string
}