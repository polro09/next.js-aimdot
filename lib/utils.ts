import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 클래스명 병합 유틸리티
 * @param inputs - 병합할 클래스명들
 * @returns 병합된 클래스명 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜 포맷팅 유틸리티
 * @param date - 포맷팅할 날짜
 * @param format - 포맷 형식 (기본값: 'YYYY-MM-DD HH:mm:ss')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 숫자에 천 단위 구분자 추가
 * @param num - 포맷팅할 숫자
 * @returns 포맷팅된 숫자 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}

/**
 * 디스코드 아바타 URL 생성
 * @param userId - 사용자 ID
 * @param avatar - 아바타 해시
 * @param size - 아바타 크기 (기본값: 128)
 * @returns 아바타 URL
 */
export function getDiscordAvatarUrl(userId: string, avatar?: string | null, size: number = 128): string {
  if (!avatar) {
    // 기본 아바타 URL
    const defaultAvatarNumber = parseInt(userId) % 5
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png?size=${size}`
  }
  
  // 애니메이션 아바타 확인
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
 * 딥 클론 유틸리티
 * @param obj - 복사할 객체
 * @returns 복사된 객체
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (obj instanceof Object) {
    const clonedObj: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * 디바운스 함수
 * @param func - 디바운스할 함수
 * @param wait - 대기 시간 (ms)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 쓰로틀 함수
 * @param func - 쓰로틀할 함수
 * @param limit - 제한 시간 (ms)
 * @returns 쓰로틀된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 배열을 청크로 분할
 * @param array - 분할할 배열
 * @param size - 청크 크기
 * @returns 분할된 배열
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunked: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size))
  }
  return chunked
}

/**
 * URL 쿼리 파라미터 파싱
 * @param url - 파싱할 URL
 * @returns 쿼리 파라미터 객체
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URL(url).searchParams
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

/**
 * 쿼리 파라미터를 URL 문자열로 변환
 * @param params - 쿼리 파라미터 객체
 * @returns URL 쿼리 문자열
 */
export function stringifyQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

/**
 * 이메일 유효성 검사
 * @param email - 검사할 이메일
 * @returns 유효한 이메일인지 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 전화번호 포맷팅
 * @param phoneNumber - 포맷팅할 전화번호
 * @returns 포맷팅된 전화번호
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  
  return phoneNumber
}

/**
 * 안전한 JSON 파싱
 * @param json - 파싱할 JSON 문자열
 * @param fallback - 파싱 실패 시 반환할 기본값
 * @returns 파싱된 객체 또는 기본값
 */
export function safeJsonParse<T = any>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * 색상 밝기 계산
 * @param color - HEX 색상 코드
 * @returns 밝기 값 (0-255)
 */
export function getColorBrightness(color: string): number {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  return (r * 299 + g * 587 + b * 114) / 1000
}

/**
 * 밝은 색상인지 판단
 * @param color - HEX 색상 코드
 * @returns 밝은 색상인지 여부
 */
export function isLightColor(color: string): boolean {
  return getColorBrightness(color) > 128
}