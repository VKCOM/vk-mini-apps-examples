import { ProductFilter } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'
import { ProductCardProps } from 'src/components'

interface GetProductsRequest {
  _start: number
  _end: number
  filters: ProductFilter
}

interface GetProductsResponse {
  data: Array<ProductCardProps & { id: number }>
  maxProducts: number
}

export const getProducts = async ({
  _start,
  _end,
  filters,
}: GetProductsRequest): Promise<GetProductsResponse> => {
  const data = await makeRequest<GetProductsResponse>({
    path: 'photos',
    params: {
      _start: _start.toString(),
      _end: _end.toString(),
      filters: encodeURIComponent(JSON.stringify(filters)),
    },
    requestOptions: {
      method: 'get',
    },
  })

  //? замоканные данные(на время пока нет реалного сервера)
  return {
    data: data.data.map((item, index) => ({
      id: index + _start,
      name: 'Maxmara TJ collection',
      productType: 'футболка',
      price: 123,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Unreachable code error
      preview: item.url,
    })),
    maxProducts: 100
  }
}
