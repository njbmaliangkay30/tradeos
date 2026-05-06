import { BookOpen, Plus } from 'lucide-react';

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-blue-500" /> Trading Journal
          </h1>
          <p className="text-slate-400 text-sm mt-1">Record your trades to find your edge in the market.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={18} /> New Trade
        </button>
      </header>

      {/* Placeholder Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Pair</th>
                <th className="px-6 py-4">Direction</th>
                <th className="px-6 py-4">Entry</th>
                <th className="px-6 py-4">PnL</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Data Kosong */}
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen size={48} className="mb-3 opacity-20" />
                    <p>No trades recorded yet.</p>
                    <p className="text-xs mt-1">Click "New Trade" to add your first entry.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
