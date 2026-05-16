import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { comparePassword, createToken } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

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
