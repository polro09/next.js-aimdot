// types/next-auth.d.ts - NextAuth 타입 확장

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      discordId: string
      username: string
      discriminator: string
      avatar?: string
      nickname?: string
    } & DefaultSession['user']
    accessToken?: string
  }

  interface User extends DefaultUser {
    discordId: string
    username: string
    discriminator: string
    avatar?: string
    nickname?: string
  }

  interface Profile {
    id: string
    username: string
    discriminator: string
    avatar?: string
    email?: string
    verified?: boolean
    locale?: string
    mfa_enabled?: boolean
    premium_type?: number
    public_flags?: number
    flags?: number
    banner?: string
    accent_color?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    discordId?: string
    username?: string
    discriminator?: string
    avatar?: string
    nickname?: string
    accessToken?: string
  }
}