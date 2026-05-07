'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowUpRight, ArrowDownRight, Loader2, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Tipe Data Trade
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
  
  // State untuk Pop-up Modal "Close Trade"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [closeStatus, setCloseStatus] = useState('WIN'); // Default WIN
  const [pnlValue, setPnlValue] = useState<number | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTrades(data);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Membuka Modal
  const openCloseModal = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsModalOpen(true);
    setPnlValue(''); // Kosongkan input PnL
    setCloseStatus('WIN');
  };

  // Mengeksekusi penutupan trade (Update Database)
  const handleCloseTrade = async () => {
    if (!selectedTrade || pnlValue === '') return;
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('trades')
        .update({
          status: closeStatus,
          pnl: closeStatus === 'LOSS' ? -Math.abs(Number(pnlValue)) : Number(pnlValue) // Jika Loss, pastikan angkanya minus
        })
        .eq('id', selectedTrade.id);

      if (error) throw error;

      // Jika berhasil update di database, refresh data tabel
      setIsModalOpen(false);
      fetchTrades();
    } catch (error) {
      console.error("Error updating trade:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <header className="flex justify-between items-center border-b border-zinc-800/50 pb-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
            <BookOpen className="text-cyan-500" size={36} /> Trade Journal
          </h1>
          <p className="text-zinc-400 mt-2">Manage your open positions and log your results.</p>
        </div>
        <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800/50 text-zinc-300 text-sm font-medium">
          Total Logs: <span className="text-cyan-400 font-bold ml-1">{trades.length}</span>
        </div>
      </header>

      {/* Tabel Data */}
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/50 text-zinc-400 font-semibold border-b border-zinc-800/50">
              <tr>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Pair</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Entry / SL</th>
                <th className="px-6 py-5">Result (PnL)</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {isLoading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-500"><Loader2 size={32} className="animate-spin mx-auto text-cyan-500 mb-3" /> Fetching data...</td></tr>
              )}
              {!isLoading && trades.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-zinc-500"><BookOpen size={48} className="mb-4 opacity-20 mx-auto" /><p className="font-medium text-zinc-400">No trades recorded yet.</p></td></tr>
              )}

              {/* Looping Data Trades */}
              {!isLoading && trades.map((trade) => {
                const dateObj = new Date(trade.created_at);
                const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

                return (
                  <tr key={trade.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-200">{formattedDate}</td>
                    <td className="px-6 py-4 font-mono font-bold text-zinc-100">{trade.pair}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 font-bold text-[11px] px-2 py-1 rounded w-max ${trade.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trade.direction === 'LONG' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trade.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">
                      EP: {trade.entry_price} <br/> SL: {trade.stop_loss}
                    </td>
                    <td className="px-6 py-4">
                      {trade.status === 'OPEN' ? (
                        <span className="text-zinc-500 italic">Waiting...</span>
                      ) : (
                        <span className={`font-bold ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trade.status === 'OPEN' ? (
                        <button onClick={() => openCloseModal(trade)} className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-600/50 px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                          Settle Trade
                        </button>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          trade.status === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 
                          trade.status === 'LOSS' ? 'bg-rose-500/20 text-rose-400' : 
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {trade.status}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP MODAL (Hanya muncul jika isModalOpen = true) */}
      {isModalOpen && selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-zinc-100 mb-1">Settle Position</h3>
            <p className="text-sm text-zinc-400 mb-6 font-mono">{selectedTrade.pair} • {selectedTrade.direction}</p>
            
            {/* Pilihan Hasil (WIN / LOSS / BEP) */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button onClick={() => setCloseStatus('WIN')} className={`flex flex-col items-center p-3 rounded-xl border ${closeStatus === 'WIN' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                <CheckCircle2 size={24} className="mb-2"/> <span className="text-xs font-bold">WIN</span>
              </button>
              <button onClick={() => setCloseStatus('LOSS')} className={`flex flex-col items-center p-3 rounded-xl border ${closeStatus === 'LOSS' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                <XCircle size={24} className="mb-2"/> <span className="text-xs font-bold">LOSS</span>
              </button>
              <button onClick={() => setCloseStatus('BEP')} className={`flex flex-col items-center p-3 rounded-xl border ${closeStatus === 'BEP' ? 'bg-zinc-800 border-zinc-500 text-zinc-300' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                <MinusCircle size={24} className="mb-2"/> <span className="text-xs font-bold">BEP</span>
              </button>
            </div>

            {/* Input Profit / Loss */}
            <div className="mb-6">
              <label className="block text-xs text-zinc-400 mb-2 uppercase font-semibold">Realized PnL ($)</label>
              <input 
                type="number" 
                value={pnlValue} 
                onChange={(e) => setPnlValue(Number(e.target.value))} 
                className={`w-full bg-zinc-950 border rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-1 transition-all ${
                  closeStatus === 'WIN' ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500' :
                  closeStatus === 'LOSS' ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' :
                  'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500'
                }`}
                placeholder="e.g. 50"
              />
              {closeStatus === 'LOSS' && <p className="text-[10px] text-zinc-500 mt-2">*Ketik angka positif saja, sistem otomatis menjadikannya minus.</p>}
            </div>

            {/* Tombol Eksekusi */}
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-zinc-950 text-zinc-300 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-colors font-medium text-sm">
                Cancel
              </button>
              <button onClick={handleCloseTrade} disabled={isUpdating || pnlValue === ''} className="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-lg transition-colors font-bold text-sm flex items-center justify-center">
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Result'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
