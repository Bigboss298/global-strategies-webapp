import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { adminApi } from '../../api/admin.api'
import { categoriesApi } from '../../api/categories.api'
import { strategistDashboardStore } from '../../store/strategist/strategistDashboardStore'
import { StrategistBadge } from '../../components/StrategistBadge'
import { CountryFlag } from '../../components/ui/CountryFlag'
import TBPLoader from '../../components/TBPLoader'
import type { Project, Category, Field } from '../../types'
import { 
  ArrowLeft, 
  FolderKanban, 
  Tag, 
  Calendar, 
  FileText,
  ThumbsUp,
  Heart,
  MessageSquare,
  Layers
} from 'lucide-react'

export default function ViewProject() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { feed, fetchFeedByProject, isLoadingFeed } = strategistDashboardStore()
  const [project, setProject] = useState<Project | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'fields' | 'reports'>('overview')

  // Determine the base path based on current route
  const isOrganization = location.pathname.startsWith('/organization')
  const backPath = isOrganization ? '/organization/projects' : '/strategist/projects'

  useEffect(() => {
    if (id) {
      fetchProjectData(id)
      fetchFeedByProject(id)
    }
  }, [id])

  const fetchProjectData = async (projectId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch all projects with fields and find the one we need
      const projects = await adminApi.getProjectsWithFields()
      const foundProject = projects.find(p => p.id === projectId)
      
      if (!foundProject) {
        setError('Project not found')
        setIsLoading(false)
        return
      }
      
      setProject(foundProject)

      // Fetch the category
      if (foundProject.categoryId) {
        try {
          const categoryData = await categoriesApi.getById(foundProject.categoryId)
          setCategory(categoryData)
        } catch {
          // Category fetch failed, continue without it
        }
      }
    } catch (err) {
      console.error('Failed to fetch project:', err)
      setError('Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate(backPath)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#05A346] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Projects</span>
      </button>

      {/* Project Header Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Project Banner/Image */}
        <div className="h-48 bg-gradient-to-r from-[#183A64] to-[#05A346] relative">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FolderKanban className="w-24 h-24 text-white/30" />
            </div>
          )}
          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 text-[#293749] text-sm font-medium rounded-full shadow-sm">
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#293749] mb-2">{project.name}</h1>
          
          {project.description && (
            <p className="text-gray-600 mb-4">{project.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {project.fields && (
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>{project.fields.length} Field{project.fields.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>{feed?.length || 0} Report{(feed?.length || 0) !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#05A346] text-[#05A346]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'fields'
                  ? 'border-[#05A346] text-[#05A346]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Fields ({project.fields?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-[#05A346] text-[#05A346]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reports ({feed?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-[#293749] mb-3">About this Project</h3>
                {project.description ? (
                  <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description available.</p>
                )}
              </div>

              {/* Category Info */}
              {category && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Category</h4>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#05A346]" />
                    <span className="font-medium text-[#293749]">{category.name}</span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Layers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{project.fields?.length || 0}</div>
                  <div className="text-sm text-blue-600">Fields</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{feed?.length || 0}</div>
                  <div className="text-sm text-green-600">Reports</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center col-span-2 md:col-span-1">
                  <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-purple-600">{formatDate(project.createdAt)}</div>
                  <div className="text-sm text-purple-600">Created</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fields' && (
            <div>
              {project.fields && project.fields.length > 0 ? (
                <div className="space-y-3">
                  {project.fields.map((field: Field) => (
                    <div 
                      key={field.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#05A346]/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#05A346]/10 rounded-lg">
                          <Tag className="w-4 h-4 text-[#05A346]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#293749]">{field.name}</h4>
                          {field.description && (
                            <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No fields have been added to this project yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              {isLoadingFeed ? (
                <div className="flex justify-center py-8">
                  <TBPLoader />
                </div>
              ) : feed && feed.length > 0 ? (
                <div className="space-y-4">
                  {feed.map((report: any) => (
                    <div 
                      key={report.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#05A346]/30 transition-colors"
                    >
                      {/* Report Author */}
                      <div className="flex items-center gap-3 mb-3">
                        {report.strategistProfilePhotoUrl ? (
                          <img
                            src={report.strategistProfilePhotoUrl}
                            alt={`${report.strategistFirstName} ${report.strategistLastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-white font-semibold">
                            {(report.strategistFirstName || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#293749]">
                              {report.strategistFirstName} {report.strategistLastName}
                            </span>
                            <StrategistBadge badgeType={report.badgeType ?? 0} withDot={true} />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
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

                      {/* Report Content */}
                      <h4 className="font-semibold text-[#293749] mb-2">{report.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">{report.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {report.categoryName && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {report.categoryName}
                          </span>
                        )}
                        {report.fieldName && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {report.fieldName}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
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
                          <MessageSquare className="w-4 h-4" />
                          {report.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reports have been submitted for this project yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
