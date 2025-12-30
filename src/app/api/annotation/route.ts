import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const coursewareId = searchParams.get('coursewareId')

    if (!coursewareId) {
      return NextResponse.json(
        { error: '课件ID不能为空' },
        { status: 400 }
      )
    }

    const annotation = await prisma.annotation.findFirst({
      where: {
        userId: session.id,
        coursewareId
      }
    })

    return NextResponse.json({
      success: true,
      data: annotation?.content || null
    })
  } catch (error) {
    console.error('Get annotation error:', error)
    return NextResponse.json(
      { error: '获取标注失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { coursewareId, content } = body

    if (!coursewareId || !content) {
      return NextResponse.json(
        { error: '课件ID和标注内容不能为空' },
        { status: 400 }
      )
    }

    // 查找是否已存在标注
    const existing = await prisma.annotation.findFirst({
      where: {
        userId: session.id,
        coursewareId
      }
    })

    let annotation
    if (existing) {
      // 更新
      annotation = await prisma.annotation.update({
        where: { id: existing.id },
        data: { content }
      })
    } else {
      // 创建
      annotation = await prisma.annotation.create({
        data: {
          userId: session.id,
          coursewareId,
          content
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: annotation
    })
  } catch (error) {
    console.error('Save annotation error:', error)
    return NextResponse.json(
      { error: '保存标注失败' },
      { status: 500 }
    )
  }
}
