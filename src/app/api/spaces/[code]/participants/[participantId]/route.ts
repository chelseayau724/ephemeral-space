import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 离开空间
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string; participantId: string }> }
) {
  try {
    const { participantId } = await params

    // 更新参与者状态
    await prisma.participant.update({
      where: { id: participantId },
      data: {
        isOnline: false,
        leftAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('离开空间失败:', error)
    return NextResponse.json(
      { error: '离开失败' },
      { status: 500 }
    )
  }
}

// 更新参与者状态（更新名片信息）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string; participantId: string }> }
) {
  try {
    const { participantId } = await params
    const body = await request.json()
    const { status, nickname, ootdImageUrl, entranceAnswer } = body

    const participant = await prisma.participant.update({
      where: { id: participantId },
      data: {
        ...(status && { status }),
        ...(nickname && { nickname }),
        ...(ootdImageUrl !== undefined && { ootdImageUrl }),
        ...(entranceAnswer !== undefined && { entranceAnswer }),
      },
    })

    return NextResponse.json({ success: true, participant })
  } catch (error) {
    console.error('更新参与者失败:', error)
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    )
  }
}
