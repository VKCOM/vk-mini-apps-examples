import { Category, ProductFilter, ShopInfo } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
import { RootState } from '.'
export interface AppState {
  shopInfo: ShopInfo
  filters: ProductFilter
  categories: Category[]
}

export const appInitialState: AppState = {
  shopInfo: {
    logo: '',
    name: '',
  },
  filters: {categoryId: '0'},
  categories: [],
}

/** Запрос на получения контента через асинхронный action: fetchShop */
export const fetchShop = createAsyncThunk('app/fetchShop', async function () {
  return await api.user.getInitialData()
})

const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setProductFilters(state, action: PayloadAction<ProductFilter>) {
      state.filters = action.payload
    },
    setFiltersCategory(state, action: PayloadAction<string>) {
      state.filters.categoryId = action.payload
    },
    setFiltersQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload
    },
    setFiltersPriceRange(
      state,
      action: PayloadAction<{ priceFrom?: number; priceTo?: number }>
    ) {
      state.filters.priceFrom = action.payload.priceFrom
      state.filters.priceTo = action.payload.priceTo
    },
  },
  extraReducers: (builder) => {
    /** Добавление обработчика на успешное завершение action: fetchShop */
    builder.addCase(fetchShop.fulfilled, (state, action) => {
      state.shopInfo = action.payload.shopInfo
      state.categories = action.payload.categories
    })
  },
})

const { reducer } = appSlice
export { reducer as appReducer }

export const selectCategories = (state: RootState) => state.app.categories
export const selectFilters = (state: RootState) => state.app.filters
export const selectPriceTo= (state: RootState) => state.app.filters.priceTo
export const selectPriceFrom= (state: RootState) => state.app.filters.priceFrom
export const selectShopName = (state: RootState) => state.app.shopInfo.name
export const selectShopLogo = (state: RootState) => state.app.shopInfo.logo

export const {
  setProductFilters,
  setFiltersCategory,
  setFiltersQuery,
  setFiltersPriceRange,
} = appSlice.actions
