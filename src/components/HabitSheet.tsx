import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, CompletionData, WeekData } from '../types';
import { Trash2, Lock, Edit3 } from 'lucide-react';

interface HabitSheetProps {
  habits: Habit[];
  completions: CompletionData;
  onToggle: (habitId: string, dateKey: string) => void;
  currentDate: Date;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitSheet: React.FC<HabitSheetProps> = ({ 
  habits, 
  completions, 
  onToggle, 
  currentDate,
  onEditHabit,
  onDeleteHabit
}) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const weeks = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const weeksArr: WeekData[] = [];
    let currentWeek: Date[] = [];
    
    for (let dayNum = 1; dayNum <= lastDay; dayNum++) {
      const d = new Date(year, month, dayNum);
      currentWeek.push(d);
      if (d.getDay() === 0 || dayNum === lastDay) {
        weeksArr.push({ weekNumber: weeksArr.length + 1, days: currentWeek });
        currentWeek = [];
      }
    }
    return weeksArr;
  }, [currentDate]);

  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="card !p-0 overflow-hidden border border-white/[0.05] shadow-[0_30px_60px_rgba(0,0,0,0.4)] bg-[#0B0E14]">
      <div className="overflow-x-auto habit-grid-container no-scrollbar">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="sticky-col p-8 text-2xl font-black text-left z-40 bg-[#0B0E14] border-b border-white/[0.05] text-white">
                 Habits
              </th>
              {weeks.map((week) => (
                <th key={week.weekNumber} colSpan={week.days.length} className="border-b border-r border-white/[0.05] py-4 text-[10px] uppercase font-black tracking-[0.3em] text-white/40 sticky top-0 bg-[#0B0E14] z-20">
                  Week {week.weekNumber}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sticky-col p-0 z-40 bg-[#0B0E14] border-b border-white/5"></th>
              {weeks.map((week) => (
                <React.Fragment key={`days-${week.weekNumber}`}>
                  {week.days.map((day) => (
                    <th key={day.toISOString()} className="border-b border-r border-white/[0.05] min-w-[76px] py-4 text-center sticky top-14 bg-[#0B0E14] z-20">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-sm font-black text-white/60">{day.getDate().toString().padStart(2, '0')}</span>
                      </div>
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="sticky-col p-6 border-b border-white/[0.05] z-30 bg-[#0B0E14] group-hover:bg-primary/[0.03] transition-all shadow-[8px_0_15px_-10px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{habit.emoji}</span>
                      <span className="text-base font-black text-white/90 group-hover:text-white transition-colors truncate">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => onEditHabit(habit)} className="p-2 text-white/30 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => onDeleteHabit(habit.id)} className="p-2 text-white/30 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </td>
                {weeks.map((week) => (
                  <React.Fragment key={`checks-${habit.id}-${week.weekNumber}`}>
                    {week.days.map((day) => {
                      const dateKey = getDateKey(day);
                      const isDone = completions[dateKey]?.[habit.id];
                      const dayTime = new Date(day); dayTime.setHours(0,0,0,0);
                      const isFuture = dayTime > today;

                        return (
                          <td 
                            key={`${habit.id}-${dateKey}`} 
                            className={`border-b border-r border-white/[0.05] p-0 relative transition-all ${
                              getDateKey(day) !== getDateKey(today) 
                                ? 'cursor-not-allowed bg-white/[0.01]' 
                                : 'hover:bg-primary/[0.05] cursor-pointer'
                            }`} 
                            onClick={() => getDateKey(day) === getDateKey(today) && onToggle(habit.id, dateKey)}
                          >
                            <div className={`flex items-center justify-center p-5 ${getDateKey(day) !== getDateKey(today) ? 'opacity-40' : ''}`}>
                               <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                                 isDone 
                                   ? 'bg-primary border-primary scale-110 shadow-[0_0_20px_rgba(139,92,246,0.5)] rotate-[360deg]' 
                                   : 'border-white/10 bg-white/5'
                               } ${getDateKey(day) !== getDateKey(today) ? 'border-dashed' : ''}`}>
                                <AnimatePresence mode="wait">
                                  {isDone && (
                                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                                    </motion.div>
                                  )}
                                  {isFuture && <Lock size={12} className="text-white/20" />}
                                </AnimatePresence>
                              </div>
                            </div>
                          </td>
                        );
                    })}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HabitSheet;
