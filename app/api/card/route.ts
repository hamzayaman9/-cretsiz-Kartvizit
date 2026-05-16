import { NextRequest, NextResponse } from 'next/server'
import { CardData } from '@/lib/types'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const data: CardData = await req.json()
    const { nanoid } = await import('nanoid')
    const id = nanoid(8)
    const { error } = await supabase
      .from('cards')
      .insert([{ id, data: { ...data, id } }])
    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ id })
  } catch (err) {
    console.error('POST error:', err)
    return NextResponse.json({ error: 'Hata olustu' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
    const { data, error } = await supabase
      .from('cards')
      .select('data')
      .eq('id', id)
      .maybeSingle()
    if (error) {
      console.error('Supabase get error:', JSON.stringify(error))
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) return NextResponse.json({ error: 'Bulunamadi' }, { status: 404 })
    return NextResponse.json(data.data)
  } catch (err) {
    console.error('GET error:', err)
    return NextResponse.json({ error: 'Hata olustu' }, { status: 500 })
  }
}