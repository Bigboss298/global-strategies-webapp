import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { strategistStore } from '../../store/strategistStore'
import { strategistDashboardStore } from '../../store/strategist/strategistDashboardStore'
import { authStore } from '../../store/authStore'
import { chatApi } from '../../api/chat.api'
import { StrategistBadge } from '../../components/StrategistBadge'
import { CountryFlag } from '../../components/ui/CountryFlag'
import TBPLoader from '../../components/TBPLoader'
import { 
  MapPin, 
  Briefcase, 
  Award, 
  ArrowLeft,
  Calendar,
  Heart,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  FileText,
  User,
  Lightbulb,
  Lock
} from 'lucide-react'

export default function ViewStrategist() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentStrategist, isLoading, error, fetchStrategistById, clearError } = strategistStore()
  const { reports, fetchReportsByAuthor, isLoadingFeed } = strategistDashboardStore()
  const { isAuthenticated, user } = authStore()
  const [activeTab, setActiveTab] = useState<'about' | 'reports'>('about')
  const [isStartingChat, setIsStartingChat] = useState(false)

  // Determine if we're on a public route or protected route
  const isPublicRoute = location.pathname.startsWith('/strategists/')
  const isOrganization = location.pathname.startsWith('/organization')
  const isAdmin = location.pathname.startsWith('/admin')
  
  // Set appropriate back path and report path based on context
  const backPath = isPublicRoute 
    ? '/strategists' 
    : isOrganization 
      ? '/organization/browse-strategists' 
      : '/strategist/browse'
  
  const reportDetailPath = isOrganization ? '/organization/reports' : '/strategist/reports'
  const chatPath = isOrganization ? '/organization/chat' : isAdmin ? '/admin/chat' : '/strategist/chat'

  const handleMessageClick = async () => {
    if (!id || !isAuthenticated) return
    setIsStartingChat(true)
    try {
      const room = await chatApi.createOrGetDirectChat({ otherUserId: id })
      navigate(chatPath, { state: { activeRoomId: room.id } })
    } catch (error) {
      console.error('Failed to create chat:', error)
    } finally {
      setIsStartingChat(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchStrategistById(id)
      // Only fetch reports if user is authenticated
      if (isAuthenticated) {
        fetchReportsByAuthor(id)
      }
    }
    return () => clearError()
  }, [id, isAuthenticated])

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

  if (isLoading) {
    return <TBPLoader />
  }

  if (error || !currentStrategist) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Strategist Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The strategist you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate(backPath)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Strategists
          </button>
        </div>
      </div>
    )
  }

  const strategist = currentStrategist

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#05A346] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Strategists</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#183A64] to-[#05A346] relative">
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 800 128" fill="none">
              <circle cx="100" cy="64" r="4" fill="white" />
              <circle cx="250" cy="30" r="4" fill="white" />
              <circle cx="400" cy="90" r="4" fill="white" />
              <circle cx="550" cy="40" r="4" fill="white" />
              <circle cx="700" cy="80" r="4" fill="white" />
              <line x1="100" y1="64" x2="250" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="250" y1="30" x2="400" y2="90" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="400" y1="90" x2="550" y2="40" stroke="white" strokeWidth="1" opacity="0.5" />
              <line x1="550" y1="40" x2="700" y2="80" stroke="white" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Photo */}
          <div className="relative flex justify-start" style={{ marginTop: '-50px' }}>
            <div className="h-28 w-28 rounded-full bg-gray-200 border-4 border-white overflow-hidden shadow-lg">
              {strategist.profilePhotoUrl ? (
                <img
                  src={strategist.profilePhotoUrl}
                  alt={`${strategist.firstName} ${strategist.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center">
                  <span className="text-3xl font-semibold text-white">
                    {strategist.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name and Badge */}
          <div className="mt-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#293749]">
                  {strategist.fullName || `${strategist.firstName} ${strategist.lastName}`}
                </h1>
                <StrategistBadge badgeType={strategist.badgeType} withDot={true} />
              </div>
            </div>

            {strategist.headline && (
              <p className="text-gray-600 mt-1">{strategist.headline}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              {strategist.country && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <CountryFlag countryName={strategist.country} />
                </div>
              )}
              {strategist.title && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{strategist.title}</span>
                </div>
              )}
              {strategist.certification && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{strategist.certification}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(strategist.dateCreated)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated && user?.id !== strategist.id && !isPublicRoute && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={handleMessageClick}
                  disabled={isStartingChat}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#183A64] rounded-full hover:bg-[#183A64]/90 shadow-sm transition-colors disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  {isStartingChat ? 'Starting chat...' : 'Message'}
                </button>
              </div>
            )}

            {/* Prompt to sign in on public route */}
            {!isAuthenticated && isPublicRoute && (
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#05A346] rounded-full hover:bg-[#048A3B] shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Sign in to Message
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-[#05A346] text-[#05A346]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-[#05A346] text-[#05A346]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reports ({reports?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Bio */}
              {strategist.shortBio && (
                <div>
                  <h3 className="text-lg font-semibold text-[#293749] mb-2">About</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{strategist.shortBio}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategist.title && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">Title</span>
                    </div>
                    <p className="font-medium text-[#293749]">{strategist.title}</p>
                  </div>
                )}
                {strategist.certification && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Certification</span>
                    </div>
                    <p className="font-medium text-[#293749]">{strategist.certification}</p>
                  </div>
                )}
                {strategist.country && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CountryFlag countryName={strategist.country} />
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <p className="font-medium text-[#293749]">{formatDate(strategist.dateCreated)}</p>
                </div>
              </div>

              {/* No info message */}
              {!strategist.shortBio && !strategist.title && !strategist.certification && (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>This strategist hasn't added detailed information yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              {!isAuthenticated ? (
                // Login prompt for unauthenticated users
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-[#293749] mb-2">Login Required</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Sign in to view reports published by this strategist and access more features.
                  </p>
                  <Link
                    to="/login"
                    state={{ from: location.pathname }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-colors font-medium"
                  >
                    Sign In to View Reports
                  </Link>
                  <p className="text-sm text-gray-400 mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-[#05A346] hover:underline">
                      Create one
                    </Link>
                  </p>
                </div>
              ) : isLoadingFeed ? (
                <div className="flex justify-center py-8">
                  <TBPLoader />
                </div>
              ) : reports && reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report: any) => (
                    <Link 
                      key={report.id} 
                      to={`${reportDetailPath}/${report.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:border-[#05A346]/30 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-[#293749] mb-2 hover:text-[#05A346] transition-colors">{report.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{report.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {report.categoryName && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {report.categoryName}
                          </span>
                        )}
                        {report.projectName && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {report.projectName}
                          </span>
                        )}
                        {report.fieldName && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {report.fieldName}
                          </span>
                        )}
                      </div>

                      {/* Stats - Using reactionsSummary from the API */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {report.reactionsSummary?.like || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {report.reactionsSummary?.love || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          {report.reactionsSummary?.insightful || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {report.commentsCount || 0}
                        </span>
                        <span className="ml-auto text-xs">
                          {formatDate(report.dateCreated)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>This strategist hasn't published any reports yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
