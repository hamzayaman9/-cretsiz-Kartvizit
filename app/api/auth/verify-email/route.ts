import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { sendVerificationEmail } from '@/lib/email'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Email doğrulama kodu gönder
export async function POST(req: NextRequest) {
  try {
    const key = `verify-send:${getClientKey(req)}`
    const limit = checkRateLimit(key, 3, 15 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Çok fazla deneme, biraz bekle' }, { status: 429 })
    }

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email gerekli' }, { status: 400 })

    const code = generateCode()
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { error } = await supabase
      .from('users')
      .update({ verification_code: code, verification_expires: expires })
      .eq('email', email.toLowerCase())

    if (error) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

    await sendVerificationEmail(email, code)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// Kodu doğrula
export async function PUT(req: NextRequest) {
  try {
    const { email, code } = await req.json()
    if (!email || !code) return NextResponse.json({ error: 'Email ve kod gerekli' }, { status: 400 })

    // Brute-force koruması: 5 hatalı deneme / 15 dakika / email
    const codeKey = `verify-code:${String(email).toLowerCase()}`
    const codeLimit = checkRateLimit(codeKey, 5, 15 * 60 * 1000)
    if (!codeLimit.allowed) {
      const mins = Math.ceil((codeLimit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Çok fazla hatalı deneme, ${mins} dakika sonra tekrar dene` }, { status: 429 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('verification_code, verification_expires')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    if (user.verification_code !== code) return NextResponse.json({ error: 'Kod hatalı' }, { status: 400 })
    if (new Date(user.verification_expires) < new Date()) return NextResponse.json({ error: 'Kodun süresi dolmuş' }, { status: 400 })

    await supabase
      .from('users')
      .update({ email_verified: true, verification_code: null, verification_expires: null })
      .eq('email', email.toLowerCase())

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
