import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, ArrowRight, Zap, ShieldCheck, 
  Crown, Flame, Clock, Gift, ArrowLeft, Star, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PricingPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'weekly' | 'monthly' | 'yearly'
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: 'weekly',
      name: '7-Day Sprint',
      badge: 'Short-Term Trial',
      price: 50,
      originalPrice: 99,
      discount: '50% OFF',
      duration: 'per week',
      description: 'Perfect for quick exam preparation and short-term fluency sprints.',
      icon: Clock,
      glowColor: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-slate-800 hover:border-cyan-500/40',
      accentColor: 'text-cyan-400',
      buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700',
      features: [
        'Full access to all Vocabulary Levels',
        'Instant pronunciation feedback & scoring',
        'Daily practice limit: 30 minutes/day',
        'Standard voice audio synthesis'
      ]
    },
    {
      id: 'monthly',
      name: 'Pro Fluency',
      badge: '🔥 Most Popular',
      price: 200,
      originalPrice: 400,
      discount: 'SAVE 50%',
      duration: 'per month',
      popular: true,
      description: 'The standard choice for regular speaking practice and continuous growth.',
      icon: Flame,
      glowColor: 'from-emerald-500/30 to-cyan-500/20',
      borderColor: 'border-emerald-500/50 ring-4 ring-emerald-500/10',
      accentColor: 'text-emerald-400',
      buttonStyle: 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 hover:scale-[1.02]',
      features: [
        'Unlimited AI Live Voice practice',
        '500+ Advanced words with Devanagari phonetics',
        'Real-time accent correction engine',
        'Personal progress analytics dashboard',
        'Priority server responses'
      ]
    },
    {
      id: 'yearly',
      name: 'Ultimate Master',
      badge: '👑 Best Value',
      price: 999,
      originalPrice: 2400,
      discount: 'SAVE 60%',
      duration: 'per year (₹83/mo)',
      description: 'Complete year-round language mastery with dedicated speech simulations.',
      icon: Crown,
      glowColor: 'from-purple-500/30 to-amber-500/20',
      borderColor: 'border-amber-500/40 hover:border-amber-400/60 ring-2 ring-amber-500/10',
      accentColor: 'text-amber-400',
      buttonStyle: 'bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 hover:scale-[1.02]',
      features: [
        'Everything in Pro Fluency plan',
        '365 Days uninterrupted cloud sync',
        'Exclusive Job Interview Scenario simulator',
        'Early access to new dialect voices',
        'Official verified Certificate of Fluency'
      ]
    }
  ];

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId);
    try {
      // Simulate backend payment order creation (Razorpay / Stripe)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Initiating checkout for plan: ${planId.toUpperCase()}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-300 font-sans antialiased p-4 sm:p-6 lg:p-12 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 🌌 High-Tech Background Glows */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2">
          
            <span className="text-sm font-black tracking-widest text-white uppercase">
              Premium
            </span>
          </div>
        </div>

        {/* Hero Section & Special Promo Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          {/* Animated Promo Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-amber-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/5 backdrop-blur-md"
          >
            <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Independence Month Special: Up to 60% Discount Applied!</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Unlock Unlimited <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              English Speaking Mastery
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium"
          >
            Practice real-time speech dialogue, master 500+ curated situational vocabulary words, and get dynamic phonetic corrections.
          </motion.p>
        </div>

        {/* =========================================================================
            PRICING CARDS GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const IconComponent = plan.icon;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col justify-between rounded-[32px] bg-slate-900/40 backdrop-blur-xl border p-6 sm:p-8 shadow-2xl transition-all ${plan.borderColor} ${
                  isPopular ? 'md:-translate-y-2' : ''
                }`}
              >
                {/* Glowing Top Backdrop */}
                <div className={`absolute -top-16 inset-x-0 h-40 bg-gradient-to-b ${plan.glowColor} rounded-full blur-2xl pointer-events-none`} />

                {/* Badge (Top Tag) */}
                <div className="flex justify-between items-center mb-5 relative z-10">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <IconComponent className={`w-5 h-5 ${plan.accentColor}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                    isPopular 
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    {plan.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="my-6 pt-4 border-t border-slate-800/80 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">₹{plan.price}</span>
                    <span className="text-xs font-semibold text-slate-500 line-through">₹{plan.originalPrice}</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-500/30 text-rose-400 text-[10px] font-extrabold">
                      {plan.discount}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold mt-1 block">{plan.duration}</span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8 relative z-10 flex-grow">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Includes:</span>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                      <div className="p-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="relative z-10">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={loadingPlan === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full h-12 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${plan.buttonStyle}`}
                  >
                    {loadingPlan === plan.id ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Started Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Security & Guarantee Trust Footnote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Safe & Encrypted Transactions</h4>
              <p className="text-[11px] text-slate-500">Supports UPI, Net Banking, Credit/Debit Cards, and Wallets.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Cancel Anytime</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Instant Activation</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}