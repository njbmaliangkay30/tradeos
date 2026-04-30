import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Trade = {
  id: number
  created_at: string
  pair: string
  setup: string | null
  direction: 'LONG' | 'SHORT'
  entry: number
  exit: number
  size: number
  pnl: number
  pnl_pct: number
  date: string | null
  emotion: string | null
  note: string | null
}

export type WatchlistItem = {
  id: number
  created_at: string
  coin_id: string
  threshold: number
}

export type CoinData = {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency: number
  total_volume: number
  market_cap: number
  ath_change_percentage: number
}
