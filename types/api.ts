// types/api.ts - API 응답 타입 정의

// 사용자 타입
export interface ApiUser {
  discordId: string
  username: string
  discriminator: string
  avatar?: string | null
  nickname?: string | null
  status: 'online' | 'offline' | 'away' | 'dnd'
  lastActive?: string
}

// 봇 상태 타입
export interface BotStatus {
  status: 'online' | 'offline' | 'maintenance'
  uptime: number
  guilds: number
  users: number
  latency: number
  lastPing: string
  version: string
  connectedAt?: string | null
}

// 로그 타입
export interface ApiLog {
  id: string
  type: string
  message: string
  user?: string
  timestamp: string
  severity: 'info' | 'warning' | 'error'
  data?: any
}

// 통계 타입
export interface ApiStats {
  totalOnline: number
  totalUsers: number
  totalActivities: number
  botUptime: number
}

// 대시보드 API 응답 타입
export interface DashboardApiResponse {
  user: ApiUser
  bot: BotStatus
  connectedUsers: ApiUser[]
  recentLogs: ApiLog[]
  stats: ApiStats
  timestamp: string
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  error: string
  message?: string
  statusCode?: number
  timestamp?: string
}

// 파티 타입
export interface ApiParty {
  id: string
  title: string
  game: string
  description?: string
  maxPlayers: number
  currentPlayers: number
  startTime: string
  endTime?: string
  status: 'waiting' | 'playing' | 'finished' | 'cancelled'
  createdBy: ApiUser
  participants: ApiUser[]
  createdAt: string
  updatedAt: string
}

// 스케줄 타입
export interface ApiSchedule {
  id: string
  title: string
  description?: string
  startTime: string
  endTime?: string
  type: 'event' | 'maintenance' | 'stream' | 'other'
  recurring?: boolean
  recurrenceRule?: string
  createdBy: ApiUser
  createdAt: string
  updatedAt: string
}

// 서버 설정 타입
export interface ApiGuildSettings {
  guildId: string
  guildName: string
  prefix?: string
  language: string
  welcomeChannel?: string
  logChannel?: string
  partyChannel?: string
  autoRole?: string
  features: {
    parties: boolean
    logging: boolean
    automod: boolean
    welcome: boolean
  }
  updatedAt: string
}

// 권한 타입
export interface ApiPermission {
  id: string
  name: string
  description: string
  level: number
  commands: string[]
}

// 역할 타입
export interface ApiRole {
  id: string
  name: string
  color: string
  position: number
  permissions: ApiPermission[]
  memberCount: number
}

// 활동 로그 타입
export interface ApiActivity {
  id: string
  type: 'command' | 'join' | 'leave' | 'message' | 'voice' | 'other'
  action: string
  user: ApiUser
  guildId: string
  channelId?: string
  details?: any
  timestamp: string
}

// 페이지네이션 타입
export interface ApiPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 페이지네이션된 응답 타입
export interface ApiPaginatedResponse<T> {
  data: T[]
  pagination: ApiPagination
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// 봇 명령어 타입
export interface ApiBotCommand {
  name: string
  description: string
  category: string
  usage: string
  examples?: string[]
  cooldown?: number
  permissions?: string[]
  enabled: boolean
}

// 통계 차트 데이터 타입
export interface ApiChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

// 알림 타입
export interface ApiNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
  expiresAt?: string
}

// 사용자 설정 타입
export interface ApiUserSettings {
  userId: string
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    discord: boolean
    web: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    showActivity: boolean
    allowDirectMessages: boolean
  }
  updatedAt: string
}