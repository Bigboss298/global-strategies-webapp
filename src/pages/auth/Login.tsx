import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card } from '../../components/ui/Card'
import tbpLogo from '../../assets/TBP_logo.jpeg'

export const Login = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = authStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      const user = await login(formData.email, formData.password)
      
      // Route based on user role
      if (user.role === 1) {
        // Admin
        navigate('/admin')
      } else if (user.role === 3) {
        // CorporateAdmin
        navigate('/organization/dashboard')
      } else {
        // Strategist or CorporateTeam (2 or 4)
        navigate('/strategist/dashboard')
      }
    } catch (err) {
      // Error is handled by store
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* TBP Logo/Brand */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <img src={tbpLogo} alt="TBP Logo" className="h-16 w-auto sm:h-20 md:h-24 object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#183A64] mb-1 sm:mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-[#293749]/70">Sign in to your Global Strategist Platform account</p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-r-md text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-[#293749] font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-[#293749] font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-xs sm:text-sm text-[#05A346] hover:text-[#048A3B] font-medium tbp-transition">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full text-sm sm:text-base" size="lg" isLoading={isLoading}>
              Sign In
            </Button>

            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-[#FEFEFE] text-gray-500">New to TBP?</span>
              </div>
            </div>

            <Link to="/register" className="block">
              <Button type="button" variant="outline" className="w-full text-sm sm:text-base" size="lg">
                Create Account
              </Button>
            </Link>
          </form>
        </Card>
      </div>
    </div>
  )
}

