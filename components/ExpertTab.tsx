'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB, DiseaseReport } from '@/lib/db-store';
import { ShieldAlert, FlaskConical, ChevronDown, Check, Send, Sparkles, AlertTriangle } from 'lucide-react';

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
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ExpertTab() {
  const [reports, setReports] = useState<DiseaseReport[]>(() => LocalDB.getDiseases());
  const [selectedRep, setSelectedRep] = useState<DiseaseReport | null>(() => {
    const list = LocalDB.getDiseases();
    return list.length > 0 ? list[0] : null;
  });
  const [expertNote, setExpertNote] = useState(() => {
    const list = LocalDB.getDiseases();
    return list.length > 0 ? (list[0].expertNotes || '') : '';
  });
  const [statusVal, setStatusVal] = useState<'reviewed' | 'resolved'>('reviewed');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    LocalDB.syncAllFromSupabase().then(() => {
      const list = LocalDB.getDiseases();
      setReports(list);
      if (list.length > 0) {
        setSelectedRep(list[0]);
        setExpertNote(list[0].expertNotes || '');
      }
    });
  }, []);

  const handleUpdateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRep) return;

    const updated = await LocalDB.updateDiseaseReportStatus(selectedRep.id, statusVal, expertNote);
    setSelectedRep(updated);
    setExpertNote('');
    setReports(LocalDB.getDiseases());
    setSuccessMsg(`Agronomy advisory report dispatched successfully to farmer ${selectedRep.farmerName || 'Irfan Siddique'}!`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };

  const statusOptions: CustomOption[] = [
    { value: 'reviewed', label: 'Reviewed (Advisory Pending)', icon: '🧬' },
    { value: 'resolved', label: 'Resolved (Healthy Clearance)', icon: '🟢' }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-[#E0E2E0] pb-12">
      
      {/* Left List of Reports */}
      <div className="lg:col-span-5 glass-card card-glow-purple rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <FlaskConical className="h-4.5 w-4.5 text-purple-400" />
            <span>Botanical Scan Queue ({reports.length})</span>
          </h3>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-0.5">
            District farmer leaf scan submissions
          </p>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => {
                setSelectedRep(rep);
                setExpertNote(rep.expertNotes || '');
              }}
              className={`w-full text-left rounded-2xl border p-4 transition flex gap-3 cursor-pointer ${
                selectedRep?.id === rep.id
                  ? 'border-lime-500 bg-lime-500/10 shadow-lg'
                  : 'border-white/10 bg-[#080B08] hover:border-white/20'
              }`}
            >
              <img src={rep.imageUrl} alt="Scan input" className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/10 shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{rep.diseaseName}</span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    rep.status === 'detected' ? 'text-rose-400' : 'text-lime-400'
                  }`}>
                    • {rep.status}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-white/50">Farmer: {rep.farmerName}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                  <span>Severity: {rep.severityLevel}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Formulation Form */}
      <div className="lg:col-span-7">
        {selectedRep ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-glow-rose rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5"
          >
            {/* Header Details */}
            <div className="flex items-start gap-4 border-b border-white/10 pb-4">
              <img src={selectedRep.imageUrl} alt="Leaf Detail" className="h-20 w-20 rounded-2xl object-cover border border-white/10 shadow-md shrink-0" referrerPolicy="no-referrer" />
              <div className="space-y-1">
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                  Foliage Case ID: {selectedRep.id}
                </span>
                <h3 className="text-lg font-black text-white">{selectedRep.diseaseName}</h3>
                <p className="text-xs text-white/50 font-medium">Farmer: <span className="text-white font-bold">{selectedRep.farmerName}</span> • Soil: Loamy Plot C</p>
              </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2">
              <span className="block text-[10px] uppercase tracking-widest font-extrabold text-white/40">
                🧬 Automatic AI Machine Recommendations
              </span>
              <div className="space-y-2">
                {selectedRep.recommendations.map((rec, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.02] p-3 border border-white/5 text-xs font-semibold text-white/80">
                    <Check className="h-4 w-4 text-lime-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Notes */}
            <form onSubmit={handleUpdateReport} className="space-y-4 pt-3 border-t border-white/10">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Clinic Status Decision</label>
                <CustomSelect
                  options={statusOptions}
                  value={statusVal}
                  onChange={(val) => setStatusVal(val as any)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Add Clinical Agronomy Advisory Note *</label>
                <textarea
                  rows={4}
                  placeholder="Incorporate exact fungicide split, watering limits, chemical proportions, and preventative organic covers..."
                  value={expertNote}
                  onChange={(e) => setExpertNote(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] p-3.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                  required
                />
              </div>

              {successMsg && (
                <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-3.5 text-xs text-lime-400 font-bold animate-in fade-in duration-300 flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 font-extrabold text-black text-xs hover:brightness-110 shadow-lg shadow-lime-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Dispatch Clinic Advisory Report</span>
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="glass-card rounded-3xl border border-white/10 bg-[#080B08]/90 p-12 text-center text-white/40 font-semibold space-y-2">
            <FlaskConical className="h-10 w-10 text-white/20 mx-auto" />
            <p className="text-xs text-white/50">Select a crop leaf scan from the queue on the left.</p>
          </div>
        )}
      </div>

    </div>
  );
}
