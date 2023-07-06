import axios, { AxiosRequestConfig } from 'axios'

const API_URL = 'https://vkStore.com'

interface Arguments {
  /** API метод - url */
  path: string

  /** Query параметры */
  params?: Record<string, string>

  /** Axios request options */
  requestOptions?: AxiosRequestConfig
}

/** Обертка над http запросом, чтобы обеспечить независимость от используемых библиотек */
export const makeRequest = async <T = never>({
  path,
  params,
  requestOptions,
}: Arguments): Promise<T> => {
  return (await axios({
    method: requestOptions?.method || 'get',
    url: API_URL + '/' + path,
    params,
    ...requestOptions,
  })) as T
}
