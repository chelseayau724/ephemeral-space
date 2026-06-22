import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取空间内的所有参与者
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
        name: true,
        endTime: true,
        expiresAt: true,
        entranceQuestion: true,
      },
    })

    if (!space) {
      return NextResponse.json(
        { error: '空间不存在' },
        { status: 404 }
      )
    }

    // 获取当前在线参与者
    const participants = await prisma.participant.findMany({
      where: {
        spaceId: space.id,
        isOnline: true,
        leftAt: null,
      },
      include: {
        tags: true,
      },
      orderBy: {
        joinedAt: 'asc',
      },
    })

    // 计算场域状态
    const statusCount = {
      chatting: 0,
      listening: 0,
      nervous: 0,
    }

    participants.forEach((p: { status: string }) => {
      if (p.status in statusCount) {
        statusCount[p.status as keyof typeof statusCount]++
      }
    })

    const total = participants.length

    return NextResponse.json({
      space: {
        id: space.id,
        name: space.name,
        endTime: space.endTime,
        expiresAt: space.expiresAt,
        entranceQuestion: space.entranceQuestion,
      },
      participants: participants.map((p: { id: string; nickname: string; status: string; ootdImageUrl?: string | null; avatarConfig?: string | null; entranceAnswer?: string | null; joinedAt: Date; tags: { tag: string }[] }) => ({
        id: p.id,
        nickname: p.nickname,
        status: p.status,
        ootdImageUrl: p.ootdImageUrl,
        avatarConfig: p.avatarConfig ? JSON.parse(p.avatarConfig) : undefined,
        entranceAnswer: p.entranceAnswer,
        joinedAt: p.joinedAt.toISOString(),
        tags: p.tags.map(t => t.tag),
      })),
      statusCount,
      total,
    })
  } catch (error) {
    console.error('获取参与者失败:', error)
    return NextResponse.json(
      { error: '获取参与者失败' },
      { status: 500 }
    )
  }
}
