import { MeetingPostType, ReferencePostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const createReference = async (request: ReferencePostType) => {
    const url = "/references";
    const res = await instance.post(url, request);
    return res;
}

export const updateReference = async (request: ReferencePostType, referenceId: number | undefined) => {
    const url = `/references/${referenceId}`;
    const res = await instance.put(url, request);
    return res;
}