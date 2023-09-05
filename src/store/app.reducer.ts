import { Category, ImageBackgroundAppereance, Product, ProductFilter, ShopInfo } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
import { RootState } from '.'
export interface AppState {
  productInfo: Product
  categories: Category[]
  shopInfo: ShopInfo
  filters: ProductFilter
}

export const appInitialState: AppState = {
  filters: { categoryId: '0' },
  categories: [],
  shopInfo: {
    logo: '',
    name: '',
  },
  productInfo: {
    id: -1,
    price: 0,
    name: '',
    preview: '',
    back: ImageBackgroundAppereance.Grey,
    photos: [],
    categoryId: [],
    description: '',
    maxAvailable: 0,
  },
}

/** Запрос на получения контента магазина через асинхронный action: fetchShop */
export const fetchShop = createAsyncThunk('app/fetchShop', async function () {
  return await api.user.getInitialData()
})

/** Запрос на получения информации о товаре через асинхронный action: fetchproductInfo */
export const fetchProductInfo = createAsyncThunk(
  'app/fetchproductInfo',
  async function ({ productId }: { productId: number }) {
    return (await api.products.getProductInfo({ productId }))
  }
)

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
    }),
    builder.addCase(fetchProductInfo.fulfilled, (state, action) => {
      state.productInfo = action.payload
    })
  },
})

const { reducer } = appSlice
export { reducer as appReducer }

export const selectProductInfo = (state: RootState) => state.app.productInfo
export const selectCategories = (state: RootState) => state.app.categories
export const selectPriceFrom = (state: RootState) => state.app.filters.priceFrom
export const selectShopLogo = (state: RootState) => state.app.shopInfo.logo
export const selectShopName = (state: RootState) => state.app.shopInfo.name
export const selectFilters = (state: RootState) => state.app.filters
export const selectPriceTo = (state: RootState) => state.app.filters.priceTo

export const {
  setFiltersPriceRange,
  setFiltersCategory,
  setProductFilters,
  setFiltersQuery,
} = appSlice.actions
