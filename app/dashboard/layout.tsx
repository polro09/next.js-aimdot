// app/dashboard/layout.tsx - 대시보드 레이아웃
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드',
  description: 'Aimdot.dev 관리 대시보드',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ConditionalLayout에서 이미 RealtimeSidebar를 적용하므로
  // 여기서는 추가 레이아웃 없이 children만 렌더링
  return <>{children}</>
}