import { ApiEndpoint, ProductFilter, ProductPreview } from 'src/types'
import { makeRequest } from 'src/api/makeRequest'

export interface GetProductsRequest {
  /** Порядковый номер первого возвращаемого товара в списке */
  start: number

  /** Порядковый номер последнего возвращаемого товара в списке */
  end: number

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
  end,
  start,
  filters,
}: GetProductsRequest): Promise<GetProductsResponse> => {
  return await makeRequest<GetProductsResponse>({
    endpoint: ApiEndpoint.FilteredProducts,
    params: {
      end: end.toString(),
      start: start.toString(),
      filters: JSON.stringify(filters),
    },
  })
}
