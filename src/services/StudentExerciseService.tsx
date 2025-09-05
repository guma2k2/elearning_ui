import { StudentExercisePostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const createStudentExercise = async (request: StudentExercisePostType) => {
    const url = `/student-exercises`
    const res = await instance.post(url, request);
    return res;
}


export const updateStudentExercise = async (request: StudentExercisePostType, id: number) => {
    const url = `/student-exercises/${id}`;
    const res = await instance.put(url, request);
    return res;
}


export const getByExercise = async (id: number | string | undefined) => {
    const url = `/student-exercises/exercise/${id}`
    const res = await instance.get(url);
    return res;
}

export const getListByExercise = async (id: number | string | undefined) => {
    const url = `/student-exercises/exercise/${id}/list`
    const res = await instance.get(url);
    return res;
}


export const deleteStudentExercise = async (id: number | string | undefined) => {
    const url = `/student-exercises/${id}`
    const res = await instance.delete(url);
    return res;
}