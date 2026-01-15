import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from './components/layouts/PublicLayout'
import { AdminLayout } from './components/layouts/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'

// Public Pages
import { Home } from './pages/public/Home'
import { Strategists } from './pages/public/Strategists'
import { About } from './pages/public/About'
import { Activities } from './pages/public/Activities'

// Auth Pages
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { RegisterTeamMember } from './pages/auth/RegisterTeamMember'
import { ForgotPassword } from './pages/auth/ForgotPassword'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOverview from './pages/admin/AdminOverview'
import Organizations from './pages/admin/Organizations'
import Users from './pages/admin/Users'
import { Categories } from './pages/admin/Categories'
import { Projects } from './pages/admin/Projects'
import { Fields } from './pages/admin/Fields'
import { Reports } from './pages/admin/Reports'
import { ReportDetail } from './pages/admin/ReportDetail'

// Organization Pages
import OrganizationDashboard from './pages/organization/OrganizationDashboard'
import OrganizationOverview from './pages/organization/OrganizationOverview'
import OrganizationInvite from './pages/organization/InviteMembers'
import OrganizationStrategists from './pages/organization/OrganizationStrategists'
import OrganizationReports from './pages/organization/OrganizationReports'
import OrganizationProfile from './pages/organization/OrganizationProfile'

// Strategist Pages
import StrategistDashboard from './pages/strategist/StrategistDashboard'
import StrategistFeed from './pages/strategist/StrategistFeed'
import MyReports from './pages/strategist/MyReports'
import StrategistProfile from './pages/strategist/Profile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'strategists', element: <Strategists /> },
      { path: 'about', element: <About /> },
      { path: 'activities', element: <Activities /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'register/team-member', element: <RegisterTeamMember /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'feed', element: <StrategistFeed /> },
      { path: 'reports', element: <Reports /> },
      { path: 'reports/:id', element: <ReportDetail /> },
      { path: 'categories', element: <Categories /> },
      { path: 'projects', element: <Projects /> },
      { path: 'fields', element: <Fields /> },
      { path: 'organizations', element: <Organizations /> },
      { path: 'users', element: <Users /> },
    ],
  },
  {
    path: '/organization',
    element: (
      <ProtectedRoute>
        <OrganizationDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/organization/dashboard" replace /> },
      { path: 'dashboard', element: <OrganizationOverview /> },
      { path: 'feed', element: <StrategistFeed /> },
      { path: 'invite', element: <OrganizationInvite /> },
      { path: 'strategists', element: <OrganizationStrategists /> },
      { path: 'reports', element: <OrganizationReports /> },
      { path: 'profile', element: <OrganizationProfile /> },
    ],
  },
  {
    path: '/strategist',
    element: (
      <ProtectedRoute>
        <StrategistDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/strategist/dashboard" replace /> },
      { path: 'dashboard', element: <StrategistFeed /> },
      { path: 'my-reports', element: <MyReports /> },
      { path: 'profile', element: <StrategistProfile /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

