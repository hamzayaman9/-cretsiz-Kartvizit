'use client'
import { useEffect, useState } from 'react'
import LogoText from './LogoText'

interface Props {
  onAuthClick: () => void
}

export default function Header({ onAuthClick }: Props) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      padding: '14px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s',
    }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
        }}>
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.4"/>
            <path d="M4 13H10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M7 10V13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <LogoText size={18} />
          <p style={{ margin: 0, fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em' }}>PROFESYONEL DİJİTAL KARTVİZİT</p>
        </div>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {user ? (
          <>
            <a href="/panel" style={{
              fontSize: 14, fontWeight: 600, color: 'var(--brand-700)',
              textDecoration: 'none', padding: '10px 20px',
              border: '1.5px solid var(--brand-200)', borderRadius: 12,
              background: '#fff',
            }}>
              Kartlarım
            </a>
            <button onClick={handleLogout} style={{
              fontSize: 14, color: 'var(--muted)', background: 'none',
              border: 'none', cursor: 'pointer', padding: '10px 14px',
            }}>
              Çıkış
            </button>
          </>
        ) : (
          <button onClick={onAuthClick} className="btn-primary" style={{ fontSize: 14, padding: '11px 24px' }}>
            Giriş / Kayıt Ol
          </button>
        )}
      </div>
    </header>
  )
}
