import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'


export type Message = {
    isShow?: boolean,
    type: "success" | "error" | "warning",
    content: string,
    duration?: number
}
const initialState: Message = {
    isShow: false,
    type: "success",
    content: ""
}

export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        updateShowing: (state, action: PayloadAction<Message>) => {
            state.isShow = !state.isShow
            state.content = action.payload.content;
            state.type = action.payload.type
            if (action.payload.duration) {
                state.duration = action.payload.duration;
            }
        },
    }
})

export const { updateShowing } = messageSlice.actions

export const selectMessage = (state: RootState) => state.messages
export default messageSlice.reducer