import axiosInstance from './axiosInstance'
import type { Report, Comment, Reaction, PaginatedResponse } from '../types'

export interface CreateReportData {
  title: string
  content: string
  categoryId: string
  projectId: string
  fieldId: string
  images?: File[]
  files?: File[]
}

export const reportsApi = {
  getAll: async (params?: {
    page?: number
    limit?: number
    categoryId?: string
    projectId?: string
    fieldId?: string
    authorId?: string
  }): Promise<PaginatedResponse<Report>> => {
    const response = await axiosInstance.get<PaginatedResponse<Report>>('/reports', { params })
    return response.data
  },

  getById: async (id: string): Promise<Report> => {
    const response = await axiosInstance.get<Report>(`/reports/${id}`)
    return response.data
  },

  create: async (data: CreateReportData): Promise<Report> => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('categoryId', data.categoryId)
    formData.append('projectId', data.projectId)
    formData.append('fieldId', data.fieldId)

    if (data.images) {
      data.images.forEach((image) => formData.append('images', image))
    }
    if (data.files) {
      data.files.forEach((file) => formData.append('files', file))
    }

    const response = await axiosInstance.post<Report>('/reports', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data with boundary
      },
    })
    return response.data
  },

  update: async (id: string, data: Partial<CreateReportData>): Promise<Report> => {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.content) formData.append('content', data.content)
    if (data.categoryId) formData.append('categoryId', data.categoryId)
    if (data.projectId) formData.append('projectId', data.projectId)
    if (data.fieldId) formData.append('fieldId', data.fieldId)

    if (data.images) {
      data.images.forEach((image) => formData.append('images', image))
    }
    if (data.files) {
      data.files.forEach((file) => formData.append('files', file))
    }

    const response = await axiosInstance.put<Report>(`/reports/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/reports/${id}`)
  },

  getComments: async (reportId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>(`/reports/${reportId}/comments`)
    return response.data
  },

  addComment: async (reportId: string, content: string): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(`/reports/${reportId}/comments`, { content })
    return response.data
  },

  updateComment: async (reportId: string, commentId: string, content: string): Promise<Comment> => {
    const response = await axiosInstance.put<Comment>(`/reports/${reportId}/comments/${commentId}`, { content })
    return response.data
  },

  deleteComment: async (reportId: string, commentId: string): Promise<void> => {
    await axiosInstance.delete(`/reports/${reportId}/comments/${commentId}`)
  },

  getReactions: async (reportId: string): Promise<Reaction[]> => {
    const response = await axiosInstance.get<Reaction[]>(`/reports/${reportId}/reactions`)
    return response.data
  },

  addReaction: async (reportId: string, type: 'like' | 'dislike' | 'love'): Promise<Reaction> => {
    const response = await axiosInstance.post<Reaction>(`/reports/${reportId}/reactions`, { type })
    return response.data
  },

  removeReaction: async (reportId: string): Promise<void> => {
    await axiosInstance.delete(`/reports/${reportId}/reactions`)
  },
}

