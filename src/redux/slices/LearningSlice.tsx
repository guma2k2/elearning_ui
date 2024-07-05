import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
export interface LearningState {
    curriculumId: number,
    sectionId: number,
    type: "lecture" | "quiz" | ""
}

// Define the initial state using that type
const initialState: LearningState = {
    curriculumId: -1,
    sectionId: -1,
    type: ""
}

export const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {
        updateSelection: (state, action) => {
            const payload = action.payload as LearningState
            state.curriculumId = payload.curriculumId
            state.sectionId = payload.sectionId
            state.type = payload.type
        },
    }
})

export const { } = learningSlice.actions

// Other code such as selectors can use the imported `RootState` type
export default learningSlice.reducer