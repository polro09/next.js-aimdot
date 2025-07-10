<<<<<<< HEAD
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
=======
// app/layout.tsx - 간단한 루트 레이아웃 (UI 라이브러리 의존성 최소화)
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Aimdot.dev - Discord Bot 관리 시스템',
  description: '디스코드 서버와 연동하여 게임 파티 생성, 스케줄 관리, 사용자 권한 관리를 통합적으로 처리하는 웹 관리 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
}