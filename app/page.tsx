'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { CardData, CardStyle, defaultCardData, TemplateId } from '@/lib/types'
import FieldSelector from '@/components/FieldSelector'
import ValuesForm from '@/components/ValuesForm'
import CardPreview from '@/components/CardPreview'
import TemplatePicker from '@/components/TemplatePicker'
import PhotoUpload from '@/components/PhotoUpload'
import QRCode from 'react-qr-code'
import { downloadQR } from '@/lib/downloads'
import StepIndicator from '@/components/StepIndicator'
import AuthModal from '@/components/AuthModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import StyleBar from '@/components/StyleBar'

type Step = 1 | 2 | 3 | 4

export default function HomePage() {
  const [data, setData] = useState<CardData>(defaultCardData)
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showAuthForSave, setShowAuthForSave] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [claimed, setClaimed] = useState(false)
  const builderRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const shareUrl = savedId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/k/${savedId}` : ''

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user) })
  }, [])

  const scrollToBuilder = () => builderRef.current?.scrollIntoView({ behavior: 'smooth' })

  const updateField = useCallback((key: keyof CardData['fields'], value: boolean) => setData(d => ({ ...d, fields: { ...d.fields, [key]: value } })), [])
  const updateValue = useCallback((key: keyof CardData['values'], value: string) => setData(d => ({ ...d, values: { ...d.values, [key]: value } })), [])
  const setTemplate = useCallback((t: TemplateId) => setData(d => ({ ...d, template: t })), [])
  const setAccentColor = useCallback((c: string) => setData(d => ({ ...d, accentColor: c })), [])
  const setCardStyle = useCallback((s: CardStyle) => setData(d => ({ ...d, cardStyle: s })), [])

  const handleCreate = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.id) {
        setSavedId(json.id)
        // Yeni sekmede aç
        window.open(`/k/${json.id}`, '_blank')
        // Sonuç alanına scroll
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
      }
    } catch {
      alert('Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  const handleClaim = async () => {
    if (!savedId) return
    try {
      const res = await fetch('/api/card/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: savedId }),
      })
      const json = await res.json()
      if (json.success) {
        setClaimed(true)
      } else {
        alert(json.error || 'Kart kaydedilemedi')
      }
    } catch {
      alert('Bir hata oluştu')
    }
  }

  const handleAuthSuccess = async (email: string) => {
    setUser({ email })
    setShowAuth(false)
    setShowAuthForSave(false)
    // Eğer kart oluşturduysa otomatik bağla
    if (savedId && !claimed) {
      await handleClaim()
    }
  }

  const handleSaveClick = () => {
    if (user) {
      handleClaim()
    } else {
      setShowAuthForSave(true)
    }
  }

  const handleCopy = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const stepContent = () => {
    switch (step) {
      case 1: return <FieldSelector fields={data.fields} onChange={updateField} />
      case 2: return <ValuesForm values={data.values} fields={data.fields} onChange={updateValue} />
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <PhotoUpload label="Profil fotoğrafı" value={data.profilFoto} onChange={v => setData(d => ({ ...d, profilFoto: v }))} hint="Yuvarlak görünür" />
          <PhotoUpload label="Arka plan fotoğrafı" value={data.arkaplanFoto} onChange={v => setData(d => ({ ...d, arkaplanFoto: v }))} hint="Kapak & Gece şablonlarında görünür" />
        </div>
      )
      case 4: return <TemplatePicker selected={data.template} onChange={setTemplate} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {(showAuth || showAuthForSave) && (
        <AuthModal onClose={() => { setShowAuth(false); setShowAuthForSave(false) }} onSuccess={handleAuthSuccess} />
      )}

      <Header onAuthClick={() => setShowAuth(true)} />
      <Hero onStart={scrollToBuilder} />
      <Features />

      <section ref={builderRef} className="mobile-section" style={{ background: 'var(--surface)', padding: '80px 0 60px' }}>
        <div className="mobile-padding" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>
              KARTVİZİT OLUŞTURUCU
            </p>
            <h2 className="mobile-builder-title" style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Hadi kartını oluşturalım
            </h2>
            <p style={{ margin: '12px 0 0', fontSize: 16, color: 'var(--muted)' }}>
              4 basit adım — sonunda paylaşılabilir bir link
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08), 0 0 0 1px var(--border)', overflow: 'hidden' }}>
            <StepIndicator current={step} onChange={(s) => setStep(s as Step)} />

            <div className="desktop-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr' }}>
              <div className="mobile-card-padding" style={{ borderRight: '1px solid var(--border)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: 540 }}>
                {stepContent()}

                <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 20 }}>
                  {step > 1 && (
                    <button onClick={() => setStep((step - 1) as Step)} className="btn-secondary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>← Geri</button>
                  )}
                  {step < 4 ? (
                    <button onClick={() => setStep((step + 1) as Step)} className="btn-primary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>İleri →</button>
                  ) : (
                    <button
                      onClick={handleCreate}
                      disabled={saving || !data.values.isim}
                      className={data.values.isim ? 'btn-primary' : ''}
                      style={{
                        flex: 1, padding: '13px', fontSize: 14, fontWeight: 600,
                        background: data.values.isim ? undefined : '#e2e8f0',
                        color: data.values.isim ? '#fff' : '#94a3b8',
                        border: 'none', borderRadius: 12,
                        cursor: data.values.isim ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {saving ? 'Oluşturuluyor...' : '🔗 Kartı oluştur'}
                    </button>
                  )}
                </div>
              </div>

              <div className="desktop-only mobile-card-padding" style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--surface)' }}>
                <div>
                  <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Canlı önizleme
                  </p>
                  <CardPreview data={data} />
                </div>
                <StyleBar accentColor={data.accentColor || ''} onColorChange={setAccentColor} cardStyle={data.cardStyle || {}} onStyleChange={setCardStyle} />
              </div>
            </div>
          </div>

          {/* Mobil önizleme */}
          <div className="mobile-bottom-preview" style={{ display: 'none', marginTop: 20, background: '#fff', borderRadius: 16, padding: 20, border: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Önizleme
            </p>
            <CardPreview data={data} />
          </div>

          {/* Sonuç paneli */}
          {savedId && (
            <div ref={resultRef} style={{ marginTop: 32, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08), 0 0 0 1px var(--border)', padding: '32px', maxWidth: 600, margin: '32px auto 0' }} className="fade-up">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 12 }}>✓</div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>Kartvizitin hazır!</h3>
                <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--muted)' }}>Yeni sekmede açıldı. Linki paylaşabilir veya kaydedebilirsin.</p>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input readOnly value={shareUrl} style={{ flex: 1, padding: '11px 14px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', color: 'var(--ink-soft)' }} />
                <button onClick={handleCopy} className="btn-primary" style={{ padding: '11px 18px', fontSize: 13 }}>
                  {copied ? '✓' : 'Kopyala'}
                </button>
              </div>

              <a href={`/k/${savedId}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: 14, padding: '11px', marginBottom: 16 }}>
                Kartviziti görüntüle ↗
              </a>

              {/* QR Kod */}
              <div style={{ background: 'var(--surface)', borderRadius: 14, padding: '16px', textAlign: 'center', marginBottom: 16, border: '1px solid var(--border)' }}>
                <div id="qr-code-svg" style={{ display: 'inline-block', background: '#fff', padding: 8 }}>
                  <QRCode value={shareUrl} size={120} />
                </div>
                <p style={{ margin: '8px 0 8px', fontSize: 11, color: 'var(--muted)' }}>QR kodu telefonla okut</p>
                <button onClick={() => downloadQR(shareUrl, `kartvizit-qr.png`)} className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
                  QR İndir (PNG)
                </button>
              </div>

              {/* Kaydet butonu */}
              {!claimed ? (
                <div style={{ background: 'linear-gradient(135deg, var(--brand-50), #dbeafe)', borderRadius: 14, padding: '20px 22px', border: '1px solid var(--brand-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ fontSize: 28 }}>💾</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--brand-900)' }}>
                        Kartını hesabına kaydet
                      </p>
                      <p style={{ margin: '4px 0 12px', fontSize: 12, color: 'var(--brand-700)' }}>
                        {user ? 'Tek tıkla kartını hesabına ekle, istediğin zaman düzenle.' : 'Hesap oluştur, kartını sakla, istediğin zaman düzenle.'}
                      </p>
                      <button onClick={handleSaveClick} className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
                        {user ? '💾 Hesabıma kaydet' : '✨ Kayıt ol ve kaydet'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '16px 22px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 22 }}>✅</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#166534' }}>Hesabına kaydedildi!</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#15803d' }}>
                      <a href="/panel" style={{ color: '#15803d', textDecoration: 'underline' }}>Kartlarım sayfasından</a> düzenleyebilirsin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
