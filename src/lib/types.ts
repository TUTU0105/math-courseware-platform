export interface AdminUser {
  id: string
  username: string
  role: 'super' | 'content' | 'data'
  phone?: string
}

export interface NormalUser {
  id: string
  username?: string
  phone?: string
  province?: string
  city?: string
  freeDays: number
  vipType?: 'monthly' | 'quarterly' | 'yearly'
  vipExpireTime?: Date
}

export interface Courseware {
  id: string
  press: string
  grade: string
  chapter: string
  menu1: string
  menu2?: string
  name: string
  content: string
}

export interface NavigationItem {
  id: string
  menu1Name: string
  menu2Name?: string
  coursewareId?: string
  sort: number
  status: 'draft' | 'active'
}

export interface PaymentInfo {
  id: string
  userId: string
  amount: number
  payType: 'monthly' | 'quarterly' | 'yearly'
  payTime?: Date
  wxTradeNo?: string
  status: 'success' | 'failed' | 'pending'
}
