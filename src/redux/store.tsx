import { configureStore, combineReducers } from '@reduxjs/toolkit'
import courseReducer from "./slices/CourseSlice"
import messageReducer from './slices/MessageSlice'
import categoryReducer from './slices/CategorySlice'
import authReducer from './slices/AuthenticationSlice'
import learningReducer from './slices/LearningSlice'
import cartReducer from './slices/CartSlice'
import learningCourseReducer from './slices/LearningCourseSlice'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    storage,
    whiteList: ['auth', 'cart', 'learningCourse']
}
const rootReducer = combineReducers({
    courses: courseReducer,
    messages: messageReducer,
    categories: categoryReducer,
    auth: authReducer,
    learning: learningReducer,
    carts: cartReducer,
    learningCourses: learningCourseReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})
export const persistor = persistStore(store)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch