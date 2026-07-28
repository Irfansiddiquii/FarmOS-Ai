'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB, Farm, Crop, Activity, Expense } from '@/lib/db-store';
import { 
  Sprout, 
  Check, 
  MapPin, 
  Coins, 
  CalendarDays, 
  Plus, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Layers, 
  Droplets, 
  TestTube, 
  Bug, 
  Sparkles,
  TrendingUp,
  Receipt,
  FileText,
  Clock,
  ArrowUpRight,
  Search
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

/* CUSTOM HEADER SELECTOR DROPDOWN FOR CALENDAR MONTH & YEAR */
function CustomHeaderSelector<T extends string | number>({ 
  options, 
  value, 
  onChange, 
  widthClass = 'w-28'
}: { 
  options: { value: T; label: string }[]; 
  value: T; 
  onChange: (v: T) => void;
  widthClass?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="rounded-xl border border-white/10 bg-[#050705] px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1 hover:border-lime-500/50 transition cursor-pointer"
      >
        <span className="font-mono text-lime-300">{selected?.label}</span>
        <ChevronDown className={`h-3 w-3 text-white/40 transition-transform ${isOpen ? 'rotate-180 text-lime-400' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.12 }}
            className={`absolute left-0 top-full mt-1 z-[10000] ${widthClass} max-h-48 overflow-y-auto rounded-xl border border-white/20 bg-[#0C100C]/98 backdrop-blur-2xl shadow-2xl p-1 space-y-0.5 custom-scrollbar ring-1 ring-lime-400/30`}
          >
            {options.map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                  value === opt.value
                    ? 'bg-lime-500/20 text-lime-300 font-bold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="font-mono">{opt.label}</span>
                {value === opt.value && <Check className="h-3 w-3 text-lime-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* PREMIUM CUSTOM POPOVER CALENDAR COMPONENT */
interface CustomDatePickerProps {
  value: string; // Format: "YYYY-MM-DD"
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

function CustomDatePicker({ value, onChange, placeholder = 'Select date...', className = '' }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);

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
      setOpenUpward(spaceBelow < 320);
    }
    setIsOpen(!isOpen);
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleMonthChange = (monthIdx: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIdx, 1));
  };

  const handleYearChange = (yearNum: number) => {
    setCurrentMonth(new Date(yearNum, currentMonth.getMonth(), 1));
  };

  const handleSelectDay = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formatted = `${year}-${month}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const monthOptions = monthNames.map((m, i) => ({ value: i, label: m }));
  const yearOptions = Array.from({ length: 51 }, (_, i) => ({ value: 2000 + i, label: String(2000 + i) }));

  const today = new Date();
  const isToday = (d: number) => 
    today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  const isSelected = (d: number) => {
    if (!value) return false;
    const parts = value.split('-').map(Number);
    if (parts.length < 3) return false;
    return parts[0] === year && parts[1] === month + 1 && parts[2] === d;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full rounded-2xl border border-white/10 bg-[#080B08]/90 px-3.5 py-2.5 text-xs text-white flex items-center justify-between hover:border-lime-500/50 transition shadow-sm focus:outline-none focus:ring-1 focus:ring-lime-400/50 cursor-pointer group"
      >
        <span className="truncate font-semibold text-white/90">
          {value ? (
            <span className="font-mono text-lime-300 font-bold">{value}</span>
          ) : (
            <span className="text-white/30">{placeholder}</span>
          )}
        </span>
        <CalendarDays className={`h-4 w-4 text-white/40 group-hover:text-lime-400 transition-colors ${isOpen ? 'text-lime-400' : ''}`} />
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
            } z-[9999] w-72 rounded-2xl border border-white/20 bg-[#0E140E]/98 backdrop-blur-2xl shadow-2xl p-3.5 space-y-3 ring-1 ring-lime-400/30`}
          >
            {/* Header: Custom Month & Year Selectors */}
            <div className="flex items-center justify-between gap-1 border-b border-white/10 pb-2.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <CustomHeaderSelector
                  options={monthOptions}
                  value={month}
                  onChange={handleMonthChange}
                  widthClass="w-32"
                />

                <CustomHeaderSelector
                  options={yearOptions}
                  value={year}
                  onChange={handleYearChange}
                  widthClass="w-24"
                />
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-white/40">
              {weekDays.map(w => <span key={w}>{w}</span>)}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({ length: startDay }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const selected = isSelected(dayNum);
                const currentDay = isToday(dayNum);

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-[11px] transition cursor-pointer mx-auto ${
                      selected
                        ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md shadow-lime-500/20 font-black'
                        : currentDay
                        ? 'border border-lime-400/60 text-lime-300 bg-lime-500/10'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FarmsCropsTab() {
  const [farms, setFarms] = useState<Farm[]>(() => LocalDB.getFarms());
  const [crops, setCrops] = useState<Crop[]>(() => LocalDB.getCrops());
  const [activities, setActivities] = useState<Activity[]>(() => LocalDB.getActivities());
  const [expenses, setExpenses] = useState<Expense[]>(() => LocalDB.getExpenses());

  // Selected crop for schedule timeline view
  const [selectedCropId, setSelectedCropId] = useState<string>(() => {
    const c = LocalDB.getCrops();
    return c.length > 0 ? c[0].id : '';
  });

  // Form toggle states
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // New Farm Inputs
  const [farmName, setFarmName] = useState('');
  const [farmArea, setFarmArea] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmSoil, setFarmSoil] = useState<'Clay' | 'Sandy' | 'Loamy' | 'Silt' | 'Peaty'>('Loamy');
  const [farmWater, setFarmWater] = useState<'Drip Irrigation' | 'Sprinkler' | 'Manual Water' | 'Rainfed'>('Drip Irrigation');
  const [farmNotes, setFarmNotes] = useState('');

  // New Crop Inputs
  const [cropFarmId, setCropFarmId] = useState('');
  const [cropName, setCropName] = useState('');
  const [cropVariety, setCropVariety] = useState('');
  const [cropSowed, setCropSowed] = useState('');
  const [cropDuration, setCropDuration] = useState('');
  const [cropYield, setCropYield] = useState('');

  // New Activity Inputs
  const [actType, setActType] = useState<'sowing' | 'irrigation' | 'fertilizer' | 'pesticide' | 'harvest'>('irrigation');
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actCost, setActCost] = useState('');

  // New Expense Inputs
  const [expFarmId, setExpFarmId] = useState('');
  const [expCategory, setExpCategory] = useState<'seeds' | 'fertilizers' | 'labor' | 'equipment' | 'transport' | 'misc'>('seeds');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const loadData = () => {
    const f = LocalDB.getFarms();
    const c = LocalDB.getCrops();
    const act = LocalDB.getActivities();
    const exp = LocalDB.getExpenses();

    setFarms(f);
    setCrops(c);
    setActivities(act);
    setExpenses(exp);

    if (c.length > 0 && !selectedCropId) {
      setSelectedCropId(c[0].id);
    }
  };

  useEffect(() => {
    LocalDB.syncAllFromSupabase().then(() => loadData());
  }, []);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !farmArea || !farmLocation) return;
    
    await LocalDB.addFarm({
      name: farmName,
      area: parseFloat(farmArea),
      location: farmLocation,
      soilType: farmSoil,
      waterSource: farmWater,
      notes: farmNotes
    });

    setFarmName('');
    setFarmArea('');
    setFarmLocation('');
    setFarmNotes('');
    setShowFarmForm(false);
    loadData();
  };

  const handleCreateCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropFarmId || !cropName || !cropVariety || !cropSowed || !cropDuration || !cropYield) return;

    const newCrop = await LocalDB.addCrop({
      farmId: cropFarmId,
      name: cropName,
      variety: cropVariety,
      sowedDate: cropSowed,
      durationDays: parseInt(cropDuration),
      estimatedYieldKg: parseFloat(cropYield),
      status: 'growing'
    });

    await LocalDB.addActivity({
      cropId: newCrop.id,
      type: 'sowing',
      title: `${cropName} Seed Bed Sowing`,
      date: cropSowed,
      cost: 4500
    });

    setCropFarmId('');
    setCropName('');
    setCropVariety('');
    setCropSowed('');
    setCropDuration('');
    setCropYield('');
    setShowCropForm(false);
    setSelectedCropId(newCrop.id);
    loadData();
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropId || !actTitle || !actDate) return;

    await LocalDB.addActivity({
      cropId: selectedCropId,
      type: actType,
      title: actTitle,
      date: actDate,
      cost: actCost ? parseFloat(actCost) : 0
    });

    const targetCrop = crops.find(c => c.id === selectedCropId);
    if (targetCrop && actCost) {
      await LocalDB.addExpense({
        farmId: targetCrop.farmId,
        category: actType === 'fertilizer' ? 'fertilizers' : actType === 'harvest' ? 'labor' : 'misc',
        amount: parseFloat(actCost),
        date: actDate,
        description: `Activity Cost: ${actTitle} on ${targetCrop.name}`
      });
    }

    setActTitle('');
    setActDate('');
    setActCost('');
    setShowActivityForm(false);
    loadData();
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expFarmId || !expAmount || !expDate || !expDesc) return;

    await LocalDB.addExpense({
      farmId: expFarmId,
      category: expCategory,
      amount: parseFloat(expAmount),
      date: expDate,
      description: expDesc
    });

    setExpAmount('');
    setExpDate('');
    setExpDesc('');
    setShowExpenseForm(false);
    loadData();
  };

  const handleToggleActivity = async (id: string) => {
    await LocalDB.toggleActivity(id);
    loadData();
  };

  const activeCrop = crops.find(c => c.id === selectedCropId);
  const activeCropActivities = activities.filter(a => a.cropId === selectedCropId);
  const totalAcreage = farms.reduce((acc, f) => acc + f.area, 0);

  // Custom Select Options Definitions
  const soilOptions: CustomOption[] = [
    { value: 'Loamy', label: 'Loamy (Sand + Clay)', icon: '🪨' },
    { value: 'Peaty', label: 'Peaty Organic Soil', icon: '🍃' },
    { value: 'Clay', label: 'Hard Heavy Clay', icon: '🧱' },
    { value: 'Sandy', label: 'Vaporous Sandy', icon: '🏖️' },
    { value: 'Silt', label: 'Alluvial Silt', icon: '🌊' }
  ];

  const waterOptions: CustomOption[] = [
    { value: 'Drip Irrigation', label: 'Drip Tubing Valves', icon: '💧' },
    { value: 'Sprinkler', label: 'Pumping Sprinkler System', icon: '🚿' },
    { value: 'Manual Water', label: 'Borewell Canal', icon: '🌊' },
    { value: 'Rainfed', label: 'Monsoon Rainfed Only', icon: '🌧️' }
  ];

  const farmSelectOptions: CustomOption[] = farms.map(f => ({
    value: f.id,
    label: `${f.name} (${f.area} Acres)`,
    icon: '📍'
  }));

  const activityTypeOptions: CustomOption[] = [
    { value: 'sowing', label: 'Nursery / Field Sowing', icon: '🌱' },
    { value: 'irrigation', label: 'Irrigation Valve Cycle', icon: '💧' },
    { value: 'fertilizer', label: 'Fertilizer N-P-K Dosing', icon: '🧪' },
    { value: 'pesticide', label: 'Pesticide / Spraying', icon: '🐛' },
    { value: 'harvest', label: 'Crop Harvesting Cycle', icon: '🌾' }
  ];

  const expenseCategoryOptions: CustomOption[] = [
    { value: 'seeds', label: 'Certified Hybrid Seeds', icon: '🍃' },
    { value: 'fertilizers', label: 'Fertilizers & Bio Doses', icon: '🧪' },
    { value: 'labor', label: 'Manual Field Labor', icon: '👥' },
    { value: 'equipment', label: 'Heavy Machinery & Tractor', icon: '⚙️' },
    { value: 'transport', label: 'Produce Transport & Sacks', icon: '🚚' },
    { value: 'misc', label: 'Irrigation & Misc Expenses', icon: '🛠️' }
  ];

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. TOP TITLE HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Plot Management & Crop Scheduler
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
            My Plots & Sowing Timeline
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFarmForm(!showFarmForm)}
            className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{showFarmForm ? 'Cancel' : 'Add Plot Site'}</span>
          </button>

          <button
            onClick={() => setShowCropForm(!showCropForm)}
            className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-2 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sprout className="h-4 w-4" />
            <span>{showCropForm ? 'Cancel' : 'Sow New Crop'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN 12-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* LEFT COLUMN (4 Cols): Plot Sites & Crop Registry */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: My Sowing Sites / Plots */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-glow-emerald rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl relative z-20"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-emerald-400" />
                <span>My Plot Holdings</span>
              </h3>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                {farms.length} Sites ({totalAcreage} Ac)
              </span>
            </div>

            {/* Farm Creation Form */}
            <AnimatePresence>
              {showFarmForm && (
                <motion.form 
                  initial={{ opacity: 0, opacity: 0 }}
                  animate={{ opacity: 1, opacity: 1 }}
                  exit={{ opacity: 0, opacity: 0 }}
                  onSubmit={handleCreateFarm} 
                  className="space-y-3.5 rounded-2xl bg-white/[0.02] border border-white/10 p-4 text-xs relative z-30"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Plot Name / Identifier *</label>
                    <input
                      type="text"
                      placeholder="e.g. Green Field Sector 4"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-emerald-500/50 focus:outline-none font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Area (Acres) *</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="12.5"
                        value={farmArea}
                        onChange={(e) => setFarmArea(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-emerald-500/50 focus:outline-none font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">District *</label>
                      <input
                        type="text"
                        placeholder="e.g. Karnal"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-emerald-500/50 focus:outline-none font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Soil Type</label>
                    <CustomSelect
                      options={soilOptions}
                      value={farmSoil}
                      onChange={(val) => setFarmSoil(val as any)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Water Irrigation Source</label>
                    <CustomSelect
                      options={waterOptions}
                      value={farmWater}
                      onChange={(val) => setFarmWater(val as any)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-emerald-500 py-2.5 text-xs font-black text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20 cursor-pointer mt-1"
                  >
                    Register Plot Site
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Farm List Cards */}
            <div className="space-y-2.5">
              {farms.map((f) => (
                <div key={f.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{f.name}</span>
                    <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      {f.area} Acres
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-semibold text-white/40">
                    <span>📍 {f.location}</span>
                    <span>🪨 {f.soilType}</span>
                    <span>💧 {f.waterSource}</span>
                  </div>
                </div>
              ))}

              {farms.length === 0 && (
                <div className="text-center py-8 text-white/40 space-y-2">
                  <MapPin className="h-8 w-8 text-emerald-400/30 mx-auto" />
                  <p className="text-xs font-bold text-white/60">No plot sites registered</p>
                  <p className="text-[10px] text-white/30">Click + Add Plot Site to record your agricultural land holdings.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Card 2: Sown Crops Registry */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card card-glow-lime rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl relative z-10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Sprout className="h-4.5 w-4.5 text-lime-400" />
                <span>Sown Crop Cycles</span>
              </h3>
              <span className="rounded-full bg-lime-500/10 border border-lime-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-lime-400">
                {crops.length} Registered
              </span>
            </div>

            {/* Crop Creation Form */}
            <AnimatePresence>
              {showCropForm && (
                <motion.form 
                  initial={{ opacity: 0, opacity: 0 }}
                  animate={{ opacity: 1, opacity: 1 }}
                  exit={{ opacity: 0, opacity: 0 }}
                  onSubmit={handleCreateCrop} 
                  className="space-y-3.5 rounded-2xl bg-white/[0.02] border border-white/10 p-4 text-xs relative z-20"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Target Plot *</label>
                    <CustomSelect
                      options={farmSelectOptions}
                      value={cropFarmId}
                      onChange={(val) => setCropFarmId(val)}
                      placeholder="-- Select Farm Site --"
                      searchable={true}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Crop Type *</label>
                      <input
                        type="text"
                        placeholder="e.g. Basmati Rice"
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Variety Spec *</label>
                      <input
                        type="text"
                        placeholder="e.g. Pusa 1121"
                        value={cropVariety}
                        onChange={(e) => setCropVariety(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-white/50 uppercase tracking-wider block">Sow Date *</label>
                      <CustomDatePicker
                        value={cropSowed}
                        onChange={setCropSowed}
                        placeholder="YYYY-MM-DD"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-white/50 uppercase tracking-wider block">Duration (Days)</label>
                      <input
                        type="number"
                        placeholder="120"
                        value={cropDuration}
                        onChange={(e) => setCropDuration(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-2 py-2.5 text-[11px] text-white placeholder-white/20 focus:outline-none font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-white/50 uppercase tracking-wider block">Target Yield (Kg)</label>
                      <input
                        type="number"
                        placeholder="4500"
                        value={cropYield}
                        onChange={(e) => setCropYield(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-2 py-2.5 text-[11px] text-white placeholder-white/20 focus:outline-none font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-2.5 text-xs font-black text-black hover:brightness-110 transition shadow-md shadow-lime-500/20 cursor-pointer mt-1"
                  >
                    Register Sown Crop
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Crop Select Buttons */}
            <div className="space-y-2">
              {crops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCropId(c.id)}
                  className={`w-full rounded-2xl border text-left p-3.5 transition cursor-pointer ${
                    selectedCropId === c.id
                      ? 'border-lime-400 bg-lime-500/10 shadow-lg shadow-lime-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-lime-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{c.name}</span>
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] font-semibold text-white/50">Variety: {c.variety}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>📅 Sowed: {c.sowedDate}</span>
                    <span>🌾 Target: {c.estimatedYieldKg}kg</span>
                  </div>
                </button>
              ))}

              {crops.length === 0 && (
                <div className="text-center py-8 text-white/40 space-y-2">
                  <Sprout className="h-8 w-8 text-lime-400/30 mx-auto" />
                  <p className="text-xs font-bold text-white/60">No crop schedules recorded</p>
                  <p className="text-[10px] text-white/30">Click + Sow New Crop to schedule sowing cycles.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN (8 Cols): Timeline Scheduler & Financial Expense Ledger */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Agronomic Timeline Scheduler */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card card-glow-lime rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl relative z-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider">
                  <CalendarDays className="h-3 w-3" />
                  Crop Task Execution Matrix
                </div>
                <h2 className="mt-1 text-xl font-black text-white tracking-tight">
                  Agronomic Timeline Scheduler
                </h2>
                <p className="text-[11px] font-medium text-white/50 mt-0.5">
                  Selected Crop: <span className="text-lime-300 font-bold">{activeCrop ? `${activeCrop.name} (${activeCrop.variety})` : 'None Selected'}</span>
                </p>
              </div>

              {activeCrop && (
                <button
                  onClick={() => setShowActivityForm(!showActivityForm)}
                  className="rounded-2xl bg-lime-500/10 border border-lime-500/20 px-4 py-2 text-xs font-extrabold text-lime-400 hover:bg-lime-500/20 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{showActivityForm ? 'Cancel' : 'Log Task Schedule'}</span>
                </button>
              )}
            </div>

            {/* Sowing Activity Form */}
            <AnimatePresence>
              {showActivityForm && activeCrop && (
                <motion.form 
                  initial={{ opacity: 0, opacity: 0 }}
                  animate={{ opacity: 1, opacity: 1 }}
                  exit={{ opacity: 0, opacity: 0 }}
                  onSubmit={handleCreateActivity} 
                  className="space-y-4 rounded-2xl bg-white/[0.02] border border-white/10 p-5 text-xs relative z-20"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Process Type *</label>
                      <CustomSelect
                        options={activityTypeOptions}
                        value={actType}
                        onChange={(val) => setActType(val as any)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Estimated Cost (₹ INR)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3500 (Optional)"
                        value={actCost}
                        onChange={(e) => setActCost(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold placeholder-white/20 focus:border-lime-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Activity Label *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sprinkler Canal Operation"
                        value={actTitle}
                        onChange={(e) => setActTitle(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold placeholder-white/20 focus:border-lime-500/50 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Schedule Execution Date *</label>
                      <CustomDatePicker
                        value={actDate}
                        onChange={setActDate}
                        placeholder="YYYY-MM-DD"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
                  >
                    Add Task to Crop Timeline
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Timeline Items */}
            {activeCrop ? (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-white/15 ml-3 sm:ml-4 space-y-6">
                {activeCropActivities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Timeline icon node */}
                    <span className={`absolute -left-9 sm:-left-11 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border bg-[#080B08] transition ${
                      act.isCompleted ? 'border-lime-400 text-lime-400 shadow-md shadow-lime-400/20' : 'border-white/20 text-white/30'
                    }`}>
                      {act.isCompleted ? <Check className="h-4 w-4" /> : <Clock className="h-3.5 w-3.5" />}
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white/[0.02] p-4 border border-white/5 transition hover:border-lime-500/30">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-2">
                          <span>{act.title}</span>
                          {act.cost > 0 && (
                            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-400">
                              ₹{act.cost.toLocaleString('en-IN')}
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-white/40 font-medium mt-1">Target Execution Date: {act.date}</p>
                      </div>

                      <button
                        onClick={() => handleToggleActivity(act.id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 cursor-pointer ${
                          act.isCompleted
                            ? 'bg-lime-500/15 border border-lime-500/25 text-lime-400 hover:bg-lime-500/25'
                            : 'bg-gradient-to-r from-lime-400 to-lime-500 text-black hover:brightness-110 shadow-sm shadow-lime-500/20'
                        }`}
                      >
                        {act.isCompleted ? '✓ Completed' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                ))}

                {activeCropActivities.length === 0 && (
                  <div className="text-center py-10 text-white/40 space-y-2">
                    <CalendarDays className="h-8 w-8 text-lime-400/30 mx-auto" />
                    <p className="text-xs font-bold text-white/60">No tasks logged for this crop</p>
                    <p className="text-[10px] text-white/30">Click Log Task Schedule to add watering, fertilizer, or harvest steps.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-white/40 space-y-2">
                <Sprout className="h-10 w-10 text-white/20 mx-auto" />
                <p className="text-xs font-bold text-white/60">Select a crop variety on the left panel</p>
                <p className="text-[10px] text-white/30 max-w-[260px] mx-auto">Choose a crop cycle to view its timeline matrix and execution milestones.</p>
              </div>
            )}
          </motion.div>

          {/* Section 2: Expense Management Ledger Table */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card card-glow-amber rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl relative z-10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  <Coins className="h-3 w-3" />
                  Financial Expenses & Ledger
                </div>
                <h2 className="mt-1 text-xl font-black text-white tracking-tight">
                  Season Input Ledger
                </h2>
              </div>

              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-xs font-extrabold text-amber-400 hover:bg-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{showExpenseForm ? 'Cancel' : 'Record Expense'}</span>
              </button>
            </div>

            {/* Expense Form */}
            <AnimatePresence>
              {showExpenseForm && (
                <motion.form 
                  initial={{ opacity: 0, opacity: 0 }}
                  animate={{ opacity: 1, opacity: 1 }}
                  exit={{ opacity: 0, opacity: 0 }}
                  onSubmit={handleCreateExpense} 
                  className="space-y-4 rounded-2xl bg-white/[0.02] border border-white/10 p-5 text-xs relative z-20"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Target Plot *</label>
                      <CustomSelect
                        options={farmSelectOptions}
                        value={expFarmId}
                        onChange={(val) => setExpFarmId(val)}
                        placeholder="-- Select Farm --"
                        searchable={true}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Category Code *</label>
                      <CustomSelect
                        options={expenseCategoryOptions}
                        value={expCategory}
                        onChange={(val) => setExpCategory(val as any)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Amount Paid (₹ INR) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 5000"
                        value={expAmount}
                        onChange={(e) => setExpAmount(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold placeholder-white/20 focus:border-amber-500/50 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Expenditure Description *</label>
                      <input
                        type="text"
                        placeholder="e.g. Purchased 20 organic neem oil tins"
                        value={expDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-semibold placeholder-white/20 focus:border-amber-500/50 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Date Paid *</label>
                      <CustomDatePicker
                        value={expDate}
                        onChange={setExpDate}
                        placeholder="YYYY-MM-DD"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-amber-500 py-3 text-xs font-black text-black hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Save Expense Entry to Ledger
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Expense Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs font-semibold text-white/70">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                    <th className="py-3 px-3">Description</th>
                    <th className="px-3">Category</th>
                    <th className="px-3">Date Paid</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-3 font-bold text-white">{exp.description}</td>
                      <td className="px-3">
                        <span className="capitalize rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-3 text-white/50 font-mono text-[11px]">{exp.date}</td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400 text-sm">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {expenses.length === 0 && (
                <div className="text-center py-10 text-white/40 space-y-2">
                  <Coins className="h-8 w-8 text-amber-400/30 mx-auto" />
                  <p className="text-xs font-bold text-white/60">No financial expenses recorded</p>
                  <p className="text-[10px] text-white/30">Click Record Expense to log seed, fertilizer, and labor expenditures.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
}
