import { LearningLecturePost } from "../types/learning/LearningLectureType";
import instance from "../utils/axiosCustomize";

export const createLearningLecture = async (learningLecturePost: LearningLecturePost) => {
    const url = "/learning-lectures";
    const res = await instance.post(url, learningLecturePost);
    return res;
}

export const update = async (learningLecturePost: LearningLecturePost, lectureId: number) => {
    const url = `/learning-lectures/lecture/${lectureId}`;
    const res = await instance.put(url, learningLecturePost);
    return res;
}