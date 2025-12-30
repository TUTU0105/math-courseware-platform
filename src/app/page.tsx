'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface Courseware {
  id: string
  name: string
  menu1: string
  menu2?: string
}

export default function Home() {
  const [coursewares, setCoursewares] = useState<Courseware[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courseware')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCoursewares(data.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation navigations={[]} />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-8 md:py-12 md:ml-32 md:mr-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            初中数学课件网
          </h1>
          <p className="text-gray-600 text-lg">
            专业的初中数学课件学习平台
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : coursewares.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无课件内容，敬请期待
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coursewares.map((courseware, index) => (
              <Link
                key={courseware.id}
                href={`/courseware/${courseware.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div 
                  className="h-48 flex items-center justify-center text-white text-6xl font-bold"
                  style={{ 
                    backgroundColor: [
                      '#8A9BB5', '#6b80a1', '#ff6b6b', '#4ecdc4',
                      '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'
                    ][index % 8]
                  }}
                >
                  {courseware.name.charAt(0)}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate group-hover:text-primary transition-colors">
                    {courseware.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {courseware.menu1} {courseware.menu2 && `> ${courseware.menu2}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
