import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { createHash } from 'crypto'
import { getClientKey } from '@/lib/rateLimit'

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + 'kartvizitim-salt').digest('hex').slice(0, 32)
}

// POST /api/card/view?id=xxx — görüntülenme kaydet
export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  const ip = getClientKey(req)
  const ip_hash = hashIp(ip)

  // Günlük dedup: aynı IP aynı kartı günde 1 kez sayılır (PK conflict → ignore)
  await supabase
    .from('card_views')
    .upsert(
      { card_id: id, ip_hash, view_date: new Date().toISOString().slice(0, 10) },
      { ignoreDuplicates: true }
    )

  return NextResponse.json({ ok: true })
}

// GET /api/card/view?id=xxx — toplam görüntülenme sayısı
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  const { count } = await supabase
    .from('card_views')
    .select('*', { count: 'exact', head: true })
    .eq('card_id', id)

  return NextResponse.json({ count: count ?? 0 })
}
