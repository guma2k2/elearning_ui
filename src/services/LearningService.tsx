import instance from "../utils/axiosCustomize";

export const getMyLearningByStudent = async () => {
    const url = `/learning-course/student`
    const res = await instance.get(url);
    return res;
}

