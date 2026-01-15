import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { authStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, accessToken } = authStore()

  // Check if we have a token in sessionStorage but state hasn't been initialized yet
  const hasStoredToken = typeof window !== 'undefined' && sessionStorage.getItem('token')
  
  // If there's a stored token but we're not authenticated yet, we're still initializing
  if (hasStoredToken && !isAuthenticated && !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05A346] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user?.role !== 1) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

