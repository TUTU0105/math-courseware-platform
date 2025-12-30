import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
  const path = request.nextUrl.pathname

  // 公开路径
  const publicPaths = ['/auth', '/payment']
  const isPublicPath = publicPaths.some(p => path.startsWith(p))

  // 后台路径
  const adminPaths = ['/admin']
  const isAdminPath = adminPaths.some(p => path.startsWith(p))

  // 如果是公开路径，放行
  if (isPublicPath) {
    return NextResponse.next()
  }

  // 验证token
  let user = null
  if (token) {
    user = await verifyToken(token)
  }

  // 未登录，重定向到登录页
  if (!user) {
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // 后台路径需要额外验证（可根据需求添加管理员角色验证）
  if (isAdminPath) {
    // TODO: 添加管理员角色验证
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
