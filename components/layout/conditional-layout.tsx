"use client"

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { SidebarLayout } from './sidebar-layout'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  
  // 사이드바를 사용하지 않을 페이지들 (수정됨)
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
    return <>{children}</>
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
    return <SidebarLayout>{children}</SidebarLayout>
  }
  
  // 인증되지 않은 사용자가 보호된 페이지에 접근하는 경우
  if (!session && isSidebarPage) {
    // 로그인 페이지로 리다이렉트하거나 로딩 화면 표시
    return <>{children}</>
  }
  
  // 그 외의 경우 기본 레이아웃
  return <>{children}</>
}