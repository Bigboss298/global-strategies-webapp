import { StrategistBadge } from '../../components/StrategistBadge'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { strategistDashboardStore } from '../../store/strategist/strategistDashboardStore'
import { authStore } from '../../store/authStore'
import { CountryFlag } from '../../components/ui/CountryFlag'
import { reactionsApi, ReactionType } from '../../api/reactions.api'
import TBPLoader from '../../components/TBPLoader'

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString()
  } catch {
    return 'N/A'
  }
}

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleString()
  } catch {
    return 'N/A'
  }
}

export default function StrategistFeed() {
  const location = useLocation()
  const { feed, isLoadingFeed, fetchFeed, fetchFeedByProject, comments, fetchCommentsByReport, postComment, error } = strategistDashboardStore()
  const { user } = authStore()
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [reactingReports, setReactingReports] = useState<Set<string>>(new Set())
  const [commentError, setCommentError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null)

  // Determine the base path based on current route
  const isOrganization = location.pathname.startsWith('/organization')
  const isAdmin = location.pathname.startsWith('/admin')
  const viewStrategistPath = isAdmin ? '/admin/users' : isOrganization ? '/organization/view-strategist' : '/strategist/view'
  const reportDetailPath = isAdmin ? '/admin/reports' : isOrganization ? '/organization/reports' : '/strategist/reports'

  useEffect(() => {
    fetchFeed()

    // Listen for filter events from navbar
    const handleFilterByProject = (event: CustomEvent) => {
      fetchFeedByProject(event.detail.projectId)
    }

    const handleClearFilter = () => {
      fetchFeed()
    }

    window.addEventListener('filterByProject', handleFilterByProject as EventListener)
    window.addEventListener('clearProjectFilter', handleClearFilter)

    return () => {
      window.removeEventListener('filterByProject', handleFilterByProject as EventListener)
      window.removeEventListener('clearProjectFilter', handleClearFilter)
    }
  }, [])

  const handleReaction = async (reportId: string, reactionType: ReactionType) => {
    if (!user?.id) {
      console.error('User not logged in')
      return
    }

    if (reactingReports.has(reportId)) return

    setReactingReports(prev => new Set(prev).add(reportId))

    try {
      await reactionsApi.addOrUpdate({
        reportId,
        strategistId: user.id,
        reactionType,
      })
      // Refresh the feed to get updated reaction counts
      await fetchFeed()
    } catch (err) {
      console.error('Failed to add reaction', err)
    } finally {
      setReactingReports(prev => {
        const newSet = new Set(prev)
        newSet.delete(reportId)
        return newSet
      })
    }
  }

  const handleExpandReport = (reportId: string) => {
    if (expandedReport === reportId) {
      setExpandedReport(null)
    } else {
      setExpandedReport(reportId)
      fetchCommentsByReport(reportId)
    }
  }

  const handlePostComment = async (reportId: string) => {
    if (!commentText.trim()) return
    if (!user?.id) {
      console.error('User not logged in')
      return
    }
    setCommentError(null)
    try {
      await postComment(reportId, commentText, user.id)
      setCommentText('')
      setCommentError(null)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to post comment'
      setCommentError(errorMessage)
      console.error('Failed to post comment:', errorMessage)
    }
  }

  if (isLoadingFeed) {
    return <TBPLoader />
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-6">
        {/* Main Feed - LinkedIn style */}
        <div className="col-span-12 lg:col-span-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Action Required</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {feed.map((report) => (
              <article
                key={report.id}
                className="bg-[#FEFEFE] rounded-lg tbp-card-shadow overflow-hidden"
              >
                {/* Post Header */}
                <div className="px-4 pt-3 pb-0">
                  <div className="flex items-start gap-3">
                    <Link to={`${viewStrategistPath}/${report.strategistId}`} className="flex-shrink-0">
                      {report.strategistProfilePhotoUrl ? (
                        <img
                          src={report.strategistProfilePhotoUrl}
                          alt={`${report.strategistFirstName} ${report.strategistLastName}`}
                          className="w-12 h-12 rounded-full object-cover hover:ring-2 hover:ring-[#05A346] transition-all"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-[#FEFEFE] font-semibold text-base hover:ring-2 hover:ring-[#05A346] transition-all">
                          {(report.strategistFirstName || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`${viewStrategistPath}/${report.strategistId}`}
                        className="font-semibold text-[#293749] text-sm hover:text-[#05A346] cursor-pointer flex items-center gap-2 transition-colors"
                      >
                        {report.strategistFirstName} {report.strategistLastName}
                        <StrategistBadge badgeType={report.badgeType ?? 0} withDot={true} />
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-[#293749]/60">
                        {report.strategistCountry && (
                          <>
                            <CountryFlag countryName={report.strategistCountry} />
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(report.dateCreated)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pt-3 pb-2">
                  <Link to={`${reportDetailPath}/${report.id}`}>
                    <h3 className="text-base font-semibold text-[#293749] mb-2 leading-snug hover:text-[#05A346] transition-colors cursor-pointer">{report.title}</h3>
                  </Link>
                  <p className="text-sm text-[#293749]/90 leading-relaxed whitespace-pre-wrap">{report.content}</p>
                </div>

                {/* Tags */}
                {(report.categoryName || report.projectName || report.fieldName) && (
                  <div className="px-4 pb-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {report.projectImageUrl && (
                        <div 
                          className="w-16 h-6 bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => setSelectedImage({ url: report.projectImageUrl!, alt: report.projectName || 'Project' })}
                        >
                          <img
                            src={report.projectImageUrl}
                            alt={report.projectName || "Project"}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      {report.categoryName && (
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-[#183A64]/10 text-[#183A64] rounded">
                          {report.categoryName}
                        </span>
                      )}
                      {report.projectName && (
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-[#05A346]/10 text-[#05A346] rounded">
                          {report.projectName}
                        </span>
                      )}
                      {report.fieldName && (
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-[#293749] rounded">
                          {report.fieldName}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Images - Full width like LinkedIn */}
                {report.images && report.images.length > 0 && (
                  <div className="mt-2">
                    {report.images.length === 1 ? (
                      <img
                        src={report.images[0]}
                        alt="Post image"
                        className="w-full max-h-[300px] object-contain bg-gray-50"
                      />
                    ) : (
                      <div className={`grid gap-0.5 ${
                        report.images.length === 2 ? 'grid-cols-2' :
                        report.images.length === 3 ? 'grid-cols-3' :
                        'grid-cols-2'
                      }`}>
                        {report.images.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-40 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Engagement Stats - LinkedIn style */}
                <div className="px-4 py-2 flex items-center justify-between text-xs text-[#293749]/60 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {(report.reactionsSummary?.like || report.reactionsSummary?.love || report.reactionsSummary?.insightful) && (
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          {report.reactionsSummary?.like > 0 && <span className="text-base bg-gray-100 rounded-full p-0.5 shadow-sm">👍</span>}
                          {report.reactionsSummary?.love > 0 && <span className="text-base bg-gray-100 rounded-full p-0.5 shadow-sm">❤️</span>}
                          {report.reactionsSummary?.insightful > 0 && <span className="text-base bg-gray-100 rounded-full p-0.5 shadow-sm">💡</span>}
                        </div>
                        <span className="ml-1">
                          {(report.reactionsSummary?.like || 0) + (report.reactionsSummary?.love || 0) + (report.reactionsSummary?.insightful || 0)}
                        </span>
                      </div>
                    )}
                  </div>
                  {report.commentsCount > 0 && (
                    <button
                      onClick={() => handleExpandReport(report.id)}
                      className="hover:underline hover:text-[#05A346]"
                    >
                      {report.commentsCount} {report.commentsCount === 1 ? 'comment' : 'comments'}
                    </button>
                  )}
                </div>

                {/* Action Buttons - LinkedIn style */}
                <div className="px-2 py-1 flex items-center justify-around border-t border-gray-100">
                  <button
                    onClick={() => handleReaction(report.id, ReactionType.Like)}
                    disabled={reactingReports.has(report.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium tbp-transition ${
                      report.userReaction === 'Like'
                        ? 'text-[#05A346]'
                        : 'text-[#293749]/70 hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    <span className="text-lg">👍</span>
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => handleReaction(report.id, ReactionType.Love)}
                    disabled={reactingReports.has(report.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium tbp-transition ${
                      report.userReaction === 'Love'
                        ? 'text-red-600'
                        : 'text-[#293749]/70 hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    <span className="text-lg">❤️</span>
                    <span>Love</span>
                  </button>
                  <button
                    onClick={() => handleReaction(report.id, ReactionType.Insightful)}
                    disabled={reactingReports.has(report.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium tbp-transition ${
                      report.userReaction === 'Insightful'
                        ? 'text-yellow-600'
                        : 'text-[#293749]/70 hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    <span className="text-lg">💡</span>
                    <span>Insightful</span>
                  </button>
                  <button
                    onClick={() => handleExpandReport(report.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#293749]/70 hover:bg-gray-100 tbp-transition"
                  >
                    <span className="text-lg">💬</span>
                    <span>Comment</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedReport === report.id && (
                  <div className="bg-gray-50 px-4 py-4 border-t">
                    <h4 className="font-semibold text-sm mb-3 text-[#293749]">Comments</h4>
                    
                    {/* Comment Input */}
                    <div className="mb-4">
                      {commentError && (
                        <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">⚠️</span>
                            <div className="flex-1">
                              <p className="font-semibold text-sm mb-1">Cannot Post Comment</p>
                              <p className="text-sm">{commentError}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {user?.profilePhotoUrl ? (
                          <img
                            src={user.profilePhotoUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-[#FEFEFE] font-semibold text-sm flex-shrink-0">
                            {(user?.firstName || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#05A346] text-sm"
                            rows={1}
                          />
                          <button
                            onClick={() => handlePostComment(report.id)}
                            className="mt-2 px-4 py-2 bg-[#05A346] text-[#FEFEFE] rounded-full hover:bg-[#048A3B] font-medium text-sm tbp-transition"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {comments[report.id]?.map((comment) => (
                        <div key={comment.id} className="bg-white p-3 rounded-lg">
                          <div className="flex items-start gap-2">
                            {comment.strategistProfilePhotoUrl ? (
                              <img
                                src={comment.strategistProfilePhotoUrl}
                                alt={comment.strategistName || 'User'}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-[#183A64] to-[#293749] rounded-full flex items-center justify-center text-sm font-semibold text-[#FEFEFE]">
                                {(comment.strategistName || comment.user?.firstName || 'U').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#293749] flex items-center gap-1">
                                {comment.strategistName || (comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User')}
                                <StrategistBadge badgeType={comment.badgeType ?? 0} withDot={true} />
                              </p>
                              <p className="text-[#293749]/90 text-sm mt-1">{comment.content}</p>
                              <p className="text-xs text-[#293749]/60 mt-1">
                                {formatDateTime(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {feed.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#293749]/60">No reports in the feed yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar - LinkedIn style */}
        <aside className="hidden lg:block lg:col-span-4 space-y-3">
          {/* Quick Stats Card */}
          <div className="bg-[#FEFEFE] rounded-lg tbp-card-shadow p-4">
            <h3 className="font-semibold text-sm text-[#293749] mb-3">Your Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#293749]/70">Reports posted</span>
                <span className="font-semibold text-[#293749]">{feed.filter(r => r.strategistId === authStore.getState().user?.id).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#293749]/70">Total reactions</span>
                <span className="font-semibold text-[#293749]">
                  {feed.reduce((acc, r) => acc + ((r.reactionsSummary?.like || 0) + (r.reactionsSummary?.love || 0) + (r.reactionsSummary?.insightful || 0)), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-[#FEFEFE] rounded-lg tbp-card-shadow p-4">
            <h3 className="font-semibold text-sm text-[#293749] mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {Array.from(new Set(feed.map(r => r.categoryName).filter(Boolean))).slice(0, 5).map((category, idx) => (
                <div key={idx} className="text-sm">
                  <p className="font-medium text-[#05A346] hover:underline cursor-pointer">#{category}</p>
                  <p className="text-xs text-[#293749]/60">{feed.filter(r => r.categoryName === category).length} reports</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
          </div>
        </div>
      )}
    </div>
  )
}
