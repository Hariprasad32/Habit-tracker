import React from 'react';
import { ChevronLeft, ChevronRight, Download, Plus, Search, CheckCircle2, LogOut, User } from 'lucide-react';

interface HeaderProps {
  month: string;
  year: number;
  onAddHabit: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onLogout?: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  month, 
  year, 
  onAddHabit,
  onPrevMonth,
  onNextMonth,
  onLogout,
  userName
}) => {
  return (
    <header className="px-4 sm:px-8 pt-4 sm:pt-8 flex flex-col md:flex-row gap-4 sm:gap-6 justify-between items-center sticky top-0 z-50 pb-4 sm:pb-6 bg-[#0B0E14]/80 backdrop-blur-xl">
      <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2 sm:gap-4 text-primary">
          <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg sm:rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <CheckCircle2 size={24} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
          </div>
          <span className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase italic">Quanta</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 rounded-2xl border border-white/5 p-1.5 shadow-inner">
          <button 
            onClick={onPrevMonth}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-6 text-sm font-black min-w-[140px] text-center text-white/80 uppercase tracking-widest">
            {month} {year}
          </span>
          <button 
            onClick={onNextMonth}
            className="p-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search habits..."
            className="pl-14 pr-6 py-4 rounded-2xl border border-white/5 bg-white/5 text-sm outline-none w-64 focus:border-primary/50 focus:bg-white/[0.08] transition-all font-bold text-white placeholder:text-white/20"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5">
             <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                {userName?.charAt(0) || 'U'}
             </div>
             <div className="hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-none mb-1">User Account</p>
                <p className="text-xs font-black text-white leading-none truncate max-w-[80px]">{userName || 'User'}</p>
             </div>
             <button 
              onClick={onLogout}
              className="ml-2 p-2 hover:bg-white/5 text-white/20 hover:text-accent rounded-xl transition-all"
             >
                <LogOut size={18} />
             </button>
          </div>

          <button 
            onClick={onAddHabit}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:scale-105 transition-all text-center"
          >
            <Plus size={20} />
            <span className="hidden sm:inline uppercase tracking-tight">Add Habit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
