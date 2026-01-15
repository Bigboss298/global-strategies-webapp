import axiosInstance from './axiosInstance'

export interface CorporateDashboard {
  corporateAccountId: string
  organisationName: string
  freeMemberSlots: number
  paidMemberSlots: number
  usedMemberSlots: number
  totalSlots: number
  remainingSlots: number
  paymentHistory: PaymentHistory[]
  teamMembers: TeamMember[]
}

export interface PaymentHistory {
  id: string
  amount: number
  slotsPurchased: number
  paymentReference: string
  paidAt: string
}

export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string
  dateCreated: string
}

export interface InviteTeamMemberRequest {
  email: string
  corporateAccountId: string
}

export interface InviteTeamMemberResponse {
  inviteId: string
  email: string
  token: string
  expiresAt: string
}

export const corporateApi = {
  async getDashboard(corporateId: string): Promise<CorporateDashboard> {
    const response = await axiosInstance.get(`/Corporate/${corporateId}/dashboard`)
    return response.data.data
  },

  async inviteTeamMember(request: InviteTeamMemberRequest): Promise<InviteTeamMemberResponse> {
    const response = await axiosInstance.post('/Auth/invite-team-member', request)
    return response.data.data
  },
}
