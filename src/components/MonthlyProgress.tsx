import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Habit, CompletionData } from '../types';
import { Target, CheckCircle2, XCircle, Flame, Trophy } from 'lucide-react';

interface MonthlyProgressProps {
  habits: Habit[];
  completions: CompletionData;
  month: string;
  userJoinDate?: string;
}

const MonthlyProgress: React.FC<MonthlyProgressProps> = ({ habits, completions, month, userJoinDate }) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const joinDate = userJoinDate
      ? new Date(userJoinDate)
      : new Date(today.getFullYear(), today.getMonth(), 1);
    joinDate.setHours(0, 0, 0, 0);

    // ── Current month bounds ──────────────────────────────────────────────────
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    // Effective start: whichever is later — join date or month start
    const effectiveStart = joinDate > monthStart ? joinDate : monthStart;

    // Elapsed days this month (yesterday and before, within the month)
    const elapsedDays: string[] = [];
    const d = new Date(effectiveStart);
    while (d < today) {
      elapsedDays.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
      d.setDate(d.getDate() + 1);
    }

    // FIX: totalDone is scoped to the current month only
    const monthlyDone = elapsedDays.reduce((acc, key) => {
      if (!completions[key]) return acc;
      return acc + Object.values(completions[key]).filter(Boolean).length;
    }, 0);

    const totalPossible = habits.length * elapsedDays.length;
    const progress = totalPossible > 0 ? Math.round((monthlyDone / totalPossible) * 100) : 0;

    // Missed days this month: elapsed days with zero activity
    const missedDays = elapsedDays.filter(key => {
      return !completions[key] || !Object.values(completions[key]).some(Boolean);
    }).length;

    // ── Best streak (all-time, across all dates since joining) ────────────────
    // FIX: was hardcoded as 0 — now computed properly
    const allDaysSinceJoin: string[] = [];
    const iter = new Date(joinDate);
    while (iter <= today) {
      allDaysSinceJoin.push(
        `${iter.getFullYear()}-${String(iter.getMonth() + 1).padStart(2, '0')}-${String(iter.getDate()).padStart(2, '0')}`
      );
      iter.setDate(iter.getDate() + 1);
    }

    let bestStreak = 0;
    let runningStreak = 0;
    for (const key of allDaysSinceJoin) {
      const date = new Date(key);
      date.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();
      const hasActivity = completions[key] && Object.values(completions[key]).some(Boolean);

      if (hasActivity) {
        runningStreak++;
        if (runningStreak > bestStreak) bestStreak = runningStreak;
      } else if (!isToday) {
        // Today without activity doesn't reset the streak
        runningStreak = 0;
      }
    }

    // ── Year goal: completion rate for the current calendar year ─────────────
    // FIX: was hardcoded as 0% — now computed properly
    const yearStart = new Date(today.getFullYear(), 0, 1);
    yearStart.setHours(0, 0, 0, 0);
    const yearEffectiveStart = joinDate > yearStart ? joinDate : yearStart;

    const yearElapsedDays: string[] = [];
    const yd = new Date(yearEffectiveStart);
    while (yd < today) {
      yearElapsedDays.push(
        `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, '0')}-${String(yd.getDate()).padStart(2, '0')}`
      );
      yd.setDate(yd.getDate() + 1);
    }

    const yearDone = yearElapsedDays.reduce((acc, key) => {
      if (!completions[key]) return acc;
      return acc + Object.values(completions[key]).filter(Boolean).length;
    }, 0);
    const yearPossible = habits.length * yearElapsedDays.length;
    const yearGoal = yearPossible > 0 ? Math.round((yearDone / yearPossible) * 100) : 0;

    return { monthlyDone, progress, missedDays, bestStreak, yearGoal };
  }, [habits, completions, userJoinDate]);

  const statItems = [
    { label: 'Total Habits', value: habits.length, icon: Target, color: 'text-secondary' },
    { label: 'Month Done', value: stats.monthlyDone, icon: CheckCircle2, color: 'text-primary' },
    { label: 'Missed Days', value: stats.missedDays, icon: XCircle, color: 'text-accent' },
    { label: 'Best Streak', value: `${stats.bestStreak} Days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Year Goal', value: `${stats.yearGoal}%`, icon: Trophy, color: 'text-yellow-500' },
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
            <span className="text-6xl font-black text-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">{stats.progress}%</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-1">Completion Rate</p>
          </div>
        </div>

        <div className="h-6 w-full bg-white/[0.05] rounded-[2rem] border border-white/5 p-1.5 shadow-inner overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">{item.label}</span>
              <span className="text-2xl font-black text-white tracking-tight">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyProgress;