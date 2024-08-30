import { createAsyncThunk, createSlice, current, isRejectedWithValue } from '@reduxjs/toolkit'
import Cookies from 'universal-cookie';
import { RootState } from '../store'
import { jwtDecode } from "jwt-decode";
import { AuthType, LoginRequest, LoginResponse } from '../../types/AuthType'
import { loginUser } from "../../services/AuthService"
import { AxiosError } from 'axios';
import { ErrorType } from '../../types/ErrorType';
interface AuthState {
    auth?: LoginResponse
    isLoading: boolean
    isError: boolean,
    isLoggin: boolean,
}

export const login = createAsyncThunk(
    'auth/login',
    async (request: LoginRequest) => {
        try {
            const response = await loginUser(request);
            const data = response.data as LoginResponse;
            return data;
        } catch (error: AxiosError | any) {
            if (error.response) {
                console.log(error.response.data);
                const data = error.response.data as ErrorType;
                let message = data.details;
                if (message == "User is disabled") {
                    message = "Tài khoản của bạn đã bị khóa";
                }
                alert(message);
            }
            return null;
        }

    },
)
// Define the initial state using that type
const initialState: AuthState = {
    isLoading: false,
    isError: false,
    isLoggin: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        saveUserProfile: (state, action) => {
            const payload = action.payload as LoginResponse
            state.auth = payload;
            state.isLoggin = true;
            const token = payload.token as string
            // const decoded = jwtDecode(token);
            // const cookies = new Cookies();
            // if (decoded.exp) {
            //     cookies.set('token', token, { expires: new Date(decoded.exp * 1000) });
            // }

            localStorage.setItem("token", token)


        },
        updateUserProfile: (state, action) => {
            const payload = action.payload as AuthType
            if (state.auth) {
                state.auth.user = payload
            }
        },
        logOut: (state) => {
            if (state.auth) {
                state.auth = undefined
            }
            // const cookies = new Cookies();
            // cookies.remove('token', { path: '/' });
            // cookies.remove('token', { path: '/admin' });
            // const token = cookies.get('token');
            localStorage.removeItem("token");
            state.isLoading = false
            state.isError = false
            state.isLoggin = false
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
                if (action.payload != null) {
                    const payload = action.payload as LoginResponse
                    localStorage.setItem("token", payload.token)
                    // const token = payload.token as string
                    // const decoded = jwtDecode(token);
                    // const cookies = new Cookies();
                    // if (decoded.exp) {
                    //     cookies.set('token', token, { expires: new Date(decoded.exp * 1000) });
                    // }
                    state.auth = payload;
                    state.isError = false;
                    state.isLoading = false
                    state.isLoggin = true;
                }

            })
            .addCase(login.rejected, (state, action) => {
                console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { saveUserProfile, logOut, updateUserProfile } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses
export default authSlice.reducer