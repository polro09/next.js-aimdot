// app/(auth)/layout.tsx - 인증 관련 페이지 레이아웃
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '인증',
  description: 'Aimdot.dev 로그인 및 인증 페이지',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      {children}
    </div>
  )
}