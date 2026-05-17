'use client'
import { useState } from 'react'
import { TemplateId } from '@/lib/types'
import { templateCategories, LEGACY_TEMPLATE_IDS } from '@/lib/templateConfigs'

const CLASSIC: { id: string; label: string; swatch: string; text: string }[] = [
  { id: 'klasik',    label: 'Klasik',    swatch: '#fff',    text: '#111' },
  { id: 'kapak',     label: 'Kapak',     swatch: '#1e3a8a', text: '#fff' },
  { id: 'bolunmus',  label: 'Bölünmüş',  swatch: '#f0f9ff', text: '#0c4a6e' },
  { id: 'gece',      label: 'Gece',      swatch: '#0f172a', text: '#e2e8f0' },
  { id: 'yanpanel',  label: 'Yan Panel', swatch: '#2563eb', text: '#fff' },
  { id: 'minimal',   label: 'Minimal',   swatch: '#f8fafc', text: '#111' },
  { id: 'kurumsal',  label: 'Kurumsal',  swatch: '#1d4ed8', text: '#fff' },
  { id: 'cembersel', label: 'Çembersel', swatch: '#eff6ff', text: '#1e3a8a' },
  { id: 'sicakkart', label: 'Sıcak',     swatch: '#ea580c', text: '#fff' },
  { id: 'mozaik',    label: 'Mozaik',    swatch: '#1e293b', text: '#fff' },
  { id: 'bateman',   label: 'Bateman',   swatch: '#fef9e7', text: '#2c1810' },
  { id: 'gradient',  label: 'Gradient',  swatch: '#7c3aed', text: '#fff' },
  { id: 'neon',      label: 'Neon',      swatch: '#0f172a', text: '#a78bfa' },
  { id: 'retro',     label: 'Retro',     swatch: '#fef9e7', text: '#8b4513' },
  { id: 'cam',       label: 'Cam',       swatch: '#0ea5e9', text: '#fff' },
  { id: 'bold',      label: 'Bold',      swatch: '#fff',    text: '#111' },
  { id: 'ikirenk',   label: 'İki Renk',  swatch: '#2563eb', text: '#fff' },
  { id: 'serbest',   label: '✨ Serbest', swatch: 'linear-gradient(135deg,#2563eb,#7c3aed)', text: '#fff' },
]

interface Props {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export default function TemplatePicker({ selected, onChange }: Props) {
  const [openCat, setOpenCat] = useState<string | null>(null)
  const isClassicSelected = LEGACY_TEMPLATE_IDS.includes(selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>

      {/* KLASİK / VAR OLAN ŞABLONLAR */}
      <div style={{ border: `1.5px solid ${isClassicSelected ? '#2563eb' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden' }}>
        <button
          onClick={() => setOpenCat(openCat === 'klasik' ? null : 'klasik')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 14px', background: isClassicSelected ? 'var(--brand-50)' : '#fff',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isClassicSelected ? 'var(--brand-700)' : '#111' }}>🃏 Klasik Şablonlar</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>18 önceden tasarlanmış şablon</p>
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)', transform: openCat === 'klasik' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
        </button>

        {openCat === 'klasik' && (
          <div style={{ padding: '12px 12px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {CLASSIC.map(t => (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                title={t.label}
                style={{
                  width: 76, height: 50,
                  borderRadius: 8,
                  background: t.swatch,
                  border: selected === t.id ? '2.5px solid #2563eb' : '1.5px solid transparent',
                  boxShadow: selected === t.id ? '0 0 0 1px #2563eb' : '0 1px 4px rgba(0,0,0,0.12)',
                  cursor: 'pointer', padding: 0, position: 'relative', overflow: 'hidden',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                <span style={{ position: 'absolute', bottom: 4, left: 5, fontSize: 9, fontWeight: 600, color: t.text, opacity: 0.9, maxWidth: 66, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{t.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KATEGORİLER */}
      {templateCategories.map(cat => {
        const isCatSelected = cat.configs.some(c => c.id === selected)
        const isOpen = openCat === cat.id
        return (
          <div key={cat.id} style={{ border: `1.5px solid ${isCatSelected ? '#2563eb' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden' }}>
            <button
              onClick={() => setOpenCat(isOpen ? null : cat.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', background: isCatSelected ? 'var(--brand-50)' : '#fff',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isCatSelected ? 'var(--brand-700)' : '#111' }}>{cat.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>{cat.configs.length} şablon</p>
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {isOpen && (
              <div style={{ padding: '12px 12px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {cat.configs.map(cfg => (
                  <button
                    key={cfg.id}
                    onClick={() => onChange(cfg.id)}
                    title={cfg.label}
                    style={{
                      width: 76, height: 50,
                      borderRadius: Math.min(cfg.borderRadius, 8),
                      background: cfg.bgGradient || cfg.bg,
                      border: selected === cfg.id ? '2.5px solid #2563eb' : '1.5px solid rgba(0,0,0,0.08)',
                      boxShadow: selected === cfg.id ? '0 0 0 1px #2563eb' : '0 1px 4px rgba(0,0,0,0.12)',
                      cursor: 'pointer', padding: 0, position: 'relative', overflow: 'hidden',
                      display: 'flex', alignItems: 'flex-end',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    <span style={{ position: 'absolute', bottom: 4, left: 5, fontSize: 9, fontWeight: 600, color: cfg.textColor, opacity: 0.9, maxWidth: 66, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{cfg.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
