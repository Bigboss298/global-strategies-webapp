import axiosInstance from './axiosInstance'
import type { Category, Project, Field } from '../types'

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/categories')
    return response.data
  },

  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get<Category>(`/categories/${id}`)
    return response.data
  },

  getProjects: async (categoryId: string): Promise<Project[]> => {
    const response = await axiosInstance.get<Project[]>(`/categories/${categoryId}/projects`)
    return response.data
  },

  getFields: async (projectId: string): Promise<Field[]> => {
    const response = await axiosInstance.get<Field[]>(`/projects/${projectId}/fields`)
    return response.data
  },
}

