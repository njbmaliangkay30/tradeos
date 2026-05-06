'use client'; // WAJIB DITAMBAHKAN KARENA KITA MENGGUNAKAN USEEFFECT

import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Target, Clock, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [recentTrades, setRecentTrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Ambil 5 data paling baru saja
      
      if (data) setRecentTrades(data);
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex justify-between items-end pb-6 border-b border-zinc-800/50">
        <div>
          <h2 className="text-4xl font-black text-zinc-100 tracking-tight">Overview</h2>
          <p className="text-zinc-400 mt-2">Welcome to TradeOS. Your terminal is ready.</p>
        </div>
      </header>

      {/* METRIK UTAMA (Belum Terkoneksi, kita hubungkan di fase Analytics nanti) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-cyan-500/30 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Total Balance</div>
            <Wallet size={20} className="text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-zinc-100">$1,000.00</div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium"><ArrowUpRight size={14} /> +0.0% this week</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-emerald-500/30 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Net Profit</div>
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">+$0.00</div>
          <div className="mt-2 text-xs text-zinc-500">From 0 closed trades</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-indigo-500/30 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Current Win Rate</div>
            <Target size={20} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-zinc-100">0.0%</div>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5"><div className="bg-indigo-400 h-1.5 rounded-full w-[0%]"></div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: RIWAYAT TRADING TERBARU */}
        <div className="xl:col-span-7 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-zinc-100 flex items-center gap-3">
              <Clock className="text-cyan-500" /> Recent Trades
            </h3>
            <Link href="/journal" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="pb-4 pl-2">Asset</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right pr-2">Risk</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 divide-y divide-zinc-800/30">
                {recentTrades.length === 0 && (
                  <tr><td colSpan={4} className="py-12 text-center text-zinc-500 italic">No trade data recorded yet.</td></tr>
                )}
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-zinc-800/10">
                    <td className="py-3 pl-2 font-mono font-bold text-zinc-100">{trade.pair}</td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 font-bold text-xs ${trade.direction === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.direction === 'LONG' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trade.direction}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">{trade.status}</span>
                    </td>
                    <td className="py-3 text-right pr-2 text-rose-400 font-medium">-${trade.risk_amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KOLOM KANAN: KALENDER */}
        <div className="xl:col-span-5 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8 flex flex-col min-h-[500px] shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-zinc-100 flex items-center gap-3"><Globe className="text-indigo-400" /> Economic Calendar</h3>
          </div>
          <div className="flex-1 w-full bg-zinc-950 rounded-xl border border-zinc-800/80 overflow-hidden relative flex flex-col">
            <div className="flex-1 w-full relative">
              <iframe 
                src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=5,25,37,45,39,14,48,4,10,35,17,6,11,42,44,22,43,36,26,12,46,41,178,72&calType=week&timeZone=113&lang=54" 
                width="100%" height="100%" frameBorder={0} allowTransparency={true} marginWidth={0} marginHeight={0} className="absolute top-0 left-0 w-full h-full filter invert hue-rotate-180 contrast-90"
              ></iframe>
            </div>
            <div className="w-full text-center py-2 bg-zinc-950 border-t border-zinc-800/80 z-10 relative">
              <span className="text-[11px] text-zinc-500">
                Kalender Ekonomi Real Time dipersembahkan oleh <a href="https://id.investing.com" rel="nofollow" target="_blank" className="text-cyan-500 font-semibold">Investing.com</a>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
