import { Category, ProductFilter, ProductPreview, ShopInfo } from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
export interface AppState {
  shopInfo: {
    logo: string
    name: string
    minPrice: number
    maxPrice: number
  }
  filters: ProductFilter
  categories: Category[]
  recomendedProducts: ProductPreview[]
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
  recomendedProducts: [],
  categories: [],
  shopFetching: true,
}

export const fetchShop = createAsyncThunk(
  'app/fetchShop',
  async function ({ userId }: { userId: string }, { dispatch }) {
    const { recommendedProducts, categories, shopInfo } =
      await api.user.getInitialData({
        userId,
      })
    dispatch(setRecomendedProducts(recommendedProducts))
    dispatch(setCategories(categories))
    dispatch(setShopInfo(shopInfo))
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    },
    setRecomendedProducts(state, action: PayloadAction<ProductPreview[]>) {
      state.recomendedProducts = action.payload
    },
    setProductFilters(state, action: PayloadAction<ProductFilter>) {
      state.filters = action.payload
    },
    setShopInfo(state, action: PayloadAction<ShopInfo>) {
      state.shopInfo = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShop.fulfilled, (state) => {
      state.shopFetching = false
    })
  },
})

const { reducer } = appSlice
export { reducer as appReducer }
export const {
  setShopInfo,
  setCategories,
  setProductFilters,
  setRecomendedProducts,
} = appSlice.actions
