import instance from "../utils/axiosCustomize";

export const getCategoryParents = async () => {
    const url = `category/parents`
    const res = await instance.get(url);
    return res;
}
