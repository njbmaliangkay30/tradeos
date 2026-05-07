'use client'; 

import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, AlertTriangle, ShieldCheck, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const INITIAL_CAPITAL = 1000;

export default function CalculatorPage() {
  const [pair, setPair] = useState('BTC/USDT');
  const [capital, setCapital] = useState<number | ''>('Loading...'); // Akan diisi otomatis
  const [riskPercent, setRiskPercent] = useState<number | ''>(1);
  const [entryPrice, setEntryPrice] = useState<number | ''>('');
  const [stopLoss, setStopLoss] = useState<number | ''>('');

  const [isLogging, setIsLogging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // AUTO-FETCH REAL BALANCE
  useEffect(() => {
    const fetchRealBalance = async () => {
      const { data } = await supabase.from('trades').select('status, pnl');
      if (data) {
        const closedTrades = data.filter(t => t.status !== 'OPEN');
        const netProfit = closedTrades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0);
        setCapital(INITIAL_CAPITAL + netProfit); // Set modal sesuai balance asli
      } else {
        setCapital(INITIAL_CAPITAL);
      }
    };
    fetchRealBalance();
  }, []);

  // Perhitungan hanya berjalan jika capital berupa angka
  const currentCap = typeof capital === 'number' ? capital : 0;
  const riskAmount = currentCap * (Number(riskPercent) / 100);
  const priceDifference = Math.abs(Number(entryPrice) - Number(stopLoss));
  const stopLossPercent = Number(entryPrice) > 0 ? (priceDifference / Number(entryPrice)) * 100 : 0;
  const positionSize = priceDifference > 0 ? riskAmount / priceDifference : 0;
  const totalPositionValue = positionSize * Number(entryPrice);
  const isLong = Number(entryPrice) > Number(stopLoss);

  // Fungsi Log Trade (Sama seperti sebelumnya)
  const handleLogTrade = async () => {
    if (!entryPrice || !stopLoss || !pair || currentCap === 0) return;
    setIsLogging(true);
    setIsError(false);
    try {
      const { error } = await supabase.from('trades').insert([{
          pair: pair.toUpperCase(),
          direction: isLong ? 'LONG' : 'SHORT',
          entry_price: Number(entryPrice),
          stop_loss: Number(stopLoss),
          risk_amount: riskAmount,
          position_size: positionSize,
          status: 'OPEN'
        }]);
      if (error) throw error;
      setIsLogging(false);
      setIsSuccess(true);
      setEntryPrice(''); // Kosongkan form agar siap trade lagi
      setStopLoss('');
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setIsLogging(false);
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
    }
  };

  //... (LANJUTAN KODE UI DI BAWAH INI SAMA PERSIS SEPERTI SEBELUMNYA)
  //... Tapi pastikan input Total Capital menjadi "Read-Only" (Disable) agar user tak curang mengubah modal sembarangan.

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="pb-6 border-b border-zinc-800/50">
        <h1 className="text-4xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
          <CalcIcon className="text-cyan-500" size={36} /> Pre-Trade Hub
        </h1>
        <p className="text-zinc-400 mt-2">Execute your setup perfectly. Check the SOP, calculate the risk, then log it.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KIRI: KALKULATOR */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/50 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="space-y-6">
            
            {/* Input Asset Pair */}
            <div>
              <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Asset Pair</label>
              <input 
                type="text" 
                value={pair} 
                onChange={(e) => setPair(e.target.value)} 
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono uppercase" 
                placeholder="e.g. BTC/USDT"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Total Capital ($)</label>
                <input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 transition-all"/>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Risk per Trade (%)</label>
                <input type="number" value={riskPercent} onChange={(e) => setRiskPercent(Number(e.target.value))} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 transition-all"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-zinc-800/50 pt-6">
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Entry Price ($)</label>
                <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500 transition-all" placeholder="e.g. 65000"/>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wider font-semibold">Stop Loss ($)</label>
                <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-rose-500 transition-all" placeholder="e.g. 64000"/>
              </div>
            </div>
          </div>

          {entryPrice && stopLoss && priceDifference > 0 && (
            <div className="mt-8 bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800/80 shadow-inner">
              <div className="flex items-center justify-between mb-5 border-b border-zinc-800/50 pb-4">
                 <div className="flex items-center gap-2">
                   <AlertTriangle className={isLong ? "text-emerald-400" : "text-rose-400"} size={20} />
                   <span className="font-medium text-zinc-300">Trade Direction</span>
                 </div>
                 <span className={`px-4 py-1 rounded-full text-xs font-bold tracking-wider ${isLong ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                   {isLong ? 'LONG (BUY)' : 'SHORT (SELL)'}
                 </span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center"><span className="text-zinc-400">Amount at Risk</span><span className="font-bold text-rose-400 text-lg">-${riskAmount.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Distance to Stop Loss</span><span className="text-zinc-300">{stopLossPercent.toFixed(2)}%</span></div>
                <div className="border-t border-zinc-800/50 pt-4 mt-2"></div>
                <div className="flex justify-between items-center"><span className="text-zinc-400">Coin Position Size</span><span className="font-mono text-cyan-400">{positionSize.toFixed(5)}</span></div>
                <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  <span className="text-zinc-300 font-medium">Total Margin Size ($)</span>
                  <span className="font-black text-emerald-400 text-xl">${totalPositionValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KANAN: SOP CHECKLIST & TOMBOL EXECUTE */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800/50 p-8 rounded-3xl backdrop-blur-md shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-emerald-400" size={28} />
              <h3 className="font-bold text-xl text-zinc-100">Execution Checklist</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                "Trend in 4H is aligned (Above/Below MA 200)",
                "Price pulled back to MA 50/100 zone",
                "Confluence with Fibonacci 0.5 or 0.618",
                "Clear Reversal Candle formed & closed",
                "Risk calculated, max loss accepted mentally"
              ].map((task, i) => (
                <label key={i} className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-zinc-800/40 transition-colors border border-transparent hover:border-zinc-800">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border-2 border-zinc-700 bg-zinc-950 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-zinc-950 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors leading-relaxed">{task}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800/50 text-center">
               <button 
                  onClick={handleLogTrade}
                  disabled={isLogging || isSuccess || !entryPrice || !stopLoss || !pair}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSuccess 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-emerald-500/10' 
                      : isError 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-rose-500/10'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20'
                  }`}
               >
                 {isLogging ? (
                   <><Loader2 className="animate-spin" size={20} /> Logging to Database...</>
                 ) : isSuccess ? (
                   <><CheckCircle2 size={20} /> Trade Saved!</>
                 ) : isError ? (
                   <><XCircle size={20} /> Failed to Save. Check Console.</>
                 ) : (
                   "Execute & Log Trade"
                 )}
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
