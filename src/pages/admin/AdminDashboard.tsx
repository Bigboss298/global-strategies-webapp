import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import tbpLogo from '../../assets/TBP_logo.jpeg'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/admin/dashboard' },
    { id: 'organizations', label: 'Organizations', path: '/admin/organizations' },
    { id: 'users', label: 'Users', path: '/admin/users' },
    { id: 'categories', label: 'Categories', path: '/admin/categories' },
    { id: 'projects', label: 'Projects', path: '/admin/projects' },
    { id: 'fields', label: 'Fields', path: '/admin/fields' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Show logo on mobile, full dashboard title on desktop */}
            <div className="md:hidden">
              <img src={tbpLogo} alt="TBP" className="h-10 w-auto object-contain" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-gray-900">
                Administrator Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Manage organizations, users, and system configuration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  )
}

