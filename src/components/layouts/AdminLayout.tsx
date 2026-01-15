import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Button } from '../ui/Button'
import { authStore } from '../../store/authStore'
import { 
  LayoutDashboard, 
  FolderTree, 
  FolderKanban, 
  Tag, 
  Users, 
  LogOut,
  ChevronUp,
  Rss,
  FileText,
  Menu,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import tbpLogo from '../../assets/TBP_logo.jpeg'

interface AdminLayoutProps {
  children?: ReactNode
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = authStore()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (user?.role !== 1) {
      navigate('/dashboard')
    }
  }, [user, navigate])

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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/feed', label: 'Feed', icon: Rss },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/fields', label: 'Fields', icon: Tag },
    { path: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-[#F3F2EF] flex">
      {/* Desktop Sidebar - LinkedIn-style - TBP Navy (#183A64) */}
      <aside className="hidden lg:block w-64 bg-[#183A64] h-screen fixed left-0 top-0 flex-shrink-0 shadow-lg overflow-y-auto">
        <div className="p-6">
          {/* Logo */}
          <Link to="/admin" className="block mb-8">
            <img src={tbpLogo} alt="TBP" className="h-10 w-auto object-contain mb-3" />
            <div className="text-[#FEFEFE] text-sm font-semibold">Admin Panel</div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium tbp-transition ${
                    isActive
                      ? 'bg-[#05A346] text-[#FEFEFE] shadow-md'
                      : 'text-[#FEFEFE]/80 hover:bg-[#FEFEFE]/10 hover:text-[#FEFEFE]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="mt-8 pt-6 border-t border-[#FEFEFE]/20">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-[#FEFEFE] font-bold">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#FEFEFE] text-sm font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[#FEFEFE]/60 text-xs">Administrator</p>
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
      <div className="flex-1 min-w-0 lg:ml-64">
        {/* Top Header Bar */}
        <header className="bg-[#FEFEFE] border-b tbp-border sticky top-0 z-40 tbp-card-shadow">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-[#293749]" />
                  ) : (
                    <Menu className="h-6 w-6 text-[#293749]" />
                  )}
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-[#293749]">
                  {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMobileMenu}>
            <aside className="w-64 h-full bg-[#183A64] shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Logo */}
                <Link to="/admin" onClick={closeMobileMenu} className="block mb-8">
                  <img src={tbpLogo} alt="TBP" className="h-10 w-auto object-contain mb-3" />
                  <div className="text-[#FEFEFE] text-sm font-semibold">Admin Panel</div>
                </Link>

                {/* Navigation */}
                <nav className="space-y-2 mb-8">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium tbp-transition ${
                          isActive
                            ? 'bg-[#05A346] text-[#FEFEFE] shadow-md'
                            : 'text-[#FEFEFE]/80 hover:bg-[#FEFEFE]/10 hover:text-[#FEFEFE]'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* User Section */}
                <div className="pt-6 border-t border-[#FEFEFE]/20">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#05A346] to-[#048A3B] flex items-center justify-center text-[#FEFEFE] font-bold">
                      {user?.firstName?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#FEFEFE] text-sm font-semibold truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[#FEFEFE]/60 text-xs">Administrator</p>
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
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6">{children || <Outlet />}</main>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#05A346] text-[#FEFEFE] p-4 rounded-full shadow-lg hover:bg-[#048A3B] tbp-transition z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

