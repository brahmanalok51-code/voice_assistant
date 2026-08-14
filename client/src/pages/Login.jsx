import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Cpu, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Login() {
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI Interactions & Status State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' }); // 'success' | 'error'
  const navigate = useNavigate();

  // Field Validation Rules
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const hasCapitalLetter = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const isPasswordValid = hasCapitalLetter && hasNumber && formData.password.length >= 6;

  // Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Frontend Submission Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setStatus({ type: null, message: '' });

    // Client-side Gatekeeper
    if (!isEmailValid || !isPasswordValid) {
      setStatus({
        type: 'error',
        message: 'Please resolve the highlighted validation errors.',
      });
      return;
    }

    setLoading(true);

    try {
      // 🌐 Connect to Backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Save JWT token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setStatus({
        type: 'success',
        message: data.message || 'Login verified! Entering practice room...',
      });

      // Clear Form Fields
      setFormData({ email: '', password: '' });

      // Redirect after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Connection to authentication server failed.',
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
      
      {/* 🌌 Ambient Background Glows */}
      <div className="absolute -top-40 -right-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-40 -left-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none z-0" />

      {/* 🔮 Brand Signature */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="p-2 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl">
          <Sparkles className="w-4 h-4 text-slate-950" />
        </div>
        <span className="text-sm font-black tracking-widest text-white uppercase">Lingo<span className="text-cyan-400">AI</span></span>
      </motion.div>

      {/* 🛸 Main Responsive Layout */}
      <main className="flex-grow max-w-5xl mx-auto w-full flex items-center justify-center py-12 px-2 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-center justify-items-center"
        >
          {/* Left Side: Animated High-Tech Robot Graphic (Hidden on Mobile) */}
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
              {/* Pulsing Aura */}
              <div className="absolute w-80 h-80 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

              {/* Robot Outer Capsule */}
              <div className="relative z-10 w-80 h-90 bg-slate-900/60 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-md shadow-[0_0_60px_rgba(16,185,129,0.2)] ring-4 ring-cyan-500/10">
                <div className="flex flex-col items-center justify-center space-y-4">
                  
                  {/* Floating Antenna Node */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" 
                  />

                  {/* Robot Head Frame */}
                  <div className="w-28 h-24 bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-700 rounded-3xl p-2.5 flex flex-col justify-between shadow-2xl relative">
                    
                    {/* Blinking Eyes */}
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

                    {/* Smile Bar */}
                    <div className="w-10 h-2 bg-cyan-400/80 rounded-full mx-auto mb-1.5 shadow-[0_0_10px_#22d3ee]" />
                  </div>

                  {/* Chest Microprocessor */}
                  <div className="w-20 h-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                    <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Robot Status Subtitle */}
            <p className="text-sm font-semibold tracking-wide text-cyan-400/80 text-center select-none animate-pulse">
              Speech synthesis modules ready to sync.
            </p>
          </div>

          {/* Spacer Column */}
          <div className="lg:col-span-1 hidden lg:block"></div>

          {/* Right Side: Animated Authentication Form */}
          <div className="lg:col-span-6 flex justify-center lg:justify-start w-full">
            <motion.div
              variants={formVariants}
              className="w-full max-w-md bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] ring-4 ring-emerald-500/5 relative"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-cyan-500/40 rounded-full" />

              <div className="text-center space-y-2 mb-8">
                <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">Back</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-xs text-slate-500 font-medium">
                  Enter your credentials to unlock daily speech sessions.
                </motion.p>
              </div>

              {/* Status Alert Notification */}
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

              <form onSubmit={handleLogin} className="space-y-5">
                
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
                      placeholder="student@example.com"
                      className={`w-full pl-11 pr-10 h-12 bg-slate-950/60 border rounded-xl text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 transition-all ${
                        isSubmitted && !isEmailValid
                          ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10'
                          : formData.email && isEmailValid
                          ? 'border-emerald-500/50 focus:border-emerald-500/80 focus:ring-emerald-500/10'
                          : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/10'
                      }`}
                    />
                    {formData.email && (
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        {isEmailValid ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {isSubmitted && !isEmailValid && (
                    <p className="text-[10px] font-bold text-rose-400 ml-1">Please enter a valid email address.</p>
                  )}
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
                      className={`w-full pl-11 pr-11 h-12 bg-slate-950/60 border rounded-xl text-xs font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 transition-all ${
                        isSubmitted && !isPasswordValid
                          ? 'border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-500/10'
                          : formData.password && isPasswordValid
                          ? 'border-emerald-500/50 focus:border-emerald-500/80 focus:ring-emerald-500/10'
                          : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/10'
                      }`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Live Password Constraints Pill Badges */}
                  <div className="pt-1.5 flex flex-wrap gap-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                      hasCapitalLetter 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      {hasCapitalLetter ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      1 Capital Letter (A-Z)
                    </div>

                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                      hasNumber 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      1 Number (0-9)
                    </div>

                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                      formData.password.length >= 6 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      {formData.password.length >= 6 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      6+ Characters
                    </div>
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
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Registration Route Link */}
              <motion.p variants={itemVariants} className="text-center text-[10px] text-slate-500 mt-6 font-bold tracking-wide">
                Need a new access account?{' '}
                <span 
                  className="text-emerald-400 hover:text-cyan-400 cursor-pointer underline transition-colors" 
                  onClick={() => navigate('/register')}
                >
                  Register
                </span>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}