'use client'
import { CardData } from '@/lib/types'
import { TemplateConfig } from '@/lib/templateConfigs'

interface Props {
  data: CardData
  config: TemplateConfig
}

function fontStyle(f: string) {
  if (f === 'serif') return 'Georgia,"Times New Roman",serif'
  if (f === 'mono') return '"Courier New",Courier,monospace'
  return 'system-ui,-apple-system,sans-serif'
}

function contacts(data: CardData) {
  const items: { icon: string; text: string }[] = []
  if (data.fields.telefon && data.values.telefon) items.push({ icon: '📱', text: data.values.telefon })
  if (data.fields.eposta && data.values.eposta) items.push({ icon: '✉️', text: data.values.eposta })
  if (data.fields.adres && data.values.adres) items.push({ icon: '📍', text: data.values.adres })
  if (data.fields.website && data.values.website) items.push({ icon: '🌐', text: data.values.website })
  if (data.fields.linkedin && data.values.linkedin) items.push({ icon: 'in', text: data.values.linkedin })
  if (data.fields.instagram && data.values.instagram) items.push({ icon: '📷', text: data.values.instagram })
  if (data.fields.twitter && data.values.twitter) items.push({ icon: '✕', text: data.values.twitter })
  if (data.fields.github && data.values.github) items.push({ icon: '⌨', text: data.values.github })
  if (data.fields.youtube && data.values.youtube) items.push({ icon: '▶', text: data.values.youtube })
  return items
}

const radiusMap: Record<string, number> = { none: 0, small: 6, medium: 14, large: 24 }

export default function ConfigurableTemplate({ data, config: baseConfig }: Props) {
  const cs = data.cardStyle || {}
  // Merge data overrides into config
  const c: TemplateConfig = {
    ...baseConfig,
    accentColor: data.accentColor || baseConfig.accentColor,
    fontFamily: (cs.fontFamily as TemplateConfig['fontFamily']) || baseConfig.fontFamily,
    borderRadius: cs.borderRadius != null ? (radiusMap[cs.borderRadius] ?? baseConfig.borderRadius) : baseConfig.borderRadius,
    bg: cs.bgColor || baseConfig.bg,
    bgGradient: cs.bgGradient || baseConfig.bgGradient,
    textColor: cs.textColor || baseConfig.textColor,
  }

  const font = fontStyle(c.fontFamily)
  const ctc = contacts(data)
  const name = data.values.isim || 'Ad Soyad'
  const title = data.fields.unvan ? data.values.unvan : ''
  const company = data.fields.sirket ? data.values.sirket : ''
  const hasAvatar = !!(data.profilFoto && data.fields.profil)
  const bg = c.bgGradient || c.bg

  const base: React.CSSProperties = {
    fontFamily: font,
    borderRadius: c.borderRadius,
    overflow: 'hidden',
    background: bg,
    color: c.textColor,
    minHeight: 190,
  }

  const nameEl = (size = 20, color = c.textColor) => (
    <div style={{ fontSize: size, fontWeight: 700, color, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{name}</div>
  )
  const titleEl = (size = 12, color = c.accentColor) =>
    title ? <div style={{ fontSize: size, color, fontWeight: 500, marginTop: 3 }}>{title}</div> : null
  const companyEl = (size = 11, color = c.mutedColor) =>
    company ? <div style={{ fontSize: size, color, marginTop: 2 }}>{company}</div> : null
  const contactList = (max = 4, size = 11.5) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
      {ctc.slice(0, max).map((ct, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: size }}>
          <span style={{ fontSize: size + 1, color: c.accentColor, flexShrink: 0 }}>{ct.icon}</span>
          <span style={{ color: c.textColor, opacity: 0.85 }}>{ct.text}</span>
        </div>
      ))}
    </div>
  )
  const avatar = (size = 52, br = 6) =>
    hasAvatar ? <img src={data.profilFoto!} alt="" style={{ width: size, height: size, objectFit: 'cover', borderRadius: br, flexShrink: 0 }} /> : null

  if (c.layout === 'centered') return (
    <div style={{ ...base, padding: '28px 24px', textAlign: 'center' }}>
      {hasAvatar && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{avatar(60, 30)}</div>}
      {nameEl(21)}
      {titleEl(12)}
      {companyEl()}
      {c.divider && <div style={{ borderTop: `1px solid ${c.accentColor}40`, margin: '12px auto', width: '50%' }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10, alignItems: 'center' }}>
        {ctc.slice(0, 4).map((ct, i) => (
          <div key={i} style={{ fontSize: 11, color: c.textColor, opacity: 0.8 }}>{ct.text}</div>
        ))}
      </div>
    </div>
  )

  if (c.layout === 'left-sidebar') return (
    <div style={{ ...base, display: 'flex' }}>
      <div style={{ width: c.sidebarWidth || '34%', background: c.sidebarBg || c.accentColor, padding: '22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, flexShrink: 0 }}>
        {hasAvatar && <img src={data.profilFoto!} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />}
        {company && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.3 }}>{company}</div>}
      </div>
      <div style={{ flex: 1, padding: '22px 18px', background: c.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {nameEl(18)}
        {titleEl(11)}
        {contactList(4, 10.5)}
      </div>
    </div>
  )

  if (c.layout === 'top-header') return (
    <div style={{ ...base }}>
      <div style={{ background: c.headerBg || c.accentColor, padding: hasAvatar ? '18px 22px' : '20px 22px' }}>
        {hasAvatar ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={data.profilFoto!} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', flexShrink: 0 }} />
            <div>
              {nameEl(19, '#fff')}
              {title && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{title}</div>}
            </div>
          </div>
        ) : (
          <div>
            {nameEl(20, '#fff')}
            {title && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>{title}</div>}
          </div>
        )}
      </div>
      <div style={{ background: c.bg, padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {company && <div style={{ fontSize: 11, color: c.accentColor, fontWeight: 600, marginBottom: 6 }}>{company}</div>}
        {ctc.slice(0, 4).map((ct, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: c.mutedColor, marginBottom: 4 }}>
            <span>{ct.icon}</span><span style={{ color: c.textColor, opacity: 0.85 }}>{ct.text}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (c.layout === 'split-half') return (
    <div style={{ ...base, display: 'flex' }}>
      <div style={{ width: '42%', background: c.sidebarBg || c.accentColor, padding: '22px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, flexShrink: 0 }}>
        {hasAvatar && <img src={data.profilFoto!} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: c.borderRadius > 8 ? '50%' : 4, marginBottom: 4 }} />}
        {nameEl(17, '#fff')}
        {title && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{title}</div>}
      </div>
      <div style={{ flex: 1, background: c.bg, padding: '22px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {company && <div style={{ fontSize: 11, color: c.accentColor, fontWeight: 600, marginBottom: 8 }}>{company}</div>}
        {ctc.slice(0, 4).map((ct, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: c.mutedColor, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: c.accentColor }}>{ct.icon}</span>
            <span style={{ color: c.textColor, opacity: 0.85 }}>{ct.text}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (c.layout === 'minimal') return (
    <div style={{ ...base, padding: '32px 30px' }}>
      <div style={{ fontSize: 26, fontWeight: 300, color: c.textColor, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{name}</div>
      {(title || company) && (
        <div style={{ fontSize: 11, color: c.accentColor, fontWeight: 500, marginBottom: 18, letterSpacing: '0.04em' }}>
          {[title, company].filter(Boolean).join(' · ')}
        </div>
      )}
      <div style={{ borderTop: `1px solid ${c.textColor}20`, paddingTop: 14 }}>
        {ctc.slice(0, 5).map((ct, i) => (
          <div key={i} style={{ fontSize: 11, color: c.mutedColor, marginBottom: 4 }}>{ct.text}</div>
        ))}
      </div>
    </div>
  )

  if (c.layout === 'dark-card') return (
    <div style={{ ...base, padding: '26px 24px' }}>
      {hasAvatar && <img src={data.profilFoto!} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, marginBottom: 12, border: `1px solid ${c.accentColor}40` }} />}
      {nameEl(20)}
      {titleEl(11)}
      {companyEl(10)}
      {contactList(4)}
    </div>
  )

  if (c.layout === 'gradient-full') return (
    <div style={{ ...base, padding: '26px 24px' }}>
      {hasAvatar && <img src={data.profilFoto!} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: '50%', marginBottom: 12, border: '2px solid rgba(255,255,255,0.3)' }} />}
      {nameEl(21)}
      {titleEl(12, c.accentColor)}
      {companyEl(11, c.mutedColor)}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ctc.slice(0, 4).map((ct, i) => (
          <div key={i} style={{ fontSize: 11, color: c.textColor, opacity: 0.8 }}>{ct.text}</div>
        ))}
      </div>
    </div>
  )

  // left-standard (default)
  return (
    <div style={{ ...base, padding: '26px 24px' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        {hasAvatar && avatar(52, c.borderRadius > 8 ? 10 : 4)}
        <div>
          {nameEl(19)}
          {titleEl(12)}
          {companyEl()}
        </div>
      </div>
      {c.divider && <div style={{ borderTop: `1px solid ${c.accentColor}35`, marginBottom: 12 }} />}
      {contactList(5)}
    </div>
  )
}
