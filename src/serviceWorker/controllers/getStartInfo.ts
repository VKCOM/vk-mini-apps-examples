import { CATEGORIES, PRODUCTS } from '../config'

/** Получаем контент стартовой страницы */
export function getStartInfo() {
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
    name: 'Vk-store',
    logo: 'https://sun9-49.userapi.com/impg/VvBrmSqJOaJCKUmct78UWoZP0T49ETtD-kqEAA/mqePuJTVaVo.jpg?size=710x710&quality=95&sign=8f0f4cbf370abe117fc5dfcbee610aa6&type=album',
    maxPrice,
    minPrice,
  }
  return new Response(
    JSON.stringify({
      products: shuffled.slice(0, 9),
      categories,
      shopInfo,
    })
  )
}
