import axiosInstance from './axiosInstance'
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterIndividualRequest,
  RegisterCorporateRequest,
  RefreshTokenRequest
} from '../types'

export const authApi = {
  /**
   * Login with email and password
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Register individual strategist account
   * POST /api/auth/register/individual
   */
  registerIndividual: async (data: RegisterIndividualRequest): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('certification', data.certification)
    formData.append('title', data.title)
    formData.append('shortBio', data.shortBio)
    formData.append('country', data.country)
    if (data.cvFile) {
      formData.append('cvFile', data.cvFile)
    }
    
    const response = await axiosInstance.post<AuthResponse>('/auth/register/individual', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data with boundary
      },
    })
    return response.data
  },

  /**
   * Register corporate account with representative
   * POST /api/auth/register/corporate
   */
  registerCorporate: async (data: RegisterCorporateRequest): Promise<{ success: boolean; message: string; data: AuthResponse }> => {
    const response = await axiosInstance.post<{ success: boolean; message: string; data: AuthResponse }>(
      '/auth/register/corporate',
      data
    )
    return response.data
  },

  /**
   * Refresh access token using refresh token
   * POST /api/auth/refresh-token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh-token', {
      token: refreshToken,
    } as RefreshTokenRequest)
    return response.data
  },

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.post<{ success: boolean; message: string }>('/auth/forgot-password', { email })
    return response.data
  },

  /**
   * Revoke a refresh token
   * POST /api/auth/revoke-token
   */
  revokeToken: async (refreshToken: string): Promise<void> => {
    await axiosInstance.post('/auth/revoke-token', {
      token: refreshToken,
    } as RefreshTokenRequest)
  },
}

