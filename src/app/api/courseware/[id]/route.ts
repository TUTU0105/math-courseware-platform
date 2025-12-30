import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const courseware = await prisma.courseware.findUnique({
      where: { id: params.id }
    })

    if (!courseware) {
      return NextResponse.json(
        { error: '课件不存在' },
        { status: 404 }
      )
    }

    // 获取用户信息检查访问权限
    const user = await prisma.user.findUnique({
      where: { id: session.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 检查是否有权限访问
    const now = new Date()
    const hasFreeAccess = user.freeDays > 0
    const hasVipAccess = user.vipExpireTime && user.vipExpireTime > now

    if (!hasFreeAccess && !hasVipAccess) {
      return NextResponse.json(
        { 
          error: '需要续费',
          canPreview: true
        },
        { status: 403 }
      )
    }

    // 记录访问日志
    await prisma.operationLog.create({
      data: {
        operatorType: 'user',
        operatorId: session.id,
        operation: `查看课件: ${courseware.name}`,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        device: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      data: courseware,
      hasAccess: true
    })
  } catch (error) {
    console.error('Get courseware detail error:', error)
    return NextResponse.json(
      { error: '获取课件详情失败' },
      { status: 500 }
    )
  }
}
