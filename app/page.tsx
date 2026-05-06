import { Wallet, Activity, Crosshair } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Baru */}
      <header className="flex justify-between items-end pb-6 border-b border-zinc-800/50">
        <div>
          <h2 className="text-4xl font-black text-zinc-100 tracking-tight">Overview</h2>
          <p className="text-zinc-400 mt-2">Welcome back to your terminal. Stay disciplined.</p>
        </div>
        <div className="text-right flex items-center gap-3 bg-zinc-900/50 px-5 py-3 rounded-2xl border border-zinc-800/50">
          <Wallet className="text-cyan-400" size={24} />
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-0.5">Active Capital</div>
            <div className="text-2xl font-mono text-zinc-100 font-bold">$1,000.00</div>
          </div>
        </div>
      </header>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOP Widget */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <Crosshair className="text-cyan-400" />
            <h3 className="font-bold text-xl text-zinc-100">Daily Execution SOP</h3>
          </div>
          
          <div className="space-y-4">
            {[
              "Check 4H Trend (Price vs MA 200)",
              "Wait for pullback to MA 50/100 on 1H timeframe",
              "Confirm Confluence with Fibonacci 0.618 (Golden Pocket)",
              "Validate with Reversal Candle (Pin Bar / Engulfing)",
              "Calculate Risk before clicking Buy/Sell"
            ].map((task, i) => (
              <label key={i} className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl hover:bg-zinc-800/30 transition-colors border border-transparent hover:border-zinc-800">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border-2 border-zinc-700 bg-zinc-900 checked:bg-cyan-500 checked:border-cyan-500 transition-all" />
                  <svg className="absolute w-3 h-3 text-zinc-950 opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{task}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Quick Stats Placeholder */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="text-sm font-medium text-zinc-400">Weekly Target</div>
                <Activity size={18} className="text-emerald-400" />
             </div>
             <div className="text-3xl font-black text-zinc-100 mb-2">+$150.00</div>
             <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2 rounded-full w-1/3"></div>
             </div>
             <div className="text-xs text-zinc-500 mt-3 text-right">30% completed</div>
          </div>
        </div>

      </div>
    </div>
  );
}
