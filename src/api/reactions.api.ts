import axiosInstance from './axiosInstance'

export const ReactionType = {
  Like: 1,
  Love: 2,
  Insightful: 3,
  Dislike: 4,
} as const

export type ReactionType = typeof ReactionType[keyof typeof ReactionType]

export interface CreateReactionData {
  reportId: string
  strategistId: string
  reactionType: ReactionType
}

export interface Reaction {
  id: string
  reportId: string
  strategistId: string
  strategistName: string
  reactionType: ReactionType
  createdAt: string
}

export interface ReactionsSummary {
  like: number
  love: number
  insightful: number
  dislike: number
}

export interface Comment {
  id: string
  reportId: string
  strategistId: string
  strategistName: string
  strategistProfilePhotoUrl?: string
  badgeType?: number
  content: string
  createdAt: string
  updatedAt?: string
}

export const reactionsApi = {
  addOrUpdate: async (data: CreateReactionData): Promise<Reaction> => {
    const response = await axiosInstance.post<Reaction>(
      `/reaction/reports/${data.reportId}`,
      data
    )
    return response.data
  },

  remove: async (reportId: string, strategistId: string): Promise<void> => {
    await axiosInstance.delete(`/reaction/reports/${reportId}`, {
      params: { strategistId },
    })
  },

  getByReportAndStrategist: async (
    reportId: string,
    strategistId: string
  ): Promise<Reaction | null> => {
    try {
      const response = await axiosInstance.get<Reaction>(
        `/reaction/report/${reportId}/strategist/${strategistId}`
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  getReactions: async (reportId: string): Promise<Reaction[]> => {
    const response = await axiosInstance.get<Reaction[]>(
      `/reaction/report/${reportId}`
    )
    return response.data
  },

  getSummary: async (reportId: string): Promise<ReactionsSummary> => {
    const response = await axiosInstance.get<ReactionsSummary>(
      `/reaction/report/${reportId}/summary`
    )
    return response.data
  },

  // Comments API
  getComments: async (reportId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>(
      `/comment/report/${reportId}`
    )
    return response.data
  },

  addComment: async (reportId: string, strategistId: string, content: string): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `/comment/reports/${reportId}`,
      { reportId, strategistId, content }
    )
    return response.data
  },

  deleteComment: async (commentId: string, strategistId: string): Promise<void> => {
    await axiosInstance.delete(`/comment/${commentId}`, {
      params: { strategistId },
    })
  },
}
