import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { authStore } from './store/authStore'

function App() {
  // Initialize auth state from sessionStorage on app mount
  useEffect(() => {
    authStore.getState().initializeAuth()
  }, [])

  return <RouterProvider router={router} />
}

export default App
