import { ReviewClassroomPost } from "../types/ReviewClassroomType";
import instance from "../utils/axiosCustomize";

export const createReview = async (reviewPost: ReviewClassroomPost) => {
    const url = `/review-classrooms`
    const res = await instance.post(url, reviewPost);
    return res;
}


export const updateReview = async (reviewPut: ReviewClassroomPost, reviewId: number) => {
    const url = `/review-classrooms/${reviewId}`
    const res = await instance.put(url, reviewPut);
    return res;
}


export const getByClassroomId = async (classroomId: number | string | undefined) => {
    const url = `/review-classrooms/classroom/${classroomId}`
    const res = await instance.get(url);
    return res;
}


export const getByStudent = async () => {
    const url = `/review-classrooms/student`
    const res = await instance.get(url);
    return res;
}