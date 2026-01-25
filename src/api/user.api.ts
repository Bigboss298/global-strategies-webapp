import axiosInstance from './axiosInstance'
import type { User } from '../types'

export interface UpdateUserProfileData {
  firstName: string
  lastName: string
  headline?: string
  country?: string
  profilePhoto?: File
  certification?: string
  title?: string
  shortBio?: string
  cvFile?: File
}

export const userApi = {
  getProfile: async (userId: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/user/${userId}`)
    return response.data
  },

  updateProfile: async (userId: string, data: UpdateUserProfileData): Promise<User> => {
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    if (data.headline) formData.append('headline', data.headline)
    if (data.country) formData.append('country', data.country)
    if (data.certification) formData.append('certification', data.certification)
    if (data.title) formData.append('title', data.title)
    if (data.shortBio) formData.append('shortBio', data.shortBio)
    if (data.profilePhoto) formData.append('profilePhoto', data.profilePhoto)
    if (data.cvFile) formData.append('cvFile', data.cvFile)
    
    const response = await axiosInstance.put<User>(`/user/${userId}`, formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data with boundary
      },
    })
    return response.data
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/user')
    return response.data
  },
}
