import instance from "../utils/axiosCustomize";

export const getStatisticByTime = async (param: string) => {
    const url = `/statistic/time${param}`
    const res = await instance.get(url);
    return res;
}

export const getDashboard = async () => {
    const url = `/statistic/dashboard`
    const res = await instance.get(url);
    return res;
}

export const getStatisticCourseByTime = async (param: string) => {
    const url = `/statistic/course${param}`
    const res = await instance.get(url);
    return res;
}