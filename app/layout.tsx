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
  keywords: ['Discord', 'Bot', '디스코드', '봇', '게임', '파티', '관리', 'Aimdot'],
  authors: [{ name: 'Aimdot.dev Team' }],
  creator: 'Aimdot.dev',
  publisher: 'Aimdot.dev',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Aimdot.dev - Discord Bot & 관리 시스템',
    description: '디스코드 서버 관리를 위한 올인원 솔루션',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: 'Aimdot.dev',
    images: [
      {
        url: 'https://i.imgur.com/Sd8qK9c.gif',
        width: 1200,
        height: 630,
        alt: 'Aimdot.dev Logo',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aimdot.dev - Discord Bot & 관리 시스템',
    description: '디스코드 서버 관리를 위한 올인원 솔루션',
    images: ['https://i.imgur.com/Sd8qK9c.gif'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Additional meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://cdn.discordapp.com" />
        <link rel="preconnect" href="https://i.imgur.com" />
        
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://discord.com" />
        
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}