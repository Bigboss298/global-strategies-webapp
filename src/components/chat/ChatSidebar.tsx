import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, MessageSquare, Loader2, ArrowLeft } from 'lucide-react'
import type { ChatRoom, User } from '../../types'
import { chatStore } from '../../store/chatStore'
import { chatSignalR } from '../../services/chatSignalR'
import { ChatRoomItem } from './ChatRoomItem'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface ChatSidebarProps {
  currentUser: User | null
  onRoomSelect: (room: ChatRoom) => void
  onNewChat: () => void
}

export const ChatSidebar = ({ currentUser, onRoomSelect, onNewChat }: ChatSidebarProps) => {
  const { rooms, activeRoomId, isLoadingRooms, fetchRooms, connectionStatus, error } = chatStore()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([])

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  // Filter rooms based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRooms(rooms)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = rooms.filter(room => {
      // Search by project name
      if (room.projectName?.toLowerCase().includes(query)) return true
      // Search by participant names
      const participants = room.participants ?? []
      return participants.some(p => p.fullName.toLowerCase().includes(query))
    })
    setFilteredRooms(filtered)
  }, [rooms, searchQuery])

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'connecting':
      case 'reconnecting': return 'bg-yellow-500'
      default: return 'bg-red-500'
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 text-[#293749]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-[#293749]">Messages</h2>
            <div 
              className={cn('w-2 h-2 rounded-full', getConnectionStatusColor())}
              title={error ? `${connectionStatus}: ${error}` : `Status: ${connectionStatus}`}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="p-2"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {connectionStatus !== 'connected' && (
          <div className="flex items-center justify-between gap-2 mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <div className="min-w-0">
              <div className="text-xs font-medium text-amber-900" title={error || undefined}>You are disconnected</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const signalRAny = chatSignalR as unknown as {
                  connectWithRetry?: () => Promise<void>
                  connect: () => Promise<void>
                }

                return (signalRAny.connectWithRetry
                  ? signalRAny.connectWithRetry.call(chatSignalR)
                  : chatSignalR.connect()
                ).catch(() => {})
              }}
              className="shrink-0"
              title="Reconnect"
            >
              Reconnect
            </Button>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoadingRooms ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#05A346]" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            {searchQuery ? (
              <p className="text-gray-500">No conversations found</p>
            ) : (
              <>
                <p className="text-gray-500 mb-2">No conversations yet</p>
                <p className="text-sm text-gray-400">Start a new chat to begin messaging</p>
              </>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredRooms.map(room => (
              <ChatRoomItem
                key={room.id}
                room={room}
                isActive={room.id === activeRoomId}
                currentUser={currentUser}
                onClick={() => onRoomSelect(room)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
