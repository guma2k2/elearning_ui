import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
    type: "dark" | "light";
}

const initialState: ThemeState = {
    type: "light",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme(state) {
            state.type = state.type === "dark" ? "light" : "dark";
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
