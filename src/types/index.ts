// Auth Types
export interface User {
  id: string
  fullName?: string
  firstName: string
  lastName: string
  email: string
  headline?: string
  country?: string
  countryName?: string
  profilePhotoUrl?: string
  phoneNumber?: string
  isActive: boolean
  role: number // 1=Admin, 2=Strategist, 3=CorporateAdmin, 4=CorporateTeam
  corporateAccountId?: string
  
  // Strategist-specific fields
  title?: string
  shortBio?: string
  certification?: string
  cvFileUrl?: string
  
  dateCreated: string
  dateUpdated?: string
}

export type Role = 'Individual' | 'CorporateRepresentative' | 'TeamMember' | 'Admin'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterIndividualRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  certification: string
  title: string
  shortBio: string
  cvFileUrl?: string
  country: string
}

export interface RegisterCorporateRequest {
  organisationName: string
  representativeFirstName: string
  representativeLastName: string
  representativeEmail: string
  phoneNumber: string
  country: string
  sector: string
  companyOverview: string
  contributionInterestAreas: string[]
  supportingDocuments: string[]
  optionalNotes?: string
  password: string
  declarationAccepted: boolean
}

export interface RefreshTokenRequest {
  token: string
}

// Strategist Types
export interface Strategist {
  id: string
  name: string
  email: string
  profilePhoto?: string
  country?: string
  countryFlag?: string
  professionalHeadline?: string
  bio?: string
  status: 'pending' | 'active' | 'suspended'
  createdAt: string
}

// Category, Project, Field Types
export interface Category {
  id: string
  name: string
  description?: string
  dateCreated: string
  dateUpdated?: string
}

export interface Field {
  id: string
  name: string
  projectId: string
  dateCreated: string
  dateUpdated?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  categoryId: string
  imageUrl?: string
  fields?: Field[]
  createdAt: string
  updatedAt: string
}

export interface ProjectWithFields extends Project {
  fields: Field[]
}

// Corporate Account / Organization Types
export interface CorporateAccount {
  id: string
  organisationName: string
  sector: string
  country: string
  state: string
  city: string
  officeAddress?: string
  website?: string
  contactPhone?: string
  contactEmail?: string
  freeMemberSlots: number
  paidMemberSlots: number
  usedMemberSlots: number
  totalSlots: number
  remainingSlots: number
  dateCreated: string
  dateUpdated?: string
  
  // Legacy fields for backward compatibility
  industry?: string
  companySize?: string
  websiteUrl?: string
  linkedInUrl?: string
  representativeName?: string
  representativeDesignation?: string
  representativeEmail?: string
  phoneNumber?: string
  companyOverview?: string
  contributionInterestAreas?: string[]
  supportingDocuments?: string[]
  optionalNotes?: string
  declarationAccepted?: boolean
}

export type Organization = CorporateAccount

// Report Types
export interface Report {
  id: string
  title: string
  content: string
  categoryId: string
  categoryName?: string
  projectId: string
  projectName?: string
  fieldId: string
  fieldName?: string
  authorId: string
  author?: User
  images?: string[]
  files?: string[]
  commentsCount?: number
  reactions?: ReactionSummary
  dateCreated: string
  dateUpdated?: string
  createdAt?: string
  updatedAt?: string
}

export interface ReactionSummary {
  like: number
  dislike: number
  love: number
}

export interface Reaction {
  id: string
  reportId: string
  userId: string
  type: 'like' | 'dislike' | 'love'
  createdAt: string
}

export interface Comment {
  id: string
  reportId: string
  userId: string
  user: Strategist
  content: string
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

