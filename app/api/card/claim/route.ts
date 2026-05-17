import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Giris gerekli' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Gecersiz token' }, { status: 401 })

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const { data: existing } = await supabase
      .from('cards')
      .select('user_id')
      .eq('id', id)
      .maybeSingle()

    if (!existing) return NextResponse.json({ error: 'Kart bulunamadi' }, { status: 404 })
    if (existing.user_id) return NextResponse.json({ error: 'Bu kart zaten bir kullanicia ait' }, { status: 400 })

    const { error } = await supabase
      .from('cards')
      .update({ user_id: payload.userId })
      .eq('id', id)
      .is('user_id', null)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('claim error:', err)
    return NextResponse.json({ error: 'Hata olustu' }, { status: 500 })
  }
}
