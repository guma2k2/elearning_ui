import instance from "../utils/axiosCustomize";

export const getMyLearningByStudent = async () => {
    const url = `/learning-course/student`
    const res = await instance.get(url);
    return res;
}

export const createLearningCourse = async (courseId: number) => {
    const url = `/learning-course?courseId=${courseId}`
    const res = await instance.post(url);
    return res;
}

