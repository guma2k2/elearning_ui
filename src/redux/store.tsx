import { configureStore } from '@reduxjs/toolkit'
import courseReducer from "./slices/CourseSlice"
import messageReducer from './slices/MessageSlice'
import categoryReducer from './slices/CategorySlice'
import authReducer from './slices/AuthenticationSlice'
import learningReducer from './slices/LearningSlice'
export const store = configureStore({
    reducer: {
        courses: courseReducer,
        messages: messageReducer,
        categories: categoryReducer,
        auth: authReducer,
        learning: learningReducer,
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch