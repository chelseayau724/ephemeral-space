'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import PixelCharacter from '@/components/PixelCharacter'
import { PixelAvatar, loadAvatarWardrobe, deleteAvatarFromWardrobe } from '@/types/pixel-avatar'

export default function WardrobePage() {
  const [wardrobe, setWardrobe] = useState<PixelAvatar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const avatars = loadAvatarWardrobe()
    setWardrobe(avatars)
    setLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这个小人吗？')) return
    const newWardrobe = deleteAvatarFromWardrobe(id)
    setWardrobe(newWardrobe)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">加载中...</div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">我的小人衣柜</h1>
          <p className="text-slate-500">
            保存你的像素形象，在不同空间中复用
          </p>
        </div>

        {/* 衣柜统计 */}
        <div className="mb-6 text-sm text-slate-500">
          已保存 {wardrobe.length} / 12 个形象
        </div>

        {/* 形象列表 */}
        {wardrobe.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">还没有小人</h2>
            <p className="text-slate-500 mb-6">
              进入一个空间并拼好你的8bit形象后，它会自动保存在这里
            </p>
            <Link
              href="/"
              className="inline-block py-3 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              去创建小人
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wardrobe.map(avatar => (
              <div
                key={avatar.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow relative group"
              >
                {/* 删除按钮 */}
                <button
                  onClick={() => handleDelete(avatar.id!)}
                  className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="删除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* 像素小人 */}
                <div className="bg-slate-50 rounded-lg p-4 mb-3 flex items-center justify-center" style={{ minHeight: '140px' }}>
                  <PixelCharacter avatar={avatar} size="medium" showName={false} />
                </div>

                {/* 名称 */}
                <div className="text-sm font-semibold text-slate-800 text-center mb-1">
                  {avatar.name}
                </div>

                {/* 配色标签 */}
                <div className="flex gap-1 justify-center">
                  {avatar.colorScheme === 'all-black' && <div className="w-4 h-4 rounded-full bg-slate-800" />}
                  {avatar.colorScheme === 'earth' && <div className="w-4 h-4 rounded-full bg-amber-700" />}
                  {avatar.colorScheme === 'blue' && <div className="w-4 h-4 rounded-full bg-blue-500" />}
                  {avatar.colorScheme === 'red-accent' && <div className="w-4 h-4 rounded-full bg-red-500" />}
                  {avatar.colorScheme === 'green' && <div className="w-4 h-4 rounded-full bg-green-600" />}
                  {avatar.colorScheme === 'gray-white' && <div className="w-4 h-4 rounded-full bg-gray-400" />}
                  {avatar.colorScheme === 'yellow' && <div className="w-4 h-4 rounded-full bg-yellow-500" />}
                  {avatar.colorScheme === 'pink-purple' && <div className="w-4 h-4 rounded-full bg-pink-500" />}
                </div>

                {/* 创建时间 */}
                {avatar.createdAt && (
                  <div className="text-xs text-slate-400 text-center mt-2">
                    {format(new Date(avatar.createdAt), 'MM-dd HH:mm')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 提示 */}
        {wardrobe.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 提示：当衣柜满了（12个）时，保存新小人会自动替换最旧的一个
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
