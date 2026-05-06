'use client';

import { LayoutDashboard, Calculator, BookOpen, LineChart, Settings, Hexagon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Overview', icon: LayoutDashboard, href: '/' },
    { id: 'calculator', name: 'Position Sizer', icon: Calculator, href: '/calculator' },
    { id: 'journal', name: 'Trade Journal', icon: BookOpen, href: '/journal' },
    { id: 'analytics', name: 'Analytics', icon: LineChart, href: '/analytics' },
  ];

  return (
    <div 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen bg-[#09090b] border-r border-zinc-800/50 flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ease-out shadow-2xl ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* NEW LOGO AREA */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-800/50 overflow-hidden whitespace-nowrap">
        <div className="relative flex items-center justify-center min-w-[2rem]">
          <Hexagon className="text-cyan-500 absolute w-10 h-10 animate-pulse opacity-20" />
          <Hexagon className="text-cyan-400 w-8 h-8 relative z-10" />
        </div>
        <h1 className={`text-2xl font-black tracking-tight ml-4 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-zinc-100">Trade</span>
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text">OS</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-8 px-4 space-y-3 overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/20 shadow-[inset_4px_0_0_0_rgba(6,182,212,1)]' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
              }`}
            >
              <Icon size={22} className={`min-w-[1.375rem] transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
              <span className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-zinc-800/50 overflow-hidden">
        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors group">
          <Settings size={22} className="min-w-[1.375rem] group-hover:rotate-90 transition-transform duration-500" />
          <span className={`font-semibold text-sm whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            System Settings
          </span>
        </button>
      </div>
    </div>
  );
}
