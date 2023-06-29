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
  const data = await makeRequest<{ data: GetProductInfoResponse }>({
    path: ApiEndpoint.ProductInfo,
    params: {
      id: productId.toString(),
    },
    requestOptions: {
      method: 'get',
    },
  })

  return data.data
}
