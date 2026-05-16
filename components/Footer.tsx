'use client'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--brand-950)',
      color: 'rgba(255,255,255,0.8)',
      padding: '40px 32px 28px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.4"/>
                <path d="M4 13H10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M7 10V13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>Kartvizitim</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Profesyonel dijital kartvizit</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Ana sayfa</a>
            <a href="/panel" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Kartlarım</a>
            <a href="#nasil-calisir" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Özellikler</a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Tüm hakları <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Hamza Yaman</strong>'a aittir.
          </p>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            ❤️ ile yapıldı
          </p>
        </div>
      </div>
    </footer>
  )
}
