import { useEffect, useState } from 'react'
import { authStore } from '../../store/authStore'
import { userApi } from '../../api/user.api'
import { strategistDashboardStore } from '../../store/strategist/strategistDashboardStore'
import ProfileEdit from './ProfileEdit'
import { StrategistBadge } from '../../components/StrategistBadge'
import PDFViewerModal from '../../components/PDFViewerModal'
import { downloadFile } from '../../utils/fileHelpers'
import TBPLoader from '../../components/TBPLoader'
import { 
  MapPin, 
  Briefcase, 
  Award, 
  Edit3,
  Calendar,
  Heart,
  MessageSquare,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Download,
  Eye
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
  cvFileUrl?: string
  badgeType?: number
  isVerified?: boolean
  verificationNote?: string
}

export default function Profile() {
  const { user } = authStore()
  const { myReports, fetchMyReports, isLoadingMyReports } = strategistDashboardStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  // Fetch user profile and reports
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
        
        // Fetch reports
        await fetchMyReports(user.id)
      } catch (err: any) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [user?.id])

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

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
    return <TBPLoader />
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Profile not found</div>
      </div>
    )
  }

  // Badge type mapping
  // Badge color mapping (per user spec)
  const BADGE_COLOR_MAP: Record<number, string> = {
    0: '#9CA3AF',      // None: gray-400
    1: '#2563EB',      // Verified: blue-600
    2: '#16A34A',      // Expert: green-600
    3: '#F59E0B',      // Premium: amber-500
    4: '#6D28D9',      // Corporate: violet-700 (modern)
  };

  return (
    <>
      {isEditing && (
        <ProfileEdit 
          onClose={() => setIsEditing(false)} 
          onSave={handleEditComplete}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 relative">
          {/* Edit Button - Top Right Corner */}
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 p-2 md:bg-blue-600 text-blue-600 md:text-white rounded-lg md:hover:bg-blue-700 transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-6 h-6 md:w-5 md:h-5 stroke-[2.5]" />
          </button>

          <div className="flex flex-col md:flex-row md:items-start mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1">
              {/* Profile Photo with Badge Overlay */}
              <div className="flex-shrink-0 relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full aspect-square rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full aspect-square rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl font-bold border-4 border-blue-100 shadow-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}
                {/* Badge Overlay: LinkedIn-style square with 'T' */}
                {profile.badgeType !== undefined && (
                  <span
                    className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center rounded rounded-full shadow-lg border border-white text-white font-bold text-base select-none"
                    style={{ background: BADGE_COLOR_MAP[profile.badgeType] || '#9CA3AF' }}
                    title="Strategist Badge"
                  >
                    S
                  </span>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {profile.firstName} {profile.lastName}
                  <StrategistBadge badgeType={profile.badgeType} withDot={true} />
                </h1>

                {/* Show badge name below name on profile page */}
                {profile.badgeType !== undefined && profile.badgeType !== 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    {/* <StrategistBadge badgeType={profile.badgeType} withDot={true} /> */}
                    {/* <span className="text-sm font-medium text-gray-700">{
                      profile.badgeType === 1 ? 'Verified' :
                      profile.badgeType === 2 ? 'Expert' :
                      profile.badgeType === 3 ? 'Premium' :
                      profile.badgeType === 4 ? 'Corporate' : 'None'
                    }</span> */}
                  </div>
                )}

                {profile.headline && (
                  <p className="text-xl text-gray-600 mb-4">{profile.headline}</p>
                )}

                <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 text-gray-600 text-left">
                  {profile.country && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{profile.country}</span>
                    </div>
                  )}
                  
                  {profile.title && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{profile.title}</span>
                    </div>
                  )}
                  
                  {profile.certification && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{profile.certification}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {profile.shortBio && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{profile.shortBio}</p>
            </div>
          )}

          {/* CV Download */}
          {profile.cvFileUrl && (
            <div className="border-t pt-6 mt-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setIsPDFModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View CV/Resume
                </button>
                <button
                  onClick={() => downloadFile(profile.cvFileUrl!, `${profile.firstName}_${profile.lastName}_CV.pdf`)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download CV/Resume
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Insights</h2>
          
          {isLoadingMyReports ? (
            <TBPLoader />
          ) : myReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No reports published yet</div>
          ) : (
            <div className="space-y-6">
              {myReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        {report.categoryName && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {report.categoryName}
                          </span>
                        )}
                        {report.projectName && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                            {report.projectName}
                          </span>
                        )}
                        {report.fieldName && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {report.fieldName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(report.dateCreated)}
                    </div>
                  </div>

                  {/* Report Content Preview */}
                  <p className="text-gray-700 mb-4 line-clamp-3">{report.content}</p>

                  {/* Report Images */}
                  {report.images && report.images.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      {report.images.slice(0, 2).map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Report image ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {/* Report Stats */}
                  <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-sm font-medium">{report.commentsCount} Comments</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-blue-600">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm font-medium">{report.reactionsSummary.like}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-red-600">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm font-medium">{report.reactionsSummary.love}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Lightbulb className="w-5 h-5" />
                        <span className="text-sm font-medium">{report.reactionsSummary.insightful}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-gray-600">
                        <ThumbsDown className="w-5 h-5" />
                        <span className="text-sm font-medium">{report.reactionsSummary.dislike}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {profile?.cvFileUrl && (
        <PDFViewerModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          pdfUrl={profile.cvFileUrl}
          fileName={`${profile.firstName}_${profile.lastName}_CV.pdf`}
        />
      )}
    </>
  )
}
