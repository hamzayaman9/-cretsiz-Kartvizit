import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { sendPasswordResetEmail } from '@/lib/email'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const key = `forgot:${getClientKey(req)}`
    const limit = checkRateLimit(key, 3, 60 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Çok fazla deneme, 1 saat sonra dene' }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email gerekli' }, { status: 400 })

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    // Güvenlik: kullanıcı var mı yok mu söyleme (timing attack koruması)
    if (!user) {
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ success: true })
    }

    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    await supabase
      .from('users')
      .update({ reset_token: token, reset_expires: expires })
      .eq('email', email.toLowerCase())

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
