import { useState, useEffect } from 'react'
import { X, Search, Loader2, User as UserIcon } from 'lucide-react'
import type { User, ChatRoom } from '../../types'
import { chatApi } from '../../api/chat.api'
import { strategistsApi } from '../../api/strategists.api'
import { Input } from '../ui/Input'
import { cn } from '../../utils/cn'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User | null
  onChatCreated: (room: ChatRoom) => void
}

interface StrategistOption {
  id: string
  fullName: string
  email: string
  profilePhotoUrl?: string
}

export const NewChatModal = ({ isOpen, onClose, currentUser, onChatCreated }: NewChatModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [strategists, setStrategists] = useState<StrategistOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch strategists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStrategists()
    }
  }, [isOpen])

  const fetchStrategists = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await strategistsApi.getAll({ pageSize: 100 })
      // Filter out current user
      const filtered = response.items
        .filter(s => s.id !== currentUser?.id)
        .map(s => ({
          id: s.id,
          fullName: s.fullName || s.firstName + ' ' + s.lastName || s.email,
          email: s.email,
          profilePhotoUrl: s.profilePhotoUrl
        }))
      setStrategists(filtered)
    } catch (err: any) {
      setError('Failed to load users')
      console.error('Failed to fetch strategists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter strategists based on search
  const filteredStrategists = strategists.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectUser = async (userId: string) => {
    setIsCreating(true)
    setError(null)
    try {
      const room = await chatApi.createOrGetDirectChat({ otherUserId: userId })
      onChatCreated(room)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create chat')
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#293749]">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg tbp-transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#05A346]" />
            </div>
          ) : filteredStrategists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No users found' : 'No users available'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredStrategists.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  disabled={isCreating}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg tbp-transition text-left',
                    'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {user.profilePhotoUrl ? (
                    <img
                      src={user.profilePhotoUrl}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#183A64] flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#293749] truncate">{user.fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Creating indicator */}
        {isCreating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-[#05A346]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating chat...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
