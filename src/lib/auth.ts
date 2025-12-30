import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface UserSession {
  id: string
  username: string
  role?: string
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession
    return decoded
  } catch {
    return null
  }
}

export async function createToken(payload: UserSession): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession
    return decoded
  } catch {
    return null
  }
}
