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

-- ============================================================
-- Row Level Security
-- Diaktifkan agar Supabase tidak report warning.
-- Policy: izinkan anon key penuh (personal use, single user).
-- Jika nanti multi-user, ganti policy dengan auth.uid() check.
-- ============================================================

ALTER TABLE trades  ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Policy untuk trades: anon bisa SELECT, INSERT, DELETE, UPDATE
CREATE POLICY "anon_all_trades" ON trades
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy untuk watchlist: anon bisa SELECT, INSERT, DELETE, UPDATE
CREATE POLICY "anon_all_watchlist" ON watchlist
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Indexes
-- Hanya buat index yang benar-benar dipakai oleh query app.
-- trades_created_at_idx: dipakai pada ORDER BY created_at DESC
-- coin_id sudah ter-index otomatis oleh UNIQUE constraint — tidak perlu index manual.
-- trades_pair_idx dihapus: filtering pair dilakukan di client, bukan DB query.
-- ============================================================

CREATE INDEX IF NOT EXISTS trades_created_at_idx ON trades(created_at DESC);

-- Grant sequence access
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
