'use client'
import { TemplateId } from '@/lib/types'

const templates: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'klasik',   label: 'Klasik',    desc: 'Beyaz, sola hizalı' },
  { id: 'kapak',    label: 'Kapak',     desc: 'Arka plan + profil' },
  { id: 'bolunmus', label: 'Bölünmüş',  desc: 'Dikey çizgi, kare avatar' },
  { id: 'gece',     label: 'Gece',      desc: 'Koyu tema, ortalanmış' },
  { id: 'yanpanel', label: 'Yan panel', desc: 'Renkli sol şerit' },
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
            border: `1.5px solid ${selected === t.id ? '#111' : '#e5e7eb'}`,
            borderRadius: 10,
            background: selected === t.id ? '#f9fafb' : '#fff',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s',
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#111' }}>{t.label}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>{t.desc}</p>
          </div>
          {selected === t.id && (
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
