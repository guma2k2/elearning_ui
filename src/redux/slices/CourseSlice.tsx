import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CourseType, ICurriculum, ILecture, IQuiz, QuestionType, SectionType } from '../../types/CourseType'
import { get } from '../../services/CourseService'
interface CourseState {
    currentCourse?: CourseType
    isLoading: boolean
    isError: boolean,
    isDataUpdated?: boolean

}
export type CurriculumPost = {
    curriculum: IQuiz | ILecture
    sectionId: number
}
export type QuestionsPost = {
    question: QuestionType
    quizId: number
}
export const fetchCourseById = createAsyncThunk(
    'courses/fetchByIdStatus',
    async (courseId: number | string | undefined) => {
        const response = await get(courseId);
        return response.data
    },
)
// Define the initial state using that type
const initialState: CourseState = {
    isLoading: false,
    isError: false
}

export const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        updateDataStatus: (state) => {
            state.isDataUpdated = !state.isDataUpdated
        },
        addSection: (state, action: PayloadAction<SectionType>) => {
            state.currentCourse?.sections.push(action.payload);
            state.currentCourse?.sections.sort((a: SectionType, b: SectionType) => a.number - b.number)
            console.log(current(state))
        },
        updateSection: (state, action: PayloadAction<SectionType>) => {
            // Todo: update section
            state.currentCourse?.sections.push(action.payload);
            state.currentCourse?.sections.sort((a: SectionType, b: SectionType) => a.number - b.number)
            console.log(current(state))
        }, addCurriculum: (state, action: PayloadAction<CurriculumPost>) => {
            state.currentCourse?.sections.forEach((sec) => {
                if (sec.id === action.payload.sectionId) {
                    sec.curriculums.push(action.payload.curriculum);
                    sec.curriculums.sort((a: ICurriculum, b: ICurriculum) => a.number - b.number)
                }
            })
        },
        addQuestion: (state, action: PayloadAction<QuestionsPost>) => {
            state.currentCourse?.sections.forEach((sec) => {
                sec.curriculums.forEach((curriculum) => {
                    if (curriculum.id === action.payload.quizId && curriculum.type == "quiz") {
                        curriculum.questions?.push(action.payload.question)
                    }
                })
            })
        },
        // decrement: (state) => {
        //     state.value -= 1
        // },
        // // Use the PayloadAction type to declare the contents of `action.payload`
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload
        // },
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchCourseById.pending, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                console.log(action);
                state.currentCourse = action.payload
                state.isError = false;
                state.isLoading = false;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { updateDataStatus, addSection, updateSection, addCurriculum, addQuestion } = courseSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses
export default courseSlice.reducer