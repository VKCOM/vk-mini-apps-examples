import axios, { AxiosRequestConfig } from 'axios' 
import axiosRetry from 'axios-retry' 
// import { API_URL } from 'src/config/constants' 
 
const API_URL = 'https://jsonplaceholder.typicode.com'

axiosRetry(axios, { 
  retries: 3, 
  retryDelay: () => { 
    return 1000 
  }, 
}) 
 
interface Arguments { 
  /** API method as an URL path */ 
  path: string 
 
  /** Query parameters */ 
  params?: Record<string, string> 
 
  /** Axios request options */ 
  requestOptions?: AxiosRequestConfig 
} 
 
export const makeRequest = async <T = never>({ 
  path, 
  params, 
  requestOptions, 
}: Arguments): Promise<T> => { 
  return ( 
    await axios({ 
      method: requestOptions?.method || 'get', 
      url: API_URL + '/' + path, 
      params, 
      ...requestOptions, 
    }) 
  ) as T 
}
