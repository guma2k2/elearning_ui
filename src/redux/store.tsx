import { configureStore } from '@reduxjs/toolkit'
import courseReducer from "./slices/CourseSlice"
import messageReducer from './slices/MessageSlice'
export const store = configureStore({
    reducer: {
        courses: courseReducer,
        messages: messageReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch