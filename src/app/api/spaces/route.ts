import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSpaceCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      startTime,
      endTime,
      durationHours,
      customFields,
      entranceQuestion,
      questionRequired,
      isArchived,
    } = body

    // 验证必填字段
    if (!name || !startTime || !endTime) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 生成暗号（确保唯一）
    let code = generateSpaceCode()
    let attempts = 0
    while (attempts < 10) {
      const existing = await prisma.space.findUnique({
        where: { code },
      })
      if (!existing) break
      code = generateSpaceCode()
      attempts++
    }

    // 计算到期时间
    const start = new Date(startTime)
    const end = new Date(endTime)
    const expiresAt = new Date(end.getTime() + 24 * 60 * 60 * 1000) // 结束后24小时销毁

    // 创建空间
    const space = await prisma.space.create({
      data: {
        code,
        name,
        description,
        startTime: start,
        endTime: end,
        expiresAt,
        customFields: JSON.stringify(customFields || ['nickname', 'status']),
        entranceQuestion,
        questionRequired: questionRequired || false,
        isArchived: isArchived || false,
      },
    })

    return NextResponse.json({
      success: true,
      space: {
        id: space.id,
        code: space.code,
        name: space.name,
        description: space.description,
        startTime: space.startTime,
        endTime: space.endTime,
      },
    })
  } catch (error) {
    console.error('创建空间失败:', error)
    return NextResponse.json(
      { error: '创建空间失败' },
      { status: 500 }
    )
  }
}
