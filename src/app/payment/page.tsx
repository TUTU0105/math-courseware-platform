'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { ArrowLeft, Check } from 'lucide-react'

interface PaymentPlan {
  type: 'monthly' | 'quarterly' | 'yearly'
  name: string
  price: number
  days: number
  features: string[]
}

export default function PaymentPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/system/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const config = data.data
          const newPlans: PaymentPlan[] = [
            {
              type: 'monthly',
              name: '月度会员',
              price: parseFloat(config.monthlyPrice) || 29.9,
              days: 30,
              features: ['30天完整访问权限', '所有课件均可查看', '支持画笔标注功能']
            },
            {
              type: 'quarterly',
              name: '季度会员',
              price: parseFloat(config.quarterlyPrice) || 79.9,
              days: 90,
              features: ['90天完整访问权限', '所有课件均可查看', '支持画笔标注功能', '平均每天低至0.9元']
            },
            {
              type: 'yearly',
              name: '年度会员',
              price: parseFloat(config.yearlyPrice) || 299.9,
              days: 365,
              features: ['365天完整访问权限', '所有课件均可查看', '支持画笔标注功能', '平均每天低至0.8元', '超值推荐']
            }
          ]
          setPlans(newPlans)
          if (config.qrCodeUrl) {
            setQrCodeUrl(config.qrCodeUrl)
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false)
    )
  }, [])

  const handleSelectPlan = (plan: PaymentPlan) => {
    setSelectedPlan(plan)
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation navigations={[]} />
      
      <main className="container mx-auto px-4 py-8 md:py-12 md:ml-32 md:mr-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">选择会员套餐</h1>
          <p className="text-gray-600 text-lg">解锁全部课件内容，开启学习新体验</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.type}
              onClick={() => handleSelectPlan(plan)}
              className={`relative bg-white rounded-2xl shadow-md p-6 cursor-pointer transition-all ${
                selectedPlan?.type === plan.type
                  ? 'ring-4 ring-primary shadow-xl scale-105'
                  : 'hover:shadow-lg'
              }`}
            >
              {plan.type === 'yearly' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  超值推荐
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary">¥{plan.price}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectPlan(plan)
                }}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  selectedPlan?.type === plan.type
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedPlan?.type === plan.type ? '已选择' : '选择此套餐'}
              </button>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">扫码支付</h3>
            
            {qrCodeUrl ? (
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <img
                    src={qrCodeUrl}
                    alt="支付二维码"
                    className="mx-auto max-w-full h-auto"
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  请使用微信扫描二维码支付 ¥{selectedPlan.price}
                </p>
                <p className="text-sm text-gray-500">
                  支付时请输入您的用户名或手机号进行绑定
                </p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>支付二维码暂未配置</p>
                <p className="text-sm mt-2">请联系管理员配置</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
