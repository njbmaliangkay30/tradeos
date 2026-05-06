import { Wallet, TrendingUp, Target, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end pb-6 border-b border-zinc-800/50">
        <div>
          <h2 className="text-4xl font-black text-zinc-100 tracking-tight">Overview</h2>
          <p className="text-zinc-400 mt-2">Welcome to TradeOS. Your terminal is ready.</p>
        </div>
      </header>

      {/* Baris 1: Kartu Metrik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-cyan-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Total Balance</div>
            <Wallet size={20} className="text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-zinc-100">$1,000.00</div>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <ArrowUpRight size={14} /> +0.0% this week
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Net Profit</div>
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">+$0.00</div>
          <div className="mt-2 text-xs text-zinc-500">From 0 closed trades</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-md hover:border-indigo-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Current Win Rate</div>
            <Target size={20} className="text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-zinc-100">0.0%</div>
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-1.5">
             <div className="bg-indigo-400 h-1.5 rounded-full w-[0%]"></div>
          </div>
        </div>
      </div>

      {/* Baris 2: Riwayat Trading Terakhir */}
      <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-zinc-100 flex items-center gap-3">
            <Clock className="text-cyan-500" /> Recent Trades History
          </h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">View All</button>
        </div>

        {/* Tabel Placeholder */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-400 font-semibold border-b border-zinc-800">
              <tr>
                <th className="pb-4 pl-4">Asset</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Entry Date</th>
                <th className="pb-4">Result</th>
                <th className="pb-4 text-right pr-4">PnL</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {/* Ini contoh data kosong, nanti akan diisi otomatis dari database Supabase */}
              <tr>
                <td colSpan={5} className="py-12 text-center text-zinc-500 italic border-b border-zinc-800/30">
                  No trade data recorded yet. Head over to the Journal to log your first trade.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
