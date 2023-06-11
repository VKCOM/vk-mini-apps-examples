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
    path: 'store',
    params: {
      _start: _start.toString(),
      _end: _end.toString(),
      filters: JSON.stringify(filters),
    },
    requestOptions: {
      method: 'get',
    },
  })
  console.log(data)

  return data.data
}
