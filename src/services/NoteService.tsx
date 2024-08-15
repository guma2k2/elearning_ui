import { NotePost } from "../types/NoteType";
import instance from "../utils/axiosCustomize";

export const getNotesBySectionId = async (sectionId: number | undefined) => {
    const url = `/notes/section/${sectionId}`
    const res = await instance.get(url);
    return res;
}

export const getNotesByCourseId = async (courseId: number | undefined) => {
    const url = `/notes/course/${courseId}`
    const res = await instance.get(url);
    return res;
}

export const deleteNote = async (noteId: number | undefined) => {
    const url = `/notes/${noteId}`
    const res = await instance.delete(url);
    return res;
}

export const createNote = async (notePost: NotePost) => {
    const url = `/notes`
    const res = await instance.post(url, notePost);
    return res;
}

export const updateNote = async (notePost: NotePost) => {
    const url = `/notes`
    const res = await instance.put(url, notePost);
    return res;
}