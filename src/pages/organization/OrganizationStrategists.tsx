import { useEffect } from 'react'
import { organizationDashboardStore } from '../../store/organization/organizationDashboardStore'
import { authStore } from '../../store/authStore'
import { CountryFlag } from '../../components/ui/CountryFlag'

export default function OrganizationStrategists() {
  const user = authStore((state) => state.user)
  const { strategists, isLoadingStrategists, fetchOrganizationStrategists, setOrganizationId, error } = organizationDashboardStore()

  useEffect(() => {
    if (user?.corporateAccountId) {
      setOrganizationId(user.corporateAccountId)
      fetchOrganizationStrategists()
    }
  }, [user])

  if (isLoadingStrategists) {
    return <div className="flex justify-center py-12">Loading strategists...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Our Strategists</h2>
        <p className="text-gray-600">{strategists.length} total strategists</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategists.map((strategist) => (
          <div
            key={strategist.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {(strategist.fullName || strategist.firstName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {strategist.firstName} {strategist.lastName}
                </h3>
                <p className="text-sm text-gray-500">{strategist.title || 'Strategist'}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-2">Email:</span>
                <span>{strategist.email}</span>
              </div>

              {strategist.countryName && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Country:</span>
                  <CountryFlag countryName={strategist.countryName} showName={false} />
                </div>
              )}

              {strategist.phoneNumber && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Phone:</span>
                  <span>{strategist.phoneNumber}</span>
                </div>
              )}

              {strategist.certification && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Certification:</span>
                  <span>{strategist.certification}</span>
                </div>
              )}
            </div>

            {strategist.bio && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-700 line-clamp-3">{strategist.bio}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {strategists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No strategists found in your organization.</p>
        </div>
      )}
    </div>
  )
}
