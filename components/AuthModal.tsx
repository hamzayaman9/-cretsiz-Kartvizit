'use client'
import { useState } from 'react'

interface Props {
  onClose: () => void
  onSuccess: (email: string) => void
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', fontSize: 13,
    border: '1px solid #e5e7eb', borderRadius: 8,
    fontFamily: "'DM Sans', sans-serif", color: '#111',
    outline: 'none',
  }

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) { setError('Tüm alanları doldur'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      onSuccess(email)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '32px',
        width: '100%', maxWidth: 380, margin: '0 16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>
            {mode === 'register' ? 'Hesap oluştur' : 'Giriş yap'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af' }}>×</button>
        </div>

        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6b7280' }}>
          {mode === 'register'
            ? 'Kartlarını kaydet, istediğin zaman düzenle.'
            : 'Hesabına giriş yap, kartlarını gör.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 4 }}>E-posta</label>
            <input
              type="email" value={email} placeholder="ornek@email.com"
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#111')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 4 }}>Şifre</label>
            <input
              type="password" value={password} placeholder="En az 6 karakter"
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              onFocus={e => (e.target.style.borderColor = '#111')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
        </div>

        {error && <p style={{ margin: '12px 0 0', fontSize: 12, color: '#ef4444' }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', marginTop: 16, padding: '12px',
            background: '#111', color: '#fff', border: 'none',
            borderRadius: 10, fontSize: 14, fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Bekle...' : mode === 'register' ? 'Hesap oluştur' : 'Giriş yap'}
        </button>

        <p style={{ margin: '16px 0 0', fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
          {mode === 'register' ? 'Zaten hesabın var mı? ' : 'Hesabın yok mu? '}
          <button
            onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }}
            style={{ background: 'none', border: 'none', color: '#111', fontWeight: 500, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
          >
            {mode === 'register' ? 'Giriş yap' : 'Kayıt ol'}
          </button>
        </p>
      </div>
    </div>
  )
}
