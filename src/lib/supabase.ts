import { createClient } from '@supabase/supabase-js'

// --- CONFIG ---
// Sử dụng giá trị từ env, nếu là placeholder thì dùng giá trị thực tế
const ENV_URL = import.meta.env.VITE_SUPABASE_URL
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const REAL_URL = 'https://hsguivmlqrdfqcsyzrcs.supabase.co'
const REAL_KEY = 'sb_publishable_LTWNmPs89Ddsvp7eANTlww_fUrSnr8h'

const isPlaceholder = (val: string | undefined) => {
  if (!val) return true;
  return val.includes('your_supabase') || val.includes('YOUR_SUPABASE') || val === 'placeholder';
};

const supabaseUrl = isPlaceholder(ENV_URL) ? REAL_URL : ENV_URL
const supabaseAnonKey = isPlaceholder(ENV_KEY) ? REAL_KEY : ENV_KEY

console.log('>>> SUPABASE URL IN USE:', supabaseUrl)
// --- CONFIG END ---

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  const msg = `LỖI CẤU HÌNH: URL Supabase không hợp lệ ("${supabaseUrl}").`;
  console.error(msg);
  throw new Error(msg);
}

export const isSupabaseConfigured = true;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
