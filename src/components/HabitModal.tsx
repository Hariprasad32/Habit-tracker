import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Smile } from 'lucide-react';
import { Habit } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, 'id'> & { id?: string }) => void;
  editingHabit: Habit | null;
}

const EMOJI_OPTIONS = ['✨', '🏋️', '🧘', '📝', '📚', '💻', '⌨️', '🏃', '🚰', '🍎', '💤', '🎯', '🔥', '🔋', '🌱', '🎨', '🎹', '🧼'];

const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, onSave, editingHabit }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [goal, setGoal] = useState(30);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setEmoji(editingHabit.emoji);
      setGoal(editingHabit.goal);
    } else {
      setName('');
      setEmoji('✨');
      setGoal(30);
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingHabit?.id,
      name,
      emoji,
      goal
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#161B22] rounded-[2rem] shadow-[0_0_50px_rgba(139,92,246,0.15)] border border-white/5 w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 text-primary rounded-2xl">
              <Sparkles size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-white leading-none mb-1">
                 {editingHabit ? 'Edit Habit' : 'New Habit'}
               </h2>
               <p className="text-[10px] uppercase font-black tracking-widest text-white/20">Design your routine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Name & Emoji row */}
          <div className="flex gap-6 items-end">
             <div className="relative group">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2 mb-2 block">Icon</label>
                <button 
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-20 h-20 bg-white/5 rounded-3xl border-2 border-transparent hover:border-primary/50 transition-all text-4xl flex items-center justify-center group-focus-within:border-primary"
                >
                  {emoji}
                </button>
                
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-4 p-4 bg-[#1C2128] border border-white/10 rounded-3xl shadow-2xl z-50 grid grid-cols-6 gap-2 w-72"
                    >
                      {EMOJI_OPTIONS.map((e) => (
                        <button 
                          key={e}
                          type="button"
                          onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-xl"
                        >
                          {e}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2 block">Habit Name</label>
                <input 
                  autoFocus
                  required
                  placeholder="e.g. Code for 2 hours"
                  className="w-full px-6 py-5 bg-white/5 rounded-[1.5rem] border-2 border-transparent focus:border-primary focus:bg-white/10 outline-none transition-all font-black text-white text-lg placeholder:text-white/10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">Monthly Goal</label>
              <span className="text-2xl font-black text-primary">{goal} <span className="text-xs text-white/20 uppercase tracking-widest">Days</span></span>
            </div>
            <input 
               type="range"
               min="1"
               max="31"
               step="1"
               className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
               value={goal}
               onChange={(e) => setGoal(parseInt(e.target.value))}
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full py-6 bg-primary text-white rounded-[1.5rem] font-black shadow-[0_15px_30px_rgba(139,92,246,0.3)] hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center justify-center gap-4"
            >
              <Save size={24} />
              <span className="text-xl tracking-tight">{editingHabit ? 'Update Habit' : 'Ignite Routine'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default HabitModal;
