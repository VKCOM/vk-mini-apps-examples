const API_URL = 'https://shop-boilerplate-backend.vercel.app'

interface Arguments {
  /** API метод - url */
  path: string

  /** Query параметры */
  params?: Record<string, string>
  headers?: RequestInit
}

/** Обертка над http запросом, чтобы обеспечить независимость от используемых библиотек */
export const makeRequest = async <T = never>({
  path,
  params,
  headers
}: Arguments): Promise<T> => {
  const queryParams = params ? '?' + new URLSearchParams(params) : ''
  return (
    await fetch(API_URL + '/' + path + queryParams, headers)
  ).json() as T
}
