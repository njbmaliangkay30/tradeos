import { Wallet, TrendingUp, Target, Clock, ArrowUpRight, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
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

      {/* Baris 2: Layout 2 Kolom (Kiri: Histori | Kanan: Kalender Makro) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Riwayat Trading (7 Kolom) */}
        <div className="xl:col-span-7 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-zinc-100 flex items-center gap-3">
              <Clock className="text-cyan-500" /> Recent Trades
            </h3>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">View All</button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-400 font-semibold border-b border-zinc-800">
                <tr>
                  <th className="pb-4 pl-4">Asset</th>
                  <th className="pb-4">Type</th>
                  <th className="pb-4">Result</th>
                  <th className="pb-4 text-right pr-4">PnL</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr>
                  <td colSpan={4} className="py-16 text-center text-zinc-500 italic border-b border-zinc-800/30">
                    No trade data recorded yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom Kanan: Kalender Ekonomi Investing.com (5 Kolom) */}
        <div className="xl:col-span-5 bg-zinc-900/60 border border-zinc-800/50 rounded-3xl backdrop-blur-md p-8 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-zinc-100 flex items-center gap-3">
              <Globe className="text-indigo-400" /> Macro Economic Calendar
            </h3>
          </div>
          
          {/* Iframe Wrapper untuk menyesuaikan ukuran */}
          <div className="flex-1 w-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/80">
            <iframe 
              src="https://sscal.investing.com?columns=exc_flags,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=5&calType=week&timeZone=8&lang=1" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allowTransparency={true} 
              marginWidth={0} 
              marginHeight={0}
              className="filter invert hue-rotate-180 contrast-90" // Trik CSS untuk mengubah iframe putih jadi mode gelap
            ></iframe>
          </div>
          <p className="text-[10px] text-zinc-500 text-center mt-3">Powered by Investing.com</p>
        </div>

      </div>
    </div>
  );
}
