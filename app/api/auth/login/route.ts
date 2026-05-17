import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { comparePassword, createToken } from '@/lib/auth'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 login deneme / 15 dakika / IP (brute force koruması)
    const ipKey = `login:${getClientKey(req)}`
    const limit = checkRateLimit(ipKey, 10, 15 * 60 * 1000)
    if (!limit.allowed) {
      const mins = Math.ceil((limit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Çok fazla deneme, ${mins} dakika sonra dene` }, { status: 429 })
    }

    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 })
    }

    // Email başına da rate limit (target user enumeration koruması)
    const emailKey = `login:email:${email.toLowerCase()}`
    const emailLimit = checkRateLimit(emailKey, 5, 15 * 60 * 1000)
    if (!emailLimit.allowed) {
      const mins = Math.ceil((emailLimit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Bu hesap için çok fazla deneme, ${mins} dakika sonra dene` }, { status: 429 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, email, password_hash')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (!user) {
      return NextResponse.json({ error: 'Email veya şifre hatalı' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Email veya şifre hatalı' }, { status: 401 })
    }

    const token = createToken(user.id, user.email)

    const res = NextResponse.json({ success: true, email: user.email })
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
