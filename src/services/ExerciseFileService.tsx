import { ExerciseFilePostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const createExerciseFile = async (request: ExerciseFilePostType) => {
    const url = "/exercise-files";
    const res = await instance.post(url, request);
    return res;
}


export const deleteExerciseFile = async (id: number | undefined) => {
    const url = `/exercise-files/${id}`;
    const res = await instance.delete(url);
    return res;
}