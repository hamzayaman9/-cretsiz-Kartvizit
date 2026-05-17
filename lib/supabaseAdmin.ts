import { createClient } from '@supabase/supabase-js'

// Sadece sunucu taraflı API route'larında kullan — tarayıcıya asla gitmiyor
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
