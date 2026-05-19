'use client'
import { useState, useRef, useEffect } from 'react'
import LogoText from '@/components/LogoText'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface BotResponse {
  message: string
  suggestions: string[]
  cardData: any | null
}

export default function AsistanPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [cardData, setCardData] = useState<any | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startConversation()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const startConversation = async () => {
    setLoading(true)
    const res = await callBot([])
    if (res) {
      setMessages([{ role: 'assistant', content: res.message }])
      setSuggestions(res.suggestions)
      if (res.cardData) setCardData(res.cardData)
    }
    setLoading(false)
  }

  const callBot = async (msgs: Message[]): Promise<BotResponse | null> => {
    try {
      const res = await fetch('/api/asistan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      })
      if (res.status === 429) {
        const data = await res.json()
        if (data.error === 'BLOCKED') setBlocked(true)
        return null
      }
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setSuggestions([])
    setLoading(true)
    inputRef.current?.focus()

    const res = await callBot(newMessages)
    if (res) {
      setMessages(m => [...m, { role: 'assistant', content: res.message }])
      setSuggestions(res.suggestions)
      if (res.cardData) setCardData(res.cardData)
    } else {
      setMessages(m => [...m, { role: 'assistant', content: 'Bir sorun oluştu, tekrar dener misin?' }])
    }
    setLoading(false)
  }

  const handleCreateCard = async () => {
    if (!cardData) return
    setCreating(true)
    try {
      const res = await fetch('/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      })
      const json = await res.json()
      if (json.id) {
        window.location.href = `/k/${json.id}`
      }
    } catch {
      alert('Kart oluşturulamadı, tekrar dene.')
    } finally {
      setCreating(false)
    }
  }

  if (blocked) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#1e293b', borderRadius: 20, padding: '48px 40px', textAlign: 'center', maxWidth: 420, border: '1px solid rgba(239,68,68,0.3)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚨</div>
        <h2 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: '#f87171' }}>Şüpheli Aktivite Tespit Edildi</h2>
        <p style={{ margin: '0 0 8px', fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
          Yoğun mesaj gönderimi <strong style={{ color: '#fca5a5' }}>otomatik saldırı</strong> olarak algılandı.
        </p>
        <p style={{ margin: '0 0 28px', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
          IP adresiniz <strong style={{ color: '#94a3b8' }}>30 dakika</strong> süreyle erişime kapatılmıştır.
          Normal kullanıcıysanız 30 dakika sonra tekrar deneyebilirsiniz.
        </p>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 16px', fontSize: 12, color: '#f87171', marginBottom: 24 }}>
          Bu işlem güvenlik sistemimiz tarafından otomatik olarak kaydedilmiştir.
        </div>
        <a href="/" style={{ display: 'inline-block', fontSize: 13, color: '#64748b', textDecoration: 'none' }}>
          ← Ana sayfaya dön
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="9" rx="2" stroke="white" strokeWidth="1.4"/>
              <path d="M4 13H10" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M7 10V13" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <LogoText size={15} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>AI Asistan</span>
        </div>
      </header>

      {/* Chat alanı */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680, width: '100%', margin: '0 auto' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 10, marginTop: 2, fontSize: 14 }}>
                ✨
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#fff',
              color: msg.role === 'user' ? '#fff' : 'var(--ink)',
              fontSize: 14,
              lineHeight: 1.6,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✨</div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '12px 18px', display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#94a3b8',
                  animation: 'bounce 1.2s infinite',
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Kart hazır butonu */}
        {cardData && !loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 42 }}>
            <button
              onClick={handleCreateCard}
              disabled={creating}
              className="btn-primary"
              style={{ fontSize: 14, padding: '13px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {creating ? 'Oluşturuluyor...' : '🎉 Kartımı Oluştur'}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Alt alan: öneriler + input */}
      <div style={{ borderTop: '1px solid var(--border)', background: '#fff', padding: '12px 16px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Öneri butonları */}
          {suggestions.length > 0 && !loading && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    border: '1.5px solid var(--brand-200)',
                    background: 'var(--brand-50)',
                    color: 'var(--brand-700)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-100)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--brand-50)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Mesajını yaz..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 14,
                border: '1.5px solid var(--border)',
                fontSize: 14,
                outline: 'none',
                background: loading ? 'var(--surface)' : '#fff',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 46, height: 46,
                borderRadius: 14,
                background: input.trim() && !loading ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#e2e8f0',
                border: 'none',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={input.trim() && !loading ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={input.trim() && !loading ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
