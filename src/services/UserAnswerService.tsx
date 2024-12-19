import { AnswerLecturePostType, } from "../types/QuestionLectureType";
import instance from "../utils/axiosCustomize";



export const createUserAnswerLecture = async (ans: AnswerLecturePostType) => {
    const url = "/user-answer";
    const res = await instance.post(url, ans);
    return res;
}


export const updateUserAnswerLecture = async (ans: AnswerLecturePostType, id: number | undefined) => {
    const url = `/user-answer/${id}`;
    const res = await instance.put(url, ans);
    return res;
}


export const deleteUserAnswerLecture = async (id: number | undefined) => {
    const url = `/user-answer/${id}`
    const res = await instance.delete(url);
    return res;
}