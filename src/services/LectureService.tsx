import instance from "../utils/axiosCustomize";

export const createLecture = async (lecturePost: LecturePost) => {
    const url = "/admin/lectures";
    const res = await instance.post(url, lecturePost);
    return res;
}

export const updateLecture = async (lecturePost: LecturePost, lectureId: number | undefined) => {
    const url = `/admin/lectures/${lectureId}`;
    const res = await instance.put(url, lecturePost);
    return res;
}