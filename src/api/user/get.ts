import { Basket, Category, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetUserRequest {
  userId: number
}

interface GetUserResponse {
  basket: Basket
  categories: Category[]
  products: Product[]
}

export const get = async ({
  userId,
}: GetUserRequest): Promise<GetUserResponse> => {
  const data = await makeRequest<GetUserResponse>({
    path: 'user/get',
    params: {
      userId: userId.toString(),
    },
    requestOptions: {
      method: 'get',
    },
  })

  return data
}
