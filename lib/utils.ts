export function fmtPrice(n: number): string {
  if (!n && n !== 0) return '—'
  if (n > 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  if (n > 1) return n.toFixed(4)
  return n.toFixed(6)
}

export function fmtBig(n: number): string {
  if (!n) return '—'
  if (n > 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n > 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n > 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(0)
}

export function fmtUSD(n: number): string {
  return (n >= 0 ? '+' : '') + '$' + Math.abs(n).toFixed(2)
}

export function calcStats(trades: { pnl: number }[]) {
  if (!trades.length) return null
  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0)
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0))
  const winRate = wins.length / trades.length
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : Infinity
  const expectancy = totalPnl / trades.length

  let peak = 0, maxDD = 0, running = 0
  ;[...trades].reverse().forEach(t => {
    running += t.pnl
    if (running > peak) peak = running
    const dd = peak - running
    if (dd > maxDD) maxDD = dd
  })

  let maxCW = 0, cw = 0
  ;[...trades].reverse().forEach(t => {
    if (t.pnl > 0) { cw++; maxCW = Math.max(maxCW, cw) } else cw = 0
  })

  return {
    totalPnl, winRate, wins: wins.length, losses: losses.length,
    grossWin, grossLoss, profitFactor, expectancy,
    best: Math.max(...trades.map(t => t.pnl)),
    worst: Math.min(...trades.map(t => t.pnl)),
    avgWin: wins.length ? grossWin / wins.length : 0,
    avgLoss: losses.length ? grossLoss / losses.length : 0,
    maxDrawdown: maxDD,
    maxConsecWins: maxCW,
  }
}
