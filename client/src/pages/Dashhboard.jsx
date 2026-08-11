import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Bot, Flame, Trophy, ArrowRight, Volume2, 
  MessageSquare, User, Zap, Crown, Home, Layers 
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate()

  // Staggered Entry Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-300 font-sans antialiased pb-28 lg:pb-16 relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* 🌌 High-Tech Amethyst & Cyber-Emerald Ambient Layers */}
      <div className="absolute top-0 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[280px] sm:w-[550px] h-[280px] sm:h-[550px] bg-cyan-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.12] pointer-events-none z-0" />

      {/* 🔮 TOP APPLICATION NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#070913]/80 backdrop-blur-xl border-b border-slate-900/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Signature */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-purple-500 via-cyan-400 to-emerald-400 rounded-xl shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-base font-black tracking-widest text-white uppercase">Lingo<span className="text-cyan-400">AI</span></span>
          </div>

          {/* Action Hub Panel */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Daily Streak Tracker */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-black shadow-inner">
              <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>5 Days</span>
            </div>

            {/* Metric Points */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/40 border border-purple-500/20 rounded-xl text-purple-400 text-xs font-black shadow-inner">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>450 XP</span>
            </div>

            {/* User Profile Button - Hidden on Small Screens, Visible on Medium/Large Screen Environments */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-cyan-400 to-emerald-400 p-[2px] shadow-lg shadow-purple-500/10 cursor-pointer hidden md:flex shrink-0"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 🛸 MAIN DASHBOARD ENGINE PLATFORM */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">
        
        {/* Banner: Adaptive Spacing Component (Flex Row Layout for seamless scaling) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-slate-900 via-[#0f1326] to-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Top Border Laser Accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400" />

          {/* Responsive Layout Shell: Spaces between elements fluidly on mobile and wide viewports */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 w-full">
            
            {/* Left Hand Text Blocks */}
            <div className="space-y-2 text-center sm:text-left flex-grow max-w-xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Learner!</span>
              </h1>
              <p className="text-xs font-bold tracking-wide text-cyan-400/90 uppercase flex items-center justify-center sm:justify-start gap-1.5 animate-pulse">
               Complete 1 daily chat session!
              </p>
            </div>

            {/* Right Hand Custom Compact Cyber Robot Node */}
            <div className="w-full sm:w-auto flex justify-center shrink-0">
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(168, 85, 247, 0.25)", borderColor: "rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-slate-950/80 border-2 border-purple-500/20 backdrop-blur-xl rounded-2xl px-5 py-3.5 flex items-center justify-center gap-3.5 shadow-xl ring-4 ring-purple-500/5 cursor-pointer group transition-all duration-300"
              >
                {/* Robot Display Matrix */}
                <div className="w-12 h-10 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-lg p-1 flex flex-col justify-around shadow-inner relative overflow-hidden shrink-0">
                  {/* Eyes Node Array */}
                  <div className="flex justify-around items-center w-full px-0.5">
                    <motion.div 
                      animate={{ scaleY: [1, 0.1, 1] }} 
                      transition={{ repeat: Infinity, repeatDelay: 2.8, duration: 0.2 }}
                      className="w-2.5 h-2.5 bg-emerald-400 rounded-sm shadow-[0_0_6px_#34d399]" 
                    />
                    <motion.div 
                      animate={{ scaleY: [1, 0.1, 1] }} 
                      transition={{ repeat: Infinity, repeatDelay: 2.8, duration: 0.2 }}
                      className="w-2.5 h-2.5 bg-emerald-400 rounded-sm shadow-[0_0_6px_#34d399]" 
                    />
                  </div>
                  {/* Dynamic Voice Track */}
                  <motion.div 
                    animate={{ scaleX: [1, 1.2, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-5 h-0.5 bg-cyan-400/90 rounded-full mx-auto shadow-[0_0_4px_#22d3ee]" 
                  />
                </div>

                {/* Subtext Command Interface */}
                <div className="text-left space-y-0.5">
                  <span className="block text-[9px] font-black uppercase text-slate-500 tracking-widest group-hover:text-purple-400 transition-colors">
                    Acoustic Core Online
                  </span>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white">
                    <span>Chat with AI</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* 🎮 GRID PLATFORM ACTION HOUSING */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 w-full"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-lg font-black text-white tracking-wide flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-purple-400 animate-pulse" /> Active Training Modes
          </motion.h2>

          {/* Clean symmetric structure that works perfectly without level tree */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            
            {/* Mode Node 1: Voice Calibration */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: 'rgba(168, 85, 247, 0.4)', boxShadow: '0 10px 30px -15px rgba(168, 85, 247, 0.15)' }}
              className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between cursor-pointer group transition-all duration-300 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-purple-400 transition-colors">AI Voice Chat</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">Speak directly like a natural phone call with instant feedback loops.</p>
                </div>
              </div>
              <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5 pt-2 group-hover:translate-x-1 transition-transform">
                Start Session <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Mode Node 2: Lexical Engine */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: 'rgba(34, 211, 238, 0.4)', boxShadow: '0 10px 30px -15px rgba(34, 211, 238, 0.15)' }}
              className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between cursor-pointer group transition-all duration-300 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors">Daily Vocabulary</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">Absorb 5 phrase constructs enriched with accurate contextual translations.</p>
                </div>
              </div>
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 pt-2 group-hover:translate-x-1 transition-transform">
                Open Vocabulary <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Mode Node 3: Upgraded Subscription Box */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, borderColor: 'rgba(251, 191, 36, 0.4)', boxShadow: '0 10px 30px -15px rgba(251, 191, 36, 0.15)' }}
              className="bg-gradient-to-br from-amber-950/20 via-slate-900/40 to-slate-900/60 border border-amber-500/20 p-6 rounded-2xl flex flex-col justify-between shadow-xl backdrop-blur-sm md:col-span-2 lg:col-span-1"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Go Premium</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">Unlock limitless voice dialogue channels, syntax fix history & certs.</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer">
                Upgrade Account
              </button>
            </motion.div>

          </motion.div>
        </motion.div>

      </main>

        {/* 📱 FIXED BOTTOM APP NAVIGATION BAR (Mobile Only Layer) */}
        <nav className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-900 py-3 px-6 z-50 flex items-center justify-around lg:hidden">
            
            <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-purple-400' : 'text-slate-500'}`}
            >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Home</span>
            </button>

            <button 
            onClick={() => navigate("/level")}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'levels' ? 'text-purple-400' : 'text-slate-500'}`}
            >
            <Layers className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Levels</span>
            </button>

            {/* Floating AI Core Trigger Node */}
            <button className="p-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full text-slate-950 shadow-lg shadow-purple-500/20 -mt-6 cursor-pointer transform hover:scale-105 transition-transform active:scale-95">
            <Bot className="w-6 h-6" />
            </button>

            <button 
            onClick={() => setActiveTab('premium')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'premium' ? 'text-purple-400' : 'text-slate-500'}`}
            >
            <Crown className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Premium</span>
            </button>

            <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-purple-400' : 'text-slate-500'}`}
            >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Profile</span>
            </button>

        </nav>

    </div>
  );
}


