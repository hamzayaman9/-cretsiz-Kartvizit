import { NextRequest, NextResponse } from 'next/server'
import { CardData, TemplateId } from '@/lib/types'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { verifyToken } from '@/lib/auth'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

const VALID_TEMPLATES: TemplateId[] = [
  'klasik', 'kapak', 'bolunmus', 'gece', 'yanpanel',
  'minimal', 'kurumsal', 'cembersel', 'sicakkart', 'mozaik',
]

function sanitize(str: string, max = 500): string {
  return String(str || '').slice(0, max).trim()
}

function isSafeImageUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000) return false
  // Sadece Supabase storage URL'lerine izin ver
  return value.startsWith('https://')
}

function sanitizeCard(data: any): CardData | null {
  if (!data || typeof data !== 'object') return null
  if (!data.values || !data.fields) return null

  const template: TemplateId = VALID_TEMPLATES.includes(data.template) ? data.template : 'klasik'

  const clean: CardData = {
    template,
    fields: {
      isim: !!data.fields.isim,
      unvan: !!data.fields.unvan,
      sirket: !!data.fields.sirket,
      profil: !!data.fields.profil,
      telefon: !!data.fields.telefon,
      eposta: !!data.fields.eposta,
      adres: !!data.fields.adres,
      linkedin: !!data.fields.linkedin,
      twitter: !!data.fields.twitter,
      instagram: !!data.fields.instagram,
      website: !!data.fields.website,
      github: !!data.fields.github,
      youtube: !!data.fields.youtube,
    },
    values: {
      isim: sanitize(data.values.isim, 100),
      unvan: sanitize(data.values.unvan, 100),
      sirket: sanitize(data.values.sirket, 100),
      telefon: sanitize(data.values.telefon, 30),
      eposta: sanitize(data.values.eposta, 100),
      adres: sanitize(data.values.adres, 200),
      linkedin: sanitize(data.values.linkedin, 200),
      twitter: sanitize(data.values.twitter, 50),
      instagram: sanitize(data.values.instagram, 50),
      website: sanitize(data.values.website, 200),
      github: sanitize(data.values.github, 50),
      youtube: sanitize(data.values.youtube, 200),
    },
    profilFoto: isSafeImageUrl(data.profilFoto) ? data.profilFoto : null,
    arkaplanFoto: isSafeImageUrl(data.arkaplanFoto) ? data.arkaplanFoto : null,
  }
  return clean
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 kart / saat / IP (spam koruması)
    const key = `card:${getClientKey(req)}`
    const limit = checkRateLimit(key, 10, 60 * 60 * 1000)
    if (!limit.allowed) {
      const mins = Math.ceil((limit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Çok fazla kart oluşturdun, ${mins} dakika sonra dene` }, { status: 429 })
    }

    const raw = await req.json()
    const data = sanitizeCard(raw)
    if (!data) {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
    }

    const { nanoid } = await import('nanoid')
    const id = nanoid(8)

    let user_id = null
    const token = req.cookies.get('auth_token')?.value
    if (token) {
      const payload = verifyToken(token)
      if (payload) user_id = payload.userId
    }

    const { error } = await supabase
      .from('cards')
      .insert([{ id, data: { ...data, id }, user_id }])

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
    if (!id || id.length > 20) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

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

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Giris gerekli' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Gecersiz token' }, { status: 401 })

    // Rate limit: 30 update / saat / kullanıcı
    const key = `update:${payload.userId}`
    const limit = checkRateLimit(key, 30, 60 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Çok fazla güncelleme, biraz bekle' }, { status: 429 })
    }

    const raw = await req.json()
    const data = sanitizeCard(raw)
    if (!data || !raw.id) {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
    }

    const { error } = await supabase
      .from('cards')
      .update({ data: { ...data, id: raw.id } })
      .eq('id', raw.id)
      .eq('user_id', payload.userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PUT error:', err)
    return NextResponse.json({ error: 'Hata olustu' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'Giris gerekli' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Gecersiz token' }, { status: 401 })

    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })

    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)
      .eq('user_id', payload.userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ error: 'Hata olustu' }, { status: 500 })
  }
}
