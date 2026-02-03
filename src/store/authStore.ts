import { create } from 'zustand'
import type { User, RegisterIndividualRequest, RegisterCorporateRequest } from '../types'
import { authApi } from '../api/auth.api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
  registerIndividual: (data: RegisterIndividualRequest) => Promise<void>
  registerCorporate: (data: RegisterCorporateRequest) => Promise<void>
  logout: () => Promise<void>
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  clearError: () => void
  initializeAuth: () => void
}

export const authStore = create<AuthState>()((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Initialize auth state from sessionStorage
   */
  initializeAuth: () => {
    const token = sessionStorage.getItem('token')
    const refreshToken = sessionStorage.getItem('refreshToken')
    const userJson = sessionStorage.getItem('user')

    if (token && refreshToken && userJson) {
      try {
        const user = JSON.parse(userJson)
        set({
          user,
          accessToken: token,
          refreshToken,
          isAuthenticated: true,
        })
      } catch (error) {
        console.error('Failed to parse user from sessionStorage:', error)
        get().logout()
      }
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.login({ email, password })
      
      // Store tokens and user in sessionStorage
      sessionStorage.setItem('token', response.accessToken)
      sessionStorage.setItem('refreshToken', response.refreshToken)
      sessionStorage.setItem('user', JSON.stringify(response.user))

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      
      return response.user
    } catch (error: any) {
      const errorMessage = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message
          || error.response?.data?.title
          || error.message
          || 'Login failed'
      set({
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  },

  /**
   * Register individual strategist account
   */
  registerIndividual: async (data: RegisterIndividualRequest) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.registerIndividual(data)
      
      // Store tokens and user in sessionStorage
      sessionStorage.setItem('token', response.accessToken)
      sessionStorage.setItem('refreshToken', response.refreshToken)
      sessionStorage.setItem('user', JSON.stringify(response.user))

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      let errorMessage = 'Registration failed'
      
      if (error.response?.data) {
        const data = error.response.data
        if (typeof data === 'string') {
          errorMessage = data
        } else if (data.errors && typeof data.errors === 'object') {
          // Handle validation errors object
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('; ')
          errorMessage = data.message ? `${data.message}: ${errorMessages}` : errorMessages
        } else if (data.message) {
          errorMessage = data.message
        } else if (data.title) {
          errorMessage = data.title
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      set({
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  },

  /**
   * Register corporate account with representative
   */
  registerCorporate: async (data: RegisterCorporateRequest) => {
    set({ isLoading: true, error: null })
    try {
      const result = await authApi.registerCorporate(data)
      const response = result.data
      
      // Store tokens and user in sessionStorage
      sessionStorage.setItem('token', response.accessToken)
      sessionStorage.setItem('refreshToken', response.refreshToken)
      sessionStorage.setItem('user', JSON.stringify(response.user))

      set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      const errorMessage = typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data?.message
          || error.response?.data?.title
          || error.message
          || 'Corporate registration failed'
      set({
        isLoading: false,
        error: errorMessage,
      })
      throw error
    }
  },

  /**
   * Logout and clear all auth data
   */
  logout: async () => {
    try {
      const refreshToken = get().refreshToken
      if (refreshToken) {
        await authApi.revokeToken(refreshToken)
      }
    } catch (error) {
      console.error('Failed to revoke token:', error)
    } finally {
      // Clear sessionStorage
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('refreshToken')
      sessionStorage.removeItem('user')

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      })
    }
  },

  /**
   * Set tokens (used by axios interceptor)
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    sessionStorage.setItem('token', accessToken)
    sessionStorage.setItem('refreshToken', refreshToken)
    set({ accessToken, refreshToken })
  },

  /**
   * Set user
   */
  setUser: (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null })
  },
}))

