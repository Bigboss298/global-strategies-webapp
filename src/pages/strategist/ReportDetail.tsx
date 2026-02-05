import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { adminApi } from '../../api/admin.api'
import { reactionsApi, ReactionType } from '../../api/reactions.api'
import { authStore } from '../../store/authStore'
import { StrategistBadge } from '../../components/StrategistBadge'
import { CountryFlag } from '../../components/ui/CountryFlag'
import TBPLoader from '../../components/TBPLoader'
import { 
  ArrowLeft, 
  MessageCircle, 
  Calendar,
  Tag
} from 'lucide-react'

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const user = authStore((state) => state.user)
  const [report, setReport] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [reactions, setReactions] = useState<any>({ like: 0, dislike: 0, love: 0, insightful: 0 })
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine the base path based on current route
  const isOrganization = location.pathname.startsWith('/organization')
  const feedPath = isOrganization ? '/organization/feed' : '/strategist/dashboard'
  const viewStrategistPath = isOrganization ? '/organization/view-strategist' : '/strategist/view'

  useEffect(() => {
    if (id) {
      fetchReportData()
    }
  }, [id])

  const fetchReportData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch report details from feed
      const allReports = await adminApi.getAllReports()
      const reportData = allReports.find((r: any) => r.id === id)
      
      if (!reportData) {
        const basicReport = await adminApi.getReportById(id!)
        setReport(basicReport)
      } else {
        setReport(reportData)
      }

      // Fetch comments
      const commentsData = await reactionsApi.getComments(id!)
      setComments(commentsData)

      // Fetch reactions
      const reactionsData = await reactionsApi.getReactions(id!)
      const reactionSummary = { like: 0, dislike: 0, love: 0, insightful: 0 }
      reactionsData.forEach((r: any) => {
        if (r.reactionType === 1) reactionSummary.like++
        if (r.reactionType === 2) reactionSummary.love++
        if (r.reactionType === 3) reactionSummary.insightful++
        if (r.reactionType === 4) reactionSummary.dislike++
        
        if (r.strategistId === user?.id) {
          if (r.reactionType === 1) setUserReaction('like')
          if (r.reactionType === 2) setUserReaction('love')
          if (r.reactionType === 3) setUserReaction('insightful')
          if (r.reactionType === 4) setUserReaction('dislike')
        }
      })
      setReactions(reactionSummary)
    } catch (error: any) {
      console.error('Failed to fetch report data', error)
      setError(error.response?.data?.message || 'Failed to load report data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReaction = async (type: 'like' | 'dislike' | 'love' | 'insightful') => {
    if (!user?.id || !id) return

    try {
      if (userReaction === type) {
        await reactionsApi.remove(id, user.id)
        setUserReaction(null)
      } else {
        const reactionTypeMap: Record<string, ReactionType> = {
          like: ReactionType.Like,
          love: ReactionType.Love,
          insightful: ReactionType.Insightful,
          dislike: ReactionType.Dislike
        }
        await reactionsApi.addOrUpdate({ 
          reportId: id, 
          strategistId: user.id, 
          reactionType: reactionTypeMap[type]
        })
        setUserReaction(type)
      }
      fetchReportData()
    } catch (error) {
      console.error('Failed to update reaction', error)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !id || !user?.id) return

    setIsSubmitting(true)
    try {
      await reactionsApi.addComment(id, user.id, newComment)
      setNewComment('')
      setError(null)
      fetchReportData()
    } catch (error: any) {
      console.error('Failed to add comment', error)
      setError(error.response?.data?.message || 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleString()
  }

  if (isLoading) {
    return <TBPLoader />
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The report you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate(feedPath)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#05A346] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Report Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Author Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <Link to={`${viewStrategistPath}/${report.strategistId}`}>
              {report.strategistProfilePhotoUrl ? (
                <img
                  src={report.strategistProfilePhotoUrl}
                  alt={`${report.strategistFirstName} ${report.strategistLastName}`}
                  className="w-14 h-14 rounded-full object-cover hover:ring-2 hover:ring-[#05A346] transition-all"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-white font-bold text-xl hover:ring-2 hover:ring-[#05A346] transition-all">
                  {(report.strategistFirstName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div className="flex-1">
              <Link 
                to={`${viewStrategistPath}/${report.strategistId}`}
                className="font-semibold text-[#293749] text-lg hover:text-[#05A346] transition-colors flex items-center gap-2"
              >
                {report.strategistFirstName} {report.strategistLastName}
                <StrategistBadge badgeType={report.badgeType ?? 0} withDot={true} />
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                {report.strategistCountry && (
                  <>
                    <CountryFlag countryName={report.strategistCountry} />
                    <span>•</span>
                  </>
                )}
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.dateCreated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#293749] mb-4">{report.title}</h1>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {report.categoryName && (
              <span className="px-3 py-1 text-xs font-medium bg-[#183A64]/10 text-[#183A64] rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {report.categoryName}
              </span>
            )}
            {report.projectName && (
              <span className="px-3 py-1 text-xs font-medium bg-[#05A346]/10 text-[#05A346] rounded-full">
                {report.projectName}
              </span>
            )}
            {report.fieldName && (
              <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {report.fieldName}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {report.content}
          </div>

          {/* Images */}
          {report.images && report.images.length > 0 && (
            <div className="mt-6">
              <div className={`grid gap-2 ${
                report.images.length === 1 ? 'grid-cols-1' :
                report.images.length === 2 ? 'grid-cols-2' :
                'grid-cols-2 md:grid-cols-3'
              }`}>
                {report.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reactions Bar */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'like'
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-lg">👍</span>
              <span className="text-sm font-medium">{reactions.like}</span>
            </button>

            <button
              onClick={() => handleReaction('love')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'love'
                  ? 'bg-pink-100 text-pink-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-lg">❤️</span>
              <span className="text-sm font-medium">{reactions.love}</span>
            </button>

            <button
              onClick={() => handleReaction('insightful')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'insightful'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-lg">💡</span>
              <span className="text-sm font-medium">{reactions.insightful}</span>
            </button>

            <button
              onClick={() => handleReaction('dislike')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'dislike'
                  ? 'bg-red-100 text-red-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-lg">👎</span>
              <span className="text-sm font-medium">{reactions.dislike}</span>
            </button>

            <div className="flex items-center gap-2 ml-auto text-gray-600">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{comments.length} Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-[#293749] mb-4">
          Comments ({comments.length})
        </h2>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex items-center gap-3">
            {user?.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {(user?.firstName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#05A346] focus:border-transparent resize-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-[#05A346] text-white rounded-full hover:bg-[#048A3B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <Link to={`${viewStrategistPath}/${comment.strategistId}`}>
                  {comment.strategistProfilePhotoUrl ? (
                    <img
                      src={comment.strategistProfilePhotoUrl}
                      alt={comment.strategistName || 'User'}
                      className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-[#05A346] transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#183A64] to-[#293749] flex items-center justify-center text-white font-bold flex-shrink-0 hover:ring-2 hover:ring-[#05A346] transition-all">
                      {(comment.strategistName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link 
                      to={`${viewStrategistPath}/${comment.strategistId}`}
                      className="font-semibold text-[#293749] hover:text-[#05A346] transition-colors flex items-center gap-1"
                    >
                      {comment.strategistName || 'Unknown User'}
                      <StrategistBadge badgeType={comment.badgeType ?? 0} withDot={true} />
                    </Link>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{formatDateTime(comment.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
