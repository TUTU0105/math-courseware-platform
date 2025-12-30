'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

interface SystemConfig {
  phoneVerify: boolean
  defaultFreeDays: number
  monthlyPrice: number
  quarterlyPrice: number
  yearlyPrice: number
  qrCodeUrl: string
  footerInfo: string
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SystemConfig>({
    phoneVerify: false,
    defaultFreeDays: 7,
    monthlyPrice: 29.9,
    quarterlyPrice: 79.9,
    yearlyPrice: 299.9,
    qrCodeUrl: '',
    footerInfo: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/system/config')
      const data = await res.json()
      if (data.success) {
        setConfig(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const data = await res.json()
      if (data.success) {
        setMessage({ type: 'success', text: '保存成功' })
      } else {
        setMessage({ type: 'error', text: data.error || '保存失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">系统设置</h1>
        <p className="text-gray-600">配置系统参数和收费规则</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">注册设置</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">启用手机验证</h3>
              <p className="text-sm text-gray-500">注册时是否需要手机号验证</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.phoneVerify}
                onChange={(e) => setConfig({ ...config, phoneVerify: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              默认免费天数
            </label>
            <input
              type="number"
              value={config.defaultFreeDays}
              onChange={(e) => setConfig({ ...config, defaultFreeDays: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">收费设置</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月度会员价格 (元)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.monthlyPrice}
              onChange={(e) => setConfig({ ...config, monthlyPrice: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              季度会员价格 (元)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.quarterlyPrice}
              onChange={(e) => setConfig({ ...config, quarterlyPrice: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年度会员价格 (元)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.yearlyPrice}
              onChange={(e) => setConfig({ ...config, yearlyPrice: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              微信支付二维码URL
            </label>
            <input
              type="url"
              value={config.qrCodeUrl}
              onChange={(e) => setConfig({ ...config, qrCodeUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">页面设置</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            底部信息
          </label>
          <textarea
            value={config.footerInfo}
            onChange={(e) => setConfig({ ...config, footerInfo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24 resize-none"
            placeholder="网站底部显示的信息"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? '保存中...' : '保存设置'}
        </button>
      </div>
    </div>
  )
}
