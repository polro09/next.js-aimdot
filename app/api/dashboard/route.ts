// app/api/dashboard/route.ts - 수정된 통합 대시보드 API (TypeScript 에러 해결)
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'
import type { 
  DashboardApiResponse, 
  SessionUser, 
  BotStatus, 
  ConnectedUser, 
  ActivityLog,
  ApiErrorResponse
} from '@/types/api'

// 봇 상태를 확인하는 함수 (Discord API 또는 봇 상태 체크)
async function getBotStatus(): Promise<BotStatus> {
  try {
    // 실제로는 Discord API나 봇 헬스체크 엔드포인트를 호출
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/bot/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 타임아웃 설정
      signal: AbortSignal.timeout(5000)
    }).catch(() => null)

    if (response?.ok) {
      const data = await response.json()
      return {
        status: data.status || 'offline',
        uptime: data.uptime || 0,
        guilds: data.guilds || 0,
        users: data.users || 0,
        latency: data.latency || 0,
        lastPing: new Date(data.lastPing || Date.now()),
        version: data.version || 'v1.0.0'
      }
    } else {
      // 봇이 응답하지 않으면 오프라인 상태
      return {
        status: 'offline' as const,
        uptime: 0,
        guilds: 0,
        users: 0,
        latency: 0,
        lastPing: new Date(),
        version: 'v1.0.0'
      }
    }
  } catch (error) {
    logger.systemError('봇 상태 조회 실패', error as Error)
    return {
      status: 'offline' as const,
      uptime: 0,
      guilds: 0,
      users: 0,
      latency: 0,
      lastPing: new Date(),
      version: 'v1.0.0'
    }
  }
}

// 접속 중인 사용자 목록 가져오기
async function getConnectedUsers(): Promise<ConnectedUser[]> {
  try {
    // 최근 활동한 사용자들 (예: 지난 1시간 내)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    const users = await prisma.user.findMany({
      where: {
        lastActive: {
          gte: oneHourAgo
        }
      },
      select: {
        discordId: true,
        username: true,
        discriminator: true,
        avatar: true,
        nickname: true,
        lastActive: true,
      },
      orderBy: {
        lastActive: 'desc'
      },
      take: 20 // 최대 20명
    })

    // Prisma 결과를 ConnectedUser 타입으로 변환
    const connectedUsers: ConnectedUser[] = users.map(user => ({
      discordId: user.discordId,
      username: user.username || 'Unknown',
      discriminator: user.discriminator || '0000',
      avatar: user.avatar || undefined,
      nickname: user.nickname || undefined,
      status: 'online' as const, // 실제로는 Discord API에서 실시간 상태 조회
      lastActive: user.lastActive || new Date(),
      roles: [] // 필요시 Discord API에서 조회
    }))

    return connectedUsers
  } catch (error) {
    logger.systemError('접속 사용자 조회 실패', error as Error)
    return []
  }
}

// 최근 활동 로그 가져오기
async function getRecentLogs(): Promise<ActivityLog[]> {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: {
        timestamp: 'desc'
      },
      take: 50, // 최근 50개
      select: {
        id: true,
        type: true,
        message: true,
        username: true,
        timestamp: true,
        severity: true,
        metadata: true
      }
    })

    // Prisma 결과를 ActivityLog 타입으로 변환
    const activityLogs: ActivityLog[] = logs.map(log => ({
      id: log.id,
      type: log.type as ActivityLog['type'],
      message: log.message,
      username: log.username || undefined,
      timestamp: log.timestamp,
      severity: log.severity as ActivityLog['severity'],
      metadata: log.metadata as Record<string, any> || undefined
    }))

    return activityLogs
  } catch (error) {
    logger.systemError('활동 로그 조회 실패', error as Error)
    return []
  }
}

// NextAuth 세션에서 안전하게 사용자 정보 추출
function extractSessionUser(session: any): SessionUser {
  const user = session.user
  
  return {
    discordId: user.discordId || user.id || '',
    username: user.username || user.name || 'Unknown',
    discriminator: user.discriminator || '0000',
    avatar: user.avatar || undefined,
    nickname: user.nickname || undefined,
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    status: 'online' as const // 로그인한 사용자는 온라인
  }
}

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      const errorResponse: ApiErrorResponse = {
        error: '인증이 필요합니다',
        code: 'UNAUTHORIZED'
      }
      return NextResponse.json(errorResponse, { status: 401 })
    }

    // 안전하게 사용자 정보 추출
    const sessionUser = extractSessionUser(session)

    logger.systemInfo('대시보드 데이터 요청', {
      userId: sessionUser.discordId,
      userAgent: request.headers.get('user-agent')
    })

    // 병렬로 모든 데이터 가져오기
    const [botStatus, connectedUsers, recentLogs] = await Promise.all([
      getBotStatus(),
      getConnectedUsers(),
      getRecentLogs()
    ])

    // 응답 데이터 구성
    const dashboardData: DashboardApiResponse = {
      user: sessionUser,
      bot: botStatus,
      connectedUsers,
      recentLogs,
      stats: {
        totalOnline: connectedUsers.filter(u => u.status === 'online').length,
        totalUsers: connectedUsers.length,
        totalActivities: recentLogs.length,
        botUptime: botStatus.uptime
      },
      timestamp: new Date().toISOString()
    }

    logger.systemInfo('대시보드 데이터 응답', {
      userId: sessionUser.discordId,
      botStatus: botStatus.status,
      connectedUsers: connectedUsers.length,
      recentLogs: recentLogs.length
    })

    return NextResponse.json(dashboardData)

  } catch (error) {
    logger.systemError('대시보드 API 에러', error as Error)
    
    const errorResponse: ApiErrorResponse = {
      error: '서버 오류가 발생했습니다',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      code: 'INTERNAL_SERVER_ERROR'
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}