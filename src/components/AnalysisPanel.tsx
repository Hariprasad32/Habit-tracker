import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Habit, CompletionData } from '../types';

interface AnalysisPanelProps {
  habits: Habit[];
  completions: CompletionData;
  month: string;
  // FIX: currentDate is needed to scope counts to the visible month
  currentDate: Date;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ habits, completions, month, currentDate }) => {
  // FIX: precompute the set of date keys that belong to the current month
  // so each habit row doesn't re-scan every completion date every render.
  const currentMonthKeys = useMemo(() => {
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const keys = new Set<string>();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, monthIndex, day);
      d.setHours(0, 0, 0, 0);
      // Don't count future dates — they can't have completions anyway,
      // but excluding them keeps the denominator (habit.goal) honest.
      if (d <= today) {
        keys.add(
          `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        );
      }
    }
    return keys;
  }, [currentDate]);

  return (
    <div className="card h-full flex flex-col bg-bg-card border-white/5 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Habit Analysis</h2>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{month}</span>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar space-y-6">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] sm:text-[11px] uppercase font-black tracking-[0.2em] text-white/50 border-b border-white/5">
              <th className="text-left py-5 px-4 sm:px-6">Habit</th>
              <th className="text-center py-5">Monthly Goal</th>
              <th className="text-right py-5 px-4 sm:px-6">Month Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {habits.map((habit) => {
              // FIX: count only completions whose date key falls in the current visible month
              const actual = Array.from(currentMonthKeys).reduce((acc, key) => {
                return acc + (completions[key]?.[habit.id] ? 1 : 0);
              }, 0);

              const progress = Math.min(Math.round((actual / habit.goal) * 100), 100);

              return (
                <tr key={habit.id} className="group transition-colors">
                  <td className="py-6 px-4 sm:px-6">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]">{habit.emoji}</span>
                      <span className="font-black text-sm sm:text-base text-white group-hover:text-primary transition-colors tracking-tight">{habit.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-white">{habit.goal}</span>
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Target</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 sm:px-6 text-right">
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-primary">{actual}</span>
                        <span className="text-xs font-black text-white/60 tracking-widest">/ {habit.goal}</span>
                        <span className="ml-2 text-sm font-black text-secondary">{progress}%</span>
                      </div>
                      <div className="w-32 sm:w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisPanel;