import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 })

  const { data, error } = await supabase
    .from('cards')
    .select('id, data, created_at')
    .eq('user_id', payload.userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const cards = data || []

  // Her kart için görüntülenme sayısını çek
  const viewCounts = await Promise.all(
    cards.map(async (card) => {
      const { count } = await supabase
        .from('card_views')
        .select('*', { count: 'exact', head: true })
        .eq('card_id', card.id)
      return { id: card.id, count: count ?? 0 }
    })
  )

  const viewMap = Object.fromEntries(viewCounts.map(v => [v.id, v.count]))
  const cardsWithViews = cards.map(c => ({ ...c, viewCount: viewMap[c.id] ?? 0 }))

  return NextResponse.json({ cards: cardsWithViews })
}
