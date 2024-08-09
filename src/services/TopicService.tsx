import { TopicType } from "../pages/admin/topic/TopicType";
import instance from "../utils/axiosCustomize";

export const getTopicWithPagination = async (current: number, pageSize: number, keyword: string | null) => {
    let url: string = ""
    if (keyword != null) {
        url = `/admin/topic/paging?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`
    } else {
        url = `/admin/topic/paging?pageNum=${current}&pageSize=${pageSize}`
    }
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

export const deleteTopic = async (topicId: number) => {
    const url = `/admin/topic/${topicId}`
    const res = await instance.delete(url);
    return res;
}

export const getTopicsByCategoryId = async (catId: number | undefined) => {
    const url = `/topics/category/${catId}`
    const res = await instance.get(url);
    return res;
}