export interface Product {
  id: number // 2
  name: string // Щедрая душа
  productType: string // Шоколадка
  price: number // 2000
  description: string // Большая удобная, абсолютно бесполезная
  preview: string // hhtps://image.com
  categoryId: number[] // Продукты
  maxAvailable: number // 23 штуки
}

export interface Category {
  id: number
  name: string
  description: string
  preview: string
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
