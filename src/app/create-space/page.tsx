'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

type CustomField = 'nickname' | 'status' | 'occupation' | 'interests' | 'mood' | 'question' | 'ootd'

const FIELD_LABELS: Record<CustomField, string> = {
  nickname: '称呼',
  status: '此刻状态',
  occupation: '职业',
  interests: '兴趣爱好',
  mood: '今日心情',
  question: '针对本次活动的问题',
  ootd: 'OOTD（8bit小人）：参与者可拼一个像素形象代表今晚的自己',
}

const DEFAULT_FIELDS: CustomField[] = ['nickname', 'status']
const OPTIONAL_FIELDS: CustomField[] = [
  'occupation',
  'interests',
  'mood',
  'question',
  'ootd',
]

export default function CreateSpacePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 表单状态
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [customFields, setCustomFields] = useState<CustomField[]>(DEFAULT_FIELDS)
  const [entranceQuestion, setEntranceQuestion] = useState('')
  const [questionRequired, setQuestionRequired] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [createdSpace, setCreatedSpace] = useState<{
    code: string
    name: string
    description?: string
    startTime: string
    endTime: string
  } | null>(null)

  // 切换可选字段
  const toggleField = (field: CustomField) => {
    if (field === 'nickname' || field === 'status') return // 默认字段不可取消
    setCustomFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    )
  }

  // 验证表单
  const validateStep = (currentStep: number): boolean => {
    setError('')

    if (currentStep === 1) {
      if (!name.trim()) {
        setError('请输入空间名称')
        return false
      }
      if (!startTime) {
        setError('请选择活动开始时间')
        return false
      }
      if (!endTime) {
        setError('请选择活动结束时间')
        return false
      }
      if (new Date(startTime) >= new Date(endTime)) {
        setError('结束时间必须晚于开始时间')
        return false
      }
    }

    if (currentStep === 3 && customFields.includes('question')) {
      if (!entranceQuestion.trim()) {
        setError('请输入入场问题')
        return false
      }
    }

    return true
  }

  // 下一步
  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(prev => prev + 1)
      }
    }
  }

  // 上一步
  const handleBack = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  // 创建空间
  const handleCreate = async () => {
    if (!validateStep(step)) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          startTime,
          endTime,
          customFields,
          entranceQuestion: customFields.includes('question') ? entranceQuestion : null,
          questionRequired,
          isArchived,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '创建失败')
      }

      setCreatedSpace(data.space)
      setStep(4) // 显示成功页面
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 返回首页
  const handleBackToHome = () => {
    router.push('/')
  }

  // 复制暗号
  const copyCode = () => {
    if (createdSpace?.code) {
      navigator.clipboard.writeText(createdSpace.code)
      alert('暗号已复制')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto p-6 py-12">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">创建你的空间</h1>
          <p className="text-slate-500">为一次独特的相遇做好准备</p>
        </div>

        {/* 进度指示 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === step
                  ? 'bg-slate-800'
                  : s < step
                  ? 'bg-slate-400'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Step 1: 基本信息 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">基本信息</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                空间名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例如：阿树的生日饭局"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                空间简介
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="一句话介绍这个空间的氛围..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  开始时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  结束时间 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              下一步
            </button>
          </div>
        )}

        {/* Step 2: 名片栏位配置 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">参与者名片</h2>
            <p className="text-sm text-slate-500">
              选择参与者需要填写的信息。灰色字段为必填，可自由添加可选字段。
            </p>

            {/* 默认字段 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-600">必填字段</h3>
              {DEFAULT_FIELDS.map(field => (
                <div
                  key={field}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-700">{FIELD_LABELS[field]}</span>
                </div>
              ))}
            </div>

            {/* 可选字段 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-600">可选字段</h3>
              {OPTIONAL_FIELDS.map(field => (
                <button
                  key={field}
                  onClick={() => toggleField(field)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    customFields.includes(field)
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      customFields.includes(field)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {customFields.includes(field) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className={customFields.includes(field) ? 'text-blue-700' : 'text-slate-600'}>
                    {FIELD_LABELS[field]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                上一步
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 入场问题与空间生命周期 */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">最后配置</h2>

            {/* 入场问题配置 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-600">入场问题</h3>

              {customFields.includes('question') ? (
                <>
                  <p className="text-sm text-slate-500">
                    设置一个问题，让参与者在进入空间时回答。
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      问题内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={entranceQuestion}
                      onChange={e => setEntranceQuestion(e.target.value)}
                      placeholder="例如：最近让你印象深刻的一本书是什么？"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="questionRequired"
                      checked={questionRequired}
                      onChange={e => setQuestionRequired(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300"
                    />
                    <label htmlFor="questionRequired" className="text-sm text-slate-700">
                      设为必答（参与者必须回答才能进入）
                    </label>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-lg">
                  <p className="text-slate-500 mb-3">未启用入场问题</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomFields(prev => [...prev, 'question'])
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + 添加入场问题
                  </button>
                </div>
              )}
            </div>

            {/* 空间生命周期配置 */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-600">空间生命周期</h3>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsArchived(false)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    !isArchived
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-800 mb-1">⏳ 到时自动消失</div>
                  <div className="text-sm text-slate-500">
                    活动结束后 24 小时自动销毁，不留存任何数据
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsArchived(true)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    isArchived
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-medium text-slate-800 mb-1">📥 保留为存档</div>
                  <div className="text-sm text-slate-500">
                    仅保留统计级数据（人数、场域状态曲线），不保存任何个人名片内容
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                上一步
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '创建中...' : '创建空间'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 成功页面 */}
        {step === 4 && createdSpace && (
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-800">空间已创建</h2>

            <div className="bg-slate-50 rounded-lg p-6 space-y-3">
              <div>
                <div className="text-sm text-slate-500 mb-1">空间名称</div>
                <div className="text-lg font-semibold text-slate-800">{createdSpace.name}</div>
              </div>
              {createdSpace.description && (
                <div>
                  <div className="text-sm text-slate-500 mb-1">简介</div>
                  <div className="text-slate-700">{createdSpace.description}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-slate-500 mb-1">时间</div>
                <div className="text-slate-700">
                  {format(new Date(createdSpace.startTime), 'MM月dd日 HH:mm', { locale: zhCN })} -{' '}
                  {format(new Date(createdSpace.endTime), 'HH:mm', { locale: zhCN })}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-2">四位暗号</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-4xl font-mono font-bold text-slate-800 tracking-widest">
                    {createdSpace.code}
                  </div>
                  <button
                    onClick={copyCode}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="复制"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                将这个暗号分享给参与者，他们输入后即可进入空间。
              </p>
            </div>

            <button
              onClick={handleBackToHome}
              className="w-full py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
