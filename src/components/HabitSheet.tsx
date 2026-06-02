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
  userJoinDate?: string;
}

const HabitSheet: React.FC<HabitSheetProps> = ({ 
  habits, 
  completions, 
  onToggle, 
  currentDate,
  onEditHabit,
  onDeleteHabit,
  userJoinDate
}) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const weeks = useMemo(() => {
    // If no join date, start from today instead of the 1st of the month
    const start = userJoinDate ? new Date(userJoinDate) : new Date();
    start.setHours(0,0,0,0);
    
    // Number of weeks to end of the year
    const endOfYear = new Date(start.getFullYear(), 11, 31);
    const weeksArr: WeekData[] = [];
    
    let currentDay = new Date(start);
    let weekNum = 1;
    
    while (currentDay <= endOfYear) {
      const weekDays: Date[] = [];
      for (let i = 0; i < 7; i++) {
        if (currentDay > endOfYear) break;
        weekDays.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeksArr.push({ weekNumber: weekNum++, days: weekDays });
    }
    return weeksArr;
  }, [userJoinDate]);

  const getDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayKey = getDateKey(today);

  React.useEffect(() => {
    // Scroll to today on mount
    const todayEl = document.getElementById(`day-${todayKey}`);
    if (todayEl) {
      todayEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [weeks]);

  return (
    <div className="card !p-0 overflow-hidden border border-white/[0.05] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.6)] bg-[#0B0E14]">
      <div className="overflow-x-auto habit-grid-container no-scrollbar scroll-smooth selection:bg-transparent">

         <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="sticky-col p-3 sm:p-8 text-lg sm:text-2xl font-black text-left z-40 bg-[#0B0E14] border-b border-white/[0.05] text-white">
                 Habits
              </th>
              {weeks.map((week) => (
                <th key={week.weekNumber} colSpan={week.days.length} className="border-b border-r border-white/10 py-4 text-[8px] sm:text-[10px] uppercase font-black tracking-[0.3em] text-white/50 sticky top-0 bg-[#0B0E14] z-20">
                  Week {week.weekNumber}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sticky-col p-0 z-40 bg-[#0B0E14] border-b border-white/10 border-r-2 border-r-primary/10"></th>
              {weeks.map((week) => (
                <React.Fragment key={`days-${week.weekNumber}`}>
                  {week.days.map((day) => {
                    const isToday = getDateKey(day) === todayKey;
                    return (
                      <th key={day.toISOString()} className={`border-b border-r border-white/[0.05] min-w-[50px] sm:min-w-[76px] py-3 sm:py-4 text-center sticky top-14 bg-[#0B0E14] z-20 ${isToday ? 'bg-primary/[0.03]' : ''}`}>
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-primary' : 'text-white/40'}`}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className={`text-[10px] sm:text-sm font-black ${isToday ? 'text-primary ring-1 ring-primary/20 bg-primary/10 px-1 rounded' : 'text-white/60'}`}>{day.getDate().toString().padStart(2, '0')}</span>
                        </div>
                      </th>
                    );
                  })}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="sticky-col p-3 sm:p-6 border-b border-white/[0.08] z-30 bg-[#0B0E14] group-hover:bg-primary/[0.02] transition-all shadow-[10px_0_20px_-5px_rgba(0,0,0,0.7)] border-r-2 border-r-primary/5 max-w-[100px] sm:max-w-none">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                      <span className="text-lg sm:text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] flex-shrink-0">{habit.emoji}</span>
                      <span className="text-[10px] sm:text-base font-black text-white group-hover:text-primary transition-colors truncate tracking-tight">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => onEditHabit(habit)} className="p-1 sm:p-2 text-white/40 hover:text-primary hover:bg-secondary/10 rounded-lg transition-all"><Edit3 size={11} className="sm:w-4 sm:h-4" /></button>
                      <button onClick={() => onDeleteHabit(habit.id)} className="p-1 sm:p-2 text-white/40 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"><Trash2 size={11} className="sm:w-4 sm:h-4" /></button>
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
                      const isToday = dateKey === todayKey;
                      const isPast = dayTime < today;

                        return (
                          <td 
                            key={`${habit.id}-${dateKey}`} 
                            id={`day-${dateKey}`}
                            className={`border-b border-r border-white/[0.05] p-0 relative transition-all duration-300 select-none touch-manipulation ${
                              !isToday 
                                ? 'bg-white/[0.01]' 
                                : 'bg-primary/[0.02]'
                            }`} 
                            onClick={() => isToday && onToggle(habit.id, dateKey)}
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                          >
                            <div className={`flex items-center justify-center p-2.5 sm:p-5 relative ${!isToday ? 'opacity-40 grayscale-[0.5]' : 'z-10'}`}>
                               <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl border-2 flex items-center justify-center transition-all duration-500 relative group/cell ${
                                 isDone 
                                   ? 'bg-gradient-to-br from-primary to-[#7c3aed] border-primary scale-110 shadow-[0_0_20px_rgba(139,92,246,0.4)] rotate-[360deg]' 
                                   : isPast 
                                     ? 'border-accent/30 bg-accent/5' 
                                     : 'border-white/10 bg-transparent group-hover:border-primary/40'
                               } ${!isToday ? 'border-dashed cursor-not-allowed' : 'cursor-pointer'}`}>
                                
                                <AnimatePresence mode="wait">
                                  {isDone && (
                                    <motion.div key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                                      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-6 sm:h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                                    </motion.div>
                                  )}
                                  {isFuture && (
                                      <Lock size={10} className="text-white/20" />
                                  )}
                                  {isPast && !isDone && (
                                     <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            {isToday && (
                               <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/30" />
                            )}
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