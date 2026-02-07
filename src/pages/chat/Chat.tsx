import { useState, useEffect, useCallback } from 'react'
import type { ChatRoom } from '../../types'
import { authStore } from '../../store/authStore'
import { chatStore } from '../../store/chatStore'
import { chatSignalR } from '../../services/chatSignalR'
import { ChatSidebar, ChatWindow, NewChatModal } from '../../components/chat'
import { cn } from '../../utils/cn'

export const Chat = () => {
  const { user } = authStore()
  const { activeRoomId, setActiveRoom, addRoom, rooms } = chatStore()
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(true)

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Connect to SignalR when authenticated user is available.
  // This avoids a race where the chat page mounts before sessionStorage token is set.
  useEffect(() => {
    if (!user?.id) return

    const signalRAny = chatSignalR as unknown as {
      connectWithRetry?: () => Promise<void>
      connect: () => Promise<void>
    }

    ;(signalRAny.connectWithRetry ? signalRAny.connectWithRetry.call(chatSignalR) : chatSignalR.connect())
      .catch(console.error)

    return () => {
      chatSignalR.disconnect()
    }
  }, [user?.id])

  // Update selected room when activeRoomId changes or rooms update
  useEffect(() => {
    if (activeRoomId) {
      const room = rooms.find(r => r.id === activeRoomId)
      if (room) {
        setSelectedRoom(room)
      }
    }
  }, [activeRoomId, rooms])

  const handleRoomSelect = useCallback((room: ChatRoom) => {
    setSelectedRoom(room)
    setActiveRoom(room.id)
    if (isMobileView) {
      setShowMobileSidebar(false)
    }
  }, [setActiveRoom, isMobileView])

  const handleBack = useCallback(() => {
    setShowMobileSidebar(true)
  }, [])

  const handleNewChat = useCallback(() => {
    setShowNewChatModal(true)
  }, [])

  const handleChatCreated = useCallback((room: ChatRoom) => {
    addRoom(room)
    handleRoomSelect(room)
    setShowNewChatModal(false)
  }, [addRoom, handleRoomSelect])

  return (
    <div className="chat-page-root flex-1 min-h-0 overflow-hidden bg-gray-50 p-2 md:p-4">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex h-full min-h-0">
          {/* Sidebar */}
          <div className={cn(
            'h-full min-h-0',
            isMobileView
              ? cn('absolute inset-0 z-10', showMobileSidebar ? 'block' : 'hidden')
              : 'w-80 flex-shrink-0'
          )}>
            <ChatSidebar
              currentUser={user}
              onRoomSelect={handleRoomSelect}
              onNewChat={handleNewChat}
            />
          </div>

          {/* Chat Window */}
          <div className={cn(
            'flex-1 h-full min-h-0',
            isMobileView && showMobileSidebar && 'hidden'
          )}>
            <ChatWindow
              room={selectedRoom}
              currentUser={user}
              onBack={handleBack}
              isMobile={isMobileView}
            />
          </div>
        </div>

        {/* New Chat Modal */}
        <NewChatModal
          isOpen={showNewChatModal}
          onClose={() => setShowNewChatModal(false)}
          currentUser={user}
          onChatCreated={handleChatCreated}
        />
      </div>
    </div>
  )
}

export default Chat
