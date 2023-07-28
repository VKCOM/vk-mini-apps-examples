import { ApiEndpoint, Category, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

export interface GetUserRequest {
  userId: string
}

interface GetUserResponse {
  recommendedProducts: Product[]
  categories: Category[]
  shopInfo: {
    name: string
    logo: string
    maxPrice: number
    minPrice: number
  }
}

/** Получение данных магазина и рекомендованных пользователю товаров */
export const getInitialData = async (): Promise<GetUserResponse> => {
  return await makeRequest<GetUserResponse>({
    path: ApiEndpoint.InitialData,
  })
}
