import { create } from 'zustand'
import type { User } from '../types'
import { strategistsApi } from '../api/strategists.api'

interface StrategistState {
  strategists: User[]
  currentStrategist: User | null
  pagination: {
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasPrevious: boolean
    hasNext: boolean
  }
  isLoading: boolean
  error: string | null
  searchQuery: string
  fetchStrategists: (params?: { pageNumber?: number; pageSize?: number }) => Promise<void>
  fetchStrategistById: (id: string) => Promise<void>
  updateProfile: (id: string, data: {
    fullName?: string
    headline?: string
    country?: string
    profilePhotoUrl?: string
    isActive?: boolean
  }) => Promise<void>
  setSearchQuery: (query: string) => void
  clearError: () => void
}

export const strategistStore = create<StrategistState>((set) => ({
  strategists: [],
  currentStrategist: null,
  pagination: {
    pageNumber: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  },
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchStrategists: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await strategistsApi.getAll(params)
      set({
        strategists: response.items,
        pagination: {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
          hasPrevious: response.hasPrevious,
          hasNext: response.hasNext,
        },
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch strategists',
      })
    }
  },

  fetchStrategistById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const strategist = await strategistsApi.getById(id)
      set({
        currentStrategist: strategist,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch strategist',
      })
    }
  },

  updateProfile: async (id: string, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await strategistsApi.updateProfile(id, data)
      set({
        currentStrategist: updated,
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update profile',
      })
      throw error
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
  },

  clearError: () => {
    set({ error: null })
  },
}))

