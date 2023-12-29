import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    themeMode: 'light',
    themeColor: '#00a76f'
}
export const themeSlice = createSlice({
    name: 'themeSetup',
    initialState,
    reducers: {
        toggleMode: (state, action)=>{
            state.themeMode = action.payload
            // state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
        },
        setThemeColor: (state, action)=> {
            state.isLoggedIn = false;
            state.themeColor = action.payload;
          },
    },
})

export const { toggleMode, setThemeColor } = themeSlice.actions
export default themeSlice.reducer