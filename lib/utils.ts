import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스명을 효율적으로 병합하는 유틸리티 함수
 * @param inputs - 병합할 클래스명들
 * @returns 병합된 클래스명 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param date - 포맷팅할 날짜
 * @param options - Intl.DateTimeFormat 옵션
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('ko-KR', options).format(new Date(date))
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 * @param text - 자를 텍스트
 * @param length - 최대 길이
 * @returns 잘린 텍스트
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * 디스코드 사용자 아바타 URL 생성
 * @param userId - 사용자 ID
 * @param avatar - 아바타 해시
 * @param size - 이미지 크기 (기본값: 256)
 * @returns 아바타 URL
 */
export function getDiscordAvatarUrl(
  userId: string,
  avatar: string | null,
  size: number = 256
): string {
  if (!avatar) {
    // 기본 아바타 사용
    const defaultAvatarIndex = parseInt(userId) % 5
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
  }
  
  const extension = avatar.startsWith('a_') ? 'gif' : 'png'
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${extension}?size=${size}`
}

/**
 * 상대 시간 계산 (예: "2시간 전", "3일 후")
 * @param date - 기준 날짜
 * @param baseDate - 비교할 기준 날짜 (기본값: 현재 시간)
 * @returns 상대 시간 문자열
 */
export function getRelativeTime(date: Date, baseDate: Date = new Date()): string {
  const diffInSeconds = Math.floor((date.getTime() - baseDate.getTime()) / 1000)
  const absDiff = Math.abs(diffInSeconds)
  const isFuture = diffInSeconds > 0

  const intervals = [
    { label: '년', seconds: 31536000 },
    { label: '개월', seconds: 2592000 },
    { label: '일', seconds: 86400 },
    { label: '시간', seconds: 3600 },
    { label: '분', seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(absDiff / interval.seconds)
    if (count >= 1) {
      return isFuture ? `${count}${interval.label} 후` : `${count}${interval.label} 전`
    }
  }

  return '방금 전'
}

/**
 * 파일 크기를 인간이 읽기 쉬운 형태로 변환
 * @param bytes - 바이트 수
 * @returns 포맷팅된 파일 크기 (예: "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 랜덤 ID 생성 (영숫자 조합)
 * @param length - 생성할 ID 길이 (기본값: 8)
 * @returns 랜덤 ID 문자열
 */
export function generateRandomId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 객체의 빈 값들을 필터링
 * @param obj - 필터링할 객체
 * @returns 빈 값이 제거된 객체
 */
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '' && 
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === 'object' && Object.keys(value).length === 0)) {
      result[key as keyof T] = value
    }
  }
  
  return result
}

/**
 * 디바운스 함수
 * @param func - 실행할 함수
 * @param wait - 대기 시간 (밀리초)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 스로틀 함수
 * @param func - 실행할 함수
 * @param limit - 제한 시간 (밀리초)
 * @returns 스로틀된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}