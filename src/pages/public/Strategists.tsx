import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { strategistStore } from '../../store/strategistStore'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Search, Grid3x3, Eye } from 'lucide-react'
import { CountryFlag } from '../../components/ui/CountryFlag'
import { StrategistBadge } from '../../components/StrategistBadge'

export const Strategists = () => {
  const { strategists, pagination, isLoading, fetchStrategists, setSearchQuery } = strategistStore()
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    fetchStrategists({ pageNumber: 1, pageSize: 12 })
  }, [])

  const handleSearch = () => {
    setSearchQuery(localSearch)
    fetchStrategists({ pageNumber: 1, pageSize: 12 })
  }

  const handlePageChange = (page: number) => {
    fetchStrategists({ pageNumber: page, pageSize: 12 })
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">TBP Global Strategists</h1>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2 mb-6">
            <Grid3x3 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Grid View</span>
          </div>
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
            description="Try adjusting your search criteria"
          />
        )}

        {/* Strategist Grid */}
        {!isLoading && strategists.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {strategists.map((strategist) => (
                <div
                  key={strategist.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Background Map Banner */}
                  <div className="h-24 bg-gradient-to-r from-teal-600 to-green-600 relative">
                    <div className="absolute inset-0 opacity-30">
                      {/* Simplified network map pattern */}
                      <svg className="h-full w-full" viewBox="0 0 400 100" fill="none">
                        <circle cx="50" cy="50" r="3" fill="white" />
                        <circle cx="150" cy="30" r="3" fill="white" />
                        <circle cx="250" cy="70" r="3" fill="white" />
                        <circle cx="350" cy="40" r="3" fill="white" />
                        <line x1="50" y1="50" x2="150" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="150" y1="30" x2="250" y2="70" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="250" y1="70" x2="350" y2="40" stroke="white" strokeWidth="1" opacity="0.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Profile Image - clickable */}
                  <div className="relative flex justify-center mb-4" style={{ height: '48px' }}>
                    <Link 
                      to={`/strategists/${strategist.id}`}
                      className="absolute left-1/2 -translate-x-1/2 -top-12 h-24 w-24 rounded-full bg-gray-200 border-4 border-white overflow-hidden shadow-md hover:ring-4 hover:ring-[#05A346]/30 transition-all">
                      {strategist.profilePhotoUrl ? (
                        <img
                          src={strategist.profilePhotoUrl}
                          alt={strategist.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                          <span className="text-2xl font-semibold text-gray-600">
                            {(strategist.fullName || strategist.firstName || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Name and Badge - clickable */}
                  <div className="text-center px-4 pb-4">
                    <Link 
                      to={`/strategists/${strategist.id}`}
                      className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2 justify-center hover:text-[#05A346] transition-colors"
                    >
                      {strategist.fullName || `${strategist.firstName} ${strategist.lastName}` || 'Unknown'}
                      <StrategistBadge badgeType={strategist.badgeType} withDot={true} />
                    </Link>
                    {strategist.country && (
                      <div className="flex justify-center items-center mt-1">
                        <CountryFlag countryName={strategist.country} />
                      </div>
                    )}
                    {/* View Profile Button */}
                    <Link
                      to={`/strategists/${strategist.id}`}
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 text-sm font-medium text-[#05A346] bg-[#05A346]/10 rounded-lg hover:bg-[#05A346] hover:text-white transition-colors"
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
              <Pagination
                currentPage={pagination.pageNumber}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

