import { QuestionPost } from "../types/Question";
import instance from "../utils/axiosCustomize";

export const createQuestion = async (questionPost: QuestionPost) => {
    const url = "/admin/questions";
    const res = await instance.post(url, questionPost);
    return res;
}

export const updateQuestion = async (questionPost: QuestionPost, questionId: number | undefined) => {
    const url = `/admin/questions/${questionId}`;
    const res = await instance.put(url, questionPost);
    return res;
}
