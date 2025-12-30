import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, loginType = 'password', wxOpenId } = body

    if (loginType === 'wechat') {
      // 微信扫码登录
      if (!wxOpenId) {
        return NextResponse.json(
          { error: '微信OpenID不能为空' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { wxOpenId }
      })

      if (!user) {
        return NextResponse.json(
          { error: '用户不存在，请先注册' },
          { status: 404 }
        )
      }

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
    } else {
      // 用户名密码登录
      if (!username || !password) {
        return NextResponse.json(
          { error: '用户名和密码不能为空' },
          { status: 400 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { username }
      })

      if (!user || !user.password) {
        return NextResponse.json(
          { error: '用户名或密码错误' },
          { status: 401 }
        )
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return NextResponse.json(
          { error: '用户名或密码错误' },
          { status: 401 }
        )
      }

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
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
}
