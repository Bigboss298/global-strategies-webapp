import { useState, useEffect } from 'react'
import { adminApi } from '../../api'
import type { Strategist } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Pagination } from '../../components/ui/Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import TBPLoader from '../../components/TBPLoader'
import { CheckCircle, Ban } from 'lucide-react'

export const AdminStrategists = () => {
  const [strategists, setStrategists] = useState<Strategist[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadStrategists()
  }, [pagination.page, statusFilter, searchQuery])

  const loadStrategists = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      if (searchQuery) {
        params.search = searchQuery
      }

      const response = await adminApi.getStrategists(params)
      setStrategists(response.data)
      setPagination({
        ...pagination,
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (err) {
      console.error('Failed to load strategists', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await adminApi.approveStrategist(id)
      loadStrategists()
    } catch (err) {
      console.error('Failed to approve strategist', err)
    }
  }

  const handleSuspend = async (id: string) => {
    try {
      await adminApi.suspendStrategist(id)
      loadStrategists()
    } catch (err) {
      console.error('Failed to suspend strategist', err)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      await adminApi.activateStrategist(id)
      loadStrategists()
    } catch (err) {
      console.error('Failed to activate strategist', err)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Strategist Management</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPagination({ ...pagination, page: 1 })
          }}
          className="max-w-md"
        />
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any)
            setPagination({ ...pagination, page: 1 })
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {isLoading ? (
        <TBPLoader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {strategists.map((strategist) => (
              <Card key={strategist.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {strategist.profilePhoto ? (
                        <img
                          src={strategist.profilePhoto}
                          alt={strategist.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600">
                          {strategist.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{strategist.name}</CardTitle>
                      <p className="text-sm text-gray-500">{strategist.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        strategist.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : strategist.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {strategist.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {strategist.status === 'pending' && (
                      <Button size="sm" onClick={() => handleApprove(strategist.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    {strategist.status === 'active' && (
                      <Button variant="danger" size="sm" onClick={() => handleSuspend(strategist.id)}>
                        <Ban className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                    {strategist.status === 'suspended' && (
                      <Button size="sm" onClick={() => handleActivate(strategist.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

