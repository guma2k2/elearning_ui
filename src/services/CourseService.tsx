import { CourseType } from "../types/CourseType";
import instance from "../utils/axiosCustomize";

export const getCourseWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/courses/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}

export const createCourse = async (coursePost: CourseType) => {
    const url = "/admin/courses";
    const res = await instance.post(url, coursePost);
    return res;
}
export const get = async (courseId: number | string | undefined) => {
    const url = `/courses/${courseId}`
    const res = await instance.get(url);
    return res;
}