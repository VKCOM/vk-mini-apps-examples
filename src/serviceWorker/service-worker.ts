/// <reference lib="WebWorker" />
import { ApiEndpoint } from '../types'
import * as api from './controllers'

declare const self: ServiceWorkerGlobalScope
declare const clients: Clients

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
      return fetch(request)
  }
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

/** Удаляем устаревшие данные */
self.addEventListener('activate', () => {
  /** Принудительно запускаем sw */
  self.clients.claim()
})

/** Перехват сетевых запросов */
self.addEventListener('fetch', async (event) => {
  event.respondWith(matchAnswer(event.request))

  /** Отправляем сообщение что service-worker начал работу */
  const client = await clients.get(event.clientId)
  if (!client || client.url !== event.request.url) return
  client.postMessage({
    msg: 'Service worker start intercept',
    url: event.request.url,
    selfUrl: client.url,
  })
})
