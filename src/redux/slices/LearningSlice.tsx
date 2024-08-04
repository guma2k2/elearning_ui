import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { LearningType } from '../../types/LearningType'
import { getCourseBySlug } from '../../services/CourseService'
import { ILecture, IQuiz } from '../../types/CourseType'
export interface LearningState {
    learning?: LearningType
    isLoading: boolean
    isError: boolean,
}
export type LearningStatus = {
    sectionId: number,
    curriculum: ILecture | IQuiz
}

export type LearningWatchingSecond = {
    sectionId?: number,
    curriculumId?: number,
    watchingSecond: number
}
export type LearningSelection = {
    sectionId: number,
    curriculumId: number | undefined,
    type: "lecture" | "quiz",
}
export const fetchCourseBySlug = createAsyncThunk(
    'learning/fetchCourseBySlug',
    async (slug: string | undefined) => {
        const res = await getCourseBySlug(slug);
        const data = res.data as LearningType
        let start: number = 1
        data.course.sections.forEach((section) => {
            section.curriculums.forEach((curriclum) => {
                curriclum.index = start++;
            })
        })
        return data;
    },
)
const initialState: LearningState = {
    isLoading: false,
    isError: false
}



export const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {
        updateStatusOfCurriculum: (state, action: PayloadAction<LearningStatus>) => {
            const payload = action.payload;
            const sectionId = payload.sectionId;
            const type = payload.curriculum.type;
            const curriculum = payload.curriculum;
            // console.log(curriculum);
            if (state.learning) {
                state.learning.course.sections.forEach((sec) => {
                    if (sec.id === sectionId) {
                        sec.curriculums.forEach((cur) => {
                            if (cur.type == type && cur.id == curriculum.id) {
                                cur.finished = curriculum.finished;
                                if (cur.type == "lecture" && curriculum.type == "lecture") {
                                    cur.watchingSecond = curriculum.watchingSecond;
                                }
                            }
                        })
                    }
                })
            }
        },
        updateSelection: (state, action: PayloadAction<LearningSelection>) => {
            const payload = action.payload;
            if (state.learning) {
                state.learning.sectionId = payload.sectionId;
                state.learning.curriculumId = payload.curriculumId;
                state.learning.type = payload.type;
            }
        }, updateWatchingSecond: (state, action: PayloadAction<LearningWatchingSecond>) => {
            const payload = action.payload;
            const sectionId = payload.sectionId;
            const watchingSecond = payload.watchingSecond
            const curId = payload.curriculumId;
            if (state.learning) {
                state.learning.course.sections.forEach((sec) => {
                    if (sec.id === sectionId) {
                        sec.curriculums.forEach((cur) => {
                            if (cur.type == "lecture" && cur.id == curId) {
                                cur.watchingSecond = watchingSecond
                            }
                        })
                    }
                })
            }
        },


    }, extraReducers: (builder) => {
        builder
            .addCase(fetchCourseBySlug.pending, (state, _action) => {
                // console.log(action);
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
                // console.log(action);
                state.learning = action.payload
                state.isError = false;
                state.isLoading = false;
            })
            .addCase(fetchCourseBySlug.rejected, (state, _action) => {
                // console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { updateStatusOfCurriculum, updateSelection, updateWatchingSecond } = learningSlice.actions

// Other code such as selectors can use the imported `RootState` type
export default learningSlice.reducer