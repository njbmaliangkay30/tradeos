'use client'
import { useEffect, useRef } from 'react'
import { Trade } from '@/lib/supabase'
import { calcStats, fmtUSD } from '@/lib/utils'
import { Card, CardHeader, MetricCard, Badge, Empty, SectionLabel } from './UI'

export default function Dashboard({ trades }: { trades: Trade[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stats = calcStats(trades)

  useEffect(() => {
    drawEquityCurve()
  }, [trades])

  function drawEquityCurve() {
    const canvas = canvasRef.current
    if (!canvas || trades.length < 2) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const equity = [0]
    ;[...trades].reverse().forEach(t => equity.push(equity[equity.length - 1] + t.pnl))

    const minV = Math.min(...equity), maxV = Math.max(...equity)
    const range = maxV - minV || 1
    const pad = 20

    ctx.clearRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 4; i++) {
      const y = pad + ((H - pad * 2) * i) / 3
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // Zero line
    const zeroY = pad + (maxV / range) * (H - pad * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(0, zeroY); ctx.lineTo(W, zeroY); ctx.stroke()
    ctx.setLineDash([])

    const points = equity.map((v, i) => ({
      x: (i / (equity.length - 1)) * (W - pad * 2) + pad,
      y: pad + ((maxV - v) / range) * (H - pad * 2),
    }))

    const lastVal = equity[equity.length - 1]
    const lineColor = lastVal >= 0 ? '#00d084' : '#ff4757'

    // Fill
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, lastVal >= 0 ? 'rgba(0,208,132,0.15)' : 'rgba(255,71,87,0.15)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.moveTo(points[0].x, H)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(points[points.length - 1].x, H)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Line
    ctx.beginPath()
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const setupMap: Record<string, { pnl: number; count: number }> = {}
  trades.forEach(t => {
    const s = t.setup || 'Unknown'
    if (!setupMap[s]) setupMap[s] = { pnl: 0, count: 0 }
    setupMap[s].pnl += t.pnl
    setupMap[s].count++
  })
  const setupEntries = Object.entries(setupMap).sort((a, b) => b[1].pnl - a[1].pnl)
  const maxSetupAbs = Math.max(...setupEntries.map(e => Math.abs(e[1].pnl)), 1)

  return (
    <div className="fade-in">
      {/* Metric row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <MetricCard
          label="Total P&amp;L"
          value={stats ? fmtUSD(stats.totalPnl) : '$0.00'}
          sub={stats ? `${stats.wins}W / ${stats.losses}L` : '—'}
          color={!stats || stats.totalPnl >= 0 ? 'var(--green)' : 'var(--red)'}
        />
        <MetricCard
          label="Win Rate"
          value={stats ? (stats.winRate * 100).toFixed(1) + '%' : '—%'}
          sub={`${trades.length} trades`}
          color="var(--accent)"
        />
        <MetricCard
          label="Profit Factor"
          value={stats ? (isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞') : '—'}
          sub="gross win / gross loss"
        />
        <MetricCard
          label="Expectancy"
          value={stats ? fmtUSD(stats.expectancy) : '$—'}
          sub="per trade avg"
          color={!stats || stats.expectancy >= 0 ? 'var(--green)' : 'var(--red)'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Equity curve */}
        <Card>
          <CardHeader title="Equity Curve" right={
            <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'monospace' }}>{trades.length} trades</span>
          } />
          {trades.length < 2
            ? <Empty icon="📈" text="Butuh minimal 2 trades" />
            : <canvas ref={canvasRef} style={{ width: '100%', height: 140, display: 'block' }} role="img" aria-label="Equity curve" />
          }
        </Card>

        {/* Setup breakdown */}
        <Card>
          <CardHeader title="P&amp;L per Setup" />
          {!setupEntries.length
            ? <Empty icon="📊" text="Tambah trades di Jurnal" />
            : setupEntries.map(([s, d]) => (
              <div key={s} style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: 'var(--text2)' }}>{s} <span style={{ color: 'var(--text3)' }}>({d.count}x)</span></span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: d.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {fmtUSD(d.pnl)}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: d.pnl >= 0 ? 'var(--green)' : 'var(--red)',
                    width: (Math.abs(d.pnl) / maxSetupAbs * 100) + '%',
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            ))
          }
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Recent trades */}
        <Card>
          <CardHeader title="5 Trade Terakhir" />
          {!trades.length
            ? <Empty icon="📋" text="Belum ada riwayat trade" />
            : trades.slice(0, 5).map(t => (
              <div key={t.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.6rem 0', borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{t.pair}</span>
                  <Badge variant={t.direction === 'LONG' ? 'green' : 'red'}>{t.direction}</Badge>
                  {t.setup && <span style={{ fontSize: 11, color: 'var(--text3)' }}>{t.setup}</span>}
                </div>
                <span style={{
                  fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
                  color: t.pnl >= 0 ? 'var(--green)' : 'var(--red)',
                }}>
                  {fmtUSD(t.pnl)}
                </span>
              </div>
            ))
          }
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader title="Statistik Distribusi" />
          {[
            { label: 'Best trade', value: stats ? '+$' + stats.best.toFixed(2) : '—', color: 'var(--green)' },
            { label: 'Worst trade', value: stats ? '-$' + Math.abs(stats.worst).toFixed(2) : '—', color: 'var(--red)' },
            { label: 'Avg win', value: stats && stats.wins > 0 ? '+$' + stats.avgWin.toFixed(2) : '—', color: 'var(--green)' },
            { label: 'Avg loss', value: stats && stats.losses > 0 ? '-$' + stats.avgLoss.toFixed(2) : '—', color: 'var(--red)' },
            { label: 'Max drawdown', value: stats ? '-$' + stats.maxDrawdown.toFixed(2) : '—', color: 'var(--red)' },
            { label: 'Consecutive wins', value: stats ? String(stats.maxConsecWins) : '—', color: 'var(--accent)' },
          ].map(r => (
            <div key={r.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.45rem 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: r.color }}>{r.value}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
