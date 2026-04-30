'use client'
import { useState, useEffect, useCallback } from 'react'
import { WatchlistItem, CoinData } from '@/lib/supabase'
import { fmtPrice, fmtBig } from '@/lib/utils'
import { Card, CardHeader, Btn, Badge, Empty } from './UI'

type Anomaly = {
  coinName: string; symbol: string; type: string
  value: string; color: 'red' | 'amber' | 'blue' | 'green'; icon: string
  ts: number
}

type Props = {
  watchlist: WatchlistItem[]
  onAdd: (coin_id: string, threshold: number) => Promise<void>
  onRemove: (id: number) => Promise<void>
}

export default function Radar({ watchlist, onAdd, onRemove }: Props) {
  const [coinInput, setCoinInput] = useState('')
  const [threshold, setThreshold] = useState(200)
  const [priceData, setPriceData] = useState<Record<string, CoinData>>({})
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [loadingTrending, setLoadingTrending] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchPrices = useCallback(async () => {
    if (!watchlist.length) return
    setLoadingPrices(true)
    const ids = watchlist.map(w => w.coin_id).join(',')
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=1h,24h`
      )
      if (!res.ok) throw new Error('Rate limited')
      const data: CoinData[] = await res.json()
      const map: Record<string, CoinData> = {}
      data.forEach(c => { map[c.id] = c })
      setPriceData(map)
      detectAnomalies(map)
      setLastRefresh(new Date())
    } catch (e) {
      console.warn('CoinGecko fetch error:', e)
    }
    setLoadingPrices(false)
  }, [watchlist])

  function detectAnomalies(data: Record<string, CoinData>) {
    const found: Anomaly[] = []
    watchlist.forEach(w => {
      const c = data[w.coin_id]
      if (!c) return
      const ch1h = Math.abs(c.price_change_percentage_1h_in_currency || 0)
      const ch24h = Math.abs(c.price_change_percentage_24h || 0)
      const volRatio = c.market_cap > 0 ? (c.total_volume / c.market_cap * 100) : 0

      if (ch1h > 5)
        found.push({ coinName: c.name, symbol: c.symbol, type: 'Spike Harga 1H', value: ch1h.toFixed(2) + '%', color: 'red', icon: '⚡', ts: Date.now() })
      if (ch24h > 20)
        found.push({ coinName: c.name, symbol: c.symbol, type: 'Volatile 24H', value: ch24h.toFixed(2) + '%', color: 'amber', icon: '🔥', ts: Date.now() })
      if (volRatio > w.threshold / 10)
        found.push({ coinName: c.name, symbol: c.symbol, type: 'Volume Anomali', value: volRatio.toFixed(1) + '% of mcap', color: 'blue', icon: '📊', ts: Date.now() })
      if (c.ath_change_percentage && c.ath_change_percentage > -5)
        found.push({ coinName: c.name, symbol: c.symbol, type: 'Dekat ATH', value: (c.ath_change_percentage ?? 0).toFixed(2) + '%', color: 'green', icon: '🎯', ts: Date.now() })
    })
    setAnomalies(found)
  }

  async function loadTrending() {
    setLoadingTrending(true)
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/search/trending')
      if (!res.ok) throw new Error('Rate limited')
      const data = await res.json()
      setTrending(data.coins?.slice(0, 9) || [])
    } catch (e) {
      setTrending([])
    }
    setLoadingTrending(false)
  }

  useEffect(() => {
    fetchPrices()
    loadTrending()
  }, [watchlist.length])

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const timer = setInterval(fetchPrices, 120_000)
    return () => clearInterval(timer)
  }, [fetchPrices])

  async function handleAdd() {
    const id = coinInput.trim().toLowerCase()
    if (!id) return
    await onAdd(id, threshold)
    setCoinInput('')
    setTimeout(fetchPrices, 500)
  }

  const SUGGESTIONS = ['bitcoin', 'ethereum', 'solana', 'sui', 'the-open-network', 'aptos', 'arbitrum']

  return (
    <div className="fade-in">
      {/* Add to watchlist */}
      <Card style={{ marginBottom: '1rem' }}>
        <CardHeader title="Tambah Aset ke Watchlist" right={
          lastRefresh && (
            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>
              Refresh: {lastRefresh.toLocaleTimeString()}
            </span>
          )
        } />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label>CoinGecko ID</label>
            <input
              value={coinInput}
              onChange={e => setCoinInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="bitcoin, ethereum, solana, sui..."
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Volume Alert Threshold (%)</label>
            <input type="number" value={threshold} min={50} max={2000} onChange={e => setThreshold(+e.target.value)} />
          </div>
          <Btn variant="primary" onClick={handleAdd}>+ Pantau</Btn>
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {SUGGESTIONS.filter(s => !watchlist.find(w => w.coin_id === s)).map(s => (
            <span key={s} onClick={() => setCoinInput(s)} style={{
              padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: 11, cursor: 'pointer',
              border: '1px solid var(--border)', color: 'var(--text3)',
              transition: 'all 0.2s',
            }}>{s}</span>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: '0.5rem' }}>
          ⚠ CoinGecko free tier: 10–30 req/menit. Data refresh otomatis tiap 2 menit.
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Watchlist */}
        <Card>
          <CardHeader title="Watchlist Live" right={
            <Btn variant="ghost" size="sm" onClick={fetchPrices}>
              {loadingPrices ? '⟳ Loading...' : '↻ Refresh'}
            </Btn>
          } />
          {!watchlist.length
            ? <Empty icon="👁" text="Belum ada aset dipantau" />
            : watchlist.map(w => {
              const c = priceData[w.coin_id]
              const ch24 = c?.price_change_percentage_24h ?? null
              const ch1h = c?.price_change_percentage_1h_in_currency ?? null
              return (
                <div key={w.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--accent2)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 10, fontWeight: 700,
                    color: 'var(--accent)', flexShrink: 0, fontFamily: 'monospace',
                  }}>
                    {(c?.symbol || w.coin_id).toUpperCase().slice(0, 4)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c?.name || w.coin_id}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                      Vol 24h: ${c ? fmtBig(c.total_volume) : '—'}
                    </div>
                  </div>
                  {c ? (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>
                        ${fmtPrice(c.current_price)}
                      </div>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
                        {ch1h !== null && (
                          <span style={{ fontSize: 10, fontFamily: 'monospace', color: ch1h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                            1h: {ch1h >= 0 ? '+' : ''}{ch1h.toFixed(2)}%
                          </span>
                        )}
                        {ch24 !== null && (
                          <span style={{ fontSize: 10, fontFamily: 'monospace', color: ch24 >= 0 ? 'var(--green)' : 'var(--red)' }}>
                            24h: {ch24 >= 0 ? '+' : ''}{ch24.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Memuat...</span>
                  )}
                  <Btn variant="danger" size="sm" onClick={() => onRemove(w.id)}>✕</Btn>
                </div>
              )
            })
          }
        </Card>

        {/* Anomalies */}
        <Card>
          <CardHeader title="Anomali Terdeteksi" right={
            anomalies.length > 0
              ? <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>{anomalies.length} sinyal</span>
              : undefined
          } />
          {!anomalies.length
            ? <Empty icon="📡" text="Tidak ada anomali saat ini. Radar berjalan." />
            : anomalies.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, fontSize: 14,
                  background: `var(--${a.color}2)`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {a.coinName} <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>{a.symbol?.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{a.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: `var(--${a.color})` }}>{a.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>just now</div>
                </div>
              </div>
            ))
          }
        </Card>
      </div>

      {/* Trending */}
      <Card>
        <CardHeader title="Trending CoinGecko (Top 9)" right={
          <Btn variant="ghost" size="sm" onClick={loadTrending}>
            {loadingTrending ? '⟳ Loading...' : '↻ Refresh'}
          </Btn>
        } />
        {loadingTrending
          ? <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)', fontSize: 13 }}>Memuat data trending...</div>
          : !trending.length
            ? <Empty icon="🔥" text="Klik Refresh untuk mengambil data trending" />
            : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '0.75rem' }}>
                {trending.map((c: any, i: number) => (
                  <div key={c.item?.id} style={{
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '0.9rem', cursor: 'pointer',
                    transition: 'border 0.2s',
                  }}
                    onClick={() => setCoinInput(c.item?.id || '')}
                    title="Klik untuk tambah ke watchlist"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'monospace' }}>#{i + 1}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{c.item?.symbol}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>{c.item?.name}</div>
                    {c.item?.data?.price_change_percentage_24h?.usd !== undefined && (
                      <div style={{
                        fontSize: 11, fontFamily: 'monospace', marginTop: '0.35rem',
                        color: c.item.data.price_change_percentage_24h.usd >= 0 ? 'var(--green)' : 'var(--red)',
                      }}>
                        {c.item.data.price_change_percentage_24h.usd >= 0 ? '+' : ''}
                        {c.item.data.price_change_percentage_24h.usd.toFixed(2)}%
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                      + tambah ke watchlist
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </Card>
    </div>
  )
}
