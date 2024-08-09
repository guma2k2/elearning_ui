import instance from "../utils/axiosCustomize";

export const getCategoryParents = async () => {
    const url = `category/parents`
    const res = await instance.get(url);
    return res;
}
export const getWithPagination = async (current: number, pageSize: number, keyword: string | null) => {
    let url: string = ""
    if (keyword != null) {
        url = `/admin/category/paging?pageNum=${current}&pageSize=${pageSize}&keyword=${keyword}`
    } else {
        url = `/admin/category/paging?pageNum=${current}&pageSize=${pageSize}`
    }
    const res = await instance.get(url);
    return res;
}

export const save = async (catPost: CategoryType) => {
    const url = "/admin/category";
    const res = await instance.post(url, catPost);
    return res;
}

export const update = async (catPost: CategoryType, catId: number | undefined) => {
    const url = `/admin/category/${catId}`;
    const res = await instance.put(url, catPost);
    return res;
}
export const get = async (catId: number) => {
    const url = `/category/${catId}`
    const res = await instance.get(url);
    return res;
}

export const deleteCategory = async (catId: number) => {
    const url = `/admin/category/${catId}`
    const res = await instance.delete(url);
    return res;
}


export const getByName = async (catName: string) => {
    const url = `/category/name/${catName}`
    const res = await instance.get(url);
    return res;
}