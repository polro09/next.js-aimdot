// components/layout/realtime-sidebar.tsx - 실시간 API 연동 사이드바 (타입 에러 해결)
"use client"

import React, { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'
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
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
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

  // 30초마다 데이터 자동 새로고침
  useEffect(() => {
    if (!session?.user) return

    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000) // 30초

    return () => clearInterval(interval)
  }, [session])

  // 로그아웃 핸들러
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  // 상태별 색상 클래스 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'dnd':
        return 'bg-red-500'
      case 'offline':
      default:
        return 'bg-gray-500'
    }
  }

  // 상대 시간 표시 (예: "2분 전")
  const getRelativeTime = (date: string | Date) => {
    const now = new Date()
    const target = new Date(date)
    const diff = now.getTime() - target.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  // 로그 심각도별 색상
  const getLogSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
      default:
        return 'text-blue-500'
    }
  }

  // 업타임 포맷팅 (초를 시:분:초로 변환)
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    if (minutes > 0) {
      return `${minutes}분 ${secs}초`
    }
    return `${secs}초`
  }

  // 로딩 중이거나 세션이 없는 경우
  if (!session?.user) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <RefreshCwIcon className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">로그인이 필요합니다</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 사이드바 */}
      <div className="w-80 border-r bg-card overflow-hidden flex flex-col">
        {/* 로고 및 헤더 */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Image
              src="https://i.imgur.com/Sd8qK9c.gif"
              alt="Aimdot.dev Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold">Aimdot.dev</h1>
              <p className="text-sm text-muted-foreground">관리 대시보드</p>
            </div>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="p-4 border-b">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  {dashboardData?.user.avatar ? (
                    <AvatarImage 
                      src={`https://cdn.discordapp.com/avatars/${dashboardData.user.discordId}/${dashboardData.user.avatar}.png`}
                      alt={dashboardData.user.username}
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {dashboardData?.user.username?.charAt(0) || session.user.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {dashboardData?.user.nickname || 
                     dashboardData?.user.username || 
                     session.user.name || 
                     '로딩중...'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(dashboardData?.user.status || 'offline')}`} />
                    <span className="text-xs text-muted-foreground">
                      {dashboardData?.user.status === 'online' ? '온라인' : '오프라인'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <SettingsIcon className="w-3 h-3 mr-1" />
                  설정
                </Button>
                <Button size="sm" variant="outline" onClick={handleSignOut}>
                  <LogOutIcon className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 봇 온라인 상태 */}
        <div className="p-4 border-b">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <BotIcon className="w-4 h-4 mr-2" />
                  봇 온라인 상태
                </div>
                <Badge variant={dashboardData?.bot.status === 'online' ? 'default' : 'destructive'}>
                  {dashboardData?.bot.status === 'online' ? '온라인' : 
                   dashboardData?.bot.status === 'maintenance' ? '점검중' : '오프라인'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(dashboardData?.bot.status || 'offline')} ${
                  dashboardData?.bot.status === 'online' ? 'animate-pulse' : ''
                }`} />
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.bot.status === 'online' 
                    ? `업타임: ${formatUptime(dashboardData.bot.uptime)}`
                    : '오프라인 상태'}
                </p>
              </div>
              {dashboardData?.bot.status === 'online' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">서버: </span>
                    <span className="font-medium">{dashboardData.bot.guilds}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">사용자: </span>
                    <span className="font-medium">{dashboardData.bot.users}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">지연시간: </span>
                    <span className="font-medium">{dashboardData.bot.latency}ms</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">버전: </span>
                    <span className="font-medium">{dashboardData.bot.version}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 접속 중인 사용자 */}
        <div className="p-4 border-b">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  접속 중인 사용자
                </div>
                <Badge variant="secondary">
                  {dashboardData?.stats.totalOnline || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                {dashboardData?.connectedUsers.length ? (
                  <div className="space-y-2">
                    {dashboardData.connectedUsers.map((user) => (
                      <div key={user.discordId} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`} />
                        <Avatar className="w-6 h-6">
                          {user.avatar ? (
                            <AvatarImage 
                              src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                              alt={user.username}
                            />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {user.username.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {user.nickname || user.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeTime(user.lastActive)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-xs text-muted-foreground">접속 중인 사용자가 없습니다</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 최근 활동 */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <ActivityIcon className="w-4 h-4 mr-2" />
                  최근 활동
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  <RefreshCwIcon className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <ScrollArea className="h-full">
                {error ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="text-center">
                      <WifiOffIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{error}</p>
                      <Button size="sm" variant="outline" onClick={fetchDashboardData} className="mt-2">
                        다시 시도
                      </Button>
                    </div>
                  </div>
                ) : dashboardData?.recentLogs.length ? (
                  <div className="space-y-2">
                    {dashboardData.recentLogs.map((log) => (
                      <div key={log.id} className="p-2 rounded-lg bg-muted/30">
                        <div className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-1 ${getLogSeverityColor(log.severity)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {log.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">
                                {log.username || '시스템'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {getRelativeTime(log.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20">
                    <p className="text-xs text-muted-foreground">최근 활동이 없습니다</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 상태 표시 */}
        {lastUpdated && (
          <div className="p-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
            </p>
          </div>
        )}
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}