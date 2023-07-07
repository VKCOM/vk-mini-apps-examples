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
  async function ({ userId }: { userId: string }, { dispatch }) {
    const { recommendedProducts, categories, shopInfo } =
      await api.user.getInitialData({
        userId,
      })
    dispatch(setShopContent({ recommendedProducts, categories, shopInfo }))
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setProductFilters(state, action: PayloadAction<ProductFilter>) {
      state.filters = action.payload
    },
    setShopContent(
      state,
      action: PayloadAction<{
        shopInfo: ShopInfo
        recommendedProducts: ProductPreview[]
        categories: Category[]
      }>
    ) {
      state.shopInfo = action.payload.shopInfo
      state.categories = action.payload.categories
      state.recommendedProducts = action.payload.recommendedProducts
    },
  },
  extraReducers: (builder) => {
    /** Добавление обработчика на успешное завершение action: fetchShop */
    builder.addCase(fetchShop.fulfilled, (state) => {
      state.shopFetching = false
    })
  },
})

const { reducer } = appSlice
export { reducer as appReducer }
export const { setShopContent, setProductFilters } = appSlice.actions
