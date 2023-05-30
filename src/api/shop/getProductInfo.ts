import { Product } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetProductInfoRequest {
  productId: number
}

interface GetProductInfoResponse {
  product: Product
}

/** Данные для страницы "ProductInfo" */
export const getProductInfo = async ({
  productId,
}: GetProductInfoRequest): Promise<GetProductInfoResponse> => {
  const data = await makeRequest<GetProductInfoResponse>({
    path: 'shop/getProductInfo',
    params: {
      productId: productId.toString(),
    },
    requestOptions: {
      method: 'get',
    },
  })

  return data
}
