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
    width: '100%', padding: '12px 14px', fontSize: 14,
    border: '1.5px solid var(--border)', borderRadius: 10,
    color: 'var(--ink)', outline: 'none', transition: 'border-color 0.15s',
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
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} className="fade-in">
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 30px 80px rgba(15, 23, 42, 0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, var(--brand-50), var(--brand-100))',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {mode === 'register' ? '✨' : '👋'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--muted)', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        <h2 style={{ margin: '20px 0 6px', fontSize: 22, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
          {mode === 'register' ? 'Hesap oluştur' : 'Tekrar hoş geldin'}
        </h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--muted)' }}>
          {mode === 'register'
            ? 'Kartlarını kaydet, istediğin zaman düzenle.'
            : 'Hesabına giriş yap, kartlarını yönet.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>E-posta</label>
            <input type="email" value={email} placeholder="ornek@email.com" onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Şifre</label>
            <input type="password" value={password} placeholder="En az 6 karakter" onChange={e => setPassword(e.target.value)} style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Bekle...' : mode === 'register' ? 'Hesap oluştur' : 'Giriş yap'}
        </button>

        <p style={{ margin: '20px 0 0', fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          {mode === 'register' ? 'Zaten hesabın var mı? ' : 'Hesabın yok mu? '}
          <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--brand-700)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
            {mode === 'register' ? 'Giriş yap' : 'Kayıt ol'}
          </button>
        </p>
      </div>
    </div>
  )
}
