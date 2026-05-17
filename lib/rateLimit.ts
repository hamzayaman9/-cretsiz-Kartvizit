// Basit in-memory rate limiter
// Production'da Redis kullanılır ama bu yapı 10K kullanıcıya kadar yeter

interface Attempt {
  count: number
  resetAt: number
}

const attempts = new Map<string, Attempt>()

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remainingMs?: number } {
  const now = Date.now()
  const existing = attempts.get(key)

  if (!existing || existing.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (existing.count >= maxAttempts) {
    return { allowed: false, remainingMs: existing.resetAt - now }
  }

  existing.count++
  return { allowed: true }
}

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return ip
}

// Periyodik temizlik - her 5 dakikada bir
if (typeof globalThis !== 'undefined' && !(globalThis as any).__rateLimitCleanup) {
  ;(globalThis as any).__rateLimitCleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, val] of attempts.entries()) {
      if (val.resetAt < now) attempts.delete(key)
    }
  }, 5 * 60 * 1000)
}
