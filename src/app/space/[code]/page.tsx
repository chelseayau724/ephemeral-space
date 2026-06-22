'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { getRemainingTime } from '@/lib/utils'
import PixelCharacter from '@/components/PixelCharacter'
import AvatarBuilder from '@/components/AvatarBuilder'
import { PixelAvatar } from '@/types/pixel-avatar'

interface Participant {
  id: string
  nickname: string
  status: string
  ootdImageUrl?: string
  avatarConfig?: PixelAvatar
  entranceAnswer?: string
  joinedAt: string
  tags: string[]
}

interface Space {
  id: string
  name: string
  endTime: string
  expiresAt: string
  entranceQuestion?: string
}

interface StatusCount {
  chatting: number
  listening: number
  nervous: number
}

const STATUS_CONFIG = {
  chatting: { emoji: '🟢', label: '想聊', color: 'bg-green-500' },
  listening: { emoji: '🔵', label: '先听听', color: 'bg-blue-500' },
  nervous: { emoji: '🟣', label: '有点紧张', color: 'bg-purple-500' },
}

export default function SpacePage() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string

  const [space, setSpace] = useState<Space | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [statusCount, setStatusCount] = useState<StatusCount>({
    chatting: 0,
    listening: 0,
    nervous: 0,
  })
  const [currentParticipantId, setCurrentParticipantId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [spaceEnded, setSpaceEnded] = useState(false)

  // 当前参与者的状态 - 添加防御性检查
  const currentParticipant = participants?.find(p => p.id === currentParticipantId)

  // 加载数据
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/spaces/${code}/participants`)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 410 || data.space?.isDestroyed) {
          setSpaceEnded(true)
          return
        }
        throw new Error(data.error || '加载失败')
      }

      setSpace(data.space)
      setParticipants(data.participants || [])
      setStatusCount(data.statusCount || { chatting: 0, listening: 0, nervous: 0 })

      // 从 localStorage 获取当前参与者ID
      const savedId = localStorage.getItem(`participant-${code}`)
      if (savedId && data.participants?.some((p: Participant) => p.id === savedId)) {
        setCurrentParticipantId(savedId)
      }
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      setLoading(false)
    }
  }, [code])

  // 初始加载和定时刷新
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // 每5秒刷新一次
    return () => clearInterval(interval)
  }, [fetchData])

  // 倒计时更新
  const [remaining, setRemaining] = useState(getRemainingTime(space?.endTime || new Date()))

  useEffect(() => {
    if (!space) return
    const timer = setInterval(() => {
      const time = getRemainingTime(space.endTime)
      setRemaining(time)
      if (time.isExpired && !spaceEnded) {
        setSpaceEnded(true)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [space, spaceEnded])

  // 保存当前参与者ID
  useEffect(() => {
    if (currentParticipantId) {
      localStorage.setItem(`participant-${code}`, currentParticipantId)
    }
  }, [currentParticipantId, code])

  // 离开空间
  const handleLeave = async () => {
    if (!currentParticipantId) {
      router.push('/')
      return
    }

    if (!confirm('离开后，你的名片将从这个空间消失。确定？')) {
      return
    }

    try {
      // 获取当前参与者信息
      const currentParticipant = participants?.find(p => p.id === currentParticipantId)

      // 离开空间
      await fetch(`/api/spaces/${code}/participants/${currentParticipantId}`, {
        method: 'POST',
      })

      // 创建印记
      if (currentParticipant && space) {
        try {
          await fetch('/api/impressions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              participantId: currentParticipantId,
              spaceCode: code,
              spaceName: space.name,
              participantNickname: currentParticipant.nickname,
              ootdImageUrl: currentParticipant.ootdImageUrl,
            }),
          })
        } catch (err) {
          console.error('创建印记失败:', err)
          // 不影响主流程
        }
      }

      localStorage.removeItem(`participant-${code}`)
      router.push('/')
    } catch (err) {
      alert('离开失败，请重试')
    }
  }

  // 空间已结束
  if (spaceEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-5xl mb-4">🌙</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">空间已结束</h2>
            <p className="text-slate-600 mb-6">
              这个空间的时间已经结束了，感谢你的参与。
            </p>
            <button
              onClick={() => router.push('/')}
              className="py-3 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 加载中
  if (loading || !space) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    )
  }

  const total = Object.values(statusCount).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* 顶部栏 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">{space.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
              <span>⏱ 剩余 {remaining.hours}时{remaining.minutes}分</span>
              <span>👥 {total} 人在线</span>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            离开空间
          </button>
        </div>
      </header>

      {/* 场域状态条 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-slate-600">场域状态</span>
          </div>
          <div className="flex gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <div
                key={key}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  statusCount[key as keyof StatusCount] > 0
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-dashed border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{config.emoji}</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {statusCount[key as keyof StatusCount]}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{config.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 主区域 - 名片墙 */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {participants.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">👋</div>
              <p className="text-slate-500">还没有人加入</p>
              <p className="text-sm text-slate-400 mt-2">分享暗号 {code} 邀请朋友加入</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {participants.map(participant => (
                <div
                  key={participant.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
                >
                  {/* OOTD - 8bit 像素小人 */}
                  {participant.avatarConfig ? (
                    <div className="mb-3 rounded-lg overflow-hidden bg-slate-50 p-4 flex items-center justify-center" style={{ minHeight: '128px' }}>
                      <PixelCharacter avatar={participant.avatarConfig} size="medium" showName={true} />
                    </div>
                  ) : participant.ootdImageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={participant.ootdImageUrl}
                        alt="OOTD"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  {/* 称呼 + 状态 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {STATUS_CONFIG[participant.status as keyof typeof STATUS_CONFIG]?.emoji}
                    </span>
                    <h3 className="font-semibold text-slate-800">{participant.nickname}</h3>
                  </div>

                  {/* 入场问题回答 */}
                  {participant.entranceAnswer && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {participant.entranceAnswer}
                      </p>
                    </div>
                  )}

                  {/* 标签 */}
                  {participant.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {participant.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {participant.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-slate-400">
                          +{participant.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 底部栏 - 我的名片 */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentParticipant?.avatarConfig ? (
                <div className="bg-slate-50 rounded-lg p-2" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PixelCharacter avatar={currentParticipant.avatarConfig} size="small" showName={false} />
                </div>
              ) : currentParticipant?.ootdImageUrl ? (
                <img
                  src={currentParticipant.ootdImageUrl}
                  alt="OOTD"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : null}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">
                    {currentParticipant?.nickname}
                  </span>
                  <span className="text-lg">
                    {STATUS_CONFIG[currentParticipant?.status as keyof typeof STATUS_CONFIG]?.emoji}
                  </span>
                </div>
                {currentParticipant?.avatarConfig && (
                  <div className="text-xs text-slate-500 mt-1">
                    {currentParticipant.avatarConfig.name}
                  </div>
                )}
                {currentParticipant?.tags && currentParticipant.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {currentParticipant.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              修改名片
            </button>
          </div>
        </div>
      </footer>

      {/* 编辑名片模态框 */}
      {showEditModal && (
        <EditModal
          code={code}
          participant={currentParticipant}
          space={space}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            fetchData()
            setShowEditModal(false)
          }}
        />
      )}
    </div>
  )
}

// 编辑名片模态框组件
interface EditModalProps {
  code: string
  participant: Participant | undefined
  space: Space
  onClose: () => void
  onUpdate: () => void
}

function EditModal({ code, participant, space, onClose, onUpdate }: EditModalProps) {
  const [status, setStatus] = useState(participant?.status || 'chatting')
  const [nickname, setNickname] = useState(participant?.nickname || '')
  const [avatarConfig, setAvatarConfig] = useState<PixelAvatar | null>(
    participant?.avatarConfig || null
  )
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!participant) return

    setSaving(true)
    try {
      await fetch(`/api/spaces/${code}/participants/${participant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          nickname,
          ootdImageUrl: avatarConfig ? JSON.stringify(avatarConfig) : null,
        }),
      })
      onUpdate()
    } catch (err) {
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">修改名片</h2>

        <div className="space-y-4">
          {/* 称呼 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">称呼</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">此刻状态</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatus(key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    status === key
                      ? 'bg-slate-50 border-slate-800'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xl mb-1">{config.emoji}</div>
                  <div className="text-xs text-slate-600">{config.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* OOTD - 8bit 像素小人 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">OOTD（8bit小人）</label>
            {avatarConfig ? (
              <div className="inline-block">
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
                <div className="text-sm font-medium text-slate-700">拼一个8bit形象</div>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
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
