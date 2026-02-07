import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Loader2, ArrowLeft, Users, MessageSquare, AlertCircle } from 'lucide-react'
import type { ChatRoom, ChatMessage, User } from '../../types'
import { RoomType } from '../../types'
import { chatStore } from '../../store/chatStore'
import { chatSignalR } from '../../services/chatSignalR'
import { chatApi } from '../../api/chat.api'
import { MessageBubble } from './MessageBubble'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

interface ChatWindowProps {
  room: ChatRoom | null
  currentUser: User | null
  onBack?: () => void
  isMobile?: boolean
}

export const ChatWindow = ({ room, currentUser, onBack, isMobile = false }: ChatWindowProps) => {
  const { messagesByRoom, isLoadingMessages, fetchMessages, addMessage, markRoomAsRead, connectionStatus } = chatStore()
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const messages = room ? (messagesByRoom[room.id] || []) : []

  // Track if messages have been fetched for each room
  const fetchedRoomsRef = useRef<Set<string>>(new Set())

  // Get room display info
  const roomInfo = useMemo(() => {
    if (!room) return null

    if (room.roomType === RoomType.Project) {
      return {
        name: room.projectName || 'Project Chat',
        subtitle: `${room.participants.length} participants`,
        avatar: null,
        icon: Users
      }
    }

    const otherParticipant = room.participants.find(p => p.userId !== currentUser?.id)
    return {
      name: otherParticipant?.fullName || 'Unknown User',
      subtitle: 'Direct message',
      avatar: otherParticipant?.profilePhotoUrl || null,
      icon: MessageSquare
    }
  }, [room, currentUser])

  // Load messages when room changes
  useEffect(() => {
    if (room && !fetchedRoomsRef.current.has(room.id)) {
      fetchedRoomsRef.current.add(room.id)
      fetchMessages(room.id)
    }
  }, [room?.id, fetchMessages])

  // Join room via SignalR - re-run when connection status changes
  useEffect(() => {
    if (!room) return

    let isMounted = true
    let retryTimeout: ReturnType<typeof setTimeout> | null = null

    const tryJoinRoom = async (retries = 3) => {
      if (!isMounted) return

      // Check if actually connected before trying
      if (connectionStatus === 'connected' && chatSignalR.isConnected()) {
        try {
          await chatSignalR.joinRoom(room.id)
          markRoomAsRead(room.id)
        } catch (error) {
          console.error('Failed to join room:', error)
        }
      } else if (retries > 0) {
        // Retry after a short delay if not connected yet
        retryTimeout = setTimeout(() => tryJoinRoom(retries - 1), 500)
      }
    }

    tryJoinRoom()

    return () => {
      isMounted = false
      if (retryTimeout) clearTimeout(retryTimeout)
      if (chatSignalR.isConnected()) {
        chatSignalR.leaveRoom(room.id)
      }
    }
  }, [room?.id, connectionStatus, markRoomAsRead])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!room || !newMessage.trim() || isSending) return

    const content = newMessage.trim()
    setNewMessage('')
    setIsSending(true)
    setSendError(null)

    try {
      // Try SignalR first if connected
      if (chatSignalR.isConnected()) {
        await chatSignalR.sendMessage(room.id, content)
      } else {
        // Fallback to REST API
        const message = await chatApi.sendMessage(room.id, content)
        addMessage(message)
      }
    } catch (error: any) {
      console.error('Failed to send message:', error)
      setSendError('Failed to send message. Please try again.')
      setNewMessage(content) // Restore the message
    } finally {
      setIsSending(false)
      inputRef.current?.focus()
    }
  }

  // Handle Enter key (send on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    setSendError(null)

    // Auto-resize
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: ChatMessage[] }[] = []
    let currentDate = ''

    messages.forEach(msg => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString()
      if (msgDate !== currentDate) {
        currentDate = msgDate
        groups.push({ date: currentDate, messages: [msg] })
      } else {
        groups[groups.length - 1].messages.push(msg)
      }
    })

    return groups
  }, [messages])

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toLocaleDateString()) return 'Today'
    if (dateStr === yesterday.toLocaleDateString()) return 'Yesterday'
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
  }

  // Empty state
  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-[#293749] mb-2">Select a conversation</h3>
        <p className="text-gray-500 text-center">
          Choose a chat from the sidebar or start a new conversation
        </p>
      </div>
    )
  }

  const Icon = roomInfo?.icon || MessageSquare

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
        {isMobile && (
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}

        {roomInfo?.avatar ? (
          <img
            src={roomInfo.avatar}
            alt={roomInfo.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#183A64] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#293749] truncate">{roomInfo?.name}</h3>
          <p className="text-sm text-gray-500 truncate">{roomInfo?.subtitle}</p>
        </div>

        {/* Connection status indicator */}
        <div className={cn(
          'px-2 py-1 rounded-full text-xs',
          connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
          connectionStatus === 'reconnecting' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        )}>
          {connectionStatus === 'connected' ? 'Online' :
           connectionStatus === 'reconnecting' ? 'Reconnecting...' :
           'Offline'}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#05A346]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Send a message to start the conversation</p>
          </div>
        ) : (
          <>
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                    {formatDateLabel(group.date)}
                  </span>
                </div>

                {/* Messages for this date */}
                {group.messages.map((message, msgIndex) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    currentUser={currentUser}
                    showAvatar={
                      msgIndex === 0 ||
                      (group.messages[msgIndex - 1]?.senderId || '').toLowerCase() !== (message.senderId || '').toLowerCase()
                    }
                  />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Send Error */}
      {sendError && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {sendError}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-2xl border-2 border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#05A346] max-h-[120px]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="rounded-full p-3"
            size="sm"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
