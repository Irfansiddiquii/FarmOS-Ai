'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LocalDB } from '@/lib/db-store';
import { 
  Sprout, 
  Bell, 
  User as UserIcon, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  KeyRound,
  LogOut,
  Settings,
  HelpCircle,
  ShieldCheck,
  Check,
  ChevronRight,
  Lock,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  activeRole: 'farmer' | 'expert' | 'admin';
  onChangeRole: (role: 'farmer' | 'expert' | 'admin') => void;
  isLoggedIn: boolean;
  currentUser: any;
  onAuthChange: () => void;
  authReqTab: 'login' | 'register' | null;
  setAuthReqTab: (tab: 'login' | 'register' | null) => void;
}

export default function Header({ 
  activeRole, 
  onChangeRole,
  isLoggedIn,
  currentUser,
  onAuthChange,
  authReqTab,
  setAuthReqTab
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [notifications, setNotifications] = useState<{ id: number; type: string; text: string; time: string; unread: boolean; }[]>([]);

  // Modal control states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot' | 'update-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Login inputs State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password inputs State
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Update password input States
  const [updatePassword, setUpdatePassword] = useState('');
  const [updateConfirmPassword, setUpdateConfirmPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Register inputs State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'farmer' | 'expert' | 'admin'>('farmer');
  const [regPhone, setRegPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState('');
  const [regState, setRegState] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgree, setRegAgree] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Profile Edit inputs State
  const [accName, setAccName] = useState('');
  const [accPhone, setAccPhone] = useState('');
  const [accDistrict, setAccDistrict] = useState('');
  const [accState, setAccState] = useState('');
  const [accRole, setAccRole] = useState<'farmer' | 'expert' | 'admin'>('farmer');
  const [accPassword, setAccPassword] = useState('');
  const [accSuccessMsg, setAccSuccessMsg] = useState('');

  // Preference Settings variables State
  const [notifyToggle, setNotifyToggle] = useState(true);
  const [weatherAlertsToggle, setWeatherAlertsToggle] = useState(true);
  const [soilCheckToggle, setSoilCheckToggle] = useState(true);
  const [langPreference, setLangPreference] = useState('English');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Support / Raise Ticket variables State
  const [ticketCategory, setTicketCategory] = useState('AI Crop Diagnostic Issue');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Refs for clicking outside detection
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Synchronization with dynamic prop triggers from parent
  useEffect(() => {
    if (authReqTab) {
      const timer = setTimeout(() => {
        setAuthTab(authReqTab);
        setShowAuthModal(true);
        setAuthReqTab(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authReqTab, setAuthReqTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(LocalDB.getNotifications());
    }, 0);
    return () => clearTimeout(timer);
  }, [activeRole]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleBellClick = () => {
    const nextShow = !showNotifications;
    setShowNotifications(nextShow);
    if (nextShow) {
      const updated = notifications.map(n => ({ ...n, unread: false }));
      setNotifications(updated);
      LocalDB.setNotifications(updated);
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    LocalDB.setNotifications(updated);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
    LocalDB.setNotifications([]);
  };

  const handleNotificationClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    setNotifications(updated);
    LocalDB.setNotifications(updated);
  };

  const handleLogout = () => {
    LocalDB.setIsLoggedIn(false);
    setShowProfileDropdown(false);
    onAuthChange();
  };

  // Standard Supabase password recovery listener and URL hash handler
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    import('@/lib/supabaseClient').then(({ supabase }) => {
      const res = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setTimeout(() => {
            setAuthTab('update-password');
            setShowAuthModal(true);
          }, 0);
        }
      });
      subscription = res.data.subscription;
    }).catch(err => {
      console.error("Supabase client import error in PASSWORD_RECOVERY listener:", err);
    });

    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('type=recovery') || search.includes('type=recovery') || hash.includes('recovery')) {
        setTimeout(() => {
          setAuthTab('update-password');
          setShowAuthModal(true);
        }, 0);
      }
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleTriggerAuth = (tab: 'login' | 'register' | 'forgot' | 'update-password') => {
    setAuthTab(tab);
    setLoginError('');
    setRegError('');
    setRegSuccess('');
    setResetSuccess('');
    setResetError('');
    setUpdateSuccess('');
    setUpdateError('');
    setUpdatePassword('');
    setUpdateConfirmPassword('');
    setShowAuthModal(true);
    setShowProfileDropdown(false);
  };

  // Auth processing functions
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess('');
    setResetError('');
    setResetLoading(true);

    if (!resetEmail) {
      setResetError('Please enter your registered email address.');
      setResetLoading(false);
      return;
    }

    try {
      const success = await LocalDB.sendPasswordResetEmail(resetEmail);
      if (success) {
        setResetSuccess('A password reset link has been dispatched to your email! Please follow the link in your inbox.');
        setResetEmail('');
      } else {
        setResetError('No active connection to authentication client.');
      }
    } catch (err: any) {
      setResetError(err?.message || 'Failed to dispatch password reset request.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess('');
    setUpdateError('');
    setUpdateLoading(true);

    if (!updatePassword || !updateConfirmPassword) {
      setUpdateError('Please fill in both password fields.');
      setUpdateLoading(false);
      return;
    }

    if (updatePassword.length < 6) {
      setUpdateError('Password must be at least 6 characters long.');
      setUpdateLoading(false);
      return;
    }

    if (updatePassword !== updateConfirmPassword) {
      setUpdateError('Passwords do not match. Please try again.');
      setUpdateLoading(false);
      return;
    }

    try {
      const success = await LocalDB.updateUserPassword(updatePassword);
      if (success) {
        setUpdateSuccess('Your password has been updated securely! Redirecting to Sign In...');
        setUpdatePassword('');
        setUpdateConfirmPassword('');
        setTimeout(() => {
          setAuthTab('login');
          setUpdateSuccess('');
        }, 2500);
      } else {
        setUpdateError('Failed to update password. Authentication client unavailable.');
      }
    } catch (err: any) {
      setUpdateError(err?.message || 'Secure password update failed.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please supply both email and password.');
      return;
    }

    setLoginLoading(true);

    try {
      const verified = await LocalDB.verifyLogin(loginEmail, loginPassword);
      if (verified) {
        await LocalDB.fetchAndStoreRoleSignature(verified.id, verified.role);
        onAuthChange();
        setShowAuthModal(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid email or password. Please try again or use Quick Demo accounts.');
      }
    } catch (e: any) {
      setLoginError(e?.message || 'Login error occurred.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regLoading) return;
    setRegError('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('All requested fields are required.');
      return;
    }

    if (!regAgree) {
      setRegError('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Confirm password must match your chosen password.');
      return;
    }

    if (regRole === 'admin') {
      setRegError('Admin role registration is restricted.');
      return;
    }

    try {
      setRegLoading(true);
      const success = await LocalDB.registerUser(
        regName,
        regEmail,
        regPassword,
        regRole,
        regPhone,
        regDistrict,
        regState
      );

      if (success) {
        if (!LocalDB.isLoggedIn()) {
          setRegSuccess('Registration successful! Please check your email inbox to confirm your account, then sign in.');
          setRegName('');
          setRegEmail('');
          setRegPhone('');
          setRegDistrict('');
          setRegState('');
          setRegPassword('');
          setRegConfirmPassword('');
        } else {
          await LocalDB.fetchAndStoreRoleSignature(success.id, success.role);
          onAuthChange();
          setShowAuthModal(false);
          setRegName('');
          setRegEmail('');
          setRegPhone('');
          setRegDistrict('');
          setRegState('');
          setRegPassword('');
          setRegConfirmPassword('');
        }
      } else {
        setRegError('Registration failed. Please check your details and try again.');
      }
    } catch (err: any) {
      const errMsg = err?.message || '';
      if (errMsg.toLowerCase().includes('rate limit')) {
        setRegError('Too many signup attempts. Please wait a few minutes and try again.');
      } else if (errMsg.toLowerCase().includes('already exists')) {
        setRegError('An account with this email address already exists. Please sign in instead.');
      } else {
        setRegError(errMsg || 'An unexpected error occurred during signup.');
      }
    } finally {
      setRegLoading(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccSuccessMsg('');

    if (!currentUser) return;

    const success = await LocalDB.updateUserProfile(currentUser.id, {
      name: accName,
      phone: accPhone,
      district: accDistrict,
      state: accState,
      role: accRole,
      ...(accPassword ? { password: accPassword } : {})
    });

    if (success) {
      setAccSuccessMsg('Profile saved! Syncing...');
      onAuthChange();
      setTimeout(() => {
        setAccSuccessMsg('');
        setShowAccountModal(false);
      }, 1500);
    }
  };

  useEffect(() => {
    if (showAccountModal && currentUser) {
      const timer = setTimeout(() => {
        setAccName(currentUser.name || '');
        setAccPhone(currentUser.phone || '');
        setAccDistrict(currentUser.district || '');
        setAccState(currentUser.state || '');
        setAccRole(currentUser.role || 'farmer');
        setAccPassword(currentUser.password || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [showAccountModal, currentUser]);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => {
      setSettingsSuccess(false);
      setShowSettingsModal(false);
    }, 1200);
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg.trim()) return;
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setTicketMsg('');
      setShowHelpModal(false);
    }, 2000);
  };

  return (
    <>
      {/* Premium Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050705]/80 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Live Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 via-lime-500 to-emerald-600 text-black shadow-lg shadow-lime-500/20 font-extrabold ring-1 ring-white/20 transition-transform duration-300 hover:scale-105">
              <Sprout className="h-5.5 w-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-lg font-black tracking-tight text-white">
                  Farm<span className="text-gradient-lime">OS AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-lime-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse"></span>
                  v3.5 Active
                </span>
              </div>
              <p className="text-[10px] font-medium text-white/40 tracking-wider hidden sm:block">PRECISION AGRITECH ENGINE</p>
            </div>
          </div>

          {/* Action Controls & Role Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Active Role Switcher Panel for Admin / Role View */}
            {isLoggedIn && currentUser?.role === 'admin' && (
              <>
                <div className="hidden md:flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur-md">
                  <button
                    onClick={() => onChangeRole('farmer')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      activeRole === 'farmer'
                        ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🌾</span>
                    <span>Farmer View</span>
                  </button>
                  <button
                    onClick={() => onChangeRole('expert')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      activeRole === 'expert'
                        ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>🎓</span>
                    <span>Expert View</span>
                  </button>
                  <button
                    onClick={() => onChangeRole('admin')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      activeRole === 'admin'
                        ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>⚙️</span>
                    <span>Admin Config</span>
                  </button>
                </div>

                <div className="md:hidden flex items-center">
                  <select
                    value={activeRole}
                    onChange={(e) => onChangeRole(e.target.value as any)}
                    className="rounded-lg border border-white/10 bg-[#0A0D0A] px-2.5 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    <option value="farmer">🌾 Farmer View</option>
                    <option value="expert">🎓 Expert View</option>
                    <option value="admin">⚙️ Admin Config</option>
                  </select>
                </div>
              </>
            )}

            {/* Notifications Feed Button */}
            <div ref={notificationRef} className="relative">
              <button
                id="notification-bell"
                onClick={handleBellClick}
                className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2 text-white/70 hover:bg-white/10 hover:text-white focus:outline-none transition duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-500 text-[9px] font-black text-black ring-2 ring-[#050705]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-84 rounded-2xl border border-white/10 bg-[#0A0E0A]/95 p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-50">
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-lime-400" />
                      <span className="text-xs font-bold text-white tracking-tight">Agricultural Telemetry Alerts</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleMarkAllRead}
                        className="rounded-md bg-lime-500/10 px-2 py-0.5 text-[10px] font-bold text-lime-400 hover:bg-lime-500/20 transition"
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 hover:bg-rose-500/20 transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={(e) => handleNotificationClick(n.id, e)}
                        className={`rounded-xl p-2.5 text-xs transition cursor-pointer ${
                          n.unread 
                            ? 'bg-lime-500/10 hover:bg-lime-500/15 text-lime-100 border border-lime-500/20 font-semibold' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm mt-0.5">
                            {n.type === 'weather' ? '🌧️' : n.type === 'disease' ? '🛡️' : '📈'}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium leading-snug">{n.text}</p>
                            <span className="text-[10px] text-white/40 font-mono mt-1 block">{n.time}</span>
                          </div>
                          {n.unread && (
                            <span className="h-2 w-2 rounded-full bg-lime-400 mt-1 shrink-0"></span>
                          )}
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-center py-6 text-white/40 text-xs font-medium">No new telemetry alerts.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill & Dropdown / Guest Auth CTA */}
            <div ref={profileRef} className="relative">
              {isLoggedIn ? (
                <button
                  id="profile-avatar-btn"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pr-3 hover:bg-white/10 transition duration-200 focus:outline-none"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-600 text-black font-extrabold text-xs shadow-md">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-white leading-none">
                      {currentUser?.name || 'Authorized Cultivator'}
                    </p>
                    <p className="text-[9px] font-semibold text-lime-400 uppercase tracking-wider leading-none mt-0.5">
                      {currentUser?.role || 'Farmer'}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerAuth('login')}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleTriggerAuth('register')}
                    className="rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-1.5 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && isLoggedIn && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-white/10 bg-[#0A0E0A]/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-50 text-left">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-white text-xs truncate">{currentUser?.name || 'Authorized User'}</p>
                    <p className="text-[10px] text-white/40 font-mono truncate">{currentUser?.email || 'user@farmos.ai'}</p>
                  </div>
                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => { setShowProfileDropdown(false); setShowProfileModal(true); }}
                      className="w-full text-left rounded-xl px-3 py-2 hover:bg-white/5 font-semibold text-xs text-white/80 hover:text-white transition flex items-center gap-2"
                    >
                      <UserIcon className="h-4 w-4 text-lime-400" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => { setShowProfileDropdown(false); setShowAccountModal(true); }}
                      className="w-full text-left rounded-xl px-3 py-2 hover:bg-white/5 font-semibold text-xs text-white/80 hover:text-white transition flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4 text-lime-400" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => { setShowProfileDropdown(false); setShowSettingsModal(true); }}
                      className="w-full text-left rounded-xl px-3 py-2 hover:bg-white/5 font-semibold text-xs text-white/80 hover:text-white transition flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4 text-lime-400" />
                      <span>Preferences</span>
                    </button>
                    <button
                      onClick={() => { setShowProfileDropdown(false); setShowHelpModal(true); }}
                      className="w-full text-left rounded-xl px-3 py-2 hover:bg-white/5 font-semibold text-xs text-white/80 hover:text-white transition flex items-center gap-2"
                    >
                      <HelpCircle className="h-4 w-4 text-lime-400" />
                      <span>Help & Support</span>
                    </button>
                  </div>
                  <div className="border-t border-white/10 pt-1.5 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left rounded-xl px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 
        ========================================================================
        REDESIGNED AUTHENTICATION MODAL (Linear / Vercel Glassmorphic Styling)
        ========================================================================
      */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto custom-scrollbar"
          role="dialog"
          aria-modal="true"
        >
          <div className={`w-full transition-all duration-300 rounded-3xl border border-white/10 bg-[#0C100C]/90 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl relative my-8 glow-lime-lg ${
            authTab === 'register' ? 'max-w-xl' : 'max-w-md'
          }`}>
            
            {/* Close Modal Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Brand Pill & Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 text-black shadow-lg shadow-lime-500/20 ring-1 ring-white/20">
                <Sprout className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {authTab === 'login' && 'Sign In to FarmOS'}
                {authTab === 'register' && 'Create Cultivator Account'}
                {authTab === 'forgot' && 'Reset Your Password'}
                {authTab === 'update-password' && 'Set Secure Password'}
              </h2>
              <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                {authTab === 'login' && 'Access precision crop diagnostics, satellite weather telemetry, and P2P trading.'}
                {authTab === 'register' && 'Join certified agronomists and cultivators across India.'}
                {authTab === 'forgot' && 'Enter your email address to receive an official security reset link.'}
                {authTab === 'update-password' && 'Choose a strong password to protect your agricultural records.'}
              </p>
            </div>

            {/* Tab Selector Pill Switcher */}
            {(authTab === 'login' || authTab === 'register') && (
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-black/40 p-1.5 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => handleTriggerAuth('login')}
                  className={`rounded-xl py-2 text-xs font-bold transition-all duration-200 ${
                    authTab === 'login'
                      ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerAuth('register')}
                  className={`rounded-xl py-2 text-xs font-bold transition-all duration-200 ${
                    authTab === 'register'
                      ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* FORM 1: LOGIN */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="glass-input w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="glass-input w-full rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-white/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-white/40 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-lime-500 focus:ring-lime-500 focus:outline-none accent-lime-500 cursor-pointer"
                    />
                    <span>Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleTriggerAuth('forgot')}
                    className="text-xs font-bold text-lime-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {loginError && (
                  <div className="flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-rose-300 text-xs font-semibold animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {loginLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM 2: FORGOT PASSWORD */}
            {authTab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">Registered Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="glass-input w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/20"
                      required
                    />
                  </div>
                </div>

                {resetError && (
                  <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-rose-300 text-xs font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{resetError}</span>
                  </div>
                )}

                {resetSuccess && (
                  <div className="flex items-center gap-2 rounded-2xl bg-lime-500/10 border border-lime-500/20 p-3 text-lime-300 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-400" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 disabled:opacity-50 mt-2"
                >
                  {resetLoading ? 'Sending Security Link...' : 'Send Password Reset Link'}
                </button>

                <div className="text-center text-xs text-white/40 pt-2">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => handleTriggerAuth('login')}
                    className="font-bold text-lime-400 hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* FORM 3: UPDATE PASSWORD */}
            {authTab === 'update-password' && (
              <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">New Password</label>
                  <input
                    type="password"
                    value={updatePassword}
                    onChange={(e) => setUpdatePassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="glass-input w-full rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-white/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/60 uppercase tracking-wider block">Confirm New Password</label>
                  <input
                    type="password"
                    value={updateConfirmPassword}
                    onChange={(e) => setUpdateConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="glass-input w-full rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-white/20"
                    required
                  />
                </div>

                {updateError && (
                  <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-rose-300 text-xs font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{updateError}</span>
                  </div>
                )}

                {updateSuccess && (
                  <div className="flex items-center gap-2 rounded-2xl bg-lime-500/10 border border-lime-500/20 p-3 text-lime-300 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-400" />
                    <span>{updateSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 disabled:opacity-50 mt-2"
                >
                  {updateLoading ? 'Updating Password...' : 'Save New Password'}
                </button>
              </form>
            )}

            {/* FORM 4: REGISTER */}
            {authTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Farmer Name"
                        className="glass-input w-full rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="glass-input w-full rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Agro Role *</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white cursor-pointer bg-[#0A0E0A]"
                    >
                      <option value="farmer">🌾 Farmer / Cultivator</option>
                      <option value="expert">🎓 Expert Consultant</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 01234"
                        className="glass-input w-full rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">District</label>
                    <input
                      type="text"
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      placeholder="e.g. Karnal"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">State</label>
                    <input
                      type="text"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      placeholder="e.g. Haryana"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Password *</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Confirm Password *</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/20"
                      required
                    />
                  </div>

                  <div className="md:col-span-2 flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="regAgreeCheckbox"
                      checked={regAgree}
                      onChange={(e) => setRegAgree(e.target.checked)}
                      className="h-4 w-4 mt-0.5 rounded border-white/20 bg-white/5 text-lime-500 focus:ring-lime-500 focus:outline-none accent-lime-500 cursor-pointer"
                      required
                    />
                    <label htmlFor="regAgreeCheckbox" className="text-[11px] text-white/60 cursor-pointer">
                      I accept the <span className="text-lime-400 font-bold hover:underline">Terms of Service</span> and <span className="text-lime-400 font-bold hover:underline">Privacy Policy</span>.
                    </label>
                  </div>

                </div>

                {regError && (
                  <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-rose-300 text-xs font-semibold">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="flex items-center gap-2 rounded-2xl bg-lime-500/10 border border-lime-500/20 p-3 text-lime-300 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-lime-400" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 disabled:opacity-50 mt-2"
                >
                  {regLoading ? 'Registering Account...' : 'Complete Registration'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 2. USER PROFILE DETAILS MODAL */}
      {showProfileModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0C100C]/95 p-6 text-white shadow-2xl relative glow-lime">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-600 text-black font-black text-3xl shadow-xl shadow-lime-500/20 ring-2 ring-lime-400/40">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 px-2.5 py-0.5 rounded-full bg-lime-500 text-[9px] font-black uppercase text-black">
                  {currentUser.role}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">{currentUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-white/40 uppercase block">Phone</span>
                  <span className="font-semibold text-white mt-0.5 block">{currentUser.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/40 uppercase block">District</span>
                  <span className="font-semibold text-white mt-0.5 block">{currentUser.district || 'Karnal'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/40 uppercase block">State</span>
                  <span className="font-semibold text-white mt-0.5 block">{currentUser.state || 'Haryana'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/40 uppercase block">Security Clearance</span>
                  <span className="font-semibold text-lime-400 mt-0.5 block">Verified</span>
                </div>
              </div>

              <button
                onClick={() => { setShowProfileModal(false); setShowAccountModal(true); }}
                className="w-full rounded-2xl bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-white transition"
              >
                Edit Account Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MY ACCOUNT EDIT MODAL */}
      {showAccountModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0C100C]/95 p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setShowAccountModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Edit Profile & Account</h3>

            <form onSubmit={handleAccountSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase block mb-1">Phone</label>
                <input
                  type="text"
                  value={accPhone}
                  onChange={(e) => setAccPhone(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase block mb-1">District</label>
                  <input
                    type="text"
                    value={accDistrict}
                    onChange={(e) => setAccDistrict(e.target.value)}
                    className="glass-input w-full rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/50 uppercase block mb-1">State</label>
                  <input
                    type="text"
                    value={accState}
                    onChange={(e) => setAccState(e.target.value)}
                    className="glass-input w-full rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {accSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 text-xs font-semibold">
                  {accSuccessMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-lime-500 py-2.5 text-xs font-bold text-black hover:bg-lime-400 transition mt-2"
              >
                Save Account Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. PREFERENCES SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0C100C]/95 p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Application Preferences</h3>

            <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <div>
                  <p className="font-bold text-white">Push Notifications</p>
                  <p className="text-[10px] text-white/40">Receive real-time crop alert updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyToggle}
                  onChange={(e) => setNotifyToggle(e.target.checked)}
                  className="h-4 w-4 accent-lime-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <div>
                  <p className="font-bold text-white">Weather Satellite Sync</p>
                  <p className="text-[10px] text-white/40">Auto-update precipitation predictions</p>
                </div>
                <input
                  type="checkbox"
                  checked={weatherAlertsToggle}
                  onChange={(e) => setWeatherAlertsToggle(e.target.checked)}
                  className="h-4 w-4 accent-lime-500 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                <label className="font-bold text-white block">Language Preference</label>
                <select
                  value={langPreference}
                  onChange={(e) => setLangPreference(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#0A0E0A] cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi / हिन्दी</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>

              {settingsSuccess && (
                <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 text-xs font-semibold">
                  Preferences updated successfully!
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-lime-500 py-2.5 text-xs font-bold text-black hover:bg-lime-400 transition"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. HELP & SUPPORT TICKET MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0C100C]/95 p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Help & Support Desk</h3>
            <p className="text-xs text-white/50 mb-4">Submit your query directly to certified agronomists.</p>

            <form onSubmit={handleHelpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase block mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="glass-input w-full rounded-xl px-3 py-2 text-white bg-[#0A0E0A] cursor-pointer"
                >
                  <option value="AI Crop Diagnostic Issue">AI Crop Diagnostic Issue</option>
                  <option value="Subsidies & Relief Query">Subsidies & Relief Query</option>
                  <option value="P2P Marketplace Assistance">P2P Marketplace Assistance</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/50 uppercase block mb-1">Query Message</label>
                <textarea
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  rows={4}
                  placeholder="Describe your agricultural issue or question in detail..."
                  className="glass-input w-full rounded-xl p-3 text-white placeholder:text-white/20"
                  required
                />
              </div>

              {ticketSuccess && (
                <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 text-xs font-semibold">
                  Support ticket submitted successfully! An agronomist will review your query.
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-lime-500 py-2.5 text-xs font-bold text-black hover:bg-lime-400 transition"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
