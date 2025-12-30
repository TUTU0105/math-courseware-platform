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
    const press = searchParams.get('press')
    const grade = searchParams.get('grade')
    const chapter = searchParams.get('chapter')

    // 构建查询条件
    const where: any = {
      status: 'active'
    }

    if (press || grade || chapter) {
      where.courseware = {}
      if (press) where.courseware.press = press
      if (grade) where.courseware.grade = grade
      if (chapter) where.courseware.chapter = chapter
    }

    const navigations = await prisma.navigation.findMany({
      where,
      include: {
        courseware: true
      },
      orderBy: {
        sort: 'asc'
      }
    })

    // 计算课件数量
    const count = await prisma.navigation.count({
      where
    })

    return NextResponse.json({
      success: true,
      data: navigations,
      count
    })
  } catch (error) {
    console.error('Get navigation error:', error)
    return NextResponse.json(
      { error: '获取导航失败' },
      { status: 500 }
    )
  }
}
