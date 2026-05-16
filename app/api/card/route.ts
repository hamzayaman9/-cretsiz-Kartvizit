import { NextRequest, NextResponse } from 'next/server'
import { CardData } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const data: CardData = await req.json()
    const { nanoid } = await import('nanoid')
    const id = nanoid(8)

    const { error } = await supabase
      .from('cards')
      .insert({ id, data: { ...data, id } })

    if (error) throw error

    return NextResponse.json({ id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

  const { data, error } = await supabase
    .from('cards')
    .select('data')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  return NextResponse.json(data.data)
}
