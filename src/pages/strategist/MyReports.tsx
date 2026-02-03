import { StrategistBadge } from '../../components/StrategistBadge'
import { useEffect, useState } from 'react'
import { strategistDashboardStore } from '../../store/strategist/strategistDashboardStore'
import { authStore } from '../../store/authStore'
import TBPLoader from '../../components/TBPLoader'
import { Plus, X } from 'lucide-react'

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

const formatTime = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleTimeString()
  } catch {
    return 'N/A'
  }
}

export default function MyReports() {
  const user = authStore((state) => state.user)
  const { myReports, isLoadingMyReports, fetchMyReports, categories, projects, fields, fetchCategories, fetchProjects, fetchFieldsByProject, submitReport, error } = strategistDashboardStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    projectId: '',
    fieldId: '',
    images: [] as string[],
    files: [] as string[],
  })

  // Filtered lists based on selections
  const filteredProjects = formData.categoryId
    ? projects.filter((p) => p.categoryId === formData.categoryId)
    : projects

  const filteredFields = formData.projectId
    ? fields.filter((f) => f.projectId === formData.projectId)
    : fields

  useEffect(() => {
    if (user?.id) {
      fetchMyReports(user.id)
    }
  }, [user])

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories()
      fetchProjects()
    }
  }, [isModalOpen])

  useEffect(() => {
    if (formData.projectId) {
      fetchFieldsByProject(formData.projectId)
    }
  }, [formData.projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      console.error('User ID is not available')
      return
    }
    try {
      await submitReport({
        ...formData,
        strategistId: user.id,
      })
      setIsModalOpen(false)
      setFormData({
        title: '',
        content: '',
        categoryId: '',
        projectId: '',
        fieldId: '',
        images: [],
        files: [],
      })
      if (user?.id) {
        fetchMyReports(user.id)
      }
    } catch (err: any) {
      // Error message is already set in the store with exact backend message
      console.error('Failed to submit report:', err.response?.data?.message || err.message)
    }
  }

  if (isLoadingMyReports) {
    return <TBPLoader />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#293749] mb-2">My Reports</h1>
          <p className="text-[#293749]/60 text-sm sm:text-base">{myReports.length} {myReports.length === 1 ? 'report' : 'reports'} published</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 bg-[#05A346] text-white rounded-full sm:rounded-lg hover:bg-[#048A3B] transition-all shadow-md hover:shadow-lg"
          title="Create new report"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">New Report</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Cannot Submit Report</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {myReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#293749] mb-2 flex items-center gap-2">
                  {report.title}
                  <StrategistBadge badgeType={user?.badgeType} withDot={true} />
                </h3>
                <p className="text-[#293749]/80 leading-relaxed">{report.content}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {report.categoryName && (
                <span className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                  📁 {report.categoryName}
                </span>
              )}
              {report.projectName && (
                <span className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-100">
                  📊 {report.projectName}
                </span>
              )}
              {report.fieldName && (
                <span className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  🎯 {report.fieldName}
                </span>
              )}
            </div>

            {/* Images */}
            {report.images && report.images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3">
                {report.images.slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Report image ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}

            {/* Stats Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-[#293749]/60">
                <span className="flex items-center gap-1.5">
                  💬 <span className="font-medium">{report.commentsCount || 0}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  👍 <span className="font-medium">{report.reactionsSummary?.like || 0}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  ❤️ <span className="font-medium">{report.reactionsSummary?.love || 0}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  💡 <span className="font-medium">{report.reactionsSummary?.insightful || 0}</span>
                </span>
              </div>
              <div className="text-sm text-[#293749]/50 font-medium">
                {formatDate(report.dateCreated)} • {formatTime(report.dateCreated)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {myReports.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-[#05A346]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-[#05A346]" />
          </div>
          <h3 className="text-xl font-bold text-[#293749] mb-2">No Reports Yet</h3>
          <p className="text-[#293749]/60 mb-6 max-w-md mx-auto">Start sharing your insights by creating your first report.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Your First Report
          </button>
        </div>
      )}

      {/* Submit Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold text-[#293749]">Create New Report</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#293749] mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all"
                  placeholder="Enter a descriptive title for your report"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#293749] mb-2">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all"
                  rows={8}
                  placeholder="Share your detailed insights and findings..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#293749] mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, projectId: '', fieldId: '' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#293749] mb-2">
                    Project *
                  </label>
                  <select
                    required
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value, fieldId: '' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                    disabled={!formData.categoryId || filteredProjects.length === 0}
                  >
                    <option value="">Select project</option>
                    {filteredProjects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#293749] mb-2">
                    Field *
                  </label>
                  <select
                    required
                    value={formData.fieldId}
                    onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                    disabled={!formData.projectId || filteredFields.length === 0}
                  >
                    <option value="">Select field</option>
                    {filteredFields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#293749] mb-2">
                  Image URLs <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.images.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value.split(',').map((url) => url.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Enter image URLs separated by commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#293749] mb-2">
                  File URLs <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.files.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      files: e.target.value.split(',').map((url) => url.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all"
                  placeholder="https://example.com/file1.pdf, https://example.com/file2.doc"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Enter file URLs separated by commas
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#05A346] text-white rounded-lg hover:bg-[#048A3B] transition-all shadow-md hover:shadow-lg font-medium"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
