import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ddkrmsyxgkxgrxpzuyau.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRka3Jtc3l4Z2t4Z3J4cHp1eWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzQ1MDgsImV4cCI6MjA2ODkxMDUwOH0.ZocgC51Wd-GQhXWX3nBtSXiLx2yxbt_CaueunFBwPdI' // 클라이언트는 anon 키가 맞습니다 (service role 절대 X)

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,     
    autoRefreshToken: true,
    detectSessionInUrl: true,    
    storageKey: 'loch-auth',   
  },
})
