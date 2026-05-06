import { BookOpen, Plus } from 'lucide-react';

export default function JournalPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center border-b border-zinc-800/50 pb-6">
        <div>
          {/* FONT DISAMAKAN DENGAN HALAMAN LAIN */}
          <h1 className="text-4xl font-black text-zinc-100 tracking-tight flex items-center gap-3">
            <BookOpen className="text-cyan-500" size={36} /> Trade Journal
          </h1>
          <p className="text-zinc-400 mt-2">Record your trades to find your edge in the market.</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95">
          <Plus size={18} /> New Entry
        </button>
      </header>

      {/* Tabel */}
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/50 text-zinc-400 font-semibold border-b border-zinc-800/50">
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
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center">
                    <BookOpen size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-zinc-400">No trades recorded yet.</p>
                    <p className="text-xs mt-1">Check your SOP in Position Sizer and log your first trade.</p>
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
