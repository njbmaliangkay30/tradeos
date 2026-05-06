'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Definisi tipe data agar TypeScript tidak marah
type Trade = {
  id: string;
  created_at: string;
  pair: string;
  direction: string;
  entry_price: number;
  stop_loss: number;
  position_size: number;
  risk_amount: number;
  status: string;
  pnl: number;
};

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk menarik data dari Supabase
  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

      if (error) throw error;
      if (data) setTrades(data);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Jalankan fungsi fetch saat halaman pertama kali dibuka
  useEffect(() => {
    fetchTrades();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-zinc-800/50 pb-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
            <BookOpen className="text-cyan-500" size={36} /> Trade Journal
          </h1>
          <p className="text-zinc-400 mt-2">Record your trades to find your edge in the market.</p>
        </div>
        <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800/50 text-zinc-300 text-sm font-medium">
          Total Trades: <span className="text-cyan-400 font-bold ml-1">{trades.length}</span>
        </div>
      </header>

      {/* Tabel Data */}
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/50 text-zinc-400 font-semibold border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Pair</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Entry / SL</th>
                <th className="px-6 py-5">Risk</th>
                <th className="px-6 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              
              {/* Jika Sedang Loading */}
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <Loader2 size={32} className="animate-spin mx-auto text-cyan-500 mb-3" />
                    Fetching data from database...
                  </td>
                </tr>
              )}

              {/* Jika Data Kosong */}
              {!isLoading && trades.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                    <BookOpen size={48} className="mb-4 opacity-20 mx-auto" />
                    <p className="font-medium text-zinc-400">No trades recorded yet.</p>
                    <p className="text-xs mt-1">Execute a trade in the Position Sizer to see it here.</p>
                  </td>
                </tr>
              )}

              {/* Looping Data Trades */}
              {!isLoading && trades.map((trade) => {
                // Format Tanggal
                const dateObj = new Date(trade.created_at);
                const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                const formattedTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={trade.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-200">{formattedDate}</div>
                      <div className="text-xs text-zinc-500">{formattedTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-zinc-100">{trade.pair}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 font-bold text-xs ${trade.direction === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.direction === 'LONG' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="text-zinc-300">EP: {trade.entry_price}</div>
                      <div className="text-zinc-500">SL: {trade.stop_loss}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-rose-400 font-medium">-${trade.risk_amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
