import { Category, ProductFilter, ProductPreview, ShopInfo } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
export interface AppState {
  shopInfo: ShopInfo
  filters: ProductFilter
  categories: Category[]
  recommendedProducts: ProductPreview[]
  shopFetching: boolean
}

export const appInitialState: AppState = {
  shopInfo: {
    logo: '',
    name: '',
    maxPrice: 0,
    minPrice: 0,
  },
  filters: {},
  recommendedProducts: [],
  categories: [],
  shopFetching: true,
}

/** Запрос на получения контента через асинхронный action: fetchShop */
export const fetchShop = createAsyncThunk(
  'app/fetchShop',
  async function ({ userId }: { userId: string }) {
    return await api.user.getInitialData()
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setProductFilters(state, action: PayloadAction<ProductFilter>) {
      state.filters = action.payload
    },
  },
  extraReducers: (builder) => {
    /** Добавление обработчика на успешное завершение action: fetchShop */
    builder.addCase(fetchShop.fulfilled, (state, action) => {
      state.shopFetching = false
      state.shopInfo = action.payload.shopInfo
      state.categories = action.payload.categories
      state.recommendedProducts = action.payload.recommendedProducts
    })
  },
})

const { reducer } = appSlice
export { reducer as appReducer }
export const { setProductFilters } = appSlice.actions
