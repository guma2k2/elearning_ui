import { LearningLecturePost } from "../types/learning/LearningLectureType";
import instance from "../utils/axiosCustomize";

export const createLearningLecture = async (learningLecturePost: LearningLecturePost) => {
    const url = "/learning-lectures";
    // console.log(learningLecturePost);
    const res = await instance.post(url, learningLecturePost);
    return res;
}

