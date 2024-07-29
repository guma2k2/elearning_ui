import { LearningQuizPost } from "../types/learning/LearningQuizType";
import instance from "../utils/axiosCustomize";

export const createLearningQuiz = async (learningQuizPost: LearningQuizPost) => {
    const url = "/learning-quizzes";
    const res = await instance.post(url, learningQuizPost);
    return res;
}

