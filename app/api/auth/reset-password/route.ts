import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { hashPassword } from '@/lib/auth'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 deneme / 15 dakika / IP
    const key = `reset-password:${getClientKey(req)}`
    const limit = await checkRateLimit(key, 5, 15 * 60 * 1000)
    if (!limit.allowed) {
      const mins = Math.ceil((limit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Çok fazla deneme, ${mins} dakika sonra tekrar dene` }, { status: 429 })
    }

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
