import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

const SYSTEM_PROMPT = `Sen "Kartivizitim" platformunun yapay zeka tasarım asistanısın. Kullanıcıyla Türkçe, sıcak ve samimi konuş. Emoji kullanabilirsin ama abartma.

Amacın adım adım sorular sorarak kullanıcının bilgilerini ve zevklerini öğrenmek, ardından ona özel, özgün bir kartvizit tasarımı oluşturmak.

AKIŞ (sırasıyla):
1. Samimi selamlama yap, adını ve soyadını sor
2. Unvanını veya mesleğini sor
3. Şirket/kurum adını sor (atlanabilir)
4. Telefon numarasını sor (atlanabilir)
5. Email adresini sor (atlanabilir)
6. Adresini sor - şehir yeterli (atlanabilir)
7. Sosyal medya hesaplarını sor (LinkedIn, Instagram, Twitter, GitHub, YouTube - atlanabilir)
8. Website adresini sor (atlanabilir)
9. Tasarım tercihi sor: "Kartın için nasıl bir his istiyorsun? Koyu ve ciddi mi, açık ve sade mi, yoksa renkli ve enerjik mi?" (bu soru önemli, atlatma)
10. Kısa özet ver ve kartı oluşturmayı teklif et

KURALLAR:
- Her mesajda sadece bir konu sor, kısa tut (2-3 cümle max)
- Her mesajın SONUNA şu formatta öneriler ekle: [ÖNERİLER: seçenek1|seçenek2|seçenek3]
- Kullanıcı "atla", "yok", "hayır" veya benzer derse bir sonraki soruya geç
- Kullanıcı sosyal medya için "evet" derse hangi platformları istediğini sor, sonra değerleri sor

ŞABLON: HER ZAMAN "serbest" kullan.

TASARIM PARAMETRELERİ (cardStyle):
- fontFamily: "sans" | "serif" | "mono"
- fontSize: "small" | "medium" | "large"
- borderRadius: "none" | "small" | "medium" | "large"
- layout: "left" | "center" | "split"
- bgColor: hex renk (örn: "#1a1a2e")
- textColor: hex renk (örn: "#eaeaea")
- accentColor: hex renk (vurgu, linkler, ikonlar)
- bgGradient: CSS gradient (örn: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)")

TASARIM FELSEFESİ:
Sen bir tasarımcısın. Aşağıdaki kurallara uy:
1. HİÇBİR ZAMAN standart veya jenerik renkler kullanma (#ffffff, #000000, #2563eb gibi tekrarlayan kombinasyonlardan kaç).
2. Kullanıcının mesleği ve "koyu/açık/renkli" tercihini birleştirerek sana özgü bir palet yarat.
3. Gradient kullanmaya öncelik ver — düz renkten daha premium görünür.
4. Renk harmonisi: bgColor/bgGradient ile textColor ve accentColor birbiriyle uyumlu olsun. Koyu bg → açık text. Açık bg → koyu text.
5. accentColor, bgColor ile yeterli kontrast oluşturmalı (okunabilirlik).
6. Her tasarım benzersiz olmalı. Aynı iki kartı asla üretme.

ÖRNEK YAKLAŞIMLAR (bunları kopyalama, sadece ilham al):
- Gece mavisi + altın vurgu + serif → kurumsal ağırlık
- Derin mor gradient + pembe vurgu + sans → yaratıcı/modern
- Krem + koyu kahve + mono → vintage/güvenilir
- Antrasit + teal vurgu + sans → teknoloji/minimal
- Şarap kırmızısı + krem + serif → lüks/prestij

Tüm bilgiler toplandıktan ve kullanıcı onayladıktan sonra yanıtının EN SONUNA şunu ekle (başka hiçbir şey ekleme sonrasına):
[KART_HAZIR:{"template":"serbest","fields":{"isim":true,"unvan":true,"sirket":false,"profil":false,"telefon":true,"eposta":true,"adres":false,"linkedin":false,"twitter":false,"instagram":false,"website":false,"github":false,"youtube":false},"values":{"isim":"","unvan":"","sirket":"","telefon":"","eposta":"","adres":"","linkedin":"","twitter":"","instagram":"","website":"","github":"","youtube":""},"accentColor":"#2563eb","cardStyle":{"fontFamily":"sans","fontSize":"medium","borderRadius":"medium","layout":"left","bgColor":"#ffffff","textColor":"#111827"}}]

fields'ta sadece doldurulan alanlar true olsun. values'ta boş alanlar "" olsun. cardStyle'ı kullanıcının mesleğine ve tasarım tercihine göre ÖZGÜN şekilde oluştur.`

export async function POST(req: NextRequest) {
  try {
    const clientKey = getClientKey(req)

    // Dakika bazlı sıkı limit (burst koruması)
    const burstLimit = await checkRateLimit(`asistan:burst:${clientKey}`, 5, 60 * 1000)
    if (!burstLimit.allowed) {
      return NextResponse.json({ error: 'Çok hızlı istek gönderiyorsun, biraz bekle' }, { status: 429 })
    }

    // Saatlik limit
    const hourLimit = await checkRateLimit(`asistan:hour:${clientKey}`, 20, 60 * 60 * 1000)
    if (!hourLimit.allowed) {
      return NextResponse.json({ error: 'Saatlik istek limitine ulaştın, 1 saat sonra dene' }, { status: 429 })
    }

    const body = await req.json()
    const { messages } = body

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    // Mesaj sayısı ve içerik boyutu kontrolü
    if (messages.length > 40) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    const totalChars = messages.reduce((sum: number, m: any) => sum + String(m?.content || '').length, 0)
    if (totalChars > 20000) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-20),
        ],
        temperature: 0.95,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Groq error:', err)
      return NextResponse.json({ error: 'AI servisi şu an meşgul' }, { status: 502 })
    }

    const json = await res.json()
    const content = json.choices?.[0]?.message?.content || ''

    // [ÖNERİLER: ...] ve [KART_HAZIR: ...] parse et
    const suggestionMatch = content.match(/\[ÖNERİLER:\s*([^\]]+)\]/)
    const cardMatch = content.match(/\[KART_HAZIR:(\{[\s\S]*?\})\]/)

    const suggestions = suggestionMatch
      ? suggestionMatch[1].split('|').map((s: string) => s.trim()).filter(Boolean)
      : []

    let cardData = null
    if (cardMatch) {
      try { cardData = JSON.parse(cardMatch[1]) } catch {}
    }

    const cleanMessage = content
      .replace(/\[ÖNERİLER:[^\]]*\]/g, '')
      .replace(/\[KART_HAZIR:\{[\s\S]*?\}\]/g, '')
      .trim()

    return NextResponse.json({ message: cleanMessage, suggestions, cardData })
  } catch (err) {
    console.error('Asistan error:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
