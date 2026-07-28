'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FloatingChat from '@/components/FloatingChat';
import DashboardTab from '@/components/DashboardTab';
import FarmsCropsTab from '@/components/FarmsCropsTab';
import AIEngineTab from '@/components/AIEngineTab';
import AnalyticsTab from '@/components/AnalyticsTab';
import MarketplaceTab from '@/components/MarketplaceTab';
import CommunityTab from '@/components/CommunityTab';
import SchemesTab from '@/components/SchemesTab';
import ExpertTab from '@/components/ExpertTab';
import AdminTab from '@/components/AdminTab';
import { LocalDB } from '@/lib/db-store';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sprout,
  Activity,
  TrendingUp,
  BarChart3,
  CloudSun,
  Zap,
  CheckCircle2,
  Users,
  Award,
  FileText,
  ShoppingBag,
  Bot,
  Star,
  Layers,
  Globe,
  Lock,
  Compass,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const [activeRole, setActiveRole] = useState<'farmer' | 'expert' | 'admin'>('farmer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authVersion, setAuthVersion] = useState(0);
  const [authReqTab, setAuthReqTab] = useState<'login' | 'register' | null>(null);

  // Tab selector for Farmer view
  const [activeFarmerTab, setActiveFarmerTab] = useState<'overview' | 'farms-crops' | 'ai-engine' | 'analytics' | 'marketplace' | 'community' | 'schemes'>('overview');

  useEffect(() => {
    // Read session on mount & when authVersion updates
    const timer = setTimeout(() => {
      const loggedIn = LocalDB.getIsLoggedIn();
      setIsLoggedIn(loggedIn);
      const user = LocalDB.getCurrentUser();
      setCurrentUser(user);
      if (loggedIn && user) {
        const localActiveRole = LocalDB.getActiveRole();
        setActiveRole(localActiveRole);

        // Audits user's live role claim against the backend signature
        const validateRoleOnServer = async () => {
          await LocalDB.syncAllFromSupabase();

          const sig = LocalDB.getActiveRoleSignature();
          if (!sig) {
            await LocalDB.fetchAndStoreRoleSignature(user.id, localActiveRole);
            return;
          }

          try {
            const res = await fetch('/api/auth/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id, role: localActiveRole, signature: sig })
            });
            const data = await res.json();
            if (!data.valid) {
              console.warn("Security Alert: Trusted role validation failed. Clearing local storage session.");
              LocalDB.setIsLoggedIn(false);
              setIsLoggedIn(false);
              setCurrentUser(null);
            }
          } catch (e) {
            console.error("Failed to run active role verification:", e);
          }
        };

        validateRoleOnServer();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [authVersion]);

  // Real weather telemetry state for hero preview card
  const [heroWeather, setHeroWeather] = useState<{ temp: string; condition: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('https://api.open-meteo.com/v1/forecast?latitude=29.6857&longitude=76.9905&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data?.current_weather && mounted) {
          const w = data.current_weather;
          setHeroWeather({
            temp: `${Math.round(w.temperature)}°C`,
            condition: w.weathercode === 0 ? "Clear Sky" : "Overcast"
          });
        }
      })
      .catch(() => {
        if (mounted) setHeroWeather(null);
      });
    return () => { mounted = false; };
  }, []);

  const handleRoleChange = async (role: 'farmer' | 'expert' | 'admin') => {
    const user = LocalDB.getCurrentUser();
    if (!user) return;
    if (user.role !== 'admin' && role !== user.role) {
      return;
    }

    const sig = await LocalDB.fetchAndStoreRoleSignature(user.id, role);
    if (sig) {
      setActiveRole(role);
      LocalDB.setActiveRole(role);
    } else {
      console.error("Signature rejected. Authorization failed.");
    }
  };

  const handleAuthChange = () => {
    setAuthVersion(prev => prev + 1);
  };

  const farmerTabsList = [
    { id: 'overview', icon: '📊', label: 'Monitor overview' },
    { id: 'farms-crops', icon: '🏞️', label: 'My Plots & Timeline' },
    { id: 'ai-engine', icon: '🔮', label: 'AI Diagnostic Core' },
    { id: 'analytics', icon: '📈', label: 'Interactive Telemetry' },
    { id: 'marketplace', icon: '🌾', label: 'P2P trading hub' },
    { id: 'community', icon: '🎓', label: 'Agronomy Forums' },
    { id: 'schemes', icon: '🇮🇳', label: 'Subsidies & Relief' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050705] selection:bg-lime-500/20 selection:text-lime-400 text-[#E0E2E0] relative overflow-hidden">

      {/* Platform Branding & Role switching header */}
      <Header
        activeRole={activeRole}
        onChangeRole={handleRoleChange}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onAuthChange={handleAuthChange}
        authReqTab={authReqTab}
        setAuthReqTab={setAuthReqTab}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${!isLoggedIn ? "" : "mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8"}`}>

        {!isLoggedIn ? (
          /* 
            ========================================================================
            PREMIUM AI SAAS LANDING PAGE (Inspired by Linear, Vercel, Stripe, Apple)
            ========================================================================
          */
          <div className="relative w-full space-y-24 pt-8 pb-16">

            {/* Background Ambient Glow Spheres & Grid Pattern */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-lime-500/15 via-emerald-500/10 to-transparent blur-3xl rounded-full opacity-70"></div>
              <div className="absolute top-40 -left-40 w-96 h-96 bg-lime-500/10 blur-3xl rounded-full"></div>
              <div className="absolute top-60 -right-40 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full"></div>
              <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
            </div>

            {/* 1. HERO SECTION */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-8">

                {/* Floating Animated Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-4 py-1.5 text-xs font-semibold text-lime-300 backdrop-blur-xl shadow-lg shadow-lime-500/10 animate-float">
                  <Sparkles className="h-4 w-4 text-lime-400 animate-spin-slow" />
                  <span>Next-Gen Agritech OS • Powered by Gemini 3.5 Flash</span>
                  <ChevronRight className="h-3.5 w-3.5 text-lime-400/70" />
                </div>

                {/* Main Hero Headline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                    The Intelligence Operating System for <span className="text-gradient-lime">Precision Agriculture.</span>
                  </h1>
                  <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/60 leading-relaxed font-medium">
                    FarmOS AI merges neural leaf pathology diagnostics, satellite weather telemetry, split N-P-K nutrient schedules, and P2P trade into a unified SaaS experience.
                  </p>
                </div>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    id="landing-register-btn"
                    onClick={() => setAuthReqTab('register')}
                    className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 px-8 py-4 text-sm font-extrabold text-black hover:brightness-110 transition duration-300 shadow-xl shadow-lime-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Launch Agronomy Engine</span>
                    <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    id="landing-login-btn"
                    onClick={() => setAuthReqTab('login')}
                    className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-bold text-white hover:bg-white/10 backdrop-blur-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="h-4 w-4 text-lime-400" />
                    <span>Sign In to Workspace</span>
                  </button>
                </div>

              </div>

              {/* 2. HERO SAAS DASHBOARD MOCKUP PREVIEW */}
              <div className="mt-16 max-w-5xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-emerald-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative rounded-3xl border border-white/15 bg-[#0A0E0A]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl text-left overflow-hidden">

                  {/* Mockup Window Controls */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
                      <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                      <span className="ml-2 font-mono text-xs text-white/40">farmos-ai.agri // Telemetry Station Karnal-APMC-04</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 px-2.5 py-1 text-[10px] font-mono font-bold text-lime-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-ping"></span>
                        LIVE NEURAL FEED
                      </span>
                    </div>
                  </div>

                  {/* Mockup Layout Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Card 1: Health score */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Chlorophyll Index</span>
                        <Activity className="h-4 w-4 text-lime-400" />
                      </div>
                      <div className="py-2">
                        <p className="text-sm font-semibold text-white/70">No sensor data available</p>
                        <p className="text-[11px] text-white/40 mt-1">Connect IoT sensor or register farm plot to monitor health</p>
                      </div>
                    </div>

                    {/* Card 2: Neural Vision Diagnosis */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Vision Diagnostic</span>
                        <Cpu className="h-4 w-4 text-lime-400" />
                      </div>
                      <div className="py-2">
                        <p className="text-sm font-semibold text-white/70">No image analysis recorded</p>
                        <p className="text-[11px] text-white/40 mt-1">Upload leaf photo in AI Engine to run vision diagnostic</p>
                      </div>
                    </div>

                    {/* Card 3: Weather & Rainfall */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Satellite Precipitation</span>
                        <CloudSun className="h-4 w-4 text-amber-400" />
                      </div>
                      {heroWeather ? (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono text-3xl font-black text-white">{heroWeather.temp}</span>
                            <span className="text-xs font-bold text-amber-400">{heroWeather.condition}</span>
                          </div>
                          <p className="text-[11px] text-lime-400 font-mono">Live satellite weather synced</p>
                        </div>
                      ) : (
                        <div className="py-2">
                          <p className="text-sm font-semibold text-white/70">No weather data available</p>
                          <p className="text-[11px] text-white/40 mt-1">Satellite station offline or unreachable</p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>

            </section>

            {/* 3. KEY METRICS & STATISTICS BANNER */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

                  <div className="space-y-1">
                    <p className="font-mono text-3xl sm:text-4xl font-black text-white text-gradient-lime">99.4%</p>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">AI Diagnostic Precision</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-mono text-3xl sm:text-4xl font-black text-white text-gradient-white">50,000+</p>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Acres Monitored</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-mono text-3xl sm:text-4xl font-black text-white text-gradient-lime">120+</p>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">APMC Stations Linked</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-mono text-3xl sm:text-4xl font-black text-white text-gradient-white">&lt; 400ms</p>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Neural Latency</p>
                  </div>

                </div>
              </div>
            </section>

            {/* 4. FEATURE HIGHLIGHT BENTO GRID */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Engineered for <span className="text-gradient-lime">Modern Cultivators.</span>
                </h2>
                <p className="text-sm text-white/60 leading-relaxed font-medium">
                  A multi-layered intelligence platform providing end-to-end coverage from sowing to market sale.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Feature 1 */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="h-12 w-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">AI Vision Pathology</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Instantly identify leaf diseases, pest infections, and nutrient deficiencies using high-precision neural computer vision models.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-lime-400">
                    <span>Explore Diagnostics</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="h-12 w-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Crop Lifecycle Timeline</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Map plot schedules, track sowing dates, receive rain vectors, and automate drip irrigation triggers across land holdings.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-lime-400">
                    <span>View Plot Scheduler</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="h-12 w-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">P2P Agricultural Trade</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    List produce directly for regional buyers and rent heavy equipment like tractors or harvesters without intermediaries.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-lime-400">
                    <span>Browse Marketplace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="h-12 w-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Government Schemes Engine</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Auto-check eligibility for PM-KISAN income support, PMFBY crop insurance, and state irrigation subsidies in real time.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-lime-400">
                    <span>Check Subsidies</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Feature 5 */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="h-12 w-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Agronomist Consultation</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Connect directly with certified agronomy consultants to receive digital prescriptions for severe crop breakouts.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-lime-400">
                    <span>Connect Advisors</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Feature 6 */}
                <div className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 relative overflow-hidden">
                  <div className="h-12 w-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                    <Bot className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">24/7 AI Voice & Text Advisor</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Ask questions in English, Hindi (हिन्दी), or Hinglish regarding fertilizer ratios, weather warnings, or soil preparation.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-lime-400">
                    <span>Try Floating Assistant</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

              </div>

            </section>

            {/* 5. HOW IT WORKS / PROCESS TIMELINE */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-lime-400">Simple 3-Step Process</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">How FarmOS AI Powers Your Yield</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

                {/* Step 1 */}
                <div className="glass-card rounded-3xl p-6 space-y-4 relative">
                  <div className="font-mono text-4xl font-black text-lime-400/40">01</div>
                  <h3 className="text-lg font-bold text-white">Register Land & Soil Profile</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Input your district coordinates, farm acreage, soil classification (Clay, Sandy, Loamy), and irrigation source.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="glass-card rounded-3xl p-6 space-y-4 relative">
                  <div className="font-mono text-4xl font-black text-lime-400/40">02</div>
                  <h3 className="text-lg font-bold text-white">Run AI Diagnostics & Satellite Sync</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Upload leaf photos for instant pathology scan or query the AI agronomist for split N-P-K fertilizer schedules.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="glass-card rounded-3xl p-6 space-y-4 relative">
                  <div className="font-mono text-4xl font-black text-lime-400/40">03</div>
                  <h3 className="text-lg font-bold text-white">Optimize Yield & Trade Produce</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Track activity reminders, monitor financial expenses, and list harvested crops directly on the P2P marketplace.
                  </p>
                </div>

              </div>

            </section>

            {/* 6. TESTIMONIALS SECTION */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-lime-400">Trusted By Cultivators</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">What Farmers Say</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-medium italic">
                    &ldquo;The leaf disease scanner identified Yellow Rust in my wheat within 5 seconds. Following the split urea dose saved my harvest.&rdquo;
                  </p>
                  <div>
                    <p className="text-xs font-bold text-white">Rajesh Kumar</p>
                    <p className="text-[10px] text-white/40">Wheat Cultivator • Karnal, Haryana</p>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-medium italic">
                    &ldquo;Managing 12 acres used to mean scattered paper logs. FarmOS AI centralized our sowing dates, equipment rentals, and APMC prices.&rdquo;
                  </p>
                  <div>
                    <p className="text-xs font-bold text-white">Gurpreet Singh</p>
                    <p className="text-[10px] text-white/40">Paddy Grower • Ludhiana, Punjab</p>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-medium italic">
                    &ldquo;As an agronomy consultant, the expert workspace allows me to review leaf reports from 50+ farmers daily and issue verified digital prescriptions.&rdquo;
                  </p>
                  <div>
                    <p className="text-xs font-bold text-white">Dr. Amit Sharma</p>
                    <p className="text-[10px] text-white/40">Certified Pathologist • New Delhi</p>
                  </div>
                </div>

              </div>

            </section>

            {/* 7. HIGH-IMPACT CALL TO ACTION BANNER */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl border border-lime-500/30 bg-gradient-to-r from-[#0C120C] via-[#0F180F] to-[#0C120C] p-8 sm:p-12 text-center overflow-hidden glow-lime-lg">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-lime-500/15 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    Ready to Transform Your Crop Yield with AI?
                  </h2>
                  <p className="text-sm text-white/60 leading-relaxed font-medium">
                    Create your cultivator account today to access full satellite telemetry, AI leaf vision diagnostics, and regional P2P trading.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setAuthReqTab('register')}
                      className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-8 py-4 text-xs font-extrabold text-black hover:brightness-110 transition shadow-xl shadow-lime-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create Free Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setAuthReqTab('login')}
                      className="w-full sm:w-auto rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-xs font-bold text-white hover:bg-white/10 transition cursor-pointer"
                    >
                      Sign In Existing User
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        ) : (
          <>
            {/* Farmer view layouts */}
            {activeRole === 'farmer' && isLoggedIn && (currentUser?.role === 'farmer' || currentUser?.role === 'admin') && (
              <div className="space-y-6">

                {/* Farmers internal tab buttons list */}
                <div className="overflow-x-auto pb-1">
                  <div className="flex gap-2 min-w-max">
                    {farmerTabsList.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveFarmerTab(t.id as any)}
                        className={`rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 flex items-center gap-2 border ${activeFarmerTab === t.id
                            ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black border-lime-400 shadow-lg shadow-lime-500/15 font-bold'
                            : 'bg-[#0A0D0A] text-white/60 hover:text-white border-white/10 hover:bg-white/5'
                          }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Farmer Tab Render Router switch */}
                <div className="transition-all duration-300 ease-in-out">
                  {activeFarmerTab === 'overview' && (
                    <DashboardTab onSwitchTab={(tab) => setActiveFarmerTab(tab as any)} />
                  )}
                  {activeFarmerTab === 'farms-crops' && <FarmsCropsTab />}
                  {activeFarmerTab === 'ai-engine' && <AIEngineTab />}
                  {activeFarmerTab === 'analytics' && <AnalyticsTab />}
                  {activeFarmerTab === 'marketplace' && <MarketplaceTab />}
                  {activeFarmerTab === 'community' && <CommunityTab />}
                  {activeFarmerTab === 'schemes' && <SchemesTab />}
                </div>

              </div>
            )}

            {activeRole === 'farmer' && isLoggedIn && (currentUser?.role !== 'farmer' && currentUser?.role !== 'admin') && (
              <div className="rounded-3xl border border-lime-500/10 bg-[#0C100C] p-8 text-center max-w-lg mx-auto my-12 space-y-4">
                <span className="text-4xl">🛑</span>
                <h3 className="text-xl font-bold text-lime-400">Access Denied</h3>
                <p className="text-sm text-white/50 leading-relaxed font-semibold">
                  You are not authorized to view this Farmer workspace. This area is restricted to registered cultivators.
                </p>
              </div>
            )}

            {/* Clinical agronomy Expert view */}
            {activeRole === 'expert' && isLoggedIn && (currentUser?.role === 'expert' || currentUser?.role === 'admin') && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#0C100C] border border-white/10 p-6 text-white shadow-xl ring-1 ring-lime-500/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#A3E635]">
                    Active Medical credentials verified
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight">Foliage clinical advisor workspace 🎓</h2>
                  <p className="mt-1 text-xs text-white/50 font-medium max-w-lg leading-relaxed">
                    Welcome, {currentUser?.name || 'Expert'}. Admissions for local pest breakout reviews are active. Submit prescriptions and organic split doses to farmers.
                  </p>
                </div>

                <ExpertTab />
              </div>
            )}

            {activeRole === 'expert' && isLoggedIn && (currentUser?.role !== 'expert' && currentUser?.role !== 'admin') && (
              <div className="rounded-3xl border border-rose-500/10 bg-[#0C100C] p-8 text-center max-w-lg mx-auto my-12 space-y-4">
                <span className="text-4xl">🛑</span>
                <h3 className="text-xl font-bold text-rose-400">Access Denied</h3>
                <p className="text-sm text-white/50 leading-relaxed font-semibold">
                  You are not authorized to view this Expert workspace. Only verified clinical agronomy and pathology advisors have search authorization.
                </p>
              </div>
            )}

            {/* Administrator metrics configuration views */}
            {activeRole === 'admin' && isLoggedIn && currentUser?.role === 'admin' && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#0C100C] border border-white/10 p-6 text-white shadow-xl ring-1 ring-amber-500/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                    Administrative security override
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">Control center alignment panel ⚙️</h2>
                  <p className="mt-1 text-xs text-white/50 font-medium max-w-lg leading-relaxed">
                    Active Session: {currentUser?.name || 'Administrator'}. Tweak APMC price registers, modify database records length, and align ground station telemetry.
                  </p>
                </div>

                <AdminTab />
              </div>
            )}

            {activeRole === 'admin' && isLoggedIn && currentUser?.role !== 'admin' && (
              <div className="rounded-3xl border border-amber-500/10 bg-[#0C100C] p-8 text-center max-w-lg mx-auto my-12 space-y-4">
                <span className="text-4xl">🛑</span>
                <h3 className="text-xl font-bold text-amber-500">Access Denied</h3>
                <p className="text-sm text-white/50 leading-relaxed font-semibold">
                  You are not authorized to view this Administrative console. Standard registered accounts are restricted from altering structural registers or telemetry configs.
                </p>
              </div>
            )}
          </>
        )}

      </main>

      {/* Universal Footer — always sits naturally at bottom of page */}
      <footer className="mt-auto w-full border-t border-white/10 pt-10 pb-8 bg-[#050705]/90 backdrop-blur-xl relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-500 text-black font-extrabold shadow-md">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <span className="font-sans text-base font-black tracking-tight text-white">
                  Farm<span className="text-lime-400">OS AI</span>
                </span>
                <p className="text-[10px] text-white/40 font-medium">Next-Gen Agritech Platform</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 font-medium">
              {!isLoggedIn && (
                <>
                  <button onClick={() => setAuthReqTab('login')} className="hover:text-white transition cursor-pointer">Sign In</button>
                  <button onClick={() => setAuthReqTab('register')} className="hover:text-white transition cursor-pointer">Register</button>
                </>
              )}
              <span className="inline-flex items-center gap-1.5 text-lime-400 font-mono text-[10px] bg-lime-500/10 px-2.5 py-1 rounded-full border border-lime-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse"></span>
                System Operational
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 text-center text-[11px] text-white/40">
            &copy; {new Date().getFullYear()} FarmOS AI. Smart Farming Operating System. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* Persistent floating AI agricultural support assistant */}
      <FloatingChat />

    </div>
  );
}
