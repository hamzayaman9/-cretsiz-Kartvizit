'use client'
import { TemplateId, CardStyle, FontFamily, BorderRadius, FontSize } from '@/lib/types'

const templates: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'klasik',    label: 'Klasik',    desc: 'Beyaz, sola hizalı' },
  { id: 'kapak',     label: 'Kapak',     desc: 'Arka plan + profil' },
  { id: 'bolunmus',  label: 'Bölünmüş',  desc: 'Dikey çizgi, kare avatar' },
  { id: 'gece',      label: 'Gece',      desc: 'Koyu tema, ortalanmış' },
  { id: 'yanpanel',  label: 'Yan panel', desc: 'Renkli sol şerit' },
  { id: 'minimal',   label: 'Minimal',   desc: 'İnce yazılar, bol boşluk' },
  { id: 'kurumsal',  label: 'Kurumsal',  desc: 'Mavi başlık, profesyonel' },
  { id: 'cembersel', label: 'Çembersel', desc: 'Yumuşak mavi, ortalanmış' },
  { id: 'sicakkart', label: 'Sıcak',     desc: 'Turuncu tonlar, samimi' },
  { id: 'mozaik',    label: 'Mozaik',    desc: 'Bloklu modern grid' },
  { id: 'bateman',   label: 'Bateman',   desc: 'Krem kağıt, serif, klasik' },
  { id: 'gradient',  label: 'Gradient',  desc: 'Tam gradient arka plan' },
  { id: 'neon',      label: 'Neon',      desc: 'Koyu zemin, parlayan renk' },
  { id: 'retro',     label: 'Retro',     desc: 'Vintage, çift çerçeve' },
  { id: 'cam',       label: 'Cam',       desc: 'Glassmorphism efekti' },
  { id: 'bold',      label: 'Bold',      desc: 'Büyük tipografi, minimal' },
  { id: 'ikirenk',   label: 'İki Renk',  desc: 'Sol renkli, sağ beyaz' },
  { id: 'serbest',   label: '✨ Serbest', desc: 'AI tarafından oluşturulur' },
]

const PRESET_COLORS = [
  { value: '#2563eb', label: 'Mavi' },
  { value: '#7c3aed', label: 'Mor' },
  { value: '#dc2626', label: 'Kırmızı' },
  { value: '#d97706', label: 'Turuncu' },
  { value: '#16a34a', label: 'Yeşil' },
  { value: '#0891b2', label: 'Turkuaz' },
  { value: '#374151', label: 'Koyu gri' },
  { value: '#111827', label: 'Siyah' },
]

interface Props {
  selected: TemplateId
  onChange: (id: TemplateId) => void
  accentColor?: string
  onColorChange?: (color: string) => void
  cardStyle?: CardStyle
  onStyleChange?: (style: CardStyle) => void
}

export default function TemplatePicker({ selected, onChange, accentColor = '', onColorChange, cardStyle = {}, onStyleChange }: Props) {
  const updateStyle = (patch: Partial<CardStyle>) => {
    if (onStyleChange) onStyleChange({ ...cardStyle, ...patch })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {templates.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px',
            border: `1.5px solid ${selected === t.id ? '#2563eb' : 'var(--border)'}`,
            borderRadius: 10,
            background: selected === t.id ? 'var(--brand-50)' : '#fff',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: selected === t.id ? 'var(--brand-700)' : '#111' }}>{t.label}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>{t.desc}</p>
          </div>
          {selected === t.id && (
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </button>
      ))}

      {onColorChange && (
        <div style={{ marginTop: 12, padding: '14px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Vurgu rengi</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => onColorChange(c.value)}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: c.value,
                  border: accentColor === c.value ? '2.5px solid var(--ink)' : '2px solid transparent',
                  outline: accentColor === c.value ? '2px solid #fff' : 'none',
                  outlineOffset: '-3px',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              value={accentColor || '#2563eb'}
              onChange={e => onColorChange(e.target.value)}
              style={{ width: 32, height: 32, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 6, background: 'none' }}
            />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Özel renk seç</span>
            {accentColor && (
              <button
                onClick={() => onColorChange('')}
                style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>
      )}

      {onStyleChange && (
        <div style={{ marginTop: 4, padding: '14px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>Stil özelleştirme</p>

          {/* Font */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Yazı tipi</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['sans', 'Modern'], ['serif', 'Klasik'], ['mono', 'Teknik']] as [FontFamily, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => updateStyle({ fontFamily: val })}
                  style={{
                    flex: 1, padding: '7px 4px', fontSize: 11, fontWeight: 500,
                    borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${cardStyle.fontFamily === val ? '#2563eb' : 'var(--border)'}`,
                    background: cardStyle.fontFamily === val ? 'var(--brand-50)' : '#fff',
                    color: cardStyle.fontFamily === val ? 'var(--brand-700)' : 'var(--ink)',
                    fontFamily: val === 'sans' ? 'sans-serif' : val === 'serif' ? 'Georgia, serif' : 'monospace',
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Yazı boyutu</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['small', 'Küçük'], ['medium', 'Orta'], ['large', 'Büyük']] as [FontSize, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => updateStyle({ fontSize: val })}
                  style={{
                    flex: 1, padding: '7px 4px', fontSize: 11, fontWeight: 500,
                    borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${cardStyle.fontSize === val ? '#2563eb' : 'var(--border)'}`,
                    background: cardStyle.fontSize === val ? 'var(--brand-50)' : '#fff',
                    color: cardStyle.fontSize === val ? 'var(--brand-700)' : 'var(--ink)',
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Border radius */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Köşe yuvarlığı</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['none', 'Keskin'], ['small', 'Az'], ['medium', 'Orta'], ['large', 'Yuvarlak']] as [BorderRadius, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => updateStyle({ borderRadius: val })}
                  style={{
                    flex: 1, padding: '7px 2px', fontSize: 10, fontWeight: 500,
                    borderRadius: val === 'none' ? 2 : val === 'small' ? 4 : val === 'medium' ? 8 : 16,
                    cursor: 'pointer',
                    border: `1.5px solid ${cardStyle.borderRadius === val ? '#2563eb' : 'var(--border)'}`,
                    background: cardStyle.borderRadius === val ? 'var(--brand-50)' : '#fff',
                    color: cardStyle.borderRadius === val ? 'var(--brand-700)' : 'var(--ink)',
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Hizalama</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {([['left', 'Sol'], ['center', 'Orta'], ['split', 'Bölünmüş']] as [import('@/lib/types').Layout, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => updateStyle({ layout: val })}
                  style={{
                    flex: 1, padding: '7px 4px', fontSize: 11, fontWeight: 500,
                    borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${cardStyle.layout === val ? '#2563eb' : 'var(--border)'}`,
                    background: cardStyle.layout === val ? 'var(--brand-50)' : '#fff',
                    color: cardStyle.layout === val ? 'var(--brand-700)' : 'var(--ink)',
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Background color */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Arka plan rengi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={cardStyle.bgColor || '#ffffff'}
                onChange={e => updateStyle({ bgColor: e.target.value })}
                style={{ width: 32, height: 32, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 6, background: 'none' }}
              />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{cardStyle.bgColor || 'Şablona göre'}</span>
              {cardStyle.bgColor && (
                <button
                  onClick={() => updateStyle({ bgColor: undefined })}
                  style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                >
                  Sıfırla
                </button>
              )}
            </div>
          </div>

          {/* Text color */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--muted)' }}>Yazı rengi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={cardStyle.textColor || '#111827'}
                onChange={e => updateStyle({ textColor: e.target.value })}
                style={{ width: 32, height: 32, border: 'none', padding: 0, cursor: 'pointer', borderRadius: 6, background: 'none' }}
              />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{cardStyle.textColor || 'Şablona göre'}</span>
              {cardStyle.textColor && (
                <button
                  onClick={() => updateStyle({ textColor: undefined })}
                  style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                >
                  Sıfırla
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
