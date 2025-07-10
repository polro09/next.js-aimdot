// app/layout.tsx - 루트 레이아웃
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { ConditionalLayout } from '@/components/layout/conditional-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Aimdot.dev - Discord Bot & 관리 시스템',
    template: '%s | Aimdot.dev'
  },
  description: '디스코드 서버 관리를 위한 올인원 솔루션. 게임 파티 생성, 스케줄 관리, 사용자 권한 관리까지.',
  keywords: ['Discord', 'Bot', '게임', '파티', '스케줄', '관리'],
  openGraph: {
    title: 'Aimdot.dev - Discord Bot & 관리 시스템',
    description: '디스코드 서버 관리를 위한 올인원 솔루션',
    url: 'https://aimdot.dev',
    siteName: 'Aimdot.dev',
    images: [
      {
        url: 'https://i.imgur.com/IOPA7gL.png',
        width: 1200,
        height: 630,
        alt: 'Aimdot.dev'
      }
    ],
    locale: 'ko_KR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aimdot.dev - Discord Bot & 관리 시스템',
    description: '디스코드 서버 관리를 위한 올인원 솔루션',
    images: ['https://i.imgur.com/IOPA7gL.png']
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}