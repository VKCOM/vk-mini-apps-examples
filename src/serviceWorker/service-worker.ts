/// <reference lib="WebWorker" />
import { PRODUCTS, CATEGORIES } from './config'

declare const self: ServiceWorkerGlobalScope
const CACHE_NAME = 'vk-shop'

enum Action {
  StartInfo = 'startInfo',
  Store = 'store',
  ProductInfo = 'productInfo',
}

/** Заполняем кэш */
self.addEventListener('install', () => {
  console.log('ServiceWorker installed')
})

function getParams(queryParams: string) {
  return JSON.parse(
    '{"' + queryParams.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    function (key, value) {
      return key === '' ? value : decodeURIComponent(value)
    }
  )
}

function getAction(url: string) {
  const action = url.match(/(\w+)($|\?)/)
  return action ? action[1] ?? '' : ''
}

function getStartInfo() {
  const storeInfo = {
    name: 'Vk-store',
    logo: 'https://sun9-49.userapi.com/impg/VvBrmSqJOaJCKUmct78UWoZP0T49ETtD-kqEAA/mqePuJTVaVo.jpg?size=710x710&quality=95&sign=8f0f4cbf370abe117fc5dfcbee610aa6&type=album',
  }
  return new Response(
    JSON.stringify({
      products: PRODUCTS.slice(0),
      categories: CATEGORIES,
      storeInfo,
    })
  )
}

function getStoreInfo(url: string) {
  const params = getParams(url)
  const filters = JSON.parse(params.filters)
  const products = PRODUCTS.filter((product) => {
    let isQuery = true
    let isPriceTo = true
    let isPriceFrom = true
    let isCategory = true

    if ('query' in filters && filters.query) {
      isQuery = product.name.toLowerCase().includes(filters.query.toLowerCase())
    }
    if ('priceTo' in filters) {
      isPriceTo = product.price <= filters.priceTo
    }
    if ('priceFrom' in filters) {
      isPriceFrom = product.price >= filters.priceFrom
    }

    if ('categoryId' in filters && filters.categoryId) {
      isCategory = product.categoryId.some(
        (id) => id === Number(filters.categoryId)
      )
    }
    return isQuery && isPriceTo && isPriceFrom && isCategory
  })
  return new Response(
    JSON.stringify({
      products,
      maxProducts: products.length,
    })
  )
}

function getProductInfo(url: string) {
  const params = getParams(url)
  const product = PRODUCTS.find((product) => product.id === Number(params.id))
  return new Response(JSON.stringify({ product }))
}

function matchAnswer(request: Request) {
  const action = getAction(request.url)
  switch (action) {
    case Action.StartInfo: {
      return getStartInfo()
    }
    case Action.Store: {
      return getStoreInfo(request.url)
    }
    case Action.ProductInfo: {
      return getProductInfo(request.url)
    }
    default:
      return fetch(request)
  }
}

/** Удаляем устаревшие данные */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) caches.delete(cache)
        })
      )
    })
  )
})

/** Перехват сетевых запросов */
self.addEventListener('fetch', (event) => {
  event.respondWith(matchAnswer(event.request))
})
