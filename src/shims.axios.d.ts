import * as axios from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    el?: string
    text?: string
    silence?: boolean
  }
  // eslint-disable-next-line
  export interface AxiosResponse<T = any> extends Promise<T> {}
  export interface CustomSuccessData<T> {
    [key: string]: T
  }
  // https://github.com/axios/axios/issues/1510#issuecomment-525382535
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }
}
