'use client'
import { useState, useCallback, useEffect } from 'react'
import { CardData, defaultCardData, TemplateId } from '@/lib/types'
import FieldSelector from '@/components/FieldSelector'
import ValuesForm from '@/components/ValuesForm'
import CardPreview from '@/components/CardPreview'
import TemplatePicker from '@/components/TemplatePicker'
import PhotoUpload from '@/components/PhotoUpload'
import StepIndicator from '@/components/StepIndicator'
import AuthModal from '@/components/AuthModal'
import Footer from '@/components/Footer'
import QRCode from 'react-qr-code'

type Step = 1 | 2 | 3 | 4

export default function BuilderPage() {
  const [data, setData] = useState<CardData>(defaultCardData)
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState<{ email: string; userId: string } | null>(null)
  const [showQR, setShowQR] = useState(false)

  const shareUrl = savedId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/k/${savedId}` : ''

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user) })
      .catch(() => {})
  }, [])

  const updateField = useCallback((key: keyof CardData['fields'], value: boolean) => {
    setData(d => ({ ...d, fields: { ...d.fields, [key]: value } }))
  }, [])

  const updateValue = useCallback((key: keyof CardData['values'], value: string) => {
    setData(d => ({ ...d, values: { ...d.values, [key]: value } }))
  }, [])

  const setTemplate = useCallback((t: TemplateId) => {
    setData(d => ({ ...d, template: t }))
  }, [])

  const handleSave = async () => {
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
        setTimeout(() => {
          window.location.href = `/k/${json.id}`
        }, 1500)
      }
    } catch {
      alert('Bir hata oluştu.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    setUser(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stepContent = () => {
    switch (step) {
      case 1: return <FieldSelector fields={data.fields} onChange={updateField} />
      case 2: return <ValuesForm values={data.values} fields={data.fields} onChange={updateValue} />
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PhotoUpload label="Profil fotoğrafı" value={data.profilFoto} onChange={v => setData(d => ({ ...d, profilFoto: v }))} hint="Yuvarlak görünür" />
          <PhotoUpload label="Arka plan fotoğrafı" value={data.arkaplanFoto} onChange={v => setData(d => ({ ...d, arkaplanFoto: v }))} hint="Kapak & Gece şablonlarında görünür" />
        </div>
      )
      case 4: return <TemplatePicker selected={data.template} onChange={setTemplate} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(email) => { setUser({ email, userId: '' }); setShowAuth(false) }}
        />
      )}

      {/* Header */}
      <header style={{ borderBottom: '1px solid #f3f4f6', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.2"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Kartvizitim</span>
          <span style={{ fontSize: 11, background: '#f3f4f6', padding: '2px 8px', borderRadius: 20, color: '#6b7280' }}>Ücretsiz</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <a href="/panel" style={{ fontSize: 13, color: '#111', textDecoration: 'none', padding: '7px 14px', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                Kartlarım
              </a>
              <button onClick={handleLogout} style={{ fontSize: 13, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Çıkış
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{ fontSize: 13, fontWeight: 500, color: '#111', background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              Giriş / Kayıt
            </button>
          )}
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator current={step} onChange={(s) => setStep(s as Step)} />

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', flex: 1 }}>
        {/* Sol panel */}
        <div style={{ borderRight: '1px solid #f3f4f6', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {stepContent()}

          {/* Next/Prev buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 16 }}>
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                style={{
                  flex: 1, padding: '10px', fontSize: 13, fontWeight: 500,
                  background: '#fff', color: '#111',
                  border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                ← Geri
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((step + 1) as Step)}
                style={{
                  flex: 1, padding: '10px', fontSize: 13, fontWeight: 500,
                  background: '#111', color: '#fff',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                İleri →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || !data.values.isim}
                style={{
                  flex: 1, padding: '10px', fontSize: 13, fontWeight: 500,
                  background: data.values.isim ? '#111' : '#e5e7eb',
                  color: data.values.isim ? '#fff' : '#9ca3af',
                  border: 'none', borderRadius: 8,
                  cursor: data.values.isim ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {saving ? 'Oluşturuluyor...' : '🔗 Kartı oluştur'}
              </button>
            )}
          </div>

          {/* Login prompt */}
          {!user && step === 4 && (
            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
              Kartını kaydetmek için{' '}
              <button onClick={() => setShowAuth(true)} style={{ background: 'none', border: 'none', color: '#111', fontWeight: 500, cursor: 'pointer', fontSize: 11, fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>
                giriş yap
              </button>
            </p>
          )}
        </div>

        {/* Sağ panel */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 24, background: '#fafafa' }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Canlı önizleme
            </p>
            <CardPreview data={data} />
          </div>

          {savedId && (
            <div style={{ maxWidth: 560, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 500, color: '#111' }}>✅ Kartvizitın hazır!</p>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: '#9ca3af' }}>Yönlendiriliyorsun...</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={shareUrl} style={{ flex: 1, padding: '9px 12px', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb', color: '#374151', fontFamily: "'DM Sans', sans-serif" }} />
                <button onClick={handleCopy} style={{ padding: '9px 14px', fontSize: 13, background: copied ? '#f0fdf4' : '#111', color: copied ? '#166534' : '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  {copied ? '✓' : 'Kopyala'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
