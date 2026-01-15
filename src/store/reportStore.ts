import { create } from 'zustand'
import type { Report, Comment, Reaction, PaginatedResponse } from '../types'
import { reportsApi } from '../api/reports.api'
import type { CreateReportData } from '../api/reports.api'
import { authStore } from './authStore'

interface ReportState {
  reports: Report[]
  currentReport: Report | null
  comments: Comment[]
  userReaction: Reaction | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    categoryId?: string
    projectId?: string
    fieldId?: string
    authorId?: string
  }
  isLoading: boolean
  error: string | null
  fetchReports: (params?: {
    page?: number
    limit?: number
    categoryId?: string
    projectId?: string
    fieldId?: string
    authorId?: string
  }) => Promise<void>
  fetchReportById: (id: string) => Promise<void>
  createReport: (data: CreateReportData) => Promise<void>
  updateReport: (id: string, data: Partial<CreateReportData>) => Promise<void>
  deleteReport: (id: string) => Promise<void>
  fetchComments: (reportId: string) => Promise<void>
  addComment: (reportId: string, content: string) => Promise<void>
  updateComment: (reportId: string, commentId: string, content: string) => Promise<void>
  deleteComment: (reportId: string, commentId: string) => Promise<void>
  fetchReactions: (reportId: string) => Promise<void>
  addReaction: (reportId: string, type: 'like' | 'dislike' | 'love') => Promise<void>
  removeReaction: (reportId: string) => Promise<void>
  setFilters: (filters: Partial<ReportState['filters']>) => void
  clearError: () => void
}

export const reportStore = create<ReportState>((set, get) => ({
  reports: [],
  currentReport: null,
  comments: [],
  userReaction: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  error: null,

  fetchReports: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response: PaginatedResponse<Report> = await reportsApi.getAll(params)
      set({
        reports: response.data,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        },
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch reports',
      })
    }
  },

  fetchReportById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const report = await reportsApi.getById(id)
      set({
        currentReport: report,
        isLoading: false,
      })
      // Fetch comments and reactions for this report
      await get().fetchComments(id)
      await get().fetchReactions(id)
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch report',
      })
    }
  },

  createReport: async (data: CreateReportData) => {
    set({ isLoading: true, error: null })
    try {
      await reportsApi.create(data)
      set({ isLoading: false })
      // Refresh reports list
      await get().fetchReports()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create report',
      })
      throw error
    }
  },

  updateReport: async (id: string, data: Partial<CreateReportData>) => {
    set({ isLoading: true, error: null })
    try {
      await reportsApi.update(id, data)
      set({ isLoading: false })
      await get().fetchReports()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update report',
      })
      throw error
    }
  },

  deleteReport: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await reportsApi.delete(id)
      set({ isLoading: false })
      await get().fetchReports()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete report',
      })
      throw error
    }
  },

  fetchComments: async (reportId: string) => {
    try {
      const comments = await reportsApi.getComments(reportId)
      set({ comments })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch comments',
      })
    }
  },

  addComment: async (reportId: string, content: string) => {
    try {
      const comment = await reportsApi.addComment(reportId, content)
      set((state) => ({
        comments: [...state.comments, comment],
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add comment',
      })
      throw error
    }
  },

  updateComment: async (reportId: string, commentId: string, content: string) => {
    try {
      const updated = await reportsApi.updateComment(reportId, commentId, content)
      set((state) => ({
        comments: state.comments.map((c) => (c.id === commentId ? updated : c)),
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update comment',
      })
      throw error
    }
  },

  deleteComment: async (reportId: string, commentId: string) => {
    try {
      await reportsApi.deleteComment(reportId, commentId)
      set((state) => ({
        comments: state.comments.filter((c) => c.id !== commentId),
      }))
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete comment',
      })
      throw error
    }
  },

  fetchReactions: async (reportId: string) => {
    try {
      const reactions = await reportsApi.getReactions(reportId)
      const userId = authStore.getState().user?.id
      const userReaction = userId ? reactions.find((r) => r.userId === userId) || null : null
      set({ userReaction })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch reactions',
      })
    }
  },

  addReaction: async (reportId: string, type: 'like' | 'dislike' | 'love') => {
    try {
      const reaction = await reportsApi.addReaction(reportId, type)
      set({ userReaction: reaction })
      // Update current report reactions count
      const currentReport = get().currentReport
      if (currentReport && currentReport.reactions) {
        const reactions = { ...currentReport.reactions }
        // Remove old reaction type if exists
        const oldUserReaction = get().userReaction
        if (oldUserReaction) {
          const oldType = oldUserReaction.type
          reactions[oldType] = Math.max(0, (reactions[oldType] || 0) - 1)
        }
        // Add new reaction
        reactions[type] = (reactions[type] || 0) + 1
        set({
          currentReport: { ...currentReport, reactions },
        })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add reaction',
      })
      throw error
    }
  },

  removeReaction: async (reportId: string) => {
    try {
      await reportsApi.removeReaction(reportId)
      set({ userReaction: null })
      // Update current report reactions count
      const currentReport = get().currentReport
      const oldUserReaction = get().userReaction
      if (currentReport && currentReport.reactions && oldUserReaction) {
        const reactions = { ...currentReport.reactions }
        const oldType = oldUserReaction.type
        reactions[oldType] = Math.max(0, (reactions[oldType] || 0) - 1)
        set({
          currentReport: { ...currentReport, reactions },
        })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove reaction',
      })
      throw error
    }
  },

  setFilters: (filters: Partial<ReportState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  clearError: () => {
    set({ error: null })
  },
}))

