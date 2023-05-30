import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserStoreState {
  name: string
  onboadrdingComplete: boolean
}

const initialState: UserStoreState = {
  name: '',
  onboadrdingComplete: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.name = action.payload
    },

    setOnboardingComplete(state, action: PayloadAction<boolean>) {
      state.onboadrdingComplete = action.payload
    },
  },
})

const { reducer } = userSlice
export { reducer as userReducer }
export const { setUserName, setOnboardingComplete } = userSlice.actions
