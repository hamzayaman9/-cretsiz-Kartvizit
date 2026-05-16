'use client'
import { CardData } from '@/lib/types'
import { useCallback } from 'react'

type ValueKey = keyof CardData['values']
type FieldKey = keyof CardData['fields']

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 13,
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  color: '#111',
  background: '#fff',
  transition: 'border-color 0.15s',
}

interface InputRowProps {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}

function InputRow({ label, placeholder, value, onChange }: InputRowProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = '#111')}
        onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
      />
    </div>
  )
}

interface Props {
  values: CardData['values']
  fields: CardData['fields']
  onChange: (key: ValueKey, value: string) => void
}

type FieldDef = { key: ValueKey; fieldKey: FieldKey; label: string; placeholder: string }

const allFields: FieldDef[] = [
  { key: 'isim', fieldKey: 'isim', label: 'İsim & soyisim', placeholder: 'Ahmet Yılmaz' },
  { key: 'unvan', fieldKey: 'unvan', label: 'Unvan', placeholder: 'Yazılım Geliştirici' },
  { key: 'sirket', fieldKey: 'sirket', label: 'Şirket', placeholder: 'Şirket A.Ş.' },
  { key: 'telefon', fieldKey: 'telefon', label: 'Telefon', placeholder: '+90 532 000 00 00' },
  { key: 'eposta', fieldKey: 'eposta', label: 'E-posta', placeholder: 'ahmet@ornek.com' },
  { key: 'adres', fieldKey: 'adres', label: 'Adres', placeholder: 'İstanbul, Türkiye' },
  { key: 'linkedin', fieldKey: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/kullanici' },
  { key: 'twitter', fieldKey: 'twitter', label: 'Twitter / X', placeholder: '@kullanici' },
  { key: 'instagram', fieldKey: 'instagram', label: 'Instagram', placeholder: '@kullanici' },
  { key: 'website', fieldKey: 'website', label: 'Website', placeholder: 'https://siteniz.com' },
  { key: 'github', fieldKey: 'github', label: 'GitHub', placeholder: 'github.com/kullanici' },
  { key: 'youtube', fieldKey: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@kanal' },
]

export default function ValuesForm({ values, fields, onChange }: Props) {
  const visible = allFields.filter(f => fields[f.fieldKey])
  if (!visible.length) {
    return <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '12px 0' }}>Soldaki alanları seç</p>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {visible.map(f => (
        <InputRow
          key={f.key}
          label={f.label}
          placeholder={f.placeholder}
          value={values[f.key]}
          onChange={v => onChange(f.key, v)}
        />
      ))}
    </div>
  )
}
