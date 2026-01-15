import { useState, useEffect } from 'react'
import { adminApi } from '../../api/admin.api'
import { adminDashboardStore } from '../../store/admin/adminDashboardStore'
import type { Project, Category } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Label } from '../../components/ui/Label'
import { Modal } from '../../components/ui/Modal'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export const Projects = () => {
  const { categories, isLoading, fetchCategories, createProject, updateProject, deleteProject } = adminDashboardStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', categoryId: '', imageUrl: '' })

  useEffect(() => {
    fetchProjectsWithFields()
    fetchCategories()
  }, [])

  const fetchProjectsWithFields = async () => {
    try {
      const data = await adminApi.getProjectsWithFields()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects with fields', error)
    }
  }

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  const handleCreate = () => {
    setEditingProject(null)
    setFormData({ name: '', description: '', categoryId: '', imageUrl: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description || '',
      categoryId: project.categoryId,
      imageUrl: project.imageUrl || '',
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData)
      } else {
        await createProject(formData)
      }
      setIsModalOpen(false)
      fetchProjectsWithFields()
    } catch (err) {
      console.error('Failed to save project', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProject(id)
      fetchProjectsWithFields()
    } catch (err) {
      console.error('Failed to delete project', err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const isExpanded = expandedProjects.has(project.id)
            const fieldsCount = project.fields?.length || 0

            return (
              <Card key={project.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">{project.name}</CardTitle>
                      <p className="text-sm text-[#05A346] font-medium mb-1">
                        {categories.find((c) => c.id === project.categoryId)?.name || 'Uncategorized'}
                      </p>
                      {project.description && (
                        <p className="text-sm text-gray-600">{project.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Fields Section */}
                  <div className="border-t border-gray-100 pt-3">
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="flex items-center justify-between w-full text-left hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">
                          Fields
                        </span>
                        <span className="text-xs bg-[#183A64] text-white px-2 py-0.5 rounded-full">
                          {fieldsCount}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2">
                        {fieldsCount === 0 ? (
                          <p className="text-sm text-gray-500 italic px-2">No fields available</p>
                        ) : (
                          project.fields?.map((field) => (
                            <div
                              key={field.id}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-[#05A346] transition-colors"
                            >
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {field.name}
                              </h4>
                              {field.description && (
                                <p className="text-xs text-gray-600">{field.description}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found. Create your first project to get started.</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create Project'}
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
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
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

