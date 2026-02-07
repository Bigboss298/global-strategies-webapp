import axiosInstance from './axiosInstance'
import type {
  ChatRoom,
  ChatMessage,
  ChatMessagesPagedResult,
  CreateDirectChatRequest,
  CreateProjectChatRequest
} from '../types'

export const chatApi = {
  /**
   * Get all chat rooms for the current user
   * GET /api/chat/rooms
   */
  getUserChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await axiosInstance.get<ChatRoom[]>('/chat/rooms')
    return response.data
  },

  /**
   * Get or create a direct chat with another user
   * POST /api/chat/rooms/direct
   */
  createOrGetDirectChat: async (request: CreateDirectChatRequest): Promise<ChatRoom> => {
    const response = await axiosInstance.post<ChatRoom>('/chat/rooms/direct', request)
    return response.data
  },

  /**
   * Get or create a project chat room
   * POST /api/chat/rooms/project
   */
  createOrGetProjectChat: async (request: CreateProjectChatRequest): Promise<ChatRoom> => {
    const response = await axiosInstance.post<ChatRoom>('/chat/rooms/project', request)
    return response.data
  },

  /**
   * Get a specific chat room by ID
   * GET /api/chat/rooms/:roomId
   */
  getChatRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await axiosInstance.get<ChatRoom>(`/chat/rooms/${roomId}`)
    return response.data
  },

  /**
   * Get paginated messages for a chat room
   * GET /api/chat/rooms/:roomId/messages
   */
  getMessages: async (roomId: string, page: number = 1, pageSize: number = 50): Promise<ChatMessagesPagedResult> => {
    const response = await axiosInstance.get<ChatMessagesPagedResult>(
      `/chat/rooms/${roomId}/messages`,
      { params: { page, pageSize } }
    )
    return response.data
  },

  /**
   * Send a message to a chat room (REST alternative to SignalR)
   * POST /api/chat/rooms/:roomId/messages
   */
  sendMessage: async (roomId: string, content: string): Promise<ChatMessage> => {
    const response = await axiosInstance.post<ChatMessage>(
      `/chat/rooms/${roomId}/messages`,
      { chatRoomId: roomId, content }
    )
    return response.data
  },

  /**
   * Mark all messages in a room as read
   * POST /api/chat/rooms/:roomId/read
   */
  markMessagesAsRead: async (roomId: string): Promise<void> => {
    await axiosInstance.post(`/chat/rooms/${roomId}/read`)
  }
}
