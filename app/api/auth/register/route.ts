import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { hashPassword, createToken } from '@/lib/auth'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Şifre en az 8 karakter olmalı'
  if (!/[a-zA-Z]/.test(pw)) return 'Şifre en az bir harf içermeli'
  if (!/[0-9]/.test(pw)) return 'Şifre en az bir rakam içermeli'
  return null
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 register / saat / IP
    const key = `register:${getClientKey(req)}`
    const limit = checkRateLimit(key, 5, 60 * 60 * 1000)
    if (!limit.allowed) {
      const mins = Math.ceil((limit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Çok fazla deneme, ${mins} dakika sonra dene` }, { status: 429 })
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gerekli' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Geçerli bir email gir' }, { status: 400 })
    }

    const pwError = validatePassword(password)
    if (pwError) {
      return NextResponse.json({ error: pwError }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 })
    }

    const password_hash = await hashPassword(password)

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email: email.toLowerCase(), password_hash }])
      .select('id, email')
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 })
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
