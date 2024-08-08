import { OrderProduct, ProductPreview } from 'src/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '.'

export interface ShoppingCartState {
  orderProducts: OrderProduct[]
  totalPrice: number
  promocode: string
}

export const initialState: ShoppingCartState = {
  orderProducts: [],
  totalPrice: 0,
  promocode: '',
}

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    setPromocode(state, action: PayloadAction<string>) {
      state.promocode = action.payload
    },
    setShoppingCart(
      state,
      action: PayloadAction<{
        orderProducts: OrderProduct[]
        promocode?: string
      }>
    ) {
      state.orderProducts = action.payload.orderProducts
      state.promocode = action.payload.promocode || ''
      state.totalPrice = action.payload.orderProducts.reduce(
        (total, item) => total + item.price * item.numItemsToBuy,
        0
      )
    },
    addCartItem(state, action: PayloadAction<ProductPreview>) {
      state.orderProducts.push({
        id: action.payload.id,
        name: action.payload.name,
        back: action.payload.back,
        price: action.payload.price,
        preview: action.payload.preview,
        maxAvailable: action.payload.maxAvailable,
        numItemsToBuy: 1,
      })

      state.totalPrice += action.payload.price
    },
    deleteCartItem(state, action: PayloadAction<number>) {
      const index = state.orderProducts.findIndex(
        (item) => item.id === action.payload
      )

      if (index !== -1) {
        const item = state.orderProducts[index]
        state.totalPrice -= item.price * item.numItemsToBuy
        state.orderProducts.splice(index, 1)
      }
    },
    updateCartItem(
      state,
      action: PayloadAction<{ id: number; numItemsToBuy: number }>
    ) {
      const item = state.orderProducts.find(
        (item) => item.id === action.payload.id
      )

      if (item) {
        const dif = action.payload.numItemsToBuy - item.numItemsToBuy
        state.totalPrice += dif * item.price
        item.numItemsToBuy = action.payload.numItemsToBuy
      }
    },
  },
})

const { reducer } = shoppingCartSlice
export { reducer as shoppingCartReducer }

export const selectOrderProducts = (state: RootState) =>
  state.shoppingCart.orderProducts
export const selectShoppingCart = (state: RootState) => state.shoppingCart

export const {
  addCartItem,
  deleteCartItem,
  updateCartItem,
  setShoppingCart,
  setPromocode,
} = shoppingCartSlice.actions
