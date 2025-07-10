// components/layout/realtime-sidebar.tsx - 실시간 API 연동 사이드바 (타입 에러 해결)
"use client"

import React, { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  UserIcon, 
  BotIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  ActivityIcon,
  LogOutIcon,
  UserPlusIcon,
  CalendarIcon,
  ShieldIcon,
  RefreshCwIcon,
  WifiOffIcon
} from 'lucide-react'
import type { DashboardApiResponse, ApiErrorResponse } from '@/types/api'

interface SidebarLayoutProps {
  children: ReactNode
}

export function RealtimeSidebar({ children }: SidebarLayoutProps) {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // 대시보드 데이터 가져오기
  const fetchDashboardData = async () => {
    try {
      setError(null)
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data: DashboardApiResponse = await response.json()
      setDashboardData(data)
      setLastUpdated(new Date())
      
      console.log('📊 대시보드 데이터 업데이트됨:', {
        botStatus: data.bot.status,
        connectedUsers: data.connectedUsers.length,
        recentLogs: data.recentLogs.length
      })

    } catch (error) {
      console.error('❌ 대시보드 데이터 가져오기 실패:', error)
      setError(error instanceof Error ? error.message : '데이터 로딩 실패')
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])

  // 30초마다 자동 새로고침
  useEffect(() => {
    if (!session?.user) return

    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000) // 30초

    return () => clearInterval(interval)
  }, [session])

  // 수동 새로고침
  const handleRefresh = () => {
    setLoading(true)
    fetchDashboardData()
  }

  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/auth/signin' })
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  // 상태별 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'dnd': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  // 로그 아이콘 반환
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserIcon className="w-4 h-4" />
      case 'party_created': return <UserPlusIcon className="w-4 h-4" />
      case 'user_joined': return <UserPlusIcon className="w-4 h-4" />
      case 'error': return <WifiOffIcon className="w-4 h-4" />
      case 'warning': return <ActivityIcon className="w-4 h-4" />
      default: return <ActivityIcon className="w-4 h-4" />
    }
  }

  // 로그 색상 반환
  const getLogColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  // 업타임 포맷팅
  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = uptime % 60
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds}초`
    } else {
      return `${seconds}초`
    }
  }

  // 로딩 상태
  if (loading && !dashboardData) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r bg-card/30 flex items-center justify-center">
          <div className="text-center space-y-4">
            <RefreshCwIcon className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">데이터 로딩 중...</p>
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    )
  }

  // 에러 상태
  if (error && !dashboardData) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-80 border-r bg-card/30 flex items-center justify-center">
          <div className="text-center space-y-4 p-4">
            <WifiOffIcon className="w-8 h-8 mx-auto text-destructive" />
            <p className="text-destructive font-medium">연결 오류</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              다시 시도
            </Button>
          </div>
        </div>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 사이드바 */}
      <aside className="w-80 border-r bg-card/30 flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Image
              src="https://i.imgur.com/IOPA7gL.png"
              alt="Aimdot.dev"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="font-bold text-lg">Aimdot.dev</h1>
              <p className="text-xs text-muted-foreground">관리 시스템</p>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="p-4 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <HomeIcon className="w-4 h-4 mr-3" />
              대시보드
            </Button>
          </Link>
          <Link href="/parties">
            <Button variant="ghost" className="w-full justify-start">
              <UserPlusIcon className="w-4 h-4 mr-3" />
              파티 관리
            </Button>
          </Link>
          <Link href="/schedule">
            <Button variant="ghost" className="w-full justify-start">
              <CalendarIcon className="w-4 h-4 mr-3" />
              스케줄
            </Button>
          </Link>
          <Link href="/users">
            <Button variant="ghost" className="w-full justify-start">
              <UsersIcon className="w-4 h-4 mr-3" />
              사용자 관리
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <SettingsIcon className="w-4 h-4 mr-3" />
              설정
            </Button>
          </Link>
        </nav>

        <ScrollArea className="flex-1 px-4">
          {/* 봇 상태 */}
          {dashboardData && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BotIcon className="w-4 h-4" />
                    봇 상태
                  </span>
                  <Badge variant={dashboardData.bot.status === 'online' ? 'default' : 'secondary'}>
                    {dashboardData.bot.status === 'online' ? '온라인' : '오프라인'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">업타임</span>
                  <span>{formatUptime(dashboardData.bot.uptime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">지연시간</span>
                  <span>{dashboardData.bot.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">서버</span>
                  <span>{dashboardData.bot.guilds}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">전체 유저</span>
                  <span>{dashboardData.bot.users}명</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 온라인 유저 */}
          {dashboardData && dashboardData.connectedUsers.length > 0 && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  온라인 유저 ({dashboardData.stats.totalOnline}명)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboardData.connectedUsers.map((user) => (
                  <div key={user.discordId} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.nickname || user.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.status === 'online' ? '온라인' : user.status}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 최근 활동 */}
          {dashboardData && dashboardData.recentLogs.length > 0 && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4" />
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData.recentLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 ${getLogColor(log.severity)}`}>
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{log.message}</p>
                      {log.user && (
                        <p className="text-xs text-muted-foreground">by {log.user}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </ScrollArea>

        {/* 하단 사용자 정보 */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback>
                {session?.user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleSignOut}
            >
              <LogOutIcon className="w-4 h-4" />
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </p>
          )}
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}