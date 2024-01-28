import instance from "../utils/axiosCustomize";


export const uploadFile = async (formData: FormData) => {
    const url = "/medias";
    const res = await instance.post(url, formData);
    return res;
}
