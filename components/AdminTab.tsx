'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB, User, Farm, Crop, DiseaseReport } from '@/lib/db-store';
import { ShieldCheck, Users, BarChart3, Database, KeyRound, Radio, Sparkles, Activity, Tag, Check } from 'lucide-react';

export default function AdminTab() {
  const [users] = useState<User[]>(() => LocalDB.getUsers());
  const [farms] = useState<Farm[]>(() => LocalDB.getFarms());
  const [crops] = useState<Crop[]>(() => LocalDB.getCrops());
  const [reports] = useState<DiseaseReport[]>(() => LocalDB.getDiseases());

  const [sensorStatus, setSensorStatus] = useState<'online' | 'standby' | 'error'>('online');
  const [paddyPriceIndex, setPaddyPriceIndex] = useState(42);
  const [successMsg, setSuccessMsg] = useState('');

  const handleTweakPrice = () => {
    const list = LocalDB.getMarketplace();
    const paddyIdx = list.findIndex(x => x.cropName === 'Paddy');
    if (paddyIdx > -1) {
      list[paddyIdx].pricePerKg = paddyPriceIndex;
      LocalDB.setMarketplace(list);
      setSuccessMsg(`Global APMC Paddy Price index tweaked to ₹${paddyPriceIndex}/kg successfully! Check the Crop Marketplace.`);
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    }
  };

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. HEADER BAR */}
      <div className="border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider">
          <ShieldCheck className="h-3 w-3" />
          Enterprise Admin Portal
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
          System Administration & APMC Controls
        </h1>
      </div>

      {/* 2. OVERVIEW STATS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-emerald rounded-3xl border border-white/10 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Total Accounts</p>
              <h3 className="mt-1 text-2xl font-black text-white">{users.length} Active</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080B08] text-emerald-400 border border-white/10 shadow-inner">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-sky rounded-3xl border border-white/10 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Listed Plot Vectors</p>
              <h3 className="mt-1 text-2xl font-black text-white">{farms.length} Vectors</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080B08] text-sky-400 border border-white/10 shadow-inner">
              <Database className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-lime rounded-3xl border border-white/10 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Sown Crop Cycles</p>
              <h3 className="mt-1 text-2xl font-black text-white">{crops.length} Tracked</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080B08] text-lime-400 border border-white/10 shadow-inner">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-amber rounded-3xl border border-white/10 p-5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">Clinic Scan Audits</p>
              <h3 className="mt-1 text-2xl font-black text-white">{reports.length} Reports</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080B08] text-amber-400 border border-white/10 shadow-inner">
              <Radio className="h-6 w-6" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* 3. ADMIN OPERATIONS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* APMC Index Control */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card card-glow-lime rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl"
        >
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Tag className="h-4.5 w-4.5 text-lime-400" />
              <span>APMC Price Index Control</span>
            </h3>
            <p className="text-xs font-medium text-white/50 mt-0.5">
              Adjust base APMC price metrics in real-time to simulate demand/supply shifts.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Paddy (Basmati) Price per KG (₹ INR)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  value={paddyPriceIndex}
                  onChange={(e) => setPaddyPriceIndex(parseInt(e.target.value) || 0)}
                  className="rounded-2xl border border-white/10 bg-[#080B08] px-4 py-2.5 text-xs font-mono font-bold text-lime-400 focus:border-lime-500/50 focus:outline-none appearance-none text-center w-full sm:w-32"
                />
                <button
                  type="button"
                  onClick={handleTweakPrice}
                  className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-5 py-2.5 font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer flex-1"
                >
                  Adjust Paddy Price Index
                </button>
              </div>

              {successMsg && (
                <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-3.5 text-xs text-lime-400 font-bold mt-3 animate-in fade-in duration-300 flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Satellite Sensor Alignment */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card card-glow-emerald rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl"
        >
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-emerald-400" />
              <span>INSAT Agronomic Sensor Alignment</span>
            </h3>
            <p className="text-xs font-medium text-white/50 mt-0.5">
              Monitor moisture, thermal, and nitrogen metrics from orbiting INSAT satellites.
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold text-white/70">
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-3 border border-white/5">
              <span>Channel Vector INSAT-3DR</span>
              <span className="text-lime-400 font-mono font-bold">📡 98.4% Aligned</span>
            </div>
            
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.02] p-3 border border-white/5">
              <span>Ground Water Telemetry Relay</span>
              <span className="text-lime-400 font-mono font-bold">📡 Online / Synced</span>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <span className="text-white/60">Soil Sensor Relay Node Status</span>
              <div className="flex gap-1 bg-[#080B08] p-1 rounded-2xl border border-white/10">
                {['online', 'standby', 'error'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSensorStatus(st as any)}
                    className={`rounded-xl px-3 py-1 text-[10px] font-mono font-extrabold uppercase transition cursor-pointer ${
                      sensorStatus === st
                        ? st === 'online'
                          ? 'bg-lime-400 text-black shadow-md'
                          : st === 'standby'
                            ? 'bg-amber-400 text-black shadow-md'
                            : 'bg-rose-500 text-white shadow-md'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
