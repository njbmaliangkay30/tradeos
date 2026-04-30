'use client'
import { useState, useEffect } from 'react'
import { supabase, Trade, WatchlistItem } from '@/lib/supabase'
import Dashboard from './Dashboard'
import Calculator from './Calculator'
import Journal from './Journal'
import Radar from './Radar'

export type AppTab = 'dashboard' | 'calculator' | 'journal' | 'radar'

export default function TradeApp() {
  const [tab, setTab] = useState<AppTab>('dashboard')
  const [trades, setTrades] = useState<Trade[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    checkDbAndLoad()
  }, [])

  async function checkDbAndLoad() {
    try {
      const { error } = await supabase.from('trades').select('id').limit(1)
      if (error) {
        console.warn('Supabase not configured, using localStorage fallback')
        loadFromLocalStorage()
        setDbReady(false)
      } else {
        setDbReady(true)
        await Promise.all([loadTrades(), loadWatchlist()])
      }
    } catch {
      loadFromLocalStorage()
      setDbReady(false)
    }
    setLoading(false)
  }

  function loadFromLocalStorage() {
    const t = JSON.parse(localStorage.getItem('tradeos_trades') || '[]')
    const w = JSON.parse(localStorage.getItem('tradeos_watchlist') || '[]')
    setTrades(t)
    setWatchlist(w)
  }

  async function loadTrades() {
    const { data } = await supabase.from('trades').select('*').order('created_at', { ascending: false })
    if (data) setTrades(data)
  }

  async function loadWatchlist() {
    const { data } = await supabase.from('watchlist').select('*')
    if (data) setWatchlist(data)
  }

  async function addTrade(trade: Omit<Trade, 'id' | 'created_at'>) {
    if (dbReady) {
      const { data } = await supabase.from('trades').insert([trade]).select().single()
      if (data) setTrades(prev => [data, ...prev])
    } else {
      const newTrade = { ...trade, id: Date.now(), created_at: new Date().toISOString() }
      const updated = [newTrade, ...trades]
      setTrades(updated as Trade[])
      localStorage.setItem('tradeos_trades', JSON.stringify(updated))
    }
  }

  async function deleteTrade(id: number) {
    if (dbReady) {
      await supabase.from('trades').delete().eq('id', id)
    } else {
      const updated = trades.filter(t => t.id !== id)
      localStorage.setItem('tradeos_trades', JSON.stringify(updated))
    }
    setTrades(prev => prev.filter(t => t.id !== id))
  }

  async function addWatchlistItem(coin_id: string, threshold: number) {
    if (watchlist.find(w => w.coin_id === coin_id)) return
    if (dbReady) {
      const { data } = await supabase.from('watchlist').insert([{ coin_id, threshold }]).select().single()
      if (data) setWatchlist(prev => [...prev, data])
    } else {
      const item = { id: Date.now(), created_at: new Date().toISOString(), coin_id, threshold }
      const updated = [...watchlist, item]
      setWatchlist(updated as WatchlistItem[])
      localStorage.setItem('tradeos_watchlist', JSON.stringify(updated))
    }
  }

  async function removeWatchlistItem(id: number) {
    if (dbReady) {
      await supabase.from('watchlist').delete().eq('id', id)
    } else {
      const updated = watchlist.filter(w => w.id !== id)
      localStorage.setItem('tradeos_watchlist', JSON.stringify(updated))
    }
    setWatchlist(prev => prev.filter(w => w.id !== id))
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text2)', fontSize: 13 }}>Memuat TradeOS...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const tabs: { id: AppTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calculator', label: 'Kalkulator' },
    { id: 'journal', label: 'Jurnal' },
    { id: 'radar', label: 'Radar Anomali' },
  ]

  return (
    <div>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', position: 'sticky', top: 0, zIndex: 100,
        padding: '0 1.5rem',
      }}>
        <div style={{
          fontSize: 15, fontWeight: 700, letterSpacing: '0.05em',
          padding: '1rem 1.5rem 1rem 0', borderRight: '1px solid var(--border)',
          marginRight: '1rem', color: 'var(--text)',
        }}>
          Trade<span style={{ color: 'var(--accent)' }}>OS</span>
        </div>

        <div style={{ display: 'flex', flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.75rem 1.25rem', fontSize: 13, fontWeight: 500,
              color: tab === t.id ? 'var(--text)' : 'var(--text2)',
              cursor: 'pointer', border: 'none', background: 'transparent',
              letterSpacing: '0.03em', position: 'relative', transition: 'color 0.2s',
              fontFamily: 'inherit',
            }}>
              {t.label}
              {tab === t.id && (
                <span style={{
                  position: 'absolute', bottom: 0, left: '0.75rem', right: '0.75rem',
                  height: 2, background: 'var(--accent)', borderRadius: '2px 2px 0 0',
                }} />
              )}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 11,
          color: 'var(--green)', fontFamily: 'monospace',
          padding: '0.45rem 0.9rem', background: 'rgba(0,208,132,0.07)',
          border: '1px solid rgba(0,208,132,0.2)', borderRadius: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          {dbReady ? 'SUPABASE' : 'LOCAL'}
        </div>
      </nav>

      <main style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto' }}>
        {tab === 'dashboard' && <Dashboard trades={trades} />}
        {tab === 'calculator' && <Calculator />}
        {tab === 'journal' && <Journal trades={trades} onAdd={addTrade} onDelete={deleteTrade} />}
        {tab === 'radar' && <Radar watchlist={watchlist} onAdd={addWatchlistItem} onRemove={removeWatchlistItem} />}
      </main>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
    </div>
  )
}
