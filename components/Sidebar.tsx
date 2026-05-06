'use client';

import { LayoutDashboard, Calculator, BookOpen, LineChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [active, setActive] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'calculator', name: 'Risk Calculator', icon: Calculator, href: '#' },
    { id: 'journal', name: 'Trading Journal', icon: BookOpen, href: '#' },
    { id: 'analytics', name: 'Analytics', icon: LineChart, href: '#' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0f172a] border-r border-slate-800 text-slate-300 flex flex-col fixed left-0 top-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white mr-3 shadow-lg shadow-blue-500/20">
          T
        </div>
        <h1 className="text-xl font-bold text-white tracking-wider">Trade<span className="text-blue-500">OS</span></h1>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? "text-blue-500" : "text-slate-400"} />
              <span className="font-medium text-sm">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Settings */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
          <Settings size={20} className="text-slate-400" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
