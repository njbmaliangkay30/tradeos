import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Dasbor */}
      <header className="flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Dashboard</h2>
          <p className="text-slate-400 text-sm">Welcome back. Market is volatile, stick to the plan.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Capital</div>
          <div className="text-2xl font-mono text-green-400 font-bold">$1,000.00</div>
        </div>
      </header>

      {/* Grid Layout untuk Konten */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Calculator (Memakan 7 kolom) */}
        <div className="xl:col-span-7">
          {/* INI YANG DIPERBAIKI -> Memanggil <Calculator /> */}
          <Calculator /> 
        </div>

        {/* Kolom Kanan: SOP & Checklist (Memakan 5 kolom) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold text-lg text-white mb-4">Daily SOP (Crypto)</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Cek Tren TF 4H (Diatas/Dibawah MA 200?)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Tunggu koreksi ke MA 50/100 di TF 1H</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Konfirmasi Fibonacci 0.618 (Golden Pocket)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Validasi Candle Reversal (Pin bar / Engulfing)</span>
              </label>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
               <p className="text-xs text-blue-400 italic">"No setup, no trade. Protect the capital."</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
