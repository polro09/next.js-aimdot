// components/layout/conditional-layout.tsx
"use client"

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { RealtimeSidebar } from './realtime-sidebar'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  
  // 사이드바를 사용하지 않을 페이지들
  const noSidebarPages = [
    '/',              // 루트 페이지 (로딩 화면)
    '/auth/signin',
    '/auth/signup', 
    '/auth/error',
    '/loading',       // 별도 로딩 페이지
    '/docs',          // 문서 페이지들
    '/privacy',
    '/terms'
  ]
  
  // 사이드바를 사용할 페이지들 (메인 앱)
  const sidebarPages = [
    '/dashboard',     // 새로운 메인 대시보드
    '/parties',       // 파티 관리
    '/schedule',      // 스케줄 관리
    '/users',         // 사용자 관리
    '/settings',      // 설정
    '/analytics',     // 분석
    '/profile'        // 프로필
  ]
  
  // 로딩 중인 경우
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }
  
  // 사이드바를 사용하지 않을 페이지들 체크
  const isNoSidebarPage = noSidebarPages.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  )
  
  // 사이드바를 사용할 페이지들 체크
  const isSidebarPage = sidebarPages.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  )
  
  // 명시적으로 사이드바를 사용하지 않는 페이지
  if (isNoSidebarPage) {
    return <>{children}</>
  }
  
  // 인증된 사용자이고 사이드바를 사용하는 페이지인 경우
  if (session && isSidebarPage) {
    return <RealtimeSidebar>{children}</RealtimeSidebar>
  }
  
  // 인증되지 않은 사용자가 보호된 페이지에 접근하는 경우
  if (!session && isSidebarPage) {
    // 로그인 페이지로 리다이렉트하거나 로딩 화면 표시
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">로그인이 필요합니다</h2>
          <p className="text-muted-foreground">이 페이지에 접근하려면 로그인해주세요.</p>
          <a href="/auth/signin" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            로그인하기
          </a>
        </div>
      </div>
    )
  }
  
  // 그 외의 경우 기본 레이아웃
  return <>{children}</>
}