import { Category, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetUserRequest {
  userId: number
}

interface GetUserResponse {
  categories: Category[]
  products: Product[]
  storeInfo: {
    name: string,
    logo: string
  }
}

export const get = async ({
  userId,
}: GetUserRequest): Promise<GetUserResponse> => {
  const data = await makeRequest<{data: GetUserResponse}>({
    path: 'startInfo',
    params: {
      userId: userId.toString(),
      limit: '10'
    },
    requestOptions: {
      method: 'get',
    },
  })


  return data.data
}
