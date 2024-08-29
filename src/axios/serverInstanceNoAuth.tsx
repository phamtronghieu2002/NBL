const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN
const ADDRESS_DOMAIN = import.meta.env.VITE_ADDRESS_DOMAIN

import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { _const } from "../_constant"

const createNoAuthInstance = (API: string) => {
  const serverInstanceNoAuth = axios.create({
    baseURL: API,
    headers: { "Content-Type": "application/json" },
  })

  const interceptorsRq = (config: InternalAxiosRequestConfig<any>) => {
    config.timeout = 60000 * 5 || _const?.axios?.timeout

    return config
  }
  const interceptorsRqError = (error: any) => {
    return Promise.reject(error)
  }

  const interceptorsRs = (response: AxiosResponse<any, any>) => {
    return response?.data
  }
  const interceptorsRsError = (error: any) => {
    return Promise.reject(error?.response?.data)
  }

  serverInstanceNoAuth.interceptors.request.use(
    interceptorsRq,
    interceptorsRqError,
  )
  serverInstanceNoAuth.interceptors.response.use(
    interceptorsRs,
    interceptorsRsError,
  )

  return serverInstanceNoAuth
}

export const serverInstanceNoAuth = createNoAuthInstance(SERVER_DOMAIN)
export const addressInstance = createNoAuthInstance(ADDRESS_DOMAIN)
