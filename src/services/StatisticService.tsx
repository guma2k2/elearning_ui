import instance from "../utils/axiosCustomize";

export const getStatisticByTime = async (param: string) => {
    const url = `/statistic/time/${param}`
    const res = await instance.get(url);
    return res;
}
