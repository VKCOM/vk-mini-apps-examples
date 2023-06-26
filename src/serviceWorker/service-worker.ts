/// <reference lib="WebWorker" />
import { ApiEndpoint } from '../types'
import * as api from './controllers'

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = 'my-offline-cache'
const urlsToCache = [
  '/',
  '/static/css/main.50433c98.css',
  '/static/js/main.61eb03a2.js',
]

/** Ищем кодовое слово для загрузки контента из Action */
function getAction(url: string) {
  const action = url.match(/(\w+)($|\?)/)
  return action ? action[1] ?? '' : ''
}

function matchAnswer(request: Request) {
  const action = getAction(request.url)
  switch (action) {
    case ApiEndpoint.InitialData: {
      return api.getInitialData()
    }
    case ApiEndpoint.FilteredProducts: {
      return api.getFilteredProducts(request.url)
    }
    case ApiEndpoint.ProductInfo: {
      return api.getProductInfo(request.url)
    }
    default:
      return caches.match(request).then(function (response) {
        return response ?? fetch(request)
      })
  }
}

self.addEventListener('install', (event) => {
  console.log('ServiceWorker installed')
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache)
    })
  )
})

/** Удаляем устаревшие данные */
self.addEventListener('activate', () => {
  /** Принудительно запускаем sw */
  self.clients.claim()
})

/** Перехват сетевых запросов */
self.addEventListener('fetch', (event) => {
  event.respondWith(matchAnswer(event.request))
})
