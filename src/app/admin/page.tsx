'use client'

import { useEffect, useState } from 'react'
import { Users, Book, TrendingUp, DollarSign } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalCourseware: number
  totalRevenue: number
  activeVipUsers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourseware: 0,
    totalRevenue: 0,
    activeVipUsers: 0
  })

  useEffect(() => {
    // TODO: 从API获取统计数据
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 模拟数据
      setStats({
        totalUsers: 1234,
        totalCourseware: 456,
        totalRevenue: 45678.90,
        activeVipUsers: 567
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: '课件数量',
      value: stats.totalCourseware,
      icon: Book,
      color: 'bg-green-500'
    },
    {
      title: '总收入',
      value: `¥${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: '活跃会员',
      value: stats.activeVipUsers,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">管理首页</h1>
        <p className="text-gray-600">欢迎来到初中数学课件网后台管理系统</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Users className="w-5 h-5 text-primary" />
            <span>管理用户</span>
          </a>
          <a
            href="/admin/courseware"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Book className="w-5 h-5 text-primary" />
            <span>添加课件</span>
          </a>
          <a
            href="/admin/navigation"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>配置导航</span>
          </a>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">最近活动</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800">新用户注册</p>
              <p className="text-sm text-gray-500">2分钟前</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800">新课件上传</p>
              <p className="text-sm text-gray-500">15分钟前</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-800">会员续费</p>
              <p className="text-sm text-gray-500">1小时前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
