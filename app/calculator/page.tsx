'use client'; // Wajib ada karena kita pakai useState

import React, { useState } from 'react';
import { Calculator as CalcIcon, AlertTriangle } from 'lucide-react';

export default function CalculatorPage() {
  // State untuk menyimpan angka inputan
  const [capital, setCapital] = useState<number | ''>(1000);
  const [riskPercent, setRiskPercent] = useState<number | ''>(1);
  const [entryPrice, setEntryPrice] = useState<number | ''>('');
  const [stopLoss, setStopLoss] = useState<number | ''>('');

  // Logika Perhitungan Trading
  const riskAmount = Number(capital) * (Number(riskPercent) / 100);
  const priceDifference = Math.abs(Number(entryPrice) - Number(stopLoss));
  const stopLossPercent = Number(entryPrice) > 0 ? (priceDifference / Number(entryPrice)) * 100 : 0;
  
  const positionSize = priceDifference > 0 ? riskAmount / priceDifference : 0;
  const totalPositionValue = positionSize * Number(entryPrice);
  const isLong = Number(entryPrice) > Number(stopLoss);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <header className="pb-6 border-b border-zinc-800/50">
        <h1 className="text-4xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
          <CalcIcon className="text-cyan-500" size={36} /> Position Sizer
        </h1>
        <p className="text-zinc-400 mt-2">Calculate your risk exactly before taking a trade. Never gamble.</p>
      </header>
      
      {/* Area Kalkulator */}
      <div className="max-w-2xl pt-4">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl backdrop-blur-sm shadow-xl">
          <div className="space-y-6">
            
            {/* Row 1: Modal & Risiko */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Total Capital ($)</label>
                <input 
                  type="number" 
                  value={capital} 
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Risk per Trade (%)</label>
                <input 
                  type="number" 
                  value={riskPercent} 
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Row 2: Entry & Stop Loss */}
            <div className="grid grid-cols-2 gap-6 border-t border-zinc-800/50 pt-6">
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Entry Price ($)</label>
                <input 
                  type="number" 
                  value={entryPrice} 
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. 65000"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Stop Loss ($)</label>
                <input 
                  type="number" 
                  value={stopLoss} 
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  placeholder="e.g. 64000"
                />
              </div>
            </div>
          </div>

          {/* Hasil Kalkulasi (Hanya muncul jika input sudah diisi) */}
          {entryPrice && stopLoss && priceDifference > 0 && (
            <div className="mt-8 bg-zinc-950 p-6 rounded-2xl border border-zinc-800/80 shadow-inner">
              <div className="flex items-center justify-between mb-5 border-b border-zinc-800/50 pb-4">
                 <div className="flex items-center gap-2">
                   <AlertTriangle className={isLong ? "text-emerald-400" : "text-rose-400"} size={20} />
                   <span className="font-medium text-zinc-300">Trade Direction</span>
                 </div>
                 <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider ${
                   isLong ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                 }`}>
                   {isLong ? 'LONG (BUY)' : 'SHORT (SELL)'}
                 </span>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Amount at Risk</span>
                  <span className="font-bold text-rose-400 text-lg">-${riskAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Distance to Stop Loss</span>
                  <span className="text-zinc-300">{stopLossPercent.toFixed(2)}%</span>
                </div>
                
                <div className="border-t border-zinc-800/50 pt-4 mt-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Coin Position Size</span>
                  <span className="font-mono text-cyan-400">{positionSize.toFixed(5)}</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-300 font-medium">Total Margin Size ($)</span>
                  <span className="font-black text-emerald-400 text-xl">${totalPositionValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
