-- ============================================================
-- TradeOS — Supabase Schema
-- Jalankan di Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- Table: trades
CREATE TABLE IF NOT EXISTS trades (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  pair        TEXT NOT NULL,
  setup       TEXT,
  direction   TEXT NOT NULL CHECK (direction IN ('LONG','SHORT')),
  entry       NUMERIC(20,8) NOT NULL,
  exit        NUMERIC(20,8) NOT NULL,
  size        NUMERIC(20,2) NOT NULL,
  pnl         NUMERIC(20,4) NOT NULL,
  pnl_pct     NUMERIC(10,4) NOT NULL,
  date        DATE,
  emotion     TEXT,
  note        TEXT
);

-- Table: watchlist
CREATE TABLE IF NOT EXISTS watchlist (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  coin_id     TEXT NOT NULL UNIQUE,
  threshold   INTEGER DEFAULT 200
);

-- Row Level Security (RLS) — personal use, no auth needed
-- Jika kamu ingin tambah auth nanti, aktifkan RLS dan tambah policy per user.
-- Untuk sekarang, pastikan anon key memiliki akses INSERT/SELECT/DELETE.

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS trades_created_at_idx ON trades(created_at DESC);
CREATE INDEX IF NOT EXISTS trades_pair_idx ON trades(pair);
CREATE INDEX IF NOT EXISTS watchlist_coin_id_idx ON watchlist(coin_id);

-- Grant akses untuk anon key (Supabase default)
GRANT ALL ON trades TO anon;
GRANT ALL ON watchlist TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
