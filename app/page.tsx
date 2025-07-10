// app/page.tsx - 루트 페이지 (랜딩 페이지)
"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BotIcon, 
  GamepadIcon, 
  CalendarIcon, 
  UsersIcon,
  ArrowRightIcon,
  ShieldIcon,
  TrendingUpIcon,
  StarIcon
} from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 로그인된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (session?.user) {
      console.log('✅ 로그인된 사용자 감지 - 대시보드로 이동')
      setIsLoading(true)
      router.push('/dashboard')
    }
  }, [session, router])

  // 로그인 핸들러
  const handleSignIn = () => {
    setIsLoading(true)
    router.push('/auth/signin')
  }

  // 로딩 중이면 로딩 화면 표시
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <Image
            src="https://i.imgur.com/Sd8qK9c.gif"
            alt="Aimdot.dev 로딩"
            width={80}
            height={80}
            className="mx-auto rounded-lg"
          />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* 헤더 */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="https://i.imgur.com/Sd8qK9c.gif"
              alt="Aimdot.dev"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold">Aimdot.dev</h1>
              <p className="text-xs text-muted-foreground">Discord Bot & 관리 시스템</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden sm:flex">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              봇 온라인
            </Badge>
            <Button onClick={handleSignIn} className="flex items-center">
              Discord 로그인
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <section className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Aimdot.dev
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              디스코드 서버 관리를 위한 올인원 솔루션
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              게임 파티 생성, 스케줄 관리, 사용자 권한 관리까지 
              모든 것을 하나의 통합된 시스템으로 관리하세요
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSignIn} className="text-lg px-8">
              지금 시작하기
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              문서 보기
            </Button>
          </div>
        </section>

        {/* 주요 기능 소개 */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">주요 기능</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Aimdot.dev가 제공하는 강력한 기능들로 디스코드 서버를 효율적으로 관리하세요
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 게임 파티 관리 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <GamepadIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>게임 파티 관리</CardTitle>
                <CardDescription>
                  게임별 파티 생성, 참가자 모집, 자동 매칭 시스템
                </CardDescription>
              </CardHeader>
            </Card>

            {/* 스케줄 관리 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <CalendarIcon className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>스케줄 관리</CardTitle>
                <CardDescription>
                  이벤트 예약, 알림 설정, 캘린더 연동 기능
                </CardDescription>
              </CardHeader>
            </Card>

            {/* 사용자 관리 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <UsersIcon className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>사용자 관리</CardTitle>
                <CardDescription>
                  역할 관리, 권한 설정, 활동 추적 시스템
                </CardDescription>
              </CardHeader>
            </Card>

            {/* 봇 관리 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <BotIcon className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>봇 관리</CardTitle>
                <CardDescription>
                  실시간 봇 상태 모니터링, 명령어 관리, 로그 추적
                </CardDescription>
              </CardHeader>
            </Card>

            {/* 보안 관리 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                  <ShieldIcon className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle>보안 관리</CardTitle>
                <CardDescription>
                  접근 제어, 감사 로그, 자동 모더레이션 기능
                </CardDescription>
              </CardHeader>
            </Card>

            {/* 분석 및 통계 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <TrendingUpIcon className="w-6 h-6 text-orange-500" />
                </div>
                <CardTitle>분석 및 통계</CardTitle>
                <CardDescription>
                  사용자 활동 분석, 트렌드 파악, 성과 리포트
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="py-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <StarIcon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <StarIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <StarIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl">지금 바로 시작하세요</CardTitle>
              <CardDescription className="text-lg">
                몇 분만에 설정을 완료하고 강력한 디스코드 관리 시스템을 경험해보세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={handleSignIn} className="text-lg px-12">
                무료로 시작하기
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                신용카드 필요 없음 • 즉시 사용 가능 • 언제든 취소 가능
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Image
                src="https://i.imgur.com/Sd8qK9c.gif"
                alt="Aimdot.dev"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-semibold">Aimdot.dev</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Aimdot.dev. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground">
                개인정보처리방침
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground">
                이용약관
              </a>
              <a href="/docs" className="text-muted-foreground hover:text-foreground">
                문서
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 누락된 import 추가
import { BookOpenIcon } from 'lucide-react'