"use client"

import { useState, useEffect } from 'react'

/**
 * 초기 로딩 상태를 관리하는 Hook
 * 매 방문 시마다 로딩 화면을 보여줍니다.
 */
export function useInitialLoading() {
  const [showLoading, setShowLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // 클라이언트 사이드 렌더링 확인
    setIsClient(true)
    
    // 개발 환경에서 디버그 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 useInitialLoading: 로딩 시작!')
      console.log('✅ 로딩 화면이 표시됩니다')
    }

    // 매번 로딩 화면 표시 (sessionStorage 체크 제거)
    setShowLoading(true)
    setIsLoading(true)
    
  }, [])

  const handleLoadingComplete = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ 로딩 완료 - 메인 페이지로 전환')
    }
    setShowLoading(false)
    setIsLoading(false)
  }

  // 개발 모드에서 로딩 화면 강제 표시 함수
  const forceShowLoading = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 로딩 화면 강제 표시')
      setShowLoading(true)
      setIsLoading(true)
    }
  }

  // 로딩 상태 초기화 함수 (테스트용)
  const resetLoadingState = () => {
    console.log('🗑️ 페이지 새로고침')
    window.location.reload()
  }

  // 서버 사이드 렌더링 중에는 로딩 표시
  if (!isClient) {
    return {
      showLoading: true,
      isLoading: true,
      handleLoadingComplete: () => {},
      forceShowLoading: () => {},
      resetLoadingState: () => {},
    }
  }

  return {
    showLoading,
    isLoading,
    handleLoadingComplete,
    forceShowLoading,
    resetLoadingState,
  }
}