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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#293749]/60 text-lg">{myReports.length} published reports</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Report
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

      <div className="space-y-4">
        {myReports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-gray-700 mb-4">{report.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {report.categoryName && (
                    <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      📁 {report.categoryName}
                    </span>
                  )}
                  {report.projectName && (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      📊 {report.projectName}
                    </span>
                  )}
                  {report.fieldName && (
                    <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      🎯 {report.fieldName}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <span>💬 {report.commentsCount || 0} comments</span>
                    <span>👍 {report.reactionsSummary?.like || 0}</span>
                    <span>❤️ {report.reactionsSummary?.love || 0}</span>
                    <span>💡 {report.reactionsSummary?.insightful || 0}</span>
                    <span>👎 {report.reactionsSummary?.dislike || 0}</span>
                  </div>
                  <div className="text-gray-500">
                    {formatDate(report.dateCreated)} at {formatTime(report.dateCreated)}
                  </div>
                </div>
              </div>
            </div>

            {report.images && report.images.length > 0 && (
              <div className="mt-4 flex gap-2">
                {report.images.slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Report image ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {myReports.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You haven't submitted any reports yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Submit Your First Report
          </button>
        </div>
      )}

      {/* Submit Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Submit New Report</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a descriptive title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                  placeholder="Write your detailed report here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, projectId: '', fieldId: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project *
                  </label>
                  <select
                    required
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value, fieldId: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field *
                  </label>
                  <select
                    required
                    value={formData.fieldId}
                    onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs (optional)
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Comma-separated image URLs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter image URLs separated by commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File URLs (optional)
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Comma-separated file URLs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter file URLs separated by commas
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
