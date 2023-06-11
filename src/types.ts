export interface Product {
  id: number
  name: string 
  productType: string
  price: number
  description: string 
  preview: string 
  photos: string[]
  categoryId: number[]
  maxAvailable: number 
}

export type ProductPreview = Omit<
  Product,
  'categoryId' | 'photos' | 'description'
>

export type OrderProduct = ProductPreview & { productNumber: number }

export interface Category {
  id: number
  name: string
  productCount: number
}

export interface Order {
  productId: number
  quantity: number
}

export interface Basket {
  userId: number
  orders: Order[]
}

export interface ProductFilter {
  priceFrom?: number
  priceTo?: number
  categoryId?: string
  query?: string
}
