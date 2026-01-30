import { StrategistBadge } from '../../components/StrategistBadge'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../api/admin.api'
import { adminDashboardStore } from '../../store/admin/adminDashboardStore'
import TBPLoader from '../../components/TBPLoader'
import { FileText, Trash2, Filter, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'

export const Reports = () => {
  const navigate = useNavigate()
  const { categories, projects, fields, fetchCategories, fetchProjects, fetchFields } = adminDashboardStore()
  const [reports, setReports] = useState<any[]>([])
  const [filteredReports, setFilteredReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [selectedFieldId, setSelectedFieldId] = useState<string>('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filtered lists based on selections
  const filteredProjects = selectedCategoryId
    ? projects.filter((p) => p.categoryId === selectedCategoryId)
    : projects

  const filteredFields = selectedProjectId
    ? fields.filter((f) => f.projectId === selectedProjectId)
    : fields

  useEffect(() => {
    fetchCategories()
    fetchProjects({ pageNumber: 1, pageSize: 100 })
    fetchFields()
    fetchAllReports()
  }, [])

  const fetchAllReports = async () => {
    setIsLoading(true)
    try {
      const data = await adminApi.getAllReports()
      setReports(data)
      setFilteredReports(data)
    } catch (error) {
      console.error('Failed to fetch reports', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setSelectedProjectId('') // Reset project when category changes
    setSelectedFieldId('') // Reset field when category changes
    
    if (!categoryId) {
      fetchAllReports()
      return
    }

    setIsLoading(true)
    try {
      const data = await adminApi.getReportsByCategory(categoryId)
      setFilteredReports(data)
    } catch (error) {
      console.error('Failed to filter reports', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectChange = async (projectId: string) => {
    setSelectedProjectId(projectId)
    setSelectedFieldId('') // Reset field when project changes

    if (!projectId) {
      // If no project selected, revert to category filter if active
      if (selectedCategoryId) {
        handleCategoryChange(selectedCategoryId)
      } else {
        fetchAllReports()
      }
      return
    }

    setIsLoading(true)
    try {
      const data = await adminApi.getReportsByProject(projectId)
      setFilteredReports(data)
    } catch (error) {
      console.error('Failed to filter reports', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = async (fieldId: string) => {
    setSelectedFieldId(fieldId)

    if (!fieldId) {
      // If no field selected, revert to project filter if active
      if (selectedProjectId) {
        handleProjectChange(selectedProjectId)
      } else if (selectedCategoryId) {
        handleCategoryChange(selectedCategoryId)
      } else {
        fetchAllReports()
      }
      return
    }

    setIsLoading(true)
    try {
      const data = await adminApi.getReportsByField(fieldId)
      setFilteredReports(data)
    } catch (error) {
      console.error('Failed to filter reports', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    try {
      await adminApi.deleteReport(id)
      fetchAllReports()
    } catch (err) {
      console.error('Failed to delete report', err)
    }
  }

  const clearFilters = () => {
    setSelectedCategoryId('')
    setSelectedProjectId('')
    setSelectedFieldId('')
    fetchAllReports()
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'N/A'
  }

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || 'N/A'
  }

  const getFieldName = (fieldId: string) => {
    return fields.find((f) => f.id === fieldId)?.name || 'N/A'
  }

  if (isLoading && reports.length === 0) {
    return <TBPLoader />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Review and audit all reports submitted across the platform.</p>
        </div>
        
        <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 self-start md:self-auto min-w-[160px]">
          <div className="bg-green-50 p-2.5 rounded-lg">
            <FileText className="h-6 w-6 text-[#05A346]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Reports</p>
            <p className="text-2xl font-bold text-gray-900">{filteredReports.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-between w-full text-left hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#05A346]" />
            <h3 className="font-semibold text-gray-900">Filter Reports</h3>
            {(selectedCategoryId || selectedProjectId || selectedFieldId) && (
              <span className="text-xs bg-[#05A346] text-white px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(selectedCategoryId || selectedProjectId || selectedFieldId) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFilters()
                }}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            {isFilterOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </button>

        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">By Category</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">By Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent"
                disabled={filteredProjects.length === 0}
              >
                <option value="">All Projects</option>
                {filteredProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">By Field</label>
              <select
                value={selectedFieldId}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent"
                disabled={filteredFields.length === 0}
              >
                <option value="">All Fields</option>
                {filteredFields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No reports found</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={report.title}>
                        {report.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        {report.strategistFirstName} {report.strategistLastName}
                        <StrategistBadge badgeType={report.strategistBadgeType} withDot={true} />
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {report.categoryName || getCategoryName(report.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#183A64] text-white">
                        {report.projectName || getProjectName(report.projectId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {report.fieldName || getFieldName(report.fieldId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.dateCreated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/reports/${report.id}`)}
                        className="text-[#05A346] hover:text-[#048a3a] mr-4"
                        title="View"
                      >
                        <Eye className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
