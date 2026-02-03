import { useEffect, useState } from 'react'
import { authStore } from '../../store/authStore'
import { userApi } from '../../api/user.api'
import OrganizationProfileEdit from './OrganizationProfileEdit.tsx'
import { 
  MapPin, 
  Briefcase, 
  Award, 
  Edit3,
  Building2,
  Mail,
  Phone
} from 'lucide-react'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  headline?: string
  country?: string
  profilePhotoUrl?: string
  certification?: string
  title?: string
  shortBio?: string
  phoneNumber?: string
  corporateAccountId?: string
}

export default function OrganizationProfile() {
  const { user } = authStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch user profile
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const profileData = await userApi.getProfile(user.id)
        setProfile(profileData)
      } catch (err: any) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [user?.id])

  const handleEditComplete = async () => {
    setIsEditing(false)
    // Refresh profile data
    if (user?.id) {
      try {
        const profileData = await userApi.getProfile(user.id)
        setProfile(profileData)
      } catch (err) {
        console.error('Failed to refresh profile:', err)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Profile not found</div>
      </div>
    )
  }

  return (
    <>
      {isEditing && (
        <OrganizationProfileEdit 
          onClose={() => setIsEditing(false)} 
          onSave={handleEditComplete}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full aspect-square rounded-full object-cover border-4 border-[#183A64]/20 shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full aspect-square rounded-full bg-gradient-to-br from-[#183A64] to-[#05A346] flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl font-bold border-4 border-[#183A64]/20 shadow-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#293749] mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                
                {profile.headline && (
                  <p className="text-xl text-gray-600 mb-3">{profile.headline}</p>
                )}

                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  {profile.title && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.title}</span>
                    </div>
                  )}
                  
                  {profile.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.country}</span>
                    </div>
                  )}
                  
                  {profile.certification && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{profile.certification}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center p-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-colors"
              title="Edit Profile"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          {/* Bio Section */}
          {profile.shortBio && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-[#293749] mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{profile.shortBio}</p>
            </div>
          )}
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#293749] mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#183A64]" />
            Organization Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
              <p className="text-gray-900 font-medium">Organization Administrator</p>
            </div>
            
            {profile.corporateAccountId && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Account Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
