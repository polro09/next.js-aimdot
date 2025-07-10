<<<<<<< HEAD
// types/next-auth.d.ts - NextAuth 타입 확장 (수정된 버전)

import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      /** Discord 사용자 ID */
      discordId: string
      /** Discord 사용자명 */
      username: string
      /** Discord 디스크리미네이터 (#0000 형식) */
      discriminator: string
      /** Discord 아바타 해시 */
      avatar?: string
      /** 서버 닉네임 */
      nickname?: string
    } & DefaultSession['user']
    /** Discord API 액세스 토큰 */
    accessToken?: string
  }

  interface User extends DefaultUser {
    /** Discord 사용자 ID */
    discordId: string
    /** Discord 사용자명 */
    username: string
    /** Discord 디스크리미네이터 */
    discriminator: string
    /** Discord 아바타 해시 */
    avatar?: string
    /** 서버 닉네임 */
    nickname?: string
  }

  interface Profile {
    /** Discord 사용자 ID */
    id: string
    /** Discord 사용자명 */
    username: string
    /** Discord 디스크리미네이터 */
    discriminator: string
    /** Discord 아바타 해시 */
    avatar?: string
    /** 사용자 이메일 */
    email?: string
    /** 이메일 인증 여부 */
    verified?: boolean
    /** 사용자 로케일 */
    locale?: string
    /** MFA 활성화 여부 */
    mfa_enabled?: boolean
    /** Discord Nitro 타입 */
    premium_type?: number
    /** 공개 플래그 */
    public_flags?: number
    /** 사용자 플래그 */
    flags?: number
    /** 프로필 배너 해시 */
    banner?: string
    /** 프로필 강조 색상 */
    accent_color?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    /** Discord 사용자 ID */
    discordId?: string
    /** Discord 사용자명 */
    username?: string
    /** Discord 디스크리미네이터 */
    discriminator?: string
    /** Discord 아바타 해시 */
    avatar?: string
    /** 서버 닉네임 */
    nickname?: string
    /** Discord API 액세스 토큰 */
    accessToken?: string
  }
=======
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
>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
}