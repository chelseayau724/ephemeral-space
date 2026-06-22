export type Status = 'chatting' | 'listening' | 'nervous'

export const STATUS_CONFIG = {
  chatting: { label: '想聊', emoji: '🟢', color: 'green' },
  listening: { label: '先听听', emoji: '🔵', color: 'blue' },
  nervous: { label: '有点紧张', emoji: '🟣', color: 'purple' },
} as const

export type CustomField =
  | 'nickname'
  | 'status'
  | 'occupation'
  | 'interests'
  | 'mood'
  | 'question'
  | 'ootd'

export const DEFAULT_FIELDS: CustomField[] = ['nickname', 'status']
export const OPTIONAL_FIELDS: CustomField[] = [
  'occupation',
  'interests',
  'mood',
  'question',
  'ootd',
]
