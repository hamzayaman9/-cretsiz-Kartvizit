'use client'
import { useCallback } from 'react'

interface Props {
  label: string
  value: string | null
  onChange: (base64: string | null) => void
  hint?: string
}

export default function PhotoUpload({ label, value, onChange, hint }: Props) {
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = e => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }, [handleFile])

  return (
    <div>
      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 500, color: '#6b7280' }}>{label}</p>
      {value ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <img src={value} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} />
          <button
            onClick={() => onChange(null)}
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              border: 'none', borderRadius: 6,
              padding: '3px 8px', fontSize: 11, cursor: 'pointer',
            }}
          >
            Kaldır
          </button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, height: 72,
            border: '1.5px dashed #d1d5db', borderRadius: 10,
            cursor: 'pointer', background: '#fafafa',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#111')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d5db')}
        >
          <span style={{ fontSize: 20 }}>📷</span>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>Tıkla veya sürükle</span>
          {hint && <span style={{ fontSize: 10, color: '#d1d5db' }}>{hint}</span>}
          <input
            type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>
      )}
    </div>
  )
}
