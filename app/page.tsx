'use client'; 

import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, Clock, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Default Modal Awal (Nanti bisa dipindah ke database setting akun jika perlu)
const INITIAL_CAPITAL = 130; 

export default function Home() {
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  
  // States untuk Analytics Metrik
  const [totalBalance, setTotalBalance] = useState(INITIAL_CAPITAL);
  const [netProfit, setNetProfit] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [closedTradesCount, setClosedTradesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Ambil 5 Trade Terakhir untuk Tabel
        const { data: recentData } = await supabase
          .from('trades')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        if (recentData) setRecentTrades(recentData);

        // 2. Ambil SEMUA data trade untuk menghitung Metrik PnL
        const { data: allData } = await supabase.from('trades').select('status, pnl');
        
        if (allData) {
          // Filter hanya trade yang sudah beres (WIN/LOSS/BEP)
          const closedTrades = allData.filter(t => t.status !== 'OPEN');
          setClosedTradesCount(closedTrades.length);

          // Hitung Net Profit
          const totalPnL = closedTrades.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0);
          setNetProfit(totalPnL);
          setTotalBalance(INITIAL_CAPITAL + totalPnL); // Balance = Modal + PnL

          // Hitung Win Rate
          const winTrades = closedTrades.filter(t => t.status === 'WIN');
          if (closedTrades.length > 0) {
            setWinRate((winTrades.length / closedTrades.length) * 100);
          }
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // UI Helper Variables
  const isProfit = netProfit >= 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <header className="flex justify-between items-end pb-6 border-b border-zinc-800/50">
        <div>
          <h2 className="text-4xl font-black text-zinc-100 tracking-tight">Overview</h2>
          <p className="text-zinc-400 mt-2">Welcome to TradeOS. Your terminal is ready.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Initial Capital</div>
          <div className="text-lg font-mono text-zinc-400 font-medium">${INITIAL_CAPITAL.toFixed(2)}</div>
        </div>
      </header>

      {/* BARIS 1: KARTU METRIK UTAMA (Sekarang Hidup & Dinamis!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KARTU 1: TOTAL BALANCE */}
        <div className={`relative overflow-hidden p-6 rounded-3xl backdrop-blur-md border shadow-lg transition-colors ${isProfit ? 'bg-zinc-900/60 border-emerald-500/30' : 'bg-zinc-900/60 border-rose-500/30'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Total Balance</div>
            <Wallet size={20} className={isProfit ? 'text-emerald-400' : 'text-rose-400'} />
          </div>
          {isLoading ? (
            <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse w-1/2"></div>
          ) : (
            <>
              <div className={`text-4xl font-black tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                ${totalBalance.toFixed(2)}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 font-medium">
                Real-time calculation based on your journal.
              </div>
            </>
          )}
          {/* Aksen Gradien Tipis di Background */}
          <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[60px] ${isProfit ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}></div>
        </div>

        {/* KARTU 2: NET PROFIT */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-cyan-500/30 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Net Profit</div>
            {isProfit ? <TrendingUp size={20} className="text-emerald-400" /> : <TrendingDown size={20} className="text-rose-400" />}
          </div>
          {isLoading ? (
            <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse w-1/2"></div>
          ) : (
            <>
              <div className={`text-4xl font-black tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isProfit ? '+' : '-'}${Math.abs(netProfit).toFixed(2)}
              </div>
              <div className="mt-2 text-xs text-zinc-500">From {closedTradesCount} closed trades</div>
            </>
          )}
        </div>

        {/* KARTU 3: WIN RATE */}
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-indigo-500/30 transition-colors shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Current Win Rate</div>
              <Target size={20} className="text-indigo-400" />
            </div>
            {isLoading ? (
              <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse w-1/3"></div>
            ) : (
              <div className="text-4xl font-black text-zinc-100 tracking-tight">{winRate.toFixed(1)}%</div>
            )}
          </div>
          {!isLoading && (
            <div className="mt-4 w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
               <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${winRate}%` }}></div>
            </div>
          )}
        </div>
      </div>

      {/* BARIS 2: TABEL & KALENDER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* KOLOM KIRI: RIWAYAT TRADING TERBARU */}
        <div className="xl:col-span-7 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-800/50 pb-4">
            <h3 className="font-bold text-xl text-zinc-100 flex items-center gap-3">
              <Clock className="text-cyan-500" /> Recent Trades
            </h3>
            <Link href="/journal" className="text-sm text-zinc-400 hover:text-cyan-400 font-medium transition-colors bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
              View Journal →
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="pb-3 pl-2">Asset</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">PnL</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300 divide-y divide-zinc-800/30">
                {isLoading && (
                  <tr><td colSpan={4} className="py-12 text-center text-zinc-500">Loading your data...</td></tr>
                )}
                {!isLoading && recentTrades.length === 0 && (
                  <tr><td colSpan={4} className="py-12 text-center text-zinc-500 italic">No trade data recorded yet.</td></tr>
                )}
                {!isLoading && recentTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="py-4 pl-2 font-mono font-bold text-zinc-100">{trade.pair}</td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1 font-bold text-[10px] px-2 py-1 rounded w-max ${trade.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trade.direction === 'LONG' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trade.direction}
                      </span>
                    </td>
                    <td className="py-4">
                      {trade.status === 'OPEN' ? (
                        <span className="text-zinc-500 text-xs italic font-medium">In Progress</span>
                      ) : (
                         <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider ${trade.status === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : trade.status === 'LOSS' ? 'bg-rose-500/20 text-rose-400' : 'bg-zinc-800 text-zinc-400'}`}>
                           {trade.status}
                         </span>
                      )}
                    </td>
                    <td className="py-4 text-right pr-2">
                      {trade.status === 'OPEN' ? (
                        <span className="text-zinc-600 text-xs">-</span>
                      ) : (
                        <span className={`font-black ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KOLOM KANAN: KALENDER */}
        <div className="xl:col-span-5 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8 flex flex-col min-h-[500px] shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-800/50 pb-4">
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
              <span className="text-[11px] text-zinc-500">Kalender by <a href="https://id.investing.com" rel="nofollow" target="_blank" className="text-cyan-500 font-semibold">Investing.com</a></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
