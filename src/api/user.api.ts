import axiosInstance from './axiosInstance'
import type { User } from '../types'

export interface UpdateUserProfileData {
  firstName: string
  lastName: string
  headline?: string
  country?: string
  profilePhotoUrl?: string
  certification?: string
  title?: string
  shortBio?: string
  cvFileUrl?: string
}

export const userApi = {
  getProfile: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/user/${userId}`)
    return response.data
  },

  updateProfile: async (userId: string, data: UpdateUserProfileData): Promise<User> => {
    const response = await axiosInstance.put<User>(`/user/${userId}`, data)
    return response.data
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/user')
    return response.data
  },
}
