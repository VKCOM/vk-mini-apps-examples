import { Category, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetUserRequest {
  userId: string
}

interface GetUserResponse {
  categories: Category[]
  products: Product[]
  shopInfo: {
    name: string,
    logo: string,
    maxPrice: number,
    minPrice: number,
  }
}

export const get = async ({
  userId,
}: GetUserRequest): Promise<GetUserResponse> => {
  const data = await makeRequest<{data: GetUserResponse}>({
    path: 'startInfo',
    params: {
      userId: userId,
      limit: '10'
    },
    requestOptions: {
      method: 'get',
    },
  })


  return data.data
}
