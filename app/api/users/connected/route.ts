// app/api/users/connected/route.ts - 접속 사용자 관리 API

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// 접속 사용자 목록 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 접속 사용자 목록 가져오기
    const connectedUsers = await getConnectedUsers()
    
    return NextResponse.json({ 
      success: true, 
      users: connectedUsers,
      count: connectedUsers.length
    })

  } catch (error) {
    console.error('❌ 접속 사용자 조회 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 사용자 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body // 'online', 'away', 'dnd', 'offline'

    // 유효한 상태 값 확인
    const validStatuses = ['online', 'away', 'dnd', 'offline']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태값입니다.' }, 
        { status: 400 }
      )
    }

    // 사용자 상태 업데이트
    await updateUserStatus(session.user.discordId, status)
    
    // 활동 로그 기록
    await logActivity({
      type: 'status_changed',
      userId: session.user.discordId,
      username: session.user.username,
      message: `상태를 ${getStatusText(status)}(으)로 변경했습니다`,
      metadata: { newStatus: status }
    })

    return NextResponse.json({ 
      success: true, 
      message: '상태가 변경되었습니다.',
      status 
    })

  } catch (error) {
    console.error('❌ 상태 변경 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 접속 사용자 목록 가져오기
async function getConnectedUsers() {
  try {
    // TODO: 실제 Discord Guild에서 온라인 사용자 가져오기
    // 임시 데이터
    const users = [
      {
        discordId: '123456789012345678',
        username: '관리자',
        discriminator: '0001',
        avatar: null,
        nickname: '관리자',
        status: 'online',
        joinedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        lastActive: new Date().toISOString(),
        roles: ['admin', 'moderator']
      },
      {
        discordId: '987654321098765432',
        username: '게임유저1',
        discriminator: '1234',
        avatar: null,
        nickname: '게임유저1',
        status: 'online',
        joinedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15분 전
        lastActive: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2분 전
        roles: ['user']
      },
      {
        discordId: '456789123456789123',
        username: '게임유저2',
        discriminator: '5678',
        avatar: null,
        nickname: '게임유저2',
        status: 'away',
        joinedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45분 전
        lastActive: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10분 전
        roles: ['user']
      },
      {
        discordId: '789123456789123456',
        username: '게임유저3',
        discriminator: '9012',
        avatar: null,
        nickname: '게임유저3',
        status: 'dnd',
        joinedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1시간 전
        lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
        roles: ['user', 'vip']
      },
      {
        discordId: '321654987321654987',
        username: '게임유저4',
        discriminator: '3456',
        avatar: null,
        nickname: '게임유저4',
        status: 'offline',
        joinedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2시간 전
        lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        roles: ['user']
      }
    ]

    return users

  } catch (error) {
    console.error('❌ 접속 사용자 조회 실패:', error)
    return []
  }
}

// 사용자 상태 업데이트
async function updateUserStatus(discordId: string, status: string) {
  try {
    // TODO: 데이터베이스에 사용자 상태 업데이트
    console.log(`👤 사용자 상태 변경: ${discordId} → ${status}`)
    
    // TODO: Redis나 WebSocket을 통해 실시간 업데이트
    // await redis.hset(`user:${discordId}`, 'status', status)
    // await broadcastUserStatusUpdate(discordId, status)
    
  } catch (error) {
    console.error('❌ 사용자 상태 업데이트 실패:', error)
    throw error
  }
}

// 상태 텍스트 변환
function getStatusText(status: string): string {
  switch (status) {
    case 'online': return '온라인'
    case 'away': return '자리비움'
    case 'dnd': return '방해금지'
    case 'offline': return '오프라인'
    default: return '알 수 없음'
  }
}

// 활동 로그 기록 함수
async function logActivity(activity: {
  type: string
  userId?: string
  username?: string
  message: string
  metadata?: Record<string, any>
}) {
  try {
    // TODO: 데이터베이스에 활동 로그 저장
    console.log('📝 활동 로그:', activity)
    
  } catch (error) {
    console.error('❌ 활동 로그 기록 실패:', error)
  }
}