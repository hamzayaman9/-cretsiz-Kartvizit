'use client'
import { CardData } from '@/lib/types'

type FieldKey = keyof CardData['fields']

interface Group {
  label: string
  fields: { key: FieldKey; label: string }[]
}

const groups: Group[] = [
  {
    label: 'Kişisel',
    fields: [
      { key: 'isim', label: 'İsim & soyisim' },
      { key: 'unvan', label: 'Unvan' },
      { key: 'sirket', label: 'Şirket' },
      { key: 'profil', label: 'Profil fotoğrafı' },
    ],
  },
  {
    label: 'İletişim',
    fields: [
      { key: 'telefon', label: 'Telefon' },
      { key: 'eposta', label: 'E-posta' },
      { key: 'adres', label: 'Adres' },
    ],
  },
  {
    label: 'Sosyal medya',
    fields: [
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'twitter', label: 'Twitter / X' },
      { key: 'instagram', label: 'Instagram' },
    ],
  },
  {
    label: 'Diğer linkler',
    fields: [
      { key: 'website', label: 'Website' },
      { key: 'github', label: 'GitHub' },
      { key: 'youtube', label: 'YouTube' },
    ],
  },
]

interface Props {
  fields: CardData['fields']
  onChange: (key: FieldKey, value: boolean) => void
}

export default function FieldSelector({ fields, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {groups.map(group => (
        <div key={group.label}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {group.label}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {group.fields.map(f => (
              <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                <div
                  onClick={() => onChange(f.key, !fields[f.key])}
                  style={{
                    width: 18, height: 18,
                    borderRadius: 5,
                    border: `1.5px solid ${fields[f.key] ? '#111' : '#d1d5db'}`,
                    background: fields[f.key] ? '#111' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  {fields[f.key] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 13, color: '#374151' }}>{f.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
