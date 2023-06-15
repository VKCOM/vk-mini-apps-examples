import { ProductFilter, ProductPreview } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

interface GetProductsRequest {
  _start: number
  _end: number
  filters: ProductFilter
}

interface GetProductsResponse {
  products: ProductPreview[]
  maxProducts: number
}

export const getProducts = async ({
  _start,
  _end,
  filters,
}: GetProductsRequest): Promise<GetProductsResponse> => {
  const data = await makeRequest<{ data: GetProductsResponse }>({
    path: 'storeProducts',
    params: {
      start: _start.toString(),
      end: _end.toString(),
      filters: JSON.stringify(filters),
    },
    requestOptions: {
      method: 'get',
    },
  })

  return data.data
}
