'use client'

interface Props {
  onStart: () => void
}

export default function Hero({ onStart }: Props) {
  return (
    <section className="hero-gradient mobile-section" style={{ padding: '80px 32px 64px', position: 'relative', overflow: 'hidden' }}>
      <div className="mobile-hero-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center' }}>
        <div className="fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: 30, padding: '6px 14px', marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-600)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-700)', letterSpacing: '0.02em' }}>
              ÜCRETSİZ • HESAPSIZ KULLAN
            </span>
          </div>

          <h1 className="mobile-hero-title" style={{
            margin: 0, fontFamily: 'var(--font-display)',
            fontSize: 56, lineHeight: 1.05, fontWeight: 800,
            color: 'var(--ink)', letterSpacing: '-0.025em',
          }}>
            Dijital kimliğin{' '}
            <span style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              tek tıkla
            </span>{' '}
            yanında
          </h1>

          <p style={{ margin: '24px 0 36px', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: 520 }}>
            Profesyonel dijital kartvizit oluştur, link veya QR kod ile saniyeler içinde paylaş.
            Kâğıt israfına son.
          </p>

          <div className="mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={onStart} className="btn-primary" style={{ fontSize: 16 }}>
              Hemen başla →
            </button>
            <a href="#nasil-calisir" style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-soft)', textDecoration: 'none', textAlign: 'center' }}>
              Nasıl çalışır?
            </a>
          </div>

          <div className="mobile-stat-row" style={{ display: 'flex', gap: 32, marginTop: 48 }}>
            {[
              { num: '11', label: 'Hazır şablon' },
              { num: '∞', label: 'Sınırsız kart' },
              { num: '0₺', label: 'Maliyet' },
            ].map(s => (
              <div key={s.label}>
                <p className="mobile-stat-num" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--brand-700)' }}>{s.num}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up fade-delay-2" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, marginLeft: 'auto' }}>
            <div style={{
              background: '#fff', borderRadius: 18, padding: 28,
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
              border: '1px solid var(--border)',
              transform: 'rotate(-2deg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #dbeafe, #93c5fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-700)', fontWeight: 700, fontSize: 18 }}>AY</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)', fontSize: 16 }}>Ahmet Yılmaz</p>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>Yazılım Geliştirici</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>📞 +90 532 000 00 00</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>✉️ ahmet@ornek.com</p>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>🔗 linkedin.com/in/ahmetyilmaz</p>
              </div>
            </div>

            <div style={{
              alignSelf: 'flex-end', maxWidth: 280,
              background: 'var(--brand-950)', color: '#fff',
              borderRadius: 18, padding: 24,
              boxShadow: '0 20px 60px rgba(15, 23, 42, 0.2)',
              transform: 'rotate(2deg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 6 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>EY</div>
                <p style={{ margin: '6px 0 0', fontWeight: 600, fontSize: 15 }}>Elif Yılmaz</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Marketing Director</p>
                <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.2)', margin: '8px 0' }} />
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>elif@ornek.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
