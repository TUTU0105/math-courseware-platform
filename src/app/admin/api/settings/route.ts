import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let config = await prisma.systemConfig.findFirst()

    if (config) {
      config = await prisma.systemConfig.update({
        where: { id: config.id },
        data: body
      })
    } else {
      config = await prisma.systemConfig.create({
        data: body
      })
    }

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: '更新设置失败' },
      { status: 500 }
    )
  }
}
