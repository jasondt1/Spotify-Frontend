import { api, authHeader } from "@/services/http"
import type { AxiosRequestConfig } from "axios"

export class BaseService {
  protected get<T>(url: string, token?: string, config?: AxiosRequestConfig) {
    return api.get<T>(url, { ...(config || {}), headers: authHeader(token) })
  }

  protected post<T>(
    url: string,
    body?: any,
    token?: string,
    config?: AxiosRequestConfig
  ) {
    return api.post<T>(url, body ?? null, {
      ...(config || {}),
      headers: authHeader(token),
    })
  }

  protected put<T>(
    url: string,
    body?: any,
    token?: string,
    config?: AxiosRequestConfig
  ) {
    return api.put<T>(url, body ?? null, {
      ...(config || {}),
      headers: authHeader(token),
    })
  }

  protected patch<T>(
    url: string,
    body?: any,
    token?: string,
    config?: AxiosRequestConfig
  ) {
    return api.patch<T>(url, body ?? null, {
      ...(config || {}),
      headers: authHeader(token),
    })
  }

  protected delete<T>(url: string, token?: string, config?: AxiosRequestConfig) {
    return api.delete<T>(url, { ...(config || {}), headers: authHeader(token) })
  }
}

