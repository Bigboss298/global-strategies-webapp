import type { ReactNode } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { Button } from '../ui/Button'
import { authStore } from '../../store/authStore'
import tbpLogo from '../../assets/TBP_logo.jpeg'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

interface PublicLayoutProps {
  children?: ReactNode
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const location = useLocation()
  const { isAuthenticated, logout } = authStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#F3F2EF]">
      {/* LinkedIn-style Header */}
      <header className="bg-[#FEFEFE] border-b tbp-border sticky top-0 z-50 tbp-card-shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={tbpLogo}
                alt="TBP World Vision Project"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                  location.pathname === '/' 
                    ? 'text-[#05A346] bg-[#05A346]/10' 
                    : 'text-[#293749] hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                  location.pathname === '/about' 
                    ? 'text-[#05A346] bg-[#05A346]/10' 
                    : 'text-[#293749] hover:bg-gray-100'
                }`}
              >
                About
              </Link>
              <Link
                to="/strategists"
                className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                  location.pathname === '/strategists' 
                    ? 'text-[#05A346] bg-[#05A346]/10' 
                    : 'text-[#293749] hover:bg-gray-100'
                }`}
              >
                Strategists
              </Link>
              <Link
                to="/activities"
                className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                  location.pathname === '/activities' 
                    ? 'text-[#05A346] bg-[#05A346]/10' 
                    : 'text-[#293749] hover:bg-gray-100'
                }`}
              >
                Activities
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 tbp-transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#293749]" />
              ) : (
                <Menu className="h-6 w-6 text-[#293749]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t tbp-border">
              <nav className="flex flex-col gap-2 mb-4">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                    location.pathname === '/' 
                      ? 'text-[#05A346] bg-[#05A346]/10' 
                      : 'text-[#293749] hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                    location.pathname === '/about' 
                      ? 'text-[#05A346] bg-[#05A346]/10' 
                      : 'text-[#293749] hover:bg-gray-100'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/strategists"
                  onClick={closeMobileMenu}
                  className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                    location.pathname === '/strategists' 
                      ? 'text-[#05A346] bg-[#05A346]/10' 
                      : 'text-[#293749] hover:bg-gray-100'
                  }`}
                >
                  Strategists
                </Link>
                <Link
                  to="/activities"
                  onClick={closeMobileMenu}
                  className={`px-4 py-2 rounded-lg font-medium tbp-transition ${
                    location.pathname === '/activities' 
                      ? 'text-[#05A346] bg-[#05A346]/10' 
                      : 'text-[#293749] hover:bg-gray-100'
                  }`}
                >
                  Activities
                </Link>
              </nav>

              <div className="flex flex-col gap-2 pt-4 border-t tbp-border">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button variant="primary" size="sm" className="w-full">
                        Join Now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-128px)]">{children || <Outlet />}</main>

      {/* LinkedIn-style Footer */}
      <footer className="bg-[#FEFEFE] border-t tbp-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-[#293749] font-semibold mb-2">TBP Global Strategist Platform</p>
            <p className="text-[#293749]/60 text-sm">
              Copyright © 2025 TBP Global Strategist | Powered by TBP
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

