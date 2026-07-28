'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LocalDB, Farm, Crop, Activity, Expense, DiseaseReport, User } from '@/lib/db-store';
import { 
  Landmark, 
  Sprout, 
  ShieldAlert, 
  CloudSun, 
  IndianRupee, 
  ListChecks, 
  ArrowUpRight, 
  Cpu, 
  AlertTriangle,
  Sparkles,
  Zap,
  PlusCircle,
  ShoppingBag,
  Bot,
  CheckCircle2,
  ChevronRight,
  Thermometer,
  Wind
} from 'lucide-react';

interface DashboardTabProps {
  onSwitchTab?: (tab: string) => void;
}

export default function DashboardTab({ onSwitchTab }: DashboardTabProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => LocalDB.getCurrentUser());
  const [farms, setFarms] = useState<Farm[]>(() => LocalDB.getFarms());
  const [crops, setCrops] = useState<Crop[]>(() => LocalDB.getCrops());
  const [activities, setActivities] = useState<Activity[]>(() => LocalDB.getActivities());
  const [expenses, setExpenses] = useState<Expense[]>(() => LocalDB.getExpenses());
  const [reports, setReports] = useState<DiseaseReport[]>(() => LocalDB.getDiseases());

  useEffect(() => {
    setCurrentUser(LocalDB.getCurrentUser());
    setFarms(LocalDB.getFarms());
    setCrops(LocalDB.getCrops());
    setActivities(LocalDB.getActivities());
    setExpenses(LocalDB.getExpenses());
    setReports(LocalDB.getDiseases());
  }, []);

  const totalArea = farms.reduce((acc, f) => acc + f.area, 0);
  const totalCost = expenses.reduce((acc, e) => acc + e.amount, 0);
  const activeCrops = crops.filter(c => c.status === 'growing' || c.status === 'harvesting');
  const pendingTasks = activities.filter(a => !a.isCompleted);
  const unsolvedDiseases = reports.filter(r => r.status === 'detected');

  // Real weather state fetched via Open-Meteo API
  const [weatherData, setWeatherData] = useState<{
    temp: string;
    wind: string;
    condition: string;
    station: string;
    alert: string | null;
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRealWeather = async (lat: number, lon: number, stationName: string) => {
      try {
        setWeatherLoading(true);
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (!res.ok) throw new Error("Weather service offline");
        const data = await res.json();
        
        if (data && data.current_weather && isMounted) {
          const w = data.current_weather;
          const code = w.weathercode;
          let cond = "Clear Sky";
          if (code > 0 && code <= 3) cond = "Partly Cloudy";
          else if (code >= 45 && code <= 48) cond = "Foggy";
          else if (code >= 51 && code <= 67) cond = "Light Rain";
          else if (code >= 80) cond = "Rain Showers";

          setWeatherData({
            temp: `${Math.round(w.temperature)}°C`,
            wind: `${w.windspeed} km/h`,
            condition: cond,
            station: stationName,
            alert: w.temperature > 35 ? "High Evaporative Heat Alert: Schedule early sprinkler irrigation." : null
          });
        }
      } catch (err) {
        if (isMounted) setWeatherData(null);
      } finally {
        if (isMounted) setWeatherLoading(false);
      }
    };

    const userDistrict = currentUser?.district?.toLowerCase() || '';
    let lat = 29.6857; // Default Karnal
    let lon = 76.9905;

    if (userDistrict.includes('delhi')) { lat = 28.6139; lon = 77.2090; }
    else if (userDistrict.includes('ludhiana') || userDistrict.includes('punjab')) { lat = 30.9010; lon = 75.8573; }

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchRealWeather(pos.coords.latitude, pos.coords.longitude, "Local Field Station"),
        () => fetchRealWeather(lat, lon, `${currentUser?.district || 'Karnal'} Regional Station`)
      );
    } else {
      fetchRealWeather(lat, lon, `${currentUser?.district || 'Karnal'} Regional Station`);
    }

    return () => { isMounted = false; };
  }, [currentUser]);

  // Calculate real crop health score if farms exist
  const healthScore = farms.length > 0 
    ? Math.max(50, 100 - (unsolvedDiseases.length * 15)) 
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-[#E0E2E0] pb-12">
      
      {/* 1. UNTOUCHED HERO SECTION (Requirement: Leave Hero untouched) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0C120C] via-[#0E160E] to-[#0A0D0A] p-6 sm:p-8 text-white shadow-2xl backdrop-blur-2xl glow-lime-lg"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime-500/15 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-[11px] font-bold text-lime-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse"></span>
              <span>Agronomy Feed Active</span>
              <span className="text-white/30">•</span>
              <span>{weatherData?.station || 'Local Field Station'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Pranam, <span className="text-gradient-lime">{currentUser?.name || 'Cultivator'}</span>! 👋
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm text-white/60 font-medium leading-relaxed">
              Precision satellite coordinates verified for {currentUser?.district || 'Karnal'}, {currentUser?.state || 'Haryana'}. 
              Your active crop holdings and telemetry metrics are synced below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onSwitchTab?.('ai-engine')}
              className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-5 py-3 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Run AI Pathology Scan</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* MONITOR OVERVIEW CARDS WITH COLOR-CODED ACCENT GLOWS (ZERO FLASH) */}
      {/* ========================================================================= */}

      {/* 2. STATISTIC CARDS GRID WITH MATCHING ACCENT GLOWS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Stat 1: Acreage Managed -> FarmOS Lime Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="glass-card card-glow-lime rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/50">Acreage Managed</span>
            <div className="h-11 w-11 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400 group-hover:scale-110 group-hover:bg-lime-500/20 transition shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {farms.length > 0 ? `${totalArea} Acres` : '0.0 Acres'}
            </h3>
            <p className="text-[11px] font-medium text-white/40 flex items-center gap-1">
              {farms.length > 0 ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400"></span>
                  <span>{farms.length} plot location{farms.length > 1 ? 's' : ''} active</span>
                </>
              ) : (
                <span>No registered farm holdings</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Stat 2: Sown Crop Varieties -> Emerald Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="glass-card card-glow-emerald rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/50">Sown Crop Varieties</span>
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition shadow-sm">
              <Sprout className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {crops.length > 0 ? `${activeCrops.length} Active` : '0 Active'}
            </h3>
            <p className="text-[11px] font-medium text-white/40 flex items-center gap-1">
              {crops.length > 0 ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>{crops.filter(c => c.status === 'completed').length} harvested cycles</span>
                </>
              ) : (
                <span>No active crop schedules logged</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Stat 3: Season Expenses -> Amber/Gold Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="glass-card card-glow-amber rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/50">Season Expenses</span>
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition shadow-sm">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {expenses.length > 0 ? `₹${totalCost.toLocaleString('en-IN')}` : '₹0'}
            </h3>
            <p className="text-[11px] font-medium text-white/40 flex items-center gap-1">
              {expenses.length > 0 ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  <span>{expenses.length} input transactions</span>
                </>
              ) : (
                <span>No expenses recorded</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Stat 4: Active Pathology Alerts -> Red/Rose Alert Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          whileHover={{ y: -5, scale: 1.015, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="glass-card card-glow-rose rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/50">Active Pathology Alerts</span>
            <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {reports.length > 0 ? `${unsolvedDiseases.length} Alerts` : '0 Alerts'}
            </h3>
            <p className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
              {reports.length > 0 ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>{reports.filter(r => r.status === 'reviewed').length} expert verified</span>
                </>
              ) : (
                <span className="text-emerald-400">Crop foliage healthy</span>
              )}
            </p>
          </div>
        </motion.div>

      </div>

      {/* 3. MAIN TELEMETRY SPLIT: WEATHER (Sky Blue Glow) & CROP HEALTH (Lime Glow) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Weather Intelligence Panel -> Blue Sky Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ y: -5, scale: 1.005, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="lg:col-span-8 glass-card card-glow-sky rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                Satellite Weather Telemetry
              </div>
              <h2 className="mt-2 text-xl font-black text-white tracking-tight">
                {weatherData ? weatherData.station : 'Local Field Weather Station'}
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
              <CloudSun className="h-10 w-10 text-amber-400 animate-spin-slow" />
              <div className="text-right">
                {weatherLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs text-white/50 font-mono">Fetching telemetry...</span>
                  </div>
                ) : weatherData ? (
                  <>
                    <span className="text-3xl font-black font-mono text-sky-400">{weatherData.temp}</span>
                    <p className="text-[11px] text-white/50 font-medium">{weatherData.condition}</p>
                  </>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-white/50 block">Weather service offline</span>
                    <span className="text-[10px] text-white/30 block">Connect weather feed for live updates</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 text-center">
            <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5 space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40 flex items-center justify-center gap-1">
                <Thermometer className="h-3 w-3 text-amber-400" />
                Air Temperature
              </p>
              <p className="text-base font-bold font-mono text-white">
                {weatherData ? weatherData.temp : '-- °C'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5 space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40 flex items-center justify-center gap-1">
                <Wind className="h-3 w-3 text-sky-400" />
                Wind Velocity
              </p>
              <p className="text-base font-bold font-mono text-white">
                {weatherData ? weatherData.wind : '-- km/h'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40 flex items-center justify-center gap-1">
                <CloudSun className="h-3 w-3 text-lime-400" />
                Sky Condition
              </p>
              <p className="text-base font-bold font-mono text-white">
                {weatherData ? weatherData.condition : 'Standard'}
              </p>
            </div>
          </div>

          {weatherData?.alert ? (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-200">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-amber-300">Agronomist Recommendation:</span> {weatherData.alert}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-lime-500/5 border border-lime-500/15 p-3.5 text-xs text-lime-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-lime-400 shrink-0" />
              <span>Optimal micro-climate conditions detected for ongoing field operations.</span>
            </div>
          )}
        </motion.div>

        {/* Circular Crop Health & Chlorophyll Index Gauge Card -> FarmOS Lime Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="lg:col-span-4 glass-card card-glow-lime rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Crop Health & Chlorophyll Index</h2>
            <p className="text-[11px] font-medium text-white/40 mt-1 leading-relaxed">
              Consolidated health score calculated from active farm holdings and leaf scans.
            </p>
          </div>
          
          <div className="my-6 flex items-center justify-center">
            {healthScore !== null ? (
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-white/5"
                    strokeWidth="10"
                    fill="none"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-lime-400"
                    strokeWidth="10"
                    strokeDasharray="377"
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 - (377 * healthScore) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-black text-white">{healthScore}%</span>
                  <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest mt-0.5">
                    {healthScore >= 80 ? 'Optimal' : 'Needs Care'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                  <Cpu className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-white/60">No farm plot registered</p>
                <p className="text-[10px] text-white/30 max-w-[200px] mx-auto">
                  Add a plot in Plot Manager to compute real chlorophyll health metrics.
                </p>
              </div>
            )}
          </div>

          <div className="text-center border-t border-white/10 pt-4">
            <p className="text-xs font-bold text-white/80">
              {healthScore !== null ? 'Satellite Telemetry Active' : 'Telemetry Standby'}
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {healthScore !== null ? `${unsolvedDiseases.length} active pathology cases pending review` : 'Register plot to connect live sensors'}
            </p>
          </div>
        </motion.div>

      </div>

      {/* 4. QUICK AGRONOMY ACTIONS HUB WITH ACCENT GLOWS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-lime-400" />
            <span>Quick Agronomy Actions</span>
          </h2>
          <span className="text-[10px] font-mono text-white/40">4 Core Workflows</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1: AI Pathology -> Purple Glow */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.28, ease: 'easeOut' } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSwitchTab?.('ai-engine')}
            className="glass-card card-glow-purple rounded-3xl p-6 text-left border border-white/10 space-y-4 cursor-pointer group shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition shadow-sm">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition flex items-center justify-between">
                <span>AI Leaf Pathology</span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Upload leaf photo to diagnose fungal infection & get split fertilizer doses.
              </p>
            </div>
          </motion.button>

          {/* Action 2: Plot Manager -> Emerald Glow */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.28, ease: 'easeOut' } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSwitchTab?.('farms-crops')}
            className="glass-card card-glow-emerald rounded-3xl p-6 text-left border border-white/10 space-y-4 cursor-pointer group shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition shadow-sm">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition flex items-center justify-between">
                <span>Plot & Crop Manager</span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Register land holdings, sowing dates, soil types, and irrigation sources.
              </p>
            </div>
          </motion.button>

          {/* Action 3: P2P Marketplace -> Amber Glow */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.28, ease: 'easeOut' } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSwitchTab?.('marketplace')}
            className="glass-card card-glow-amber rounded-3xl p-6 text-left border border-white/10 space-y-4 cursor-pointer group shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition shadow-sm">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition flex items-center justify-between">
                <span>P2P Marketplace</span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Trade harvested crops & rent harvesters directly with local farmers.
              </p>
            </div>
          </motion.button>

          {/* Action 4: Agronomy Forums -> Sky Blue Glow */}
          <motion.button
            whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.28, ease: 'easeOut' } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSwitchTab?.('community')}
            className="glass-card card-glow-sky rounded-3xl p-6 text-left border border-white/10 space-y-4 cursor-pointer group shadow-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/20 transition shadow-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition flex items-center justify-between">
                <span>Agronomy Forums</span>
                <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                Consult certified university agronomists & discuss pest control strategies.
              </p>
            </div>
          </motion.button>

        </div>
      </div>

      {/* 5. SPLIT SECTION: SOWING TASKS & VISION PATHOLOGY SCANS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* Sowing Checklist & Activities -> Lime Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ y: -4, scale: 1.005, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="glass-card card-glow-lime rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-lime-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Sowing Checklist & Activities</h3>
              </div>
              <button
                onClick={() => onSwitchTab?.('farms-crops')}
                className="flex items-center gap-1 text-xs font-bold text-lime-400 hover:underline cursor-pointer"
              >
                <span>View Timeline</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-white/5">
              {pendingTasks.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="rounded-lg bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-400 uppercase mt-0.5">
                      {act.type}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{act.title}</p>
                      <p className="text-[10px] text-white/40 font-medium">Scheduled Date: {act.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-white/90">₹{act.cost}</span>
                </div>
              ))}

              {pendingTasks.length === 0 && (
                <div className="text-center py-10 space-y-2">
                  <div className="h-12 w-12 rounded-full bg-lime-500/10 border border-lime-500/20 flex items-center justify-center mx-auto text-lime-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-white/70">No pending sowing activities</p>
                  <p className="text-[10px] text-white/30 max-w-[220px] mx-auto">
                    All field tasks are completed. Click Plot & Crop Manager to schedule new activities.
                  </p>
                </div>
              )}
            </div>
          </div>

          {pendingTasks.length > 0 && (
            <div className="border-t border-white/10 pt-4 text-center">
              <span className="text-[11px] text-white/40 font-medium">
                Showing {Math.min(4, pendingTasks.length)} of {pendingTasks.length} pending crop tasks
              </span>
            </div>
          )}
        </motion.div>

        {/* Vision Pathology Scans -> Red Alert Glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          whileHover={{ y: -4, scale: 1.005, transition: { duration: 0.28, ease: 'easeOut' } }}
          className="glass-card card-glow-rose rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Vision Pathology Scans</h3>
              </div>
              <button
                onClick={() => onSwitchTab?.('ai-engine')}
                className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:underline cursor-pointer"
              >
                <span>Scan Leaf</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {reports.length > 0 ? (
                reports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-white">{rep.diseaseName}</p>
                        <p className="text-[10px] text-white/50 font-medium">{rep.cropName} • Severity: {rep.severityLevel}</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-lime-400 bg-lime-500/10 px-2.5 py-0.5 rounded-full border border-lime-500/20">
                        {(rep.confidenceScore * 100).toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2">
                  <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-white/70">No leaf pathology scans recorded</p>
                  <p className="text-[10px] text-white/30 max-w-[220px] mx-auto">
                    Take or upload a leaf photo in AI Diagnostic Core to inspect for fungal diseases.
                  </p>
                </div>
              )}
            </div>
          </div>

          {reports.length > 0 && (
            <div className="border-t border-white/10 pt-4 text-center">
              <span className="text-[11px] text-white/40 font-medium">
                Showing {Math.min(3, reports.length)} of {reports.length} recorded disease reports
              </span>
            </div>
          )}
        </motion.div>

      </div>

    </div>
  );
}
