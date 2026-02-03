import { useEffect } from 'react'
import { adminDashboardStore } from '../../store/admin/adminDashboardStore'
import TBPLoader from '../../components/TBPLoader'
import { Building2, Users, FolderTree, FolderKanban, TrendingUp } from 'lucide-react'

export default function AdminOverview() {
  const {
    organizations,
    users,
    categories,
    projects,
    fetchOrganizations,
    fetchUsers,
    fetchCategories,
    fetchProjects,
    error,
    isLoading,
  } = adminDashboardStore()

  useEffect(() => {
    const loadData = async () => {
      await fetchOrganizations({ pageNumber: 1, pageSize: 10 })
      await fetchUsers({ pageNumber: 1, pageSize: 10 })
      await fetchCategories()
      await fetchProjects({ pageNumber: 1, pageSize: 10 })
    }
    loadData()
  }, [])

  const stats = [
    {
      label: 'Total Organizations',
      value: organizations.length,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: Building2,
    },
    {
      label: 'Total Users',
      value: users.length,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      icon: Users,
    },
    {
      label: 'Categories',
      value: categories.length,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      icon: FolderTree,
    },
    {
      label: 'Projects',
      value: projects.length,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      icon: FolderKanban,
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">System Overview</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <TBPLoader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.lightColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Organizations */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Organizations</h3>
          <div className="space-y-3">
            {organizations.length === 0 ? (
              <p className="text-gray-500 text-sm">No organizations found</p>
            ) : (
              organizations.slice(0, 5).map((org) => (
                <div key={org.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{org.organisationName}</p>
                    <p className="text-sm text-gray-500">{org.sector}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-gray-500 text-sm">No users found</p>
            ) : (
              users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {user.role === 1
                    ? 'Admin'
                    : user.role === 2
                    ? 'Strategist'
                    : user.role === 3
                    ? 'Corp Admin'
                    : 'Corp Team'}
                </span>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
