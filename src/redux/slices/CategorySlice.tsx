import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit'
// import type { PayloadAction } from '@reduxjs/toolkit'
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
        console.log(data);

        return data;
    },
)
// Define the initial state using that type
const initialState: CategoryState = {
    isLoading: false,
    isError: false
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        updateDataStatus: (_state) => {

        },
    }, extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryParents.pending, (state, _action) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchCategoryParents.fulfilled, (state, action) => {
                state.categoryParents = action.payload
                state.isError = false;
                state.isLoading = false;
            })
            .addCase(fetchCategoryParents.rejected, (state, _action) => {
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { updateDataStatus } = categorySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses
export default categorySlice.reducer