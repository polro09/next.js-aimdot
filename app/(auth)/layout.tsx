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
}