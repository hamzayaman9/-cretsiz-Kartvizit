import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Token ve şifre gerekli' }, { status: 400 })

    if (password.length < 8) return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 })
    if (!/[a-zA-Z]/.test(password)) return NextResponse.json({ error: 'Şifre en az bir harf içermeli' }, { status: 400 })
    if (!/[0-9]/.test(password)) return NextResponse.json({ error: 'Şifre en az bir rakam içermeli' }, { status: 400 })

    const { data: user } = await supabase
      .from('users')
      .select('id, reset_expires')
      .eq('reset_token', token)
      .maybeSingle()

    if (!user) return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş link' }, { status: 400 })
    if (new Date(user.reset_expires) < new Date()) return NextResponse.json({ error: 'Linkin süresi dolmuş' }, { status: 400 })

    const password_hash = await hashPassword(password)

    await supabase
      .from('users')
      .update({ password_hash, reset_token: null, reset_expires: null })
      .eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
