// components/layout/sidebar-layout.tsx - 사이드바 레이아웃 컴포넌트
"use client"

import React, { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
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
  WifiOffIcon,
  PartyPopperIcon,
  ChartBarIcon,
  FileTextIcon,
  MessageSquareIcon,
  BellIcon
} from 'lucide-react'

interface SidebarLayoutProps {
  children: ReactNode
}

// API 응답 타입 정의
interface DashboardData {
  user: {
    discordId: string
    username: string
    discriminator: string
    avatar?: string
    nickname?: string
    status: string
  }
  bot: {
    status: 'online' | 'offline' | 'maintenance'
    uptime: number
    guilds: number
    users: number
    latency: number
    lastPing: string
    version: string
  }
  connectedUsers: {
    discordId: string
    username: string
    discriminator: string
    avatar?: string
    nickname?: string
    status: 'online' | 'offline' | 'away' | 'dnd'
    lastActive: string
  }[]
  recentLogs: {
    id: string
    type: string
    message: string
    user?: string
    timestamp: string
    severity: 'info' | 'warning' | 'error'
    data?: any
  }[]
  stats: {
    totalOnline: number
    totalUsers: number
    totalActivities: number
    botUptime: number
  }
  timestamp: string
}

// 네비게이션 메뉴 아이템 타입
interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  color?: string
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 네비게이션 메뉴 아이템
  const navItems: NavItem[] = [
    { title: '대시보드', href: '/dashboard', icon: HomeIcon, color: 'text-blue-500' },
    { title: '파티 관리', href: '/parties', icon: PartyPopperIcon, color: 'text-purple-500' },
    { title: '스케줄', href: '/schedule', icon: CalendarIcon, color: 'text-green-500' },
    { title: '사용자 관리', href: '/users', icon: UsersIcon, color: 'text-orange-500' },
    { title: '분석', href: '/analytics', icon: ChartBarIcon, color: 'text-cyan-500' },
    { title: '봇 관리', href: '/bot', icon: BotIcon, color: 'text-indigo-500' },
    { title: '활동 로그', href: '/logs', icon: ActivityIcon, color: 'text-yellow-500' },
    { title: '문서', href: '/docs', icon: FileTextIcon, color: 'text-gray-500' },
  ]

  const bottomNavItems: NavItem[] = [
    { title: '알림', href: '/notifications', icon: BellIcon, badge: 3 },
    { title: '메시지', href: '/messages', icon: MessageSquareIcon, badge: 0 },
    { title: '설정', href: '/settings', icon: SettingsIcon },
    { title: '보안', href: '/security', icon: ShieldIcon },
  ]

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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: DashboardData = await response.json()
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
      setIsRefreshing(false)
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
    setIsRefreshing(true)
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
      case 'party_created': return <PartyPopperIcon className="w-4 h-4" />
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
              <h2 className="font-bold text-lg">Aimdot.dev</h2>
              <p className="text-xs text-muted-foreground">관리 대시보드</p>
            </div>
          </div>
        </div>

        {/* 사용자 정보 */}
        {session?.user && (
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={session.user.image || undefined} />
                <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSignOut}
                className="h-8 w-8 p-0"
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 네비게이션 메뉴 */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? '' : item.color || ''}`} />
                  <span className="font-medium">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}

            <Separator className="my-4" />

            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* 하단 정보 패널 */}
        <div className="p-4 border-t space-y-3">
          {/* 봇 상태 */}
          {dashboardData && (
            <Card>
              <CardHeader className="p-4 pb-3">
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
              <CardContent className="p-4 pt-0 space-y-2 text-sm">
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

          {/* 온라인 유저 (간략히 표시) */}
          {dashboardData && dashboardData.connectedUsers.length > 0 && (
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    온라인 유저
                  </span>
                  <Badge variant="secondary">{dashboardData.stats.totalOnline}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex -space-x-2">
                  {dashboardData.connectedUsers.slice(0, 5).map((user) => (
                    <Avatar key={user.discordId} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {dashboardData.connectedUsers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      +{dashboardData.connectedUsers.length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 최근 활동 (간략히 표시) */}
          {dashboardData && dashboardData.recentLogs.length > 0 && (
            <Card>
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ActivityIcon className="w-4 h-4" />
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  {dashboardData.recentLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center gap-2 text-xs">
                      <span className={getLogColor(log.severity)}>
                        {getLogIcon(log.type)}
                      </span>
                      <span className="truncate flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 새로고침 버튼 */}
          <div className="flex items-center justify-between">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCwIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-muted-foreground text-center">
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

// RealtimeSidebar를 위한 별칭 export (호환성 유지)
export const RealtimeSidebar = SidebarLayout