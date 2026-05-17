import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 upload / saat / IP
    const key = `upload:${getClientKey(req)}`
    const limit = checkRateLimit(key, 20, 60 * 60 * 1000)
    if (!limit.allowed) {
      const mins = Math.ceil((limit.remainingMs || 0) / 60000)
      return NextResponse.json({ error: `Çok fazla yükleme, ${mins} dakika sonra dene` }, { status: 429 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'Dosya gerekli' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Dosya 5MB dan büyük olamaz' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const allowed = ['jpg', 'jpeg', 'png', 'webp']
    if (!allowed.includes(ext)) return NextResponse.json({ error: 'Sadece jpg, png veya webp' }, { status: 400 })

    // MIME type kontrolü (sadece uzantıya güvenmiyoruz)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json({ error: 'Geçersiz dosya türü' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Magic bytes kontrolü — client'tan gelen MIME'a güvenmiyoruz
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47
    const isWebp = buffer.length > 11 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    const isValidImage = isJpeg || isPng || isWebp
    if (!isValidImage) {
      return NextResponse.json({ error: 'Geçersiz dosya içeriği' }, { status: 400 })
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error } = await supabase.storage
      .from('kartvizit-fotograflari')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('kartvizit-fotograflari')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload exception:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
