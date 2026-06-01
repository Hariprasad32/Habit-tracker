import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

interface AuthPageProps {
  onLogin: (token: string, user: { id: string; name: string; email: string }) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const baseUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      onLogin(data.token, data.user);
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Auth Failed',
        text: err.message,
        background: '#161B22',
        color: '#fff',
        confirmButtonColor: '#8B5CF6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl flex bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative z-10 lg:min-h-[650px]"
      >
        {/* Left Side: Branding / Info */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-primary via-primary-dark to-[#5b21b6] p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xl border border-white/20">
                <CheckCircle2 size={28} strokeWidth={3} />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">HabitFlow</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl font-black leading-tight tracking-tight">Master your <span className="text-secondary">routine</span>, unlock your potential.</h1>
              <p className="text-white/60 text-base font-medium leading-relaxed">
                Professional habit tracking metrics combined with a high-fidelity spreadsheet experience. 
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
               <ShieldCheck size={20} className="text-secondary" />
               <p className="text-xs font-black uppercase tracking-widest leading-none">End-to-end encrypted</p>
            </div>
             <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
               <Sparkles size={20} className="text-accent" />
               <p className="text-xs font-black uppercase tracking-widest leading-none">Smart Analytics</p>
            </div>
          </div>

          <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] border-[50px] border-white/5 rounded-full blur-2xl" />
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 lg:p-14 bg-transparent flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-white/40 font-bold text-sm">
                {isLogin ? 'Sign in to your dashboard.' : 'Start your journey today.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-all" size={18} />
                      <input 
                        required
                        className="w-full pl-14 pr-6 py-4 bg-white/5 rounded-2xl border-2 border-transparent focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all font-bold text-white text-sm"
                        placeholder="Alex Johnson"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-all" size={18} />
                  <input 
                    type="email"
                    required
                    className="w-full pl-14 pr-6 py-4 bg-white/5 rounded-2xl border-2 border-transparent focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all font-bold text-white text-sm"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-all" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-14 pr-14 py-4 bg-white/5 rounded-2xl border-2 border-transparent focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all font-bold text-white text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-[0_15px_30px_rgba(139,92,246,0.3)] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="tracking-tight uppercase">{isLogin ? 'Sign In' : 'Join HabitFlow'}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-black text-white/30 hover:text-primary transition-all uppercase tracking-widest"
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
