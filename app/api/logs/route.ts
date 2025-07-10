// app/api/logs/route.ts - 활동 로그 관리 API
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/db'

// 활동 로그 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const severity = searchParams.get('severity')

    // 필터 조건 구성
    const where: any = {}
    if (type) where.type = type
    if (severity) where.severity = severity

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: {
        timestamp: 'desc'
      },
      skip: offset,
      take: Math.min(limit, 100), // 최대 100개로 제한
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

    const total = await prisma.activityLog.count({ where })

    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    logger.system.error('활동 로그 조회 실패', error as Error)
    
    return NextResponse.json(
      { error: '활동 로그를 조회할 수 없습니다' },
      { status: 500 }
    )
  }
}

// 활동 로그 생성 (POST) - 봇이나 시스템에서 호출
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    // API 키 또는 세션 인증
    const isApiAuthenticated = authHeader === `Bearer ${process.env.BOT_API_SECRET}`
    const session = await getServerSession(authOptions)
    
    if (!isApiAuthenticated && !session?.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 필수 필드 검증
    if (!body.type || !body.message) {
      return NextResponse.json(
        { error: 'type과 message는 필수 필드입니다' },
        { status: 400 }
      )
    }

    // 유효한 타입 검증
    const validTypes = [
      'login', 'logout', 'party_created', 'party_joined', 'party_left', 'party_deleted',
      'user_joined', 'user_left', 'user_banned', 'user_kicked',
      'command_used', 'error', 'warning', 'info', 'bot_started', 'bot_stopped'
    ]
    
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: '유효하지 않은 로그 타입입니다' },
        { status: 400 }
      )
    }

    // 활동 로그 생성
    const newLog = await prisma.activityLog.create({
      data: {
        type: body.type,
        message: body.message,
        userId: body.userId,
        username: body.username,
        severity: body.severity || 'info',
        metadata: body.metadata || {}
      }
    })

    logger.system.info('새 활동 로그 생성됨', {
      logId: newLog.id,
      type: newLog.type,
      userId: newLog.userId,
      username: newLog.username
    })

    return NextResponse.json({
      success: true,
      log: newLog
    })

  } catch (error) {
    logger.system.error('활동 로그 생성 실패', error as Error)
    
    return NextResponse.json(
      { error: '활동 로그를 생성할 수 없습니다' },
      { status: 500 }
    )
  }
}

// 활동 로그 일괄 삭제 (DELETE) - 관리자 전용
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    // 관리자 권한 확인 (실제로는 사용자 역할 확인 필요)
    // if (!session.user.roles?.includes('admin')) {
    //   return NextResponse.json(
    //     { error: '관리자 권한이 필요합니다' },
    //     { status: 403 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan') // ISO 날짜 문자열
    const type = searchParams.get('type')

    const where: any = {}
    
    if (olderThan) {
      where.timestamp = {
        lt: new Date(olderThan)
      }
    }
    
    if (type) {
      where.type = type
    }

    const deletedCount = await prisma.activityLog.deleteMany({
      where
    })

    logger.system.info('활동 로그 일괄 삭제됨', {
      deletedCount: deletedCount.count,
      olderThan,
      type,
      adminId: session.user.discordId
    })

    return NextResponse.json({
      success: true,
      deletedCount: deletedCount.count
    })

  } catch (error) {
    logger.system.error('활동 로그 삭제 실패', error as Error)
    
    return NextResponse.json(
      { error: '활동 로그를 삭제할 수 없습니다' },
      { status: 500 }
    )
  }
}