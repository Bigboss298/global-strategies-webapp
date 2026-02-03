import { create } from 'zustand'
import type { User } from '../../types'
import axiosInstance from '../../api/axiosInstance'

interface ReportFeed {
  id: string
  title: string
  content: string
  strategistId: string
  strategistName: string
  strategistFirstName: string
  strategistLastName: string
  strategistCountry: string
  strategistProfilePhotoUrl?: string
  badgeType?: number // <-- Add badgeType for badge display
  categoryName?: string
  projectName?: string
  fieldName?: string
  projectImageUrl?: string
  images?: string[]
  commentsCount: number
  reactionsSummary: {
    like: number
    love: number
    insightful: number
    dislike: number
  }
  userReaction?: string
  dateCreated: string
  dateUpdated?: string
}

interface Comment {
  id: string
  reportId: string
  strategistId: string
  strategistName?: string
  strategistProfilePhotoUrl?: string
  badgeType?: number
  user?: User
  content: string
  createdAt: string
  updatedAt?: string
}

interface Project {
  id: string
  name: string
  description?: string
  categoryId: string
  categoryName?: string
}

interface Category {
  id: string
  name: string
  description?: string
}

interface Field {
  id: string
  name: string
  description?: string
  projectId: string
}

interface StrategistDashboardState {
  // Feed
  feed: ReportFeed[]
  isLoadingFeed: boolean
  
  // My Reports
  myReports: ReportFeed[]
  isLoadingMyReports: boolean
  
  // Projects & Categories
  categories: Category[]
  projects: Project[]
  fields: Field[]
  isLoadingProjects: boolean
  
  // Comments
  comments: Record<string, Comment[]> // keyed by reportId
  isLoadingComments: boolean
  
  // Error state
  error: string | null
  
  // Actions - Feed
  fetchFeed: () => Promise<void>
  fetchFeedByProject: (projectId: string) => Promise<void>
  fetchMyReports: (userId: string) => Promise<void>
  
  // Actions - Submit Report
  submitReport: (data: {
    strategistId: string
    title: string
    content: string
    categoryId: string
    projectId: string
    fieldId: string
    images?: string[]
    files?: string[]
  }) => Promise<void>
  
  // Actions - Projects & Categories
  fetchCategories: () => Promise<void>
  fetchProjects: () => Promise<void>
  fetchFieldsByProject: (projectId: string) => Promise<void>
  
  // Actions - Comments
  fetchCommentsByReport: (reportId: string) => Promise<void>
  postComment: (reportId: string, content: string, strategistId: string) => Promise<void>
  
  // Utility
  clearError: () => void
}

export const strategistDashboardStore = create<StrategistDashboardState>((set, get) => ({
  // Initial State
  feed: [],
  isLoadingFeed: false,
  myReports: [],
  isLoadingMyReports: false,
  categories: [],
  projects: [],
  fields: [],
  isLoadingProjects: false,
  comments: {},
  isLoadingComments: false,
  error: null,

  // Fetch global feed
  fetchFeed: async () => {
    set({ isLoadingFeed: true, error: null })
    try {
      const response = await axiosInstance.get<ReportFeed[]>('/report/feed')
      set({
        feed: response.data,
        isLoadingFeed: false,
      })
    } catch (error: any) {
      set({
        isLoadingFeed: false,
        error: error.response?.data?.message || 'Failed to fetch feed',
      })
    }
  },

  // Fetch feed by project
  fetchFeedByProject: async (projectId: string) => {
    set({ isLoadingFeed: true, error: null })
    try {
      const response = await axiosInstance.get<ReportFeed[]>(`/report/feed/project/${projectId}`)
      set({
        feed: response.data,
        isLoadingFeed: false,
      })
    } catch (error: any) {
      set({
        isLoadingFeed: false,
        error: error.response?.data?.message || 'Failed to fetch reports for this project',
      })
    }
  },

  // Fetch my reports
  fetchMyReports: async (userId) => {
    set({ isLoadingMyReports: true, error: null })
    try {
      const response = await axiosInstance.get<ReportFeed[]>(`/report/strategist/${userId}`)
      set({
        myReports: response.data,
        isLoadingMyReports: false,
      })
    } catch (error: any) {
      set({
        isLoadingMyReports: false,
        error: error.response?.data?.message || 'Failed to fetch my reports',
      })
    }
  },

  // Submit a new report
  submitReport: async (data) => {
    set({ error: null })
    try {
      await axiosInstance.post('/report', data)
      // Refresh feed after submission
      get().fetchFeed()
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to submit report',
      })
      throw error
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ isLoadingProjects: true, error: null })
    try {
      const response = await axiosInstance.get<Category[]>('/category')
      set({
        categories: response.data,
        isLoadingProjects: false,
      })
    } catch (error: any) {
      set({
        isLoadingProjects: false,
        error: error.response?.data?.message || 'Failed to fetch categories',
      })
    }
  },

  // Fetch projects
  fetchProjects: async () => {
    set({ isLoadingProjects: true, error: null })
    try {
      const response = await axiosInstance.get<Project[]>('/project')
      set({
        projects: response.data,
        isLoadingProjects: false,
      })
    } catch (error: any) {
      set({
        isLoadingProjects: false,
        error: error.response?.data?.message || 'Failed to fetch projects',
      })
    }
  },

  // Fetch fields by project
  fetchFieldsByProject: async (projectId) => {
    set({ error: null })
    try {
      const response = await axiosInstance.get<Field[]>(`/field/project/${projectId}`)
      set({
        fields: response.data,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch fields',
      })
    }
  },

  // Fetch comments for a report
  fetchCommentsByReport: async (reportId) => {
    set({ isLoadingComments: true, error: null })
    try {
      const response = await axiosInstance.get<Comment[]>(`/comment/report/${reportId}`)
      set((state) => ({
        comments: {
          ...state.comments,
          [reportId]: response.data,
        },
        isLoadingComments: false,
      }))
    } catch (error: any) {
      set({
        isLoadingComments: false,
        error: error.response?.data?.message || 'Failed to fetch comments',
      })
    }
  },

  // Post a comment
  postComment: async (reportId, content, strategistId) => {
    set({ error: null })
    try {
      await axiosInstance.post(`/comment/reports/${reportId}`, {
        reportId,
        strategistId,
        content,
      })
      // Refresh comments for this report
      get().fetchCommentsByReport(reportId)
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to post comment',
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
