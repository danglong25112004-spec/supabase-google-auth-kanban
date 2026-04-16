import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('SUPABASE URL =', supabaseUrl)
console.log('SUPABASE KEY EXISTS =', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL. Check your .env file.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Check your .env file.')
}

export const isSupabaseConfigured = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
