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
  const data = await makeRequest<{ data: GetProductInfoResponse }>({
    path: 'productInfo',
    params: {
      tab: '3',
      id: productId.toString(),
    },
    requestOptions: {
      method: 'get',
    },
  })
  console.log(data.data)
  return data.data
}
