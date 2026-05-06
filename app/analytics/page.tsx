import { LineChart, TrendingUp, Crosshair, Wallet } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <LineChart className="text-blue-500" /> Performance Analytics
        </h1>
        <p className="text-slate-400 text-sm mt-1">Track your win rate and profitability.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Crosshair size={18} />
            <h3 className="font-medium">Win Rate</h3>
          </div>
          <div className="text-3xl font-bold text-white">0.0%</div>
          <p className="text-xs text-slate-500 mt-2">0 Wins / 0 Losses</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <TrendingUp size={18} />
            <h3 className="font-medium">Net Profit</h3>
          </div>
          <div className="text-3xl font-bold text-green-400">+$0.00</div>
          <p className="text-xs text-slate-500 mt-2">Total profit/loss across all trades</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Wallet size={18} />
            <h3 className="font-medium">Avg Risk/Reward</h3>
          </div>
          <div className="text-3xl font-bold text-blue-400">1 : 0</div>
          <p className="text-xs text-slate-500 mt-2">Based on your trading history</p>
        </div>
      </div>

      <div className="mt-8 p-12 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500">
        <p>Chart data will appear here once you start logging your trades.</p>
      </div>
    </div>
  );
}
