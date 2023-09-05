import { ProductFilter, ProductPreview } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'
import * as api from 'src/api'

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
    end,
    start,
    filters,
  }: {
    end: number
    start: number
    filters: ProductFilter
  }) {
    const res = await api.products.getFilteredProducts({
      end,
      start,
      filters,
    })

    return { ...res, start, end }
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
      if (!action.payload.start) {
        state.products = action.payload.products
        state.scrollPosition = 0
      } else state.products = state.products.concat(action.payload.products)

      state.isStoreFetching =
        action.payload.end < action.payload.filteredProductCount
    })
  },
})

const { reducer } = storeSlice
export { reducer as storeReducer }

export const selectStore = (state: RootState) => state.store

export const { setStoreScrollposition } = storeSlice.actions
