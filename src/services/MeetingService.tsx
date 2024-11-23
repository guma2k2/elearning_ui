import { MeetingPostType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";

export const createMeeting = async (request: MeetingPostType) => {
    const url = "/meetings";
    const res = await instance.post(url, request);
    return res;
}

export const updateMeeting = async (request: MeetingPostType, meetingId: number | undefined) => {
    const url = `/meetings/${meetingId}`;
    const res = await instance.put(url, request);
    return res;
}