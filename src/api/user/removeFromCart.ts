import { makeRequest } from 'src/api/makeRequest'

interface RemoveFromCartRequest {
  userId: number
  productId: number
  quantity: number
}

interface RemoveFromCartResponse {
  success: boolean
}

export const removeFromCart = async ({
  userId,
  productId,
  quantity,
}: RemoveFromCartRequest): Promise<RemoveFromCartResponse> => {
  const data = await makeRequest<RemoveFromCartResponse>({
    path: 'user/removeFromCart',
    requestOptions: {
      method: 'post',
      data: {
        userId: userId,
        productid: productId,
        quantity: quantity,
      },
    },
  })

  return data
}
