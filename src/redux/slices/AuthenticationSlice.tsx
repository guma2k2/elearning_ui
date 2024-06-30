import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { AuthType, LoginRequest } from '../../types/AuthType'
import { loginUser } from "../../services/AuthService"
interface AuthState {
    auth?: AuthType
    isLoading: boolean
    isError: boolean,
    isLoggin: boolean,
}

export const login = createAsyncThunk(
    'auth/login',
    async (request: LoginRequest) => {
        const response = await loginUser(request);
        const data = response.data as AuthType;
        return data;
    },
)
// Define the initial state using that type
const initialState: AuthState = {
    isLoading: false,
    isError: false,
    isLoggin: false
}

export const authSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        updateUserProfile: (state) => {

        },
    }, extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = true;
                state.isLoggin = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.auth = action.payload;
                state.isError = false;
                state.isLoading = false
                state.isLoggin = true;

            })
            .addCase(login.rejected, (state, action) => {
                console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses
export default authSlice.reducer