'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingBall from '@/components/FloatingBall'
import { ArrowLeft, Lock } from 'lucide-react'

interface Courseware {
  id: string
  name: string
  content: string
  menu1: string
  menu2?: string
}

export default function CoursewarePage({ params }: { params: { id: string } }) {
  const [courseware, setCourseware] = useState<Courseware | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canPreview, setCanPreview] = useState(false)

  useEffect(() => {
    fetch(`/api/courseware/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hasAccess) {
          setCourseware(data.data)
        } else if (data.canPreview) {
          setCanPreview(true)
          setError(data.error || '需要续费才能查看完整内容')
        } else {
          setError(data.error || '课件不存在或无访问权限')
        }
      })
      .catch(err => {
        setError('加载失败，请稍后重试')
      })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation navigations={[]} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-6">
              <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">需要续费</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              {canPreview && (
                <div className="text-left bg-white rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-500 mb-2">课件预览（缩略图）</p>
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    {courseware?.name?.charAt(0) || '?'}
                  </div>
                  <p className="mt-4 text-gray-700 font-medium">{courseware?.name}</p>
                  <p className="text-sm text-gray-500">{courseware?.menu1} {courseware?.menu2 && `> ${courseware?.menu2}`}</p>
                </div>
              )}
              <Link
                href="/payment"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                立即续费
              </Link>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation navigations={[]} />
      
      <main className="flex-1 relative">
        <div className="absolute inset-0 overflow-hidden">
          {/* 课件内容区 */}
          <div className="w-full h-full flex items-center justify-center p-8 md:p-16">
            <div 
              className="w-full h-full bg-white rounded-lg shadow-xl p-8 overflow-auto"
              dangerouslySetInnerHTML={{ __html: courseware?.content || '' }}
            />
          </div>
        </div>

        {/* 浮悬浮球和画笔功能 */}
        <FloatingBall coursewareId={params.id} />

        {/* 返回按钮 */}
        <Link
          href="/"
          className="fixed top-4 left-4 md:left-36 z-40 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Link>

        {/* 课件标题 */}
        <div className="fixed top-4 right-4 md:right-36 z-40 bg-white px-4 py-2 rounded-lg shadow-md">
          <h1 className="text-lg font-medium text-gray-800 truncate">
            {courseware?.name}
          </h1>
          {canPreview && (
            <p className="text-sm text-yellow-600 mt-1">预览模式 - 续费后可使用全部功能</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
