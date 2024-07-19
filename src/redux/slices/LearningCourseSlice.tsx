import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { LearningCourse } from '../../types/learning/LearningCourseType'
import { getMyLearningByStudent } from '../../services/LearningService'
import { ReviewLearningCourse } from '../../types/ReviewType'
interface LearningCourseState {
    learningCourses?: LearningCourse[]
    isLoading: boolean
    isError: boolean,
}

export const getLearningCourse = createAsyncThunk(
    'learningCourse/get',
    async () => {
        const res = await getMyLearningByStudent();
        const data = res.data as LearningCourse[];
        return data;
    },
)
const initialState: LearningCourseState = {
    isLoading: false,
    isError: false,
}

export const learningCourseSlice = createSlice({
    name: 'learningCourse',
    initialState,
    reducers: {
        createReviewForLearningCourse: (state, action: PayloadAction<ReviewLearningCourse>) => {
            if (state.learningCourses) {
                state.learningCourses.forEach((learningCourse, index) => {
                    const learningCourseId = action.payload.id;
                    const newReview = action.payload.review;
                    if (learningCourse.id === learningCourseId) {
                        if (state.learningCourses) {
                            state.learningCourses[index].review = newReview
                        }
                    }
                })
            }
        },
        updateReviewOfLearningCourse: (state, action: PayloadAction<ReviewLearningCourse>) => {
            if (state.learningCourses) {
                state.learningCourses.forEach((learningCourse, index) => {
                    const learningCourseId = action.payload.id;
                    const newReview = action.payload.review;
                    if (learningCourse.id === learningCourseId) {
                        if (state.learningCourses) {
                            state.learningCourses[index].review.rating = newReview.rating
                            state.learningCourses[index].review.content = newReview.content
                        }
                    }
                })
            }
        },
    }, extraReducers: (builder) => {
        builder
            .addCase(getLearningCourse.pending, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(getLearningCourse.fulfilled, (state, action) => {
                state.learningCourses = action.payload
                state.isError = false;
                state.isLoading = false

            })
            .addCase(getLearningCourse.rejected, (state, action) => {
                console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { createReviewForLearningCourse, updateReviewOfLearningCourse } = learningCourseSlice.actions

export default learningCourseSlice.reducer