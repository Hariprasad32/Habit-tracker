import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Habit, CompletionData } from '../types';

interface WeeklyStatsProps {
  habits: Habit[];
  completions: CompletionData;
  currentDate: Date;
  userJoinDate?: string;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ habits, completions, currentDate, userJoinDate }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const weeks = useMemo(() => {
    if (habits.length === 0) return [];

    const start = userJoinDate ? new Date(userJoinDate) : new Date(today.getFullYear(), today.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    const endOfYear = new Date(start.getFullYear(), 11, 31);
    endOfYear.setHours(0, 0, 0, 0);

    const weeksArr: { weekNumber: number; progress: number; isCurrent: boolean }[] = [];
    let weekNum = 1;

    // FIX: use a fresh offset-based loop instead of mutating a shared date object
    // This prevents useMemo from producing different results on re-runs.
    let offset = 0;

    while (weeksArr.length < 52) {
      const weekDays: string[] = [];
      let weekDone = 0;
      let weekExceedsYear = false;

      for (let i = 0; i < 7; i++) {
        // FIX: clone from start each time using the offset — no shared mutation
        const day = new Date(start);
        day.setDate(start.getDate() + offset);
        offset++;

        if (day > endOfYear) {
          weekExceedsYear = true;
          break;
        }

        const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        weekDays.push(key);

        if (completions[key]) {
          weekDone += Object.values(completions[key]).filter(Boolean).length;
        }
      }

      if (weekDays.length === 0) break;

      // Only count elapsed days (days up to and including today) for the denominator
      // so a future week doesn't show 0% just because its days haven't happened yet.
      const elapsedDaysInWeek = weekDays.filter(key => {
        return key <= todayKey;
      });

      const possible = habits.length * elapsedDaysInWeek.length;
      // Only count completions for elapsed days
      const elapsedDone = elapsedDaysInWeek.reduce((acc, key) => {
        if (!completions[key]) return acc;
        return acc + Object.values(completions[key]).filter(Boolean).length;
      }, 0);

      const progress = possible > 0 ? Math.round((elapsedDone / possible) * 100) : 0;
      const isCurrent = weekDays.includes(todayKey);

      weeksArr.push({ weekNumber: weekNum++, progress, isCurrent });

      if (weekExceedsYear) break;
    }

    // Show 4 weeks centred around the current week
    const currentIdx = weeksArr.findIndex(w => w.isCurrent);
    if (currentIdx === -1) return weeksArr.slice(0, 4);
    const startIdx = Math.max(0, currentIdx - 1);
    return weeksArr.slice(startIdx, startIdx + 4);
  }, [habits, completions, userJoinDate, todayKey]);

  if (weeks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {weeks.map((week) => {
        const isCurrent = week.isCurrent;

        return (
          <div
            key={week.weekNumber}
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
                  Week {week.weekNumber}
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
                    {week.progress}%
                  </span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Completion Rate</span>
                </div>
              </div>

              <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${week.progress}%` }}
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