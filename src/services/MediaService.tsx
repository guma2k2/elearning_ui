import { ReferenceFileType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";


export const uploadFile = async (formData: FormData) => {
    const url = "/medias";
    const res = await instance.post(url, formData);
    return res;
}


export const downloadFile = async (file: ReferenceFileType): Promise<Blob> => {
    const url = `/medias/download?fileName=${encodeURIComponent(file.fileName)}&fileUrl=${encodeURIComponent(file.fileUrl)}`;

    // Specify responseType as 'blob' to handle binary data
    const res = await instance.get(url, { responseType: "blob" });
    return res.data;
};
