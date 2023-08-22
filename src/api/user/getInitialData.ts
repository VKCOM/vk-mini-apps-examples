import { ApiEndpoint, Category } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetUserResponse {
  categories: Category[]
  shopInfo: {
    name: string
    logo: string
  }
}

/** Получение данных магазина и рекомендованных пользователю товаров */
export const getInitialData = async (): Promise<GetUserResponse> => {
  return await makeRequest<GetUserResponse>({
    endpoint: ApiEndpoint.InitialData,
  })
}
