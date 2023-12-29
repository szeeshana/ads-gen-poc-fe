import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    loading: false,
    user: null,
    error: null,
    success: false,
}
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action){
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
          },
          allUser(state, action) {
            state.user.role = action.payload;
          },
    },
})

// Define a thunk that dispatches those action creators
// const fetchUsers = () => async (dispatch) => {
//     dispatch(login())
//     const response = await usersAPI.fetchAll()
//     dispatch(allUser(response.data))
//   }

export const { login, logout, allUser } = authSlice.actions
export default authSlice.reducer