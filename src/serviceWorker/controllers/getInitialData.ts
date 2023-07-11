import { CATEGORIES, PRODUCTS } from '../config'

/** Получаем контент стартовой страницы */
export function getInitialData() {
  let minPrice = PRODUCTS[0].price
  let maxPrice = PRODUCTS[0].price

  PRODUCTS.forEach((item) => {
    if (item.price > maxPrice) maxPrice = item.price
    if (item.price < minPrice) minPrice = item.price
  })

  const categories = CATEGORIES.map((category) => {
    return {
      ...category,
      productCount: PRODUCTS.reduce((res, item) => {
        if (item.categoryId.includes(category.id)) return res + 1
        return res
      }, 0),
    }
  })

  const shuffled = PRODUCTS.sort(() => 0.5 - Math.random())

  const shopInfo = {
    name: 'VK Магазин',
    logo: '/imgs/logo.png',
    maxPrice,
    minPrice,
  }
  return new Response(
    JSON.stringify({
      recommendedProducts: shuffled.slice(0, 9),
      categories,
      shopInfo,
    })
  )
}
