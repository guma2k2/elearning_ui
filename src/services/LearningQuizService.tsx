import { LearningQuizPost } from "../types/learning/LearningQuizType";
import instance from "../utils/axiosCustomize";

export const createLearningQuiz = async (learningQuizPost: LearningQuizPost) => {
    const url = "/learning-quizzes";
    const res = await instance.post(url, learningQuizPost);
    return res;
}

export const update = async (learningQuizPost: LearningQuizPost, quizId: number) => {
    const url = `/learning-quizzes/quiz/${quizId}`;
    const res = await instance.put(url, learningQuizPost);
    return res;
}