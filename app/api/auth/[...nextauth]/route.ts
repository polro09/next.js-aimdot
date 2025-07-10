import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import type { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify guilds'
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Discord 계정 정보를 JWT에 저장
      if (account && profile) {
        token.discordId = profile.id
        token.username = profile.username
        token.discriminator = profile.discriminator
        token.avatar = profile.avatar
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // JWT 정보를 세션에 포함
      if (token) {
        session.user.discordId = token.discordId as string
        session.user.username = token.username as string
        session.user.discriminator = token.discriminator as string
        session.user.avatar = token.avatar as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      // 로그인 시 활동 로그 기록
      if (account?.provider === 'discord') {
        console.log(`✅ Discord 로그인: ${user.name} (${profile?.id})`)
        // TODO: 데이터베이스에 로그인 기록 저장
      }
    },
    async signOut({ token }) {
      console.log(`🚪 로그아웃: ${token?.username}`)
      // TODO: 데이터베이스에 로그아웃 기록 저장
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }