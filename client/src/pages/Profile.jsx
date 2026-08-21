import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Camera, 
  Sparkles, CheckCircle2, AlertCircle, ShieldCheck, 
  Flame, Award, BookOpen, Save, KeyRound, Check, X, ArrowLeft, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Active Tab: 'details' | 'security'
  const [activeTab, setActiveTab] = useState('details');

  // logout method...
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    targetLevel: 'Level 18 - Intermediate Speaking',
    bio: 'Learning English fluency for technical interviews and presentations.',
    avatarUrl: null
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status & Loading states
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  // Password Live Validation Rules
  const hasCapitalLetter = /[A-Z]/.test(passwordData.newPassword);
  const hasNumber = /[0-9]/.test(passwordData.newPassword);
  const isNewPassValid = hasCapitalLetter && hasNumber && passwordData.newPassword.length >= 6;
  const isPassMatch = passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword.length > 0;

  // 1. Fetch User Profile Data on Component Mount
useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile data');
      }

      if (data.user) {
        setProfileData((prev) => ({
          ...prev,
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          avatarUrl: data.user.avatar || null
        }));
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Could not load profile details.' });
    }
  };

  fetchUserProfile();
}, [navigate]);

  // 2. Handle Avatar Upload & Auto Update in Database (Base64)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Image size must be less than 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result;
      setProfileData((prev) => ({ ...prev, avatarUrl: base64String }));

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/user/update-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatar: base64String })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to upload image.');
        }

        setStatus({ type: 'success', message: 'Profile avatar updated and saved successfully!' });
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Error saving avatar to database.' });
      }
    };
  };

  // 3. Update Profile Details Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          avatar: profileData.avatarUrl
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setStatus({ type: 'success', message: data.message || 'Profile details saved successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  // 4. Change Password Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!isNewPassValid) {
      setStatus({ type: 'error', message: 'New password does not meet security requirements.' });
      return;
    }

    if (!isPassMatch) {
      setStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password update failed.');
      }

      setStatus({ type: 'success', message: data.message || 'Password changed successfully! Keep it safe.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Password update failed. Check current password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-300 font-sans antialiased p-4 sm:p-6 lg:p-10 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 🌌 Background Glowing Ambience */}
      <div className="absolute -top-40 -right-40 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-15 pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="max-w-6xl mx-auto relative z-10 space-y-6">
        
        {/* Navigation & Header Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
          
            <span className="text-sm font-black tracking-widest text-white uppercase">
              Profile
            </span>
          </div>
        </div>

        {/* Global Alert Notification */}
        <AnimatePresence mode="wait">
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 border ${
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

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT CARD: User Identity & Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Identity Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-[28px] p-6 text-center backdrop-blur-xl relative overflow-hidden shadow-xl ring-4 ring-emerald-500/5">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-cyan-500/40" />

              {/* Avatar Uploader Node */}
              <div className="relative w-28 h-28 mx-auto mb-4 group">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,0.25)] bg-slate-950 flex items-center justify-center">
                  {profileData.avatarUrl ? (
                    <img 
                      src={profileData.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-500" />
                  )}
                </div>

                {/* Upload Trigger Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title="Upload picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <h2 className="text-xl font-black text-white">{profileData.name || 'User Profile'}</h2>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">{profileData.email}</p>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 px-2">{profileData.bio}</p>

              {/* Quick Tab Selector */}
              <div className="mt-6 p-1.5 bg-slate-950/70 border border-slate-800 rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
                <button
                  onClick={() => { setActiveTab('details'); setStatus({ type: null, message: '' }); }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'details'
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => { setActiveTab('security'); setStatus({ type: null, message: '' }); }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Security
                </button>
             
              </div>
                 <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="w-full h-8 sm:h-10 mt-1 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-rose-500/5 transition-all duration-200 cursor-pointer"
    >
      <LogOut className="w-4 h-4 text-rose-400" />
      <span>Log Out</span>
    </motion.button>
            </div>

            {/* Gamification Stats Overview */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-[28px] p-5 space-y-3 backdrop-blur-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Learning Milestones</h3>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                  <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-base font-black text-white block">14</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Day Streak</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                  <BookOpen className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-base font-black text-white block">180</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Words</span>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                  <Award className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-base font-black text-white block">Lvl 18</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Tier</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT CARD: Forms Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8"
          >
            <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-2xl ring-4 ring-emerald-500/5 relative">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-emerald-400/40" />

              {/* TAB 1: General Details Form */}
              {activeTab === 'details' && (
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-white tracking-tight">Personal Details</h3>
                    <p className="text-xs text-slate-500">Update your public identification and speech goals.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <div className="relative group">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type="text"
                          required
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full pl-11 pr-4 h-11 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email (Read-only / Verified) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          disabled
                          value={profileData.email}
                          className="w-full pl-11 pr-4 h-11 bg-slate-950/30 border border-slate-800/60 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <div className="relative group">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-11 pr-4 h-11 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Target Track */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Track</label>
                      <input
                        type="text"
                        value={profileData.targetLevel}
                        onChange={(e) => setProfileData({ ...profileData, targetLevel: e.target.value })}
                        className="w-full px-4 h-11 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Practice Bio</label>
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 h-11 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> Save Profile Changes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Change Password Form */}
              {activeTab === 'security' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-emerald-400" /> Change Security Password
                    </h3>
                    <p className="text-xs text-slate-500">Ensure your account uses a strong credentials passkey.</p>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 h-11 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-11 h-11 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Rule Indicators */}
                    <div className="pt-2 flex flex-wrap gap-2">
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
                        passwordData.newPassword.length >= 6 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}>
                        {passwordData.newPassword.length >= 6 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        6+ Characters
                      </div>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                    <div className="relative group">
                      <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        required
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className={`w-full pl-11 pr-11 h-11 bg-slate-950/60 border rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 transition-all ${
                          passwordData.confirmPassword && isPassMatch
                            ? 'border-emerald-500/50 focus:ring-emerald-500/10'
                            : passwordData.confirmPassword && !isPassMatch
                            ? 'border-rose-500/60 focus:ring-rose-500/10'
                            : 'border-slate-800 focus:border-cyan-500/50 focus:ring-cyan-500/10'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !isNewPassValid || !isPassMatch}
                      className="px-6 h-11 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <KeyRound className="w-4 h-4" /> Update Password
                    </button>
                  </div>
                </form>
              )}

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}