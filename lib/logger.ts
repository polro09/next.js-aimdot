// lib/logger.ts - 수정된 로거 시스템 (TypeScript 에러 해결)
import fs from 'fs'
import path from 'path'

// 로그 레벨 정의
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
} as const

export type LogLevelType = typeof LogLevel[keyof typeof LogLevel]

// 로그 카테고리 정의
export const LogCategory = {
  // 시스템 관련
  SYSTEM: 'SYSTEM',
  DATABASE: 'DATABASE',
  API: 'API',
  
  // Discord 관련
  DISCORD: 'DISCORD',
  BOT: 'BOT',
  GUILD: 'GUILD',
  USER: 'USER',
  
  // 기능 관련
  COMMAND: 'COMMAND',
  EVENT: 'EVENT',
  PARTY: 'PARTY',
  SCHEDULE: 'SCHEDULE',
  
  // 보안 관련
  AUTH: 'AUTH',
  PERMISSION: 'PERMISSION',
  SECURITY: 'SECURITY',
  
  // 기타
  WEBHOOK: 'WEBHOOK',
  CACHE: 'CACHE',
  PERFORMANCE: 'PERFORMANCE',
} as const

export type LogCategoryType = typeof LogCategory[keyof typeof LogCategory]

interface LogEntry {
  timestamp: Date
  level: LogLevelType
  category: LogCategoryType
  message: string
  data?: any
  userId?: string
  guildId?: string
  channelId?: string
  commandName?: string
  error?: Error
}

class SimpleLogger {
  private logLevel: LogLevelType
  private logToFile: boolean
  private logDirectory: string

  constructor(options: {
    logLevel?: LogLevelType
    logToFile?: boolean
    logDirectory?: string
  } = {}) {
    this.logLevel = options.logLevel ?? LogLevel.INFO
    this.logToFile = options.logToFile ?? true
    this.logDirectory = options.logDirectory ?? path.join(process.cwd(), 'logs')

    // 로그 디렉토리 생성
    if (this.logToFile && !fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true })
    }
  }

  // 이모지와 색상 매핑
  private getLogEmoji(level: LogLevelType): string {
    switch (level) {
      case LogLevel.DEBUG: return '🔍'
      case LogLevel.INFO: return 'ℹ️'
      case LogLevel.WARN: return '⚠️'
      case LogLevel.ERROR: return '❌'
      case LogLevel.FATAL: return '💀'
      default: return '📝'
    }
  }

  private getCategoryEmoji(category: LogCategoryType): string {
    const emojiMap: Record<LogCategoryType, string> = {
      [LogCategory.SYSTEM]: '🖥️',
      [LogCategory.DATABASE]: '🗄️',
      [LogCategory.API]: '🌐',
      [LogCategory.DISCORD]: '🤖',
      [LogCategory.BOT]: '⚡',
      [LogCategory.GUILD]: '🏰',
      [LogCategory.USER]: '👤',
      [LogCategory.COMMAND]: '⚙️',
      [LogCategory.EVENT]: '📡',
      [LogCategory.PARTY]: '🎮',
      [LogCategory.SCHEDULE]: '📅',
      [LogCategory.AUTH]: '🔐',
      [LogCategory.PERMISSION]: '🛡️',
      [LogCategory.SECURITY]: '🔒',
      [LogCategory.WEBHOOK]: '🪝',
      [LogCategory.CACHE]: '💾',
      [LogCategory.PERFORMANCE]: '⚡',
    }
    return emojiMap[category] || '📋'
  }

  private getColorCode(level: LogLevelType): string {
    switch (level) {
      case LogLevel.DEBUG: return '\x1b[90m'  // 회색
      case LogLevel.INFO: return '\x1b[34m'   // 파란색
      case LogLevel.WARN: return '\x1b[33m'   // 노란색
      case LogLevel.ERROR: return '\x1b[31m'  // 빨간색
      case LogLevel.FATAL: return '\x1b[35m'  // 자주색
      default: return '\x1b[37m'              // 흰색
    }
  }

  private formatTimestamp(): string {
    const now = new Date()
    return now.toISOString().replace('T', ' ').substring(0, 19)
  }

  private getLevelName(level: LogLevelType): string {
    const levelNames = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.FATAL]: 'FATAL',
    }
    return levelNames[level] || 'UNKNOWN'
  }

  private formatLogMessage(entry: LogEntry): string {
    const timestamp = this.formatTimestamp()
    const levelEmoji = this.getLogEmoji(entry.level)
    const categoryEmoji = this.getCategoryEmoji(entry.category)
    const levelName = this.getLevelName(entry.level).padEnd(5)
    const categoryName = entry.category.padEnd(12)
    
    let baseMessage = `[${timestamp}] ${levelEmoji} ${levelName} ${categoryEmoji} ${categoryName} | ${entry.message}`
    
    // 추가 컨텍스트 정보
    const context: string[] = []
    if (entry.userId) context.push(`User:${entry.userId}`)
    if (entry.guildId) context.push(`Guild:${entry.guildId}`)
    if (entry.channelId) context.push(`Channel:${entry.channelId}`)
    if (entry.commandName) context.push(`Cmd:${entry.commandName}`)
    
    if (context.length > 0) {
      baseMessage += ` [${context.join(', ')}]`
    }
    
    return baseMessage
  }

  private writeToFile(entry: LogEntry): void {
    if (!this.logToFile) return

    try {
      const logFileName = `bot-${new Date().toISOString().split('T')[0]}.log`
      const logFilePath = path.join(this.logDirectory, logFileName)
      
      let logMessage = this.formatLogMessage(entry)
      let fileContent = `${logMessage}\n`
      
      // 데이터가 있으면 JSON으로 추가
      if (entry.data) {
        const dataJson = JSON.stringify(entry.data, null, 2)
        fileContent += `Data: ${dataJson}\n`
      }
      
      // 에러가 있으면 스택 트레이스 추가
      if (entry.error) {
        fileContent += `Error: ${entry.error.stack}\n`
      }
      
      fs.appendFileSync(logFilePath, fileContent)
    } catch (error) {
      console.error('로그 파일 쓰기 실패:', error)
    }
  }

  private log(level: LogLevelType, category: LogCategoryType, message: string, options: {
    data?: any
    userId?: string
    guildId?: string
    channelId?: string
    commandName?: string
    error?: Error
  } = {}): void {
    if (level < this.logLevel) return

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      ...options
    }

    // 콘솔 출력 (색상 포함)
    const colorCode = this.getColorCode(level)
    const resetCode = '\x1b[0m'
    const formattedMessage = this.formatLogMessage(entry)
    console.log(`${colorCode}${formattedMessage}${resetCode}`)

    // 데이터 출력
    if (entry.data) {
      console.log('\x1b[36m📊 Data:\x1b[0m', entry.data)
    }

    // 에러 출력
    if (entry.error) {
      console.error('\x1b[31m💥 Error Stack:\x1b[0m', entry.error.stack)
    }

    // 파일에 기록
    this.writeToFile(entry)
  }

  // 간단한 로그 메서드들
  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, LogCategory.SYSTEM, message, { data })
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.SYSTEM, message, { data })
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, LogCategory.SYSTEM, message, { data })
  }

  error(message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, LogCategory.SYSTEM, message, { error, data })
  }

  // 시스템 로그
  systemDebug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, LogCategory.SYSTEM, message, { data })
  }

  systemInfo(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.SYSTEM, message, { data })
  }

  systemWarn(message: string, data?: any) {
    this.log(LogLevel.WARN, LogCategory.SYSTEM, message, { data })
  }

  systemError(message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, LogCategory.SYSTEM, message, { error, data })
  }

  // Discord 관련 로그
  discordReady(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.DISCORD, message, { data })
  }

  discordConnect(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.DISCORD, message, { data })
  }

  discordDisconnect(message: string, error?: Error) {
    this.log(LogLevel.WARN, LogCategory.DISCORD, message, { error })
  }

  discordError(message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, LogCategory.DISCORD, message, { error, data })
  }

  // 봇 기능 로그
  botStartup(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.BOT, message, { data })
  }

  botShutdown(message: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.BOT, message, { data })
  }

  botError(message: string, error?: Error, data?: any) {
    this.log(LogLevel.ERROR, LogCategory.BOT, message, { error, data })
  }

  // 명령어 로그
  commandExecuted(commandName: string, userId: string, guildId?: string, channelId?: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.COMMAND, `명령어 실행: /${commandName}`, { 
      commandName, userId, guildId, channelId, data 
    })
  }

  commandFailed(commandName: string, userId: string, error: Error, guildId?: string, channelId?: string) {
    this.log(LogLevel.ERROR, LogCategory.COMMAND, `명령어 실행 실패: /${commandName}`, { 
      commandName, userId, guildId, channelId, error 
    })
  }

  commandCooldown(commandName: string, userId: string, remainingTime: number) {
    this.log(LogLevel.WARN, LogCategory.COMMAND, `명령어 쿨다운: /${commandName} (${remainingTime}초 남음)`, { 
      commandName, userId, data: { remainingTime }
    })
  }

  // 사용자 관련 로그
  userJoin(userId: string, guildId: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.USER, '사용자 서버 참가', { userId, guildId, data })
  }

  userLeave(userId: string, guildId: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.USER, '사용자 서버 퇴장', { userId, guildId, data })
  }

  userBan(userId: string, guildId: string, reason?: string, moderatorId?: string) {
    this.log(LogLevel.WARN, LogCategory.USER, `사용자 차단: ${reason}`, { 
      userId, guildId, data: { reason, moderatorId }
    })
  }

  userKick(userId: string, guildId: string, reason?: string, moderatorId?: string) {
    this.log(LogLevel.WARN, LogCategory.USER, `사용자 추방: ${reason}`, { 
      userId, guildId, data: { reason, moderatorId }
    })
  }

  // 파티 관련 로그
  partyCreated(partyId: string, creatorId: string, guildId: string, data?: any) {
    this.log(LogLevel.INFO, LogCategory.PARTY, `파티 생성됨 ID:${partyId}`, { 
      userId: creatorId, guildId, data: { partyId, ...data }
    })
  }

  partyJoined(partyId: string, userId: string, guildId: string) {
    this.log(LogLevel.INFO, LogCategory.PARTY, `파티 참가 ID:${partyId}`, { 
      userId, guildId, data: { partyId }
    })
  }

  partyLeft(partyId: string, userId: string, guildId: string) {
    this.log(LogLevel.INFO, LogCategory.PARTY, `파티 탈퇴 ID:${partyId}`, { 
      userId, guildId, data: { partyId }
    })
  }

  partyDeleted(partyId: string, guildId: string, reason?: string) {
    this.log(LogLevel.INFO, LogCategory.PARTY, `파티 삭제됨 ID:${partyId}`, { 
      guildId, data: { partyId, reason }
    })
  }

  // 권한 관련 로그
  permissionDenied(userId: string, action: string, guildId?: string, channelId?: string) {
    this.log(LogLevel.WARN, LogCategory.PERMISSION, `권한 거부: ${action}`, { 
      userId, guildId, channelId, data: { action }
    })
  }

  permissionGranted(userId: string, permission: string, grantedBy: string, guildId?: string) {
    this.log(LogLevel.INFO, LogCategory.PERMISSION, `권한 부여: ${permission}`, { 
      userId, guildId, data: { permission, grantedBy }
    })
  }

  permissionRevoked(userId: string, permission: string, revokedBy: string, guildId?: string) {
    this.log(LogLevel.INFO, LogCategory.PERMISSION, `권한 취소: ${permission}`, { 
      userId, guildId, data: { permission, revokedBy }
    })
  }

  // 성능 관련 로그
  performanceSlow(operation: string, duration: number, threshold: number, data?: any) {
    this.log(LogLevel.WARN, LogCategory.PERFORMANCE, `느린 작업 감지: ${operation} (${duration}ms > ${threshold}ms)`, { 
      data: { operation, duration, threshold, ...data }
    })
  }

  performanceMemory(usage: NodeJS.MemoryUsage) {
    this.log(LogLevel.DEBUG, LogCategory.PERFORMANCE, '메모리 사용량', { data: usage })
  }

  // 보안 관련 로그
  securitySuspicious(userId: string, activity: string, guildId?: string, data?: any) {
    this.log(LogLevel.WARN, LogCategory.SECURITY, `의심스러운 활동: ${activity}`, { 
      userId, guildId, data: { activity, ...data }
    })
  }

  securityRateLimit(userId: string, action: string, attempts: number) {
    this.log(LogLevel.WARN, LogCategory.SECURITY, `레이트 리밋 감지: ${action} (${attempts}회 시도)`, { 
      userId, data: { action, attempts }
    })
  }
}

// 전역 로거 인스턴스
export const logger = new SimpleLogger({
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  logToFile: true,
  logDirectory: path.join(process.cwd(), 'logs'),
})

// 편의 함수들 (하위 호환성)
export const debug = (message: string, data?: any) => logger.debug(message, data)
export const info = (message: string, data?: any) => logger.info(message, data)
export const warn = (message: string, data?: any) => logger.warn(message, data)
export const error = (message: string, err?: Error, data?: any) => logger.error(message, err, data)