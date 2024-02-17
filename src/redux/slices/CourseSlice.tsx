import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CourseType } from '../../types/CourseType'
import { get } from '../../services/CourseService'

// Define a type for the slice state
interface CourseState {
    currentCourse?: CourseType
    isLoading: boolean
    isError: boolean,
    isDataUpdated?: boolean

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

export const { updateDataStatus } = courseSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses

export default courseSlice.reducer