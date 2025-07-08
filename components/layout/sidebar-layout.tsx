// components/layout/sidebar-layout.tsx (완전한 버전)
"use client"

import React, { ReactNode, useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  UserIcon, 
  BotIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  ActivityIcon,
  MenuIcon,
  CircleIcon,
  LogOutIcon,
  UserPlusIcon,
  CalendarIcon,
  ShieldIcon
} from 'lucide-react'

interface SidebarLayoutProps {
  children: ReactNode
}

// 사용자 프로필 타입 (임시 데이터)
interface UserProfile {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away' | 'dnd'
  role?: string
}

// 로그 항목 타입
interface LogEntry {
  id: string
  type: 'login' | 'party_created' | 'user_joined' | 'error' | 'warning'
  message: string
  timestamp: Date
  user?: string
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isClient, setIsClient] = useState(false)
  
  // 클라이언트 사이드에서만 시간 렌더링
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 임시 데이터 - 실제로는 API나 상태관리에서 가져옴
  const botStatus = 'online' // 'online' | 'offline' | 'maintenance'
  
  const connectedUsers: UserProfile[] = [
    { id: '1', name: '관리자', status: 'online', role: 'admin' },
    { id: '2', name: '게임유저1', status: 'online' },
    { id: '3', name: '게임유저2', status: 'away' },
    { id: '4', name: '게임유저3', status: 'dnd' },
    { id: '5', name: '게임유저4', status: 'offline' },
  ]

  const recentLogs: LogEntry[] = [
    {
      id: '1',
      type: 'login',
      message: '관리자님이 로그인했습니다',
      timestamp: new Date('2024-01-01T12:00:00'), // 고정된 시간
      user: '관리자'
    },
    {
      id: '2',
      type: 'party_created',
      message: '새로운 파티가 생성되었습니다: "발로란트 랭크게임"',
      timestamp: new Date('2024-01-01T11:55:00'), // 고정된 시간
      user: '게임유저1'
    },
    {
      id: '3',
      type: 'user_joined',
      message: '게임유저2님이 서버에 참가했습니다',
      timestamp: new Date('2024-01-01T11:50:00'), // 고정된 시간
      user: '게임유저2'
    },
    {
      id: '4',
      type: 'warning',
      message: '디스코드 API 응답 지연 감지',
      timestamp: new Date('2024-01-01T11:45:00') // 고정된 시간
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'dnd': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'login': return <UserIcon className="w-4 h-4" />
      case 'party_created': return <UserPlusIcon className="w-4 h-4" />
      case 'user_joined': return <UserPlusIcon className="w-4 h-4" />
      case 'error': return <CircleIcon className="w-4 h-4" />
      case 'warning': return <CircleIcon className="w-4 h-4" />
      default: return <ActivityIcon className="w-4 h-4" />
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'login': return 'text-green-500'
      case 'party_created': return 'text-blue-500'
      case 'user_joined': return 'text-purple-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 좌측 사이드바 */}
      <div className="w-80 border-r bg-card/30 flex flex-col">
        {/* 로고 영역 */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Image
              src="https://imgur.com/IOPA7gL.png"
              alt="Aimdot.dev Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold">Aimdot</h1>
              <p className="text-xs text-muted-foreground">Bot Management</p>
            </div>
          </div>
        </div>

        {/* 사용자 프로필 영역 */}
        <div className="p-4 border-b">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">사용자 프로필</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">관리</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">관리자</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor('online')}`} />
                    <span className="text-xs text-muted-foreground">온라인</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <SettingsIcon className="w-3 h-3 mr-1" />
                  설정
                </Button>
                <Button size="sm" variant="outline">
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
                <Badge variant={botStatus === 'online' ? 'default' : 'destructive'}>
                  {botStatus === 'online' ? '온라인' : '오프라인'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(botStatus)} animate-pulse`} />
                <p className="text-xs text-muted-foreground">
                  마지막 활동: 방금 전
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 접속 사용자 */}
        <div className="p-4 border-b flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  접속 사용자
                </div>
                <Badge variant="secondary">
                  {connectedUsers.filter(u => u.status === 'online').length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {connectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        {user.role && (
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* 우측 사이드바 */}
      <div className="w-80 border-l bg-card/30 flex flex-col">
        {/* 메뉴 영역 */}
        <div className="p-4 border-b">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <MenuIcon className="w-4 h-4 mr-2" />
                메뉴
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <HomeIcon className="w-4 h-4 mr-2" />
                대시보드
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                파티 관리
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <UsersIcon className="w-4 h-4 mr-2" />
                사용자 관리
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <ShieldIcon className="w-4 h-4 mr-2" />
                권한 관리
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <SettingsIcon className="w-4 h-4 mr-2" />
                설정
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 활동 로그 */}
        <div className="p-4 flex-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <ActivityIcon className="w-4 h-4 mr-2" />
                활동 로그
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-2 text-xs">
                      <div className={`mt-1 ${getLogColor(log.type)}`}>
                        {getLogIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{log.message}</p>
                        <p className="text-muted-foreground">
                          {isClient ? log.timestamp.toLocaleTimeString() : '로딩중...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}