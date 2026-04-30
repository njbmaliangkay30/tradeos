# TradeOS 🎯
**Personal Crypto Trading Tool** — Calculator + Journal + Anomaly Radar

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Supabase** (PostgreSQL cloud database)
- **Vercel** (deployment)
- **CoinGecko API** (free, no key required)
- **Recharts** (chart library)

---

## 🚀 Deploy ke Vercel (Step-by-step)

### Step 1 — Setup Supabase (5 menit)

1. Buka [supabase.com](https://supabase.com) → New Project
2. Isi nama project: `tradeos`, pilih region: **Southeast Asia (Singapore)**
3. Tunggu project dibuat (~1 menit)
4. Buka **SQL Editor** → New Query → paste isi `supabase_schema.sql` → Run
5. Buka **Settings → API** → copy:
   - `Project URL` → masukkan ke `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → masukkan ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 2 — Push ke GitHub

```bash
git init
git add .
git commit -m "init: TradeOS"
git remote add origin https://github.com/USERNAME/tradeos.git
git push -u origin main
```

### Step 3 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → New Project
2. Import repo GitHub yang baru di-push
3. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` → URL dari Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Key dari Supabase
4. Klik **Deploy** → selesai!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Buat file env
cp .env.example .env.local
# Edit .env.local dengan kredensial Supabase kamu

# Jalankan dev server
npm run dev

# Buka http://localhost:3000
```

> **Tanpa Supabase:** App tetap jalan dengan localStorage sebagai fallback.
> Badge di navbar akan menampilkan "LOCAL" alih-alih "SUPABASE".

---

## ✨ Fitur

### Dashboard
- Equity curve visual
- Metrik: Total P&L, Win Rate, Profit Factor, Expectancy
- P&L breakdown per setup type
- Statistik distribusi (best/worst trade, max drawdown, dll.)

### Kalkulator EV
- Expected Value calculator real-time
- Position sizing otomatis dari risk % + SL
- Simulasi 100 trades
- Verdict: Positif / Negatif / Breakeven
- Pre-trade checklist 8 poin

### Jurnal Histori
- Catat LONG/SHORT dengan entry, exit, size, setup, emosi
- Filter per setup & direction
- Analisis P&L per emosi (deteksi pola psikologis)
- Export CSV

### Radar Anomali
- Watchlist live price dari CoinGecko (gratis)
- Auto-detect: spike harga 1H, volatile 24H, volume anomali, dekat ATH
- Auto-refresh tiap 2 menit
- Trending coins dari CoinGecko
- Shortcut tambah trending ke watchlist

---

## 📋 Catatan

- CoinGecko free tier: ~10-30 req/menit. Jangan refresh terlalu agresif.
- Data tersimpan di Supabase (cloud) atau localStorage (fallback offline)
- App ini untuk penggunaan pribadi — tidak ada autentikasi multi-user
