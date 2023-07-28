import { Product } from 'src/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from 'src/api'

export const initialState: Product = {
  id: -1,
  price: 0,
  name: '',
  preview: '',
  photos: [],
  categoryId: [],
  description: '',
  maxAvailable: 0,
}

/** Запрос на получения контента через асинхронный action: fetchShop */
export const fetchProductInfo = createAsyncThunk(
  'productInfo/fetchproductInfo',
  async function ({ productId }: { productId: number }) {
    return (await api.products.getProductInfo({ productId }))
  }
)

const productInfoSlice = createSlice({
  name: 'productInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /** Добавление обработчика на успешное завершение action: fetchShop */
    builder.addCase(fetchProductInfo.fulfilled, (state, action) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.price = action.payload.price
      state.photos = action.payload.photos
      state.preview = action.payload.preview
      state.categoryId = action.payload.categoryId
      state.description = action.payload.description
      state.maxAvailable = action.payload.maxAvailable
    })
  },
})

const { reducer } = productInfoSlice
export { reducer as productInfoReducer }
