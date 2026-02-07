import { useMemo } from 'react'
import { MessageSquare, Users } from 'lucide-react'
import type { ChatRoom, User } from '../../types'
import { RoomType } from '../../types'
import { cn } from '../../utils/cn'

interface ChatRoomItemProps {
  room: ChatRoom
  isActive: boolean
  currentUser: User | null
  onClick: () => void
}

export const ChatRoomItem = ({ room, isActive, currentUser, onClick }: ChatRoomItemProps) => {
  // For direct chats, get the other participant's info
  const displayInfo = useMemo(() => {
    if (room.roomType === RoomType.Project) {
      return {
        name: room.projectName || 'Project Chat',
        avatar: null,
        icon: Users
      }
    }

    // Direct chat - find the other participant
    const otherParticipant = room.participants.find(p => p.userId !== currentUser?.id)
    return {
      name: otherParticipant?.fullName || 'Unknown User',
      avatar: otherParticipant?.profilePhotoUrl || null,
      icon: MessageSquare
    }
  }, [room, currentUser])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const Icon = displayInfo.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg tbp-transition text-left',
        isActive
          ? 'bg-[#05A346]/10 border-l-4 border-[#05A346]'
          : 'hover:bg-gray-50'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {displayInfo.avatar ? (
          <img
            src={displayInfo.avatar}
            alt={displayInfo.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#183A64] flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        {/* Unread badge */}
        {room.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 bg-[#05A346] text-white text-xs font-bold rounded-full">
            {room.unreadCount > 99 ? '99+' : room.unreadCount}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            'font-medium text-[#293749] truncate',
            room.unreadCount > 0 && 'font-semibold'
          )}>
            {displayInfo.name}
          </span>
          {room.lastMessage && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatTime(room.lastMessage.createdAt)}
            </span>
          )}
        </div>
        {room.lastMessage && (
          <p className={cn(
            'text-sm truncate',
            room.unreadCount > 0 ? 'text-[#293749] font-medium' : 'text-gray-500'
          )}>
            {room.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
            {room.lastMessage.content}
          </p>
        )}
      </div>
    </button>
  )
}
