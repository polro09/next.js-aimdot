// types/api.ts - API 응답 타입 통합 정의

// 기본 사용자 정보 타입
export interface BaseUser {
  discordId: string
  username: string
  discriminator: string
  avatar?: string
  nickname?: string
}

// NextAuth 세션 사용자 타입 (확장된 정보)
export interface SessionUser extends BaseUser {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  status?: 'online' | 'offline' | 'away' | 'dnd'
  lastActive?: Date
  roles?: string[]
}

// 봇 상태 타입
export interface BotStatus {
  status: 'online' | 'offline' | 'maintenance'
  uptime: number
  guilds: number
  users: number
  latency: number
  lastPing: Date
  version: string
}

// 접속 중인 사용자 타입
export interface ConnectedUser extends BaseUser {
  status: 'online' | 'offline' | 'away' | 'dnd'
  lastActive: Date
  joinedAt?: Date
  roles?: string[]
}

// 활동 로그 타입
export interface ActivityLog {
  id: string
  type: 'login' | 'logout' | 'party_created' | 'party_joined' | 'user_joined' | 'user_left' | 'error' | 'warning' | 'command_used'
  message: string
  username?: string
  timestamp: Date
  severity: 'info' | 'warning' | 'error'
  metadata?: Record<string, any>
}

// 대시보드 통계 타입
export interface DashboardStats {
  totalOnline: number
  totalUsers: number
  totalActivities: number
  botUptime: number
}

// 대시보드 API 응답 타입
export interface DashboardApiResponse {
  user: SessionUser
  bot: BotStatus
  connectedUsers: ConnectedUser[]
  recentLogs: ActivityLog[]
  stats: DashboardStats
  timestamp: string
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  error: string
  details?: string
  code?: string
}

// API 성공 응답 래퍼 타입
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  timestamp: string
}

// 통합 API 응답 타입
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// Prisma User 모델과 API 사이의 변환 도우미 타입
export interface PrismaUser {
  id: string
  discordId: string
  username: string | null
  discriminator: string | null
  avatar: string | null
  nickname: string | null
  email: string | null
  lastActive: Date | null
  createdAt: Date
  updatedAt: Date
}

// Prisma 모델을 API 타입으로 변환하는 유틸리티 타입
export type UserFromPrisma = Pick<PrismaUser, 'discordId' | 'username' | 'discriminator' | 'avatar' | 'nickname' | 'lastActive'>

// 타입 가드 함수들
export function isValidUser(user: any): user is BaseUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    typeof user.discordId === 'string' &&
    typeof user.username === 'string' &&
    typeof user.discriminator === 'string' &&
    (user.avatar === undefined || typeof user.avatar === 'string') &&
    (user.nickname === undefined || typeof user.nickname === 'string')
  )
}

export function isConnectedUser(user: any): user is ConnectedUser {
  return (
    isValidUser(user) &&
    ['online', 'offline', 'away', 'dnd'].includes(user.status) &&
    user.lastActive instanceof Date
  )
}

export function isBotStatus(status: any): status is BotStatus {
  return (
    typeof status === 'object' &&
    status !== null &&
    ['online', 'offline', 'maintenance'].includes(status.status) &&
    typeof status.uptime === 'number' &&
    typeof status.guilds === 'number' &&
    typeof status.users === 'number' &&
    typeof status.latency === 'number'
  )
}