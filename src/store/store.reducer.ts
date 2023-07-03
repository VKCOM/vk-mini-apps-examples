import { ProductFilter, ProductPreview } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'

export interface StoreState {
  products: ProductPreview[]
  scrollPosition: number
  filteredProductCount: number
}

export const storeInitialState: StoreState = {
  products: [],
  scrollPosition: 0,
  filteredProductCount: 0,
}

export const fetchFilteredProducts = createAsyncThunk(
  'store/fetchFilteredProducts',
  async function (
    {
      _start,
      _end,
      filters,
      onFetched,
    }: {
      _start: number
      _end: number
      filters: ProductFilter
      onFetched: () => void
    },
    { dispatch }
  ) {
    const res = await api.products.getFilteredProducts({
      _start,
      _end,
      filters,
    })
    if (!_start) dispatch(setStore({ ...res, scrollPosition: 0 }))
    else dispatch(addStoreProducts(res.products))
    if (_end >= res.filteredProductCount) onFetched()
  }
)

const storeSlice = createSlice({
  name: 'store',
  initialState: storeInitialState,
  reducers: {
    setStore(state, action: PayloadAction<StoreState>) {
      state.products = action.payload.products
      state.scrollPosition = action.payload.scrollPosition
      state.filteredProductCount = action.payload.filteredProductCount
    },
    setStoreScrollposition(state, action: PayloadAction<number>) {
      state.scrollPosition = action.payload
    },
    setStorefilteredProductCount(state, action: PayloadAction<number>) {
      state.filteredProductCount = action.payload
    },
    addStoreProducts(state, action: PayloadAction<ProductPreview[]>) {
      state.products = state.products.concat(action.payload)
    },
  },
})

const { reducer } = storeSlice
export { reducer as storeReducer }
export const {
  setStore,
  addStoreProducts,
  setStoreScrollposition,
  setStorefilteredProductCount,
} = storeSlice.actions
