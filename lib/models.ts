// lib/models.ts - 데이터베이스 모델 정의

export interface User {
  id: string
  discordId: string
  username: string
  discriminator: string
  avatar?: string
  nickname?: string
  email?: string
  createdAt: Date
  updatedAt: Date
  lastActive: Date
  status: 'online' | 'offline' | 'away' | 'dnd'
  roles: string[]
}

export interface BotStatus {
  id: string
  status: 'online' | 'offline' | 'maintenance'
  uptime: number
  lastPing: Date
  version: string
  guilds: number
  users: number
  latency: number
}

export interface ActivityLog {
  id: string
  type: 'login' | 'logout' | 'party_created' | 'party_joined' | 'user_joined' | 'user_left' | 'error' | 'warning' | 'command_used'
  userId?: string
  username?: string
  message: string
  metadata?: Record<string, any>
  timestamp: Date
  severity: 'info' | 'warning' | 'error'
}

export interface ConnectedUser {
  discordId: string
  username: string
  discriminator: string
  avatar?: string
  nickname?: string
  status: 'online' | 'offline' | 'away' | 'dnd'
  joinedAt: Date
  lastActive: Date
  roles: string[]
}

export interface GameParty {
  id: string
  name: string
  game: string
  hostId: string
  hostUsername: string
  members: string[]
  maxMembers: number
  status: 'recruiting' | 'active' | 'full' | 'ended'
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
  description?: string
  requirements?: string[]
}

// MongoDB 연결을 위한 스키마 (Mongoose 사용 시)
export const UserSchema = {
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar: { type: String },
  nickname: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'away', 'dnd'], 
    default: 'offline' 
  },
  roles: [{ type: String }]
}

export const ActivityLogSchema = {
  type: { 
    type: String, 
    enum: ['login', 'logout', 'party_created', 'party_joined', 'user_joined', 'user_left', 'error', 'warning', 'command_used'],
    required: true 
  },
  userId: { type: String },
  username: { type: String },
  message: { type: String, required: true },
  metadata: { type: Object },
  timestamp: { type: Date, default: Date.now },
  severity: { 
    type: String, 
    enum: ['info', 'warning', 'error'], 
    default: 'info' 
  }
}

export const BotStatusSchema = {
  status: { 
    type: String, 
    enum: ['online', 'offline', 'maintenance'], 
    default: 'offline' 
  },
  uptime: { type: Number, default: 0 },
  lastPing: { type: Date, default: Date.now },
  version: { type: String },
  guilds: { type: Number, default: 0 },
  users: { type: Number, default: 0 },
  latency: { type: Number, default: 0 }
}