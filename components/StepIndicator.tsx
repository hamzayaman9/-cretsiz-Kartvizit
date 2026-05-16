'use client'

const steps = [
  { num: 1, label: 'Alanları Seç' },
  { num: 2, label: 'Bilgileri Gir' },
  { num: 3, label: 'Fotoğraf' },
  { num: 4, label: 'Şablon' },
]

interface Props {
  current: number
  onChange: (step: number) => void
}

export default function StepIndicator({ current, onChange }: Props) {
  return (
    <div style={{ padding: '24px 32px 0', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: 640 }}>
        {steps.map((s, i) => {
          const done = current > s.num
          const active = current === s.num
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <button
                onClick={() => onChange(s.num)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 20px',
                  minWidth: 80,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: done ? '#111' : active ? '#111' : '#f3f4f6',
                  color: done || active ? '#fff' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  boxShadow: active ? '0 2px 12px rgba(0,0,0,0.2)' : 'none',
                }}>
                  {done ? (
                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
                      <path d="M1 6.5L6 11.5L15 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : s.num}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 700 : 400,
                  color: active ? '#111' : done ? '#6b7280' : '#9ca3af',
                  whiteSpace: 'nowrap',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 28,
                  background: done ? '#111' : '#e5e7eb',
                  transition: 'background 0.3s',
                  marginLeft: 4, marginRight: 4,
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
