import { ProductFilter, ProductPreview } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
import { RootState } from '.'

export interface StoreState {
  products: ProductPreview[]
  scrollPosition: number
  filteredProductCount: number
  isStoreFetching: boolean
}

export const storeInitialState: StoreState = {
  products: [],
  scrollPosition: 0,
  filteredProductCount: 0,
  isStoreFetching: true,
}

export const fetchFilteredProducts = createAsyncThunk(
  'store/fetchFilteredProducts',
  async function ({
    _start,
    _end,
    filters,
  }: {
    _start: number
    _end: number
    filters: ProductFilter
  }) {
    const res = await api.products.getFilteredProducts({
      _start,
      _end,
      filters,
    })

    return { ...res, _start, _end }
  }
)

const storeSlice = createSlice({
  name: 'store',
  initialState: storeInitialState,
  reducers: {
    setStore(state, action: PayloadAction<StoreState>) {
      state.products = action.payload.products
      state.scrollPosition = action.payload.scrollPosition
      state.isStoreFetching = action.payload.isStoreFetching
      state.filteredProductCount = action.payload.filteredProductCount
    },
    setStoreScrollposition(state, action: PayloadAction<number>) {
      state.scrollPosition = action.payload
    },
  },
  extraReducers: (builder) => {
    /** Добавление обработчика на успешное завершение action: fetchShop */
    builder.addCase(fetchFilteredProducts.fulfilled, (state, action) => {
      if (!action.payload._start) {
        state.products = action.payload.products
        state.scrollPosition = 0
        state.filteredProductCount = action.payload.filteredProductCount
      } else state.products = state.products.concat(action.payload.products)

      state.isStoreFetching =
        action.payload._end < action.payload.filteredProductCount
    })
  },
})

const { reducer } = storeSlice
export { reducer as storeReducer }

export const selectStore = (state: RootState) => state.store

export const { setStore, setStoreScrollposition } = storeSlice.actions
