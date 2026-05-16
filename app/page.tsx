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

type Step = 1 | 2 | 3 | 4

export default function BuilderPage() {
  const [data, setData] = useState<CardData>(defaultCardData)
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState<{ email: string; userId: string } | null>(null)

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
        setTimeout(() => { window.location.href = `/k/${json.id}` }, 1500)
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
      <header style={{ borderBottom: '1px solid #f3f4f6', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#111', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.2"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>Kartvizitim</span>
          <span style={{ fontSize: 12, background: '#f3f4f6', padding: '3px 10px', borderRadius: 20, color: '#6b7280' }}>Ücretsiz</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              <a href="/panel" style={{
                fontSize: 14, fontWeight: 500, color: '#111', textDecoration: 'none',
                padding: '9px 18px', border: '1.5px solid #e5e7eb', borderRadius: 10,
              }}>
                Kartlarım
              </a>
              <button onClick={handleLogout} style={{
                fontSize: 14, color: '#6b7280', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", padding: '9px 14px',
              }}>
                Çıkış
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                fontSize: 14, fontWeight: 600, color: '#fff',
                background: '#111', border: 'none',
                borderRadius: 10, padding: '10px 22px',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              Giriş / Kayıt Ol
            </button>
          )}
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator current={step} onChange={(s) => setStep(s as Step)} />

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1 }}>
        {/* Sol panel */}
        <div style={{ borderRight: '1px solid #f3f4f6', padding: '28px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {stepContent()}

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 20 }}>
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                style={{
                  flex: 1, padding: '12px', fontSize: 14, fontWeight: 500,
                  background: '#fff', color: '#111',
                  border: '1.5px solid #e5e7eb', borderRadius: 10, cursor: 'pointer',
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
                  flex: 1, padding: '12px', fontSize: 14, fontWeight: 600,
                  background: '#111', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
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
                  flex: 1, padding: '12px', fontSize: 14, fontWeight: 600,
                  background: data.values.isim ? '#111' : '#e5e7eb',
                  color: data.values.isim ? '#fff' : '#9ca3af',
                  border: 'none', borderRadius: 10,
                  cursor: data.values.isim ? 'pointer' : 'not-allowed',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {saving ? 'Oluşturuluyor...' : '🔗 Kartı oluştur'}
              </button>
            )}
          </div>

          {!user && step === 4 && (
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
              Kartını kaydetmek için{' '}
              <button onClick={() => setShowAuth(true)} style={{
                background: 'none', border: 'none', color: '#111', fontWeight: 600,
                cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                textDecoration: 'underline',
              }}>
                giriş yap
              </button>
            </p>
          )}
        </div>

        {/* Sağ panel */}
        <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 28, background: '#fafafa' }}>
          <div style={{ maxWidth: 600 }}>
            <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Canlı önizleme
            </p>
            <CardPreview data={data} />
          </div>

          {savedId && (
            <div style={{ maxWidth: 600, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 28px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#111' }}>✅ Kartvizitın hazır!</p>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: '#9ca3af' }}>Yönlendiriliyorsun...</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <input readOnly value={shareUrl} style={{
                  flex: 1, padding: '10px 14px', fontSize: 13,
                  border: '1px solid #e5e7eb', borderRadius: 10,
                  background: '#f9fafb', color: '#374151',
                  fontFamily: "'DM Sans', sans-serif",
                }} />
                <button onClick={handleCopy} style={{
                  padding: '10px 18px', fontSize: 13, fontWeight: 500,
                  background: copied ? '#f0fdf4' : '#111',
                  color: copied ? '#166534' : '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
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
