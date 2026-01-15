import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportStore } from '../../store/reportStore'
import { categoriesApi } from '../../api/categories.api'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'
import { Select } from '../../components/ui/Select'
import { Label } from '../../components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import type { Category, Project, Field } from '../../types'

export const CreateReport = () => {
  const navigate = useNavigate()
  const { createReport, isLoading, error } = reportStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [fields, setFields] = useState<Field[]>([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    projectId: '',
    fieldId: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (formData.categoryId) {
      loadProjects(formData.categoryId)
    } else {
      setProjects([])
      setFields([])
      setFormData({ ...formData, projectId: '', fieldId: '' })
    }
  }, [formData.categoryId])

  useEffect(() => {
    if (formData.projectId) {
      loadFields(formData.projectId)
    } else {
      setFields([])
      setFormData({ ...formData, fieldId: '' })
    }
  }, [formData.projectId])

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const loadProjects = async (categoryId: string) => {
    try {
      const data = await categoriesApi.getProjects(categoryId)
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects', err)
    }
  }

  const loadFields = async (projectId: string) => {
    try {
      const data = await categoriesApi.getFields(projectId)
      setFields(data)
    } catch (err) {
      console.error('Failed to load fields', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createReport({
        ...formData,
        images,
        files,
      })
      navigate('/dashboard')
    } catch (err: any) {
      // Error message is already set in the store with exact backend message
      console.error('Failed to create report:', err.response?.data?.message || err.message)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Report</h1>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Cannot Create Report</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <Label htmlFor="project">Project</Label>
              <Select
                id="project"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
                disabled={!formData.categoryId}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field">Field</Label>
              <Select
                id="field"
                value={formData.fieldId}
                onChange={(e) => setFormData({ ...formData, fieldId: e.target.value })}
                required
                disabled={!formData.projectId}
              >
                <option value="">Select a field</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Write your report content here..."
              />
              <p className="text-sm text-gray-500">You can use HTML for formatting</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Images (Optional)</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files || []))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Files (Optional)</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" isLoading={isLoading}>
                Create Report
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

