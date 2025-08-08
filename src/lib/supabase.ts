import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ddkrmsyxgkxgrxpzuyau.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRka3Jtc3l4Z2t4Z3J4cHp1eWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzQ1MDgsImV4cCI6MjA2ODkxMDUwOH0.ZocgC51Wd-GQhXWX3nBtSXiLx2yxbt_CaueunFBwPdI'

export const supabase = createClient(supabaseUrl, supabaseKey)
