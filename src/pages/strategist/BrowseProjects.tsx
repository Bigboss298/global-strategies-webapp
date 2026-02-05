import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminApi } from '../../api/admin.api'
import { categoriesApi } from '../../api/categories.api'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Select } from '../../components/ui/Select'
import type { Project, Category } from '../../types'
import { FolderKanban, Eye, Filter, ChevronDown, ChevronUp } from 'lucide-react'

export default function BrowseProjects() {
  const location = useLocation()
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Determine the base path based on current route
  const isOrganization = location.pathname.startsWith('/organization')
  const basePath = isOrganization ? '/organization/projects' : '/strategist/projects'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [projectsData, categoriesData] = await Promise.all([
        adminApi.getProjectsWithFields(),
        categoriesApi.getAll()
      ])
      setProjects(projectsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
  }

  // Filter projects by category
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory ? project.categoryId === selectedCategory : true
    return matchesCategory
  })

  // Group projects by category for display
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Uncategorized'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#05A346]/10 rounded-lg">
            <FolderKanban className="h-6 w-6 text-[#05A346]" />
          </div>
          <h1 className="text-2xl font-bold text-[#293749]">Browse Projects</h1>
        </div>
        <p className="text-gray-600">Explore all projects and discover fields you can contribute to</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        {/* Collapsible Filter */}
        <div className="border-gray-100">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#05A346]" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {selectedCategory && (
                <span className="text-xs bg-[#05A346] text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            {isFilterOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isFilterOpen && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>
                {selectedCategory && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <EmptyState
          title="No projects found"
          description={selectedCategory ? "Try adjusting your filters" : "No projects have been created yet"}
        />
      )}

      {/* Project Grid */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Project Image */}
              <div className="h-40 bg-gradient-to-br from-[#183A64] to-[#05A346] relative overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderKanban className="w-16 h-16 text-white/30" />
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 text-[#293749] text-xs font-medium rounded-full shadow-sm">
                    {getCategoryName(project.categoryId)}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#293749] mb-2 line-clamp-1">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {project.description}
                  </p>
                )}

                {/* Fields Count */}
                {project.fields && project.fields.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {project.fields.length} field{project.fields.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* View Details Button */}
                <Link
                  to={`${basePath}/${project.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#05A346] bg-[#05A346]/10 rounded-lg hover:bg-[#05A346] hover:text-white transition-colors w-full justify-center"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
