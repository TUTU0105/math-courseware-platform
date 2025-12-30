import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'
import { SystemConfig } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      wxOpenId, 
      phone, 
      username, 
      password, 
      province, 
      city,
      skipPhoneVerify 
    } = body

    // 获取系统配置
    const config = (await prisma.systemConfig.findFirst()) || {
      phoneVerify: false,
      defaultFreeDays: 7
    }

    // 检查是否需要手机验证
    if (config.phoneVerify && !skipPhoneVerify) {
      if (!phone) {
        return NextResponse.json(
          { error: '请输入手机号码' },
          { status: 400 }
        )
      }
      // TODO: 验证验证码
    }

    // 检查用户名是否已存在
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username }
      })
      if (existingUser) {
        return NextResponse.json(
          { error: '用户名已存在' },
          { status: 400 }
        )
      }
    }

    // 检查微信OpenID是否已存在
    if (wxOpenId) {
      const existingWxUser = await prisma.user.findUnique({
        where: { wxOpenId }
      })
      if (existingWxUser) {
        return NextResponse.json(
          { error: '该微信已注册' },
          { status: 400 }
        )
      }
    }

    // 密码加密
    let hashedPassword
    if (password) {
      // 密码规则: 必须包含字母和数字
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
      if (!passwordRegex.test(password)) {
        return NextResponse.json(
          { error: '密码必须包含字母和数字，至少6位' },
          { status: 400 }
        )
      }
      hashedPassword = await bcrypt.hash(password, 10)
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        wxOpenId,
        phone,
        username,
        password: hashedPassword,
        province,
        city,
        freeDays: config.defaultFreeDays
      }
    })

    // 记录操作日志
    await prisma.operationLog.create({
      data: {
        operatorType: 'user',
        operatorId: user.id,
        operation: '用户注册',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        device: request.headers.get('user-agent') || 'unknown'
      }
    })

    const token = await createToken({ id: user.id, username: user.username || '' })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        freeDays: user.freeDays,
        vipType: user.vipType,
        vipExpireTime: user.vipExpireTime
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '注册失败' },
      { status: 500 }
    )
  }
}
