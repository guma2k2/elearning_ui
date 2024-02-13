import { TopicType } from "../pages/admin/topic/TopicType";
import instance from "../utils/axiosCustomize";

export const getTopicWithPagination = async (current: number, pageSize: number) => {
    const url = `/admin/topic/paging?pageNum=${current}&pageSize=${pageSize}`
    const res = await instance.get(url);
    return res;
}

export const save = async (topicPost: TopicType) => {
    const url = "/admin/topic";
    const res = await instance.post(url, topicPost);
    return res;
}

export const update = async (topicPost: TopicType, topicId: number | undefined) => {
    const url = `/admin/topic/${topicId}`;
    const res = await instance.put(url, topicPost);
    return res;
}
export const get = async (topicId: number) => {
    const url = `/topic/${topicId}`
    const res = await instance.get(url);
    return res;
}

export const getTopicsByCategoryId = async (catId: number) => {
    const url = `/topics/category/${catId}`
    const res = await instance.get(url);
    return res;
}