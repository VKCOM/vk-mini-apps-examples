import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

export interface UserState {
  id?: number
  name: string
  onboadrdingComplete: boolean
}

const initialState: UserState = {
  id: undefined,
  name: '',
  onboadrdingComplete: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<{ id: number; name: string }>) {
      state.name = action.payload.name
      state.id = action.payload.id
    },

    setOnboardingComplete(state, action: PayloadAction<boolean>) {
      state.onboadrdingComplete = action.payload
    },
  },
})

const { reducer } = userSlice
export { reducer as userReducer }

export const selectOnboardingComplete = (state: RootState) =>
  state.user.onboadrdingComplete

export const { setUserData, setOnboardingComplete } = userSlice.actions
