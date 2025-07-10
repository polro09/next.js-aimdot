// ===================================================================
// 4. app/(dashboard)/layout.tsx (대시보드 섹션 레이아웃)
// ===================================================================

// app/(dashboard)/layout.tsx
import { SidebarLayout } from '@/components/layout/sidebar-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Aimdot.dev',
  description: 'Discord Bot 관리 대시보드',
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarLayout>
      {children}
    </SidebarLayout>
  )
}