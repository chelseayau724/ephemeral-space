import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    // 查找空间
    const space = await prisma.space.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        startTime: true,
        endTime: true,
        expiresAt: true,
        customFields: true,
        entranceQuestion: true,
        questionRequired: true,
        _count: {
          select: {
            participants: {
              where: {
                isOnline: true,
                leftAt: null,
              },
            },
          },
        },
      },
    })

    if (!space) {
      return NextResponse.json(
        { error: '空间不存在' },
        { status: 404 }
      )
    }

    // 检查是否已过期
    const now = new Date()
    const isExpired = now > new Date(space.endTime)

    // 检查是否已销毁
    const isDestroyed = now > new Date(space.expiresAt)

    return NextResponse.json({
      space: {
        ...space,
        isExpired,
        isDestroyed,
        onlineCount: space._count.participants,
      },
    })
  } catch (error) {
    console.error('获取空间信息失败:', error)
    return NextResponse.json(
      { error: '获取空间信息失败' },
      { status: 500 }
    )
  }
}
