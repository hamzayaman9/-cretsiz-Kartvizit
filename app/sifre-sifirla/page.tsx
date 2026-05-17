'use client'
import { useState, useEffect } from 'react'
import LogoText from '@/components/LogoText'
import Footer from '@/components/Footer'

export default function SifreSifirlaPage() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) setToken(t)
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (password !== confirm) { setError('Şifreler eşleşmiyor'); return }
    if (password.length < 8) { setError('Şifre en az 8 karakter olmalı'); return }
    if (!/[a-zA-Z]/.test(password)) { setError('Şifre en az bir harf içermeli'); return }
    if (!/[0-9]/.test(password)) { setError('Şifre en az bir rakam içermeli'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error); return }
      setSuccess(true)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', fontSize: 14,
    border: '1.5px solid var(--border)', borderRadius: 10,
    color: 'var(--ink)', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px 32px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.4"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <LogoText size={16} />
        </a>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(15,23,42,0.08)', border: '1px solid var(--border)' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Şifren güncellendi!</h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--muted)' }}>Yeni şifrenle giriş yapabilirsin.</p>
              <a href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: 14 }}>
                Ana sayfaya dön →
              </a>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, background: 'var(--brand-50)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>🔑</div>
                <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Yeni şifre belirle</h2>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>En az 8 karakter, bir harf ve bir rakam içermeli.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Yeni şifre</label>
                  <input type="password" value={password} placeholder="En az 8 karakter" onChange={e => setPassword(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--brand-500)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>Şifre tekrar</label>
                  <input type="password" value={confirm} placeholder="Şifreni tekrar gir" onChange={e => setConfirm(e.target.value)} style={inputStyle}
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

              {!token && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#854d0e' }}>Geçersiz link. Email'deki linke tekrar tıkla.</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading || !token} className="btn-primary" style={{ width: '100%', marginTop: 20, padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Güncelleniyor...' : 'Şifremi güncelle'}
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
