// 8bit 像素小人类型定义

export type BodyType = 'tall' | 'medium' | 'round' | 'small'
export type HairStyle = 'short-straight' | 'short-curly' | 'long-straight' | 'long-wavy' | 'bun' | 'crew-cut' | 'bald' | 'ponytail'
export type TopType = 'hoodie' | 'tshirt' | 'shirt' | 'blazer' | 'dress' | 'tank' | 'coat' | 'sweater'
export type BottomType = 'pants' | 'shorts' | 'skirt' | 'wide-pants' | 'jeans'
export type ShoeType = 'sneakers' | 'canvas' | 'leather' | 'boots' | 'sandals'
export type Accessory = 'glasses-round' | 'glasses-square' | 'hat-baseball' | 'hat-beanie' | 'hat-bucket' | 'headphones-over' | 'headphones-neck' | 'bag-crossbody' | 'bag-backpack' | 'bag-tote' | 'bracelet' | 'mask' | 'pet-cat' | 'pet-dog'
export type ColorScheme = 'all-black' | 'earth' | 'blue' | 'red-accent' | 'green' | 'gray-white' | 'yellow' | 'pink-purple'

export interface PixelAvatar {
  id?: string
  name: string
  bodyType: BodyType
  hairStyle: HairStyle
  top: TopType
  bottom: BottomType
  shoes: ShoeType
  accessories: Accessory[] // 最多2个
  colorScheme: ColorScheme
  createdAt?: string
}

// 选项配置
export const BODY_TYPES = {
  'tall': { label: '高瘦', width: 1.0, height: 1.2 },
  'medium': { label: '中等', width: 1.0, height: 1.0 },
  'round': { label: '圆润', width: 1.2, height: 0.9 },
  'small': { label: '娇小', width: 0.85, height: 0.8 },
} as const

export const HAIR_STYLES = [
  { id: 'short-straight', label: '短发（直）' },
  { id: 'short-curly', label: '短发（卷）' },
  { id: 'long-straight', label: '长发（直）' },
  { id: 'long-wavy', label: '长发（波浪）' },
  { id: 'bun', label: '丸子头' },
  { id: 'crew-cut', label: '寸头' },
  { id: 'bald', label: '光头' },
  { id: 'ponytail', label: '马尾' },
] as const

export const TOPS = [
  { id: 'hoodie', label: '卫衣' },
  { id: 'tshirt', label: 'T恤' },
  { id: 'shirt', label: '衬衫' },
  { id: 'blazer', label: '西装外套' },
  { id: 'dress', label: '连衣裙' },
  { id: 'tank', label: '背心' },
  { id: 'coat', label: '风衣' },
  { id: 'sweater', label: '毛衣' },
] as const

export const BOTTOMS = [
  { id: 'pants', label: '长裤' },
  { id: 'shorts', label: '短裤' },
  { id: 'skirt', label: '裙子' },
  { id: 'wide-pants', label: '阔腿裤' },
  { id: 'jeans', label: '牛仔裤' },
] as const

export const SHOES = [
  { id: 'sneakers', label: '运动鞋' },
  { id: 'canvas', label: '帆布鞋' },
  { id: 'leather', label: '皮鞋' },
  { id: 'boots', label: '靴子' },
  { id: 'sandals', label: '凉鞋' },
] as const

export const ACCESSORIES = [
  { id: 'glasses-round', label: '眼镜（圆框）', category: '眼镜' },
  { id: 'glasses-square', label: '眼镜（方框）', category: '眼镜' },
  { id: 'hat-baseball', label: '棒球帽', category: '帽子' },
  { id: 'hat-beanie', label: '毛线帽', category: '帽子' },
  { id: 'hat-bucket', label: '渔夫帽', category: '帽子' },
  { id: 'headphones-over', label: '头戴式耳机', category: '耳机' },
  { id: 'headphones-neck', label: '颈挂式耳机', category: '耳机' },
  { id: 'bag-crossbody', label: '斜挎包', category: '包' },
  { id: 'bag-backpack', label: '双肩包', category: '包' },
  { id: 'bag-tote', label: '托特包', category: '包' },
  { id: 'bracelet', label: '手环' },
  { id: 'mask', label: '口罩' },
  { id: 'pet-cat', label: '小猫', category: '宠物' },
  { id: 'pet-dog', label: '小狗', category: '宠物' },
] as const

export const COLOR_SCHEMES = [
  { id: 'all-black', label: '全黑系', colors: ['#1a1a1a', '#2d2d2d', '#404040'] },
  { id: 'earth', label: '大地色系', colors: ['#8B4513', '#D2691E', '#DEB887'] },
  { id: 'blue', label: '蓝色系', colors: ['#1E3A5F', '#3B82F6', '#60A5FA'] },
  { id: 'red-accent', label: '红色点缀', colors: ['#DC2626', '#F87171', '#FEE2E2'] },
  { id: 'green', label: '绿色系', colors: ['#065F46', '#10B981', '#6EE7B7'] },
  { id: 'gray-white', label: '灰白系', colors: ['#6B7280', '#E5E7EB', '#F9FAFB'] },
  { id: 'yellow', label: '黄色跳色', colors: ['#F59E0B', '#FCD34D', '#FEF3C7'] },
  { id: 'pink-purple', label: '粉紫系', colors: ['#BE185D', '#EC4899', '#FBCFE8'] },
] as const

// 默认像素小人
export const DEFAULT_AVATAR: PixelAvatar = {
  name: '小人',
  bodyType: 'medium',
  hairStyle: 'short-straight',
  top: 'tshirt',
  bottom: 'pants',
  shoes: 'sneakers',
  accessories: [],
  colorScheme: 'all-black',
}

// 从本地存储加载衣柜
export function loadAvatarWardrobe(): PixelAvatar[] {
  if (typeof window === 'undefined') return []

  try {
    const saved = localStorage.getItem('avatar-wardrobe')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 保存到衣柜
export function saveAvatarToWardrobe(avatar: PixelAvatar): PixelAvatar[] {
  const wardrobe = loadAvatarWardrobe()

  // 如果已有ID，更新它
  if (avatar.id && wardrobe.find(a => a.id === avatar.id)) {
    const index = wardrobe.findIndex(a => a.id === avatar.id)
    wardrobe[index] = { ...avatar, createdAt: wardrobe[index].createdAt }
  } else {
    // 否则添加新的
    avatar.id = `avatar-${Date.now()}`
    avatar.createdAt = new Date().toISOString()
    wardrobe.unshift(avatar)
  }

  // 限制最多12个
  if (wardrobe.length > 12) {
    wardrobe.pop()
  }

  localStorage.setItem('avatar-wardrobe', JSON.stringify(wardrobe))
  return wardrobe
}

// 删除衣柜中的小人
export function deleteAvatarFromWardrobe(id: string): PixelAvatar[] {
  const wardrobe = loadAvatarWardrobe().filter(a => a.id !== id)
  localStorage.setItem('avatar-wardrobe', JSON.stringify(wardrobe))
  return wardrobe
}
