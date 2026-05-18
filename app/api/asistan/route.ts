import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientKey } from '@/lib/rateLimit'

const SYSTEM_PROMPT = `Sen "Kartvizitim" platformunun yapay zeka asistanısın. Kullanıcıyla Türkçe, sıcak ve samimi konuş. Emoji kullanabilirsin ama abartma.

Amacın adım adım sorular sorarak kullanıcının dijital kartviziti için bilgi toplamak ve yaratıcı, kişiselleştirilmiş bir tasarım oluşturmak.

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

ŞABLON SEÇİMİ (mesleğe göre seç - yaratıcı ol):
HER ZAMAN "serbest" şablonunu kullan. cardStyle ile özgün bir tasarım oluştur.

TASARIM KURALLARI (cardStyle ile):
- fontFamily: "sans" (modern), "serif" (klasik/kurumsal), "mono" (teknik/yazılımcı)
- fontSize: "small", "medium", "large"
- borderRadius: "none" (keskin/kurumsal), "small", "medium", "large" (modern/yaratıcı)
- layout: "left", "center", "split"
- bgColor: arka plan rengi (hex, örn: "#1e1b4b")
- textColor: yazı rengi (hex, örn: "#f1f5f9")
- bgGradient: gradient arka plan (örn: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)")

MESLEĞE GÖRE TASARIM:
- Doktor/Sağlık → bgColor: "#f0fdf4", textColor: "#14532d", accentColor: "#16a34a", fontFamily: "sans", borderRadius: "medium"
- Avukat/Hukuk → bgColor: "#0f172a", textColor: "#e2e8f0", accentColor: "#94a3b8", fontFamily: "serif", borderRadius: "none"
- Yazılımcı/Mühendis → bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", textColor: "#e2e8f0", accentColor: "#818cf8", fontFamily: "mono", borderRadius: "small"
- Tasarımcı/Sanatçı → bgGradient: "linear-gradient(135deg, #4c1d95 0%, #be185d 100%)", textColor: "#fce7f3", accentColor: "#f9a8d4", fontFamily: "sans", borderRadius: "large"
- Finans/Bankacı → bgColor: "#1e3a5f", textColor: "#e0f2fe", accentColor: "#38bdf8", fontFamily: "serif", borderRadius: "none"
- Girişimci/CEO → bgGradient: "linear-gradient(135deg, #111827 0%, #374151 100%)", textColor: "#f9fafb", accentColor: "#fbbf24", fontFamily: "sans", borderRadius: "medium"
- Öğretmen/Akademisyen → bgColor: "#fffbeb", textColor: "#1c1917", accentColor: "#d97706", fontFamily: "serif", borderRadius: "small"
- Fotoğrafçı/Yaratıcı → bgColor: "#111827", textColor: "#f9fafb", accentColor: "#a78bfa", fontFamily: "sans", borderRadius: "large"
- Genel → bgColor: "#ffffff", textColor: "#111827", accentColor: "#2563eb", fontFamily: "sans", borderRadius: "medium"

Tüm bilgiler toplandıktan ve kullanıcı onayladıktan sonra yanıtının EN SONUNA şunu ekle (başka hiçbir şey ekleme sonrasına):
[KART_HAZIR:{"template":"serbest","fields":{"isim":true,"unvan":true,"sirket":false,"profil":false,"telefon":true,"eposta":true,"adres":false,"linkedin":false,"twitter":false,"instagram":false,"website":false,"github":false,"youtube":false},"values":{"isim":"","unvan":"","sirket":"","telefon":"","eposta":"","adres":"","linkedin":"","twitter":"","instagram":"","website":"","github":"","youtube":""},"accentColor":"#2563eb","cardStyle":{"fontFamily":"sans","fontSize":"medium","borderRadius":"medium","layout":"left","bgColor":"#ffffff","textColor":"#111827"}}]

fields'ta sadece doldurulan alanlar true olsun. values'ta boş alanlar "" olsun. cardStyle'ı mesleğe göre yukarıdaki rehberden kişiselleştir.`

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
