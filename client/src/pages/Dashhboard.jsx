import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Bot, ArrowRight, Volume2, 
  User, Zap, Crown, Home, Layers, Play, MessageSquare 
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  // Staggered Entry Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
  };

  return (
    // Base Background upgraded to a rich gradient
    <div className="min-h-screen bg-[#f1f5f9] bg-[radial-gradient(100%_50%_at_50%_0%,rgba(226,232,240,0.5)_0%,rgba(241,245,249,1)_100%)] text-slate-600 font-sans antialiased pb-32 lg:pb-16 relative overflow-hidden selection:bg-purple-500/20 selection:text-purple-900">
      
      {/* 🌌 Enhanced Vibrant Light-Mode Ambient Glow Layers - Increased size and spread for Osmosm effect */}
      <div className="absolute top-0 right-1/4 w-[500px] sm:w-[900px] h-[500px] sm:h-[900px] bg-purple-300/40 rounded-full blur-[120px] sm:blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-emerald-200/40 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-0 w-[450px] sm:w-[850px] h-[450px] sm:h-[850px] bg-cyan-200/40 rounded-full blur-[120px] sm:blur-[170px] pointer-events-none z-0" />
      
      {/* Grid Pattern with lower opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.3] pointer-events-none z-0" />

      {/* 🔮 TOP APPLICATION NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-8 py-4 shadow-sm">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          
          {/* Logo Signature */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-500 rounded-xl shadow-md shadow-purple-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="text-base font-black tracking-widest text-slate-900 uppercase">Lingo<span className="text-purple-600">AI</span></span>
          </div>

          {/* Action Hub Panel */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* User Profile Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-400 to-cyan-400 p-[2px] shadow-md shadow-purple-500/10 cursor-pointer flex shrink-0"
            >
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <User className="w-5 h-5 text-purple-600 relative z-10" />
                {/* Subtle radial sheen on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* 🛸 MAIN DASHBOARD ENGINE PLATFORM */}
      <main className="max-w-[1700px] mx-auto px-2 sm:px-6 lg:px-8 pt-3 relative z-10 space-y-3">
        
        {/* Banner Component */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/30 overflow-hidden"
        >
          {/* Top Border Laser Accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

          {/* Responsive Layout Shell */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
            
            {/* Left Hand Text Blocks */}
            <div className="space-y-2 text-center sm:text-left flex-grow max-w-2xl">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent relative">Learner!<span className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full"></span></span>
              </h1>
              <p className="text-sm font-semibold tracking-wide text-purple-600/90 pt-1 lg:pt-3 uppercase flex items-center justify-center sm:justify-start gap-1.5">
                 Ready to make progress today?
              </p>
            </div>

            {/* Right Hand: Attractive Chat with AI Node */}
            <div className="w-full sm:w-auto flex justify-center shrink-0">
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 15px 35px rgba(124, 58, 237, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                onClick={()=> navigate("/dashboard")}
                className="relative w-full sm:w-auto rounded-3xl p-px bg-gradient-to-br from-purple-500 via-pink-500 via-indigo-400 via-cyan-400 to-purple-500 bg-[size:400%_auto] animate-gradient-slow shadow-lg cursor-pointer min-w-[280px] overflow-hidden"
              >
                {/* Visual Background Image Overlay */}
                <div 
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none mix-blend-overlay"
                />

                <div className="relative bg-slate-950/50 backdrop-blur-lg px-6 py-5 flex items-center gap-4 rounded-[23px]">
                  {/* Robot Display Matrix */}
                  <div className="w-14 h-12 bg-slate-950 border border-white/10 rounded-xl p-1 flex flex-col justify-around shadow-inner relative overflow-hidden shrink-0 z-10">
                    <div className="flex justify-around items-center w-full px-0.5">
                      <motion.div 
                        animate={{ scaleY: [1, 0.2, 1] }} 
                        transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 0.15 }}
                        className="w-3 h-3 bg-cyan-400 rounded-sm shadow-[0_0_8px_#22d3ee]" 
                      />
                      <motion.div 
                        animate={{ scaleY: [1, 0.2, 1] }} 
                        transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 0.15 }}
                        className="w-3 h-3 bg-cyan-400 rounded-sm shadow-[0_0_8px_#22d3ee]" 
                      />
                    </div>
                    <motion.div 
                      animate={{ scaleX: [1, 1.4, 0.8, 1] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                      className="w-7 h-0.5 bg-purple-400 rounded-full mx-auto" 
                    />
                  </div>

                  {/* Subtext Command Interface */}
                  <div className="text-left space-y-1 relative z-10 flex-grow">
                    <span className="block text-[10px] font-black uppercase text-cyan-200 tracking-widest animate-pulse">
                      AI Buddy Ready
                    </span>
                    <div className="flex items-center justify-between text-base font-black text-white">
                      <span>Chat with AI</span>
                      <ArrowRight className="w-5 h-5 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                    </div>
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
          className="space-y-4 w-full"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-xl font-black text-slate-950 tracking-tight flex items-center gap-2.5"
          >
            <Zap className="w-5 h-5 text-purple-600 animate-pulse" /> Active Modules
          </motion.h2>

          {/* Main Grid Matrix - Reduced Gap, supporting 3 columns on large screens */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mx-auto"
          >
            {/* Mode Node 2: Daily Vocabulary */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative group rounded-3xl p-px bg-gradient-to-b from-cyan-400 via-teal-300 to-transparent hover:from-cyan-500 hover:to-teal-500 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-cyan-500/15 overflow-hidden"
            >
              <div className="relative bg-gradient-to-b from-white via-cyan-50/10 to-white p-6 rounded-[23px] flex flex-col justify-between h-full min-h-[180px] overflow-hidden">
                
                {/* Background Image Overlay */}
                <div 
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-[0.06] group-hover:opacity-[0.1] group-hover:scale-110 pointer-events-none transition-all duration-700 mix-blend-multiply"
                />

                {/* Ambient Gradient Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl group-hover:bg-cyan-500/30 transition-all duration-500" />

                {/* Content Block: Symbol and Text Headers in One Row */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-teal-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="inline-block text-[9px] font-black uppercase tracking-widest text-cyan-700 bg-cyan-100/80 px-2.5 py-0.5 rounded-full border border-cyan-200">
                        Lexical
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                        Daily Vocabulary
                      </h3>
                    </div>
                  </div>
                  
                 
                </div>

                {/* Highly Animated Vibrant Gradient "Start Practice" Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-5 z-10 w-full group/btn cursor-pointer"
                  onClick={()=> navigate("/level")}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 rounded-xl blur opacity-40 group-hover/btn:opacity-100 transition duration-500 animate-pulse" />
                  
                  <div className="relative w-full py-5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 bg-[size:200%_auto] hover:bg-right transition-all duration-500 flex items-center justify-center gap-3 text-white font-black text-xs tracking-wider shadow-md">
                    <span>START PRACTICE</span>
                    <Play className="w-3.5 h-3.5 fill-current group-hover/btn:translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>

              </div>
            </motion.div>

                     {/* 🆕 Mode Node 1: Smart Dialogue (Enhanced Image & Full-Width CTA) */}
<motion.div 
  variants={itemVariants}
  whileHover={{ y: -4, scale: 1.01 }}
  className="relative group rounded-3xl p-px bg-gradient-to-b from-purple-400 via-indigo-300 to-transparent hover:from-purple-500 hover:to-indigo-500 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-purple-500/15 overflow-hidden col-span-1 md:col-span-2 lg:col-span-1"
>
  <div className="relative bg-gradient-to-b from-white via-purple-50/20 to-white p-6 rounded-[23px] flex flex-col justify-between h-full min-h-[220px] overflow-hidden">
    
    {/* Higher Opacity Background Image (Clear Girl with Phone Visual) */}
    <motion.div 
      whileHover={{ scale: 1.06 }}
      transition={{ type: "tween", duration: 0.6 }}
      className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-[0.28] group-hover:opacity-[0.40] pointer-events-none transition-all duration-700 mix-blend-multiply"
    />

    {/* Ambient Gradient Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all duration-500" />

    {/* Header & Content */}
    <div className="relative z-10 space-y-3">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <span className="inline-block text-[9px] font-black uppercase tracking-widest text-purple-700 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-200">
            Voice Practice
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors tracking-tight">
            Smart Dialogue
          </h3>
        </div>
      </div>
      
      {/* Description Text */}
      <p className="text-sm font-medium text-slate-700 leading-relaxed pl-1 pt-1 drop-shadow-sm">
        Practice natural, real-time conversations to build your speaking confidence.
      </p>
    </div>

    {/* Standardized Full-Width Animated "Start Practice" Button */}
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative mt-5 z-10 w-full group/btn cursor-pointer"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-xl blur opacity-40 group-hover/btn:opacity-100 transition duration-500 animate-pulse" />
      
      <div className="relative w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[size:200%_auto] hover:bg-right transition-all duration-500 flex items-center justify-center gap-3 text-white font-black text-xs tracking-wider shadow-md">
        <span>START PRACTICE</span>
        <Play className="w-3.5 h-3.5 fill-current group-hover/btn:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>

  </div>
</motion.div>

            {/* Mode Node 3: Upgraded Premium Subscription Box */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              className="relative group rounded-3xl p-px bg-gradient-to-b from-amber-400 via-orange-300 to-transparent hover:from-amber-500 hover:to-orange-500 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/15 overflow-hidden"
            >
              <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 rounded-[23px] flex flex-col justify-between h-full min-h-[220px] overflow-hidden">
                
                {/* Background Image Overlay */}
                <div 
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center opacity-[0.1] group-hover:opacity-[0.16] group-hover:scale-110 pointer-events-none transition-all duration-700 mix-blend-overlay"
                />

                {/* Ambient Gradient Glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all duration-500" />

                {/* Content Block: Symbol and Text Headers in One Row */}
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 rounded-xl flex items-center justify-center shrink-0 shadow-lg Shadow-amber-500/20 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                      <Crown className="w-5 h-5 fill-current" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="inline-block text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                        VIP Pass
                      </span>
                      <h3 className="text-lg font-extrabold text-white transition-colors tracking-tight">
                        Go Premium
                      </h3>
                    </div>
                  </div>
                  
                  {/* Simplified Lower Description Text */}
                  <p className="text-sm text-slate-200 leading-relaxed pl-1 pt-1">
                    Get unlimited chat sessions, full dialogue history, and special achievement badges.
                  </p>
                </div>

                {/* Animated Premium CTA Upgrade Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative mt-5 z-10 w-full group/btn cursor-pointer"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-xl blur opacity-40 group-hover/btn:opacity-100 transition duration-500 animate-pulse" />
                  
                  <div className="relative w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-[size:200%_auto] hover:bg-right transition-all duration-500 flex items-center justify-center gap-2.5 text-slate-950 font-black text-xs tracking-widest shadow-md">
                    <span>UPGRADE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

              </div>
            </motion.div>

          </motion.div>
        </motion.div>

      </main>

      {/* 📱 FIXED BOTTOM APP NAVIGATION BAR (Upgraded Light Gradient Glassmorphism) */}
      <nav className="fixed bottom-0 inset-x-4 max-w-lg mx-auto bg-white/20 backdrop-blur-2xl border border-white/20 rounded-2xl py-2.5 px-6 z-50 flex items-center justify-around shadow-[0_15px_40px_-5px_rgba(168,85,247,0.1)] lg:hidden">
          {/* Internal gradient sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-purple-50/20 rounded-2xl pointer-events-none" />
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all relative z-10 ${activeTab === 'home' ? 'text-purple-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Home</span>
          </button>

          <button 
            onClick={() => navigate("/level")}
            className={`flex flex-col items-center gap-1 transition-all relative z-10 ${activeTab === 'levels' ? 'text-purple-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Levels</span>
          </button>

          {/* Floating AI Core Trigger Node with Glowing Border Ring */}
          <button className="relative -mt-9 p-4 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 rounded-full text-white shadow-xl shadow-purple-500/30 cursor-pointer transform hover:scale-110 transition-transform active:scale-95 group z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full blurOpacity-60 group-hover:opacity-100 transition duration-300" />
            <Bot className="w-6 h-6 relative z-10" />
          </button>

          <button 
            onClick={() => setActiveTab('premium')}
            className={`flex flex-col items-center gap-1 transition-all relative z-10 ${activeTab === 'premium' ? 'text-amber-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Crown className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Premium</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all relative z-10 ${activeTab === 'profile' ? 'text-purple-600 scale-105' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-wider">Profile</span>
          </button>

      </nav>

    </div>
  );
}

// Add these custom animations to your global CSS or Tailwind config
/*

*/