import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getCategoryParents } from '../../services/CategoryService'
interface CategoryState {
    categoryParents?: CategoryListGetType[]
    isLoading: boolean
    isError: boolean,
}

export const fetchCategoryParents = createAsyncThunk(
    'category/fetchCategoryParents',
    async () => {
        const response = await getCategoryParents();
        const data = response.data as CategoryListGetType[];
        return data;
    },
)
// Define the initial state using that type
const initialState: CategoryState = {
    isLoading: false,
    isError: false
}

export const categorySlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        updateDataStatus: (state) => {

        },
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryParents.pending, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchCategoryParents.fulfilled, (state, action) => {
                console.log(action);
                state.categoryParents = action.payload
                state.isError = false;
                state.isLoading = false;
            })
            .addCase(fetchCategoryParents.rejected, (state, action) => {
                console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { updateDataStatus } = categorySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses
export default categorySlice.reducer