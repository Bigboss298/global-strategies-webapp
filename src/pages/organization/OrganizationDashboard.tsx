import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, LogOut, Building2, UserPlus, User } from 'lucide-react'
import { authStore } from '../../store/authStore'
import tbpLogo from '../../assets/TBP_logo.jpeg'

export default function OrganizationDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = authStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/organization/dashboard', icon: LayoutDashboard },
    { id: 'feed', label: 'Feed', path: '/organization/feed', icon: FileText },
    { id: 'invite', label: 'Invite Members', path: '/organization/invite', icon: UserPlus },
    { id: 'strategists', label: 'Strategists', path: '/organization/strategists', icon: Users },
    { id: 'reports', label: 'Reports', path: '/organization/reports', icon: FileText },
    { id: 'profile', label: 'Profile', path: '/organization/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex">
      {/* LinkedIn-style Sidebar - TBP Navy (#183A64) */}
      <aside className="w-64 bg-[#183A64] h-screen fixed left-0 top-0 flex-shrink-0 shadow-lg overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <Link to="/organization/dashboard" className="block mb-8">
            <img src={tbpLogo} alt="TBP" className="h-10 w-auto object-contain mb-3" />
            <div className="text-[#FEFEFE] text-sm font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organization Portal
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path + '/')
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium tbp-transition ${
                    isActive
                      ? 'bg-[#05A346] text-[#FEFEFE] shadow-md'
                      : 'text-[#FEFEFE]/80 hover:bg-[#FEFEFE]/10 hover:text-[#FEFEFE]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="mt-8 pt-6 border-t border-[#FEFEFE]/20">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-[#FEFEFE] font-bold">
                {user?.firstName?.[0] || 'O'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#FEFEFE] text-sm font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[#FEFEFE]/60 text-xs">Organization Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[#FEFEFE]/80 hover:bg-[#FEFEFE]/10 tbp-transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 ml-64">
        {/* Top Header Bar */}
        <header className="bg-[#FEFEFE] border-b tbp-border sticky top-0 z-40 tbp-card-shadow">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#293749]">
                  {tabs.find(tab => location.pathname.startsWith(tab.path))?.label || 'Organization Dashboard'}
                </h1>
                <p className="text-sm text-[#293749]/60 mt-1">
                  Manage your organization's strategists and reports
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
