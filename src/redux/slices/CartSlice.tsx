import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CartType, } from '../../types/CartType'
import { getCarts } from '../../services/CartService'
interface AuthState {
    carts?: CartType[]
    isLoading: boolean
    isError: boolean,
}

export const getCartsByUser = createAsyncThunk(
    'cart/get',
    async () => {
        const response = await getCarts();
        const data = response.data as CartType[];
        return data;
    },
)
const initialState: AuthState = {
    isLoading: false,
    isError: false,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCartAction: (state, action: PayloadAction<CartType>) => {
            let isAdded: boolean = false;
            const payload = action.payload;
            if (state.carts) {
                state.carts.forEach((cart) => {
                    if (cart.id == payload.id) {
                        isAdded = true;
                    }
                })
            }
            if (!isAdded) {
                if (state.carts) {
                    state.carts.push(payload);
                } else {
                    state.carts = [payload];
                }
            }
        },
        deleteCart: (state, action) => {
            const cartId = action.payload as number
            if (state.carts) {
                state.carts.splice(state.carts.findIndex((cart) => cart.id === cartId), 1)
            }
        },
        deleteCartBuyLater: (state) => {
            if (state.carts) {
                state.carts = state.carts.filter(cart => cart.buyLater);
            }
        },
        updateCart: (state, action) => {
            const cartId = action.payload as number
            if (state.carts) {
                state.carts.forEach((cart) => {
                    if (cart.id === cartId) {
                        cart.buyLater = !cart.buyLater;
                    }
                })
            }
        },
        resetCart: (state) => {
            if (state.carts) {
                state.carts = undefined
            }
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(getCartsByUser.pending, (state, _action) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(getCartsByUser.fulfilled, (state, action) => {
                state.carts = action.payload
                state.isError = false;
                state.isLoading = false
            })
            .addCase(getCartsByUser.rejected, (state, _action) => {
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { deleteCart, resetCart, updateCart, addToCartAction, deleteCartBuyLater } = cartSlice.actions

export default cartSlice.reducer