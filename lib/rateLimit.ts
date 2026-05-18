import { supabaseAdmin } from './supabaseAdmin'

export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<{ allowed: boolean; remainingMs?: number }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
      p_key: key,
      p_max: maxAttempts,
      p_window_ms: windowMs,
    })

    if (error) {
      console.error('Rate limit DB error:', error)
      return { allowed: true } // DB hatasında isteği geçir, servisi durdurma
    }

    return {
      allowed: data.allowed,
      remainingMs: data.remaining_ms ?? 0,
    }
  } catch (err) {
    console.error('Rate limit exception:', err)
    return { allowed: true }
  }
}

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return ip
}
