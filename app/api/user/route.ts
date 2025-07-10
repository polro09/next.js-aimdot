// app/api/user/route.ts - 사용자 정보 관리 API

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// 사용자 정보 조회
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: 데이터베이스에서 사용자 정보 조회
    const userData = {
      discordId: session.user.discordId,
      username: session.user.username,
      discriminator: session.user.discriminator,
      avatar: session.user.avatar,
      nickname: session.user.nickname || session.user.username,
      status: 'online',
      roles: ['user'], // TODO: 실제 역할 정보
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ 
      success: true, 
      user: userData 
    })

  } catch (error) {
    console.error('❌ 사용자 정보 조회 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 사용자 정보 업데이트 (닉네임 변경)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nickname } = body

    // 닉네임 유효성 검사
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { error: '닉네임은 2-20자 사이여야 합니다.' }, 
        { status: 400 }
      )
    }

    // TODO: 데이터베이스에 닉네임 업데이트
    console.log(`✏️ 닉네임 변경: ${session.user.username} → ${nickname}`)
    
    // TODO: 활동 로그 기록
    await logActivity({
      type: 'user_updated',
      userId: session.user.discordId,
      username: session.user.username,
      message: `닉네임을 "${nickname}"으로 변경했습니다`,
      metadata: { 
        oldNickname: session.user.nickname || session.user.username,
        newNickname: nickname 
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: '닉네임이 변경되었습니다.',
      nickname 
    })

  } catch (error) {
    console.error('❌ 닉네임 변경 실패:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}

// 활동 로그 기록 헬퍼 함수
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
    
    // Redis나 WebSocket을 통해 실시간 업데이트 알림
    // TODO: 실시간 알림 구현
    
  } catch (error) {
    console.error('❌ 활동 로그 기록 실패:', error)
  }
}