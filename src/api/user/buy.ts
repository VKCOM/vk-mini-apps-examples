import { Order } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface BuyRequest {
  userId: number
  orders: Order[]
}

interface BuyResponse {
  success: boolean
}

export const buy = async ({
  userId,
  orders,
}: BuyRequest): Promise<BuyResponse> => {
  const data = await makeRequest<BuyResponse>({
    path: 'user/buy',
    requestOptions: {
      method: 'post',
      data: {
        userId: userId,
        orders: orders,
      },
    },
  })

  return data
}
