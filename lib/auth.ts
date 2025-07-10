// lib/auth.ts - NextAuth 설정
import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './db'
import { logger } from './logger'

export const authOptions: NextAuthOptions = {
  // Prisma 어댑터 설정 (사용자 정보 DB 저장)
  adapter: PrismaAdapter(prisma),
  
  // 프로바이더 설정
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds'
        }
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar 
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`,
          discordId: profile.id,
          username: profile.username,
          discriminator: profile.discriminator,
          avatar: profile.avatar,
        }
      }
    })
  ],

  // 페이지 경로 설정
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  // 세션 설정
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
    updateAge: 24 * 60 * 60,   // 24시간마다 업데이트
  },

  // JWT 설정
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30일
  },

  // 콜백 함수들
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        logger.systemInfo('🔐 사용자 로그인 시도', {
          userId: user.id,
          provider: account?.provider,
          username: (profile as any)?.username
        })

        // Discord 로그인만 허용
        if (account?.provider !== 'discord') {
          logger.systemWarn('❌ 지원하지 않는 로그인 제공자', { provider: account?.provider })
          return false
        }

        // 추가 검증 로직 (필요시)
        // 예: 특정 서버 멤버인지 확인, 밴 상태 확인 등

        return true
      } catch (error) {
        logger.systemError('❌ 로그인 콜백 에러', error as Error)
        return false
      }
    },

    async jwt({ token, user, account, profile, trigger, session }) {
      try {
        // 첫 로그인 시 사용자 정보 토큰에 저장
        if (user && account) {
          token.discordId = (user as any).discordId
          token.username = (user as any).username
          token.discriminator = (user as any).discriminator
          token.avatar = (user as any).avatar
          token.accessToken = account.access_token
          
          logger.systemInfo('🎫 JWT 토큰 생성', {
            userId: user.id,
            discordId: (user as any).discordId,
            username: (user as any).username
          })
        }

        // 세션 업데이트 시
        if (trigger === 'update' && session) {
          token.name = session.user?.name
          token.email = session.user?.email
          token.picture = session.user?.image
        }

        return token
      } catch (error) {
        logger.systemError('❌ JWT 콜백 에러', error as Error)
        return token
      }
    },

    async session({ session, token }) {
      try {
        // 토큰에서 세션으로 정보 전달
        if (token && session.user) {
          (session.user as any).discordId = token.discordId as string
          ;(session.user as any).username = token.username as string
          ;(session.user as any).discriminator = token.discriminator as string
          ;(session.user as any).avatar = token.avatar as string
          ;(session.user as any).nickname = token.name as string
          ;(session as any).accessToken = token.accessToken as string
        }

        logger.systemInfo('📋 세션 생성', {
          userId: session.user?.email,
          discordId: (session.user as any)?.discordId,
          username: (session.user as any)?.username
        })

        return session
      } catch (error) {
        logger.systemError('❌ 세션 콜백 에러', error as Error)
        return session
      }
    },

    async redirect({ url, baseUrl }) {
      try {
        // 로그인 후 리다이렉트 처리
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`
        }
        // 콜백 URL이 같은 도메인인 경우
        else if (new URL(url).origin === baseUrl) {
          return url
        }
        // 기본적으로 대시보드로 리다이렉트
        return `${baseUrl}/dashboard`
      } catch (error) {
        logger.systemError('❌ 리다이렉트 콜백 에러', error as Error)
        return `${baseUrl}/dashboard`
      }
    }
  },

  // 이벤트 핸들러
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      try {
        logger.systemInfo('✅ 사용자 로그인 성공', {
          userId: user.id,
          isNewUser,
          provider: account?.provider,
          discordId: (profile as any)?.id
        })

        // 신규 사용자인 경우 환영 메시지 등 추가 로직
        if (isNewUser) {
          logger.systemInfo('🎉 신규 사용자 등록', {
            userId: user.id,
            username: (profile as any)?.username
          })
          
          // 봇에 신규 사용자 알림 (옵션)
          // await notifyDiscordBot('newUser', { userId: user.id, username: profile?.username })
        }
      } catch (error) {
        logger.systemError('❌ 로그인 이벤트 에러', error as Error)
      }
    },

    async signOut({ session, token }) {
      try {
        logger.systemInfo('👋 사용자 로그아웃', {
          userId: session?.user?.email,
          discordId: (session?.user as any)?.discordId
        })
      } catch (error) {
        logger.systemError('❌ 로그아웃 이벤트 에러', error as Error)
      }
    },

    async createUser({ user }) {
      try {
        logger.systemInfo('👤 새 사용자 생성', {
          userId: user.id,
          email: user.email,
          name: user.name
        })

        // 사용자 생성 시 추가 로직
        // 예: 기본 설정 생성, 역할 할당 등
      } catch (error) {
        logger.systemError('❌ 사용자 생성 이벤트 에러', error as Error)
      }
    }
  },

  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === 'development',

  // 보안 설정
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  // 쿠키 설정
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.aimdot.dev' : undefined
      }
    }
  },

  // CSRF 보호
  secret: process.env.NEXTAUTH_SECRET,
}

// NextAuth 핸들러 타입 (API 라우트에서 사용)
export type { NextAuthOptions } from 'next-auth'