import { useState, useEffect, useMemo } from 'react'
import { adminDashboardStore } from '../../store/admin/adminDashboardStore'
import type { Category } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Label } from '../../components/ui/Label'
import { Modal } from '../../components/ui/Modal'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Plus, Edit, Trash2, Search, ArrowUpDown } from 'lucide-react'

export const Categories = () => {
  const { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = adminDashboardStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, description: category.description || '' })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
      } else {
        await createCategory(formData)
      }
      setIsModalOpen(false)
      fetchCategories()
    } catch (err) {
      console.error('Failed to save category', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      fetchCategories()
    } catch (err) {
      console.error('Failed to delete category', err)
    }
  }

  const handleSort = (field: 'name' | 'date') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedCategories = useMemo(() => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    filtered.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else {
        comparison = new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [categories, searchQuery, sortBy, sortOrder])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-600 mt-1">Manage content categories</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Description
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
                {filteredAndSortedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'No categories match your search' : 'No categories found'}
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate" title={category.description || 'No description'}>
                          {category.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.dateCreated).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-[#05A346] hover:text-[#048a3a] mr-4"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

