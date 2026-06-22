import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取个人印记列表（从 localStorage 的 participantId 获取）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const participantId = searchParams.get('participantId')

    if (!participantId) {
      return NextResponse.json(
        { error: '缺少 participantId' },
        { status: 400 }
      )
    }

    // 获取该参与者参与过的所有空间（通过 participantId）
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        space: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ impressions: [] })
    }

    // 查找是否有存档记录
    const archives = await prisma.personalArchive.findMany({
      where: {
        spaceCode: participant.space.code,
        participantNickname: participant.nickname,
      },
      orderBy: {
        visitedAt: 'desc',
      },
    })

    return NextResponse.json({ impressions: archives })
  } catch (error) {
    console.error('获取印记失败:', error)
    return NextResponse.json(
      { error: '获取印记失败' },
      { status: 500 }
    )
  }
}

// 创建印记（在离开空间时调用）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { spaceCode, spaceName, participantNickname, ootdImageUrl, avatarConfig } = body

    if (!spaceCode || !spaceName || !participantNickname) {
      return NextResponse.json(
        { error: '缺少必要字段' },
        { status: 400 }
      )
    }

    // 检查是否已存在
    const existing = await prisma.personalArchive.findFirst({
      where: {
        spaceCode,
        participantNickname,
      },
    })

    if (existing) {
      return NextResponse.json({ impression: existing })
    }

    // 创建印记
    const impression = await prisma.personalArchive.create({
      data: {
        spaceCode,
        spaceName,
        participantNickname,
        ootdImageUrl: ootdImageUrl || null,
        avatarConfig: avatarConfig || null,
      },
    })

    return NextResponse.json({ impression })
  } catch (error) {
    console.error('创建印记失败:', error)
    return NextResponse.json(
      { error: '创建印记失败' },
      { status: 500 }
    )
  }
}
