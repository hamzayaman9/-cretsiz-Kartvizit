import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  return token === process.env.ADMIN_PASSWORD
}

// Banlı IP'leri listele
export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .select('key, count, reset_at')
    .like('key', 'asistan:activity:%')
    .gt('count', 25)
    .order('count', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const blocked = (data || []).map(r => ({
    ip: r.key.replace('asistan:activity:', ''),
    count: r.count,
    reset_at: r.reset_at,
  }))

  return NextResponse.json({ blocked })
}

// IP banını kaldır
export async function DELETE(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { ip } = await req.json()
  if (!ip) return NextResponse.json({ error: 'IP gerekli' }, { status: 400 })

  await supabaseAdmin
    .from('rate_limits')
    .delete()
    .eq('key', `asistan:activity:${ip}`)

  return NextResponse.json({ ok: true })
}
