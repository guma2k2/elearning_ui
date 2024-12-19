import { QuestionLecturePostType } from "../types/QuestionLectureType";
import instance from "../utils/axiosCustomize";



export const createQuestionLecture = async (questionLecturePostType: QuestionLecturePostType) => {
    const url = "/question-lecture";
    const res = await instance.post(url, questionLecturePostType);
    return res;
}


export const updateQuestionLecture = async (questionLecturePostType: QuestionLecturePostType, questionId: number | undefined) => {
    const url = `/question-lecture/${questionId}`;
    const res = await instance.put(url, questionLecturePostType);
    return res;
}



export const deleteQuestionLecture = async (questionId: number | undefined) => {
    const url = `/question-lecture/${questionId}`
    const res = await instance.delete(url);
    return res;
}


export const getByLectureId = async (lectureId: number | undefined) => {
    const url = `/question-lecture/lectures/${lectureId}`
    const res = await instance.get(url);
    return res;
}



export const getByCourse = async (courseId: number | undefined) => {
    const url = `/question-lecture/course/${courseId}`
    const res = await instance.get(url);
    return res;
}

export const getBySection = async (sectionId: number | undefined) => {
    const url = `/question-lecture/section/${sectionId}`
    const res = await instance.get(url);
    return res;
}



