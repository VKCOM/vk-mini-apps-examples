import { ApiEndpoint, ProductFilter, ProductPreview } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

export interface GetProductsRequest {
  /** Порядковый номер первого возвращаемого товара в списке */
  _start: number

  /** Порядковый номер последнего возвращаемого товара в списке */
  _end: number

  /** Фильтры пользователя */
  filters: ProductFilter
}

export interface GetProductsResponse {
  /** Отфильтрованные продукты с порядковыми номерами от _start до _end */
  products: ProductPreview[]

  /** Общее количество отфильтрованных продуктов */
  filteredProductCount: number
}

/** Получение списка товаров в соответствии с фильтрами */
export const getFilteredProducts = async ({
  _start,
  _end,
  filters,
}: GetProductsRequest): Promise<GetProductsResponse> => {
  return await makeRequest<GetProductsResponse>({
    endpoint: ApiEndpoint.FilteredProducts,
    params: {
      start: _start.toString(),
      end: _end.toString(),
      filters: JSON.stringify(filters),
    },
  })
}
