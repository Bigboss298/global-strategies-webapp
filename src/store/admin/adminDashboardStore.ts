import { create } from 'zustand'
import type { User } from '../../types'
import axiosInstance from '../../api/axiosInstance'

interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

interface CorporateAccount {
  id: string
  organisationName: string
  representativeEmail: string
  phoneNumber: string
  country: string
  sector: string
  availableSlots: number
  totalSlots: number
  dateCreated: string
}

interface Category {
  id: string
  name: string
  description?: string
  dateCreated: string
  dateUpdated?: string
}

interface Project {
  id: string
  name: string
  description?: string
  categoryId: string
  categoryName?: string
  imageUrl?: string
  dateCreated: string
  dateUpdated?: string
}

interface Field {
  id: string
  name: string
  description?: string
  projectId: string
  projectName?: string
  dateCreated: string
  dateUpdated?: string
}

interface AdminDashboardState {
  // Organizations
  organizations: CorporateAccount[]
  organizationsPagination: PagedResult<CorporateAccount> | null
  
  // Users/Strategists
  users: User[]
  usersPagination: PagedResult<User> | null
  totalStrategists: number
  
  // Categories
  categories: Category[]
  currentCategory: Category | null
  
  // Projects
  projects: Project[]
  projectsPagination: PagedResult<Project> | null
  currentProject: Project | null
  
  // Fields
  fields: Field[]
  currentField: Field | null
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Actions - Organizations
  fetchOrganizations: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>
  
  // Actions - Users
  fetchUsers: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>
  fetchTotalStrategists: () => Promise<void>

  // Badge Management
  fetchUsersForBadgeManagement: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>
  updateUserBadge: (userId: string, data: { isVerified: boolean; badgeType: number; verificationNote?: string }) => Promise<void>
  
  // Actions - Categories
  fetchCategories: () => Promise<void>
  fetchCategoryById: (id: string) => Promise<void>
  createCategory: (data: { name: string; description?: string }) => Promise<void>
  updateCategory: (id: string, data: { name: string; description?: string }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  
  // Actions - Projects
  fetchProjects: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>
  fetchProjectById: (id: string) => Promise<void>
  fetchProjectsByCategory: (categoryId: string) => Promise<void>
  createProject: (data: { name: string; description?: string; categoryId: string; image?: File }) => Promise<void>
  updateProject: (id: string, data: { name: string; description?: string; categoryId: string; image?: File }) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  
  // Actions - Fields
  fetchFields: () => Promise<void>
  fetchFieldById: (id: string) => Promise<void>
  fetchFieldsByProject: (projectId: string) => Promise<void>
  createField: (data: { name: string; description?: string; projectId: string }) => Promise<void>
  updateField: (id: string, data: { name: string; description?: string; projectId: string }) => Promise<void>
  deleteField: (id: string) => Promise<void>
  
  // Utility
  clearError: () => void
}

export const adminDashboardStore = create<AdminDashboardState>((set, get) => ({
    // Badge Management
    fetchUsersForBadgeManagement: async (params = { pageNumber: 1, pageSize: 50 }) => {
      set({ isLoading: true, error: null })
      try {
        const response = await axiosInstance.get<PagedResult<User>>('/User/admin/badge-management', {
          params: {
            PageNumber: params.pageNumber || 1,
            PageSize: params.pageSize || 50,
          },
        })
        set({
          users: response.data.items,
          usersPagination: response.data,
          isLoading: false,
        })
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to fetch users for badge management',
        })
      }
    },

    updateUserBadge: async (userId, data) => {
      set({ isLoading: true, error: null })
      try {
        await axiosInstance.put(`/User/${userId}/badge`, data)
        // Refresh users after update
        await get().fetchUsersForBadgeManagement()
        set({ isLoading: false })
      } catch (error: any) {
        set({
          isLoading: false,
          error: error.response?.data?.message || 'Failed to update user badge',
        })
        throw error
      }
    },
  // Initial State
  organizations: [],
  organizationsPagination: null,
  users: [],
  usersPagination: null,
  totalStrategists: 0,
  categories: [],
  currentCategory: null,
  projects: [],
  projectsPagination: null,
  currentProject: null,
  fields: [],
  currentField: null,
  isLoading: false,
  error: null,

  // Organizations
  fetchOrganizations: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<PagedResult<CorporateAccount>>('/corporate/paged', {
        params: {
          PageNumber: params.pageNumber || 1,
          PageSize: params.pageSize || 10,
        },
      })
      set({
        organizations: response.data.items,
        organizationsPagination: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      console.error('Error fetching organizations:', error)
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch organizations',
      })
    }
  },

  // Users/Strategists
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<PagedResult<User>>('/user/paged', {
        params: {
          PageNumber: params.pageNumber || 1,
          PageSize: params.pageSize || 20,
        },
      })
      set({
        users: response.data.items,
        usersPagination: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch users',
      })
    }
  },

  fetchTotalStrategists: async () => {
    try {
      const response = await axiosInstance.get<User[]>('/user')
      set({ totalStrategists: response.data.length })
    } catch (error: any) {
      console.error('Failed to fetch total strategists:', error)
    }
  },

  // Categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Category[]>('/category')
      set({
        categories: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch categories',
      })
    }
  },

  fetchCategoryById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Category>(`/category/${id}`)
      set({
        currentCategory: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch category',
      })
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.post('/category', data)
      set({ isLoading: false })
      // Refetch categories
      adminDashboardStore.getState().fetchCategories()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create category',
      })
      throw error
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.put(`/category/${id}`, data)
      set({ isLoading: false })
      // Refetch categories
      adminDashboardStore.getState().fetchCategories()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update category',
      })
      throw error
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.delete(`/category/${id}`)
      set({ isLoading: false })
      // Refetch categories
      adminDashboardStore.getState().fetchCategories()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete category',
      })
      throw error
    }
  },

  // Projects
  fetchProjects: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<PagedResult<Project>>('/project/paged', {
        params: {
          PageNumber: params.pageNumber || 1,
          PageSize: params.pageSize || 20,
        },
      })
      set({
        projects: response.data.items,
        projectsPagination: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch projects',
      })
    }
  },

  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Project>(`/project/${id}`)
      set({
        currentProject: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch project',
      })
    }
  },

  fetchProjectsByCategory: async (categoryId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Project[]>(`/project/category/${categoryId}`)
      set({
        projects: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch projects by category',
      })
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const { adminApi } = await import('../../api/admin.api')
      await adminApi.createProject(data)
      set({ isLoading: false })
      adminDashboardStore.getState().fetchProjects()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create project',
      })
      throw error
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const { adminApi } = await import('../../api/admin.api')
      await adminApi.updateProject(id, data)
      set({ isLoading: false })
      adminDashboardStore.getState().fetchProjects()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update project',
      })
      throw error
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.delete(`/project/${id}`)
      set({ isLoading: false })
      adminDashboardStore.getState().fetchProjects()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete project',
      })
      throw error
    }
  },

  // Fields
  fetchFields: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Field[]>('/field')
      set({
        fields: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch fields',
      })
    }
  },

  fetchFieldById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Field>(`/field/${id}`)
      set({
        currentField: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch field',
      })
    }
  },

  fetchFieldsByProject: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get<Field[]>(`/field/project/${projectId}`)
      set({
        fields: response.data,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch fields by project',
      })
    }
  },

  createField: async (data) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.post('/field', data)
      set({ isLoading: false })
      adminDashboardStore.getState().fetchFields()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create field',
      })
      throw error
    }
  },

  updateField: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.put(`/field/${id}`, data)
      set({ isLoading: false })
      adminDashboardStore.getState().fetchFields()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update field',
      })
      throw error
    }
  },

  deleteField: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await axiosInstance.delete(`/field/${id}`)
      set({ isLoading: false })
      adminDashboardStore.getState().fetchFields()
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete field',
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
