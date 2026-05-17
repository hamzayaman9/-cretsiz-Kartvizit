'use client'
import { CardStyle, FontFamily, BorderRadius } from '@/lib/types'

const COLORS = ['#2563eb','#7c3aed','#dc2626','#d97706','#16a34a','#0891b2','#374151','#111827','#ec4899','#f97316']

interface Props {
  accentColor: string
  onColorChange: (c: string) => void
  cardStyle: CardStyle
  onStyleChange: (s: CardStyle) => void
}

export default function StyleBar({ accentColor, onColorChange, cardStyle, onStyleChange }: Props) {
  const up = (patch: Partial<CardStyle>) => onStyleChange({ ...cardStyle, ...patch })

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hızlı Stil</p>

      {/* Accent color */}
      <div>
        <p style={{ margin: '0 0 7px', fontSize: 11, color: 'var(--muted)' }}>Vurgu rengi</p>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          {COLORS.map(c => (
            <button key={c} title={c} onClick={() => onColorChange(c)}
              style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: accentColor === c ? '2.5px solid #111' : '1.5px solid transparent', outline: accentColor === c ? '2px solid #fff' : 'none', outlineOffset: '-2px', cursor: 'pointer', padding: 0, transition: 'transform 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
          <input type="color" value={accentColor || '#2563eb'} onChange={e => onColorChange(e.target.value)}
            style={{ width: 24, height: 24, border: 'none', padding: 0, borderRadius: '50%', cursor: 'pointer', background: 'none' }}
          />
          {accentColor && <button onClick={() => onColorChange('')} style={{ fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>✕</button>}
        </div>
      </div>

      {/* Font */}
      <div>
        <p style={{ margin: '0 0 7px', fontSize: 11, color: 'var(--muted)' }}>Yazı tipi</p>
        <div style={{ display: 'flex', gap: 5 }}>
          {([['sans','Modern'],['serif','Klasik'],['mono','Teknik']] as [FontFamily, string][]).map(([v, l]) => (
            <button key={v} onClick={() => up({ fontFamily: v })}
              style={{ flex: 1, padding: '6px 4px', fontSize: 11, fontWeight: 500, borderRadius: 7, cursor: 'pointer', border: `1.5px solid ${cardStyle.fontFamily === v ? '#2563eb' : 'var(--border)'}`, background: cardStyle.fontFamily === v ? 'var(--brand-50)' : '#fff', color: cardStyle.fontFamily === v ? 'var(--brand-700)' : 'var(--ink)', fontFamily: v === 'sans' ? 'sans-serif' : v === 'serif' ? 'Georgia,serif' : 'monospace' }}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Border radius */}
      <div>
        <p style={{ margin: '0 0 7px', fontSize: 11, color: 'var(--muted)' }}>Köşe yuvarlığı</p>
        <div style={{ display: 'flex', gap: 5 }}>
          {([['none','□'],['small','▢'],['medium','○'],['large','◉']] as [BorderRadius, string][]).map(([v, l]) => (
            <button key={v} onClick={() => up({ borderRadius: v })}
              style={{ flex: 1, padding: '6px 4px', fontSize: 14, borderRadius: v === 'none' ? 2 : v === 'small' ? 5 : v === 'medium' ? 9 : 18, cursor: 'pointer', border: `1.5px solid ${cardStyle.borderRadius === v ? '#2563eb' : 'var(--border)'}`, background: cardStyle.borderRadius === v ? 'var(--brand-50)' : '#fff', color: cardStyle.borderRadius === v ? 'var(--brand-700)' : 'var(--ink)' }}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* BG & Text color */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Arka plan</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="color" value={cardStyle.bgColor || '#ffffff'} onChange={e => up({ bgColor: e.target.value })}
              style={{ width: 28, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none', padding: 0 }} />
            {cardStyle.bgColor && <button onClick={() => up({ bgColor: undefined })} style={{ fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕</button>}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Yazı rengi</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="color" value={cardStyle.textColor || '#111827'} onChange={e => up({ textColor: e.target.value })}
              style={{ width: 28, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none', padding: 0 }} />
            {cardStyle.textColor && <button onClick={() => up({ textColor: undefined })} style={{ fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
