import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductCardProps } from 'src/components'

export interface AppStoreState {
  store: {
    products: Array<ProductCardProps & { id: number }>
    scrollPosition: number
  }
}

const initialState: AppStoreState = {
  store: {
    products: [],
    scrollPosition: 0,
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setStoreScrollposition(state, action: PayloadAction<number>) {
      state.store.scrollPosition = action.payload
    },
    addStoreProducts(
      state,
      action: PayloadAction<Array<ProductCardProps & { id: number }>>
    ) {
      state.store.products = state.store.products.concat(action.payload)
    },
  },
})

const { reducer } = appSlice
export { reducer as appReducer }
export const { setStoreScrollposition, addStoreProducts } = appSlice.actions
