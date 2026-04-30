'use client'
import React from 'react'

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '1.25rem', ...style,
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text2)' }}>
        {title}
      </span>
      {right}
    </div>
  )
}

export function MetricCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'monospace', lineHeight: 1, color: color || 'var(--text)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: '0.35rem', fontFamily: 'monospace' }}>{sub}</div>}
    </div>
  )
}

export function Badge({ children, variant }: { children: React.ReactNode; variant: 'green' | 'red' | 'blue' | 'amber' | 'accent' }) {
  const colors = {
    green: { bg: 'var(--green2)', color: 'var(--green)' },
    red: { bg: 'var(--red2)', color: 'var(--red)' },
    blue: { bg: 'var(--blue2)', color: 'var(--blue)' },
    amber: { bg: 'var(--amber2)', color: 'var(--amber)' },
    accent: { bg: 'var(--accent2)', color: 'var(--accent)' },
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.2rem 0.6rem', borderRadius: 4,
      fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
      background: colors[variant].bg, color: colors[variant].color,
    }}>
      {children}
    </span>
  )
}

export function Btn({ children, onClick, variant = 'ghost', size = 'md', style }: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  style?: React.CSSProperties
}) {
  const styles = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none' },
    ghost: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
    danger: { background: 'var(--red2)', color: 'var(--red)', border: '1px solid var(--red2)' },
  }
  const pads = { sm: '0.35rem 0.75rem', md: '0.6rem 1.25rem' }
  return (
    <button onClick={onClick} style={{
      padding: pads[size], borderRadius: 8, fontSize: size === 'sm' ? 11 : 13,
      fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
      letterSpacing: '0.03em', fontFamily: 'inherit',
      ...styles[variant], ...style,
    }}>
      {children}
    </button>
  )
}

export function ResultRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.45rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace', color: color || 'var(--text)' }}>{value}</span>
    </div>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', margin: '1rem 0 0.6rem' }}>
      {children}
    </div>
  )
}

export function Empty({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text3)' }}>
      <div style={{ fontSize: 28, marginBottom: '0.6rem', opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: 13 }}>{text}</div>
    </div>
  )
}

export function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '1rem 1.25rem',
    }}>
      {children}
    </div>
  )
}
