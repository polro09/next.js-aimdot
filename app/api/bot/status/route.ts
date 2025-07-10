// app/api/bot/status/route.ts - 봇 상태 확인 API
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

// 글로벌 봇 상태 저장소 (실제로는 Redis나 DB 사용 권장)
let botStatusCache = {
  status: 'offline' as 'online' | 'offline' | 'maintenance',
  uptime: 0,
  guilds: 0,
  users: 0,
  latency: 0,
  lastPing: new Date(),
  version: '1.0.0',
  connectedAt: null as Date | null
}

export async function GET(request: NextRequest) {
  try {
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
      timeSinceLastPing: Math.floor(timeSinceLastPing / 1000) // 초 단위
    }

    logger.system.debug('봇 상태 조회', {
      status: response.status,
      timeSinceLastPing: response.timeSinceLastPing,
      uptime: response.uptime
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
        version: '1.0.0'
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
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 봇 상태 업데이트
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
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.system.error('봇 상태 업데이트 에러', error as Error)
    
    return NextResponse.json(
      { error: '봇 상태 업데이트에 실패했습니다' },
      { status: 500 }
    )
  }
}