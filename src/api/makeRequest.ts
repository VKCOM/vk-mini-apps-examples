const API_URL = 'https://shop-boilerplate-backend.vercel.app'

interface Arguments {
  endpoint: string
  params?: Record<string, string>
  requestOptions?: RequestInit,
}

/**
 * Обертка над http запросом, чтобы обеспечить независимость от используемых библиотек 
 * @param endpoint - api endpoint
 * @param params - query параметры запроса в виде объекта
 * @param requestOptions - настройки запроса: method, headers, cashe
 * @returns ответ сервера
 * @example 
  // get запрос
  makeRequest(endpoint: 'productInfo', params: {id: '2'})
  // post запрос
  makeRequest('postProduct', requestOptions: JSON.stringify({method: 'post', body: {id: '2'}}))
 */
export const makeRequest = async <T = never>({
  endpoint,
  params,
  requestOptions
}: Arguments): Promise<T> => {
  const queryParams = params ? '?' + new URLSearchParams(params) : ''
  return (
    await fetch(API_URL + '/' + endpoint + queryParams, requestOptions)
  ).json() as T
}
