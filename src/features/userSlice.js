import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: "",
  name: "",
  is_admin:"",
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.email = action.payload.email
      state.name = action.payload.name
      state.is_admin = action.payload.is_admin
    },
    unsetUserInfo: (state, action) => {
      state.email = action.payload.email
      state.name = action.payload.name
    },
  }
})

export const { setUserInfo, unsetUserInfo } = userSlice.actions

export default userSlice.reducer