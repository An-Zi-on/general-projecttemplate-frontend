import myAxios from '@/globalconfig/anxious'
import type { AxiosRequestConfig } from 'axios'

export default function request<T = unknown>(
  url: string,
  options?: AxiosRequestConfig,
): Promise<T> {
  return myAxios({
    url,
    ...options,
  }).then((response) => response.data as T)
}
