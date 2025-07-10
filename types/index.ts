<<<<<<< HEAD
// 공통 타입 정의

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Discord 관련 타입
export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
  locale?: string
  mfa_enabled?: boolean
  premium_type?: number
  public_flags?: number
  flags?: number
}

export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  features: string[]
  permissions_new?: string
}

// 데이터베이스 모델 타입
export interface Guild {
  _id: string
  guildId: string
  guildName: string
  guildIcon?: string
  ownerId: string
  memberCount: number
  settings: GuildSettings
  isActive: boolean
  joinedAt: Date
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

export interface GuildSettings {
  prefix: string
  language: string
  timezone: string
  partyChannelId?: string
  logChannelId?: string
  welcomeChannelId?: string
  autoRole?: string
  partyNotificationRole?: string
  autoDeleteParties: boolean
  requireApproval: boolean
  maxPartiesPerUser: number
  partyDuration: number
  allowAnonymousParties: boolean
}

export interface User {
  _id: string
  userId: string
  username: string
  discriminator?: string
  avatar?: string
  email?: string
  locale: string
  settings: UserSettings
  stats: UserStats
  isActive: boolean
  joinedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  timezone: string
  notifications: {
    partyInvites: boolean
    partyUpdates: boolean
    partyReminders: boolean
    systemUpdates: boolean
  }
  privacy: {
    showProfile: boolean
    showStats: boolean
    allowDM: boolean
  }
}

export interface UserStats {
  partiesCreated: number
  partiesJoined: number
  partiesCompleted: number
  hoursPlayed: number
  lastActive: Date
}

export interface Party {
  _id: string
  partyId: string
  guildId: string
  channelId?: string
  messageId?: string
  creatorId: string
  title: string
  description?: string
  game: GameInfo
  maxParticipants: number
  currentParticipants: number
  participants: PartyParticipant[]
  requirements?: PartyRequirements
  schedule?: PartySchedule
  status: PartyStatus
  visibility: PartyVisibility
  tags: string[]
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  cancelledAt?: Date
}

export interface GameInfo {
  name: string
  type?: string
  platform?: string[]
  difficulty?: string
  estimatedDuration?: number
}

export interface PartyParticipant {
  userId: string
  username: string
  role?: string
  joinedAt: Date
  status: 'active' | 'inactive' | 'kicked' | 'left'
}

export interface PartyRequirements {
  minLevel?: number
  maxLevel?: number
  requiredRoles?: string[]
  bannedRoles?: string[]
  experience?: string
  equipment?: string[]
  other?: string
}

export interface PartySchedule {
  startTime?: Date
  endTime?: Date
  timezone: string
  recurring?: {
    enabled: boolean
    pattern: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: Date
  }
}

export type PartyStatus = 'open' | 'full' | 'started' | 'completed' | 'cancelled'
export type PartyVisibility = 'public' | 'guild-only'

export interface Schedule {
  _id: string
  scheduleId: string
  guildId: string
  creatorId: string
  title: string
  description?: string
  type: ScheduleType
  dateTime: Date
  duration?: number
  timezone: string
  participants: ScheduleParticipant[]
  reminders: ScheduleReminder[]
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  recurringEnd?: Date
  status: ScheduleStatus
  channelId?: string
  messageId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ScheduleType = 'event' | 'tournament' | 'meeting' | 'raid' | 'training' | 'other'
export type ScheduleStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'

export interface ScheduleParticipant {
  userId: string
  username: string
  status: 'attending' | 'maybe' | 'not-attending'
}

export interface ScheduleReminder {
  time: number // 분 단위
  sent: boolean
}

export interface UserPermission {
  _id: string
  userId: string
  guildId: string
  permissions: {
    manageParties: boolean
    manageSchedules: boolean
    manageUsers: boolean
    viewLogs: boolean
    manageSettings: boolean
    sendAnnouncements: boolean
  }
  roles: string[]
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Log {
  _id: string
  logId: string
  guildId?: string
  userId?: string
  action: string
  details: any
  level: 'info' | 'warn' | 'error' | 'debug'
  timestamp: Date
  ip?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

// API 요청/응답 타입
export interface CreatePartyRequest {
  title: string
  description?: string
  game: GameInfo
  maxParticipants: number
  requirements?: PartyRequirements
  schedule?: PartySchedule
  visibility: PartyVisibility
  tags?: string[]
}

export interface UpdatePartyRequest extends Partial<CreatePartyRequest> {
  status?: PartyStatus
}

export interface JoinPartyRequest {
  message?: string
}

export interface CreateScheduleRequest {
  title: string
  description?: string
  type: ScheduleType
  dateTime: Date
  duration?: number
  timezone: string
  isRecurring?: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  recurringEnd?: Date
}

// 컴포넌트 Props 타입
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error: Error }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// 폼 관련 타입
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    custom?: (value: any) => boolean | string
  }
}

export interface FormData {
  [key: string]: any
}

export interface FormErrors {
  [key: string]: string
}

// 유틸리티 타입
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Nullable<T> = T | null

=======
// 공통 타입 정의

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Discord 관련 타입
export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
  locale?: string
  mfa_enabled?: boolean
  premium_type?: number
  public_flags?: number
  flags?: number
}

export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  features: string[]
  permissions_new?: string
}

// 데이터베이스 모델 타입
export interface Guild {
  _id: string
  guildId: string
  guildName: string
  guildIcon?: string
  ownerId: string
  memberCount: number
  settings: GuildSettings
  isActive: boolean
  joinedAt: Date
  lastActivity: Date
  createdAt: Date
  updatedAt: Date
}

export interface GuildSettings {
  prefix: string
  language: string
  timezone: string
  partyChannelId?: string
  logChannelId?: string
  welcomeChannelId?: string
  autoRole?: string
  partyNotificationRole?: string
  autoDeleteParties: boolean
  requireApproval: boolean
  maxPartiesPerUser: number
  partyDuration: number
  allowAnonymousParties: boolean
}

export interface User {
  _id: string
  userId: string
  username: string
  discriminator?: string
  avatar?: string
  email?: string
  locale: string
  settings: UserSettings
  stats: UserStats
  isActive: boolean
  joinedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  timezone: string
  notifications: {
    partyInvites: boolean
    partyUpdates: boolean
    partyReminders: boolean
    systemUpdates: boolean
  }
  privacy: {
    showProfile: boolean
    showStats: boolean
    allowDM: boolean
  }
}

export interface UserStats {
  partiesCreated: number
  partiesJoined: number
  partiesCompleted: number
  hoursPlayed: number
  lastActive: Date
}

export interface Party {
  _id: string
  partyId: string
  guildId: string
  channelId?: string
  messageId?: string
  creatorId: string
  title: string
  description?: string
  game: GameInfo
  maxParticipants: number
  currentParticipants: number
  participants: PartyParticipant[]
  requirements?: PartyRequirements
  schedule?: PartySchedule
  status: PartyStatus
  visibility: PartyVisibility
  tags: string[]
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  cancelledAt?: Date
}

export interface GameInfo {
  name: string
  type?: string
  platform?: string[]
  difficulty?: string
  estimatedDuration?: number
}

export interface PartyParticipant {
  userId: string
  username: string
  role?: string
  joinedAt: Date
  status: 'active' | 'inactive' | 'kicked' | 'left'
}

export interface PartyRequirements {
  minLevel?: number
  maxLevel?: number
  requiredRoles?: string[]
  bannedRoles?: string[]
  experience?: string
  equipment?: string[]
  other?: string
}

export interface PartySchedule {
  startTime?: Date
  endTime?: Date
  timezone: string
  recurring?: {
    enabled: boolean
    pattern: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: Date
  }
}

export type PartyStatus = 'open' | 'full' | 'started' | 'completed' | 'cancelled'
export type PartyVisibility = 'public' | 'guild-only'

export interface Schedule {
  _id: string
  scheduleId: string
  guildId: string
  creatorId: string
  title: string
  description?: string
  type: ScheduleType
  dateTime: Date
  duration?: number
  timezone: string
  participants: ScheduleParticipant[]
  reminders: ScheduleReminder[]
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  recurringEnd?: Date
  status: ScheduleStatus
  channelId?: string
  messageId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ScheduleType = 'event' | 'tournament' | 'meeting' | 'raid' | 'training' | 'other'
export type ScheduleStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'

export interface ScheduleParticipant {
  userId: string
  username: string
  status: 'attending' | 'maybe' | 'not-attending'
}

export interface ScheduleReminder {
  time: number // 분 단위
  sent: boolean
}

export interface UserPermission {
  _id: string
  userId: string
  guildId: string
  permissions: {
    manageParties: boolean
    manageSchedules: boolean
    manageUsers: boolean
    viewLogs: boolean
    manageSettings: boolean
    sendAnnouncements: boolean
  }
  roles: string[]
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Log {
  _id: string
  logId: string
  guildId?: string
  userId?: string
  action: string
  details: any
  level: 'info' | 'warn' | 'error' | 'debug'
  timestamp: Date
  ip?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

// API 요청/응답 타입
export interface CreatePartyRequest {
  title: string
  description?: string
  game: GameInfo
  maxParticipants: number
  requirements?: PartyRequirements
  schedule?: PartySchedule
  visibility: PartyVisibility
  tags?: string[]
}

export interface UpdatePartyRequest extends Partial<CreatePartyRequest> {
  status?: PartyStatus
}

export interface JoinPartyRequest {
  message?: string
}

export interface CreateScheduleRequest {
  title: string
  description?: string
  type: ScheduleType
  dateTime: Date
  duration?: number
  timezone: string
  isRecurring?: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  recurringEnd?: Date
}

// 컴포넌트 Props 타입
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: React.ComponentType<{ error: Error }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

// 폼 관련 타입
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: RegExp
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    custom?: (value: any) => boolean | string
  }
}

export interface FormData {
  [key: string]: any
}

export interface FormErrors {
  [key: string]: string
}

// 유틸리티 타입
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type Nullable<T> = T | null

>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>