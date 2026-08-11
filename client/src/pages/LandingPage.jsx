import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Volume2, Mic, Globe, ShieldCheck, Play, 
  Zap, BookOpen, Layers, CheckCircle2, UserPlus, BarChart3, 
  Radio, Flame, Activity, BotMessageSquare, Sparkle
} from 'lucide-react';
import bgimg from "../assets/ai-bg-img.avif"; // Keep your existing image asset
import { useNavigate } from 'react-router';

export default function LandingPage() {

  const navigate = useNavigate()
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-300 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200 relative">
      
      {/* 🌌 High-Tech Background Architecture */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-25 pointer-events-none z-0" />

      {/* 🏷️ Top-Left Brand Logo Signature (Isolated outside normal flow) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="absolute top-6 left-4 sm:left-8 z-50 flex items-center gap-2 cursor-pointer group"
      >
        <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-5 h-5 text-slate-950" />
        </div>
        <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent uppercase">
          Lingo<span className="text-cyan-400">AI</span>
        </span>
      </motion.div>

      {/* 🚀 HERO PRESENTATION SUITE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Block: High-Impact Typography & Interactive CTA */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-6 text-center lg:text-left space-y-8 max-w-xl mx-auto lg:mx-0"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" /> Evolution of Learning
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Master English <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(52,211,153,0.1)]">
                Through Real AI.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-slate-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0 font-medium">
              Skip the textbook formulas. Speak directly to an intelligent engine built to adapt to your rhythm instantly.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-2">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(52, 211, 153, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={()=> navigate("/register")}
                className="w-full sm:w-auto px-8 h-14 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-3 shadow-xl transition-all duration-300 group"
              >
                <Play className="w-4 h-4 fill-slate-950 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Launch Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Block: Dynamic Futuristic App Mockup Showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Ambient Radial Lights behind the card */}
            <div className="absolute w-[85%] h-[85%] bg-gradient-to-tr from-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            
            <motion.div 
              variants={floatingAnimation}
              animate="animate"
              className="w-full max-w-sm sm:max-w-md h-[440px] sm:h-[480px] rounded-[36px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden border-2 border-slate-700/50 flex flex-col justify-between p-6 bg-cover bg-center text-white ring-4 ring-emerald-500/10"
              style={{ backgroundImage: `url(${bgimg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-0" />

              {/* Status Header */}
              <div className="relative z-10 flex justify-between items-center w-full">
                <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-md">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
                  <span className="text-[10px] font-black uppercase text-slate-200 tracking-widest">Neural Link Live</span>
                </div>
              </div>

              {/* Visual Audio Responsive Node */}
              <div className="relative z-10 my-auto text-center space-y-4">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl"
                >
                  <div className="flex items-end gap-1.5 h-10 px-2">
                    <span className="w-1.5 bg-emerald-400 rounded-full h-4 animate-[bounce_0.8s_infinite_100ms]" />
                    <span className="w-1.5 bg-cyan-400 rounded-full h-9 animate-[bounce_0.8s_infinite_300ms]" />
                    <span className="w-1.5 bg-amber-400 rounded-full h-6 animate-[bounce_0.8s_infinite_200ms]" />
                    <span className="w-1.5 bg-emerald-300 rounded-full h-10 animate-[bounce_0.8s_infinite_400ms]" />
                    <span className="w-1.5 bg-cyan-300 rounded-full h-5 animate-[bounce_0.8s_infinite_150ms]" />
                  </div>
                </motion.div>
                <p className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">Analyzing Acoustic Accent...</p>
              </div>

              {/* Fluency Telemetry Float */}
              <motion.div 
                whileHover={{ y: -4 }}
                className="relative z-10 bg-slate-900/95 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl text-slate-950 shadow-md">
                    <Activity className="w-4 h-4 font-bold" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider">Sync Accuracy</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Rhythm / Vocabulary Node</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">96.8%</span>
                  <span className="block text-[8px] font-black text-amber-400 uppercase tracking-widest mt-0.5">Elite Class</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* 🧭 GAMIFIED PIPELINE MATRIX */}
      <section className="bg-[#05080f] border-y border-slate-900 py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, borderColor: 'rgba(16, 185, 129, 0.3)' }}
              className="group relative p-8 bg-slate-900/40 border border-slate-800 rounded-3xl transition-all duration-300 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <UserPlus className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-white tracking-wide">Sync Profile</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Initialize immediate neural calibration tracking milestones dynamically.
              </p>
              <div className="absolute top-2 right-6 text-6xl font-black text-slate-800/40 group-hover:text-emerald-500/10 transition-colors select-none">01</div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, borderColor: 'rgba(34, 211, 238, 0.3)' }}
              className="group relative p-8 bg-slate-900/40 border border-slate-800 rounded-3xl transition-all duration-300 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-inner">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-white tracking-wide">Select Vector</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose specialized dialogue templates matched to real professional parameters.
              </p>
              <div className="absolute top-2 right-6 text-6xl font-black text-slate-800/40 group-hover:text-cyan-500/10 transition-colors select-none">02</div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, borderColor: 'rgba(252, 211, 77, 0.3)' }}
              className="group relative p-8 bg-slate-900/40 border border-slate-800 rounded-3xl transition-all duration-300 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-white tracking-wide">Live Stream</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Activate speech systems and digest real-time syntactic processing changes instantly.
              </p>
              <div className="absolute top-2 right-6 text-6xl font-black text-slate-800/40 group-hover:text-amber-500/10 transition-colors select-none">03</div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 📚 IMMERSIVE VOCABULARY LABORATORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-black uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" /> Lexical Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Bite-Sized Multi-Sensory Daily Delivery.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              Absorb high-tier phrase constructs reinforced with active translation modulations and dynamic sound libraries.
            </p>
          </motion.div>

          {/* Interactive Lab Card Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-[#0e1726] to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="bg-slate-950/80 border border-slate-800/80 shadow-2xl rounded-2xl p-5 sm:p-6 space-y-6 text-left w-full backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-4">
                <div>
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">Module Variant 09 // Production Core</span>
                  <h3 className="text-lg font-black text-white mt-0.5">Token: Appreciate</h3>
                </div>
                <div className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold w-fit">5 Contexts Configured</div>
              </div>
              
              <div className="space-y-1.5">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Phonetic Sequence Map</p>
                <p className="text-sm sm:text-base text-slate-200 font-bold flex flex-wrap items-center gap-1.5">
                  🗣️ Uh-pree-shee-ayt <span className="text-cyan-400 font-black text-xs sm:text-sm">(अप्रिशिएट)</span>
                </p>
              </div>

              <div className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-black w-fit tracking-wide">
                Hindi Spectrum: सराहना करना / कद्र करना
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-slate-900/60 border border-slate-800/60 rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed font-medium italic flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>"I highly appreciate your friendly help in this school project."</span>
                <motion.div 
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 rounded-xl shadow-md shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🗣️ DIALOGUE CALIBRATION CONSOLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Conversational Terminal Interface */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 order-2 lg:order-1 bg-gradient-to-br from-slate-900 via-[#0a1220] to-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-8 relative shadow-2xl"
          >
            <div className="bg-slate-950/90 border border-slate-950 shadow-2xl rounded-2xl p-4 sm:p-6 space-y-5 text-left max-h-[320px] overflow-y-auto scrollbar-none w-full backdrop-blur-xl">
              
              {/* AI Node Message */}
              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-slate-900 border border-slate-800 text-cyan-400 rounded-xl shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3.5 bg-slate-900/50 border border-slate-800 text-slate-300 rounded-2xl text-xs sm:text-sm font-medium max-w-[80%]">
                  Hello! What is your favorite outdoor sport to play with friends?
                </div>
              </div>

              {/* User Input Stream */}
              <div className="flex gap-3 items-start justify-end">
                <div className="p-3.5 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 rounded-2xl text-xs sm:text-sm font-black max-w-[80%] shadow-lg shadow-emerald-500/5">
                  i likes to play cricket everyday in evening time
                </div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 text-emerald-400 rounded-xl shrink-0">
                  <Mic className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* Dynamic Error Analysis Modulator */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-3 items-start"
              >
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
                  <Sparkle className="w-4 h-4" />
                </div>
                <div className="p-4 bg-gradient-to-b from-amber-950/20 to-transparent border border-amber-500/20 rounded-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-[80%] font-medium">
                  <span className="block text-[8px] text-amber-400 font-black uppercase tracking-widest mb-1.5">⚡ Syntax Fix Triggered</span>
                  Instead of "i likes to play", adjust to "I like to play". Moving onward: Identify your primary cricket inspiration.
                </div>
              </motion.div>

            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6 order-1 lg:order-2 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-black uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" /> Direct Telemetry
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Real-Time Synthetic Analysis.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              Engage seamlessly without manually pausing processes. The core engine dynamically registers accent inconsistencies, outputs instant corrections, and drives smooth dialogue.
            </p>
          </motion.div>

        </div>
      </section>

      {/* 📋 IMMUTABLE BRAND METRICS FOOTER */}
      <footer className="w-full bg-[#05070d] border-t border-slate-900 py-8 text-center text-[10px] text-slate-500 font-black uppercase tracking-widest px-4 relative z-10">
        <p>© 2026 Aura Systems Group. Neural Architectural Protocols reserved.</p>
      </footer>

    </div>
  );
}