'use client'

import { PixelAvatar, COLOR_SCHEMES } from '@/types/pixel-avatar'

interface PixelCharacterProps {
  avatar: PixelAvatar
  size?: 'small' | 'medium' | 'large'
  showName?: boolean
}

export default function PixelCharacter({ avatar, size = 'medium', showName = true }: PixelCharacterProps) {
  const colorScheme = COLOR_SCHEMES.find(c => c.id === avatar.colorScheme) || COLOR_SCHEMES[0]
  const primaryColor = colorScheme.colors[0]
  const secondaryColor = colorScheme.colors[1]
  const accentColor = colorScheme.colors[2]

  // 根据体型调整大小
  const scaleMap = {
    small: 0.7,
    medium: 1.0,
    large: 1.5,
  }
  const scale = scaleMap[size]

  // 渲染像素小人 SVG
  return (
    <div style={{ display: 'inline-block', textAlign: 'center' }}>
      <svg
        width={Math.floor(64 * scale)}
        height={Math.floor(128 * scale)}
        viewBox="0 0 64 128"
        style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
      >
        {/* 身体轮廓 - 根据体型调整 */}
        <g fill={primaryColor}>
          {/* 头部 */}
          <rect x="24" y="4" width="16" height="16" />
          <rect x="22" y="6" width="4" height="12" />
          <rect x="38" y="6" width="4" height="12" />

          {/* 脖子 */}
          <rect x="28" y="20" width="8" height="4" />

          {/* 躯干 - 根据上衣类型调整 */}
          {avatar.top === 'dress' ? (
            // 连衣裙
            <>
              <rect x="20" y="24" width="24" height="32" />
              <rect x="16" y="56" width="32" height="8" />
            </>
          ) : (
            // 普通上衣
            <>
              <rect x="22" y="24" width="20" height="28" />
              {/* 袖子 */}
              {avatar.top === 'hoodie' || avatar.top === 'coat' ? (
                <>
                  <rect x="14" y="24" width="8" height="20" />
                  <rect x="42" y="24" width="8" height="20" />
                </>
              ) : avatar.top === 'blazer' ? (
                <>
                  <rect x="16" y="24" width="6" height="24" />
                  <rect x="42" y="24" width="6" height="24" />
                </>
              ) : (
                <>
                  <rect x="16" y="28" width="6" height="16" />
                  <rect x="42" y="28" width="6" height="16" />
                </>
              )}
            </>
          )}

          {/* 下装 - 根据体型调整 */}
          {avatar.bottom === 'skirt' ? (
            // 裙子
            <>
              <rect x="20" y="52" width="24" height="8" />
              <rect x="16" y="60" width="32" height="12" />
            </>
          ) : avatar.bottom === 'shorts' ? (
            // 短裤
            <>
              <rect x="22" y="52" width="20" height="12" />
              <rect x="16" y="64" width="8" height="4" />
              <rect x="40" y="64" width="8" height="4" />
            </>
          ) : (
            // 长裤/阔腿裤
            <>
              <rect x="22" y="52" width="8" height="32" />
              <rect x="34" y="52" width="8" height="32" />
              {avatar.bottom === 'wide-pants' && (
                <>
                  <rect x="18" y="76" width="8" height="8" />
                  <rect x="38" y="76" width="8" height="8" />
                </>
              )}
            </>
          )}

          {/* 鞋子 */}
          {avatar.shoes === 'boots' ? (
            <>
              <rect x="16" y="84" width="12" height="12" />
              <rect x="36" y="84" width="12" height="12" />
            </>
          ) : avatar.shoes === 'sandals' ? (
            <>
              <rect x="20" y="88" width="8" height="4" />
              <rect x="36" y="88" width="8" height="4" />
            </>
          ) : (
            <>
              <rect x="18" y="86" width="12" height="6" />
              <rect x="34" y="86" width="12" height="6" />
            </>
          )}
        </g>

        {/* 发型 */}
        <g fill={secondaryColor}>
          {avatar.hairStyle === 'bald' ? (
            // 光头 - 不渲染
            null
          ) : avatar.hairStyle === 'crew-cut' ? (
            // 寸头
            <rect x="24" y="2" width="16" height="6" />
          ) : avatar.hairStyle === 'short-straight' ? (
            // 短发（直）
            <>
              <rect x="22" y="2" width="20" height="8" />
              <rect x="20" y="4" width="4" height="6" />
              <rect x="40" y="4" width="4" height="6" />
            </>
          ) : avatar.hairStyle === 'short-curly' ? (
            // 短发（卷）
            <>
              <rect x="22" y="2" width="20" height="10" />
              <circle cx="20" cy="6" r="3" />
              <circle cx="44" cy="6" r="3" />
              <circle cx="24" cy="0" r="2" />
              <circle cx="40" cy="0" r="2" />
            </>
          ) : avatar.hairStyle === 'long-straight' ? (
            // 长发（直）
            <>
              <rect x="22" y="2" width="20" height="8" />
              <rect x="20" y="4" width="4" height="24" />
              <rect x="40" y="4" width="4" height="24" />
            </>
          ) : avatar.hairStyle === 'long-wavy' ? (
            // 长发（波浪）
            <>
              <rect x="22" y="2" width="20" height="8" />
              <rect x="18" y="8" width="4" height="20" />
              <rect x="42" y="8" width="4" height="20" />
              <rect x="16" y="16" width="4" height="8" />
              <rect x="44" y="16" width="4" height="8" />
            </>
          ) : avatar.hairStyle === 'bun' ? (
            // 丸子头
            <>
              <rect x="22" y="2" width="20" height="8" />
              <circle cx="32" cy="-2" r="6" />
            </>
          ) : avatar.hairStyle === 'ponytail' ? (
            // 马尾
            <>
              <rect x="22" y="2" width="20" height="8" />
              <rect x="42" y="6" width="8" height="4" />
              <rect x="46" y="10" width="4" height="16" />
            </>
          ) : null}
        </g>

        {/* 五官 - 仅在较大尺寸显示 */}
        {size === 'large' && (
          <g fill="#000">
            {/* 眼睛 */}
            <rect x="26" y="12" width="2" height="2" />
            <rect x="36" y="12" width="2" height="2" />
            {/* 嘴巴 */}
            <rect x="30" y="18" width="4" height="2" />
          </g>
        )}

        {/* 配饰 */}
        <g fill={accentColor}>
          {avatar.accessories.includes('glasses-round') && (
            // 圆框眼镜
            <>
              <rect x="20" y="10" width="10" height="8" fill="none" stroke={accentColor} strokeWidth="2" />
              <rect x="34" y="10" width="10" height="8" fill="none" stroke={accentColor} strokeWidth="2" />
              <rect x="30" y="14" width="4" height="2" />
            </>
          )}

          {avatar.accessories.includes('glasses-square') && (
            // 方框眼镜
            <>
              <rect x="20" y="10" width="12" height="10" fill="none" stroke={accentColor} strokeWidth="2" />
              <rect x="32" y="10" width="12" height="10" fill="none" stroke={accentColor} strokeWidth="2" />
              <rect x="32" y="14" width="4" height="2" />
            </>
          )}

          {avatar.accessories.includes('hat-baseball') && (
            // 棒球帽
            <>
              <rect x="20" y="0" width="24" height="6" />
              <rect x="16" y="2" width="32" height="4" />
              <rect x="16" y="6" width="32" height="2" />
            </>
          )}

          {avatar.accessories.includes('hat-beanie') && (
            // 毛线帽
            <>
              <rect x="20" y="0" width="24" height="10" />
              <rect x="18" y="6" width="4" height="8" />
              <rect x="42" y="6" width="4" height="8" />
            </>
          )}

          {avatar.accessories.includes('hat-bucket') && (
            // 渔夫帽
            <>
              <rect x="18" y="2" width="28" height="8" />
              <rect x="14" y="8" width="36" height="4" />
              <rect x="14" y="12" width="36" height="2" />
            </>
          )}

          {avatar.accessories.includes('headphones-over') && (
            // 头戴式耳机
            <>
              <rect x="18" y="6" width="4" height="12" />
              <rect x="42" y="6" width="4" height="12" />
              <rect x="18" y="4" width="28" height="4" />
            </>
          )}

          {avatar.accessories.includes('headphones-neck') && (
            // 颈挂式耳机
            <>
              <rect x="20" y="20" width="24" height="4" />
              <rect x="18" y="22" width="6" height="6" />
              <rect x="40" y="22" width="6" height="6" />
            </>
          )}

          {avatar.accessories.includes('bag-crossbody') && (
            // 斜挎包
            <>
              <rect x="12" y="36" width="20" height="16" />
              <rect x="32" y="34" width="4" height="2" />
            </>
          )}

          {avatar.accessories.includes('bag-backpack') && (
            // 双肩包
            <>
              <rect x="36" y="26" width="16" height="20" />
              <rect x="38" y="24" width="4" height="4" />
              <rect x="46" y="24" width="4" height="4" />
            </>
          )}

          {avatar.accessories.includes('bag-tote') && (
            // 托特包
            <>
              <rect x="12" y="40" width="16" height="12" />
              <rect x="14" y="38" width="12" height="4" />
            </>
          )}

          {avatar.accessories.includes('bracelet') && (
            // 手环
            <rect x="44" y="40" width="4" height="4" />
          )}

          {avatar.accessories.includes('mask') && (
            // 口罩
            <rect x="24" y="16" width="16" height="8" />
          )}

          {avatar.accessories.includes('pet-cat') && (
            // 小猫
            <>
              <rect x="48" y="90" width="8" height="8" />
              <rect x="50" y="86" width="4" height="4" />
              <polygon points="50,86 48,82 52,82" />
              <polygon points="54,86 52,82 56,82" />
            </>
          )}

          {avatar.accessories.includes('pet-dog') && (
            // 小狗
            <>
              <rect x="48" y="90" width="10" height="10" />
              <rect x="48" y="86" width="4" height="4" />
              <rect x="54" y="86" width="4" height="4" />
              <rect x="56" y="92" width="4" height="2" />
            </>
          )}
        </g>
      </svg>

      {showName && avatar.name && (
        <div style={{
          marginTop: '8px',
          fontSize: size === 'small' ? '10px' : size === 'medium' ? '12px' : '14px',
          fontWeight: '600',
          color: '#475569',
        }}>
          {avatar.name}
        </div>
      )}
    </div>
  )
}
