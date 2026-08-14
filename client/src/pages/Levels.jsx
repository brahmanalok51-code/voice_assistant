import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, CheckCircle2, Play, Sparkles, ArrowLeft, 
  Award, Trophy, Star, Flame, Zap, Home, Layers, Crown, User, Bot, Compass, ChevronRight
} from 'lucide-react';

// Generate 40 levels instead of 50
const generate40Levels = () => {
  return Array.from({ length: 40 }, (_, i) => {
    const levelNum = i + 1;
    return {
      level: levelNum,
      title: `Stage ${levelNum}`,
      wordsCount: 10,
      stars: Math.min(3, Math.floor(Math.random() * 2) + 2)
    };
  });
};

const LEVELS_DATA = generate40Levels();

export default function VocabularyLevels() {
  const navigate = useNavigate();
  const [completedLevelCount, setCompletedLevelCount] = useState(0);
  const [selectedLockedLevel, setSelectedLockedLevel] = useState(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('user_completed_level');
    if (savedProgress) {
      setCompletedLevelCount(parseInt(savedProgress, 10));
    }
  }, []);

  const handleLevelSelect = (levelNum) => {
    const isUnlocked = levelNum <= completedLevelCount + 1;

    if (!isUnlocked) {
      setSelectedLockedLevel(levelNum);
      setTimeout(() => setSelectedLockedLevel(null), 2500);
      return;
    }

    // Navigates directly to the practice room for the chosen level
    navigate(`/room/${levelNum}`);
  };

  const progressPercentage = Math.min(100, Math.round((completedLevelCount / 40) * 100));

  return (
    <div className="min-h-screen bg-[#060b17] text-slate-200 font-sans antialiased pb-32 lg:pb-16 relative overflow-x-hidden selection:bg-[#dcb472]/30 selection:text-[#e2cb9f]">

      {/* 🌌 Atmospheric Glow Orbs & Grid Layer */}
      <div className="fixed -top-24 right-1/4 w-[600px] h-[600px] bg-[#dcb472]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-30 pointer-events-none z-0" />

      {/* 🔮 TOP APPLICATION NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#060b17]/85 backdrop-blur-2xl border-b border-[#16274a]/60 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#0e1f40]/80 border border-[#1c3465] hover:bg-[#13264c] text-slate-300 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#dcb472]" /> Home
          </motion.button>

          <div className="flex items-center gap-3">
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 pt-5 relative z-10 space-y-5">

        {/* Banner Hero Section */}
        <section className="relative bg-gradient-to-r from-[#0b1833] via-[#0f2249] to-[#0b1833] border border-[#1c3465] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#dcb472]/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Vocabulary Quest
              </h1>
            </div>

            {/* Quick Stats Grid & Progress Bar */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 px-4 py-3 bg-[#061024]/80 border border-[#1c3465] rounded-2xl">
                <div className="p-2 bg-[#dcb472]/10 border border-[#dcb472]/20 rounded-xl text-[#dcb472]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider">Unlocked Stage</span>
                  <span className="text-sm font-black text-white">{completedLevelCount + 1} / 40</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Locked Warning Portal Banner */}
        <AnimatePresence>
          {selectedLockedLevel && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className="fixed top-20 left-1/2 z-50 bg-rose-950/95 text-rose-200 px-5 py-2.5 rounded-2xl shadow-2xl border border-rose-500/40 font-bold text-xs flex items-center gap-2.5 backdrop-blur-xl"
            >
              <div className="p-1 bg-rose-500/20 rounded-lg text-rose-400">
                <Lock className="w-4 h-4" />
              </div>
              <span>Complete Stage {selectedLockedLevel - 1} to unlock Stage {selectedLockedLevel}!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📱 Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-24">
          {LEVELS_DATA.map((item) => {
            const isCompleted = item.level <= completedLevelCount;
            const isCurrentActive = item.level === completedLevelCount + 1;
            const isLocked = item.level > completedLevelCount + 1;

            return (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (item.level % 10) * 0.03 }}
                whileHover={!isLocked ? { y: -4, scale: 1.01 } : {}}
                whileTap={!isLocked ? { scale: 0.98 } : {}}
                onClick={() => handleLevelSelect(item.level)}
                className={`group relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between h-auto cursor-pointer overflow-hidden ${
                  isCompleted
                    ? 'bg-gradient-to-r sm:bg-gradient-to-b from-[#0b1833] via-[#091329] to-[#071126] border-emerald-500/30 shadow-lg shadow-emerald-950/10'
                    : isCurrentActive
                    ? 'bg-gradient-to-r sm:bg-gradient-to-b from-[#132854] via-[#0f2249] to-[#0b1833] border-2 border-[#dcb472] shadow-2xl shadow-[#dcb472]/15 ring-4 ring-[#dcb472]/10'
                    : 'bg-[#081124]/40 border-[#142342] opacity-40 hover:opacity-60'
                }`}
              >
                {/* Glowing Aura for Active Card */}
                {isCurrentActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#dcb472]/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
                )}

                {/* Top Row Header & Status */}
                <div className="flex items-center justify-between relative z-10 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : isCurrentActive 
                        ? 'bg-[#dcb472]/20 text-[#dcb472] border-[#dcb472]/40 font-black' 
                        : 'bg-slate-800/40 text-slate-500 border-transparent'
                    }`}>
                      Stage {item.level < 10 ? `0${item.level}` : item.level}
                    </span>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(3)].map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-3 h-3 ${
                            isCompleted && idx < item.stars 
                              ? 'text-[#dcb472] fill-[#dcb472]' 
                              : 'text-slate-800 fill-slate-800'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="shrink-0">
                    {isCompleted && (
                      <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    )}
                    {isCurrentActive && (
                      <div className="p-1.5 bg-[#dcb472] text-[#061024] rounded-xl shadow-md shadow-[#dcb472]/30">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="p-1.5 bg-slate-800/60 text-slate-600 rounded-xl border border-slate-700/40">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Title & Word Count Base Info */}
                <div className="relative z-10 flex items-center justify-between pt-1">
                  <div>
                    <h3 className={`text-base font-black tracking-tight ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {item.wordsCount} Lexicons
                    </p>
                  </div>

                  {!isLocked && (
                    <div className="flex items-center gap-1 text-xs font-extrabold text-[#dcb472] group-hover:translate-x-1 transition-transform">
                      <span>Start</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 📱 FIXED BOTTOM APP NAVIGATION BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#061024]/95 backdrop-blur-2xl border-t border-[#16274a] py-3.5 px-6 z-50 flex items-center justify-around lg:hidden">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-[#dcb472] cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Home</span>
        </button>

        <button 
          onClick={() => navigate('/level')}
          className="flex flex-col items-center gap-1 text-[#dcb472] transition-colors cursor-pointer"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Levels</span>
        </button>

        {/* Floating AI Core Trigger Node */}
        <button className="p-3 bg-gradient-to-r from-[#dcb472] to-[#b68c48] rounded-full text-[#071126] shadow-lg shadow-[#b68c48]/30 -mt-7 cursor-pointer flex flex-col items-center justify-center font-black transition-transform active:scale-95"
        onClick={()=> navigate("/assistant")}>
          <Bot className="w-5 h-5" />
          <span className="text-[7px] uppercase tracking-tighter mt-0.5">AI Core</span>
        </button>

        <button 
          onClick={() => navigate('/premium')}
          className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-[#dcb472] cursor-pointer"
        >
          <Crown className="w-5 h-5" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Premium</span>
        </button>

        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-[#dcb472] cursor-pointer"
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Profile</span>
        </button>
      </nav>

    </div>
  );
}