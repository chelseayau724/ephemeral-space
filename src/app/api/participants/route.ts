import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { spaceId, nickname, status, ootdImageUrl, entranceAnswer, interests } = body

    // 验证必填字段
    if (!spaceId || !nickname || !status) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 验证空间是否存在且未过期
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    })

    if (!space) {
      return NextResponse.json(
        { error: '空间不存在' },
        { status: 404 }
      )
    }

    if (new Date() > new Date(space.expiresAt)) {
      return NextResponse.json(
        { error: '空间已结束' },
        { status: 410 }
      )
    }

    // 创建参与者
    const participant = await prisma.participant.create({
      data: {
        spaceId,
        nickname,
        status,
        ootdImageUrl: ootdImageUrl || null,
        entranceAnswer: entranceAnswer || null,
      },
    })

    // 如果有兴趣标签，创建关联
    if (interests && Array.isArray(interests) && interests.length > 0) {
      await prisma.participantTag.createMany({
        data: interests.map((tag: string) => ({
          participantId: participant.id,
          tag,
        })),
      })
    }

    return NextResponse.json({
      success: true,
      participant: {
        id: participant.id,
        nickname: participant.nickname,
        status: participant.status,
      },
    })
  } catch (error) {
    console.error('提交名片失败:', error)
    return NextResponse.json(
      { error: '提交失败' },
      { status: 500 }
    )
  }
}
