'use client'
import { CardData } from '@/lib/types'

function Avatar({ src, initials, size = 48, rounded = true }: {
  src: string | null, initials: string, size?: number, rounded?: boolean
}) {
  const style: React.CSSProperties = {
    width: size, height: size,
    borderRadius: rounded ? '50%' : 8,
    overflow: 'hidden', flexShrink: 0,
    background: '#e5e7eb',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.3, fontWeight: 500, color: '#6b7280',
  }
  if (src) return <div style={style}><img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
  return <div style={style}>{initials}</div>
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AY'
}

function socialUrl(key: string, value: string): string {
  if (!value) return '#'
  if (value.startsWith('http')) return value
  switch (key) {
    case 'linkedin': return `https://linkedin.com/in/${value.replace('@','')}`
    case 'twitter': return `https://twitter.com/${value.replace('@','')}`
    case 'instagram': return `https://instagram.com/${value.replace('@','')}`
    case 'github': return `https://github.com/${value.replace('@','')}`
    case 'youtube': return `https://youtube.com/@${value.replace('@','')}`
    case 'website': return value.startsWith('http') ? value : `https://${value}`
    default: return value
  }
}

function SocialRow({ data }: { data: CardData }) {
  const links: { key: keyof typeof data.values; label: string }[] = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'website', label: 'Website' },
    { key: 'github', label: 'GitHub' },
    { key: 'youtube', label: 'YouTube' },
  ]
  const active = links.filter(l => data.fields[l.key as keyof typeof data.fields] && data.values[l.key])
  if (!active.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {active.map(l => (
        <a
          key={l.key}
          href={socialUrl(l.key, data.values[l.key])}
          target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 11, background: '#f3f4f6', padding: '4px 10px',
            borderRadius: 20, color: '#374151', textDecoration: 'none',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}

function ContactRow({ icon, value, href }: { icon: string; value: string; href?: string }) {
  const style: React.CSSProperties = { fontSize: 13, color: '#374151', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }
  if (href) return <a href={href} style={style}><span>{icon}</span>{value}</a>
  return <span style={style}><span>{icon}</span>{value}</span>
}

export function KlasikTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '28px 32px', fontFamily: "'DM Sans', sans-serif", minHeight: 200 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={56} />}
        <div>
          {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>{v.isim}</p>}
          {data.fields.unvan && v.unvan && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{v.unvan}</p>}
          {data.fields.sirket && v.sirket && <p style={{ margin: '1px 0 0', fontSize: 13, color: '#9ca3af' }}>{v.sirket}</p>}
        </div>
      </div>
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.fields.telefon && v.telefon && <ContactRow icon="📞" value={v.telefon} href={`tel:${v.telefon}`} />}
        {data.fields.eposta && v.eposta && <ContactRow icon="✉️" value={v.eposta} href={`mailto:${v.eposta}`} />}
        {data.fields.adres && v.adres && <ContactRow icon="📍" value={v.adres} />}
      </div>
      <SocialRow data={data} />
    </div>
  )
}

export function KapakTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ height: 120, background: data.arkaplanFoto ? `url(${data.arkaplanFoto}) center/cover` : '#111', position: 'relative' }}>
        {data.fields.profil && (
          <div style={{ position: 'absolute', bottom: -28, left: 24 }}>
            <Avatar src={data.profilFoto} initials={initials(v.isim)} size={56} />
          </div>
        )}
      </div>
      <div style={{ background: '#fff', padding: data.fields.profil ? '36px 24px 24px' : '24px' }}>
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>{v.sirket}</p>}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.fields.telefon && v.telefon && <ContactRow icon="📞" value={v.telefon} href={`tel:${v.telefon}`} />}
          {data.fields.eposta && v.eposta && <ContactRow icon="✉️" value={v.eposta} href={`mailto:${v.eposta}`} />}
          {data.fields.adres && v.adres && <ContactRow icon="📍" value={v.adres} />}
        </div>
        <SocialRow data={data} />
      </div>
    </div>
  )
}

export function BolunmusTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ background: '#f9fafb', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', display: 'flex', gap: 20, alignItems: 'center', fontFamily: "'DM Sans', sans-serif", minHeight: 160 }}>
      {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={64} rounded={false} />}
      <div style={{ borderLeft: '2px solid #111', paddingLeft: 20, flex: 1 }}>
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>{v.sirket}</p>}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {data.fields.telefon && v.telefon && <ContactRow icon="📞" value={v.telefon} href={`tel:${v.telefon}`} />}
          {data.fields.eposta && v.eposta && <ContactRow icon="✉️" value={v.eposta} href={`mailto:${v.eposta}`} />}
          {data.fields.adres && v.adres && <ContactRow icon="📍" value={v.adres} />}
        </div>
        <SocialRow data={data} />
      </div>
    </div>
  )
}

export function GeceTemplate({ data }: { data: CardData }) {
  const v = data.values
  const links: { key: keyof typeof data.values; label: string }[] = [
    { key: 'linkedin', label: 'LinkedIn' }, { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' }, { key: 'website', label: 'Website' },
    { key: 'github', label: 'GitHub' }, { key: 'youtube', label: 'YouTube' },
  ]
  const active = links.filter(l => data.fields[l.key as keyof typeof data.fields] && data.values[l.key])
  return (
    <div style={{ background: data.arkaplanFoto ? `url(${data.arkaplanFoto}) center/cover` : '#0f172a', borderRadius: 16, padding: '36px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", minHeight: 200, position: 'relative' }}>
      {data.arkaplanFoto && <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.72)', borderRadius: 16 }} />}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {data.fields.profil && <div style={{ marginBottom: 16 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={64} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#f1f5f9' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#64748b' }}>{v.sirket}</p>}
        <div style={{ width: 32, height: 1, background: '#334155', margin: '16px auto' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>📞 {v.telefon}</a>}
          {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
          {data.fields.adres && v.adres && <span style={{ fontSize: 12, color: '#94a3b8' }}>📍 {v.adres}</span>}
        </div>
        {active.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, justifyContent: 'center' }}>
            {active.map(l => (
              <a key={l.key} href={socialUrl(l.key, data.values[l.key])} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 10, background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: 20, color: '#94a3b8', textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function YanpanelTemplate({ data }: { data: CardData }) {
  const v = data.values
  const links: { key: keyof typeof data.values; label: string }[] = [
    { key: 'linkedin', label: 'LinkedIn' }, { key: 'twitter', label: 'Twitter' },
    { key: 'instagram', label: 'Instagram' }, { key: 'website', label: 'Web' },
    { key: 'github', label: 'GitHub' }, { key: 'youtube', label: 'YT' },
  ]
  const active = links.filter(l => data.fields[l.key as keyof typeof data.fields] && data.values[l.key])
  return (
    <div style={{ borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', fontFamily: "'DM Sans', sans-serif", minHeight: 180 }}>
      <div style={{ width: '36%', background: '#f0fdf4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '20px 12px' }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={52} />}
        {active.map(l => (
          <a key={l.key} href={socialUrl(l.key, data.values[l.key])} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: '#166534', fontWeight: 500, textDecoration: 'none' }}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>{v.sirket}</p>}
        <div style={{ width: 20, height: 2, background: '#4ade80', margin: '12px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {data.fields.telefon && v.telefon && <ContactRow icon="📞" value={v.telefon} href={`tel:${v.telefon}`} />}
          {data.fields.eposta && v.eposta && <ContactRow icon="✉️" value={v.eposta} href={`mailto:${v.eposta}`} />}
          {data.fields.adres && v.adres && <ContactRow icon="📍" value={v.adres} />}
        </div>
      </div>
    </div>
  )
}

// ── MİNİMAL ───────────────────────────────────────────────
export function MinimalTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ background: '#fff', borderRadius: 4, padding: '40px 32px', fontFamily: "'DM Sans', sans-serif", minHeight: 200, border: '1px solid #f1f5f9' }}>
      <div style={{ textAlign: 'left' }}>
        {data.fields.profil && <div style={{ marginBottom: 24 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={64} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 24, fontWeight: 300, color: '#111', letterSpacing: '-0.02em' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#cbd5e1' }}>{v.sirket}</p>}
        <div style={{ width: 24, height: 1, background: '#cbd5e1', margin: '20px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>{v.telefon}</a>}
          {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>{v.eposta}</a>}
          {data.fields.adres && v.adres && <span style={{ fontSize: 13, color: '#475569' }}>{v.adres}</span>}
        </div>
        <SocialRow data={data} />
      </div>
    </div>
  )
}

// ── KURUMSAL ──────────────────────────────────────────────
export function KurumsalTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", border: '1px solid #e5e7eb' }}>
      <div style={{ background: '#1e3a8a', padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={52} />}
        <div>
          {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{v.isim}</p>}
          {data.fields.unvan && v.unvan && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#bfdbfe' }}>{v.unvan}</p>}
          {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#93c5fd' }}>{v.sirket}</p>}
        </div>
      </div>
      <div style={{ background: '#fff', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.fields.telefon && v.telefon && <ContactRow icon="📞" value={v.telefon} href={`tel:${v.telefon}`} />}
        {data.fields.eposta && v.eposta && <ContactRow icon="✉️" value={v.eposta} href={`mailto:${v.eposta}`} />}
        {data.fields.adres && v.adres && <ContactRow icon="📍" value={v.adres} />}
        <SocialRow data={data} />
      </div>
    </div>
  )
}

// ── ÇEMBERSEL ─────────────────────────────────────────────
export function CembersalTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: 24, padding: '36px 28px', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden', minHeight: 220 }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.08)' }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {data.fields.profil && <div style={{ marginBottom: 16 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={72} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0c4a6e' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#0369a1' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#0284c7' }}>{v.sirket}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
          {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12, color: '#075985', textDecoration: 'none' }}>📞 {v.telefon}</a>}
          {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12, color: '#075985', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
          {data.fields.adres && v.adres && <span style={{ fontSize: 12, color: '#075985' }}>📍 {v.adres}</span>}
        </div>
        <SocialRow data={data} />
      </div>
    </div>
  )
}

// ── SICAK KART ────────────────────────────────────────────
export function SicakKartTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', borderRadius: 20, padding: '32px 28px', fontFamily: "'DM Sans', sans-serif", minHeight: 200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={60} />}
        <div style={{ flex: 1 }}>
          {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#7c2d12' }}>{v.isim}</p>}
          {data.fields.unvan && v.unvan && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9a3412' }}>{v.unvan}</p>}
          {data.fields.sirket && v.sirket && <p style={{ margin: '1px 0 0', fontSize: 12, color: '#c2410c' }}>{v.sirket}</p>}
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 13, color: '#7c2d12', textDecoration: 'none' }}>📞 {v.telefon}</a>}
        {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 13, color: '#7c2d12', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 13, color: '#7c2d12' }}>📍 {v.adres}</span>}
      </div>
      <SocialRow data={data} />
    </div>
  )
}

// ── MOZAİK ────────────────────────────────────────────────
export function MozaikTemplate({ data }: { data: CardData }) {
  const v = data.values
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", borderRadius: 16, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, background: '#0f172a', padding: 4 }}>
      <div style={{ background: '#fff', padding: '20px 18px', borderRadius: 12, gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 14 }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={52} />}
        <div>
          {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>{v.isim}</p>}
          {data.fields.unvan && v.unvan && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>{v.unvan}</p>}
        </div>
      </div>
      {data.fields.telefon && v.telefon && (
        <a href={`tel:${v.telefon}`} style={{ background: '#1e293b', color: '#cbd5e1', padding: '14px 16px', borderRadius: 12, fontSize: 12, textDecoration: 'none' }}>
          📞 {v.telefon}
        </a>
      )}
      {data.fields.eposta && v.eposta && (
        <a href={`mailto:${v.eposta}`} style={{ background: '#1e293b', color: '#cbd5e1', padding: '14px 16px', borderRadius: 12, fontSize: 12, textDecoration: 'none' }}>
          ✉️ {v.eposta}
        </a>
      )}
      {(data.fields.linkedin && v.linkedin) || (data.fields.github && v.github) ? (
        <div style={{ background: '#3b82f6', color: '#fff', padding: '14px 16px', borderRadius: 12, fontSize: 12, gridColumn: 'span 2', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {data.fields.linkedin && v.linkedin && <a href={socialUrl('linkedin', v.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>LinkedIn</a>}
          {data.fields.github && v.github && <a href={socialUrl('github', v.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>GitHub</a>}
          {data.fields.twitter && v.twitter && <a href={socialUrl('twitter', v.twitter)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Twitter</a>}
        </div>
      ) : null}
    </div>
  )
}
