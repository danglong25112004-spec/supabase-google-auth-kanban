import { createClient } from '@supabase/supabase-js'

// --- DEBUG START ---
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('>>> DEBUG SUPABASE URL:', rawUrl)
console.log('>>> DEBUG SUPABASE KEY EXISTS:', !!rawKey)
// --- DEBUG END ---

const supabaseUrl = rawUrl
const supabaseAnonKey = rawKey

const isPlaceholder = (val: string | undefined) => {
  if (!val) return true;
  const placeholders = [
    'your_supabase_project_url',
    'your_supabase_anon_key',
    'YOUR_SUPABASE_URL',
    'YOUR_SUPABASE_ANON_KEY',
    'placeholder'
  ];
  return placeholders.some(p => val.includes(p));
};

if (!supabaseUrl || !supabaseUrl.startsWith('http') || isPlaceholder(supabaseUrl)) {
  const msg = `LỖI CẤU HÌNH: URL Supabase không hợp lệ ("${supabaseUrl}"). Vui lòng kiểm tra file .env`;
  console.error(msg);
  throw new Error(msg);
}

if (!supabaseAnonKey || isPlaceholder(supabaseAnonKey)) {
  const msg = `LỖI CẤU HÌNH: Key Supabase không hợp lệ. Vui lòng kiểm tra file .env`;
  console.error(msg);
  throw new Error(msg);
}

export const isSupabaseConfigured = true;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
