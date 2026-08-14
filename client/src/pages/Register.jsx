import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Register() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // UI Interactions State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' }); // 'success' | 'error'
  const navigate = useNavigate()

  // Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Frontend Submission Handler
 // Frontend Submission Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // 🌐 Connect to Backend API
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throws error message sent from your backend controller
        throw new Error(data.message || 'Registration failed');
      }

      // Save JWT token in localStorage if returned by your backend
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      console.log("Response payload:", data);

      setStatus({
        type: 'success',
        message: data.message || 'Registration successful! Redirecting...',
      });

      // Clear Form Fields
      setFormData({ name: '', email: '', password: '', phone: '' });

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Server error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14, staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-300 font-sans antialiased flex flex-col justify-between p-4 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 🌌 High-Tech Background Architecture */}
      <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-40 -left-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none z-0" />

      {/* 🔮 Brand Signature - Floating Top Left */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 cursor-pointer"
      >
        <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl">
          <Sparkles className="w-4 h-4 text-slate-950" />
        </div>
        <span className="text-sm font-black tracking-widest text-white uppercase">Lingo<span className="text-cyan-400">AI</span></span>
      </motion.div>

      {/* 🛸 Main Layout Area - max-w reduced and gap shortened to remove space */}
      <main className="flex-grow max-w-5xl mx-auto w-full flex items-center justify-center py-12 px-2 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-center justify-items-center"
        >
          {/* Left Side: Animated Cute Robot Graphic with 1-Line Label (Brought structurally closer) */}
      <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center p-2 space-y-4 justify-self-center lg:justify-self-end">
  <motion.div 
    animate={{ 
      y: [0, -15, 0],
      rotate: [0, 1, -1, 0]
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className="relative flex flex-col items-center justify-center"
  >
    {/* Outer Glowing Pulsing Aura - Color updated to match brand gradient, size increased */}
    <div className="absolute w-80 h-80 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

    {/* Robot Frame - Size significantly increased */}
    <div className="relative z-10 w-80 h-90 bg-slate-900/60 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-[0_0_60px_rgba(16,185,129,0.2)] ring-4 ring-cyan-500/10">
      <div className="flex flex-col items-center justify-center space-y-4">
        
        {/* Floating Antenna Signal - Color updated, size increased */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" 
        />

        {/* Robot Head Shell - Size increased, colors updated to brand gradient */}
        <div className="w-28 h-24 bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-700 rounded-3xl p-2.5 flex flex-col justify-between shadow-2xl relative">
          
          {/* Animated Eye Nodes - Color updated */}
          <div className="flex justify-around items-center pt-1.5">
            <motion.div 
              animate={{ scaleY: [1, 0.1, 1] }} 
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.2 }}
              className="w-5 h-5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399]" 
            />
            <motion.div 
              animate={{ scaleY: [1, 0.1, 1] }} 
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.2 }}
              className="w-5 h-5 bg-emerald-400 rounded-full shadow-[0_0_12px_#34d399]" 
            />
          </div>

          {/* Cute Smiling Mouth - Color updated */}
          <div className="w-10 h-2 bg-cyan-400/80 rounded-full mx-auto mb-1.5 shadow-[0_0_10px_#22d3ee]" />
        </div>

        {/* Body Core - Size increased, icon color updated */}
        <div className="w-20 h-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-inner">
          <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  </motion.div>
  
  {/* Added Clean One-Line Robot Support Subtitle - Color updated */}
  <p className="text-sm font-semibold tracking-wide text-cyan-400/80 text-center select-none animate-pulse">
    Your AI language coach is ready to assist you.
  </p>
</div>

          {/* Spacer Column to smoothly manage interface composition */}
          <div className="lg:col-span-1 hidden lg:block"></div>

          {/* Right Side: Exact Form Core Wrapper */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start w-full">
            <motion.div
              variants={formVariants}
              className="w-full max-w-md bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] ring-4 ring-emerald-500/5"
            >
              {/* Decorative Top Accent Light */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-cyan-500/40 rounded-full" />

              <div className="text-center space-y-2 mb-8">
                <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Initialize <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent"> Profile</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xs text-slate-500 font-medium">
                  Configure your biometric data sync coordinates.
                </motion.p>
              </div>

              {/* Status Messages */}
              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`p-3.5 rounded-2xl text-xs font-bold mb-6 flex items-center gap-2.5 border ${
                      status.type === 'success' 
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400' 
                        : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSignup} className="space-y-5">
                {/* Field: Name */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className="w-full pl-11 pr-4 h-12 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                </motion.div>

                {/* Field: Email */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email"
                      className="w-full pl-11 pr-4 h-12 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>
                </motion.div>

                {/* Field: Phone */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Uplink </label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                    <input 
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-11 pr-4 h-12 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  </div>
                </motion.div>

                {/* Field: Password */}
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 h-12 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit Action Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(52, 211, 153, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all duration-300 disabled:opacity-50 group cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Register</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Existing Route Redirect Link */}
              <motion.p variants={itemVariants} className="text-center text-[10px] text-slate-500 mt-6 font-bold tracking-wide">
                Already synced to grid?{' '}
                <span className="text-emerald-400 hover:text-cyan-400 cursor-pointer underline transition-colors" onClick={()=> navigate("/login")}>
                  Login 
                </span>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </main>

   

    </div>
  );
}