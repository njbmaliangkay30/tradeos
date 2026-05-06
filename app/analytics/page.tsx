import { LineChart, TrendingUp, Crosshair, Wallet } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="border-b border-zinc-800/50 pb-6">
        <h1 className="text-4xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
          <LineChart className="text-cyan-500" size={36} /> Performance Analytics
        </h1>
        <p className="text-zinc-400 mt-2">Track your win rate and profitability based on data.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Crosshair size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Win Rate</h3>
          </div>
          <div className="text-4xl font-black text-zinc-100 mt-2">0.0%</div>
          <p className="text-xs text-zinc-500 mt-2">0 Wins / 0 Losses</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <TrendingUp size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Net Profit</h3>
          </div>
          <div className="text-4xl font-black text-emerald-400 mt-2">+$0.00</div>
          <p className="text-xs text-zinc-500 mt-2">Total across all trades</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 text-zinc-400 mb-2">
            <Wallet size={18} />
            <h3 className="font-semibold uppercase tracking-wider text-xs">Avg Risk/Reward</h3>
          </div>
          <div className="text-4xl font-black text-indigo-400 mt-2">1 : 0</div>
          <p className="text-xs text-zinc-500 mt-2">Based on your history</p>
        </div>
      </div>

      <div className="mt-8 p-16 border-2 border-dashed border-zinc-800/50 rounded-3xl text-center text-zinc-500 bg-zinc-900/20">
        <p className="font-medium text-zinc-400">Not enough data to generate charts.</p>
        <p className="text-sm mt-1">Start executing and logging trades to see your performance graph.</p>
      </div>
    </div>
  );
}
