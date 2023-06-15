import {
  Category,
  OrderProduct,
  ProductFilter,
  ProductPreview,
  ShopInfo,
} from 'src/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as api from 'src/api'
export interface AppStoreState {
  shopInfo: {
    logo: string
    name: string
    minPrice: number
    maxPrice: number
  }
  shoppingCart: {
    orderProducts: OrderProduct[]
    totalPrice: number
  }
  store: {
    products: ProductPreview[]
    scrollPosition: number
  }
  filters: ProductFilter
  categories: Category[]
  recomendedProducts: ProductPreview[]
}

export const initialState: AppStoreState = {
  shopInfo: {
    logo: '',
    name: '',
    maxPrice: 0,
    minPrice: 0,
  },
  shoppingCart: {
    orderProducts: [],
    totalPrice: 0,
  },
  store: {
    products: [],
    scrollPosition: 0,
  },
  filters: {},
  recomendedProducts: [],
  categories: [],
}

export const fetchShop = createAsyncThunk(
  'app/fetchShop',
  async function ({ userId }: { userId: string }, { dispatch }) {
    const { products, categories, shopInfo } = await api.user.get({ userId })
    dispatch(setRecomendedProducts(products))
    dispatch(setCategories(categories))
    dispatch(setShopInfo(shopInfo))
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload
    },
    setRecomendedProducts(state, action: PayloadAction<ProductPreview[]>) {
      state.recomendedProducts = action.payload
    },
    setStoreScrollposition(state, action: PayloadAction<number>) {
      state.store.scrollPosition = action.payload
    },
    addStoreProducts(state, action: PayloadAction<ProductPreview[]>) {
      state.store.products = state.store.products.concat(action.payload)
    },
    setShoppingCart(state, action: PayloadAction<OrderProduct[]>) {
      state.shoppingCart.orderProducts = action.payload
      state.shoppingCart.totalPrice = action.payload.reduce(
        (total, item) => total + item.price * item.productNumber,
        0
      )
    },
    setProductFilters(state, action: PayloadAction<ProductFilter>) {
      state.filters = action.payload
      state.store = initialState.store
    },
    addCartItem(state, action: PayloadAction<OrderProduct>) {
      state.shoppingCart.orderProducts.push(action.payload)
      state.shoppingCart.totalPrice +=
        action.payload.productNumber * action.payload.price
    },
    deleteCartItem(state, action: PayloadAction<number>) {
      const index = state.shoppingCart.orderProducts.findIndex(
        (item) => item.id === action.payload
      )

      if (index !== -1) {
        const item = state.shoppingCart.orderProducts[index]
        state.shoppingCart.totalPrice -= item.price * item.productNumber
        state.shoppingCart.orderProducts.splice(index, 1)
      }
    },
    updateCartItem(
      state,
      action: PayloadAction<{ id: number; productNumber: number }>
    ) {
      const item = state.shoppingCart.orderProducts.find(
        (item) => item.id === action.payload.id
      )

      if (item) {
        const dif = action.payload.productNumber - item.productNumber
        state.shoppingCart.totalPrice += dif * item.price
        item.productNumber = action.payload.productNumber
      }
    },
    setShopInfo(state, action: PayloadAction<ShopInfo>) {
      state.shopInfo = action.payload
    },
  },
})

const { reducer } = appSlice
export { reducer as appReducer }
export const {
  setShopInfo,
  addCartItem,
  setCategories,
  deleteCartItem,
  updateCartItem,
  setShoppingCart,
  addStoreProducts,
  setProductFilters,
  setRecomendedProducts,
  setStoreScrollposition,
} = appSlice.actions
