import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { authStore } from '../../store/authStore'
import { AlertCircle, Building2, UserCheck } from 'lucide-react'
import { countries } from '../../api/countries.api'

interface RegisterTeamMemberForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  title: string
  areaOfExpertise: string
  certification: string
  shortBio: string
  cvFileUrl: string
  country: string
  token: string
}

export const RegisterTeamMember = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { error, clearError } = authStore()
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const [formData, setFormData] = useState<RegisterTeamMemberForm>({
    firstName: '',
    lastName: '',
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: '',
    title: '',
    areaOfExpertise: '',
    certification: '',
    shortBio: '',
    cvFileUrl: '',
    country: '',
    token: searchParams.get('token') || '',
  })

  useEffect(() => {
    if (!formData.token || !formData.email) {
      setLocalError('Invalid invitation link. Please check your email for the correct link.')
    }
  }, [formData.token, formData.email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    clearError()
    setLocalError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLocalError(null)

    if (!formData.token || !formData.email) {
      setLocalError('Invalid invitation link')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      const { confirmPassword, ...registerData } = formData
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5194/api'}/Auth/register/team-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Store auth data
      if (data.data) {
        sessionStorage.setItem('token', data.data.accessToken)
        sessionStorage.setItem('refreshToken', data.data.refreshToken)
        sessionStorage.setItem('user', JSON.stringify(data.data.user))
        authStore.getState().initializeAuth()
      }

      // Navigate to strategist dashboard
      navigate('/strategist/dashboard')
    } catch (err: any) {
      setLocalError(err.message || 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#05A346] to-[#048A3B] mb-6 shadow-lg">
            <Building2 className="w-10 h-10 text-[#FEFEFE]" />
          </div>
          <h1 className="text-4xl font-bold text-[#183A64] mb-3">Join Your Organization</h1>
          <p className="text-[#293749]/70 text-lg">Complete your registration to join the TBP Platform</p>
        </div>

        <Card className="bg-[#FEFEFE] shadow-xl">
          {displayError && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-[#293749] mb-6 flex items-center gap-3 pb-3 border-b border-gray-200">
                <UserCheck className="w-6 h-6 text-[#05A346]" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div>
              <h2 className="text-xl font-semibold text-[#293749] mb-6 pb-3 border-b border-gray-200">Account Credentials</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-[#293749]/60 mt-1">Email from invitation (cannot be changed)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Password *
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-[#293749]/60 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Confirm Password *
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h2 className="text-xl font-semibold text-[#293749] mb-6 pb-3 border-b border-gray-200">Professional Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Job Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior Strategist"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Area of Expertise *
                  </label>
                  <Input
                    name="areaOfExpertise"
                    value={formData.areaOfExpertise}
                    onChange={handleChange}
                    placeholder="e.g., Business Strategy, Market Analysis"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Country *
                  </label>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Certification
                  </label>
                  <Input
                    name="certification"
                    value={formData.certification}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    Short Bio
                  </label>
                  <Textarea
                    name="shortBio"
                    value={formData.shortBio}
                    onChange={handleChange}
                    placeholder="Brief description of your background and expertise"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#293749] mb-2">
                    CV/Resume URL
                  </label>
                  <Input
                    name="cvFileUrl"
                    value={formData.cvFileUrl}
                    onChange={handleChange}
                    placeholder="Link to your CV or resume (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading || !formData.token || !formData.email}
                className="w-full py-4 text-lg font-semibold"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
