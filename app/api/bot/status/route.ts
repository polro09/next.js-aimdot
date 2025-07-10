// app/api/bot/status/route.ts - 봇 상태 확인 API
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

// 봇 상태 타입 정의
interface BotStatus {
  status: 'online' | 'offline' | 'maintenance'
  uptime: number
  guilds: number
  users: number
  latency: number
  lastPing: Date
  version: string
  connectedAt: Date | null
}

// 글로벌 봇 상태 저장소 (실제로는 Redis나 DB 사용 권장)
let botStatusCache: BotStatus = {
  status: 'offline',
  uptime: 0,
  guilds: 0,
  users: 0,
  latency: 0,
  lastPing: new Date(),
  version: '1.0.0',
  connectedAt: null
}

export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (옵션)
    const session = await getServerSession(authOptions)
    
    // 봇 상태 반환
    const currentTime = new Date()
    const timeSinceLastPing = currentTime.getTime() - botStatusCache.lastPing.getTime()
    
    // 마지막 핑으로부터 30초 이상 지났으면 오프라인으로 간주
    const isOnline = timeSinceLastPing < 30000 && botStatusCache.status === 'online'
    
    const response = {
      status: isOnline ? 'online' : 'offline',
      uptime: isOnline ? botStatusCache.uptime : 0,
      guilds: botStatusCache.guilds,
      users: botStatusCache.users,
      latency: botStatusCache.latency,
      lastPing: botStatusCache.lastPing,
      version: botStatusCache.version,
      connectedAt: botStatusCache.connectedAt,
      timeSinceLastPing: Math.floor(timeSinceLastPing / 1000), // 초 단위
      currentUser: session?.user || null
    }

    logger.system.debug('봇 상태 조회', {
      status: response.status,
      timeSinceLastPing: response.timeSinceLastPing,
      uptime: response.uptime,
      requestedBy: session?.user?.email || 'anonymous'
    })

    return NextResponse.json(response)

  } catch (error) {
    logger.system.error('봇 상태 API 에러', error as Error)
    
    return NextResponse.json(
      { 
        error: '봇 상태를 확인할 수 없습니다',
        status: 'offline',
        uptime: 0,
        guilds: 0,
        users: 0,
        latency: 0,
        lastPing: new Date(),
        version: '1.0.0',
        connectedAt: null,
        timeSinceLastPing: 0
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 봇에서 상태 업데이트를 위한 엔드포인트
    const authHeader = request.headers.get('authorization')
    
    // 간단한 인증 (실제로는 더 강력한 인증 필요)
    if (authHeader !== `Bearer ${process.env.BOT_API_SECRET}`) {
      logger.system.warn('봇 상태 업데이트 인증 실패', {
        authHeader: authHeader ? 'present' : 'missing'
      })
      
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 입력 검증
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: '유효하지 않은 요청 데이터' },
        { status: 400 }
      )
    }
    
    // 봇 상태 업데이트
    const previousStatus = botStatusCache.status
    
    botStatusCache = {
      status: body.status || 'online',
      uptime: body.uptime || 0,
      guilds: body.guilds || 0,
      users: body.users || 0,
      latency: body.latency || 0,
      lastPing: new Date(),
      version: body.version || '1.0.0',
      connectedAt: botStatusCache.connectedAt || new Date()
    }
    
    // 상태 변경 로깅
    if (previousStatus !== botStatusCache.status) {
      logger.bot.event('봇 상태 변경', {
        previousStatus,
        newStatus: botStatusCache.status
      })
    }

    logger.bot.startup('봇 상태 업데이트됨', {
      status: botStatusCache.status,
      guilds: botStatusCache.guilds,
      users: botStatusCache.users,
      latency: botStatusCache.latency,
      uptime: botStatusCache.uptime
    })

    return NextResponse.json({ 
      success: true, 
      message: '봇 상태가 업데이트되었습니다',
      timestamp: new Date().toISOString(),
      status: botStatusCache.status
    })

  } catch (error) {
    logger.system.error('봇 상태 업데이트 에러', error as Error)
    
    return NextResponse.json(
      { error: '봇 상태 업데이트에 실패했습니다' },
      { status: 500 }
    )
  }
}

// 봇 상태 초기화 (서버 재시작 시)
export async function DELETE(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      )
    }
    
    // 봇 상태 초기화
    botStatusCache = {
      status: 'offline',
      uptime: 0,
      guilds: 0,
      users: 0,
      latency: 0,
      lastPing: new Date(),
      version: '1.0.0',
      connectedAt: null
    }
    
    logger.system.info('봇 상태 초기화됨', {
      resetBy: session.user.email
    })
    
    return NextResponse.json({
      success: true,
      message: '봇 상태가 초기화되었습니다',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    logger.system.error('봇 상태 초기화 에러', error as Error)
    
    return NextResponse.json(
      { error: '봇 상태 초기화에 실패했습니다' },
      { status: 500 }
    )
  }
}