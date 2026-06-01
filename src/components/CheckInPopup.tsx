import React from 'react';
import { motion } from 'framer-motion';
import { X, Flame, Sparkles, Quote, Trophy } from 'lucide-react';

interface CheckInPopupProps {
  streak: number;
  onClose: () => void;
}

const QUOTES = [
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "The secret of your future is hidden in your daily routine.",
  "Your habits will determine your future. Choose wisely.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Small daily improvements over time lead to stunning results.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Discipline is choosing between what you want now and what you want most."
];

const CheckInPopup: React.FC<CheckInPopupProps> = ({ streak, onClose }) => {
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="relative bg-[#161B22] rounded-[3rem] shadow-[0_0_80px_rgba(139,92,246,0.25)] border border-white/10 w-full max-w-lg overflow-hidden p-10 text-center"
      >
         <button onClick={onClose} className="absolute top-6 right-6 p-2.5 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
            <X size={20} />
         </button>

         <div className="flex flex-col items-center">
            <motion.div 
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1.2 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative mb-12"
            >
               <div className="absolute inset-0 bg-primary/30 blur-[40px] rounded-full" />
               <div className="relative p-8 bg-primary rounded-[2.5rem] shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                  <Flame size={64} fill="white" className="text-white" />
               </div>
               <div className="absolute -bottom-4 -right-4 bg-white text-primary p-3 rounded-2xl shadow-xl font-black text-xl">
                  {streak}
               </div>
            </motion.div>

            <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase italic flex items-center gap-3">
              Daily Check-In <Sparkles size={32} className="text-secondary" />
            </h2>
            
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-10">You're on fire! Keep it moving.</p>

            <div className="relative mb-12 p-8 bg-white/5 rounded-3xl border border-white/5">
                <Quote size={40} className="absolute -top-5 -left-5 text-primary opacity-50" />
                <p className="text-xl font-medium text-white italic leading-relaxed">"{randomQuote}"</p>
                <Quote size={40} className="absolute -bottom-5 -right-5 text-primary opacity-50 rotate-180" />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
               <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Current Streak</span>
                  <span className="text-2xl font-black text-white">{streak} Days</span>
               </div>
               <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Total Progress</span>
                  <span className="text-2xl font-black text-white">{streak > 0 ? 'Ignited' : 'Starting'}</span>
               </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-12 w-full py-6 bg-primary text-white rounded-[1.5rem] font-black text-xl shadow-[0_15px_30px_rgba(139,92,246,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-4"
            >
              <span>Let's Go</span>
              <Trophy size={24} />
            </button>
         </div>
      </motion.div>
    </div>
  );
};

export default CheckInPopup;
