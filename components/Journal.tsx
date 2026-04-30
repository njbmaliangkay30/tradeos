'use client'
import { useState } from 'react'
import { Trade } from '@/lib/supabase'
import { calcStats, fmtUSD } from '@/lib/utils'
import { Card, CardHeader, MetricCard, Badge, Btn, Empty } from './UI'

const SETUPS = ['Breakout', 'Pullback', 'Range Reversal', 'Trend Following', 'News Play', 'Scalp', 'Swing']
const EMOTIONS = ['FOMO', 'Confident', 'Uncertain', 'Calm', 'Greedy', 'Fear', 'Revenge']

type Props = {
  trades: Trade[]
  onAdd: (trade: Omit<Trade, 'id' | 'created_at'>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export default function Journal({ trades, onAdd, onDelete }: Props) {
  const [pair, setPair] = useState('')
  const [setup, setSetup] = useState('')
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG')
  const [entry, setEntry] = useState('')
  const [exit, setExit] = useState('')
  const [size, setSize] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [emotions, setEmotions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [filterSetup, setFilterSetup] = useState('')
  const [filterDir, setFilterDir] = useState('')

  function toggleEmotion(e: string) {
    setEmotions(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  async function handleAdd() {
    if (!pair.trim() || !entry || !exit || !size) {
      alert('Lengkapi: Pair, Entry, Exit, dan Modal.')
      return
    }
    const entryN = parseFloat(entry), exitN = parseFloat(exit), sizeN = parseFloat(size)
    const pnl = direction === 'LONG'
      ? (exitN - entryN) / entryN * sizeN
      : (entryN - exitN) / entryN * sizeN
    const pnl_pct = direction === 'LONG'
      ? (exitN - entryN) / entryN * 100
      : (entryN - exitN) / entryN * 100

    setSaving(true)
    await onAdd({
      pair: pair.trim().toUpperCase(), setup: setup || null,
      direction, entry: entryN, exit: exitN, size: sizeN,
      pnl, pnl_pct, date: date || null,
      emotion: emotions.length ? emotions.join(', ') : null,
      note: note || null,
    })
    setSaving(false)
    setPair(''); setSetup(''); setEntry(''); setExit(''); setSize('')
    setNote(''); setEmotions([])
  }

  const filtered = trades.filter(t => {
    if (filterSetup && t.setup !== filterSetup) return false
    if (filterDir && t.direction !== filterDir) return false
    return true
  })

  const stats = calcStats(trades)

  // Emotion breakdown
  const emotionMap: Record<string, { pnl: number; count: number }> = {}
  trades.forEach(t => {
    if (t.emotion) {
      t.emotion.split(', ').forEach(e => {
        if (!emotionMap[e]) emotionMap[e] = { pnl: 0, count: 0 }
        emotionMap[e].pnl += t.pnl
        emotionMap[e].count++
      })
    }
  })

  function exportCSV() {
    if (!trades.length) return
    const headers = ['Date', 'Pair', 'Direction', 'Setup', 'Entry', 'Exit', 'Size', 'P&L ($)', 'P&L (%)', 'Emotion', 'Notes']
    const rows = trades.map(t => [
      t.date || '', t.pair, t.direction, t.setup || '',
      t.entry, t.exit, t.size,
      t.pnl.toFixed(2), t.pnl_pct.toFixed(2),
      t.emotion || '', `"${(t.note || '').replace(/"/g, '""')}"`
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tradeos_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Form */}
        <Card>
          <CardHeader title="Catat Trade Baru" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label>Pair / Token</label>
              <input value={pair} onChange={e => setPair(e.target.value)} placeholder="BTC, ETH, SOL..." />
            </div>
            <div>
              <label>Setup Type</label>
              <select value={setup} onChange={e => setSetup(e.target.value)}>
                <option value="">— Pilih Setup —</option>
                {SETUPS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label>Direction</label>
              <select value={direction} onChange={e => setDirection(e.target.value as 'LONG' | 'SHORT')}>
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div>
              <label>Entry ($)</label>
              <input type="number" value={entry} step="0.01" onChange={e => setEntry(e.target.value)} />
            </div>
            <div>
              <label>Exit ($)</label>
              <input type="number" value={exit} step="0.01" onChange={e => setExit(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label>Modal Digunakan ($)</label>
              <input type="number" value={size} step="0.01" onChange={e => setSize(e.target.value)} />
            </div>
            <div>
              <label>Tanggal</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <label>Emosi Saat Entry</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: 4 }}>
            {EMOTIONS.map(e => (
              <span key={e} onClick={() => toggleEmotion(e)} style={{
                padding: '0.3rem 0.7rem', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                border: `1px solid ${emotions.includes(e) ? 'var(--accent)' : 'var(--border)'}`,
                color: emotions.includes(e) ? 'var(--accent)' : 'var(--text2)',
                background: emotions.includes(e) ? 'var(--accent2)' : 'transparent',
                transition: 'all 0.2s', userSelect: 'none',
              }}>{e}</span>
            ))}
          </div>

          <label>Catatan / Post-Trade Review</label>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            rows={3} placeholder="Apa yang berjalan baik? Apa yang perlu diperbaiki?" />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Btn variant="primary" onClick={handleAdd}>{saving ? 'Menyimpan...' : 'Simpan Trade'}</Btn>
            <Btn variant="ghost" onClick={() => { setPair(''); setSetup(''); setEntry(''); setExit(''); setSize(''); setNote(''); setEmotions([]) }}>Bersihkan</Btn>
          </div>
        </Card>

        {/* Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card>
            <CardHeader title="Ringkasan Jurnal" right={
              <span style={{ fontSize: 11, color: 'var(--text2)' }}>{trades.length} trades</span>
            } />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <MetricCard
                label="Win Rate"
                value={stats ? (stats.winRate * 100).toFixed(1) + '%' : '—%'}
                color="var(--accent)"
              />
              <MetricCard
                label="Total P&L"
                value={stats ? fmtUSD(stats.totalPnl) : '$0.00'}
                color={!stats || stats.totalPnl >= 0 ? 'var(--green)' : 'var(--red)'}
              />
            </div>

            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.6rem' }}>
              P&L per Emosi
            </div>
            {Object.entries(emotionMap).length === 0
              ? <div style={{ fontSize: 12, color: 'var(--text3)', padding: '0.5rem 0' }}>Tambah trades untuk melihat pola emosi</div>
              : Object.entries(emotionMap).sort((a, b) => b[1].pnl - a[1].pnl).map(([e, d]) => (
                <div key={e} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.4rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                    {e} <span style={{ color: 'var(--text3)' }}>({d.count}x)</span>
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, fontFamily: 'monospace',
                    color: d.pnl >= 0 ? 'var(--green)' : 'var(--red)',
                  }}>
                    {fmtUSD(d.pnl)}
                  </span>
                </div>
              ))
            }
          </Card>
        </div>
      </div>

      {/* Trade History Table */}
      <Card style={{ marginTop: '1rem' }}>
        <CardHeader title="Riwayat Semua Trade" right={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select value={filterSetup} onChange={e => setFilterSetup(e.target.value)}
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: 11 }}>
              <option value="">Semua Setup</option>
              {SETUPS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterDir} onChange={e => setFilterDir(e.target.value)}
              style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: 11 }}>
              <option value="">L + S</option>
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
            <Btn variant="ghost" size="sm" onClick={exportCSV}>Export CSV</Btn>
          </div>
        } />

        {!filtered.length
          ? <Empty icon="📒" text="Jurnal kosong. Mulai catat trade pertamamu." />
          : <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th><th>Pair</th><th>Dir</th><th>Setup</th>
                  <th>Entry</th><th>Exit</th><th>Size</th>
                  <th>P&L ($)</th><th>P&L (%)</th><th>Emosi</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: 'var(--text3)', fontSize: 11, fontFamily: 'monospace' }}>{t.date || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{t.pair}</td>
                    <td><Badge variant={t.direction === 'LONG' ? 'green' : 'red'}>{t.direction}</Badge></td>
                    <td style={{ fontSize: 11, color: 'var(--text2)' }}>{t.setup || '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>${t.entry.toFixed(2)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>${t.exit.toFixed(2)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>${t.size.toFixed(0)}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: t.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, color: t.pnl_pct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {t.pnl_pct >= 0 ? '+' : ''}{t.pnl_pct.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.emotion || '—'}
                    </td>
                    <td>
                      <Btn variant="danger" size="sm" onClick={() => onDelete(t.id)}>✕</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </Card>
    </div>
  )
}
