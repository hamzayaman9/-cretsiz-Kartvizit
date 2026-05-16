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
    <div style={{ padding: '28px 32px 8px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', maxWidth: 720 }}>
        {steps.map((s, i) => {
          const done = current > s.num
          const active = current === s.num
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <button
                onClick={() => onChange(s.num)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 20px',
                  minWidth: 88,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: done || active ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'var(--surface)',
                  color: done || active ? '#fff' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700,
                  transition: 'all 0.3s',
                  flexShrink: 0,
                  boxShadow: active ? '0 6px 20px rgba(37, 99, 235, 0.35)' : 'none',
                  border: !done && !active ? '1.5px solid var(--border)' : 'none',
                  fontFamily: 'var(--font-display)',
                }}>
                  {done ? (
                    <svg width="18" height="14" viewBox="0 0 16 13" fill="none">
                      <path d="M1 6.5L6 11.5L15 1.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : s.num}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: active ? 600 : 500,
                  color: active ? 'var(--brand-700)' : done ? 'var(--ink-soft)' : 'var(--muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, marginBottom: 30, background: done ? 'var(--brand-600)' : 'var(--border)', transition: 'background 0.3s', marginLeft: 6, marginRight: 6 }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
