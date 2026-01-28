import axiosInstance from './axiosInstance'
import type { Category, Project, Field, Strategist, PaginatedResponse } from '../types'

export interface CreateCategoryData {
  name: string
  description?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  categoryId: string
  image?: File
}

export interface CreateFieldData {
  name: string
  description?: string
  projectId: string
}

export const adminApi = {
  // Reports
  getAllReports: async (): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>('/Report/feed')
    return response.data
  },

  getReportsByCategory: async (categoryId: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(`/Report/category/${categoryId}`)
    return response.data
  },

  getReportsByProject: async (projectId: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(`/Report/project/${projectId}`)
    return response.data
  },

  getReportsByField: async (fieldId: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(`/Report/field/${fieldId}`)
    return response.data
  },

  getReportById: async (id: string): Promise<any> => {
    const response = await axiosInstance.get<any>(`/Report/${id}`)
    return response.data
  },

  deleteReport: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/Report/${id}`)
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/admin/categories')
    return response.data
  },

  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/admin/categories', data)
    return response.data
  },

  updateCategory: async (id: string, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/admin/categories/${id}`, data)
    return response.data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/categories/${id}`)
  },

  // Projects
  getProjects: async (categoryId?: string): Promise<Project[]> => {
    const response = await axiosInstance.get<Project[]>('/admin/projects', {
      params: { categoryId },
    })
    return response.data
  },

  getProjectsWithFields: async (): Promise<Project[]> => {
    const response = await axiosInstance.get<Project[]>('/Project/with-fields')
    return response.data
  },

  createProject: async (data: CreateProjectData): Promise<Project> => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('categoryId', data.categoryId)
    if (data.description) formData.append('description', data.description)
    if (data.image) formData.append('image', data.image)
    
    const response = await axiosInstance.post<Project>('/project', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data with boundary
      },
    })
    return response.data
  },

  updateProject: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.categoryId) formData.append('categoryId', data.categoryId)
    if (data.description) formData.append('description', data.description)
    if (data.image) formData.append('image', data.image)
    
    const response = await axiosInstance.put<Project>(`/project/${id}`, formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data with boundary
      },
    })
    return response.data
  },

  deleteProject: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/project/${id}`)
  },

  // Fields
  getFields: async (projectId?: string): Promise<Field[]> => {
    const response = await axiosInstance.get<Field[]>('/admin/fields', {
      params: { projectId },
    })
    return response.data
  },

  createField: async (data: CreateFieldData): Promise<Field> => {
    const response = await axiosInstance.post<Field>('/admin/fields', data)
    return response.data
  },

  updateField: async (id: string, data: Partial<CreateFieldData>): Promise<Field> => {
    const response = await axiosInstance.put<Field>(`/admin/fields/${id}`, data)
    return response.data
  },

  deleteField: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/fields/${id}`)
  },

  // Strategists
  getStrategists: async (params?: {
    page?: number
    limit?: number
    status?: 'pending' | 'active' | 'suspended'
    search?: string
  }): Promise<PaginatedResponse<Strategist>> => {
    const response = await axiosInstance.get<PaginatedResponse<Strategist>>('/admin/strategists', { params })
    return response.data
  },

  approveStrategist: async (id: string): Promise<Strategist> => {
    const response = await axiosInstance.post<Strategist>(`/admin/strategists/${id}/approve`)
    return response.data
  },

  suspendStrategist: async (id: string): Promise<Strategist> => {
    const response = await axiosInstance.post<Strategist>(`/admin/strategists/${id}/suspend`)
    return response.data
  },

  activateStrategist: async (id: string): Promise<Strategist> => {
    const response = await axiosInstance.post<Strategist>(`/admin/strategists/${id}/activate`)
    return response.data
  },
}

