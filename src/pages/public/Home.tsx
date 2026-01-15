import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { User, Grid3x3, ChevronUp, Check } from 'lucide-react'
import { strategistStore } from '../../store/strategistStore'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Pagination } from '../../components/ui/Pagination'
import { CountryFlag } from '../../components/ui/CountryFlag'

export const Home = () => {
  const { strategists, pagination, isLoading, fetchStrategists, setSearchQuery } = strategistStore()
  const [localSearch, setLocalSearch] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    fetchStrategists({ pageNumber: 1, pageSize: 12 })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = () => {
    setSearchQuery(localSearch)
    fetchStrategists({ pageNumber: 1, pageSize: 12 })
  }

  const handlePageChange = (page: number) => {
    fetchStrategists({ pageNumber: page, pageSize: 12 })
  }

  return (
    <div className="font-bold">
      {/* Section 1: Hero Section */}
      <div className="relative min-h-screen bg-blue-900">
        {/* Background World Map Graphic */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-blue-900">
            {/* World map with interconnected nodes */}
            <svg className="h-full w-full" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.6">
                {/* North America */}
                <circle cx="300" cy="300" r="12" fill="#60a5fa" />
                <circle cx="300" cy="300" r="20" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                <circle cx="350" cy="350" r="10" fill="#60a5fa" />
                <circle cx="350" cy="350" r="18" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                
                {/* Europe */}
                <circle cx="800" cy="250" r="12" fill="#60a5fa" />
                <circle cx="800" cy="250" r="20" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                <circle cx="900" cy="280" r="10" fill="#60a5fa" />
                
                {/* Asia */}
                <circle cx="1200" cy="350" r="12" fill="#60a5fa" />
                <circle cx="1200" cy="350" r="20" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                <circle cx="1300" cy="400" r="10" fill="#60a5fa" />
                <circle cx="1400" cy="450" r="12" fill="#60a5fa" />
                <circle cx="1400" cy="450" r="20" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                
                {/* Africa */}
                <circle cx="900" cy="600" r="12" fill="#60a5fa" />
                <circle cx="900" cy="600" r="20" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                
                {/* South America */}
                <circle cx="400" cy="650" r="10" fill="#60a5fa" />
                <circle cx="450" cy="700" r="12" fill="#60a5fa" />
                <circle cx="450" cy="700" r="20" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                
                {/* Oceania */}
                <circle cx="1500" cy="700" r="10" fill="#60a5fa" />
                
                {/* Connection lines */}
                <line x1="300" y1="300" x2="800" y2="250" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
                <line x1="800" y1="250" x2="1200" y2="350" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
                <line x1="1200" y1="350" x2="1400" y2="450" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
                <line x1="300" y1="300" x2="400" y2="650" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
                <line x1="800" y1="250" x2="900" y2="600" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
                <line x1="1200" y1="350" x2="1500" y2="700" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
                <line x1="900" y1="600" x2="1200" y2="350" stroke="#60a5fa" strokeWidth="1.5" opacity="0.3" />
              </g>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto text-center">
            {/* Slogan */}
            <p className="text-green-400 text-base md:text-lg font-semibold mb-6 tracking-wide uppercase">
              CONNECTING GLOBAL STRATEGISTS FOR A BETTER FUTURE
            </p>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 leading-tight px-4">
              Join TBP as a Global Strategist for The Neo-Polar Neutrality Global System
            </h1>

            {/* Description */}
            <p className="text-white text-base md:text-lg lg:text-xl mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              At the heart of this effort is the Neo-Polar Neutrality Global System — a bold framework to move beyond
              gridlocked multilateralism and enable nations, businesses, and citizens to engage through neutral trade
              corridors, interoperable infrastructure, and shared digital/physical protocols — while preserving their
              sovereign identity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Link to="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white bg-blue-900 text-white hover:bg-blue-800 min-w-[220px] h-12 text-base font-medium"
                >
                  Become a Global Strategist
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 min-w-[180px] h-12 text-base font-medium"
                >
                  <User className="h-5 w-5 mr-2" />
                  Login Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 & 3: Strategists Directory Section */}
      <div className="bg-white min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header with Title and Search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">TBP Global Strategists</h1>

              {/* Search Bar */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full md:w-64"
                />
                <Button onClick={handleSearch} className="bg-blue-900 text-white hover:bg-blue-800 px-6">
                  Search
                </Button>
              </div>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5 text-gray-400" />
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
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Background Map Banner */}
                    <div className="h-28 bg-gradient-to-br from-teal-700 via-teal-600 to-green-600 relative overflow-hidden">
                      {/* World map pattern with glowing lines */}
                      <div className="absolute inset-0">
                        <svg className="h-full w-full" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Glowing nodes */}
                          <circle cx="80" cy="40" r="4" fill="white" opacity="0.8" />
                          <circle cx="80" cy="40" r="8" fill="white" opacity="0.3" />
                          <circle cx="150" cy="60" r="4" fill="white" opacity="0.8" />
                          <circle cx="150" cy="60" r="8" fill="white" opacity="0.3" />
                          <circle cx="220" cy="30" r="4" fill="white" opacity="0.8" />
                          <circle cx="220" cy="30" r="8" fill="white" opacity="0.3" />
                          <circle cx="280" cy="70" r="4" fill="white" opacity="0.8" />
                          <circle cx="280" cy="70" r="8" fill="white" opacity="0.3" />
                          <circle cx="340" cy="50" r="4" fill="white" opacity="0.8" />
                          <circle cx="340" cy="50" r="8" fill="white" opacity="0.3" />
                          
                          {/* Connection lines */}
                          <line x1="80" y1="40" x2="150" y2="60" stroke="white" strokeWidth="1.5" opacity="0.6" />
                          <line x1="150" y1="60" x2="220" y2="30" stroke="white" strokeWidth="1.5" opacity="0.6" />
                          <line x1="220" y1="30" x2="280" y2="70" stroke="white" strokeWidth="1.5" opacity="0.6" />
                          <line x1="280" y1="70" x2="340" y2="50" stroke="white" strokeWidth="1.5" opacity="0.6" />
                          <line x1="80" y1="40" x2="280" y2="70" stroke="white" strokeWidth="1" opacity="0.4" />
                          <line x1="150" y1="60" x2="340" y2="50" stroke="white" strokeWidth="1" opacity="0.4" />
                        </svg>
                      </div>
                    </div>

                    {/* Profile Image */}
                    <div className="flex justify-center -mt-14 mb-4 relative z-10">
                      <div className="h-28 w-28 rounded-full bg-gray-200 border-4 border-white overflow-hidden shadow-md">
                        {strategist.profilePhotoUrl ? (
                          <img
                            src={strategist.profilePhotoUrl}
                            alt={strategist.fullName || strategist.email}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                            <span className="text-3xl font-semibold text-gray-600">
                              {(strategist.fullName || strategist.firstName || 'S').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name and Country */}
                    <div className="text-center px-4 pb-5">
                      {strategist.fullName && (
                        <h3 className="text-base font-semibold text-gray-900 mb-2">{strategist.fullName}</h3>
                      )}
                      {(strategist.countryName || strategist.country) && (
                        <div className="flex justify-center items-center">
                          <CountryFlag countryName={strategist.countryName || strategist.country} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mb-8">
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
      </div>

      {/* Section 4: About TBP Global Strategist */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-blue-900 mb-8 text-center">About TBP Global Strategist</h2>

          <div className="space-y-6 text-gray-900 leading-relaxed mb-8">
            <p className="text-lg">
              The Borderless Project (TBP) is building a new global system for trade, energy, and cooperation. We are
              looking for exceptional minds ready to co-create history.
            </p>

            <p>
              At the heart of this effort is the Neo-Polar Neutrality System — a bold framework to move beyond gridlocked
              multilateralism and enable nations, businesses, and citizens to engage through neutral trade corridors,
              interoperable infrastructure, and shared digital/physical protocols — while preserving their sovereign
              identity. To shape this vision, we are inviting visionary thinkers and practitioners to join TBP as Global
              Strategists.
            </p>

            <p>
              This is not a traditional paid role. Instead, it is a fellowship-style opportunity to:
            </p>
          </div>

          {/* Opportunities Grid - First 4 with dark blue checkmarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-blue-900 flex items-center justify-center bg-blue-900">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-900 flex-1">
                Gain visibility as a global thought leader in trade, energy, and governance innovation
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-blue-900 flex items-center justify-center bg-blue-900">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-900 flex-1">
                Influence the design of new global systems at the intersection of policy, technology, and infrastructure
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-blue-900 flex items-center justify-center bg-blue-900">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-900 flex-1">
                Engage directly with governments, institutions, and industry leaders
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-blue-900 flex items-center justify-center bg-blue-900">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-900 flex-1">
                Contribute to TBP publications, summits, and international conferences
              </p>
            </div>
          </div>

          {/* Last 2 opportunities with green checkmarks - side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-green-500 flex items-center justify-center bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-900 flex-1">
                Be recognized as a contributor to one of the most ambitious global initiatives of our time
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded border-2 border-green-500 flex items-center justify-center bg-green-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-gray-900 flex-1">
                Work with Neo-Polar Neutrality Global System (NPNGS) Charter House, the forthcoming seat of
                the Governing Council —proposed to be headquartered in the Middle East — helping to shape
                global charters, protocols, and frameworks for neutral trade, energy, and sustainability
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: TBP Project Categories */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-8">TBP Project Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: NPNGS Protocols */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simplified globe with nodes representation */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-blue-400 opacity-60"></div>
                    <div className="absolute top-2 left-2 w-3 h-3 bg-blue-300 rounded-full"></div>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-blue-300 rounded-full"></div>
                    <div className="absolute bottom-4 left-6 w-3 h-3 bg-blue-300 rounded-full"></div>
                    <div className="absolute bottom-6 right-2 w-3 h-3 bg-blue-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">NPNGS Protocols</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Frameworks, standards, and digital governance systems that operationalize neutrality — enabling interoperable trade, finance, and...
                </p>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Card 2: Infrastructure Systems */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 relative">
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  {/* Simplified ship representation */}
                  <div className="w-40 h-16 bg-blue-900 rounded-t-lg relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Infrastructure Systems</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Strategic, modular infrastructure assets — including energy, logistics, and digital corridors — that anchor neutral trade and collaboration...
                </p>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Card 3: City & Regional Development */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 via-green-400 to-green-600 relative">
                <div className="absolute inset-0 flex items-end">
                  {/* Simplified city with green theme */}
                  <div className="w-full flex justify-center gap-2 pb-4">
                    <div className="w-8 h-16 bg-green-700 rounded-t"></div>
                    <div className="w-10 h-20 bg-green-700 rounded-t"></div>
                    <div className="w-8 h-14 bg-green-700 rounded-t"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">City & Regional Development</h3>
                <p className="text-gray-600 text-sm mb-4">
                  The transformation of cities and regions into neutral innovation and trade hubs, through integrated planning, clean energy transition,...
                </p>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Card 4: Sovereign & Multipolar Initiatives */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simplified world map with flags representation */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="w-12 h-8 bg-red-500"></div>
                    <div className="w-12 h-8 bg-blue-500"></div>
                    <div className="w-12 h-8 bg-green-500"></div>
                    <div className="w-12 h-8 bg-yellow-500"></div>
                    <div className="w-12 h-8 bg-red-600"></div>
                    <div className="w-12 h-8 bg-blue-600"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-green-600 mb-3">Sovereign & Multipolar Initiatives</h3>
                <p className="text-gray-600 text-sm mb-4">
                  This focuses on aligning sovereign and multilateral initiatives with neutral governance models, fostering interoperability between global..
                </p>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Card 5: Software & Digital Platforms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simplified digital/tech representation */}
                  <div className="relative">
                    <div className="w-24 h-24 border-2 border-blue-400 rounded-lg transform rotate-45"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-blue-300 rounded transform -rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Software & Digital Platforms</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Core digital engines that power TBP operations — such as data interoperability tools, trade registries, and smart-contract systems — ensuring transparency...
                </p>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>

            {/* Card 6: Event Systems & Global Engagements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simplified people/event representation */}
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600"></div>
                    <div className="w-12 h-12 rounded-full bg-green-600"></div>
                    <div className="w-12 h-12 rounded-full bg-purple-600"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Event Systems & Global Engagements</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Design, management, and delivery of TBP-led summits, forums, conferences, and pilot events that advance the NPNGS vision and...
                </p>
                <Button variant="outline" className="w-full border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: NPNGS Strategist Resource Center */}
      <div className="relative py-16 md:py-24">
        {/* Chessboard background with dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Simplified chessboard pattern representation */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={`${(Math.floor(i / 8) + i) % 2 === 0 ? 'bg-gray-700' : 'bg-gray-900'}`}
                />
              ))}
            </div>
          </div>
          {/* Glass pieces representation - simplified circles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-white/20 border border-white/30"></div>
            <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full bg-white/20 border border-white/30"></div>
            <div className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-full bg-white/20 border border-white/30"></div>
            <div className="absolute bottom-1/4 right-1/4 w-7 h-7 rounded-full bg-white/20 border border-white/30"></div>
            <div className="absolute top-1/2 left-1/2 w-9 h-9 rounded-full bg-white/20 border border-white/30"></div>
            <div className="absolute top-2/3 left-1/5 w-6 h-6 rounded-full bg-white/20 border border-white/30"></div>
            <div className="absolute bottom-1/4 left-2/3 w-8 h-8 rounded-full bg-white/20 border border-white/30"></div>
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              NPNGS Strategieist Resource Center
            </h2>
            <p className="text-white text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
              Gain access to exclusive guides, frameworks, and expert-curated TBP DESQUELET™ materials designed to
              help you innovate, build, and lead within the next generation of the Neo-Polar Neutrality Global System
              (NPNGS). Develop your skills, accelerate your impact, and stay ahead of the global shift — all in one
              place.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100 border-white min-w-[200px]"
            >
              Explore Resources
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-900 text-white p-3 rounded-md shadow-lg hover:bg-blue-800 transition-colors z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
