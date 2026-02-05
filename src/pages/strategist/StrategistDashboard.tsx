import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Rss, FileText, User, LogOut, Search, X, Users, FolderKanban, Eye } from 'lucide-react'
import { authStore } from '../../store/authStore'
import tbpLogo from '../../assets/TBP_logo.jpeg'
import { useState, useEffect } from 'react'
import { useContextSearch } from '../../hooks/useContextSearch'
import { CountryFlag } from '../../components/ui/CountryFlag'
import { StrategistBadge } from '../../components/StrategistBadge'

export default function StrategistDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = authStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  // Use context-aware search hook
  const {
    searchContext,
    placeholder,
    isSearchDisabled,
    isSearching,
    results,
    search,
    clearResults,
    handleProjectSelect: onProjectSelect,
    handleClearFilter,
  } = useContextSearch(user?.id)

  // Clear search when navigating to a new page
  useEffect(() => {
    setSearchQuery('')
    clearResults()
  }, [location.pathname, clearResults])

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value)
    setShowDropdown(true)
    
    if (value.trim().length < 2) {
      clearResults()
      return
    }

    await search(value)
  }

  const handleProjectSelect = (projectId: string, projectName: string) => {
    setSearchQuery(projectName)
    setShowDropdown(false)
    
    // Navigate to feed if not already there
    if (location.pathname !== '/strategist/dashboard') {
      navigate('/strategist/dashboard')
    }
    
    onProjectSelect(projectId, projectName)
  }

  const handleStrategistSelect = (strategistId: string) => {
    setSearchQuery('')
    setShowDropdown(false)
    clearResults()
    navigate(`/strategist/view/${strategistId}`)
  }

  const handleProjectNavigate = (projectId: string) => {
    setSearchQuery('')
    setShowDropdown(false)
    clearResults()
    navigate(`/strategist/projects/${projectId}`)
  }

  const handleReportSelect = (reportId: string) => {
    setSearchQuery('')
    setShowDropdown(false)
    clearResults()
    navigate(`/strategist/reports/${reportId}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setShowDropdown(false)
    clearResults()
    if (searchContext === 'feed') {
      handleClearFilter()
    }
    // Dispatch events to clear local page filters
    window.dispatchEvent(new CustomEvent('clearGlobalSearch'))
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'feed', label: 'Feed', path: '/strategist/dashboard', icon: Rss },
    { id: 'my-reports', label: 'My Reports', path: '/strategist/my-reports', icon: FileText },
    { id: 'strategists', label: 'Strategists', path: '/strategist/browse', icon: Users },
    { id: 'projects', label: 'Projects', path: '/strategist/projects', icon: FolderKanban },
    { id: 'profile', label: 'Profile', path: '/strategist/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-16 md:pb-0">
      {/* LinkedIn-style Top Navbar */}
      <header className="bg-[#FEFEFE] border-b tbp-border sticky top-0 z-50 tbp-card-shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img src={tbpLogo} alt="TBP" className="h-10 w-auto object-contain" />
              </Link>
            </div>

            {/* Search Bar - Full width on mobile, centered on desktop */}
            <div className="flex flex-1 md:max-w-md relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => !isSearchDisabled && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder={placeholder}
                  disabled={isSearchDisabled}
                  className={`w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#05A346] focus:border-transparent transition-all bg-gray-50 focus:bg-white ${isSearchDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {searchQuery && !isSearchDisabled && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Context-aware Search Results Dropdown */}
              {showDropdown && searchQuery.length >= 2 && !isSearchDisabled && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                  ) : (
                    <>
                      {/* Feed Context - Show projects to filter by */}
                      {searchContext === 'feed' && results?.projects && (
                        results.projects.length > 0 ? (
                          results.projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleProjectSelect(project.id, project.name)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-[#05A346]" />
                                <div className="font-medium text-sm text-[#293749]">{project.name}</div>
                              </div>
                              {project.description && (
                                <div className="text-xs text-gray-500 mt-0.5 ml-6 line-clamp-1">{project.description}</div>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No projects found</div>
                        )
                      )}

                      {/* Strategists Context - Show strategist results */}
                      {searchContext === 'strategists' && results?.strategists && (
                        results.strategists.length > 0 ? (
                          results.strategists.map((strategist) => (
                            <button
                              key={strategist.id}
                              onClick={() => handleStrategistSelect(strategist.id)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-3">
                                {strategist.profilePhotoUrl ? (
                                  <img
                                    src={strategist.profilePhotoUrl}
                                    alt={strategist.fullName || `${strategist.firstName} ${strategist.lastName}`}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-white font-semibold text-xs">
                                    {(strategist.fullName || strategist.firstName || 'U').charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-[#293749] flex items-center gap-1">
                                    <span className="truncate">
                                      {strategist.fullName || `${strategist.firstName} ${strategist.lastName}`}
                                    </span>
                                    <StrategistBadge badgeType={strategist.badgeType} withDot={true} />
                                  </div>
                                  {strategist.headline && (
                                    <div className="text-xs text-gray-500 truncate">{strategist.headline}</div>
                                  )}
                                  {strategist.country && (
                                    <div className="text-xs mt-0.5">
                                      <CountryFlag countryName={strategist.country} />
                                    </div>
                                  )}
                                </div>
                                <Eye className="w-4 h-4 text-gray-400" />
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No strategists found</div>
                        )
                      )}

                      {/* Projects Context - Show projects to navigate to */}
                      {searchContext === 'projects' && results?.projects && (
                        results.projects.length > 0 ? (
                          results.projects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => handleProjectNavigate(project.id)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-[#05A346]" />
                                <div className="font-medium text-sm text-[#293749]">{project.name}</div>
                                <Eye className="w-4 h-4 text-gray-400 ml-auto" />
                              </div>
                              {project.description && (
                                <div className="text-xs text-gray-500 mt-0.5 ml-6 line-clamp-1">{project.description}</div>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No projects found</div>
                        )
                      )}

                      {/* My Reports Context - Show user's reports */}
                      {searchContext === 'my-reports' && results?.reports && (
                        results.reports.length > 0 ? (
                          results.reports.map((report) => (
                            <button
                              key={report.id}
                              onClick={() => handleReportSelect(report.id)}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#05A346]" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-[#293749] truncate">{report.title}</div>
                                  <div className="text-xs text-gray-500">{report.projectName} • {report.fieldName}</div>
                                </div>
                                <Eye className="w-4 h-4 text-gray-400" />
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No reports found</div>
                        )
                      )}

                      {/* No results case */}
                      {!results && !isSearching && (
                        <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: Navigation - Desktop Only */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = location.pathname === tab.path || 
                  (tab.path === '/strategist/dashboard' && location.pathname === '/strategist/dashboard')
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg tbp-transition ${
                      isActive
                        ? 'text-[#05A346] bg-[#05A346]/10'
                        : 'text-[#293749]/70 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                {/* Badge - Show first on mobile, hide on desktop */}
                <span className="inline-block px-2 py-0.5 bg-[#05A346] text-[#FEFEFE] text-xs font-medium rounded-full lg:hidden">Strategist</span>
                
                {user?.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-[#FEFEFE] font-semibold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                
                {/* Name and badge on desktop */}
                <div className="hidden lg:flex flex-col items-start text-left">
                  <p className="text-sm font-semibold text-[#293749]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-[#05A346] text-[#FEFEFE] text-xs font-medium rounded-full">Strategist</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-[#293749]/70 hover:bg-gray-100 tbp-transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FEFEFE] border-t tbp-border z-50 tbp-card-shadow">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path || 
              (tab.path === '/strategist/dashboard' && location.pathname === '/strategist/dashboard')
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex flex-col items-center justify-center flex-1 h-full tbp-transition ${
                  isActive
                    ? 'text-[#05A346]'
                    : 'text-[#293749]/70'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium mt-1">{tab.label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center flex-1 h-full text-[#293749]/70 tbp-transition active:text-red-600"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
