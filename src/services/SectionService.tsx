import { SectionType } from "../types/CourseType";
import instance from "../utils/axiosCustomize";

export const create = async (sectionPost: SectionType) => {
    const url = "/admin/sections";
    const res = await instance.post(url, sectionPost);
    return res;
}

export const update = async (sectionPost: SectionType, sectionId: number | undefined) => {
    const url = `/admin/sections/${sectionId}`;
    const res = await instance.put(url, sectionPost);
    return res;
}