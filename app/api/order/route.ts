import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const limit = await checkRateLimit(`order:${getClientKey(req)}`, 3, 60 * 60 * 1000)
  if (!limit.allowed) return NextResponse.json({ error: 'Çok fazla istek' }, { status: 429 })

  const { name, phone, email, address, card_url, package: pkg, notes } = await req.json()

  if (!name || !phone || !address || !pkg) {
    return NextResponse.json({ error: 'Zorunlu alanları doldur' }, { status: 400 })
  }

  const validPackages = ['single', 'pack5', 'corporate']
  if (!validPackages.includes(pkg)) {
    return NextResponse.json({ error: 'Geçersiz paket' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([{ name, phone, email, address, card_url, package: pkg, notes }])
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })

  return NextResponse.json({ success: true, id: data.id })
}
