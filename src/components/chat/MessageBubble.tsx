import { useMemo } from 'react'
import type { ChatMessage, User } from '../../types'
import { cn } from '../../utils/cn'

interface MessageBubbleProps {
  message: ChatMessage
  currentUser: User | null
  showAvatar?: boolean
}

export const MessageBubble = ({ message, currentUser, showAvatar = true }: MessageBubbleProps) => {
  const isOwnMessage = (message.senderId || '').toLowerCase() === (currentUser?.id || '').toLowerCase()

  const formattedTime = useMemo(() => {
    const date = new Date(message.createdAt)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [message.createdAt])

  return (
    <div className={cn(
      'flex gap-2 mb-3',
      isOwnMessage ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <div className="flex-shrink-0">
          {message.senderProfilePhotoUrl ? (
            <img
              src={message.senderProfilePhotoUrl}
              alt={message.senderName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#183A64] flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {message.senderName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Message content */}
      <div className={cn(
        'flex flex-col max-w-[70%]',
        isOwnMessage ? 'items-end' : 'items-start'
      )}>
        {/* Sender name (for other's messages) */}
        {!isOwnMessage && showAvatar && (
          <span className="text-xs text-gray-500 mb-1 ml-1">
            {message.senderName}
          </span>
        )}

        {/* Bubble */}
        <div className={cn(
          'px-4 py-2 rounded-2xl break-words',
          isOwnMessage
            ? 'bg-[#05A346] text-white rounded-br-md'
            : 'bg-gray-100 text-[#293749] rounded-bl-md'
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Time & read status */}
        <div className={cn(
          'flex items-center gap-1 mt-1 px-1',
          isOwnMessage ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-gray-400">{formattedTime}</span>
          {isOwnMessage && (
            <span className="text-xs text-gray-400">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
