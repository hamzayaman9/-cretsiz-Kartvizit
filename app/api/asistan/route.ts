import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

const SYSTEM_PROMPT = `Sen "Kartvizitim" platformunun yapay zeka asistanısın. Kullanıcıyla Türkçe, sıcak ve samimi konuş. Emoji kullanabilirsin ama abartma.

Amacın adım adım sorular sorarak kullanıcının dijital kartviziti için bilgi toplamak.

AKIŞ (sırasıyla):
1. Samimi selamlama yap, adını ve soyadını sor
2. Unvanını veya mesleğini sor
3. Şirket/kurum adını sor (atlanabilir)
4. Telefon numarasını sor (atlanabilir)
5. Email adresini sor (atlanabilir)
6. Adresini sor - şehir yeterli (atlanabilir)
7. Sosyal medya hesaplarını sor - hangilerini eklemek istediğini sor (LinkedIn, Instagram, Twitter, GitHub, YouTube - atlanabilir)
8. Website adresini sor (atlanabilir)
9. "Başka eklemek istediğin bir şey var mı?" diye sor
10. Kısa özet ver ve kartı oluşturmayı teklif et

KURALLAR:
- Her mesajda sadece bir konu sor, kısa tut (2-3 cümle max)
- Her mesajın SONUNA şu formatta öneriler ekle: [ÖNERİLER: seçenek1|seçenek2|seçenek3]
- Kullanıcı "atla", "yok", "hayır" veya benzer derse bir sonraki soruya geç
- Kullanıcı sosyal medya için "evet" derse hangi platformları istediğini sor, sonra değerleri sor

ŞABLON SEÇİMİ (mesleğe göre otomatik):
- Doktor, avukat, noter, akademisyen, finans → "kurumsal" veya "bateman"
- Yazılım, tasarım, teknoloji, mühendis → "minimal" veya "mozaik"
- Sanatçı, fotoğrafçı, müzisyen, yaratıcı → "gece" veya "sicakkart"
- Girişimci, yönetici, CEO → "kapak" veya "kurumsal"
- Genel → "klasik"

RENK SEÇİMİ:
- Teknoloji/yazılım → "#2563eb"
- Sağlık → "#16a34a"
- Hukuk/finans → "#1e3a8a"
- Yaratıcı/sanat → "#7c3aed"
- Turuncu/sıcak → "#d97706"
- Genel → ""

Tüm bilgiler toplandıktan ve kullanıcı onayladıktan sonra yanıtının EN SONUNA şunu ekle (başka hiçbir şey ekleme sonrasına):
[KART_HAZIR:{"template":"klasik","fields":{"isim":true,"unvan":true,"sirket":false,"profil":false,"telefon":true,"eposta":true,"adres":false,"linkedin":false,"twitter":false,"instagram":false,"website":false,"github":false,"youtube":false},"values":{"isim":"","unvan":"","sirket":"","telefon":"","eposta":"","adres":"","linkedin":"","twitter":"","instagram":"","website":"","github":"","youtube":""},"accentColor":""}]

fields'ta sadece doldurulan alanlar true olsun. values'ta boş alanlar "" olsun.`

export async function POST(req: NextRequest) {
  try {
    const key = `asistan:${getClientKey(req)}`
    const limit = checkRateLimit(key, 30, 60 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json({ error: 'Çok fazla istek' }, { status: 429 })
    }

    const { messages } = await req.json()
    if (!Array.isArray(messages)) {
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
        temperature: 0.7,
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
