'use client';

import { LayoutDashboard, Calculator, BookOpen, LineChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false); // Default tertutup (kecil)

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'calculator', name: 'Risk Calculator', icon: Calculator, href: '/calculator' },
    { id: 'journal', name: 'Trading Journal', icon: BookOpen, href: '/journal' },
    { id: 'analytics', name: 'Analytics', icon: LineChart, href: '/analytics' },
  ];

  return (
    <div 
      // LOGIKA BARU: Buka saat mouse masuk, tutup saat mouse keluar
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen bg-[#0f172a] border-r border-slate-800 text-slate-300 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 overflow-hidden whitespace-nowrap">
        <div className="w-8 h-8 min-w-[2rem] bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          T
        </div>
        <h1 className={`text-xl font-bold text-white tracking-wider ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          Trade<span className="text-blue-500">OS</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={`min-w-[1.25rem] ${isActive ? "text-blue-500" : "text-slate-400"}`} />
              <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-slate-800 overflow-hidden">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <Settings size={20} className="min-w-[1.25rem] text-slate-400" />
          <span className={`font-medium text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}
