import { ExercisePostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const createExercise = async (request: ExercisePostType) => {
    const url = "/exercises";
    const res = await instance.post(url, request);
    return res;
}

export const updateExercise = async (request: ExercisePostType, id: number | undefined | string) => {
    const url = `/exercises/${id}`;
    const res = await instance.put(url, request);
    return res;
}


export const getExercise = async (id: number | undefined | string) => {
    const url = `/exercises/${id}`;
    const res = await instance.get(url);
    return res;
}

export const deleteExercise = async (id: number | undefined) => {
    const url = `/exercises/${id}`;
    const res = await instance.delete(url);
    return res;
}