'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, ResultRow, ResultBox, SectionLabel, Btn } from './UI'

const CHECKLIST = [
  'Trend jelas teridentifikasi',
  'Volume konfirmasi sinyal',
  'Entry di level key S/R',
  'Stop loss sudah ditetapkan',
  'RR minimal 1:2',
  'Tidak sedang FOMO',
  'Tidak revenge trading',
  'News/event sudah dicek',
]

export default function Calculator() {
  const [capital, setCapital] = useState(1000)
  const [riskPct, setRiskPct] = useState(1)
  const [winRate, setWinRate] = useState(50)
  const [rr, setRr] = useState(2)
  const [entry, setEntry] = useState(50000)
  const [sl, setSl] = useState(48000)
  const [checks, setChecks] = useState<boolean[]>(Array(CHECKLIST.length).fill(false))

  const riskDollar = capital * riskPct / 100
  const slPct = entry > 0 && sl > 0 ? Math.abs((entry - sl) / entry * 100) : 0
  const tpDollar = riskDollar * rr
  const tpPrice = entry > 0 && sl > 0 ? entry + (entry - sl) * rr : 0
  const units = slPct > 0 ? riskDollar / (entry * slPct / 100) : 0
  const breakeven = 1 / (1 + rr)
  const wr = winRate / 100
  const ev = (wr * tpDollar) - ((1 - wr) * riskDollar)
  const wins100 = Math.round(wr * 100)
  const net100 = (wins100 * tpDollar) - ((100 - wins100) * riskDollar)
  const roi = net100 / capital * 100

  const verdict = ev > 0 && wr > breakeven
    ? { type: 'green', icon: '✓', title: 'Setup Positif — EV menguntungkan', desc: `Win rate ${winRate}% melebihi breakeven ${(breakeven * 100).toFixed(0)}%. Setup ini layak dieksekusi.` }
    : ev < 0
      ? { type: 'red', icon: '✗', title: 'Setup Negatif — Jangan entry', desc: `EV negatif. Naikkan RR atau tingkatkan win rate di atas ${(breakeven * 100).toFixed(0)}% sebelum eksekusi.` }
      : { type: 'amber', icon: '⚡', title: 'Setup Breakeven', desc: 'EV mendekati nol. Setup ini tidak memberikan edge statistik yang cukup.' }

  const checkScore = checks.filter(Boolean).length
  const checkPct = checkScore / CHECKLIST.length * 100

  function toggleCheck(i: number) {
    setChecks(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  function resetAll() {
    setCapital(1000); setRiskPct(1); setWinRate(50); setRr(2)
    setEntry(50000); setSl(48000)
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Inputs */}
        <Card>
          <CardHeader title="Expected Value Calculator" />

          <label>Modal Akun ($)</label>
          <input type="number" value={capital} min={1} onChange={e => setCapital(+e.target.value)} />

          <SliderField
            label="Risk per Trade (%)"
            value={riskPct} min={0.1} max={10} step={0.1}
            display={riskPct.toFixed(1) + '%'}
            onChange={setRiskPct}
          />

          <SliderField
            label="Win Rate (%)"
            value={winRate} min={1} max={99} step={1}
            display={winRate + '%'}
            onChange={setWinRate}
          />

          <SliderField
            label="Risk/Reward Ratio (1:X)"
            value={rr} min={0.5} max={10} step={0.1}
            display={rr.toFixed(1)}
            onChange={setRr}
          />

          <label>Entry Price ($)</label>
          <input type="number" value={entry} step={0.01} onChange={e => setEntry(+e.target.value)} />

          <label>Stop Loss ($)</label>
          <input type="number" value={sl} step={0.01} onChange={e => setSl(+e.target.value)} />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Btn variant="primary" onClick={() => {}}>Hitung Otomatis</Btn>
            <Btn variant="ghost" onClick={resetAll}>Reset</Btn>
          </div>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader title="Hasil Kalkulasi" />

          <SectionLabel>Position Sizing</SectionLabel>
          <ResultBox>
            <ResultRow label="Nominal risiko" value={'$' + riskDollar.toFixed(2)} color="var(--red)" />
            <ResultRow label="Target profit (TP)" value={'$' + tpDollar.toFixed(2)} />
            <ResultRow label="TP Price" value={tpPrice > 0 ? '$' + tpPrice.toFixed(2) : '—'} color="var(--green)" />
            <ResultRow label="% jarak ke SL" value={slPct > 0 ? slPct.toFixed(2) + '%' : '—'} color="var(--red)" />
            <ResultRow label="Unit bisa dibeli" value={units > 0 ? units.toFixed(5) : '—'} color="var(--accent)" />
          </ResultBox>

          <SectionLabel>Probabilitas &amp; EV</SectionLabel>
          <ResultBox>
            <ResultRow label="Breakeven win rate" value={(breakeven * 100).toFixed(1) + '%'} />
            <ResultRow
              label="Expected Value / trade"
              value={(ev >= 0 ? '+' : '') + '$' + ev.toFixed(2)}
              color={ev >= 0 ? 'var(--green)' : 'var(--red)'}
            />
            <ResultRow
              label="EV per $1000 modal"
              value={(ev / capital * 1000 >= 0 ? '+' : '') + '$' + (ev / capital * 1000).toFixed(2)}
              color={ev >= 0 ? 'var(--green)' : 'var(--red)'}
            />
          </ResultBox>

          {/* Verdict */}
          <div style={{
            marginTop: '1rem', padding: '0.9rem 1rem', borderRadius: 10,
            border: `1px solid var(--${verdict.type})`,
            background: `var(--${verdict.type}2)`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: `var(--${verdict.type})` }}>
              {verdict.icon} {verdict.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: '0.3rem' }}>{verdict.desc}</div>
          </div>

          <SectionLabel>Simulasi 100 Trades</SectionLabel>
          <ResultBox>
            <ResultRow label="Projected wins" value={String(wins100)} color="var(--green)" />
            <ResultRow label="Projected losses" value={String(100 - wins100)} color="var(--red)" />
            <ResultRow
              label="Net P&amp;L proj."
              value={(net100 >= 0 ? '+' : '') + '$' + net100.toFixed(0)}
              color={net100 >= 0 ? 'var(--green)' : 'var(--red)'}
            />
            <ResultRow
              label="ROI proj."
              value={(roi >= 0 ? '+' : '') + roi.toFixed(1) + '%'}
              color={roi >= 0 ? 'var(--green)' : 'var(--red)'}
            />
          </ResultBox>
        </Card>
      </div>

      {/* Checklist */}
      <Card style={{ marginTop: '1rem' }}>
        <CardHeader
          title="Pre-Trade Checklist"
          right={<Btn variant="ghost" size="sm" onClick={() => setChecks(Array(CHECKLIST.length).fill(false))}>Reset</Btn>}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem' }}>
          {CHECKLIST.map((item, i) => (
            <label key={i} onClick={() => toggleCheck(i)} style={{
              display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              padding: '0.6rem 0.75rem', borderRadius: 8, fontSize: 12,
              border: `1px solid ${checks[i] ? 'var(--green)' : 'var(--border)'}`,
              background: checks[i] ? 'var(--green2)' : 'transparent',
              color: checks[i] ? 'var(--green)' : 'var(--text2)',
              transition: 'all 0.2s', userSelect: 'none',
            }}>
              <input
                type="checkbox" checked={checks[i]} onChange={() => {}}
                style={{ width: 'auto', accentColor: 'var(--green)', cursor: 'pointer' }}
              />
              {item}
            </label>
          ))}
        </div>
        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: 6, background: 'var(--bg4)', borderRadius: 3 }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: checkPct === 100 ? 'var(--green)' : checkPct >= 75 ? 'var(--amber)' : 'var(--red)',
              width: checkPct + '%', transition: 'width 0.3s, background 0.3s',
            }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace', minWidth: 32 }}>
            {checkScore}/{CHECKLIST.length}
          </span>
          {checkPct < 75 && checkScore > 0 && (
            <span style={{ fontSize: 11, color: 'var(--red)' }}>⚠ Setup belum siap</span>
          )}
          {checkPct === 100 && (
            <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Siap eksekusi</span>
          )}
        </div>
      </Card>
    </div>
  )
}

function SliderField({ label, value, min, max, step, display, onChange }: {
  label: string; value: number; min: number; max: number; step: number
  display: string; onChange: (v: number) => void
}) {
  return (
    <>
      <label>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '0.75rem', marginBottom: 4 }}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))} />
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: 'var(--accent)', minWidth: 52, textAlign: 'right' }}>
          {display}
        </span>
      </div>
      <input type="number" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </>
  )
}
