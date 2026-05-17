'use client'
import { useState } from 'react'
import { CardStyle, FontFamily, BorderRadius } from '@/lib/types'
import { templateConfigMap, TemplateConfig } from '@/lib/templateConfigs'

const ACCENT_COLORS = ['#2563eb','#7c3aed','#dc2626','#d97706','#16a34a','#0891b2','#ec4899','#f97316','#374151','#111827']

interface ColorVar {
  key: keyof CardStyle
  label: string
  configKey: keyof TemplateConfig
}

function getColorVars(config: TemplateConfig): ColorVar[] {
  const vars: ColorVar[] = [
    { key: 'accentColor', label: 'Vurgu Rengi', configKey: 'accentColor' },
    { key: 'textColor',   label: 'Yazı Rengi',  configKey: 'textColor' },
    { key: 'mutedColor',  label: 'Soluk Yazı',  configKey: 'mutedColor' },
    { key: 'bgColor',     label: 'Arka Plan',   configKey: 'bg' },
  ]
  if (config.layout === 'top-header' && config.headerBg)
    vars.push({ key: 'headerBg', label: 'Başlık Rengi', configKey: 'headerBg' })
  if ((config.layout === 'left-sidebar' || config.layout === 'split-half') && config.sidebarBg)
    vars.push({ key: 'sidebarBg', label: 'Panel Rengi', configKey: 'sidebarBg' })
  return vars
}

interface Props {
  accentColor: string
  onColorChange: (c: string) => void
  cardStyle: CardStyle
  onStyleChange: (s: CardStyle) => void
  templateId?: string
}

export default function StyleBar({ accentColor, onColorChange, cardStyle, onStyleChange, templateId }: Props) {
  const [colorsOpen, setColorsOpen] = useState(false)
  const config = templateId ? templateConfigMap[templateId] : null

  const up = (patch: Partial<CardStyle>) => {
    const next = { ...cardStyle, ...patch }
    // remove undefined keys so defaults kick in
    ;(Object.keys(next) as (keyof CardStyle)[]).forEach(k => { if (next[k] === undefined) delete next[k] })
    onStyleChange(next)
  }

  const currentFont = cardStyle.fontFamily

  const hasAnyOverride = !!accentColor || Object.keys(cardStyle).some(k => (cardStyle as any)[k] !== undefined)

  const resetAll = () => {
    onColorChange('')
    onStyleChange({})
  }

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hızlı Stil</p>
        {hasAnyOverride && (
          <button onClick={resetAll} style={{ fontSize: 11, color: '#dc2626', background: 'none', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', padding: '4px 10px', fontFamily: 'inherit' }}>
            ↺ Tümünü Sıfırla
          </button>
        )}
      </div>

      {/* Font */}
      <div>
        <p style={{ margin: '0 0 7px', fontSize: 11, color: 'var(--muted)' }}>Yazı tipi</p>
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            onClick={() => up({ fontFamily: undefined })}
            style={{ flex: 1, padding: '6px 4px', fontSize: 11, fontWeight: 500, borderRadius: 7, cursor: 'pointer', border: `1.5px solid ${!currentFont ? '#2563eb' : 'var(--border)'}`, background: !currentFont ? 'var(--brand-50)' : '#fff', color: !currentFont ? 'var(--brand-700)' : 'var(--ink)' }}
          >Varsayılan</button>
          {([['sans','Modern'],['serif','Klasik'],['mono','Teknik']] as [FontFamily, string][]).map(([v, l]) => (
            <button key={v} onClick={() => up({ fontFamily: v })}
              style={{ flex: 1, padding: '6px 4px', fontSize: 11, fontWeight: 500, borderRadius: 7, cursor: 'pointer', border: `1.5px solid ${currentFont === v ? '#2563eb' : 'var(--border)'}`, background: currentFont === v ? 'var(--brand-50)' : '#fff', color: currentFont === v ? 'var(--brand-700)' : 'var(--ink)', fontFamily: v === 'sans' ? 'sans-serif' : v === 'serif' ? 'Georgia,serif' : 'monospace' }}
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

      {/* Detaylı renk değişkenleri - sadece config tabanlı şablonlarda */}
      {config && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          <button
            onClick={() => setColorsOpen(o => !o)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
          >
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>Şablon renkleri</p>
            <span style={{ fontSize: 10, color: 'var(--muted)', transform: colorsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>

          {colorsOpen && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {getColorVars(config).map(({ key, label, configKey }) => {
                const currentVal = (cardStyle[key] as string | undefined)
                const defaultVal = config[configKey] as string
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="color"
                      value={currentVal || defaultVal || '#000000'}
                      onChange={e => up({ [key]: e.target.value } as Partial<CardStyle>)}
                      style={{ width: 28, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none', padding: 0, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
                      {currentVal && <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 4 }}>({currentVal})</span>}
                    </div>
                    {currentVal && (
                      <button onClick={() => up({ [key]: undefined } as Partial<CardStyle>)}
                        style={{ fontSize: 10, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, whiteSpace: 'nowrap' }}
                      >↺ Sıfırla</button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Legacy şablonlar için basit bg/text color */}
      {!config && (
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
      )}
    </div>
  )
}
