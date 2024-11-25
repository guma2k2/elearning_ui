import { ReferenceFilePostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const createReferenceFile = async (request: ReferenceFilePostType) => {
    const url = "/referencefiles";
    const res = await instance.post(url, request);
    return res;
}


export const deleteReferenceFile = async (referenceFileId: number | undefined) => {
    const url = `/referencefiles/${referenceFileId}`;
    const res = await instance.delete(url);
    return res;
}