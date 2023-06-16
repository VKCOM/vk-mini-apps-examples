import { PRODUCTS } from '../config'
import { getParams } from '../getParams'

/** Получение данных из каталога с учетом выбранных пользователем фильтров */
export function getStoreInfo(url: string) {
  const params = getParams(url)
  const filters = params.filters ? JSON.parse(params.filters) : {}

  // Выбираем из общего списка только подходящие товары
  const products = PRODUCTS.filter((product) => {
    if ('query' in filters && filters.query) {
      if (!product.name.toLowerCase().includes(filters.query.toLowerCase()))
        return false
    }

    if ('priceTo' in filters) {
      if (product.price > filters.priceTo) return false
    }

    if ('priceFrom' in filters) {
      if (product.price < filters.priceFrom) return false
    }

    if ('categoryId' in filters && filters.categoryId) {
      const categoryId = Number(filters.categoryId)
      if (!product.categoryId.some((id) => id === categoryId)) return false
    }

    return true
  })

  const start = params.start ? Number(params.start) : 0
  const end = params.end ? Number(params.end) : products.length

  return new Response(
    JSON.stringify({
      products: products.slice(start, end),
      maxProducts: products.length,
    })
  )
}
