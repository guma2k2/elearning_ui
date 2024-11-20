import { ClassroomPostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const save = async (classroomPostType: ClassroomPostType) => {
    const url = "/classrooms";
    const res = await instance.post(url, classroomPostType);
    return res;
}

export const update = async (classroomPostType: ClassroomPostType, classId: number | undefined) => {
    const url = `/classrooms/${classId}`;
    const res = await instance.put(url, classroomPostType);
    return res;
}



export const getById = async (classroomId: number | string | undefined) => {
    const url = `/classrooms/${classroomId}`
    const res = await instance.get(url);
    return res;
}

export const getByCourseId = async (courseId: number | string | undefined) => {
    const url = `/classrooms/course/${courseId}`
    const res = await instance.get(url);
    return res;
}