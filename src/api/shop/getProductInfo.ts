import { ApiEndpoint, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

export interface GetProductInfoRequest {
  productId: number
}

/** Получение информации по конкретному товару */
export const getProductInfo = async ({
  productId,
}: GetProductInfoRequest): Promise<Product> => {
  return await makeRequest<Product>({
    endpoint: ApiEndpoint.ProductInfo,
    params: {
      id: productId.toString(),
    },
  })
}
