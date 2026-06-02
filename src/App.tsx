import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import HabitSheet from './components/HabitSheet';
import AnalysisPanel from './components/AnalysisPanel';
import MonthlyProgress from './components/MonthlyProgress';
import WeeklyStats from './components/WeeklyStats';
import HabitModal from './components/HabitModal';
import AuthPage from './components/AuthPage';
import CheckInPopup from './components/CheckInPopup';
import { Habit, CompletionData } from './types';
import { Flame, CheckCircle2, Trophy, BarChart2 } from 'lucide-react';
import Swal from 'sweetalert2';
import './index.css';

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
    if (savedUser?.createdAt) return new Date(savedUser.createdAt);
    const d = new Date();
    return d;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [user, setUser] = useState<{ id: string; name: string; email: string; createdAt?: string } | null>(
    JSON.parse(localStorage.getItem('auth_user') || 'null')
  );

  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<CompletionData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const performLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('checked_in');
    setHabits([]);
    setCompletions({});
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to exit your dashboard?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B5CF6',
      cancelButtonColor: '#161B22',
      confirmButtonText: 'Yes, sign out',
      background: '#0B0E14',
      color: '#fff'
    });

    if (result.isConfirmed) {
      performLogout();
    }
  };

  const fetchHabits = async (overrideToken?: string) => {
    const activeToken = overrideToken || token;
    if (!activeToken) return;
    try {
      const response = await fetch(`${API_BASE}/habits`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });

      if (response.status === 401) {
        performLogout();
        return;
      }

      const data = await response.json();
      if (response.ok) {
        const habitsWithCompletions = data.map((h: any) => ({
          ...h,
          id: h._id
        }));

        const newCompletions: CompletionData = {};
        data.forEach((h: any) => {
          Object.entries(h.completions || {}).forEach(([date, val]) => {
            if (!newCompletions[date]) newCompletions[date] = {};
            newCompletions[date][h._id] = val as boolean;
          });
        });

        setHabits(habitsWithCompletions);
        setCompletions(newCompletions);

        if (!sessionStorage.getItem('checked_in')) {
          setShowCheckIn(true);
          sessionStorage.setItem('checked_in', 'true');
        }
      }
    } catch (err) {
      console.error('Fetch habits failed:', err);
    }
  };

  useEffect(() => {
    if (token) fetchHabits();
  }, [token]);

  const stats = useMemo(() => {
    if (habits.length === 0 || !user) return { streak: 0, actualDone: 0, rate: 0, missed: 0 };

    // FIX: safely fall back to start of current month if createdAt is missing
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const joinDate = user.createdAt
      ? new Date(user.createdAt)
      : new Date(today.getFullYear(), today.getMonth(), 1);
    joinDate.setHours(0, 0, 0, 0);

    // FIX: count total completions across all time for the "Total Done" stat
    const actualDone = Object.values(completions).reduce((t, day) =>
      t + Object.values(day).filter(Boolean).length, 0
    );

    // Days from join up to and including yesterday (today is still in progress)
    const diffTime = Math.max(0, today.getTime() - joinDate.getTime());
    // +1 because we include the join day itself, but we cap at yesterday for rate purposes
    const totalDaysSinceJoining = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // totalDaysSinceJoining = number of fully elapsed days (yesterday and before)
    // We use this for rate so today's incomplete day doesn't deflate the percentage.
    // If user joined today, this is 0 — rate will be 0 (no elapsed days yet).
    const totalElapsedDays = totalDaysSinceJoining; // excludes today

    // FIX: streak — only count today in the streak if at least one habit is marked done today
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayHasActivity = completions[todayKey] && Object.values(completions[todayKey]).some(Boolean);

    let currentStreak = 0;
    let missedCount = 0;
    let streakBroken = false;

    // Total days to iterate: elapsed days + today
    const totalDaysToCheck = totalDaysSinceJoining + 1; // +1 to include today

    for (let i = 0; i < totalDaysToCheck; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayCompletions = completions[key];
      const hasActivity = dayCompletions && Object.values(dayCompletions).some(Boolean);
      const isToday = i === 0;

      if (hasActivity) {
        if (!streakBroken) currentStreak++;
      } else {
        // FIX: today without activity doesn't break the streak — it's still in progress
        // Only past days (i > 0) break the streak and count as missed
        if (!isToday) {
          if (!streakBroken) streakBroken = true;
          // Only count as missed if it was a fully elapsed past day
          missedCount++;
        }
        // If today has no activity yet, streak is not broken (user may still do it)
      }
    }

    // FIX: rate uses only fully elapsed past days so today's incompleteness doesn't hurt the score
    const totalPossibleElapsed = habits.length * totalElapsedDays;
    // Count completions only for elapsed days (exclude today from rate numerator too for consistency)
    const completedElapsed = Object.entries(completions).reduce((t, [dateKey, day]) => {
      const date = new Date(dateKey);
      date.setHours(0, 0, 0, 0);
      if (date.getTime() < today.getTime()) {
        return t + Object.values(day).filter(Boolean).length;
      }
      return t;
    }, 0);
    const rate = totalPossibleElapsed > 0 ? Math.round((completedElapsed / totalPossibleElapsed) * 100) : 0;

    return { streak: currentStreak, actualDone, rate, missed: missedCount };
  }, [habits, completions, user]);

  const handleLogin = (newToken: string, newUser: { id: string; name: string; email: string; createdAt: string }) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    fetchHabits(newToken);
  };

  const handleToggle = async (habitId: string, dateKey: string) => {
    if (!token) return;
    const currentVal = completions[dateKey]?.[habitId] || false;
    setCompletions(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [habitId]: !currentVal }
    }));

    try {
      const response = await fetch(`${API_BASE}/habits/${habitId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dateKey })
      });
      if (!response.ok) throw new Error();
    } catch (err) {
      setCompletions(prev => ({
        ...prev,
        [dateKey]: { ...prev[dateKey], [habitId]: currentVal }
      }));
    }
  };

  const handleSaveHabit = async (data: Omit<Habit, 'id'> & { id?: string }) => {
    if (!token) return;
    const isUpdate = !!data.id;
    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate ? `${API_BASE}/habits/${data.id}` : `${API_BASE}/habits`;

    const { id, ...cleanData } = data;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanData)
      });
      if (response.ok) fetchHabits();
    } catch (err) {
      console.error('Save habit failed:', err);
    }
  };

  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

  if (!token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans overflow-x-hidden selection:bg-primary/30">
      <main className="max-w-[1920px] mx-auto flex flex-col min-w-0 h-screen">
        <Header
          month={currentMonthName}
          year={currentDate.getFullYear()}
          onAddHabit={() => { setEditingHabit(null); setIsModalOpen(true); }}
          onPrevMonth={() => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() - 1);
            setCurrentDate(d);
            const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            const key = `${firstOfMonth.getFullYear()}-${String(firstOfMonth.getMonth() + 1).padStart(2, '0')}-01`;
            const el = document.getElementById(`day-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
          }}
          onNextMonth={() => {
            const d = new Date(currentDate);
            d.setMonth(d.getMonth() + 1);
            setCurrentDate(d);
            const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            const key = `${firstOfMonth.getFullYear()}-${String(firstOfMonth.getMonth() + 1).padStart(2, '0')}-01`;
            const el = document.getElementById(`day-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'start' });
          }}
          onLogout={handleLogout}
          userName={user?.name}
        />

        <div className="flex-1 overflow-y-auto px-2 sm:px-8 pb-4 sm:pb-8 space-y-3 sm:space-y-8 no-scrollbar">
          {/* Dashboard Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 py-2 sm:py-4 mt-2 sm:mt-4">
            <div className="card !p-4 sm:!p-6 flex items-center gap-6 group">
              <div className="p-4 bg-primary/10 text-primary rounded-3xl group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                <Flame size={28} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Current Streak</p>
                <p className="text-2xl font-black text-white">{stats.streak} <span className="text-xs text-white/50 uppercase tracking-widest font-bold ml-1">Days</span></p>
              </div>
            </div>
            <div className="card !p-4 sm:!p-6 flex items-center gap-6 group">
              <div className="p-4 bg-secondary/10 text-secondary rounded-3xl group-hover:bg-secondary group-hover:text-white transition-all">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Completion Rate</p>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-black text-white">{stats.rate}%</p>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${stats.rate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card !p-4 sm:!p-6 flex items-center gap-6 group">
              <div className="p-4 bg-accent/10 text-accent rounded-3xl group-hover:bg-accent group-hover:text-white transition-all">
                <BarChart2 size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Total Habits Done</p>
                <p className="text-2xl font-black text-white">{stats.actualDone}</p>
              </div>
            </div>
            <div className="card !p-4 sm:!p-6 flex items-center gap-6 group">
              <div className="p-4 bg-primary/10 text-primary rounded-3xl group-hover:bg-primary group-hover:text-white transition-all">
                <Trophy size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Active Habits</p>
                <p className="text-2xl font-black text-white">{habits.length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 items-start">
            <div className="w-full min-w-0">
              <HabitSheet
                habits={habits}
                completions={completions}
                onToggle={handleToggle}
                currentDate={currentDate}
                onEditHabit={(h) => { setEditingHabit(h); setIsModalOpen(true); }}
                userJoinDate={user?.createdAt}
                onDeleteHabit={async (id) => {
                  const result = await Swal.fire({
                    title: 'Delete Habit?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#EC4899',
                    cancelButtonColor: '#161B22',
                    confirmButtonText: 'Yes, delete it!',
                    background: '#0B0E14',
                    color: '#fff'
                  });
                  if (result.isConfirmed) {
                    fetch(`${API_BASE}/habits/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }).then(fetchHabits);
                  }
                }}
              />
            </div>

            <div className="w-full">
              <AnalysisPanel
                habits={habits}
                completions={completions}
                month={currentMonthName}
                currentDate={currentDate}
              />
            </div>
          </div>

          <MonthlyProgress
            habits={habits}
            completions={completions}
            month={currentMonthName}
            userJoinDate={user?.createdAt}
          />
          <WeeklyStats
            habits={habits}
            completions={completions}
            currentDate={currentDate}
            userJoinDate={user?.createdAt}
          />
        </div>

        <HabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHabit}
          editingHabit={editingHabit}
        />

        <AnimatePresence>
          {showCheckIn && (
            <CheckInPopup
              streak={stats.streak}
              onClose={() => setShowCheckIn(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;