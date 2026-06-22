'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code.trim()) {
      setError('请输入暗号')
      return
    }

    if (!/^\d{4}$/.test(code)) {
      setError('暗号必须是四位数字')
      return
    }

    // 跳转到进入空间页面
    router.push(`/join/${code}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-6 py-16">
        {/* Logo / 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">在场</h1>
          <p className="text-slate-500 leading-relaxed">
            一次性的社交空间
            <br />
            用暗号和真诚，开启连接
          </p>
        </div>

        {/* 输入暗号进入 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">输入暗号进入</h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="四位数字"
                maxLength={4}
                className="w-full px-4 py-4 text-center text-3xl font-mono tracking-widest rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              进入空间
            </button>
          </form>
        </div>

        {/* 分割线 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-sm text-slate-400">或</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* 创建空间 */}
        <Link
          href="/create-space"
          className="block w-full py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors text-center"
        >
          + 创建新空间
        </Link>

        {/* 个人印记 */}
        <div className="mt-8 text-center">
          <Link href="/impressions" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            查看你看过的印记 →
          </Link>
        </div>

        {/* 我的小人衣柜 */}
        <div className="mt-4 text-center">
          <Link href="/wardrobe" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            🎮 我的小人衣柜 →
          </Link>
        </div>
      </div>
    </div>
  )
}
