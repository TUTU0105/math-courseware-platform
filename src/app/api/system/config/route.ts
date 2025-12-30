import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let config = await prisma.systemConfig.findFirst()

    // 如果不存在配置,创建默认配置
    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          phoneVerify: false,
          defaultFreeDays: 7,
          monthlyPrice: 29.9,
          quarterlyPrice: 79.9,
          yearlyPrice: 299.9,
          footerInfo: '初中数学课件网 © 2024 版权所有'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Get system config error:', error)
    return NextResponse.json(
      { error: '获取系统配置失败' },
      { status: 500 }
    )
  }
}
