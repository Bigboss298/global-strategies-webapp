import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminApi } from '../../api/admin.api'
import { reactionsApi } from '../../api/reactions.api'
import { authStore } from '../../store/authStore'
import { ArrowLeft, Heart, ThumbsUp, ThumbsDown, MessageCircle, Trash2 } from 'lucide-react'

export const ReportDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = authStore((state) => state.user)
  const [report, setReport] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [reactions, setReactions] = useState<any>({ like: 0, dislike: 0, love: 0 })
  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchReportData()
    }
  }, [id])

  const fetchReportData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch report details - get all reports from feed and find the one we need
      const allReports = await adminApi.getAllReports()
      const reportData = allReports.find((r: any) => r.id === id)
      
      if (!reportData) {
        // Fallback to getReportById if not found in feed
        const basicReport = await adminApi.getReportById(id!)
        setReport(basicReport)
      } else {
        setReport(reportData)
      }

      // Fetch comments - using correct endpoint
      const commentsData = await reactionsApi.getComments(id!)
      setComments(commentsData)

      // Fetch reactions - using correct endpoint
      const reactionsData = await reactionsApi.getReactions(id!)
      const reactionSummary = { like: 0, dislike: 0, love: 0 }
      reactionsData.forEach((r: any) => {
        // Reaction types: 1=Like, 2=Love, 3=Insightful, 4=Dislike
        if (r.reactionType === 1) reactionSummary.like++
        if (r.reactionType === 2) reactionSummary.love++
        if (r.reactionType === 4) reactionSummary.dislike++
        
        if (r.strategistId === user?.id) {
          // Map reaction type back to string
          if (r.reactionType === 1) setUserReaction('like')
          if (r.reactionType === 2) setUserReaction('love')
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

  const handleReaction = async (type: 'like' | 'dislike' | 'love') => {
    if (!user?.id || !id) return

    try {
      if (userReaction === type) {
        // Remove reaction
        await reactionsApi.remove(id, user.id)
        setUserReaction(null)
      } else {
        // Add or update reaction - map to reaction type enum
        const reactionTypeMap: Record<'like' | 'dislike' | 'love', 1 | 2 | 4> = {
          like: 1,
          love: 2,
          dislike: 4
        }
        await reactionsApi.addOrUpdate({ 
          reportId: id, 
          strategistId: user.id, 
          reactionType: reactionTypeMap[type] as 1 | 2 | 4
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

    try {
      await reactionsApi.addComment(id, user.id, newComment)
      setNewComment('')
      setError(null)
      fetchReportData()
    } catch (error: any) {
      console.error('Failed to add comment', error)
      setError(error.response?.data?.message || 'Failed to add comment')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?') || !user?.id) return

    try {
      await reactionsApi.deleteComment(commentId, user.id)
      fetchReportData()
    } catch (error) {
      console.error('Failed to delete comment', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading report...</div>
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-4">Report not found</p>
        <button
          onClick={() => navigate('/admin/reports')}
          className="text-[#05A346] hover:text-[#048a3a] flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reports
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-[#05A346] transition-colors"
        >
          Dashboard
        </button>
        <span className="text-gray-400">/</span>
        <button
          onClick={() => navigate('/admin/reports')}
          className="text-gray-500 hover:text-[#05A346] transition-colors"
        >
          Reports
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Report Detail</span>
      </nav>

      {/* Report Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Error Display */}
        {error && (
          <div className="m-6 mb-0 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{report.title}</h1>
          
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-white font-bold text-lg">
              {report.strategistFirstName?.[0] || 'S'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {report.strategistFirstName} {report.strategistLastName}
              </p>
              <p className="text-sm text-gray-500">{formatDate(report.dateCreated)}</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              {report.categoryName}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#183A64] text-white">
              {report.projectName}
            </span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {report.fieldName}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div 
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: report.content }}
          />
        </div>

        {/* Reactions Bar */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'like'
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="text-sm font-medium">{reactions.like}</span>
            </button>

            <button
              onClick={() => handleReaction('dislike')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'dislike'
                  ? 'bg-red-100 text-red-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ThumbsDown className="h-5 w-5" />
              <span className="text-sm font-medium">{reactions.dislike}</span>
            </button>

            <button
              onClick={() => handleReaction('love')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                userReaction === 'love'
                  ? 'bg-pink-100 text-pink-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">{reactions.love}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{comments.length} Comments</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comments ({comments.length})</h2>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048a3a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#183A64] to-[#293749] flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.strategistFirstName?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.strategistFirstName} {comment.strategistLastName}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(comment.dateCreated)}</p>
                    </div>
                    {user?.role === 1 && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
