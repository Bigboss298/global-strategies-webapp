import * as signalR from '@microsoft/signalr'
import { BASE_URL } from '../api/axiosInstance'
import { chatStore } from '../store/chatStore'
import type { ChatMessage } from '../types'

const isDev = import.meta.env.DEV

const debugLog = (...args: any[]) => {
  if (isDev) console.log(...args)
}

const getHubUrl = () => {
  // Simply replace /api with /hubs/chat in the BASE_URL
  return BASE_URL.replace(/\/api\/?$/, '/hubs/chat')
}

const normalizeIncomingMessage = (raw: any): ChatMessage => {
  const msg = raw ?? {}

  const id = msg.id ?? msg.Id ?? ''
  const chatRoomId = msg.chatRoomId ?? msg.ChatRoomId ?? ''
  const senderId = msg.senderId ?? msg.SenderId ?? ''
  const senderName = msg.senderName ?? msg.SenderName ?? ''
  const senderProfilePhotoUrl = msg.senderProfilePhotoUrl ?? msg.SenderProfilePhotoUrl ?? ''
  const content = msg.content ?? msg.Content ?? ''
  const createdAt = msg.createdAt ?? msg.CreatedAt ?? new Date().toISOString()
  const isRead = msg.isRead ?? msg.IsRead ?? false

  return {
    id: String(id),
    chatRoomId: String(chatRoomId),
    senderId: String(senderId),
    senderName: String(senderName),
    senderProfilePhotoUrl: String(senderProfilePhotoUrl),
    content: String(content),
    createdAt: String(createdAt),
    isRead: Boolean(isRead),
  }
}

class ChatSignalRService {
  private connection: signalR.HubConnection | null = null
  private maxReconnectAttempts = 5
  private currentRoomId: string | null = null
  private isConnecting = false
  private connectAttemptId = 0

  /**
   * Initialize and start the SignalR connection
   */
  async connect(): Promise<void> {
    const token = sessionStorage.getItem('token')
    if (!token) {
      console.warn('No auth token available for SignalR connection')
      chatStore.getState().setError('Disconnected: missing auth token')
      chatStore.getState().setConnectionStatus('disconnected')
      return
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      debugLog('SignalR already connected')
      return
    }

    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      debugLog('SignalR connection already in progress')
      return
    }

    this.isConnecting = true
    chatStore.getState().setConnectionStatus('connecting')
    chatStore.getState().setError(null)

    // Clean up existing connection if any
    if (this.connection) {
      try {
        await this.connection.stop()
      } catch (e) {
        // Ignore cleanup errors
      }
      this.connection = null
    }

    const hubUrl = getHubUrl()
    debugLog('SignalR hub URL:', hubUrl)

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => sessionStorage.getItem('token') || ''
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
            return null // Stop reconnecting
          }
          // Exponential backoff: 0s, 2s, 4s, 8s, 16s
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 16000)
        }
      })
      .configureLogging(isDev ? signalR.LogLevel.Information : signalR.LogLevel.Warning)
      .build()

    this.setupEventHandlers()

    try {
      await this.connection.start()
      debugLog('SignalR connected successfully')
      chatStore.getState().setConnectionStatus('connected')
      chatStore.getState().setError(null)
      this.isConnecting = false

      // Rejoin room if we were in one
      if (this.currentRoomId) {
        await this.joinRoom(this.currentRoomId)
      }
    } catch (error) {
      console.error('SignalR connection failed:', error)
      chatStore.getState().setConnectionStatus('disconnected')
      chatStore.getState().setError(
        `Disconnected: ${error instanceof Error ? error.message : String(error)}`
      )
      this.isConnecting = false
      throw error
    }
  }

  /**
   * Keep trying to connect for a short period. Useful for initial page load
   * where backend might not be ready yet or token is being initialized.
   */
  async connectWithRetry(maxAttempts = 6): Promise<void> {
    const attemptId = ++this.connectAttemptId

    const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // If a newer retry loop started, stop this one.
      if (attemptId !== this.connectAttemptId) return

      // If already connected, stop.
      if (this.isConnected()) return

      try {
        await this.connect()
        return
      } catch (e) {
        // Backoff: 0.5s, 1s, 2s, 4s, 8s...
        const delay = Math.min(500 * Math.pow(2, attempt - 1), 8000)
        if (isDev) {
          console.warn(`SignalR connect attempt ${attempt}/${maxAttempts} failed; retrying in ${delay}ms`, e)
        } else {
          console.warn(`SignalR connect attempt ${attempt}/${maxAttempts} failed; retrying in ${delay}ms`)
        }
        await sleep(delay)
      }
    }
  }

  /**
   * Setup event handlers for SignalR
   */
  private setupEventHandlers(): void {
    if (!this.connection) return

    // Handle incoming messages
    this.connection.on('ReceiveMessage', (message: any) => {
      const normalized = normalizeIncomingMessage(message)
      debugLog('Received message:', normalized)
      chatStore.getState().addMessage(normalized)
    })

    // Handle errors from server
    this.connection.on('Error', (errorMessage: string) => {
      console.error('SignalR server error:', errorMessage)
      chatStore.getState().setError(errorMessage)
    })

    // Handle reconnecting
    this.connection.onreconnecting((error) => {
      console.warn('SignalR reconnecting...', error)
      chatStore.getState().setConnectionStatus('reconnecting')
    })

    // Handle reconnected
    this.connection.onreconnected(async (connectionId) => {
      debugLog('SignalR reconnected:', connectionId)
      chatStore.getState().setConnectionStatus('connected')

      // Rejoin the current room after reconnection
      if (this.currentRoomId) {
        await this.joinRoom(this.currentRoomId)
      }
    })

    // Handle connection closed
    this.connection.onclose((error) => {
      console.warn('SignalR connection closed:', error)
      chatStore.getState().setConnectionStatus('disconnected')
      if (error) {
        chatStore.getState().setError(`Disconnected: ${error.message}`)
      }
    })
  }

  /**
   * Join a chat room to receive messages
   */
  async joinRoom(roomId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn('Cannot join room: SignalR not connected')
      return
    }

    try {
      // Leave previous room if any
      if (this.currentRoomId && this.currentRoomId !== roomId) {
        await this.leaveRoom(this.currentRoomId)
      }

      await this.connection.invoke('JoinRoom', roomId)
      this.currentRoomId = roomId
      debugLog('Joined room:', roomId)
    } catch (error) {
      console.error('Failed to join room:', error)
      throw error
    }
  }

  /**
   * Leave a chat room
   */
  async leaveRoom(roomId: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return
    }

    try {
      await this.connection.invoke('LeaveRoom', roomId)
      if (this.currentRoomId === roomId) {
        this.currentRoomId = null
      }
      debugLog('Left room:', roomId)
    } catch (error) {
      console.error('Failed to leave room:', error)
    }
  }

  /**
   * Send a message via SignalR (real-time)
   */
  async sendMessage(roomId: string, content: string): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR not connected')
    }

    try {
      await this.connection.invoke('SendMessage', roomId, content)
    } catch (error) {
      console.error('Failed to send message via SignalR:', error)
      throw error
    }
  }

  /**
   * Disconnect from SignalR
   */
  async disconnect(): Promise<void> {
    if (this.currentRoomId) {
      await this.leaveRoom(this.currentRoomId)
    }

    if (this.connection) {
      await this.connection.stop()
      this.connection = null
    }

    chatStore.getState().setConnectionStatus('disconnected')
    debugLog('SignalR disconnected')
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  /**
   * Get current connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null
  }
}

// Singleton instance
export const chatSignalR = new ChatSignalRService()
