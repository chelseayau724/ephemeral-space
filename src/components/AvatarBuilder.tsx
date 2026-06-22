'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PixelCharacter from '@/components/PixelCharacter'
import {
  PixelAvatar,
  DEFAULT_AVATAR,
  BODY_TYPES,
  HAIR_STYLES,
  TOPS,
  BOTTOMS,
  SHOES,
  ACCESSORIES,
  COLOR_SCHEMES,
  saveAvatarToWardrobe,
  loadAvatarWardrobe,
} from '@/types/pixel-avatar'

type TabType = 'body' | 'hair' | 'top' | 'bottom' | 'shoes' | 'accessories' | 'colors'

interface AvatarBuilderProps {
  initialAvatar?: PixelAvatar | null
  onComplete: (avatar: PixelAvatar) => void
  onClose: () => void
}

export default function AvatarBuilder({ initialAvatar, onComplete, onClose }: AvatarBuilderProps) {
  const router = useRouter()
  const [avatar, setAvatar] = useState<PixelAvatar>(initialAvatar || DEFAULT_AVATAR)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(avatar.name)
  const [activeTab, setActiveTab] = useState<TabType>('body')

  // 自动生成名称
  const generateName = () => {
    const top = TOPS.find(t => t.id === avatar.top)?.label || '小人'
    return top.replace('（', '').replace('）', '')
  }

  useEffect(() => {
    if (!initialAvatar) {
      setAvatar(prev => ({ ...prev, name: generateName() }))
    }
  }, [avatar.top, avatar.bottom, avatar.shoes])

  // 更新配置
  const updateAvatar = (updates: Partial<PixelAvatar>) => {
    setAvatar(prev => ({ ...prev, ...updates }))
  }

  // 切换配饰
  const toggleAccessory = (accessoryId: string) => {
    const current = avatar.accessories
    if (current.includes(accessoryId as any)) {
      updateAvatar({ accessories: current.filter(a => a !== accessoryId) })
    } else if (current.length < 2) {
      updateAvatar({ accessories: [...current, accessoryId as any] })
    }
  }

  // 应用配色方案
  const applyColorScheme = (schemeId: string) => {
    updateAvatar({ colorScheme: schemeId as any })
  }

  // 保存并完成
  const handleComplete = () => {
    const finalAvatar = { ...avatar, name: tempName || generateName() }
    saveAvatarToWardrobe(finalAvatar)
    onComplete(finalAvatar)
  }

  // 保存到衣柜
  const handleSaveToWardrobe = () => {
    const finalAvatar = { ...avatar, name: tempName || generateName() }
    saveAvatarToWardrobe(finalAvatar)
    alert('已保存到我的小人衣柜！')
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 顶部栏 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={onClose}
          style={{
            color: '#888',
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ✕ 关闭
        </button>
        <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
          拼一个今晚的你
        </div>
        <button
          onClick={handleSaveToWardrobe}
          style={{
            color: '#4ECDC4',
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          💾 保存
        </button>
      </div>

      {/* 主区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* 预览区域 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        }}>
          {/* 像素小人 */}
          <div style={{ marginBottom: '20px' }}>
            <PixelCharacter avatar={avatar} size="large" showName={false} />
          </div>

          {/* 名称编辑 */}
          <div style={{
            padding: '8px 16px',
            background: '#222',
            borderRadius: '8px',
            color: '#888',
            fontSize: '14px',
            cursor: 'pointer',
            border: '1px solid #333',
          }}
            onClick={() => {
              setEditingName(true)
              setTempName(avatar.name)
            }}
          >
            {editingName ? (
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => {
                  setEditingName(false)
                  updateAvatar({ name: tempName })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditingName(false)
                    updateAvatar({ name: tempName })
                  }
                }}
                autoFocus
                style={{
                  background: '#333',
                  border: '1px solid #4ECDC4',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '120px',
                  textAlign: 'center',
                }}
              />
            ) : (
              `你命名为："${avatar.name}"`
            )}
          </div>
        </div>

        {/* 选项卡和选择区 */}
        <div style={{
          background: '#111',
          borderTop: '1px solid #333',
          maxHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 选项卡导航 */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 16px',
            overflowX: 'auto',
            borderBottom: '1px solid #222',
          }}>
            {[
              { id: 'body', label: '体型' },
              { id: 'hair', label: '发型' },
              { id: 'top', label: '上衣' },
              { id: 'bottom', label: '下装' },
              { id: 'shoes', label: '鞋子' },
              { id: 'accessories', label: '配饰' },
              { id: 'colors', label: '配色' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  padding: '8px 16px',
                  background: activeTab === tab.id ? '#4ECDC4' : '#222',
                  color: activeTab === tab.id ? '#000' : '#888',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 选项列表 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
          }}>
            {/* 体型选项 */}
            {activeTab === 'body' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}>
                {Object.entries(BODY_TYPES).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => updateAvatar({ bodyType: key as any })}
                    style={{
                      padding: '16px',
                      background: avatar.bodyType === key ? '#333' : '#1a1a1a',
                      border: avatar.bodyType === key ? '2px solid #4ECDC4' : '2px solid #222',
                      borderRadius: '12px',
                      color: '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                      {config.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {key === 'tall' && '高个子体型'}
                      {key === 'medium' && '标准体型'}
                      {key === 'round' && '圆润体型'}
                      {key === 'small' && '娇小体型'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 发型选项 */}
            {activeTab === 'hair' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
              }}>
                {HAIR_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateAvatar({ hairStyle: style.id as any })}
                    style={{
                      padding: '12px 8px',
                      background: avatar.hairStyle === style.id ? '#333' : '#1a1a1a',
                      border: avatar.hairStyle === style.id ? '2px solid #4ECDC4' : '2px solid #222',
                      borderRadius: '12px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            )}

            {/* 上衣选项 */}
            {activeTab === 'top' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
              }}>
                {TOPS.map(top => (
                  <button
                    key={top.id}
                    onClick={() => updateAvatar({ top: top.id as any })}
                    style={{
                      padding: '12px 8px',
                      background: avatar.top === top.id ? '#333' : '#1a1a1a',
                      border: avatar.top === top.id ? '2px solid #4ECDC4' : '2px solid #222',
                      borderRadius: '12px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {top.label}
                  </button>
                ))}
              </div>
            )}

            {/* 下装选项 */}
            {activeTab === 'bottom' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}>
                {BOTTOMS.map(bottom => (
                  <button
                    key={bottom.id}
                    onClick={() => updateAvatar({ bottom: bottom.id as any })}
                    style={{
                      padding: '12px 8px',
                      background: avatar.bottom === bottom.id ? '#333' : '#1a1a1a',
                      border: avatar.bottom === bottom.id ? '2px solid #4ECDC4' : '2px solid #222',
                      borderRadius: '12px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {bottom.label}
                  </button>
                ))}
              </div>
            )}

            {/* 鞋子选项 */}
            {activeTab === 'shoes' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}>
                {SHOES.map(shoe => (
                  <button
                    key={shoe.id}
                    onClick={() => updateAvatar({ shoes: shoe.id as any })}
                    style={{
                      padding: '12px 8px',
                      background: avatar.shoes === shoe.id ? '#333' : '#1a1a1a',
                      border: avatar.shoes === shoe.id ? '2px solid #4ECDC4' : '2px solid #222',
                      borderRadius: '12px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {shoe.label}
                  </button>
                ))}
              </div>
            )}

            {/* 配饰选项 */}
            {activeTab === 'accessories' && (
              <div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '12px' }}>
                  已选 {avatar.accessories.length}/2
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                }}>
                  {ACCESSORIES.map(acc => {
                    const isSelected = avatar.accessories.includes(acc.id as any)
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        disabled={!isSelected && avatar.accessories.length >= 2}
                        style={{
                          padding: '12px 8px',
                          background: isSelected ? '#333' : '#1a1a1a',
                          border: isSelected ? '2px solid #4ECDC4' : '2px solid #222',
                          borderRadius: '12px',
                          color: isSelected ? '#4ECDC4' : avatar.accessories.length >= 2 && !isSelected ? '#444' : '#fff',
                          cursor: avatar.accessories.length >= 2 && !isSelected ? 'not-allowed' : 'pointer',
                          fontSize: '11px',
                          opacity: avatar.accessories.length >= 2 && !isSelected ? 0.5 : 1,
                        }}
                      >
                        {acc.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 配色选项 */}
            {activeTab === 'colors' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}>
                {COLOR_SCHEMES.map(scheme => {
                  const isSelected = avatar.colorScheme === scheme.id
                  return (
                    <button
                      key={scheme.id}
                      onClick={() => applyColorScheme(scheme.id)}
                      style={{
                        padding: '16px',
                        background: '#1a1a1a',
                        border: isSelected ? '2px solid #4ECDC4' : '2px solid #222',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isSelected ? '#4ECDC4' : '#fff',
                        marginBottom: '8px',
                      }}>
                        {scheme.label}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                      }}>
                        {scheme.colors.map((color, idx) => (
                          <div
                            key={idx}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: color,
                              border: '1px solid #333',
                            }}
                          />
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* 完成按钮 */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #333',
        }}>
          <button
            onClick={handleComplete}
            style={{
              width: '100%',
              padding: '16px',
              background: '#4ECDC4',
              color: '#000',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            完成 ✨
          </button>
        </div>
      </div>
    </div>
  )
}
