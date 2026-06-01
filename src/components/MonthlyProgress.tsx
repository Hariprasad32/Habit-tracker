import React from 'react';
import { motion } from 'framer-motion';
import { Habit, CompletionData } from '../types';
import { Target, CheckCircle2, XCircle, Flame, Trophy } from 'lucide-react';

interface MonthlyProgressProps {
  habits: Habit[];
  completions: CompletionData;
  month: string;
}

const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ habits, completions, month }) => {
  const totalDays = 30;
  const totalPossible = habits.length * totalDays;
  const totalDone = Object.values(completions).reduce((acc, curr) => {
    return acc + Object.values(curr).filter(Boolean).length;
  }, 0);
  
  const progress = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
  const missed = Math.max(totalPossible - totalDone, 0);

  const statItems = [
    { label: 'Total Habits', value: habits.length, icon: Target, color: 'text-secondary' },
    { label: 'Total Done', value: totalDone, icon: CheckCircle2, color: 'text-primary' },
    { label: 'Missed Days', value: missed, icon: XCircle, color: 'text-accent' },
    { label: 'Best Streak', value: '18 Days', icon: Flame, color: 'text-orange-500' },
    { label: 'Year Goal', value: '45%', icon: Trophy, color: 'text-yellow-500' },
  ];

  return (
    <div className="card space-y-12 !bg-primary/[0.02] border-primary/20 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Monthly Progress</span>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{month} Summary</h2>
          </div>
          <div className="text-right">
             <span className="text-6xl font-black text-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">{progress}%</span>
             <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Completion Rate</p>
          </div>
        </div>
        
        <div className="h-6 w-full bg-white/[0.05] rounded-[2rem] border border-white/5 p-1.5 shadow-inner overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {statItems.map((item) => (
          <div key={item.label} className="bg-white/[0.02] rounded-[2rem] p-6 border border-white/[0.05] flex flex-col gap-4 transition-all hover:bg-white/[0.05] hover:-translate-y-2 group">
            <div className={`p-4 w-fit rounded-2xl bg-white/5 shadow-sm group-hover:scale-110 transition-transform ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">{item.label}</span>
              <span className="text-2xl font-black text-white tracking-tight">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyProgress;
