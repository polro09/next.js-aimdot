"use client"

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BotIcon, 
  LogInIcon, 
  ShieldIcon,
  UserIcon,
  ExternalLinkIcon
} from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/main')
      }
    }
    checkSession()
  }, [router])

  const handleDiscordSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔑 Discord 로그인 시도...')
      
      const result = await signIn('discord', {
        callbackUrl: '/main',
        redirect: false
      })

      if (result?.error) {
        setError('로그인에 실패했습니다. 다시 시도해주세요.')
        console.error('❌ 로그인 실패:', result.error)
      } else if (result?.url) {
        console.log('✅ 로그인 성공, 리다이렉트:', result.url)
        router.push(result.url)
      }

    } catch (error) {
      console.error('❌ 로그인 처리 실패:', error)
      setError('로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 로고 영역 */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="https://imgur.com/IOPA7gL.png"
              alt="Aimdot.dev Logo"
              width={80}
              height={80}
              className="rounded-2xl shadow-lg"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Aimdot.dev</h1>
            <p className="text-muted-foreground">Discord Bot 관리 시스템</p>
          </div>
        </div>

        {/* 로그인 카드 */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-2">
                <BotIcon className="w-4 h-4 mr-2" />
                관리자 로그인
              </Badge>
            </div>
            <div>
              <CardTitle className="text-2xl">로그인</CardTitle>
              <CardDescription className="text-base mt-2">
                Discord 계정으로 로그인하여 봇 관리 시스템에 접속하세요
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 에러 메시지 */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Discord 로그인 버튼 */}
            <Button
              onClick={handleDiscordSignIn}
              disabled={loading}
              className="w-full h-12 text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>로그인 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord로 로그인</span>
                  <ExternalLinkIcon className="w-4 h-4 ml-1" />
                </div>
              )}
            </Button>

            {/* 권한 안내 */}
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium text-center">로그인 시 다음 권한이 요청됩니다:</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <UserIcon className="w-4 h-4 text-blue-500" />
                  <span>기본 프로필 정보 (닉네임, 아바타)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <ShieldIcon className="w-4 h-4 text-green-500" />
                  <span>서버 목록 (관리 권한 확인용)</span>
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>로그인하시면 Aimdot.dev의</p>
              <div className="flex justify-center space-x-1">
                <a href="/terms" className="text-primary hover:underline">이용약관</a>
                <span>및</span>
                <a href="/privacy" className="text-primary hover:underline">개인정보처리방침</a>
                <span>에 동의하게 됩니다.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 홈으로 돌아가기 */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => router.push('/')}>
            ← 홈페이지로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}