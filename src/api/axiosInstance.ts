import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = sessionStorage.getItem('refreshToken')
        if (!refreshToken) {
          // Clear tokens and redirect to login
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('refreshToken')
          sessionStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          token: refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data
        sessionStorage.setItem('token', accessToken)
        sessionStorage.setItem('refreshToken', newRefreshToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Clear tokens and redirect to login on refresh failure
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance

