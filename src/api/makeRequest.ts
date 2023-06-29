import axios, { AxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'

const API_URL = 'https://vkStore.com'

/** Функция, выполняющая повторный API-запрос в случае неудачи первого запроса. */
axiosRetry(axios, {
  retries: 3,
  retryDelay: () => {
    return 1000
  },
})

interface Arguments {
  /** API метод - url */
  path: string

  /** Query параметры */
  params?: Record<string, string>

  /** Axios request options */
  requestOptions?: AxiosRequestConfig
}

/** Обертка над axios запросом */
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
