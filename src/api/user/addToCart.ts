import { makeRequest } from 'src/api/makeRequest'

interface AddToCartRequest {
  userId: number
  productId: number
  quantity: number
}

interface AddToCartResponse {
  success: boolean
}

export const addToCart = async ({
  userId,
  productId,
  quantity,
}: AddToCartRequest): Promise<AddToCartResponse> => {
  const data = await makeRequest<AddToCartResponse>({
    path: 'user/addToCart',
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
