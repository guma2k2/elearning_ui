import { ReviewPost } from "../types/ReviewType";
import instance from "../utils/axiosCustomize";

// export const getCarts = async () => {
//     const res = await instance.get(url);
//     return res;
// }


export const createReview = async (reviewPost: ReviewPost) => {
    const url = `/reviews`
    const res = await instance.post(url, reviewPost);
    return res;
}


export const updateReview = async (reviewPut: ReviewPost, reviewId: number) => {
    const url = `/reviews/${reviewId}`
    const res = await instance.put(url, reviewPut);
    return res;
}

