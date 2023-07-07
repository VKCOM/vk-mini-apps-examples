import { ApiEndpoint, Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetProductInfoRequest {
  productId: number
}
interface GetProductInfoResponse {
  product: Product
}

/** Получение информации по конкретному товару */
export const getProductInfo = async ({
  productId,
}: GetProductInfoRequest): Promise<GetProductInfoResponse> => {
  return await makeRequest<GetProductInfoResponse>({
    path: ApiEndpoint.ProductInfo,
    params: {
      id: productId.toString(),
    },
  })
}
