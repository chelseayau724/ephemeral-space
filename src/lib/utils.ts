import { v4 as uuidv4 } from 'uuid'

/**
 * 生成四位随机数字暗号
 */
export function generateSpaceCode(): string {
  // 生成 1000-9999 的随机数
  return Math.floor(1000 + Math.random() * 9000).toString()
}

/**
 * 格式化时间显示
 */
export function formatTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

/**
 * 格式化日期显示
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

/**
 * 计算剩余时间
 */
export function getRemainingTime(endTime: Date | string): {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
} {
  const end = new Date(endTime)
  const now = new Date()
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    isExpired: false,
  }
}

/**
 * 生成唯一ID
 */
export { uuidv4 as generateId }
