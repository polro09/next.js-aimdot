// ===================================================================
// 2. app/(main)/layout.tsx (메인 섹션 레이아웃 - 사이드바 적용)
// ===================================================================

// app/(main)/layout.tsx
import { SidebarLayout } from '@/components/layout/sidebar-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aimdot.dev - Discord Bot for Gaming',
  description: '게임 커뮤니티를 위한 최고의 Discord Bot 솔루션',
}

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  )
}