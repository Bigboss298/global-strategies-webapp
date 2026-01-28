import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Rss, FileText, User, LogOut, Home } from 'lucide-react'
import { authStore } from '../../store/authStore'
import tbpLogo from '../../assets/TBP_logo.jpeg'

export default function StrategistDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = authStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'feed', label: 'Feed', path: '/strategist/dashboard', icon: Rss },
    { id: 'my-reports', label: 'My Reports', path: '/strategist/my-reports', icon: FileText },
    { id: 'profile', label: 'Profile', path: '/strategist/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-16 md:pb-0">
      {/* LinkedIn-style Top Navbar */}
      <header className="bg-[#FEFEFE] border-b tbp-border sticky top-0 z-50 tbp-card-shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <img src={tbpLogo} alt="TBP" className="h-10 w-auto object-contain" />
              </Link>
            </div>

            {/* Center: Navigation - Desktop Only */}
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
              <Link to="/" className="hidden md:block">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#293749]/70 hover:bg-gray-100 tbp-transition">
                  <Home className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">Home</span>
                </button>
              </Link>

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
