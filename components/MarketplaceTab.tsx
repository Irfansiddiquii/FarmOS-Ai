'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB, MarketplaceListing, EquipmentRental } from '@/lib/db-store';
import { 
  PhoneCall, 
  Sprout, 
  Tractor, 
  Plus, 
  ChevronDown, 
  Check, 
  MapPin, 
  Tag, 
  Coins, 
  MessageSquare, 
  X, 
  Layers, 
  Sparkles,
  Phone,
  User,
  FileText
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

export default function MarketplaceTab() {
  const [marketTab, setMarketTab] = useState<'produce' | 'equipment'>('produce');
  const [listings, setListings] = useState<MarketplaceListing[]>(() => LocalDB.getMarketplace());
  const [equipments, setEquipments] = useState<EquipmentRental[]>(() => LocalDB.getEquipments());

  // Inquiry Popups / triggers
  const [inquiryTarget, setInquiryTarget] = useState<any | null>(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryText, setInquiryText] = useState('');

  // Sowing forms toggles
  const [showListingForm, setShowListingForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  // New Produce Inputs
  const [proTitle, setProTitle] = useState('');
  const [proCrop, setProCrop] = useState('');
  const [proVariety, setProVariety] = useState('');
  const [proQty, setProQty] = useState('');
  const [proPrice, setProPrice] = useState('');
  const [proState, setProState] = useState('Haryana');
  const [proPhone, setProPhone] = useState('');
  const [proIcon, setProIcon] = useState('🌾');

  // New Equipment Inputs
  const [eqTitle, setEqTitle] = useState('');
  const [eqType, setEqType] = useState<'tractor' | 'harvester' | 'rotavator' | 'seeder'>('tractor');
  const [eqRate, setEqRate] = useState('');
  const [eqContact, setEqContact] = useState('');
  const [eqDesc, setEqDesc] = useState('');
  const [eqLoc, setEqLoc] = useState('');

  const loadData = () => {
    setListings(LocalDB.getMarketplace());
    setEquipments(LocalDB.getEquipments());
  };

  useEffect(() => {
    LocalDB.syncAllFromSupabase().then(() => loadData());
  }, []);

  const handleCreateProduce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proTitle || !proCrop || !proQty || !proPrice || !proPhone) return;

    await LocalDB.addMarketplaceListing({
      title: proTitle,
      cropName: proCrop,
      variety: proVariety,
      quantityKg: parseFloat(proQty),
      pricePerKg: parseFloat(proPrice),
      state: proState,
      phone: proPhone,
      imagePlaceholder: proIcon
    });

    setProTitle('');
    setProCrop('');
    setProVariety('');
    setProQty('');
    setProPrice('');
    setProPhone('');
    setShowListingForm(false);
    loadData();
  };

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqTitle || !eqRate || !eqContact || !eqLoc) return;

    await LocalDB.addEquipmentRental({
      title: eqTitle,
      type: eqType,
      pricePerDay: parseFloat(eqRate),
      contact: eqContact,
      description: eqDesc,
      imagePlaceholder: eqType === 'tractor' ? '🚜' : eqType === 'harvester' ? '🌾' : '🛠️',
      location: eqLoc
    });

    setEqTitle('');
    setEqRate('');
    setEqContact('');
    setEqDesc('');
    setEqLoc('');
    setShowEquipmentForm(false);
    loadData();
  };

  const handleToggleAva = async (id: string) => {
    await LocalDB.toggleEquipmentAvailability(id);
    loadData();
  };

  const handleOpenInquiry = (listing: any) => {
    setInquiryTarget(listing);
    setInquiryText(`Pranam, I am interested in negotiating for your ${listing.cropName || listing.title}. Is the stock available for immediate transport?`);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryTarget) return;

    const dList = LocalDB.getMarketplace();
    const idx = dList.findIndex(x => x.id === inquiryTarget.id);
    if (idx > -1) {
      dList[idx].inquiriesCount += 1;
      LocalDB.setMarketplace(dList);
    }
    loadData();
    setInquiryTarget(null);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryText('');
  };

  // Custom Select Options Definitions
  const cropIconOptions: CustomOption[] = [
    { value: '🌾', label: 'Rice Paddy Grain', icon: '🌾' },
    { value: '🌽', label: 'Corn Maize Crop', icon: '🌽' },
    { value: '🧅', label: 'Red Onion Bulk', icon: '🧅' },
    { value: '🍅', label: 'Fresh Tomatoes', icon: '🍅' },
    { value: '🥔', label: 'Organic Potatoes', icon: '🥔' }
  ];

  const equipmentTypeOptions: CustomOption[] = [
    { value: 'tractor', label: 'Tractor Tillage Attachment', icon: '🚜' },
    { value: 'harvester', label: 'Automated Grain Harvester', icon: '🌾' },
    { value: 'rotavator', label: 'Rotavator Heavy Plow', icon: '🛠️' },
    { value: 'seeder', label: 'Direct Seeder Machine', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. TOP HEADER & SUB TABS NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Coins className="h-3 w-3" />
            Farmer P2P Commerce Matrix
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
            P2P Trading Hub
          </h1>
        </div>

        {/* Sub tabs navigation filters */}
        <div className="flex bg-[#080B08] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setMarketTab('produce')}
            className={`px-5 py-2.5 text-xs font-extrabold transition-all rounded-xl cursor-pointer flex items-center gap-2 ${
              marketTab === 'produce'
                ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md shadow-lime-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sprout className="h-4 w-4" />
            <span>Direct Crop Marketplace</span>
          </button>
          <button
            onClick={() => setMarketTab('equipment')}
            className={`px-5 py-2.5 text-xs font-extrabold transition-all rounded-xl cursor-pointer flex items-center gap-2 ${
              marketTab === 'equipment'
                ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md shadow-lime-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Tractor className="h-4 w-4" />
            <span>Equipment Rental Sharing</span>
          </button>
        </div>
      </div>

      {/* 2. PRODUCE SECTION */}
      {marketTab === 'produce' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Direct Grain & Produce Trading Hub
              </h2>
              <p className="text-xs font-medium text-white/50 mt-0.5">
                List bulk harvested crop stocks directly for verified grain brokers.
              </p>
            </div>
            <button
              onClick={() => setShowListingForm(!showListingForm)}
              className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-2 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{showListingForm ? 'Cancel Form' : 'List Crop Stock'}</span>
            </button>
          </div>

          {/* Create Crop Listing Form */}
          <AnimatePresence>
            {showListingForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateProduce} 
                className="space-y-4 rounded-3xl glass-card border border-white/10 p-6 text-xs max-w-2xl shadow-2xl relative z-20"
              >
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-extrabold text-white text-sm">Add Crop Produce Stock to Marketplace</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Listing Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Export Standard Pusa Basmati"
                      value={proTitle}
                      onChange={(e) => setProTitle(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Crop Preset Icon</label>
                    <CustomSelect
                      options={cropIconOptions}
                      value={proIcon}
                      onChange={setProIcon}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Crop Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Basmati Rice"
                      value={proCrop}
                      onChange={(e) => setProCrop(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Variety Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. Pusa 1121"
                      value={proVariety}
                      onChange={(e) => setProVariety(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Total Weight (KG) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 4000"
                      value={proQty}
                      onChange={(e) => setProQty(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Sell Price (₹ / KG) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={proPrice}
                      onChange={(e) => setProPrice(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Storage State</label>
                    <input
                      type="text"
                      value={proState}
                      onChange={(e) => setProState(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Contact Phone *</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={proPhone}
                      onChange={(e) => setProPhone(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
                >
                  Publish Crop Stock Listing
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Produce Listing Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((item) => (
              <motion.div 
                key={item.id} 
                whileHover={{ y: -5, scale: 1.015 }}
                className="glass-card card-glow-lime rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080B08] text-2xl border border-white/10 shrink-0 shadow-inner">
                      {item.imagePlaceholder}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] text-white/50 font-medium">
                        Seller: <span className="text-lime-300 font-bold">{item.sellerName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2 px-3 border border-white/5 rounded-2xl bg-white/[0.02] text-xs">
                    <div>
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Available Weight</p>
                      <p className="font-bold text-white font-mono text-sm mt-0.5">{item.quantityKg.toLocaleString()} kg</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Rate (₹ / KG)</p>
                      <p className="font-bold text-lime-400 font-mono text-sm mt-0.5">₹{item.pricePerKg}/kg</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-white/60">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-lime-400" />
                      <span>{item.state}</span>
                    </span>
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-sky-400">
                      {item.inquiriesCount} Inquiries
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenInquiry(item)}
                    className="w-full rounded-2xl bg-lime-500/10 border border-lime-500/25 py-2.5 font-bold text-lime-400 hover:bg-lime-500/20 transition text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Direct Negotiation</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MACHINERY EQUIPMENT SECTION */}
      {marketTab === 'equipment' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Machinery & Rental Operations
              </h2>
              <p className="text-xs font-medium text-white/50 mt-0.5">
                Lease high-tech tractors, seeders, power tillers, or automated laser levelers.
              </p>
            </div>
            <button
              onClick={() => setShowEquipmentForm(!showEquipmentForm)}
              className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-2 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{showEquipmentForm ? 'Cancel Form' : 'List Equipment'}</span>
            </button>
          </div>

          {/* Equipment Creation Form */}
          <AnimatePresence>
            {showEquipmentForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateEquipment} 
                className="space-y-4 rounded-3xl glass-card border border-white/10 p-6 text-xs max-w-2xl shadow-2xl relative z-20"
              >
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-extrabold text-white text-sm">Add Lease Equipment to Rental Pool</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Equipment Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sonalika Seeder Attachment"
                      value={eqTitle}
                      onChange={(e) => setEqTitle(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Equipment Category</label>
                    <CustomSelect
                      options={equipmentTypeOptions}
                      value={eqType}
                      onChange={(val) => setEqType(val as any)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Rent Rate (₹ / Day) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={eqRate}
                      onChange={(e) => setEqRate(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Contact Phone Details *</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={eqContact}
                      onChange={(e) => setEqContact(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Includes seed container, freshly serviced"
                      value={eqDesc}
                      onChange={(e) => setEqDesc(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Physical Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Karnal, Haryana"
                      value={eqLoc}
                      onChange={(e) => setEqLoc(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
                >
                  Incorporate Machinery Lease
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Equipment Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equipments.map((mach) => (
              <motion.div 
                key={mach.id} 
                whileHover={{ y: -5, scale: 1.015 }}
                className="glass-card card-glow-emerald rounded-3xl border border-white/10 p-6 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080B08] text-2xl border border-white/10 shadow-inner">
                      {mach.imagePlaceholder}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider ${
                      mach.available
                        ? 'bg-lime-500/10 border border-lime-500/20 text-lime-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                      {mach.available ? '✓ Available' : '⛔ Leased Out'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{mach.title}</h4>
                    <p className="text-[10px] text-white/50 font-medium">Owner: <span className="text-emerald-300 font-bold">{mach.ownerName}</span></p>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-medium line-clamp-2 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                    {mach.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-white/60">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{mach.location}</span>
                    </span>
                    <span className="font-mono text-lime-400 font-bold text-sm">₹{mach.pricePerDay}/day</span>
                  </div>

                  {mach.ownerName === 'Irfan Siddique' ? (
                    <button
                      onClick={() => handleToggleAva(mach.id)}
                      className={`w-full rounded-2xl py-2.5 font-bold transition text-xs cursor-pointer ${
                        mach.available
                          ? 'bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:bg-rose-500/25'
                          : 'bg-lime-500/15 border border-lime-500/25 text-lime-400 hover:bg-lime-500/25'
                      }`}
                    >
                      {mach.available ? 'Mark as Leased Out' : 'Mark as Available'}
                    </button>
                  ) : (
                    <a
                      href={`tel:${mach.contact}`}
                      className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 text-black flex items-center justify-center gap-2 py-2.5 font-extrabold hover:brightness-110 transition text-xs shadow-md shadow-lime-500/20 cursor-pointer"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>Call Owner Direct</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INQUIRY POPUP MODAL */}
      <AnimatePresence>
        {inquiryTarget && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/20 bg-[#0C100C]/98 backdrop-blur-2xl p-6 shadow-2xl space-y-4 ring-1 ring-lime-400/30"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider block">Direct Negotiation</span>
                  <h4 className="text-sm font-bold text-white">{inquiryTarget.title}</h4>
                </div>
                <button
                  onClick={() => setInquiryTarget(null)}
                  className="p-1 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitInquiry} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Broker Amit"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs font-semibold text-white focus:border-lime-500/50 focus:outline-none placeholder-white/20 appearance-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Your Contact Phone *</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs font-semibold text-white focus:border-lime-500/50 focus:outline-none placeholder-white/20 appearance-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Negotiation Message *</label>
                  <textarea
                    rows={3}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#080B08] p-3 text-xs font-semibold text-white focus:border-lime-500/50 focus:outline-none appearance-none"
                    required
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryTarget(null)}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-2.5 font-bold text-white/70 hover:text-white transition cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-2.5 font-extrabold text-black hover:brightness-110 transition shadow-md shadow-lime-500/20 cursor-pointer text-xs"
                  >
                    Send Negotiation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
