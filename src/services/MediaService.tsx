import { ExerciseFileType, ReferenceFileType } from "../types/ClassroomType";
import instance from "../utils/axiosCustomize";


export const uploadFile = async (formData: FormData) => {
    const url = "/medias";
    const res = await instance.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return res;
}


export const downloadFile = async (file: ReferenceFileType | ExerciseFileType): Promise<Blob> => {
    const url = `/medias/download?fileName=${encodeURIComponent(file.fileName)}&fileUrl=${encodeURIComponent(file.fileUrl)}`;

    // Specify responseType as 'blob' to handle binary data
    const res = await instance.get(url, { responseType: "blob" });
    return res.data;
};
