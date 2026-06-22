'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import PixelCharacter from '@/components/PixelCharacter'
import AvatarBuilder from '@/components/AvatarBuilder'
import { PixelAvatar, DEFAULT_AVATAR } from '@/types/pixel-avatar'

type Status = 'chatting' | 'listening' | 'nervous'

interface Space {
  id: string
  code: string
  name: string
  description?: string
  startTime: string
  endTime: string
  customFields: string
  entranceQuestion?: string
  questionRequired: boolean
  isExpired: boolean
  isDestroyed: boolean
  onlineCount: number
}

export default function JoinSpacePage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string

  const [space, setSpace] = useState<Space | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 表单状态
  const [nickname, setNickname] = useState('')
  const [status, setStatus] = useState<Status>('chatting')
  const [interests, setInterests] = useState('')
  const [moodColor, setMoodColor] = useState('')
  const [entranceAnswer, setEntranceAnswer] = useState('')
  const [avatarConfig, setAvatarConfig] = useState<PixelAvatar | null>(null)
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false)

  // 情绪色盘
  const moodColors = [
    { value: '#FF6B6B', label: '热烈' },
    { value: '#FFA500', label: '温暖' },
    { value: '#FFE66D', label: '明亮' },
    { value: '#4ECDC4', label: '平静' },
    { value: '#95E1D3', label: '轻松' },
    { value: '#A8E6CF', label: '舒适' },
    { value: '#C7CEEA', label: '柔和' },
    { value: '#DDA0DD', label: '愉悦' },
    { value: '#B8B8FF', label: '安静' },
    { value: '#6C5CE7', label: '深沉' },
  ]

  // 加载空间信息
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await fetch(`/api/spaces/${code}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '空间不存在')
        }

        if (data.space.isDestroyed) {
          throw new Error('这个空间已经结束了')
        }

        if (data.space.isExpired) {
          throw new Error('活动时间已过')
        }

        setSpace(data.space)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchSpace()
  }, [code])

  // 提交名片
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 验证
    const customFields = JSON.parse(space?.customFields || '[]') as string[]

    if (customFields.includes('nickname') && !nickname.trim()) {
      setError('请输入称呼')
      return
    }

    if (space?.questionRequired && !entranceAnswer.trim()) {
      setError('请回答入场问题')
      return
    }

    // 验证OOTD
    if (customFields.includes('ootd') && !avatarConfig) {
      setError('请拼一个你的8bit形象')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId: space!.id,
          nickname: nickname || '匿名',
          status,
          ootdImageUrl: avatarConfig ? JSON.stringify(avatarConfig) : null,
          entranceAnswer: entranceAnswer || null,
          interests: customFields.includes('interests')
            ? interests
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
            : [],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '提交失败')
      }

      // 跳转到空间内部
      router.push(`/space/${space!.code}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    )
  }

  if (error && !space) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">无法进入</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block py-3 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const customFields = JSON.parse(space?.customFields || '[]') as string[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* 空间信息 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{space?.name}</h1>
          {space?.description && (
            <p className="text-slate-500">{space.description}</p>
          )}
        </div>

        {/* 入场表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-800">填写你的名片</h2>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* 称呼 */}
          {customFields.includes('nickname') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                称呼 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="你希望别人怎么称呼你"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* 此刻状态 */}
          {customFields.includes('status') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                此刻状态 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'chatting', emoji: '🟢', label: '想聊' },
                  { value: 'listening', emoji: '🔵', label: '先听听' },
                  { value: 'nervous', emoji: '🟣', label: '有点紧张' },
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value as Status)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      status === option.value
                        ? 'bg-slate-50 border-slate-800 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-sm font-medium text-slate-700">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 兴趣爱好 */}
          {customFields.includes('interests') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                兴趣爱好
              </label>
              <input
                type="text"
                value={interests}
                onChange={e => setInterests(e.target.value)}
                placeholder="用逗号分隔，最多5个（如：阅读, 咖啡, 徒步）"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* 今日心情 */}
          {customFields.includes('mood') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                今日心情
              </label>
              <div className="flex gap-2 flex-wrap">
                {moodColors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setMoodColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      moodColor === color.value
                        ? 'border-slate-800 scale-110'
                        : 'border-slate-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 入场问题 */}
          {customFields.includes('question') && space?.entranceQuestion && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {space.questionRequired ? '入场问题 *' : '入场问题（选填）'}
              </label>
              <div className="p-4 bg-slate-50 rounded-lg mb-3">
                <p className="text-slate-700">{space.entranceQuestion}</p>
              </div>
              <textarea
                value={entranceAnswer}
                onChange={e => setEntranceAnswer(e.target.value)}
                placeholder="写下你的回答..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors resize-none"
              />
            </div>
          )}

          {/* OOTD */}
          {customFields.includes('ootd') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                OOTD（8bit小人）
              </label>
              <div className="space-y-3">
                {avatarConfig ? (
                  <div className="relative inline-block">
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <PixelCharacter avatar={avatarConfig} size="medium" showName={true} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarBuilder(true)}
                      className="mt-2 w-full py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      ✏️ 重新拼装
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAvatarBuilder(true)}
                    className="w-full py-8 border-2 border-dashed border-slate-200 rounded-lg hover:border-slate-400 transition-colors"
                  >
                    <div className="text-3xl mb-2">🎮</div>
                    <div className="text-sm font-medium text-slate-700">拼一个今晚的你</div>
                    <div className="text-xs text-slate-400 mt-1">点击创建你的8bit形象</div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 py-3 text-center border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              返回
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '进入空间'}
            </button>
          </div>
        </form>
      </div>

      {/* 像素小人组装器 */}
      {showAvatarBuilder && (
        <AvatarBuilder
          initialAvatar={avatarConfig || undefined}
          onComplete={(avatar) => {
            setAvatarConfig(avatar)
            setShowAvatarBuilder(false)
          }}
          onClose={() => setShowAvatarBuilder(false)}
        />
      )}
    </div>
  )
}
