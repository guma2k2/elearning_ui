import { QuestionPost } from "../types/Question";
import instance from "../utils/axiosCustomize";

export const createQuestion = async (questionPost: QuestionPost) => {
    const url = "/admin/questions";
    const res = await instance.post(url, questionPost);
    return res;
}
