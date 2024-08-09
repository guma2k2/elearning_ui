import { CourseType } from "../types/CourseType";
import instance from "../utils/axiosCustomize";

export const getCourseWithPagination = async (current: number, pageSize: number, keyword: string | null) => {
    let url: string = ""
    if (keyword != null) {
        url = `/admin/courses/paging?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`
    } else {
        url = `/admin/courses/paging?pageNum=${current}&pageSize=${pageSize}`
    }
    const res = await instance.get(url);
    return res;
}

export const deleteCourse = async (courseId: number) => {
    const url = `/admin/courses/${courseId}`
    const res = await instance.delete(url);
    return res;
}

export const getCourseByCategory = async (catId: number) => {
    const url = `/courses/category/${catId}`
    const res = await instance.get(url);
    return res;
}

export const createCourse = async (coursePost: CourseType) => {
    const url = "/admin/courses";
    const res = await instance.post(url, coursePost);
    return res;
}

export const updateCourseById = async (coursePost: CourseType, courseId: number) => {
    const url = `/admin/courses/${courseId}`;
    const res = await instance.put(url, coursePost);
    return res;
}
export const get = async (courseId: number | string | undefined) => {
    const url = `/courses/${courseId}`
    const res = await instance.get(url);
    return res;
}


export const getCourseBySlug = async (courseSlug: string | undefined) => {
    const url = `/courses/${courseSlug}/learn`
    const res = await instance.get(url);
    return res;
}


export const getCourseByMultiQuery = async (query: string) => {
    let url = "/courses/search";
    if (query && query != "") {
        url += "?" + query;
    }
    console.log(url);

    const res = await instance.get(url);
    return res;
}

export const updateStatus = async (status: boolean, id: number) => {
    const url = `/admin/courses/${id}/status/${status}`
    const res = await instance.put(url);
    return res;
}





