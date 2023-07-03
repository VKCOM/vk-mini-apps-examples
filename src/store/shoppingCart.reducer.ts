import { OrderProduct } from 'src/types'
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
        (total, item) => total + item.price * item.productNumber,
        0
      )
    },
    addCartItem(state, action: PayloadAction<OrderProduct>) {
      state.orderProducts.push(action.payload)
      state.totalPrice += action.payload.productNumber * action.payload.price
    },
    deleteCartItem(state, action: PayloadAction<number>) {
      const index = state.orderProducts.findIndex(
        (item) => item.id === action.payload
      )

      if (index !== -1) {
        const item = state.orderProducts[index]
        state.totalPrice -= item.price * item.productNumber
        state.orderProducts.splice(index, 1)
      }
    },
    updateCartItem(
      state,
      action: PayloadAction<{ id: number; productNumber: number }>
    ) {
      const item = state.orderProducts.find(
        (item) => item.id === action.payload.id
      )

      if (item) {
        const dif = action.payload.productNumber - item.productNumber
        state.totalPrice += dif * item.price
        item.productNumber = action.payload.productNumber
      }
    },
  },
})

const { reducer } = shoppingCartSlice
export { reducer as shoppingCartReducer }
export const { addCartItem, deleteCartItem, updateCartItem, setShoppingCart } =
  shoppingCartSlice.actions
