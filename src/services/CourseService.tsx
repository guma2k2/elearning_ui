import { CourseStatusPostType, CourseType } from "../types/CourseType";
import instance from "../utils/axiosCustomize";

export const getCourseWithPagination = async (
    current: number,
    pageSize: number,
    keyword: string | null,
    status: string | null
) => {
    console.log(status);
    let url: string = `/admin/courses/paging?pageNum=${current}&pageSize=${pageSize}`;
    let keywordParam: string = keyword != null && keyword != "" ? `&keyword=${keyword}` : "";
    let statusParam: string = status != "ALL" ? `&status=${status}` : "";
    let params = url + keywordParam + statusParam;
    const res = await instance.get(params);
    return res;
};

export const deleteCourse = async (courseId: number) => {
    const url = `/admin/courses/${courseId}`;
    const res = await instance.delete(url);
    return res;
};

export const getCourseByCategory = async (catId: number) => {
    const url = `/courses/category/${catId}`;
    const res = await instance.get(url);
    return res;
};

export const createCourse = async (coursePost: CourseType) => {
    const url = "/admin/courses";
    const res = await instance.post(url, coursePost);
    return res;
};

export const updateCourseById = async (coursePost: CourseType, courseId: number) => {
    const url = `/admin/courses/${courseId}`;
    const res = await instance.put(url, coursePost);
    return res;
};
export const get = async (courseId: number | string | undefined) => {
    const url = `/courses/${courseId}`;
    const res = await instance.get(url);
    return res;
};

export const getCourseBySlug = async (courseSlug: string | undefined) => {
    const url = `/courses/${courseSlug}/learn`;
    const res = await instance.get(url);
    return res;
};

export const getCourseByMultiQuery = async (query: string) => {
    let url = "/courses/search";
    if (query && query != "") {
        url += "?" + query;
    }
    console.log(url);

    const res = await instance.get(url);
    return res;
};

export const updateStatus = async (status: CourseStatusPostType, id: number | undefined) => {
    const url = `/admin/courses/${id}/status`;
    const res = await instance.put(url, status);
    return res;
};

export const getSuggestions = async (keyword: string) => {
    const url = `/courses/suggestions?keyword=${keyword}`;
    const res = await instance.get(url);
    return res;
};

export const getByPromotionId = async (promotionId: number | string | undefined) => {
    const url = `/admin/courses/promotions/${promotionId}`;
    const res = await instance.get(url);
    return res;
};
