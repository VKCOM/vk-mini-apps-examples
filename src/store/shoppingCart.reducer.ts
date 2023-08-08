import { OrderProduct, ProductPreview } from 'src/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ShoppingCartState {
  orderProducts: OrderProduct[]
  totalPrice: number
}

export const initialState: ShoppingCartState = {
  orderProducts: [],
  totalPrice: 0,
}

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {
    setShoppingCart(state, action: PayloadAction<OrderProduct[]>) {
      state.orderProducts = action.payload
      state.totalPrice = action.payload.reduce(
        (total, item) => total + item.price * item.numItemsToBuy,
        0
      )
    },
    addCartItem(state, action: PayloadAction<ProductPreview>) {
      state.orderProducts.push({
        id: action.payload.id,
        name: action.payload.name,
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
export const { addCartItem, deleteCartItem, updateCartItem, setShoppingCart } =
  shoppingCartSlice.actions
