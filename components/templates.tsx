'use client'
import { CardData, CardStyle } from '@/lib/types'

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
  const accent = data.accentColor || '#2563eb'
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: `3px solid ${accent}`, borderRadius: 16, padding: '28px 32px', fontFamily: "'DM Sans', sans-serif", minHeight: 200 }}>
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
  const accent = data.accentColor || '#111827'
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ height: 120, background: data.arkaplanFoto ? `url(${data.arkaplanFoto}) center/cover` : accent, position: 'relative' }}>
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
  const accent = data.accentColor || '#111827'
  return (
    <div style={{ background: '#f9fafb', borderRadius: 16, border: '1px solid #e5e7eb', padding: '24px', display: 'flex', gap: 20, alignItems: 'center', fontFamily: "'DM Sans', sans-serif", minHeight: 160 }}>
      {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={64} rounded={false} />}
      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 20, flex: 1 }}>
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
  const accent = data.accentColor || '#334155'
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
        <div style={{ width: 32, height: 1, background: accent, margin: '16px auto' }} />
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
  const accent = data.accentColor || '#16a34a'
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
            style={{ fontSize: 11, color: accent, fontWeight: 500, textDecoration: 'none' }}>
            {l.label}
          </a>
        ))}
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#6b7280' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>{v.sirket}</p>}
        <div style={{ width: 20, height: 2, background: accent, margin: '12px 0' }} />
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
  const accent = data.accentColor || '#111827'
  return (
    <div style={{ background: '#fff', borderRadius: 4, padding: '40px 32px', fontFamily: "'DM Sans', sans-serif", minHeight: 200, border: '1px solid #f1f5f9' }}>
      <div style={{ textAlign: 'left' }}>
        {data.fields.profil && <div style={{ marginBottom: 24 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={64} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 24, fontWeight: 300, color: '#111', letterSpacing: '-0.02em' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#cbd5e1' }}>{v.sirket}</p>}
        <div style={{ width: 24, height: 1, background: accent, margin: '20px 0' }} />
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
  const accent = data.accentColor || '#1e3a8a'
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", border: '1px solid #e5e7eb' }}>
      <div style={{ background: accent, padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
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
  const accent = data.accentColor || '#0369a1'
  return (
    <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: 24, padding: '36px 28px', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden', minHeight: 220 }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: `${accent}18` }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: `${accent}12` }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {data.fields.profil && <div style={{ marginBottom: 16 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={72} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: accent }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 13, color: '#0369a1' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#0284c7' }}>{v.sirket}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 14 }}>
          {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>📞 {v.telefon}</a>}
          {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12, color: accent, textDecoration: 'none' }}>✉️ {v.eposta}</a>}
          {data.fields.adres && v.adres && <span style={{ fontSize: 12, color: accent }}>📍 {v.adres}</span>}
        </div>
        <SocialRow data={data} />
      </div>
    </div>
  )
}

// ── SICAK KART ────────────────────────────────────────────
export function SicakKartTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#9a3412'
  return (
    <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)', borderRadius: 20, padding: '32px 28px', fontFamily: "'DM Sans', sans-serif", minHeight: 200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18 }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={60} />}
        <div style={{ flex: 1 }}>
          {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: accent }}>{v.isim}</p>}
          {data.fields.unvan && v.unvan && <p style={{ margin: '2px 0 0', fontSize: 13, color: accent }}>{v.unvan}</p>}
          {data.fields.sirket && v.sirket && <p style={{ margin: '1px 0 0', fontSize: 12, color: accent }}>{v.sirket}</p>}
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 13, color: accent, textDecoration: 'none' }}>📞 {v.telefon}</a>}
        {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 13, color: accent, textDecoration: 'none' }}>✉️ {v.eposta}</a>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 13, color: accent }}>📍 {v.adres}</span>}
      </div>
      <SocialRow data={data} />
    </div>
  )
}

// ── BATEMAN ───────────────────────────────────────────────
export function BatemanTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#1a1a1a'
  const font = "'Georgia', 'Palatino Linotype', 'Book Antiqua', serif"
  return (
    <div style={{
      background: 'linear-gradient(145deg, #f7f3ed 0%, #ede8df 100%)',
      borderRadius: 6,
      padding: '32px 36px',
      fontFamily: font,
      minHeight: 220,
      border: '1px solid #d6cfc4',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.08)',
    }}>
      {/* Üst satır: telefon sol | şirket sağ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {data.fields.telefon && v.telefon && (
            <p style={{ margin: 0, fontSize: 11, color: accent, letterSpacing: '0.06em' }}>{v.telefon}</p>
          )}
          {data.fields.eposta && v.eposta && (
            <p style={{ margin: '3px 0 0', fontSize: 10, color: accent, letterSpacing: '0.04em', opacity: 0.75 }}>{v.eposta}</p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          {data.fields.sirket && v.sirket && (
            <p style={{ margin: 0, fontSize: 13, color: accent, fontVariant: 'small-caps', letterSpacing: '0.12em', fontWeight: 600 }}>
              {v.sirket}
            </p>
          )}
          {data.fields.website && v.website && (
            <p style={{ margin: '2px 0 0', fontSize: 9, color: accent, letterSpacing: '0.05em', opacity: 0.7 }}>
              {v.website.replace(/^https?:\/\//, '')}
            </p>
          )}
        </div>
      </div>

      {/* Orta: isim + unvan */}
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {data.fields.isim && v.isim && (
          <p style={{
            margin: 0,
            fontSize: 17,
            color: accent,
            fontVariant: 'small-caps',
            letterSpacing: '0.3em',
            fontWeight: 400,
            lineHeight: 1.2,
          }}>
            {v.isim.toUpperCase()}
          </p>
        )}
        {data.fields.unvan && v.unvan && (
          <p style={{ margin: '6px 0 0', fontSize: 11, color: accent, letterSpacing: '0.12em', fontStyle: 'italic', opacity: 0.85 }}>
            {v.unvan}
          </p>
        )}
      </div>

      {/* Alt: adres */}
      <div style={{ textAlign: 'center' }}>
        {data.fields.adres && v.adres && (
          <p style={{ margin: 0, fontSize: 10, color: accent, letterSpacing: '0.07em', opacity: 0.75, lineHeight: 1.5 }}>
            {v.adres}
            {data.fields.telefon && v.telefon && !data.fields.eposta ? '' : ''}
          </p>
        )}
        {!data.fields.adres && data.fields.linkedin && v.linkedin && (
          <p style={{ margin: 0, fontSize: 10, color: accent, letterSpacing: '0.07em', opacity: 0.75 }}>
            linkedin.com/in/{v.linkedin.replace('@', '')}
          </p>
        )}
      </div>
    </div>
  )
}

// ── MOZAİK ────────────────────────────────────────────────
export function MozaikTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#3b82f6'
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
        <div style={{ background: accent, color: '#fff', padding: '14px 16px', borderRadius: 12, fontSize: 12, gridColumn: 'span 2', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {data.fields.linkedin && v.linkedin && <a href={socialUrl('linkedin', v.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>LinkedIn</a>}
          {data.fields.github && v.github && <a href={socialUrl('github', v.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>GitHub</a>}
          {data.fields.twitter && v.twitter && <a href={socialUrl('twitter', v.twitter)} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>Twitter</a>}
        </div>
      ) : null}
    </div>
  )
}

// ── GRADİENT ──────────────────────────────────────────────
export function GradientTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#2563eb'
  return (
    <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}99 100%)`, borderRadius: 20, padding: '36px 32px', fontFamily: "'DM Sans', sans-serif", minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={56} />}
        {data.fields.sirket && v.sirket && (
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{v.sirket}</p>
        )}
      </div>
      <div>
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{v.unvan}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        {data.fields.telefon && v.telefon && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>📞 {v.telefon}</span>}
        {data.fields.eposta && v.eposta && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>✉️ {v.eposta}</span>}
        {data.fields.website && v.website && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>🌐 {v.website}</span>}
      </div>
    </div>
  )
}

// ── NEON ──────────────────────────────────────────────────
export function NeonTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#a855f7'
  const glow = `0 0 10px ${accent}, 0 0 30px ${accent}55`
  return (
    <div style={{ background: '#080808', borderRadius: 16, padding: '32px 28px', fontFamily: "'DM Sans', sans-serif", minHeight: 220, border: `1px solid ${accent}44`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={52} />}
        <div>
          {data.fields.isim && v.isim && (
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: accent, textShadow: glow, letterSpacing: '0.02em' }}>{v.isim}</p>
          )}
          {data.fields.unvan && v.unvan && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{v.unvan}</p>}
          {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#555' }}>{v.sirket}</p>}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${accent}33`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>📞 {v.telefon}</a>}
        {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12, color: '#aaa', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 12, color: '#aaa' }}>📍 {v.adres}</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {data.fields.linkedin && v.linkedin && <a href={socialUrl('linkedin', v.linkedin)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, padding: '3px 10px', border: `1px solid ${accent}55`, borderRadius: 20, color: accent, textDecoration: 'none' }}>LinkedIn</a>}
        {data.fields.github && v.github && <a href={socialUrl('github', v.github)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, padding: '3px 10px', border: `1px solid ${accent}55`, borderRadius: 20, color: accent, textDecoration: 'none' }}>GitHub</a>}
        {data.fields.instagram && v.instagram && <a href={socialUrl('instagram', v.instagram)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, padding: '3px 10px', border: `1px solid ${accent}55`, borderRadius: 20, color: accent, textDecoration: 'none' }}>Instagram</a>}
      </div>
    </div>
  )
}

// ── RETRO ─────────────────────────────────────────────────
export function RetroTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#92400e'
  return (
    <div style={{ background: '#fdf6e3', borderRadius: 4, padding: '28px 32px', fontFamily: "'Georgia', serif", minHeight: 220, border: '2px solid #d4a373', position: 'relative', boxShadow: '4px 4px 0 #d4a373' }}>
      <div style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, border: '1px solid #d4a37388', borderRadius: 2, pointerEvents: 'none' }} />
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        {data.fields.sirket && v.sirket && (
          <p style={{ margin: 0, fontSize: 10, color: accent, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 700 }}>{v.sirket}</p>
        )}
        <div style={{ height: 1, background: accent, margin: '10px 0', opacity: 0.3 }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        {data.fields.profil && <div style={{ marginBottom: 12 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={56} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: accent, letterSpacing: '0.1em' }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: '4px 0 0', fontSize: 11, color: accent, fontStyle: 'italic', opacity: 0.8 }}>{v.unvan}</p>}
      </div>
      <div style={{ height: 1, background: accent, opacity: 0.3, marginBottom: 12 }} />
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {data.fields.telefon && v.telefon && <span style={{ fontSize: 11, color: accent, opacity: 0.85 }}>{v.telefon}</span>}
        {data.fields.eposta && v.eposta && <span style={{ fontSize: 11, color: accent, opacity: 0.85 }}>{v.eposta}</span>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 10, color: accent, opacity: 0.7 }}>{v.adres}</span>}
      </div>
    </div>
  )
}

// ── CAM (GLASS) ───────────────────────────────────────────
export function CamTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#2563eb'
  return (
    <div style={{ background: `linear-gradient(135deg, ${accent}dd 0%, ${accent}88 100%)`, borderRadius: 20, padding: '32px 28px', fontFamily: "'DM Sans', sans-serif", minHeight: 220, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: 14, padding: '24px', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {data.fields.profil && <Avatar src={data.profilFoto} initials={initials(v.isim)} size={52} />}
          <div>
            {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>{v.isim}</p>}
            {data.fields.unvan && v.unvan && <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{v.unvan}</p>}
            {data.fields.sirket && v.sirket && <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{v.sirket}</p>}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>📞 {v.telefon}</a>}
          {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
          {data.fields.adres && v.adres && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>📍 {v.adres}</span>}
        </div>
        <SocialRow data={data} />
      </div>
    </div>
  )
}

// ── BOLD ──────────────────────────────────────────────────
export function BoldTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#111827'
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', fontFamily: "'DM Sans', sans-serif", minHeight: 220, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {data.fields.isim && v.isim && (
          <p style={{ margin: 0, fontSize: 34, fontWeight: 800, color: accent, letterSpacing: '-0.03em', lineHeight: 1, wordBreak: 'break-word' }}>{v.isim}</p>
        )}
        {data.fields.unvan && v.unvan && (
          <p style={{ margin: '10px 0 0', fontSize: 13, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{v.unvan}</p>
        )}
        {data.fields.sirket && v.sirket && (
          <div style={{ marginTop: 8, display: 'inline-block', background: accent, color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 4 }}>{v.sirket}</div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, borderTop: '2px solid', borderColor: accent, paddingTop: 14 }}>
        {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 13, color: '#374151', textDecoration: 'none', fontWeight: 500 }}>📞 {v.telefon}</a>}
        {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 13, color: '#374151', textDecoration: 'none', fontWeight: 500 }}>✉️ {v.eposta}</a>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 12, color: '#6b7280' }}>📍 {v.adres}</span>}
        <SocialRow data={data} />
      </div>
    </div>
  )
}

// ── İKİ RENK ──────────────────────────────────────────────
export function IkiRenkTemplate({ data }: { data: CardData }) {
  const v = data.values
  const accent = data.accentColor || '#2563eb'
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', display: 'flex', fontFamily: "'DM Sans', sans-serif", minHeight: 200 }}>
      <div style={{ width: '45%', background: accent, padding: '28px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        {data.fields.profil && <div style={{ marginBottom: 8 }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={52} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{v.sirket}</p>}
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '24px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7 }}>
        {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>📞 {v.telefon}</a>}
        {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 11, color: '#6b7280' }}>📍 {v.adres}</span>}
        {data.fields.website && v.website && <a href={socialUrl('website', v.website)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#6b7280', textDecoration: 'none' }}>🌐 {v.website}</a>}
        <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {data.fields.linkedin && v.linkedin && <a href={socialUrl('linkedin', v.linkedin)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: accent, fontWeight: 600, textDecoration: 'none' }}>LinkedIn</a>}
          {data.fields.github && v.github && <a href={socialUrl('github', v.github)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: accent, fontWeight: 600, textDecoration: 'none', marginLeft: 6 }}>GitHub</a>}
          {data.fields.instagram && v.instagram && <a href={socialUrl('instagram', v.instagram)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: accent, fontWeight: 600, textDecoration: 'none', marginLeft: 6 }}>Instagram</a>}
        </div>
      </div>
    </div>
  )
}

// ── SERBEST (AI üretimi) ───────────────────────────────────
export function SerbstTemplate({ data }: { data: CardData }) {
  const v = data.values
  const s = data.cardStyle || {}
  const accent = data.accentColor || '#2563eb'

  const fontMap = { sans: "'DM Sans', sans-serif", serif: "'Georgia', serif", mono: "'Courier New', monospace" }
  const radiusMap = { none: 0, small: 8, medium: 16, large: 24 }
  const sizeMap = { small: 0.85, medium: 1, large: 1.15 }

  const font = fontMap[s.fontFamily || 'sans']
  const radius = radiusMap[s.borderRadius || 'medium']
  const scale = sizeMap[s.fontSize || 'medium']
  const bg = s.bgGradient || s.bgColor || '#fff'
  const textColor = s.textColor || '#111827'
  const isGradient = !!s.bgGradient || (!!s.bgColor && s.bgColor !== '#fff')
  const isCentered = s.layout === 'center'

  return (
    <div style={{
      background: bg,
      borderRadius: radius,
      padding: `${28 * scale}px ${32 * scale}px`,
      fontFamily: font,
      minHeight: 200,
      border: isGradient ? 'none' : '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: isCentered ? 'center' : 'space-between',
      alignItems: isCentered ? 'center' : 'flex-start',
      textAlign: isCentered ? 'center' : 'left',
    }}>
      <div style={{ marginBottom: 16 }}>
        {data.fields.profil && <div style={{ marginBottom: 12, display: 'flex', justifyContent: isCentered ? 'center' : 'flex-start' }}><Avatar src={data.profilFoto} initials={initials(v.isim)} size={56} /></div>}
        {data.fields.isim && v.isim && <p style={{ margin: 0, fontSize: 22 * scale, fontWeight: 700, color: textColor, lineHeight: 1.2 }}>{v.isim}</p>}
        {data.fields.unvan && v.unvan && <p style={{ margin: `${4 * scale}px 0 0`, fontSize: 13 * scale, color: isGradient ? `${textColor}cc` : '#6b7280' }}>{v.unvan}</p>}
        {data.fields.sirket && v.sirket && <p style={{ margin: `${2 * scale}px 0 0`, fontSize: 12 * scale, color: accent }}>{v.sirket}</p>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 * scale, borderTop: `1px solid ${isGradient ? 'rgba(255,255,255,0.2)' : '#e5e7eb'}`, paddingTop: 12 * scale, width: '100%' }}>
        {data.fields.telefon && v.telefon && <a href={`tel:${v.telefon}`} style={{ fontSize: 12 * scale, color: isGradient ? `${textColor}dd` : '#374151', textDecoration: 'none' }}>📞 {v.telefon}</a>}
        {data.fields.eposta && v.eposta && <a href={`mailto:${v.eposta}`} style={{ fontSize: 12 * scale, color: isGradient ? `${textColor}dd` : '#374151', textDecoration: 'none' }}>✉️ {v.eposta}</a>}
        {data.fields.adres && v.adres && <span style={{ fontSize: 11 * scale, color: isGradient ? `${textColor}aa` : '#6b7280' }}>📍 {v.adres}</span>}
      </div>
    </div>
  )
}
