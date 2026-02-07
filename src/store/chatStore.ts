import { create } from 'zustand'
import type { ChatRoom, ChatMessage } from '../types'
import { chatApi } from '../api/chat.api'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

interface ChatState {
  // State
  rooms: ChatRoom[]
  activeRoomId: string | null
  messagesByRoom: Record<string, ChatMessage[]>
  connectionStatus: ConnectionStatus
  isLoadingRooms: boolean
  isLoadingMessages: boolean
  error: string | null

  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void
  setActiveRoom: (roomId: string | null) => void
  setError: (error: string | null) => void

  // Room actions
  fetchRooms: () => Promise<void>
  addRoom: (room: ChatRoom) => void
  updateRoomLastMessage: (roomId: string, message: ChatMessage) => void
  decrementUnreadCount: (roomId: string) => void

  // Message actions
  fetchMessages: (roomId: string, page?: number, pageSize?: number) => Promise<void>
  addMessage: (message: ChatMessage) => void
  prependMessages: (roomId: string, messages: ChatMessage[]) => void
  markRoomAsRead: (roomId: string) => Promise<void>

  // Cleanup
  clearChat: () => void
}

export const chatStore = create<ChatState>()((set, get) => ({
  // Initial state
  rooms: [],
  activeRoomId: null,
  messagesByRoom: {},
  connectionStatus: 'disconnected',
  isLoadingRooms: false,
  isLoadingMessages: false,
  error: null,

  // Connection status
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  // Active room
  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  // Error handling
  setError: (error) => set({ error }),

  // Fetch all rooms for the user
  fetchRooms: async () => {
    set({ isLoadingRooms: true, error: null })
    try {
      const rooms = await chatApi.getUserChatRooms()
      set({ rooms, isLoadingRooms: false })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chat rooms'
      set({ error: errorMessage, isLoadingRooms: false })
    }
  },

  // Add a new room to the list
  addRoom: (room) => {
    set((state) => {
      // Check if room already exists
      const exists = state.rooms.some(r => r.id === room.id)
      if (exists) {
        return { rooms: state.rooms.map(r => r.id === room.id ? room : r) }
      }
      return { rooms: [room, ...state.rooms] }
    })
  },

  // Update last message and move room to top
  updateRoomLastMessage: (roomId, message) => {
    set((state) => {
      const updatedRooms = state.rooms.map(room => {
        if (room.id === roomId) {
          const isActiveRoom = state.activeRoomId === roomId
          return {
            ...room,
            lastMessage: message,
            unreadCount: isActiveRoom ? room.unreadCount : room.unreadCount + 1
          }
        }
        return room
      })
      // Sort rooms by last message time
      updatedRooms.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.createdAt
        const bTime = b.lastMessage?.createdAt || b.createdAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
      return { rooms: updatedRooms }
    })
  },

  // Decrement unread count when room is opened
  decrementUnreadCount: (roomId) => {
    set((state) => ({
      rooms: state.rooms.map(room =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room
      )
    }))
  },

  // Fetch messages for a room
  fetchMessages: async (roomId, page = 1, pageSize = 50) => {
    set({ isLoadingMessages: true, error: null })
    try {
      const result = await chatApi.getMessages(roomId, page, pageSize)
      set((state) => {
        const existingMessages = state.messagesByRoom[roomId] || []
        // If page 1, replace; otherwise prepend older messages
        const newMessages = page === 1
          ? result.items.reverse() // Reverse to show oldest first
          : [...result.items.reverse(), ...existingMessages]

        return {
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: newMessages
          },
          isLoadingMessages: false
        }
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch messages'
      set({ error: errorMessage, isLoadingMessages: false })
    }
  },

  // Add a new message (from SignalR or after sending)
  addMessage: (message) => {
    set((state) => {
      const roomMessages = state.messagesByRoom[message.chatRoomId] || []
      // Avoid duplicates
      if (roomMessages.some(m => m.id === message.id)) {
        return state
      }
      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [message.chatRoomId]: [...roomMessages, message]
        }
      }
    })
    // Also update room's last message
    get().updateRoomLastMessage(message.chatRoomId, message)
  },

  // Prepend older messages (for pagination)
  prependMessages: (roomId, messages) => {
    set((state) => {
      const existingMessages = state.messagesByRoom[roomId] || []
      return {
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: [...messages, ...existingMessages]
        }
      }
    })
  },

  // Mark room messages as read
  markRoomAsRead: async (roomId) => {
    try {
      await chatApi.markMessagesAsRead(roomId)
      get().decrementUnreadCount(roomId)
    } catch (error) {
      console.error('Failed to mark messages as read:', error)
    }
  },

  // Clear all chat state (on logout)
  clearChat: () => {
    set({
      rooms: [],
      activeRoomId: null,
      messagesByRoom: {},
      connectionStatus: 'disconnected',
      isLoadingRooms: false,
      isLoadingMessages: false,
      error: null
    })
  }
}))
