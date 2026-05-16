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
    <div style={{ padding: '20px 24px 0', background: '#fff', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, maxWidth: 560 }}>
        {steps.map((s, i) => {
          const done = current > s.num
          const active = current === s.num
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <button
                onClick={() => onChange(s.num)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px',
                  minWidth: 64,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: done ? '#111' : active ? '#111' : '#f3f4f6',
                  color: done || active ? '#fff' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}>
                  {done ? (
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : s.num}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: active ? 600 : 400,
                  color: active ? '#111' : done ? '#6b7280' : '#9ca3af',
                  whiteSpace: 'nowrap',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 1.5, marginBottom: 22,
                  background: done ? '#111' : '#e5e7eb',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
