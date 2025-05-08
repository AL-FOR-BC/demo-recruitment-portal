import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    avatar?: string
    fullName?: string
    email?: string
    authority?: string[]
}

const initialState: UserState = {
    // avatar: '',
    // userName: '',
    email: '',
    // authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.avatar = action.payload?.avatar
            state.email = action.payload?.email
            state.fullName = action.payload?.fullName
            // state.authority = action.payload?.authority
        },
        
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
