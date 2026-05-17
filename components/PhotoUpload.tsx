'use client'
import { useCallback, useState } from 'react'

interface Props {
  label: string
  value: string | null
  onChange: (url: string | null) => void
  hint?: string
}

export default function PhotoUpload({ label, value, onChange, hint }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = useCallback(async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Yükleme başarısız')
        return
      }
      onChange(data.url)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setUploading(false)
    }
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
            cursor: uploading ? 'wait' : 'pointer', background: '#fafafa',
            transition: 'border-color 0.15s',
            opacity: uploading ? 0.6 : 1,
          }}
          onMouseEnter={e => !uploading && (e.currentTarget.style.borderColor = '#2563eb')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d5db')}
        >
          {uploading ? (
            <>
              <span style={{ fontSize: 16 }}>⏳</span>
              <span style={{ fontSize: 11, color: '#6b7280' }}>Yükleniyor...</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 20 }}>📷</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Tıkla veya sürükle</span>
              {hint && <span style={{ fontSize: 10, color: '#d1d5db' }}>{hint}</span>}
            </>
          )}
          <input
            type="file" accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>
      )}
      {error && <p style={{ margin: '6px 0 0', fontSize: 11, color: '#dc2626' }}>{error}</p>}
    </div>
  )
}
