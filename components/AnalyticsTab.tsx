'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Coins, 
  Droplets, 
  TestTube, 
  MapPin, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Search,
  Activity,
  Layers,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Percent,
  Sprout
} from 'lucide-react';

interface CustomOption {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: CustomOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

function CustomSelect({ options, value, onChange, placeholder = 'Select option...', className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 240);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full rounded-2xl border border-white/10 bg-[#080B08]/90 px-4 py-2.5 text-xs text-white flex items-center justify-between hover:border-lime-500/50 transition shadow-sm focus:outline-none focus:ring-1 focus:ring-lime-400/50 cursor-pointer"
      >
        <span className="truncate font-semibold text-white/90">
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              <span>{selectedOption.label}</span>
            </span>
          ) : (
            <span className="text-white/30">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-lime-400' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute left-0 right-0 ${
              openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
            } z-[9999] rounded-2xl border border-white/20 bg-[#0E140E]/98 backdrop-blur-2xl shadow-2xl p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar ring-1 ring-lime-400/30`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  value === option.value
                    ? 'bg-lime-500/15 text-lime-300 font-bold border border-lime-500/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                </span>
                {value === option.value && <Check className="h-3.5 w-3.5 text-lime-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyticsTab() {
  const [selectedCrop, setSelectedCrop] = useState('overall');

  // Custom high precision data arrays for SVGs
  const yieldHistory = [
    { year: '2022', yieldVal: 12400, xCurv: 40, yCurv: 180 },
    { year: '2023', yieldVal: 14500, xCurv: 120, yCurv: 155 },
    { year: '2024', yieldVal: 16100, xCurv: 200, yCurv: 130 },
    { year: '2025', yieldVal: 15900, xCurv: 280, yCurv: 135 },
    { year: '2026 (Est)', yieldVal: 18400, xCurv: 360, yCurv: 85 }
  ];

  const categoryExpenses = [
    { category: 'Certified Seeds', amount: 14700, perc: 25, color: '#14b8a6' },
    { category: 'Bio Fertilizers', amount: 18400, perc: 30, color: '#f59e0b' },
    { category: 'Manual Labor', amount: 12000, perc: 20, color: '#f43f5e' },
    { category: 'Tillage Rentals', amount: 9200, perc: 15, color: '#0284c7' },
    { category: 'Misc Irrigation', amount: 5900, perc: 10, color: '#8b5cf6' }
  ];

  const plotOptions: CustomOption[] = [
    { value: 'overall', label: 'Consolidated Farms (All Plots)', icon: '🗺️' },
    { value: 'plotA', label: 'Green Valley Field Sector A', icon: '📍' },
    { value: 'plotB', label: 'South Slope Wheat Plot B', icon: '🌾' }
  ];

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. TOP TITLE & FILTER HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
            <Activity className="h-3 w-3 animate-pulse" />
            Satellite Coordinates Active Telemetry
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Interactive Telemetry
          </h1>
          <p className="text-xs font-medium text-white/50 mt-0.5">
            Consolidated analytics & multi-season financial telemetry.
          </p>
        </div>

        <div className="w-full sm:w-80 relative z-30">
          <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block mb-1">Target Farm Scope</label>
          <CustomSelect
            options={plotOptions}
            value={selectedCrop}
            onChange={setSelectedCrop}
          />
        </div>
      </div>

      {/* 2. MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Card 1: Annual Yield Productivity Curve (8 Cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-card card-glow-lime rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl relative z-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider">
                <BarChart3 className="h-3 w-3" />
                Multi-Season Trend Telemetry
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                Annual Yield Productivity Curve (kg / acre)
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              <span className="rounded-full bg-lime-500/15 border border-lime-500/30 px-3 py-1 text-lime-400 flex items-center gap-1">
                <ArrowUpRight className="h-3.5 w-3.5" /> +15.7% YoY
              </span>
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-[#080B08] p-4 sm:p-6">
            {/* SVG Area Line Chart */}
            <svg
              viewBox="0 0 400 220"
              className="h-full w-full overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#84cc16" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="30" y1="50" x2="380" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="150" x2="380" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="200" x2="380" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Shaded underlying area path */}
              <path
                d="M 40 200 L 40 180 C 80 167.5, 80 167.5, 120 155 C 160 142.5, 160 142.5, 200 130 C 240 132.5, 240 132.5, 280 135 C 320 110, 320 110, 360 85 L 360 200 Z"
                fill="url(#areaGradient)"
              />

              {/* Main curved smooth line stroke */}
              <path
                d="M 40 180 C 80 167.5, 80 167.5, 120 155 C 160 142.5, 160 142.5, 200 130 C 240 132.5, 240 132.5, 280 135 C 320 110, 320 110, 360 85"
                fill="none"
                stroke="#84cc16"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Highlight interactive points */}
              {yieldHistory.map((pt, index) => (
                <g key={index}>
                  <circle
                    cx={pt.xCurv}
                    cy={pt.yCurv}
                    r="5"
                    fill="#84cc16"
                    stroke="#050705"
                    strokeWidth="3"
                    className="cursor-pointer hover:scale-130 transition"
                  />
                  <text
                    x={pt.xCurv}
                    y={pt.yCurv - 14}
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold fill-white"
                  >
                    {pt.yieldVal.toLocaleString()}kg
                  </text>
                  <text
                    x={pt.xCurv}
                    y="214"
                    textAnchor="middle"
                    className="font-mono text-[9px] font-semibold fill-white/50"
                  >
                    {pt.year}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Card 2: Donut Expenditure Category Distribution (4 Cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass-card card-glow-amber rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-2xl relative z-10"
        >
          <div className="border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              <PieChart className="h-3 w-3" />
              Expenses Breakdown
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Category Ledgers %
            </h3>
          </div>

          <div className="my-4 flex items-center justify-center">
            <div className="relative h-36 w-36">
              {/* SVG pie donut slices */}
              <svg viewBox="0 0 40 40" className="h-full w-full rotate-240">
                <circle cx="20" cy="20" r="15.915" className="stroke-amber-500" strokeWidth="6" strokeDasharray="30 70" strokeDashoffset="0" fill="none" />
                <circle cx="20" cy="20" r="15.915" className="stroke-teal-500" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="70" fill="none" />
                <circle cx="20" cy="20" r="15.915" className="stroke-rose-500" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="45" fill="none" />
                <circle cx="20" cy="20" r="15.915" className="stroke-sky-500" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="30" fill="none" />
                <circle cx="20" cy="20" r="15.915" className="stroke-purple-500" strokeWidth="6" strokeDasharray="10 90" strokeDashoffset="20" fill="none" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-black text-white">₹60.2k</span>
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Total Sown</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-white/70">
            {categoryExpenses.map((exp, index) => (
              <div key={index} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-2 px-3 border border-white/5">
                <span className="flex items-center gap-2 text-white/80">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: exp.color }} />
                  <span>{exp.category}</span>
                </span>
                <span className="text-white font-mono font-bold">
                  {exp.perc}% <span className="text-white/40">(₹{exp.amount.toLocaleString('en-IN')})</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* 3. BENTO KPI METRIC GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-emerald rounded-3xl border border-white/10 bg-[#080B08]/90 p-6 text-center shadow-xl space-y-1"
        >
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider inline-block">
            Return on Inputs
          </span>
          <h4 className="font-mono text-3xl font-black text-white tracking-tight pt-1">185%</h4>
          <p className="text-xs text-white/40 font-medium">Estimated gross selling value multiplier</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-sky rounded-3xl border border-white/10 bg-[#080B08]/90 p-6 text-center shadow-xl space-y-1"
        >
          <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-0.5 text-[9px] font-mono font-bold text-sky-400 uppercase tracking-wider inline-block">
            Water Utility Savings
          </span>
          <h4 className="font-mono text-3xl font-black text-white tracking-tight pt-1">-34%</h4>
          <p className="text-xs text-white/40 font-medium">Saved water volume via drip split timing</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.015 }}
          className="glass-card card-glow-purple rounded-3xl border border-white/10 bg-[#080B08]/90 p-6 text-center shadow-xl space-y-1"
        >
          <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-[9px] font-mono font-bold text-purple-400 uppercase tracking-wider inline-block">
            Chemical Dosage Load
          </span>
          <h4 className="font-mono text-3xl font-black text-white tracking-tight pt-1">-40%</h4>
          <p className="text-xs text-white/40 font-medium">Reduced chemical load via split nitrogening</p>
        </motion.div>
      </div>

    </div>
  );
}
