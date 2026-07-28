'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB } from '@/lib/db-store';
import { 
  Brain, 
  Camera, 
  TableProperties, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  Check, 
  Search, 
  Sprout, 
  Droplets, 
  TestTube, 
  TrendingUp, 
  Coins, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Calendar,
  Layers,
  ArrowRight,
  Zap
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
  searchable?: boolean;
}

function CustomSelect({ options, value, onChange, placeholder = 'Select option...', className = '', searchable = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = searchable 
    ? options.filter(o => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

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
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full rounded-2xl border border-white/10 bg-[#080B08]/90 px-3.5 py-2.5 text-xs text-white flex items-center justify-between hover:border-lime-500/50 transition shadow-sm focus:outline-none focus:ring-1 focus:ring-lime-400/50 cursor-pointer"
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
            } z-[9999] rounded-2xl border border-white/20 bg-[#0E140E]/98 backdrop-blur-2xl shadow-2xl p-2 space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar ring-1 ring-lime-400/30`}
          >
            {searchable && (
              <div className="relative pb-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#050705] pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-lime-500/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
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
              ))
            ) : (
              <div className="p-2 text-center text-xs text-white/30">No matching options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AIEngineTab() {
  const [activeSubTab, setActiveSubTab] = useState<'crop-plan' | 'disease-detect' | 'fertilizer' | 'yield'>('crop-plan');
  const [loading, setLoading] = useState(false);

  // States for Crop Planning Engine
  const [planState, setPlanState] = useState('Haryana');
  const [planDistrict, setPlanDistrict] = useState('Karnal');
  const [planSoil, setPlanSoil] = useState('Loamy');
  const [planSeason, setPlanSeason] = useState('Rabi');
  const [planWater, setPlanWater] = useState('Drip Irrigation');
  const [planCrops, setPlanCrops] = useState<any[]>([]);

  // States for Disease Scanner
  const [leafImage, setLeafImage] = useState<string | null>(null);
  const [analyzedReport, setAnalyzedReport] = useState<any | null>(null);
  const [selectedCropCategory, setSelectedCropCategory] = useState('Tomato');

  // Interactive Disease Scan leaf tray
  const leafSamples = [
    { name: 'Tomato late blight', type: 'tomato', url: 'https://picsum.photos/seed/tomato-blight-sample/400/300', seed: 'tomato_blight' },
    { name: 'Rice blast disease', type: 'rice', url: 'https://picsum.photos/seed/rice-blast-sample/400/300', seed: 'rice_blast' },
    { name: 'Corn common rust', type: 'corn', url: 'https://picsum.photos/seed/corn-rust-sample/400/300', seed: 'corn_rust' },
    { name: 'Healthy Leaf ☘️', type: 'wheat', url: 'https://picsum.photos/seed/healthy-wheat/400/300', seed: 'healthy_leaf' }
  ];

  // States for Fertilizer recommendations
  const [fertCrop, setFertCrop] = useState('Basmati Paddy');
  const [fertSoil, setFertSoil] = useState('Loamy');
  const [fertStage, setFertStage] = useState('Tillering Stage (Week 4)');
  const [fertResult, setFertResult] = useState<any | null>(null);

  // States for Yield prediction
  const [yieldCrop, setYieldCrop] = useState('High-Yield Wheat');
  const [yieldVariety, setYieldVariety] = useState('HD-2967');
  const [yieldSoil, setYieldSoil] = useState('Loamy');
  const [yieldWater, setYieldWater] = useState('Sprinkler');
  const [yieldArea, setYieldArea] = useState('8.0');
  const [yieldResult, setYieldResult] = useState<any | null>(null);

  // Action methods
  const handleRunCropPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/crop-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: planState,
          district: planDistrict,
          soilType: planSoil,
          season: planSeason,
          waterAvailability: planWater
        })
      });
      const data = await res.json();
      setPlanCrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFertilizer = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: fertCrop,
          soilType: fertSoil,
          growthStage: fertStage
        })
      });
      const data = await res.json();
      setFertResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunYieldPredictor = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: yieldCrop,
          variety: yieldVariety,
          soilType: yieldSoil,
          waterSource: yieldWater,
          areaAcres: yieldArea
        })
      });
      const data = await res.json();
      setYieldResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch initial recommendations to avoid empty screens on mount
  useEffect(() => {
    let active = true;
    const loadInitialAIRecommendations = async () => {
      try {
        if (!active) return;
        setLoading(true);
        await Promise.all([
          handleRunCropPlan(),
          handleRunFertilizer(),
          handleRunYieldPredictor()
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      loadInitialAIRecommendations();
    }, 50);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  // Run leaf analysis using sample click or base64 file upload
  const handleLeafScan = async (sampleDataUrl?: string) => {
    setLoading(true);
    const targetUrl = sampleDataUrl || leafImage;
    if (!targetUrl) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/ai/disease-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetUrl,
          mimeType: 'image/jpeg',
          cropName: selectedCropCategory
        })
      });

      const data = await res.json();
      setAnalyzedReport(data);

      await LocalDB.addDiseaseReport({
        cropName: selectedCropCategory,
        leafType: selectedCropCategory + ' Leaf',
        imageUrl: targetUrl,
        diseaseName: data.diseaseName,
        confidenceScore: data.confidenceScore,
        severityLevel: data.severityLevel,
        recommendations: data.recommendations
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLeafImage(base64);
      handleLeafScan(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (url: string) => {
    setLeafImage(url);
    handleLeafScan(url);
  };

  // Dropdown Option Definitions
  const soilOptions: CustomOption[] = [
    { value: 'Loamy', label: 'Loamy (Sand + Clay)', icon: '🪨' },
    { value: 'Clay', label: 'Hard Clay', icon: '🧱' },
    { value: 'Sandy', label: 'Sandy Soil', icon: '🏖️' },
    { value: 'Silt', label: 'Alluvial Silt', icon: '🌊' }
  ];

  const seasonOptions: CustomOption[] = [
    { value: 'Rabi', label: 'Rabi (Winter sown)', icon: '❄️' },
    { value: 'Kharif', label: 'Kharif (Monsoon-sown)', icon: '🌧️' },
    { value: 'Zaid', label: 'Zaid (Summer Dry)', icon: '☀️' }
  ];

  const waterOptions: CustomOption[] = [
    { value: 'Drip Irrigation', label: 'Drip Tubing', icon: '💧' },
    { value: 'Sprinkler', label: 'Sprinkler network', icon: '🚿' },
    { value: 'Manual Water', label: 'Borewell pumps', icon: '🌊' },
    { value: 'Rainfed', label: 'Precipitation heavy', icon: '🌧️' }
  ];

  const growthStageOptions: CustomOption[] = [
    { value: 'Day 1 (Basal)', label: 'Basal Day 1 (Sowing Dosing)', icon: '🌱' },
    { value: 'Tillering Stage (Week 4)', label: 'Tillering Stage (Week 4)', icon: '🌿' },
    { value: 'Pre-flowering (Week 8)', label: 'Pre-flowering (Week 8)', icon: '🌸' }
  ];

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. TOP HEADER & SUB TABS NAVIGATION */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Gemini 3.5 AI Diagnostic Suite
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Diagnostic Core
            </h1>
          </div>
        </div>

        {/* Sub tabs navigation bar */}
        <div className="mt-6 flex border-b border-white/10 overflow-x-auto custom-scrollbar gap-1">
          <button
            onClick={() => setActiveSubTab('crop-plan')}
            className={`px-5 py-3 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'crop-plan'
                ? 'border-lime-400 text-lime-400 bg-lime-500/10 rounded-t-2xl'
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02] rounded-t-2xl'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>Crop Suitability Plan</span>
          </button>
          <button
            onClick={() => setActiveSubTab('disease-detect')}
            className={`px-5 py-3 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'disease-detect'
                ? 'border-lime-400 text-lime-400 bg-lime-500/10 rounded-t-2xl'
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02] rounded-t-2xl'
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Disease Diagnoser</span>
          </button>
          <button
            onClick={() => setActiveSubTab('fertilizer')}
            className={`px-5 py-3 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'fertilizer'
                ? 'border-lime-400 text-lime-400 bg-lime-500/10 rounded-t-2xl'
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02] rounded-t-2xl'
            }`}
          >
            <TableProperties className="h-4 w-4" />
            <span>Fertilizer Split Scheduler</span>
          </button>
          <button
            onClick={() => setActiveSubTab('yield')}
            className={`px-5 py-3 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'yield'
                ? 'border-lime-400 text-lime-400 bg-lime-500/10 rounded-t-2xl'
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02] rounded-t-2xl'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Yield Harvest Predictor</span>
          </button>
        </div>
      </div>

      {/* Loading banner */}
      {loading && (
        <div className="glass-card rounded-3xl border border-white/10 bg-[#0A0D0A] p-6 shadow-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="flex h-3 w-3 animate-bounce rounded-full bg-lime-400"></span>
            <span className="flex h-3 w-3 animate-bounce delay-100 rounded-full bg-lime-400"></span>
            <span className="flex h-3 w-3 animate-bounce delay-200 rounded-full bg-lime-400"></span>
            <span className="font-mono text-xs font-bold text-white/80 tracking-wider">
              Executing Gemini 3.5 AI Neural Pathology Model...
            </span>
          </div>
        </div>
      )}

      {/* MODULE 1: Crop Suitability Plan */}
      {activeSubTab === 'crop-plan' && !loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Panel: Geography Parameters Form */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card card-glow-emerald rounded-3xl p-6 border border-white/10 space-y-4 shadow-2xl relative z-20"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Brain className="h-4.5 w-4.5 text-lime-400" />
                  <span>Geography Parameters</span>
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">State Region *</label>
                  <input
                    type="text"
                    value={planState}
                    onChange={(e) => setPlanState(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs font-semibold text-white focus:border-lime-500/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">District / County Area *</label>
                  <input
                    type="text"
                    value={planDistrict}
                    onChange={(e) => setPlanDistrict(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs font-semibold text-white focus:border-lime-500/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Soil Structure</label>
                    <CustomSelect
                      options={soilOptions}
                      value={planSoil}
                      onChange={setPlanSoil}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Season Cycle</label>
                    <CustomSelect
                      options={seasonOptions}
                      value={planSeason}
                      onChange={setPlanSeason}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Water Irrigation Supply</label>
                  <CustomSelect
                    options={waterOptions}
                    value={planWater}
                    onChange={setPlanWater}
                  />
                </div>

                <button
                  onClick={handleRunCropPlan}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer mt-2"
                >
                  Analyze Crop Suitability
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Ranked Suitability Output List */}
          <div className="lg:col-span-8 space-y-4">
            {planCrops.map((c, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card card-glow-lime rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <span>{c.cropName}</span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-white/60">
                        Rank #{idx + 1}
                      </span>
                    </h4>
                  </div>
                  <div className="shrink-0">
                    <span className="rounded-full bg-lime-500/15 border border-lime-500/30 px-3.5 py-1 text-xs font-extrabold text-lime-400 font-mono">
                      {c.suitabilityPercent}% Match
                    </span>
                  </div>
                </div>

                {/* Justification summary */}
                <p className="text-xs text-white/80 leading-relaxed font-semibold bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  {c.suitabilityJustification}
                </p>

                {/* Financial overview metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                    <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Estimated Yield</p>
                    <p className="font-bold text-white font-mono text-sm mt-0.5">{c.expectedYieldKg} kg/ac</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                    <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Growing Span</p>
                    <p className="font-bold text-white font-mono text-sm mt-0.5">{c.growingDurationDays} Days</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3">
                    <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold">Expenses / Acre</p>
                    <p className="font-bold text-white font-mono text-sm mt-0.5">₹{c.estimatedExpenses?.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="rounded-2xl bg-lime-500/10 border border-lime-500/20 p-3">
                    <p className="text-[9px] uppercase tracking-wider text-lime-400/70 font-bold">Est. Revenue</p>
                    <p className="font-bold text-lime-400 font-mono text-sm mt-0.5">₹{c.estimatedRevenue?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      )}

      {/* MODULE 2: Disease Diagnoser */}
      {activeSubTab === 'disease-detect' && !loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Scanner Upload Section */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card card-glow-purple rounded-3xl p-6 border border-white/10 space-y-5 shadow-2xl relative z-10"
            >
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Camera className="h-4.5 w-4.5 text-purple-400" />
                <span>Plant Leaf Image Input</span>
              </h3>
              
              <p className="text-[11px] font-medium text-white/50">
                Select one of our instant diagnostic sample presets or upload a clear leaf image from your device.
              </p>

              {/* Preset trays */}
              <div className="space-y-2">
                <span className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40">
                  🔬 One-Click Diagnostic Demos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {leafSamples.map((samp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(samp.url)}
                      className="flex items-center gap-2 rounded-2xl border border-white/10 p-2.5 text-xs font-semibold text-white/80 bg-white/[0.02] hover:bg-purple-500/10 hover:border-purple-500/30 transition text-left cursor-pointer"
                    >
                      <span>🍂</span>
                      <span className="truncate">{samp.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40">
                  📂 Custom Device File Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-purple-500/15 file:text-purple-300 hover:file:bg-purple-500/25 cursor-pointer"
                />
              </div>

              {leafImage && (
                <div className="relative mt-2 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#080B08]">
                  <img src={leafImage} alt="Leaf Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-2 right-2 rounded-lg bg-black/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
                    Uploaded Leaf Input
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Scanner Analyzed Report */}
          <div className="lg:col-span-7">
            {analyzedReport ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card card-glow-rose rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                      Pathology Scan Completed
                    </span>
                    <h4 className="mt-1.5 text-lg font-black text-white">{analyzedReport.diseaseName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/25 px-3 py-1 text-xs font-mono font-bold text-sky-400">
                      {(analyzedReport.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                    <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-mono font-bold text-rose-400">
                      {analyzedReport.severityLevel} Severity
                    </span>
                  </div>
                </div>

                <p className="text-xs text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5 font-semibold">
                  {analyzedReport.explanation}
                </p>

                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40">
                    📝 Recommended Agronomic Treatment Protocol
                  </span>
                  <div className="space-y-2">
                    {analyzedReport.recommendations.map((rec: string, rIdx: number) => (
                      <div key={rIdx} className="flex items-start gap-3 rounded-2xl bg-white/[0.02] p-3 border border-white/5 text-xs font-semibold text-white/90">
                        <span className="text-lime-400 font-bold">✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                  <ShieldCheck className="h-4 w-4 text-lime-400" />
                  <span className="text-xs text-white/50 font-semibold">Verified by FarmOS AI Agronomy Engine</span>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-white/40 space-y-3">
                <Camera className="h-10 w-10 text-white/20 mx-auto" />
                <h4 className="text-sm font-bold text-white/60">No active leaf pathology scan running</h4>
                <p className="text-xs text-white/30 max-w-[280px] mx-auto">Click one of the demo leaf presets on the left or upload your crop photo to analyze disease pathology.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODULE 3: Fertilizer Split Scheduler */}
      {activeSubTab === 'fertilizer' && !loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card card-glow-emerald rounded-3xl p-6 border border-white/10 space-y-4 shadow-2xl relative z-20"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <TableProperties className="h-4.5 w-4.5 text-lime-400" />
                  <span>Crop & Soil Specs</span>
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Target Sown Crop *</label>
                  <input
                    type="text"
                    value={fertCrop}
                    onChange={(e) => setFertCrop(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold focus:border-lime-500/50 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Soil Structure</label>
                    <CustomSelect
                      options={soilOptions}
                      value={fertSoil}
                      onChange={setFertSoil}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Growth Phase</label>
                    <CustomSelect
                      options={growthStageOptions}
                      value={fertStage}
                      onChange={setFertStage}
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunFertilizer}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer mt-2"
                >
                  Generate Fertilizer Schedule
                </button>
              </div>
            </motion.div>
          </div>

          {/* Recommendations Table */}
          <div className="lg:col-span-8">
            {fertResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card card-glow-sky rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl"
              >
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-base font-black text-white">Precision Nutrient Dosing Schedule</h4>
                  <p className="text-[11px] font-medium text-white/50 mt-0.5">Optimized N-P-K nutrient split for target yield performance.</p>
                </div>
                
                {/* Fertilizer pills */}
                <div className="flex flex-wrap gap-2">
                  {fertResult.fertilizers.map((fet: string, fIdx: number) => (
                    <span key={fIdx} className="rounded-xl bg-lime-500/10 border border-lime-500/25 px-3 py-1.5 text-xs font-bold text-lime-400 flex items-center gap-1.5">
                      <TestTube className="h-3.5 w-3.5" />
                      <span>{fet}</span>
                    </span>
                  ))}
                </div>

                {/* Table schedule */}
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01]">
                  <table className="w-full text-left text-xs font-semibold text-white/80">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                        <th className="p-3.5">Timeline Phase</th>
                        <th className="p-3.5">Specific Dosage</th>
                        <th className="p-3.5">Application Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {fertResult.applicationSchedule.map((sch: any, sIdx: number) => (
                        <tr key={sIdx} className="hover:bg-white/[0.02] transition">
                          <td className="p-3.5 font-bold text-white">{sch.phaseName}</td>
                          <td className="p-3.5 font-mono font-bold text-lime-400">{sch.dosage}</td>
                          <td className="p-3.5 text-white/60 font-medium">{sch.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs font-semibold text-amber-400 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    <span className="font-extrabold uppercase tracking-wider text-[10px] block mb-0.5">Agronomist Safety Warning</span>
                    <span>{fertResult.warningNotes}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      )}

      {/* MODULE 4: Yield Harvest Predictor */}
      {activeSubTab === 'yield' && !loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card card-glow-emerald rounded-3xl p-6 border border-white/10 space-y-4 shadow-2xl relative z-20"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-lime-400" />
                  <span>Acreage & Crop Profile</span>
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Crop Sown *</label>
                    <input
                      type="text"
                      value={yieldCrop}
                      onChange={(e) => setYieldCrop(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold focus:border-lime-500/50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Variety Code *</label>
                    <input
                      type="text"
                      value={yieldVariety}
                      onChange={(e) => setYieldVariety(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold focus:border-lime-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Soil Structure</label>
                    <CustomSelect
                      options={soilOptions}
                      value={yieldSoil}
                      onChange={setYieldSoil}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Acres *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={yieldArea}
                      onChange={(e) => setYieldArea(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3 py-2.5 text-xs text-white font-mono font-bold text-center focus:border-lime-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Water Irrigation System</label>
                  <CustomSelect
                    options={waterOptions}
                    value={yieldWater}
                    onChange={setYieldWater}
                  />
                </div>

                <button
                  onClick={handleRunYieldPredictor}
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer mt-2"
                >
                  Estimate Harvest Yield
                </button>
              </div>
            </motion.div>
          </div>

          {/* Predictions Outcome Card */}
          <div className="lg:col-span-8">
            {yieldResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card card-glow-amber rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl"
              >
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
                    <span className="text-[10px] font-extrabold tracking-wider text-white/40 uppercase block">Estimated Crop Yield</span>
                    <span className="font-mono text-3xl font-black text-white mt-1 block">
                      {yieldResult.predictedYieldKg?.toLocaleString()} kg
                    </span>
                    <p className="text-[10px] text-white/40 font-semibold mt-1">Total projected for {yieldArea} Acres</p>
                  </div>

                  <div className="rounded-2xl border border-lime-500/20 bg-lime-500/10 p-5 text-center">
                    <span className="text-[10px] font-extrabold tracking-wider text-lime-400/70 uppercase block">Gross Revenue Bounds</span>
                    <span className="font-mono text-2xl font-black text-lime-400 mt-1 block">
                      ₹{yieldResult.predictedRevenueMin?.toLocaleString()} - ₹{yieldResult.predictedRevenueMax?.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-white/40 font-semibold mt-1">Based on current APMC market index</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/80 leading-relaxed font-semibold bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  {yieldResult.detailsOfYield}
                </p>

                {/* Risk Indicators */}
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40">
                    🛰️ Crucial Satellite Risk Indicators
                  </span>
                  <div className="space-y-2">
                    {yieldResult.riskFactors.map((fct: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.02] p-3 border border-white/5 text-xs font-semibold text-white/80">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <span>{fct}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
