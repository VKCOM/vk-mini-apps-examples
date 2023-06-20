/// <reference lib="WebWorker" />
import * as api from './controllers'

declare const self: ServiceWorkerGlobalScope
const CACHE_NAME = 'vk-shop'

enum Action {
  StartInfo = 'startInfo',
  Store = 'storeProducts',
  ProductInfo = 'product',
}

/** Ищем кодовое слово для загрузки контента из Action */
function getAction(url: string) {
  const action = url.match(/(\w+)($|\?)/)
  return action ? action[1] ?? '' : ''
}

function matchAnswer(request: Request) {
  const action = getAction(request.url)
  switch (action) {
    case Action.StartInfo: {
      return api.getStartInfo()
    }
    case Action.Store: {
      return api.getStoreInfo(request.url)
    }
    case Action.ProductInfo: {
      return api.getProductInfo(request.url)
    }
    default:
      return fetch(request)
  }
}

self.addEventListener('install', () => {
  console.log('ServiceWorker installed')
})

/** Удаляем устаревшие данные */
self.addEventListener('activate', (event) => {
  self.clients.claim()
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
