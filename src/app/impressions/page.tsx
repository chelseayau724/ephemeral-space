'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import PixelCharacter from '@/components/PixelCharacter'
import { PixelAvatar } from '@/types/pixel-avatar'

interface Impression {
  id: string
  spaceCode: string
  spaceName: string
  participantNickname: string
  ootdImageUrl?: string
  avatarConfig?: PixelAvatar
  visitedAt: string
}

export default function ImpressionsPage() {
  const [impressions, setImpressions] = useState<Impression[]>([])
  const [loading, setLoading] = useState(true)

  // 获取所有印记
  const fetchImpressions = async () => {
    try {
      // 从 localStorage 获取所有 participantId
      const participantIds = Object.keys(localStorage)
        .filter(key => key.startsWith('participant-'))
        .map(key => localStorage.getItem(key))

      if (participantIds.length === 0) {
        setImpressions([])
        return
      }

      // 获取所有印记
      const res = await fetch(
        `/api/impressions?participantId=${participantIds[0]}`
      )
      const data = await res.json()

      if (res.ok) {
        setImpressions(data.impressions || [])
      }
    } catch (err) {
      console.error('加载印记失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImpressions()
  }, [])

  // 删除印记
  const deleteImpression = async (id: string) => {
    if (!confirm('确定要删除这条印记吗？')) return

    try {
      const res = await fetch(`/api/impressions/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setImpressions(prev => prev.filter(i => i.id !== id))
      }
    } catch (err) {
      alert('删除失败')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 标题 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4"
          >
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">你看过的印记</h1>
          <p className="text-slate-500">
            每一次相遇，都是一次独特的在场
          </p>
        </div>

        {/* 印记列表 */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">加载中...</div>
        ) : impressions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">👣</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">还没有印记</h2>
            <p className="text-slate-500 mb-6">
              当你进入一个空间并离开后，这里会留下你的印记
            </p>
            <Link
              href="/"
              className="inline-block py-3 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              去探索空间
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {impressions.map(impression => (
              <div
                key={impression.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* OOTD - 8bit 像素小人 */}
                  {impression.avatarConfig ? (
                    <div className="flex-shrink-0 bg-slate-50 rounded-lg p-3" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PixelCharacter avatar={impression.avatarConfig} size="small" showName={true} />
                    </div>
                  ) : impression.ootdImageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={impression.ootdImageUrl}
                        alt="OOTD"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {impression.participantNickname}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {impression.spaceName}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteImpression(impression.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="删除"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>📅 {format(new Date(impression.visitedAt), 'MM月dd日 HH:mm', { locale: zhCN })}</span>
                      <span>🔑 暗号: {impression.spaceCode}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        {impressions.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-500">
            共 {impressions.length} 条印记
          </div>
        )}
      </div>
    </div>
  )
}
