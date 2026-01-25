import { useEffect, useState } from 'react'
import { authStore } from '../../store/authStore'
import { userApi } from '../../api/user.api'
import type { UpdateUserProfileData } from '../../api/user.api'
import PDFViewerModal from '../../components/PDFViewerModal'
import { downloadFile } from '../../utils/fileHelpers'
import { User, Save, AlertCircle, CheckCircle, X, Eye, Download } from 'lucide-react'

interface ProfileEditProps {
  onClose: () => void
  onSave: () => void
}

export default function ProfileEdit({ onClose, onSave }: ProfileEditProps) {
  const { user, setUser } = authStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<UpdateUserProfileData>({
    firstName: '',
    lastName: '',
    headline: '',
    country: '',
    profilePhoto: undefined,
    certification: '',
    title: '',
    shortBio: '',
    cvFile: undefined,
  })
  
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('')
  const [currentCvUrl, setCurrentCvUrl] = useState('')
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  // Fetch fresh user data from the database by ID
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const freshUserData = await userApi.getProfile(user.id)
        
        // Update auth store with fresh data
        setUser(freshUserData)
        sessionStorage.setItem('user', JSON.stringify(freshUserData))
        
        // Store current URLs for display
        setCurrentPhotoUrl(freshUserData.profilePhotoUrl || '')
        setCurrentCvUrl(freshUserData.cvFileUrl || '')
        
        // Populate form with fresh data from database
        setFormData({
          firstName: freshUserData.firstName || '',
          lastName: freshUserData.lastName || '',
          headline: freshUserData.headline || '',
          country: freshUserData.country || '',
          certification: freshUserData.certification || '',
          title: freshUserData.title || '',
          shortBio: freshUserData.shortBio || '',
        })
      } catch (err: any) {
        console.error('Failed to fetch user profile:', err)
        const errorMessage = typeof err === 'string' 
          ? err 
          : err?.response?.data?.message 
            || err?.response?.data?.title
            || err?.message 
            || 'Failed to load profile data'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [user?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      setError('User ID not found')
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const updatedUser = await userApi.updateProfile(user.id, formData)
      
      // Update the user in the auth store and session storage
      setUser(updatedUser)
      sessionStorage.setItem('user', JSON.stringify(updatedUser))
      
      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        setSuccess(null)
        onSave()
      }, 1500)
    } catch (err: any) {
      console.error('Profile update error:', err)
      const errorMessage = typeof err === 'string'
        ? err
        : err?.response?.data?.message
          || err?.response?.data?.title
          || err?.message
          || 'Failed to update profile'
      setError(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-gray-600">Loading profile data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <p className="text-gray-600 mt-1">Update your personal information and professional details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your country"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo (JPG, JPEG, PNG - Max 5MB)
                  </label>
                  {currentPhotoUrl && (
                    <div className="mb-2">
                      <img src={currentPhotoUrl} alt="Current profile" className="w-20 h-20 rounded-full object-cover" />
                      <p className="text-xs text-gray-500 mt-1">Current photo</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.files?.[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.profilePhoto && (
                    <p className="text-xs text-green-600 mt-1">New file selected: {formData.profilePhoto.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Strategic Advisor | Global Policy Expert"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">A brief professional tagline (max 100 characters)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Strategist, Chief Advisor"
                    maxLength={200}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification
                  </label>
                  <input
                    type="text"
                    name="certification"
                    value={formData.certification}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., MBA, PhD in Economics, Certified Strategic Planner"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Bio
                  </label>
                  <textarea
                    name="shortBio"
                    value={formData.shortBio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write a brief description about your professional background and expertise..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 500 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV/Resume (PDF only - Max 5MB)
                  </label>
                  {currentCvUrl && (
                    <div className="mb-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPDFModalOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Current CV
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadFile(currentCvUrl, `${user?.firstName || 'User'}_${user?.lastName || 'CV'}.pdf`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFormData({ ...formData, cvFile: e.target.files?.[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.cvFile && (
                    <p className="text-xs text-green-600 mt-1">New file selected: {formData.cvFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {currentCvUrl && (
        <PDFViewerModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          pdfUrl={currentCvUrl}
          fileName={`${user?.firstName || 'User'}_${user?.lastName || 'CV'}.pdf`}
        />
      )}
    </div>
  )
}
