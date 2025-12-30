'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { siteConfig } from '@/config/site'

interface NavigationItem {
  id: string
  menu1Name: string
  menu2Name?: string
  coursewareId?: string
}

interface NavigationProps {
  navigations: NavigationItem[]
  filters?: {
    presses: string[]
    grades: string[]
    chapters: string[]
  }
}

export default function Navigation({ navigations, filters = { presses: [], grades: [], chapters: [] } }: NavigationProps) {
  const router = useRouter()
  const [isLeftOpen, setIsLeftOpen] = useState(false)
  const [isRightOpen, setIsRightOpen] = useState(false)
  const [selectedPress, setSelectedPress] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [activeMenu1, setActiveMenu1] = useState<string | null>(null)

  // 将导航项按一级菜单分组
  const menuGroups = navigations.reduce((acc, nav) => {
    if (!acc[nav.menu1Name]) {
      acc[nav.menu1Name] = []
    }
    acc[nav.menu1Name].push(nav)
    return acc
  }, {} as Record<string, NavigationItem[]>)

  const handleMenu1Click = (menuName: string) => {
    setActiveMenu1(activeMenu1 === menuName ? null : menuName)
  }

  const handleFilterChange = () => {
    const params = new URLSearchParams()
    if (selectedPress) params.set('press', selectedPress)
    if (selectedGrade) params.set('grade', selectedGrade)
    if (selectedChapter) params.set('chapter', selectedChapter)
    router.push(`/?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedPress('')
    setSelectedGrade('')
    setSelectedChapter('')
    router.push('/')
  }

  // 移动端: 导航栏触发条
  const MobileTrigger = ({ onClick, side }: { onClick: () => void, side: 'left' | 'right' }) => (
    <button
      onClick={onClick}
      className={`fixed top-0 bottom-0 w-12 z-40 bg-primary flex items-center justify-center text-white hover:bg-secondary transition-colors ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
    >
      目录
    </button>
  )

  // 移动端导航栏
  const MobileNavigation = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
        <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-sm bg-primary overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* 筛选区 */}
            <div className="space-y-3">
              <select
                value={selectedPress}
                onChange={(e) => { setSelectedPress(e.target.value); handleFilterChange() }}
                className="w-full p-2 rounded bg-secondary text-white"
              >
                <option value="">选择出版社</option>
                {filters.presses.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <select
                value={selectedGrade}
                onChange={(e) => { setSelectedGrade(e.target.value); handleFilterChange() }}
                className="w-full p-2 rounded bg-secondary text-white"
              >
                <option value="">选择学年段</option>
                {filters.grades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select
                value={selectedChapter}
                onChange={(e) => { setSelectedChapter(e.target.value); handleFilterChange() }}
                className="w-full p-2 rounded bg-secondary text-white"
              >
                <option value="">选择章</option>
                {filters.chapters.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={handleReset}
                className="w-full py-2 bg-white/20 text-white rounded hover:bg-white/30"
              >
                重置
              </button>
            </div>

            {/* 菜单 */}
            <div className="space-y-2">
              {Object.entries(menuGroups).map(([menu1, items]) => (
                <div key={menu1}>
                  <button
                    onClick={() => handleMenu1Click(menu1)}
                    className="w-full text-left p-3 text-white font-medium hover:bg-secondary/50 rounded"
                  >
                    {menu1}
                  </button>
                  {activeMenu1 === menu1 && items.length > 1 && (
                    <div className="pl-4 mt-2 space-y-1">
                      {items.filter(item => item.menu2Name).map(item => (
                        <Link
                          key={item.id}
                          href={item.coursewareId ? `/courseware/${item.coursewareId}` : '#'}
                          className="block p-2 text-white/90 hover:bg-secondary/50 rounded text-sm"
                          onClick={onClose}
                        >
                          {item.menu2Name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 桌面端导航栏
  const DesktopNavigation = ({ position }: { position: 'left' | 'right' }) => (
    <div className={`fixed top-0 bottom-0 bg-primary text-white overflow-hidden transition-all duration-300 ${
      position === 'left' ? (isLeftOpen ? 'w-[30%] max-w-xs' : 'w-0') : (isRightOpen ? 'w-[30%] max-w-xs' : 'w-0')
    }`}>
      <div className="h-full flex flex-col">
        {/* 头部筛选区 */}
        <div className="p-4 bg-primary space-y-3 flex-shrink-0">
          <Link href="/" className="block text-center mb-4">
            {siteConfig.logo.url && siteConfig.logo.url !== '/logo.png' ? (
              <Image
                src={siteConfig.logo.url}
                alt={siteConfig.logo.text}
                width={200}
                height={siteConfig.logo.height}
                className="mx-auto"
              />
            ) : (
              <div className="font-bold text-xl">{siteConfig.logo.text}</div>
            )}
          </Link>
          
          <select
            value={selectedPress}
            onChange={(e) => { setSelectedPress(e.target.value); handleFilterChange() }}
            className="w-full p-2 rounded bg-secondary text-white"
          >
            <option value="">选择出版社</option>
            {filters.presses.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={selectedGrade}
            onChange={(e) => { setSelectedGrade(e.target.value); handleFilterChange() }}
            className="w-full p-2 rounded bg-secondary text-white"
          >
            <option value="">选择学年段</option>
            {filters.grades.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={selectedChapter}
            onChange={(e) => { setSelectedChapter(e.target.value); handleFilterChange() }}
            className="w-full p-2 rounded bg-secondary text-white"
          >
            <option value="">选择章</option>
            {filters.chapters.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="w-full py-2 bg-white/20 text-white rounded hover:bg-white/30"
          >
            重置
          </button>
        </div>
          
          <select
            value={selectedPress}
            onChange={(e) => { setSelectedPress(e.target.value); handleFilterChange() }}
            className="w-full p-2 rounded bg-secondary text-white"
          >
            <option value="">选择出版社</option>
            {filters.presses.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={selectedGrade}
            onChange={(e) => { setSelectedGrade(e.target.value); handleFilterChange() }}
            className="w-full p-2 rounded bg-secondary text-white"
          >
            <option value="">选择学年段</option>
            {filters.grades.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={selectedChapter}
            onChange={(e) => { setSelectedChapter(e.target.value); handleFilterChange() }}
            className="w-full p-2 rounded bg-secondary text-white"
          >
            <option value="">选择章</option>
            {filters.chapters.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="w-full py-2 bg-white/20 text-white rounded hover:bg-white/30"
          >
            重置
          </button>
        </div>

        {/* 菜主体 */}
        <div className="flex-1 bg-secondary overflow-y-auto p-4 space-y-2">
          {Object.entries(menuGroups).map(([menu1, items]) => (
            <div key={menu1}>
              <button
                onClick={() => handleMenu1Click(menu1)}
                className="w-full text-left p-3 font-medium hover:bg-white/10 rounded transition-colors"
                title={menu1}
              >
                <span className="truncate block">{menu1}</span>
              </button>
              {activeMenu1 === menu1 && items.length > 1 && (
                <div className="pl-4 mt-2 space-y-1">
                  {items.filter(item => item.menu2Name).map(item => (
                    <Link
                      key={item.id}
                      href={item.coursewareId ? `/courseware/${item.coursewareId}` : '#'}
                      className="block p-2 text-white/90 hover:bg-white/10 rounded text-sm truncate"
                      title={item.menu2Name}
                      onClick={() => {
                        if (position === 'left') setIsLeftOpen(false)
                        else setIsRightOpen(false)
                      }}
                    >
                      {item.menu2Name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 移动端 */}
      <div className="md:hidden">
        <MobileTrigger onClick={() => setIsLeftOpen(true)} side="left" />
        <MobileNavigation isOpen={isLeftOpen} onClose={() => setIsLeftOpen(false)} />
      </div>

      {/* 桌面端 */}
      <div className="hidden md:block">
        <DesktopNavigation position="left" />
        <DesktopNavigation position="right" />
        
        <button
          onClick={() => setIsLeftOpen(!isLeftOpen)}
          className={`fixed left-0 top-0 bottom-0 w-10 z-30 bg-primary text-white hover:bg-secondary transition-all duration-300 ${
            isLeftOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          目录
        </button>
        <button
          onClick={() => setIsRightOpen(!isRightOpen)}
          className={`fixed right-0 top-0 bottom-0 w-10 z-30 bg-primary text-white hover:bg-secondary transition-all duration-300 ${
            isRightOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          目录
        </button>
      </div>
    </>
  )
}
