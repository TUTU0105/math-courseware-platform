'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loginType, setLoginType] = useState<'password' | 'wechat'>('password')
  const [phoneVerify, setPhoneVerify] = useState(false)
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    verifyCode: '',
    province: '',
    city: '',
    wxOpenId: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // 获取系统配置
  useEffect(() => {
    fetch('/api/system/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPhoneVerify(data.data.phoneVerify)
          if (!data.data.phoneVerify) {
            setStep(2)
          }
        }
      })
      .catch(console.error)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSendCode = async () => {
    if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
      setError('请输入有效的手机号码')
      return
    }

    setLoading(true)
    try {
      // TODO: 实际发送短信验证码
      // await fetch('/api/sms/send', { ... })
      alert('验证码已发送（模拟：1234）')
    } catch (err) {
      setError('发送验证码失败')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          loginType
        })
      })

      const data = await res.json()

      if (data.success) {
        try {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          router.push('/')
        } catch (storageError) {
          setError('浏览器不支持本地存储，请更换浏览器')
        }
      } else {
        setError(data.error || '登录失败')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterStep1 = () => {
    if (step === 1 && phoneVerify) {
      if (!formData.phone || !formData.verifyCode) {
        setError('请完成手机验证')
        return
      }
      // TODO: 验证验证码
      setStep(2)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 密码验证
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    if (!passwordRegex.test(formData.password)) {
      setError('密码必须包含字母和数字，至少6位')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skipPhoneVerify: !phoneVerify
        })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
      } else {
        setError(data.error || '注册失败')
      }
    } catch (err) {
      setError('注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 登录/注册切换 */}
          <div className="flex mb-8">
            <button
              onClick={() => { setIsLogin(true); setStep(1) }}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => { setIsLogin(false); setStep(1) }}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                !isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
            >
              注册
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="flex mb-6">
                <button
                  type="button"
                  onClick={() => setLoginType('password')}
                  className={`flex-1 py-2 text-center rounded-l-lg font-medium transition-colors ${
                    loginType === 'password' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  密码登录
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('wechat')}
                  className={`flex-1 py-2 text-center rounded-r-lg font-medium transition-colors ${
                    loginType === 'wechat' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  微信扫码
                </button>
              </div>

              {loginType === 'password' ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        用户名
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="请输入用户名"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        密码
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                          placeholder="请输入密码"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      忘记密码？
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    {loading ? '登录中...' : '登录'}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-lg p-8 mb-4">
                    {/* 二维码占位 */}
                    <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">微信扫码登录</span>
                    </div>
                  </div>
                  <p className="text-gray-600">请使用微信扫描二维码登录</p>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              {/* 第一步：手机验证（如果启用） */}
              {step === 1 && phoneVerify && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      手机号码
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="请输入手机号码"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      验证码
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="verifyCode"
                        value={formData.verifyCode}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="请输入验证码"
                      />
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {loading ? '发送中...' : '发送验证码'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRegisterStep1}
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    下一步
                  </button>
                </div>
              )}

              {/* 第二步：完善信息 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      所在省市
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        required
                      >
                        <option value="">选择省份</option>
                        {['北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        required
                      >
                        <option value="">选择城市</option>
                        <option value="市辖区">市辖区</option>
                        <option value="县">县</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      用户名
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="请输入用户名（中英文均可）"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                        placeholder="密码必须包含字母和数字，至少6位"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      确认密码
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                        placeholder="请再次输入密码"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    {loading ? '注册中...' : '完成注册'}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* 用户须知 */}
          {isLogin && (
            <div className="mt-6 text-center">
              <Link
                href="/auth/terms"
                className="text-sm text-gray-500 hover:text-primary"
              >
                用户须知
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
