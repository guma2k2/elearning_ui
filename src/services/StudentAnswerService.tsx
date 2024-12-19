import { AnswerLecturePostType, } from "../types/QuestionLectureType";
import instance from "../utils/axiosCustomize";



export const createStudentAnswerLecture = async (ans: AnswerLecturePostType) => {
    const url = "/student-answer";
    const res = await instance.post(url, ans);
    return res;
}


export const updateStudentAnswerLecture = async (ans: AnswerLecturePostType, id: number | undefined) => {
    const url = `/student-answer/${id}`;
    const res = await instance.put(url, ans);
    return res;
}


export const deleteStudentAnswerLecture = async (id: number | undefined) => {
    const url = `/student-answer/${id}`
    const res = await instance.delete(url);
    return res;
}