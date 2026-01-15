import { useEffect } from 'react'
import { organizationDashboardStore } from '../../store/organization/organizationDashboardStore'
import { authStore } from '../../store/authStore'

export default function OrganizationReports() {
  const user = authStore((state) => state.user)
  const { reports, isLoadingReports, fetchOrganizationReports, setOrganizationId, error } = organizationDashboardStore()

  useEffect(() => {
    if (user?.corporateAccountId) {
      setOrganizationId(user.corporateAccountId)
      fetchOrganizationReports()
    }
  }, [user])

  if (isLoadingReports) {
    return <div className="flex justify-center py-12">Loading reports...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Organization Reports</h2>
        <p className="text-gray-600">{reports.length} total reports</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
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

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {report.categoryName && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {report.categoryName}
                    </span>
                  )}
                  {report.projectName && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      {report.projectName}
                    </span>
                  )}
                  {report.fieldName && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {report.fieldName}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">
                      By: {report.author?.firstName} {report.author?.lastName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {new Date(report.dateCreated).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-600">
                    <span>💬 {report.commentsCount || 0}</span>
                    <span>👍 {report.reactions?.like || 0}</span>
                    <span>❤️ {report.reactions?.love || 0}</span>
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

      {reports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No reports submitted by your organization's strategists yet.
          </p>
        </div>
      )}
    </div>
  )
}
