import React from 'react';
import { motion } from 'framer-motion';
import { Habit, CompletionData } from '../types';

interface AnalysisPanelProps {
  habits: Habit[];
  completions: CompletionData;
  month: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ habits, completions, month }) => {
  return (
    <div className="card h-full flex flex-col bg-bg-card border-white/5 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Habit Analysis</h2>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{month}</span>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar space-y-6">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase font-black tracking-widest text-white/30 border-b border-white/5">
              <th className="text-left py-4">Habit</th>
              <th className="text-center py-4">Goal</th>
              <th className="text-right py-4">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {habits.map((habit) => {
              const actual = Object.values(completions).reduce((acc, curr) => {
                return acc + (curr[habit.id] ? 1 : 0);
              }, 0);
              
              const progress = Math.min(Math.round((actual / habit.goal) * 100), 100);

              return (
                <tr key={habit.id} className="group transition-colors">
                  <td className="py-6 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{habit.emoji}</span>
                      <span className="font-black text-sm text-white/80 group-hover:text-white transition-colors truncate max-w-[100px]">{habit.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-center text-xs font-black text-white/40 tracking-widest">{habit.goal}</td>
                  <td className="py-6 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-primary">{actual}</span>
                        <span className="text-[10px] font-black text-white/40 tracking-widest">{progress}%</span>
                      </div>
                      <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"
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
