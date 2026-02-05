import { useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import type { User, Project } from '../types'

// Types for search results
interface ReportFeed {
  id: string
  title: string
  content: string
  strategistId: string
  strategistName: string
  strategistFirstName: string
  strategistLastName: string
  strategistCountry: string
  strategistProfilePhotoUrl?: string
  badgeType?: number
  categoryName?: string
  projectName?: string
  fieldName?: string
  projectImageUrl?: string
  images?: string[]
  commentsCount: number
  reactionsSummary: {
    like: number
    love: number
    insightful: number
    dislike: number
  }
  userReaction?: string
  dateCreated: string
  dateUpdated?: string
}

export type SearchContextType = 'feed' | 'strategists' | 'projects' | 'my-reports' | 'profile' | 'none'

export interface SearchResult {
  type: SearchContextType
  strategists?: User[]
  projects?: Project[]
  reports?: ReportFeed[]
}

interface UseContextSearchReturn {
  searchContext: SearchContextType
  placeholder: string
  isSearchDisabled: boolean
  isSearching: boolean
  results: SearchResult | null
  search: (query: string) => Promise<void>
  clearResults: () => void
  // For feed page - project filtering
  handleProjectSelect: (projectId: string, projectName: string) => void
  handleClearFilter: () => void
}

export function useContextSearch(userId?: string): UseContextSearchReturn {
  const location = useLocation()
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)

  // Determine search context based on current route
  const searchContext = useMemo((): SearchContextType => {
    const path = location.pathname

    // Strategist dashboard routes
    if (path === '/strategist/dashboard') return 'feed'
    if (path === '/strategist/browse') return 'strategists'
    if (path === '/strategist/projects') return 'projects'
    if (path === '/strategist/my-reports') return 'my-reports'
    if (path === '/strategist/profile') return 'profile'
    if (path.startsWith('/strategist/view/')) return 'none' // Viewing another strategist
    if (path.startsWith('/strategist/projects/')) return 'none' // Viewing a project
    if (path.startsWith('/strategist/reports/')) return 'none' // Viewing a report

    // Organization dashboard routes
    if (path === '/organization/feed' || path === '/organization/dashboard') return 'feed'
    if (path === '/organization/browse-strategists') return 'strategists'
    if (path === '/organization/projects') return 'projects'
    if (path === '/organization/profile') return 'profile'
    if (path.startsWith('/organization/view-strategist/')) return 'none'
    if (path.startsWith('/organization/projects/')) return 'none'
    if (path.startsWith('/organization/reports/')) return 'none'

    return 'none'
  }, [location.pathname])

  // Get placeholder text based on context
  const placeholder = useMemo((): string => {
    switch (searchContext) {
      case 'feed':
        return 'Search reports by project...'
      case 'strategists':
        return 'Search strategists by name...'
      case 'projects':
        return 'Search projects...'
      case 'my-reports':
        return 'Search my reports...'
      case 'profile':
        return 'Search disabled'
      default:
        return 'Search...'
    }
  }, [searchContext])

  // Check if search is disabled
  const isSearchDisabled = searchContext === 'profile' || searchContext === 'none'

  // Search function
  const search = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2 || isSearchDisabled) {
      setResults(null)
      return
    }

    setIsSearching(true)
    try {
      switch (searchContext) {
        case 'feed': {
          // Search projects for feed filtering
          const response = await axiosInstance.get<Project[]>(`/project?search=${encodeURIComponent(query)}`)
          setResults({
            type: 'feed',
            projects: response.data,
          })
          break
        }

        case 'strategists': {
          // Search strategists by name
          const response = await axiosInstance.get<{
            items: User[]
            pageNumber: number
            pageSize: number
            totalCount: number
            totalPages: number
          }>(`/user/paged?search=${encodeURIComponent(query)}&PageNumber=1&PageSize=20`)
          setResults({
            type: 'strategists',
            strategists: response.data.items,
          })
          break
        }

        case 'projects': {
          // Search projects
          const response = await axiosInstance.get<Project[]>(`/project?search=${encodeURIComponent(query)}`)
          setResults({
            type: 'projects',
            projects: response.data,
          })
          break
        }

        case 'my-reports': {
          // Search user's own reports - dispatch event for page to handle
          if (userId) {
            window.dispatchEvent(new CustomEvent('searchMyReports', { detail: { query } }))
            // For my-reports, we don't show dropdown, page handles the search
            setResults(null)
          }
          break
        }

        default:
          setResults(null)
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults(null)
    } finally {
      setIsSearching(false)
    }
  }, [searchContext, userId, isSearchDisabled])

  // Clear results
  const clearResults = useCallback(() => {
    setResults(null)
  }, [])

  // Handle project selection (for feed filtering)
  const handleProjectSelect = useCallback((projectId: string, _projectName: string) => {
    window.dispatchEvent(new CustomEvent('filterByProject', { detail: { projectId } }))
    setResults(null)
  }, [])

  // Handle clear filter (for feed)
  const handleClearFilter = useCallback(() => {
    window.dispatchEvent(new CustomEvent('clearProjectFilter'))
    setResults(null)
  }, [])

  return {
    searchContext,
    placeholder,
    isSearchDisabled,
    isSearching,
    results,
    search,
    clearResults,
    handleProjectSelect,
    handleClearFilter,
  }
}
