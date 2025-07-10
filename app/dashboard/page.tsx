// app/dashboard/page.tsx - 대시보드 메인 페이지
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BotIcon, 
  UserIcon, 
  CalendarIcon, 
  ActivityIcon,
  TrendingUpIcon,
  PlayIcon,
  GamepadIcon,
  SettingsIcon
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">대시보드 로딩 중...</p>
        </div>
      </div>
    )
  }

  // 세션이 없으면 빈 화면 (리다이렉트 대기)
  if (!session) {
    return null
  }

  return (
    <div className="space-y-8 p-8">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          안녕하세요, {session.user?.name || session.user?.email}님! 오늘의 활동을 확인해보세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 파티</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 지난 주 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">온라인 사용자</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12% 어제 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예정된 이벤트</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +3 이번 달
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">서버 활동</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 어제부터
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 대시보드 섹션 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* 최근 활동 */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              서버에서 일어난 최근 활동들을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">새로운 파티가 생성되었습니다</p>
                <p className="text-xs text-muted-foreground">5분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">사용자가 서버에 참가했습니다</p>
                <p className="text-xs text-muted-foreground">12분 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">예정된 이벤트 알림</p>
                <p className="text-xs text-muted-foreground">1시간 전</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">봇 명령어가 실행되었습니다</p>
                <p className="text-xs text-muted-foreground">2시간 전</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 액션 */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
            <CardDescription>
              자주 사용하는 기능들에 빠르게 접근하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <PlayIcon className="w-4 h-4 mr-2" />
              새 파티 생성
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CalendarIcon className="w-4 h-4 mr-2" />
              이벤트 예약
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <UserIcon className="w-4 h-4 mr-2" />
              사용자 관리
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BotIcon className="w-4 h-4 mr-2" />
              봇 설정
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <SettingsIcon className="w-4 h-4 mr-2" />
              서버 설정
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 하단 카드들 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 인기 게임 */}
        <Card>
          <CardHeader>
            <CardTitle>인기 게임</CardTitle>
            <CardDescription>
              이번 주 가장 인기 있는 게임들
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <span className="font-medium">리그 오브 레전드</span>
              </div>
              <Badge variant="secondary">24 파티</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="font-medium">배틀그라운드</span>
              </div>
              <Badge variant="secondary">18 파티</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <span className="font-medium">오버워치 2</span>
              </div>
              <Badge variant="secondary">15 파티</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <span className="font-medium">발로란트</span>
              </div>
              <Badge variant="secondary">12 파티</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 시스템 상태 */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 상태</CardTitle>
            <CardDescription>
              현재 시스템 및 봇 상태
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">봇 상태</span>
              </div>
              <Badge variant="default">온라인</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">데이터베이스</span>
              </div>
              <Badge variant="default">정상</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">API 서버</span>
              </div>
              <Badge variant="default">정상</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">응답 시간</span>
              </div>
              <Badge variant="secondary">45ms</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}