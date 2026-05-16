'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { CardData, defaultCardData, TemplateId } from '@/lib/types'
import FieldSelector from '@/components/FieldSelector'
import ValuesForm from '@/components/ValuesForm'
import CardPreview from '@/components/CardPreview'
import TemplatePicker from '@/components/TemplatePicker'
import PhotoUpload from '@/components/PhotoUpload'
import StepIndicator from '@/components/StepIndicator'
import AuthModal from '@/components/AuthModal'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'

type Step = 1 | 2 | 3 | 4

export default function HomePage() {
  const [data, setData] = useState<CardData>(defaultCardData)
  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const builderRef = useRef<HTMLDivElement>(null)

  const shareUrl = savedId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/k/${savedId}` : ''

  const scrollToBuilder = () => {
    builderRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); window.location.reload() }} />
      )}

      <Header onAuthClick={() => setShowAuth(true)} />
      <Hero onStart={scrollToBuilder} />
      <Features />

      {/* Builder section */}
      <section ref={builderRef} style={{ background: 'var(--surface)', padding: '80px 0 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: 'var(--brand-600)', letterSpacing: '0.1em' }}>
              KARTVİZİT OLUŞTURUCU
            </p>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              Hadi kartını oluşturalım
            </h2>
            <p style={{ margin: '12px 0 0', fontSize: 16, color: 'var(--muted)' }}>
              4 basit adım — sonunda paylaşılabilir bir link
            </p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08), 0 0 0 1px var(--border)',
            overflow: 'hidden',
          }}>
            <StepIndicator current={step} onChange={(s) => setStep(s as Step)} />

            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr' }}>
              {/* Sol panel */}
              <div style={{ borderRight: '1px solid var(--border)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: 540 }}>
                {stepContent()}

                <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 20 }}>
                  {step > 1 && (
                    <button onClick={() => setStep((step - 1) as Step)} className="btn-secondary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>
                      ← Geri
                    </button>
                  )}
                  {step < 4 ? (
                    <button onClick={() => setStep((step + 1) as Step)} className="btn-primary" style={{ flex: 1, padding: '13px', fontSize: 14 }}>
                      İleri →
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
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

              {/* Sağ panel */}
              <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--surface)' }}>
                <div>
                  <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Canlı önizleme
                  </p>
                  <CardPreview data={data} />
                </div>

                {savedId && (
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>✅ Kartvizitın hazır!</p>
                    <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)' }}>Yönlendiriliyorsun...</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input readOnly value={shareUrl} style={{ flex: 1, padding: '9px 12px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)', color: 'var(--ink-soft)' }} />
                      <button onClick={handleCopy} className="btn-primary" style={{ padding: '9px 16px', fontSize: 12 }}>
                        {copied ? '✓' : 'Kopyala'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
