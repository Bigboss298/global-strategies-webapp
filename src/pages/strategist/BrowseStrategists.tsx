import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { strategistStore } from '../../store/strategistStore'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { Users, Eye } from 'lucide-react'
import { CountryFlag } from '../../components/ui/CountryFlag'
import { StrategistBadge } from '../../components/StrategistBadge'

export default function BrowseStrategists() {
  const location = useLocation()
  const { strategists, pagination, isLoading, fetchStrategists, setSearchQuery } = strategistStore()

  // Determine the base path based on current route
  const isOrganization = location.pathname.startsWith('/organization')
  const viewPath = isOrganization ? '/organization/view-strategist' : '/strategist/view'

  useEffect(() => {
    fetchStrategists({ pageNumber: 1, pageSize: 12 })
  }, [])

  // Listen for global search clear events
  useEffect(() => {
    const handleClearSearch = () => {
      setSearchQuery('')
      fetchStrategists({ pageNumber: 1, pageSize: 12, search: '' })
    }

    window.addEventListener('clearGlobalSearch', handleClearSearch)

    return () => {
      window.removeEventListener('clearGlobalSearch', handleClearSearch)
    }
  }, [setSearchQuery, fetchStrategists])

  const handlePageChange = (page: number) => {
    fetchStrategists({ pageNumber: page, pageSize: 12 })
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#05A346]/10 rounded-lg">
            <Users className="h-6 w-6 text-[#05A346]" />
          </div>
          <h1 className="text-2xl font-bold text-[#293749]">Browse Strategists</h1>
        </div>
        <p className="text-gray-600">Discover and connect with fellow TBP strategists from around the world</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && strategists.length === 0 && (
        <EmptyState
          title="No strategists found"
          description="Try adjusting your search criteria or check back later"
        />
      )}

      {/* Strategist Grid */}
      {!isLoading && strategists.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {strategists.map((strategist) => (
              <div
                key={strategist.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Background Banner */}
                <div className="h-20 bg-gradient-to-r from-[#183A64] to-[#05A346] relative">
                  <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 400 80" fill="none">
                      <circle cx="50" cy="40" r="3" fill="white" />
                      <circle cx="150" cy="20" r="3" fill="white" />
                      <circle cx="250" cy="60" r="3" fill="white" />
                      <circle cx="350" cy="30" r="3" fill="white" />
                      <line x1="50" y1="40" x2="150" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
                      <line x1="150" y1="20" x2="250" y2="60" stroke="white" strokeWidth="1" opacity="0.5" />
                      <line x1="250" y1="60" x2="350" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="relative flex justify-center" style={{ marginTop: '-40px' }}>
                  <div className="h-20 w-20 rounded-full bg-gray-200 border-4 border-white overflow-hidden shadow-md">
                    {strategist.profilePhotoUrl ? (
                      <img
                        src={strategist.profilePhotoUrl}
                        alt={strategist.fullName || `${strategist.firstName} ${strategist.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center">
                        <span className="text-xl font-semibold text-white">
                          {(strategist.fullName || strategist.firstName || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center px-4 pt-3 pb-4">
                  <h3 className="text-base font-semibold text-[#293749] mb-1 flex items-center gap-2 justify-center">
                    <span className="truncate">
                      {strategist.fullName || `${strategist.firstName} ${strategist.lastName}` || 'Unknown'}
                    </span>
                    <StrategistBadge badgeType={strategist.badgeType} withDot={true} />
                  </h3>
                  
                  {strategist.headline && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{strategist.headline}</p>
                  )}
                  
                  {strategist.country && (
                    <div className="flex justify-center items-center mb-3">
                      <CountryFlag countryName={strategist.country} />
                    </div>
                  )}

                  {/* View Profile Button */}
                  <Link
                    to={`${viewPath}/${strategist.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#05A346] bg-[#05A346]/10 rounded-lg hover:bg-[#05A346] hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={pagination.pageNumber}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
