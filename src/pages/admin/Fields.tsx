import { useState, useEffect, useMemo } from 'react'
import { adminDashboardStore } from '../../store/admin/adminDashboardStore'
import type { Field } from '../../types'
import { Plus, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react'

export const Fields = () => {
  const { fields, projects, isLoading, fetchFields, fetchProjects, createField, updateField, deleteField } = adminDashboardStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [formData, setFormData] = useState({ name: '', projectId: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'project' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchFields()
    fetchProjects({ pageNumber: 1, pageSize: 100 })
  }, [])

  const handleCreate = () => {
    setEditingField(null)
    setFormData({ name: '', projectId: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (field: Field) => {
    setEditingField(field)
    setFormData({
      name: field.name,
      projectId: field.projectId,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingField) {
        await updateField(editingField.id, formData)
      } else {
        await createField(formData)
      }
      setIsModalOpen(false)
      fetchFields()
    } catch (err) {
      console.error('Failed to save field', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return
    try {
      await deleteField(id)
      fetchFields()
    } catch (err) {
      console.error('Failed to delete field', err)
    }
  }

  const handleSort = (field: 'name' | 'project' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedFields = useMemo(() => {
    let filtered = fields.filter(field => {
      const projectName = projects.find(p => p.id === field.projectId)?.name || ''
      return field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        projectName.toLowerCase().includes(searchQuery.toLowerCase())
    })

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'project') {
        const projectA = projects.find(p => p.id === a.projectId)?.name || ''
        const projectB = projects.find(p => p.id === b.projectId)?.name || ''
        comparison = projectA.localeCompare(projectB)
      } else {
        comparison = new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [fields, projects, searchQuery, sortBy, sortOrder])

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Fields</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048a3a] flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Field
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search fields by name or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'name' && (
                      <span className="text-[#05A346]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('project')}
                >
                  <div className="flex items-center gap-2">
                    Project
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'project' && (
                      <span className="text-[#05A346]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Created
                    <ArrowUpDown className="h-4 w-4" />
                    {sortBy === 'date' && (
                      <span className="text-[#05A346]">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedFields.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'No fields match your search' : 'No fields found'}
                  </td>
                </tr>
              ) : (
                filteredAndSortedFields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{field.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#183A64] text-white">
                    {projects.find((p) => p.id === field.projectId)?.name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(field.dateCreated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(field)}
                    className="text-[#05A346] hover:text-[#048a3a] mr-4"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(field.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingField ? 'Edit Field' : 'Create Field'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#05A346] text-white rounded-lg hover:bg-[#048a3a]"
                >
                  {editingField ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

