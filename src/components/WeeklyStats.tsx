import React from 'react';
import { motion } from 'framer-motion';
import { Habit, CompletionData } from '../types';

interface WeeklyStatsProps {
  habits: Habit[];
  completions: CompletionData;
  currentDate: Date;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ habits, completions, currentDate }) => {
  const weeks = [1, 2, 3, 4];
  
  // Calculate current week of month
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentWeekNum = Math.ceil((today.getDate() + startOfMonth.getDay()) / 7);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {weeks.map((week) => {
        const isCurrent = week === currentWeekNum;
        
        // Simulating data for stats display
        const progress = isCurrent ? Math.min(Math.floor(Math.random() * 40) + 50, 100) : 20;

        return (
          <div 
            key={week} 
            className={`card group transition-all duration-500 border-white/5 ${
                isCurrent 
                ? 'opacity-100 border-primary/30 bg-primary/[0.05] shadow-[0_0_30px_rgba(139,92,246,0.1)]' 
                : 'opacity-40 grayscale hover:opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Week Progress</span>
                <h3 className={`text-xl font-black transition-colors tracking-tighter uppercase italic ${isCurrent ? 'text-primary' : 'text-white'}`}>
                  Week {week}
                </h3>
              </div>
              {isCurrent && (
                <div className="px-3 py-1 bg-primary text-[10px] font-black text-white uppercase tracking-widest rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                    Current
                </div>
              )}
            </div>

            <div className={`space-y-6 ${!isCurrent ? 'blur-[1px]' : ''}`}>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-white tracking-tighter transition-all group-hover:scale-105 origin-left">
                    {progress}%
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Completion Rate</span>
                </div>
              </div>
              
              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className={`h-full rounded-full ${isCurrent ? 'bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/10'}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyStats;
