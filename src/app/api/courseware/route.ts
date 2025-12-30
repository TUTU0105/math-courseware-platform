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
    const menu1 = searchParams.get('menu1')
    const press = searchParams.get('press')
    const grade = searchParams.get('grade')
    const chapter = searchParams.get('chapter')

    // 构建查询条件
    const where: any = {}

    if (menu1) where.menu1 = menu1
    if (press) where.press = press
    if (grade) where.grade = grade
    if (chapter) where.chapter = chapter

    const coursewares = await prisma.courseware.findMany({
      where,
      orderBy: {
        updateTime: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: coursewares
    })
  } catch (error) {
    console.error('Get courseware error:', error)
    return NextResponse.json(
      { error: '获取课件失败' },
      { status: 500 }
    )
  }
}
