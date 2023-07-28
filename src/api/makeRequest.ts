const API_URL = 'https://shop-boilerplate-backend.vercel.app'

interface Arguments {
  /** API метод - url */
  path: string

  /** Query параметры */
  params?: Record<string, string>
}

/** Обертка над http запросом, чтобы обеспечить независимость от используемых библиотек */
export const makeRequest = async <T = never>({
  path,
  params,
}: Arguments): Promise<T> => {
  const queryParams = params ? '?' + new URLSearchParams(params) : ''
  return (
    await fetch(API_URL + '/' + path + queryParams)
  ).json() as T
}
