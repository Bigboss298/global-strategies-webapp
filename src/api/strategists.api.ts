import axiosInstance from './axiosInstance'
import type { User } from '../types'

interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export const strategistsApi = {
  /**
   * Get all users with pagination
   * GET /api/user/paged?PageNumber=1&PageSize=10
   */
  getAll: async (params?: {
    pageNumber?: number
    pageSize?: number
  }): Promise<PagedResult<User>> => {
    const response = await axiosInstance.get<PagedResult<User>>('/user/paged', { 
      params: {
        PageNumber: params?.pageNumber || 1,
        PageSize: params?.pageSize || 12
      }
    })
    return response.data
  },

  /**
   * Get user by ID
   * GET /api/user/{id}
   */
  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/user/${id}`)
    return response.data
  },

  /**
   * Update user profile
   * PUT /api/user/{id}
   */
  updateProfile: async (id: string, data: {
    fullName?: string
    headline?: string
    country?: string
    profilePhotoUrl?: string
    isActive?: boolean
  }): Promise<User> => {
    const response = await axiosInstance.put<User>(`/user/${id}`, data)
    return response.data
  },
}

