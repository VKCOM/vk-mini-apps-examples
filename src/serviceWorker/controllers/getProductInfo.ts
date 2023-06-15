import { PRODUCTS } from '../config'
import { getParams } from '../getParams'

/** Отдает данные товара по id */
export function getProductInfo(url: string) {
  const params = getParams(url)
  const product = PRODUCTS.find((product) => product.id === Number(params.id))
  return new Response(JSON.stringify({ product }))
}
