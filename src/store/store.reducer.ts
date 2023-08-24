import { ProductFilter, ProductPreview } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
import { RootState } from '.'

export interface StoreState {
  products: ProductPreview[]
  scrollPosition: number
  isStoreFetching: boolean
}

export const storeInitialState: StoreState = {
  products: [],
  scrollPosition: 0,
  isStoreFetching: true,
}

/** Запрос на определенного количества филтрованных товаров при помощи асинхронного action: fetchFilteredProducts */
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
    setStoreScrollposition(state, action: PayloadAction<number>) {
      state.scrollPosition = action.payload
    },
  },
  extraReducers: (builder) => {
    /** Добавление обработчика на успешное завершение action: fetchFilteredProducts */
    builder.addCase(fetchFilteredProducts.fulfilled, (state, action) => {
      if (!action.payload._start) {
        state.products = action.payload.products
        state.scrollPosition = 0
      } else state.products = state.products.concat(action.payload.products)

      state.isStoreFetching =
        action.payload._end < action.payload.filteredProductCount
    })
  },
})

const { reducer } = storeSlice
export { reducer as storeReducer }

export const selectStore = (state: RootState) => state.store

export const { setStoreScrollposition } = storeSlice.actions
