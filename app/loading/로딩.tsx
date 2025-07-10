"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'

/**
 * 로딩 페이지 - /loading 경로
 * SimpleLoadingTest와 동일한 디자인과 구조 사용
 * 로딩 완료 후 /dashboard로 리다이렉트
 */
export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  // 페이지 입장시에만 한 번 생성되는 로고 URL (리렌더링되어도 유지)
  const logoUrl = useMemo(() => {
    return `https://i.imgur.com/9MwyIGW.gif?t=${Date.now()}`
  }, []) // 빈 의존성 배열로 최초 한 번만 생성

  // 4개의 로딩 메시지
  const loadingMessages = [
    "서버에 연결하는 중...",
    "사용자 정보 불러오는 중...", 
    "게임 데이터 로드 중...",
    "설정 적용 중..."
  ]

  // 로딩 완료 후 메인 페이지로 이동
  const handleComplete = () => {
    console.log('✅ 로딩 완료 - 메인 페이지로 이동')
    
    // 세션 스토리지에 로딩 완료 표시
    sessionStorage.setItem('aimdot_loading_completed', 'true')
    
    // 부드러운 전환을 위한 약간의 지연
    setTimeout(() => {
      router.replace('/main') // /main으로 직접 이동!
    }, 300)
  }

  useEffect(() => {
    console.log('🔄 로딩 페이지 시작: 4초간 부드러운 진행')
    console.log('🖼️ 로고 URL:', logoUrl)
    
    let currentProgress = 0
    let currentMessageIndex = 0
    
    const updateProgress = () => {
      // 15~25% 랜덤 증가 (4초에 맞게 조정)
      const randomIncrement = Math.floor(Math.random() * 11) + 15 // 15-25
      currentProgress = Math.min(currentProgress + randomIncrement, 100)
      
      setProgress(currentProgress)
      console.log('📊 진행:', currentProgress + '%')
      
      // 메시지 변경 (진행률에 따라 - 4개 메시지에 맞게 조정)
      const newMessageIndex = Math.min(Math.floor(currentProgress / 25), 3) // 25%마다 변경, 최대 3
      if (newMessageIndex !== currentMessageIndex) {
        currentMessageIndex = newMessageIndex
        setMessageIndex(currentMessageIndex)
        console.log('💬 메시지:', loadingMessages[currentMessageIndex])
      }
      
      if (currentProgress >= 100) {
        console.log('✅ 로딩 완료!')
        setTimeout(() => handleComplete(), 500)
        return
      }
      
      // 다음 업데이트 시간 계산 (총 4초가 되도록)
      const timePerUpdate = 4000 / 5 // 약 800ms (4초를 5단계로)
      setTimeout(updateProgress, timePerUpdate + Math.random() * 200)
    }
    
    setTimeout(updateProgress, 400) // 0.4초 후 시작
    
  }, [logoUrl, router])

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        
        {/* 로고 - 페이지 입장시에만 새로 로딩 */}
        <div style={{ 
          width: '288px', 
          height: '288px', 
          margin: '0 auto 5px auto'
        }}>
          <img 
            src={logoUrl} // useMemo로 한 번만 생성된 URL 사용
            alt="Aimdot.dev Loading..." 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* 제목 - Discord 색상, 크기 15% 증가 */}
        <h1 style={{
          fontSize: '1.898rem', // 1.65rem → 1.898rem (15% 증가)
          fontWeight: 'bold',
          marginBottom: '12.8px', // 16px → 12.8px (20% 감소)
          background: 'linear-gradient(45deg, #5865F2, #7289DA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '2px'
        }}>
          AIMDOT.DEV
        </h1>
        
        {/* 부드럽게 전환되는 메시지 */}
        <p style={{
          fontSize: '0.84rem',
          color: '#E0E0E0',
          marginBottom: '13.44px', // 16.8px → 13.44px (20% 감소)
          height: '32px',
          transition: 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out',
          transform: 'translateY(0)',
          fontWeight: '400'
        }}>
          {loadingMessages[messageIndex]}
        </p>
        
        {/* 심플한 Discord 테마 프로그레스 바 - 로고와 같은 가로 크기 */}
        <div style={{
          width: '288px', // 350px → 288px (로고와 동일한 크기)
          height: '8px',
          backgroundColor: '#36393F',
          borderRadius: '4px',
          overflow: 'hidden',
          margin: '0 auto',
          position: 'relative'
        }}>
          {/* 메인 프로그레스 바 - 부드러운 Discord 블루 */}
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #5865F2, #7289DA)',
            borderRadius: '4px',
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)', // 매우 부드러운 전환
            position: 'relative'
          }}>
            {/* 부드러운 글로우 효과 */}
            <div style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              background: 'linear-gradient(90deg, #5865F2, #7289DA)',
              borderRadius: '6px',
              opacity: 0.3,
              filter: 'blur(4px)',
              zIndex: -1
            }} />
          </div>
        </div>
      </div>

      {/* 부드러운 페이드 애니메이션 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 메시지 전환 애니메이션 */
        p {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}