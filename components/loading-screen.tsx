<<<<<<< HEAD
"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LoadingScreenProps {
  onComplete: () => void
  duration?: number // 로딩 지속 시간 (밀리초)
}

export default function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // 개발 모드에서 디버그 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 LoadingScreen: 로딩 화면 시작, 지속시간:', duration + 'ms')
    }

    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 LoadingScreen: 페이드아웃 시작')
      }
      
      // 페이드아웃 시작
      setFadeOut(true)
      
      // 페이드아웃 완료 후 로딩 화면 숨기기
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ LoadingScreen: 로딩 완료')
        }
        setIsVisible(false)
        onComplete()
      }, 500) // 페이드아웃 애니메이션 시간
    }, duration)

    return () => clearTimeout(timer)
  }, [onComplete, duration])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden ${fadeOut ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif'
      }}
    >
      <div className="text-center">
        <div className="mb-3 relative">
          <Image
            src="https://i.imgur.com/9MwyIGW.gif"
            alt="Aimdot.dev Logo"
            width={250}
            height={250}
            className="animate-bounce-subtle"
            priority
            unoptimized // GIF 애니메이션을 위해 최적화 비활성화
          />
        </div>
        
        <h1 className="text-2xl font-semibold uppercase tracking-wider mb-3 text-white">
          AIMDOT<span className="animate-pulse">...</span>
        </h1>
        
        <p className="text-base text-purple-400 font-light mt-5 opacity-80">
          Discord Bot Platform
        </p>
        
        <div className="w-[300px] h-1 bg-gray-800 rounded-sm mt-8 mx-auto overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-sm shadow-lg shadow-purple-500/50"
            style={{
              width: '0%',
              animation: `progressLoad ${duration}ms ease-in-out forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progressLoad {
          0% {
            width: 0%;
          }
          30% {
            width: 35%;
          }
          60% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }

        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .text-center img {
            width: 200px;
            height: 200px;
          }
          
          .text-center h1 {
            font-size: 1.25rem;
          }
          
          .text-center .w-\\[300px\\] {
            width: 250px;
          }
        }

        @media (max-width: 480px) {
          .text-center img {
            width: 150px;
            height: 150px;
          }
          
          .text-center h1 {
            font-size: 1.125rem;
          }
          
          .text-center .w-\\[300px\\] {
            width: 200px;
          }
        }
      `}</style>
    </div>
  )
=======
"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LoadingScreenProps {
  onComplete: () => void
  duration?: number // 로딩 지속 시간 (밀리초)
}

export default function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // 개발 모드에서 디버그 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 LoadingScreen: 로딩 화면 시작, 지속시간:', duration + 'ms')
    }

    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 LoadingScreen: 페이드아웃 시작')
      }
      
      // 페이드아웃 시작
      setFadeOut(true)
      
      // 페이드아웃 완료 후 로딩 화면 숨기기
      setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ LoadingScreen: 로딩 완료')
        }
        setIsVisible(false)
        onComplete()
      }, 500) // 페이드아웃 애니메이션 시간
    }, duration)

    return () => clearTimeout(timer)
  }, [onComplete, duration])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden ${fadeOut ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif'
      }}
    >
      <div className="text-center">
        <div className="mb-3 relative">
          <Image
            src="https://i.imgur.com/9MwyIGW.gif"
            alt="Aimdot.dev Logo"
            width={250}
            height={250}
            className="animate-bounce-subtle"
            priority
            unoptimized // GIF 애니메이션을 위해 최적화 비활성화
          />
        </div>
        
        <h1 className="text-2xl font-semibold uppercase tracking-wider mb-3 text-white">
          AIMDOT<span className="animate-pulse">...</span>
        </h1>
        
        <p className="text-base text-purple-400 font-light mt-5 opacity-80">
          Discord Bot Platform
        </p>
        
        <div className="w-[300px] h-1 bg-gray-800 rounded-sm mt-8 mx-auto overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-sm shadow-lg shadow-purple-500/50"
            style={{
              width: '0%',
              animation: `progressLoad ${duration}ms ease-in-out forwards`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes progressLoad {
          0% {
            width: 0%;
          }
          30% {
            width: 35%;
          }
          60% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }

        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .text-center img {
            width: 200px;
            height: 200px;
          }
          
          .text-center h1 {
            font-size: 1.25rem;
          }
          
          .text-center .w-\\[300px\\] {
            width: 250px;
          }
        }

        @media (max-width: 480px) {
          .text-center img {
            width: 150px;
            height: 150px;
          }
          
          .text-center h1 {
            font-size: 1.125rem;
          }
          
          .text-center .w-\\[300px\\] {
            width: 200px;
          }
        }
      `}</style>
    </div>
  )
>>>>>>> 3b599428ec14d20c82b0789575df317f455352b8
}