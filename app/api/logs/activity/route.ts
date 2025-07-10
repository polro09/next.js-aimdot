// app/api/logs/activity/route.ts - 활동 로그 관리 API

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// 활동 로그 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type') // 필터링용
    const severity = searchParams.get('severity') // 필터링용

    // 활동 로그 가져오기
    const logs = await getActivityLogs({ limit, offset, type, severity })
    
    return NextResponse.json({ 
      success: true, 
      logs,
      pagination: {
        limit,
        offset,
        total: logs.length // TODO: 실제 총 개수
      }
    })

  } catch (error) {
    console.error('❌ 활동 로그 조회 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 새 활동 로그 생성
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, message, metadata, severity = 'info' } = body

    // 필수 필드 검증
    if (!type || !message) {
      return NextResponse.json(
        { error: 'type과 message는 필수 필드입니다.' }, 
        { status: 400 }
      )
    }

    // 활동 로그 생성
    const logEntry = await createActivityLog({
      type,
      userId: session.user.discordId,
      username: session.user.username,
      message,
      metadata,
      severity
    })

    return NextResponse.json({ 
      success: true, 
      message: '활동 로그가 기록되었습니다.',
      log: logEntry
    })

  } catch (error) {
    console.error('❌ 활동 로그 생성 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 활동 로그 삭제 (관리자만)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 관리자 권한 확인
    const isAdmin = await checkAdminPermission(session.user.discordId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const logId = searchParams.get('id')
    const days = parseInt(searchParams.get('days') || '0')

    if (logId) {
      // 특정 로그 삭제
      await deleteActivityLog(logId)
      return NextResponse.json({ 
        success: true, 
        message: '로그가 삭제되었습니다.' 
      })
    } else if (days > 0) {
      // 지정된 날짜 이전 로그 삭제
      const deletedCount = await deleteOldLogs(days)
      return NextResponse.json({ 
        success: true, 
        message: `${deletedCount}개의 로그가 삭제되었습니다.` 
      })
    } else {
      return NextResponse.json(
        { error: '삭제할 로그 ID 또는 날짜를 지정해주세요.' }, 
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ 활동 로그 삭제 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 활동 로그 가져오기
async function getActivityLogs(options: {
  limit: number
  offset: number
  type?: string | null
  severity?: string | null
}) {
  try {
    // TODO: 실제 데이터베이스에서 로그 조회
    // 임시 데이터
    const allLogs = [
      {
        id: '1',
        type: 'login',
        userId: '123456789012345678',
        username: '관리자',
        message: '관리자님이 로그인했습니다',
        metadata: { ip: '127.0.0.1', userAgent: 'Chrome' },
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
        severity: 'info'
      },
      {
        id: '2',
        type: 'party_created',
        userId: '987654321098765432',
        username: '게임유저1',
        message: '새로운 파티가 생성되었습니다: "발로란트 랭크게임"',
        metadata: { 
          partyId: 'party_123',
          game: 'Valorant',
          maxMembers: 5
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15분 전
        severity: 'info'
      },
      {
        id: '3',
        type: 'user_joined',
        userId: '456789123456789123',
        username: '게임유저2',
        message: '게임유저2님이 서버에 참가했습니다',
        metadata: { 
          guildId: 'guild_123',
          inviteCode: 'abc123'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        severity: 'info'
      },
      {
        id: '4',
        type: 'warning',
        userId: null,
        username: 'System',
        message: '디스코드 API 응답 지연 감지',
        metadata: { 
          latency: 1500,
          endpoint: '/api/guilds'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45분 전
        severity: 'warning'
      },
      {
        id: '5',
        type: 'command_used',
        userId: '789123456789123456',
        username: '게임유저3',
        message: '/파티생성 명령어를 사용했습니다',
        metadata: { 
          command: 'party_create',
          args: ['발로란트', '5']
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1시간 전
        severity: 'info'
      },
      {
        id: '6',
        type: 'error',
        userId: null,
        username: 'System',
        message: '데이터베이스 연결 실패',
        metadata: { 
          error: 'Connection timeout',
          database: 'primary'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5시간 전
        severity: 'error'
      }
    ]

    // 필터링 적용
    let filteredLogs = allLogs
    
    if (options.type) {
      filteredLogs = filteredLogs.filter(log => log.type === options.type)
    }
    
    if (options.severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === options.severity)
    }

    // 페이지네이션 적용
    const paginatedLogs = filteredLogs
      .slice(options.offset, options.offset + options.limit)

    return paginatedLogs

  } catch (error) {
    console.error('❌ 활동 로그 조회 실패:', error)
    return []
  }
}

// 활동 로그 생성
async function createActivityLog(logData: {
  type: string
  userId?: string
  username?: string
  message: string
  metadata?: Record<string, any>
  severity: string
}) {
  try {
    const logEntry = {
      id: Date.now().toString(), // TODO: 실제 ID 생성
      ...logData,
      timestamp: new Date().toISOString()
    }

    // TODO: 데이터베이스에 저장
    console.log('📝 새 활동 로그 생성:', logEntry)

    // TODO: 실시간 업데이트 브로드캐스트
    // await broadcastNewLog(logEntry)

    return logEntry

  } catch (error) {
    console.error('❌ 활동 로그 생성 실패:', error)
    throw error
  }
}

// 활동 로그 삭제
async function deleteActivityLog(logId: string) {
  try {
    // TODO: 데이터베이스에서 로그 삭제
    console.log(`🗑️ 활동 로그 삭제: ${logId}`)
    
  } catch (error) {
    console.error('❌ 활동 로그 삭제 실패:', error)
    throw error
  }
}

// 오래된 로그 삭제
async function deleteOldLogs(days: number): Promise<number> {
  try {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    // TODO: 지정된 날짜 이전 로그들 삭제
    console.log(`🗑️ ${days}일 이전 로그 삭제: ${cutoffDate.toISOString()}`)
    
    return 0 // TODO: 실제 삭제된 로그 수 반환

  } catch (error) {
    console.error('❌ 오래된 로그 삭제 실패:', error)
    throw error
  }
}

// 관리자 권한 확인
async function checkAdminPermission(discordId: string): Promise<boolean> {
  try {
    // TODO: 실제 권한 확인 로직
    const adminIds = ['123456789012345678'] // 임시 관리자 ID
    return adminIds.includes(discordId)

  } catch (error) {
    console.error('❌ 권한 확인 실패:', error)
    return false
  }
}