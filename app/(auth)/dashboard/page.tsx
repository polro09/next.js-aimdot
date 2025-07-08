// app/dashboard/page.tsx - 대시보드 페이지
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
  PlayIcon
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
            <UserIcon className="h-4 w-4 text-muted-foreground" />
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
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
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
              오늘 3개 예정
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">봇 활동</CardTitle>
            <BotIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="default" className="text-sm">
                온라인
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              업타임 99.9%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* 최근 활동 */}
        <Card>
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
          </CardContent>
        </Card>

        {/* 빠른 액션 */}
        <Card>
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
              <TrendingUpIcon className="w-4 h-4 mr-2" />
              통계 보기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 시스템 상태 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 상태</CardTitle>
          <CardDescription>
            현재 시스템의 상태를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Discord Bot</p>
                <p className="text-xs text-muted-foreground">API 연결 상태</p>
              </div>
              <Badge variant="default">정상</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">데이터베이스</p>
                <p className="text-xs text-muted-foreground">응답 시간</p>
              </div>
              <Badge variant="default">12ms</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">서버</p>
                <p className="text-xs text-muted-foreground">CPU 사용률</p>
              </div>
              <Badge variant="secondary">23%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}