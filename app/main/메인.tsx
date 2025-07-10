"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useInitialLoading } from '@/hooks/use-initial-loading'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  GamepadIcon, 
  CalendarIcon, 
  UsersIcon, 
  ShieldIcon,
  BotIcon,
  GlobeIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
  TrendingUpIcon,
  ActivityIcon,
  BarChart3Icon
} from 'lucide-react'

// 메인 홈페이지 데이터
const features = [
  {
    icon: GamepadIcon,
    title: '게임 파티 관리',
    description: '손쉽게 게임 파티를 생성하고 참가자를 모집하세요. 자동 매칭과 실시간 알림 기능을 제공합니다.',
    color: 'text-blue-500'
  },
  {
    icon: CalendarIcon,
    title: '스케줄 관리',
    description: '게임 일정을 효율적으로 관리하고 팀원들과 공유하세요. 캘린더 연동과 리마인더 기능을 지원합니다.',
    color: 'text-green-500'
  },
  {
    icon: UsersIcon,
    title: '사용자 권한 관리',
    description: '서버 멤버들의 역할과 권한을 체계적으로 관리하세요. 자동 역할 부여와 권한 관리 시스템을 제공합니다.',
    color: 'text-purple-500'
  },
  {
    icon: ShieldIcon,
    title: '보안 및 모니터링',
    description: '서버 보안을 강화하고 활동을 모니터링하세요. 실시간 로그와 보안 알림 시스템이 포함되어 있습니다.',
    color: 'text-red-500'
  }
]

const stats = [
  { label: '활성 서버', value: '150+', icon: GamepadIcon },
  { label: '총 사용자', value: '12K+', icon: UsersIcon },
  { label: '월간 파티', value: '5K+', icon: CalendarIcon },
  { label: '가동률', value: '99.9%', icon: ActivityIcon }
]

export default function MainHomePage() {
  const { showLoading, isLoading } = useInitialLoading()

  // 로딩 중인 경우 리다이렉트하지 않고 그냥 대기
  // (실제 리다이렉트는 별도로 처리)
  
  // 메인 홈페이지 렌더링 (사이드바 적용)
  return (
    <div className="p-6 space-y-8">
      {/* 📌 사이드바 내부에 표시될 메인 콘텐츠 */}
      
      {/* 히어로 섹션 */}
      <section className="text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="https://imgur.com/IOPA7gL.png"
            alt="Aimdot.dev Logo"
            width={80}
            height={80}
            className="mb-4"
          />
        </div>
        
        <Badge variant="secondary" className="px-4 py-2">
          <BotIcon className="w-4 h-4 mr-2" />
          Discord Bot 관리 시스템
        </Badge>
        
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          게임 커뮤니티를 위한
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {' '}완벽한 솔루션
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discord 서버에서 게임 파티 생성부터 스케줄 관리, 사용자 권한 관리까지 
          모든 것을 하나의 봇으로 해결하세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/dashboard">
              <BarChart3Icon className="w-5 h-5 mr-2" />
              대시보드 시작하기
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            <GlobeIcon className="w-5 h-5 mr-2" />
            데모 보기
          </Button>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <stat.icon className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* 주요 기능 섹션 */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">주요 기능</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            게임 커뮤니티 관리에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 빠른 시작 섹션 */}
      <section className="space-y-6">
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">지금 바로 시작하세요!</CardTitle>
            <CardDescription className="text-base">
              몇 분만에 Discord 서버에 Aimdot.dev 봇을 추가하고 
              강력한 게임 커뮤니티 관리 기능을 경험해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold">봇 추가</h3>
                <p className="text-sm text-muted-foreground">
                  Discord 서버에 Aimdot.dev 봇을 초대합니다
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold">설정 완료</h3>
                <p className="text-sm text-muted-foreground">
                  웹 대시보드에서 봇 설정을 구성합니다
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold">게임 시작</h3>
                <p className="text-sm text-muted-foreground">
                  파티를 생성하고 게임을 즐겨보세요
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/dashboard">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  대시보드로 이동
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                <BotIcon className="w-5 h-5 mr-2" />
                봇 초대하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 실시간 활동 미리보기 */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">실시간 활동</h2>
          <p className="text-muted-foreground">
            지금 이 순간에도 활발하게 사용되고 있는 Aimdot.dev
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ActivityIcon className="w-5 h-5 mr-2 text-blue-500" />
                최근 파티
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>발로란트 랭크 파티</span>
                <span className="text-muted-foreground ml-auto">방금 전</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>리그오브레전드 노말</span>
                <span className="text-muted-foreground ml-auto">2분 전</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>오버워치2 경쟁전</span>
                <span className="text-muted-foreground ml-auto">5분 전</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
                서버 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>오늘 생성된 파티</span>
                <span className="font-semibold">47개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>활성 사용자</span>
                <span className="font-semibold">234명</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>예정된 일정</span>
                <span className="font-semibold">12개</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BotIcon className="w-5 h-5 mr-2 text-orange-500" />
                봇 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">온라인</span>
              </div>
              <div className="text-xs text-muted-foreground">
                가동률: 99.9% (30일)
              </div>
              <div className="text-xs text-muted-foreground">
                평균 응답시간: 120ms
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}