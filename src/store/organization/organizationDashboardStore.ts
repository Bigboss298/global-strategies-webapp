import { create } from 'zustand'
import type { User } from '../../types'
import axiosInstance from '../../api/axiosInstance'

interface Report {
  id: string
  title: string
  content: string
  categoryId: string
  categoryName?: string
  projectId: string
  projectName?: string
  fieldId: string
  fieldName?: string
  authorId: string
  author?: User
  images?: string[]
  files?: string[]
  commentsCount?: number
  reactions?: {
    like: number
    dislike: number
    love: number
  }
  dateCreated: string
  dateUpdated?: string
}

interface Category {
  id: string
  name: string
  description?: string
}

interface Project {
  id: string
  name: string
  description?: string
  categoryId: string
  categoryName?: string
}

interface OrganizationDashboardState {
  // Organization info
  organizationId: string | null
  
  // Strategists in organization
  strategists: User[]
  isLoadingStrategists: boolean
  
  // Reports by organization's strategists
  reports: Report[]
  isLoadingReports: boolean
  
  // Categories & projects
  categories: Category[]
  projects: Project[]
  isLoadingCategories: boolean
  isLoadingProjects: boolean
  
  // Error state
  error: string | null
  
  // Actions
  setOrganizationId: (id: string) => void
  fetchOrganizationStrategists: () => Promise<void>
  fetchOrganizationReports: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchProjects: () => Promise<void>
  clearError: () => void
}

export const organizationDashboardStore = create<OrganizationDashboardState>((set, get) => ({
  // Initial State
  organizationId: null,
  strategists: [],
  isLoadingStrategists: false,
  reports: [],
  isLoadingReports: false,
  categories: [],
  projects: [],
  isLoadingCategories: false,
  isLoadingProjects: false,
  error: null,

  // Set organization ID (from logged in user's corporateAccountId)
  setOrganizationId: (id) => {
    set({ organizationId: id })
  },

  // Fetch strategists belonging to the organization
  fetchOrganizationStrategists: async () => {
    const { organizationId } = get()
    if (!organizationId) {
      set({ error: 'Organization ID not set' })
      return
    }

    set({ isLoadingStrategists: true, error: null })
    try {
      // Get all users and filter by corporateAccountId
      const response = await axiosInstance.get<User[]>('/user')
      const orgStrategists = response.data.filter(
        (user) => user.corporateAccountId === organizationId
      )
      set({
        strategists: orgStrategists,
        isLoadingStrategists: false,
      })
    } catch (error: any) {
      set({
        isLoadingStrategists: false,
        error: error.response?.data?.message || 'Failed to fetch organization strategists',
      })
    }
  },

  // Fetch reports by organization's strategists
  fetchOrganizationReports: async () => {
    const { organizationId, strategists } = get()
    if (!organizationId) {
      set({ error: 'Organization ID not set' })
      return
    }

    set({ isLoadingReports: true, error: null })
    try {
      // Get all reports
      const response = await axiosInstance.get<Report[]>('/report')
      
      // Filter reports by strategists in this organization
      const strategistIds = strategists.map((s) => s.id)
      const orgReports = response.data.filter((report) =>
        strategistIds.includes(report.authorId)
      )
      
      set({
        reports: orgReports,
        isLoadingReports: false,
      })
    } catch (error: any) {
      set({
        isLoadingReports: false,
        error: error.response?.data?.message || 'Failed to fetch organization reports',
      })
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ isLoadingCategories: true, error: null })
    try {
      const response = await axiosInstance.get<Category[]>('/category')
      set({
        categories: response.data,
        isLoadingCategories: false,
      })
    } catch (error: any) {
      set({
        isLoadingCategories: false,
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

  clearError: () => set({ error: null }),
}))
