import { QuizPost } from "../types/QuizType";
import instance from "../utils/axiosCustomize";

export const createQuiz = async (quizPost: QuizPost) => {
    const url = "/admin/quizzes";
    const res = await instance.post(url, quizPost);
    return res;
}

export const updateQuiz = async (quizPost: QuizPost, quizId: number | undefined) => {
    const url = `/admin/quizzes/${quizId}`;
    const res = await instance.put(url, quizPost);
    return res;
}