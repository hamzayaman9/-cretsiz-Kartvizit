'use client'
import { TemplateId } from '@/lib/types'

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
]

interface Props {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export default function TemplatePicker({ selected, onChange }: Props) {
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
    </div>
  )
}
