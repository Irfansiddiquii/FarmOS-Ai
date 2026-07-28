'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB } from '@/lib/db-store';
import { 
  Award, 
  ExternalLink, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Search,
  Filter,
  Check,
  ArrowRight,
  ShieldAlert,
  Loader2,
  PhoneCall,
  MapPin,
  ClipboardCheck,
  Compass,
  FileCheck2,
  TrendingUp,
  RotateCcw,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  User,
  Building
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

interface SchemeDetails {
  id: string;
  officialUrl: string;
  applyFormUrl: string;
  statusUrl: string;
  deadlineDate: string;
  daysRemaining: number;
  contactNumber: string;
  officeToVisit: string;
  requiredDocs: { name: string; description: string }[];
  steps: string[];
  eligibilityCriteria: {
    maxLandAcres?: number;
    minLandAcres?: number;
    maxFamilyIncome?: number;
    applicableStates: string[];
  };
  statePortals?: { state: string; portalName: string; url: string }[];
}

const SCHEME_METADATA_EXT: Record<string, SchemeDetails> = {
  'sch-1': {
    id: 'sch-1',
    officialUrl: 'https://pmkisan.gov.in/',
    applyFormUrl: 'https://pmkisan.gov.in/RegistrationFormNewFarmer.aspx',
    statusUrl: 'https://pmkisan.gov.in/BeneficiaryStatus_New.aspx',
    deadlineDate: '2026-08-31',
    daysRemaining: 73,
    contactNumber: '155261 / 1800115526 (PM-KISAN DBT Toll-Free)',
    officeToVisit: 'Office of Lekhpal, Tehsil Revenue Office, or district Agriculture Development Officer (ADO)',
    requiredDocs: [
      { name: 'Aadhaar Card Copy', description: 'Biometric identity proof linking to bank accounts' },
      { name: 'Verified Land Record (RoR)', description: 'Scanned Land Ownership registry copy (Chakbandi/Mutation papers)' },
      { name: 'Bank Passbook Front Page', description: 'Showing IFSC code and bank holding number for direct benefit credit' },
      { name: 'Self-Declaration Form', description: 'Affiliated copy stating no family member pays income tax' }
    ],
    steps: [
      'Navigate to the official PM-KISAN portal (pmkisan.gov.in) and enter the "Farmers Corner" tab.',
      'Click on "New Farmer Registration" and choose either Rural or Urban designation.',
      'Authenticate your identification via live Aadhaar OTP verification.',
      'Fill down specific farm credentials including District, block, village, and ownership area.',
      'Upload the scanned land registration certificate (PDF format, under 200KB).'
    ],
    eligibilityCriteria: {
      maxLandAcres: 5,
      maxFamilyIncome: 150000,
      applicableStates: ['All States']
    },
    statePortals: [
      { state: 'Uttar Pradesh', portalName: 'UP Krishi Darpan Portal', url: 'https://upagriculture.com/' },
      { state: 'Bihar', portalName: 'DBT Agriculture Bihar', url: 'https://dbtagriculture.bihar.gov.in/' },
      { state: 'Maharashtra', portalName: 'MahaDBT Farmer App', url: 'https://mahadbt.maharashtra.gov.in/' }
    ]
  },
  'sch-2': {
    id: 'sch-2',
    officialUrl: 'https://pmfby.gov.in/',
    applyFormUrl: 'https://pmfby.gov.in/farmer/registration/new',
    statusUrl: 'https://pmfby.gov.in/status',
    deadlineDate: '2026-07-31',
    daysRemaining: 42,
    contactNumber: '1800-180-1551 (National Crop Insurance Helpline)',
    officeToVisit: 'Empaneled Commercial Bank branch, Rural Agricultural Cooperative Credit Society (PACS), or local Common Service Centre (CSC)',
    requiredDocs: [
      { name: 'Aadhaar Card', description: 'Compulsory verification parameter' },
      { name: 'Sowing Certificate', description: 'Signed and approved by Block Agri Officer, Patwari, or village chief sarpanch' },
      { name: 'Land Record Sheet (Khatauni)', description: 'Recent printout of official territorial plot survey map/record' },
      { name: 'Cancelled Bank Cheque', description: 'To process speedier settlement payouts on verified losses' }
    ],
    steps: [
      'Enter PMFBY Crops Premium Calculator or Direct User Login.',
      'Link your residential and farming state, district, crop and specific sub-village unit.',
      'Input the exact land coordinates survey numbers and matching tenancy files.',
      'Upload Sowing Certificate stating the exact sowing date and crop variety.',
      'Calculate matching sum insured, pay the subsidized 1.5% premium and get your insurance policy.'
    ],
    eligibilityCriteria: {
      applicableStates: ['All States']
    },
    statePortals: [
      { state: 'Rajasthan', portalName: 'Raj Kisan Crop Insurance', url: 'https://rajkisan.rajasthan.gov.in/' },
      { state: 'Madhya Pradesh', portalName: 'MP Krishi Bima Portal', url: 'https://mpkrishi.mp.gov.in/' }
    ]
  },
  'sch-3': {
    id: 'sch-3',
    officialUrl: 'https://pmksy.gov.in/',
    applyFormUrl: 'https://mip.haryana.gov.in/register',
    statusUrl: 'https://mip.haryana.gov.in/status',
    deadlineDate: '2026-10-15',
    daysRemaining: 118,
    contactNumber: '0172-2561111 (Haryana Water Division Help Desk)',
    officeToVisit: 'District Soil Conservation Officer or Directorate of Horticulture',
    requiredDocs: [
      { name: 'Parivar Pehchan Patra (PPP ID)', description: 'Mandatory family credentials link for Haryana' },
      { name: 'Aks Shajra (Certified Land Map)', description: 'A detailed diagram verifying tubewell location or canal connection' },
      { name: 'Soil & Water Testing Certification', description: 'Valid lab test score confirming non-saline water quality' },
      { name: 'Empaneled Vendor Quotation', description: 'A breakdown estimation invoice issued by approved irrigation dealers' }
    ],
    steps: [
      'Visit the Haryana Micro Irrigation Portal (mip.haryana.gov.in) and sign-in with your PPP ID.',
      'Select agricultural land details and declare existing pumping source (e.g., Grid or Solar pump).',
      'Choose an empaneled vendor specializing in Drip irrigation systems and click "Request quotation".',
      'Upload the design blueprints mapped out by the vendor along with your soil-water chemistry card.',
      'Submit the dossier for online technical assessment. Assistant Soil Conservation Officer (ASCO) will physical audit.'
    ],
    eligibilityCriteria: {
      minLandAcres: 0.5,
      applicableStates: ['Haryana']
    },
    statePortals: [
      { state: 'Haryana', portalName: 'MIP Haryana Registration Portal', url: 'https://mip.haryana.gov.in/' }
    ]
  },
  'sch-4': {
    id: 'sch-4',
    officialUrl: 'https://agrimachinery.nic.in/',
    applyFormUrl: 'https://agrimachinery.nic.in/Farmer/Registration',
    statusUrl: 'https://agrimachinery.nic.in/Farmer/ApplicationStatus',
    deadlineDate: '2026-11-30',
    daysRemaining: 164,
    contactNumber: '1800-11-2018 (Farm Machinery Sub-Division Office)',
    officeToVisit: 'District Agricultural Engineer Office or Deputy Director of Agriculture (DDA)',
    requiredDocs: [
      { name: 'Aadhaar Identification Document', description: 'Primary verification card linked to mobile number' },
      { name: 'Tractor Registration Certificate (RC)', description: 'Compulsory printout to claim tractor-driven tool subsidies' },
      { name: 'Valid Bank Account Ledger', description: 'For processing direct cash subsidy transfers post purchase buy' },
      { name: 'Caste Certificate (if matching)', description: 'Required to unlock escalated subsidy scales for SC / ST / Women farmers' }
    ],
    steps: [
      'Access national Ag-machinery database (agrimachinery.nic.in) and select "Farmer Registration".',
      'Validate your profile details with OTP check and select block unit details.',
      'Under "Apply Subsidy Voucher", check list of available machines and choose desired tool.',
      'Input the manufacturer model of choice and submit matching RC card of tractor if requisite.',
      'Wait for digital permit generation. After coupon is issued, buy from verified franchise and upload store bill.'
    ],
    eligibilityCriteria: {
      applicableStates: ['Punjab', 'Haryana', 'All States']
    },
    statePortals: [
      { state: 'Punjab', portalName: 'Directorate of Agriculture Machinery Punjab', url: 'http://agrimachinerypb.com/' },
      { state: 'Haryana', portalName: 'Agri-machinery Haryana Subsidies portal', url: 'https://agriharyana.gov.in/' }
    ]
  }
};

interface AppSimulation {
  id: string;
  schemeId: string;
  schemeName: string;
  farmerName: string;
  aadhaar: string;
  phone: string;
  landAcres: number;
  annualIncome: number;
  state: string;
  submittedAt: string;
  status: 'Received' | 'Aadhaar Verified' | 'Field Survey Pending' | 'Approved & DBT Initiated';
}

function generateTrackingId(schemeId: string): string {
  if (typeof window === 'undefined') return 'FOS-PMK-00000';
  const prefix = schemeId === 'sch-1' ? 'PMK' : schemeId === 'sch-2' ? 'PMF' : schemeId === 'sch-3' ? 'PD_MORE_CROP' : 'SMAM';
  const salt = Math.floor(10000 + (Math.sin(Date.now()) + 1) * 45000);
  return `FOS-${prefix}-${salt}`;
}

export default function SchemesTab() {
  const [filterState, setFilterState] = useState('All States');
  const [filterCat, setFilterCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  
  const [chkLand, setChkLand] = useState<string>('2.5');
  const [chkIncome, setChkIncome] = useState<string>('120000');
  const [chkState, setChkState] = useState<string>('Haryana');

  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const [applications, setApplications] = useState<AppSimulation[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('farmos_simulated_schemes_claims');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'FOS-PMK-29472',
        schemeId: 'sch-1',
        schemeName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        farmerName: 'Irfan Siddique',
        aadhaar: 'XXXX-XXXX-9988',
        phone: '+91 98765 01234',
        landAcres: 2.5,
        annualIncome: 120000,
        state: 'Haryana',
        submittedAt: '2026-06-10 14:32',
        status: 'Field Survey Pending'
      }
    ];
  });

  const [showApplyWizardId, setShowApplyWizardId] = useState<string | null>(null);
  
  const [wizardName, setWizardName] = useState('');
  const [wizardAadhaar, setWizardAadhaar] = useState('XXXX-XXXX-9988');
  
  const handleAadhaarChange = (val: string) => {
    if (!val) {
      setWizardAadhaar('');
      return;
    }
    const clean = val.replace(/[^0-9xX]/g, '');
    const truncated = clean.slice(0, 12);
    
    let formatted = '';
    for (let i = 0; i < truncated.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      if (i < 8) {
        formatted += 'X';
      } else {
        formatted += truncated[i];
      }
    }
    setWizardAadhaar(formatted);
  };

  const [wizardPhone, setWizardPhone] = useState('');
  const [wizardLand, setWizardLand] = useState('2.5');
  const [wizardIncome, setWizardIncome] = useState('120000');
  const [wizardState, setWizardState] = useState('Haryana');
  const [wizardSubmitting, setWizardSubmitting] = useState(false);
  const [wizardsuccessMsg, setWizardSuccessMsg] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = LocalDB.getCurrentUser();
      if (user) {
        setWizardName(user.name || '');
        setWizardPhone(user.phone || '');
        setWizardState(user.state || 'Haryana');
      } else {
        setWizardName('');
        setWizardPhone('');
        setWizardState('Haryana');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [showApplyWizardId]);

  const [traceInput, setTraceInput] = useState('');
  const [traceResult, setTraceResult] = useState<AppSimulation | null>(null);
  const [traceError, setTraceError] = useState('');

  const schemes = LocalDB.getSchemes();

  // Custom Select Option Arrays
  const stateFilterOptions: CustomOption[] = [
    { value: 'All States', label: 'All Government Portals', icon: '🏛️' },
    { value: 'Haryana', label: 'Haryana State Schemes', icon: '📍' },
    { value: 'Punjab', label: 'Punjab State Schemes', icon: '📍' }
  ];

  const categoryFilterOptions: CustomOption[] = [
    { value: 'all', label: 'All Scheme Formats', icon: '📑' },
    { value: 'Income Support', label: 'Income Direct Support', icon: '💰' },
    { value: 'Crop Insurance', label: 'Crop Risk Insurance', icon: '🛡️' },
    { value: 'Irrigation Subsidy', label: 'Micro Irrigation Drip', icon: '💧' },
    { value: 'Machinery Subsidy', label: 'Ag-Machinery Voucher', icon: '🚜' }
  ];

  const stateSelectOptions: CustomOption[] = [
    { value: 'Haryana', label: 'Haryana Territory', icon: '📍' },
    { value: 'Punjab', label: 'Punjab Territory', icon: '📍' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh', icon: '📍' },
    { value: 'Bihar', label: 'Bihar', icon: '📍' },
    { value: 'Maharashtra', label: 'Maharashtra', icon: '📍' },
    { value: 'Rajasthan', label: 'Rajasthan', icon: '📍' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh', icon: '📍' }
  ];

  const saveApplications = (list: AppSimulation[]) => {
    setApplications(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmos_simulated_schemes_claims', JSON.stringify(list));
    }
  };

  const calculateEligibility = (schemeId: string, customLand?: string, customIncome?: string, customState?: string) => {
    const meta = SCHEME_METADATA_EXT[schemeId];
    if (!meta) return { status: 'eligible' as const, msg: 'No criteria configured' };

    const landVal = parseFloat(customLand || chkLand) || 0;
    const incomeVal = parseFloat(customIncome || chkIncome) || 0;
    const stateVal = customState || chkState;

    const stateMatch = meta.eligibilityCriteria.applicableStates.includes('All States') || meta.eligibilityCriteria.applicableStates.includes(stateVal);
    
    let landMatch = true;
    if (meta.eligibilityCriteria.maxLandAcres !== undefined && landVal > meta.eligibilityCriteria.maxLandAcres) {
      landMatch = false;
    }
    if (meta.eligibilityCriteria.minLandAcres !== undefined && landVal < meta.eligibilityCriteria.minLandAcres) {
      landMatch = false;
    }

    let incomeMatch = true;
    if (meta.eligibilityCriteria.maxFamilyIncome !== undefined && incomeVal > meta.eligibilityCriteria.maxFamilyIncome) {
      incomeMatch = false;
    }

    if (!stateMatch) {
      return {
        status: 'warning' as const,
        msg: `⚠️ Regional Barrier: Targeted exclusively for residents of ${meta.eligibilityCriteria.applicableStates.join(', ')}.`
      };
    }

    if (!landMatch) {
      const criteriaStr = meta.eligibilityCriteria.maxLandAcres 
        ? `must be under ${meta.eligibilityCriteria.maxLandAcres} acres`
        : `must be at least ${meta.eligibilityCriteria.minLandAcres} acres`;
      return {
        status: 'warning' as const,
        msg: `⚠️ Land Holding Alert: Your land size of ${landVal} acres does not comply (${criteriaStr}).`
      };
    }

    if (!incomeMatch) {
      return {
        status: 'warning' as const,
        msg: `⚠️ Revenue Limitation: Income restriction set at max ₹${meta.eligibilityCriteria.maxFamilyIncome?.toLocaleString('en-IN')}/year is exceeded.`
      };
    }

    return {
      status: 'eligible' as const,
      msg: `✅ Fully Eligible! You meet the land size (${landVal} acres), income bracket, and regional requirements for this program.`
    };
  };

  const handleApplySimulator = (e: React.FormEvent, schemeId: string, schemeName: string) => {
    e.preventDefault();
    setWizardSubmitting(true);

    const generatedId = generateTrackingId(schemeId);

    setTimeout(() => {
      const newApp: AppSimulation = {
        id: generatedId,
        schemeId,
        schemeName,
        farmerName: wizardName,
        aadhaar: wizardAadhaar.replace(/.(?=.{4})/g, 'X'),
        phone: wizardPhone,
        landAcres: parseFloat(wizardLand) || 2.5,
        annualIncome: parseFloat(wizardIncome) || 120000,
        state: wizardState,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'Received'
      };

      const updated = [newApp, ...applications];
      saveApplications(updated);
      setWizardSubmitting(false);
      setWizardSuccessMsg(`Success! Your simulated application has been dispatched. Reference: ${generatedId}`);
      
      setTimeout(() => {
        setWizardSuccessMsg('');
        setShowApplyWizardId(null);
      }, 6000);
    }, 1500);
  };

  const handleTraceManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    setTraceError('');
    setTraceResult(null);

    if (!traceInput.trim()) {
      setTraceError('Please enter a valid application tracking key.');
      return;
    }

    const match = applications.find(
      (a) => a.id.toLowerCase() === traceInput.trim().toLowerCase()
    );

    if (match) {
      setTraceResult(match);
    } else {
      setTraceError('No application found with matching reference code inside FarmOS AI local records.');
    }
  };

  const handleToggleDocCheck = (docKey: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docKey]: !prev[docKey]
    }));
  };

  const resetFilters = () => {
    setFilterState('All States');
    setFilterCat('all');
    setSearchQuery('');
  };

  const filteredSchemes = schemes.filter(s => {
    const sMatch = filterState === 'All States' || s.state === filterState || s.state === 'All States';
    const cMatch = filterCat === 'all' || s.category === filterCat;
    const queryMatch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return sMatch && cMatch && queryMatch;
  });

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. TOP TITLE HEADER & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Award className="h-3 w-3" />
            Indian Government Portals Connected
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Subsidies & Relief Matrix
          </h1>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 relative z-30">
          {(filterState !== 'All States' || filterCat !== 'all' || searchQuery) && (
            <button 
              onClick={resetFilters} 
              className="flex items-center gap-1.5 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs font-extrabold text-lime-400 hover:bg-white/10 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}

          <CustomSelect
            options={stateFilterOptions}
            value={filterState}
            onChange={setFilterState}
            className="w-48"
          />

          <CustomSelect
            options={categoryFilterOptions}
            value={filterCat}
            onChange={setFilterCat}
            className="w-52"
          />
        </div>
      </div>

      {/* Input Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Search subsidies by scheme name, parameters, or keywords (e.g. drip, tractors, crop protection)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#080B08] pl-11 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-lime-500/50 focus:ring-1 focus:ring-lime-400/50 transition font-semibold appearance-none"
        />
      </div>

      {/* 2. MAIN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Government Schemes Cards (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {filteredSchemes.map((sch) => {
            const ext = SCHEME_METADATA_EXT[sch.id] || {
              officialUrl: 'https://pmkisan.gov.in/',
              applyFormUrl: 'https://pmkisan.gov.in/',
              statusUrl: 'https://pmkisan.gov.in/',
              deadlineDate: '2026-12-31',
              daysRemaining: 180,
              contactNumber: 'N/A',
              officeToVisit: 'Local District Block Panchayat/Agriculture Office',
              requiredDocs: [{ name: 'Aadhaar Identification Card', description: 'Mandatory proof' }],
              steps: ['Register online.', 'Submit files for inspection.'],
              eligibilityCriteria: { applicableStates: ['All States'] }
            };
            const isCurrentlyExpanded = expandedSchemeId === sch.id;
            const eligibilityReport = calculateEligibility(sch.id);

            return (
              <motion.div 
                key={sch.id} 
                whileHover={{ y: -4, scale: 1.008 }}
                className={`glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 ${
                  isCurrentlyExpanded 
                    ? 'card-glow-lime ring-1 ring-lime-400/40' 
                    : 'card-glow-emerald'
                }`}
              >
                {/* Scheme Header */}
                <div 
                  className="p-6 space-y-4 cursor-pointer select-none"
                  onClick={() => setExpandedSchemeId(isCurrentlyExpanded ? null : sch.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#080B08] text-lime-400 border border-white/10 shadow-inner">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white leading-snug">{sch.name}</h3>
                        <div className="flex flex-wrap gap-2 items-center mt-1.5 text-xs font-semibold">
                          <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-white/60">
                            {sch.category}
                          </span>
                          <span className="rounded-full bg-lime-500/15 border border-lime-500/30 px-2.5 py-0.5 text-lime-400 font-mono">
                            State: {sch.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-bold border ${
                        ext.daysRemaining < 50 
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        <Clock className="h-3.5 w-3.5" />
                        Expires: {ext.deadlineDate} ({ext.daysRemaining}d)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider block">
                        Eligibility Framework
                      </span>
                      <p className="text-white/70 line-clamp-2 leading-relaxed bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                        {sch.eligibility}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-lime-400/70 uppercase tracking-wider block">
                        Fund Relief Benefit
                      </span>
                      <p className="text-lime-300 font-bold bg-lime-500/10 p-3 rounded-2xl border border-lime-500/20 line-clamp-2 leading-relaxed">
                        {sch.benefits}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-extrabold text-lime-400">
                    <span className="flex items-center gap-1.5">
                      {isCurrentlyExpanded ? 'Collapse Workflow ↑' : 'Expand Full Steps, Checklist & Apply →'}
                    </span>
                    <span className="text-white/40 text-[10px] font-mono font-normal">
                      {sch.process.substring(0, 40)}...
                    </span>
                  </div>
                </div>

                {/* EXPANDED INTERACTIVE WORKSPACE */}
                {isCurrentlyExpanded && (
                  <div className="border-t border-white/10 bg-[#080B08]/90 p-6 space-y-6 animate-in slide-in-from-top duration-300">
                    
                    {/* Stepper Guide */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-lime-400" />
                        <span>Live Step-by-Step Government Portal Guide</span>
                      </h4>
                      <div className="relative border-l border-white/10 pl-6 space-y-4 py-2 text-xs">
                        {ext.steps.map((st, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-8.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 text-[10px] font-black text-black font-mono shadow-md">
                              {i + 1}
                            </span>
                            <p className="text-white/80 font-medium leading-relaxed">{st}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-requisite Document Checklist */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-lime-400" />
                          <span>Pre-requisite Document Checklist</span>
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-lime-400">
                          {ext.requiredDocs.filter(d => checkedDocs[`${sch.id}-${d.name}`]).length} / {ext.requiredDocs.length} Compiled
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ext.requiredDocs.map((doc, idx) => {
                          const checkboxId = `${sch.id}-${doc.name}`;
                          const isDocChecked = !!checkedDocs[checkboxId];
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleToggleDocCheck(checkboxId)}
                              className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer select-none text-xs ${
                                isDocChecked 
                                  ? 'bg-lime-500/10 border-lime-500/30 text-white' 
                                  : 'bg-white/[0.01] border-white/5 text-white/60 hover:border-white/10'
                              }`}
                            >
                              <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-lg border transition ${
                                isDocChecked 
                                  ? 'bg-lime-400 border-lime-400 text-black font-bold' 
                                  : 'border-white/30'
                              }`}>
                                {isDocChecked && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <div>
                                <span className="block font-bold text-white text-xs">{doc.name}</span>
                                <span className="block text-[10px] text-white/40 mt-0.5 leading-snug">{doc.description}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Eligibility Status Banner */}
                    <div className={`rounded-2xl border p-4 text-xs font-semibold ${
                      eligibilityReport.status === 'eligible' 
                        ? 'border-lime-500/30 bg-lime-500/10 text-lime-300' 
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <ShieldAlert className={`h-4.5 w-4.5 shrink-0 ${eligibilityReport.status === 'eligible' ? 'text-lime-400' : 'text-rose-400'}`} />
                        <span className="font-bold">Real-time Eligibility Result:</span>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-black/40 tracking-wider">
                          {eligibilityReport.status === 'eligible' ? 'APPROVED' : 'INELIGIBLE'}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/80 font-mono">{eligibilityReport.msg}</p>
                    </div>

                    {/* Action Portal Links */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => {
                          setWizardSuccessMsg('');
                          setShowApplyWizardId(showApplyWizardId === sch.id ? null : sch.id);
                        }}
                        className="flex-1 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 hover:brightness-110 text-black font-black text-xs py-3 px-4 transition shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck2 className="h-4 w-4" />
                        <span>{showApplyWizardId === sch.id ? 'Hide Application Form' : 'Apply Now (In-App Simulator)'}</span>
                      </button>

                      <a
                        href={ext.applyFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 px-4 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Official Government Portal</span>
                        <ExternalLink className="h-3.5 w-3.5 text-lime-400" />
                      </a>
                    </div>

                    {/* Simulation Application Form */}
                    {showApplyWizardId === sch.id && (
                      <div className="rounded-3xl border border-lime-500/30 bg-[#060806] p-6 space-y-4 shadow-2xl">
                        <div className="border-b border-lime-500/20 pb-3 flex items-center justify-between">
                          <h4 className="text-xs font-black text-lime-400 uppercase tracking-wider flex items-center gap-2">
                            <Compass className="h-4 w-4" />
                            <span>Draft Subsidy Application Submission Form</span>
                          </h4>
                          <span className="text-[10px] font-mono text-white/40">FarmOS Online Simulator</span>
                        </div>

                        {wizardsuccessMsg ? (
                          <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-4 text-xs font-semibold text-lime-300">
                            <span className="block font-bold mb-1">🎉 Application Dispatched!</span>
                            <p className="font-mono text-xs leading-relaxed text-white/90">{wizardsuccessMsg}</p>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleApplySimulator(e, sch.id, sch.name)} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Farmer Full Name *</label>
                                <input
                                  type="text"
                                  required
                                  value={wizardName}
                                  onChange={(e) => setWizardName(e.target.value)}
                                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Aadhaar Card Key *</label>
                                <input
                                  type="text"
                                  required
                                  value={wizardAadhaar}
                                  onChange={(e) => handleAadhaarChange(e.target.value)}
                                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-lime-400 font-mono focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Active Mobile Number *</label>
                                <input
                                  type="text"
                                  required
                                  value={wizardPhone}
                                  onChange={(e) => setWizardPhone(e.target.value)}
                                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white font-mono focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Land Area (Acres) *</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  required
                                  value={wizardLand}
                                  onChange={(e) => setWizardLand(e.target.value)}
                                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-lime-400 font-mono focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Annual Income (₹) *</label>
                                <input
                                  type="number"
                                  required
                                  value={wizardIncome}
                                  onChange={(e) => setWizardIncome(e.target.value)}
                                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-lime-400 font-mono focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Farming State Residency</label>
                                <CustomSelect
                                  options={stateSelectOptions}
                                  value={wizardState}
                                  onChange={setWizardState}
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={wizardSubmitting}
                              className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 text-black py-3 font-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              {wizardSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                                  <span>Transmitting Dossier...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4" />
                                  <span>Submit Verified Request to Database</span>
                                </>
                              )}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Panel: Tools & Tracker (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Universal Eligibility Inspector */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card card-glow-emerald rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl relative z-20"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-lime-400" />
                <span>Universal Eligibility Inspector</span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">State Territory</label>
                <CustomSelect
                  options={stateSelectOptions}
                  value={chkState}
                  onChange={setChkState}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Total Farm Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chkLand}
                  onChange={(e) => setChkLand(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-lime-400 font-mono font-bold focus:border-lime-500/50 focus:outline-none appearance-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Annual Revenue (₹)</label>
                <input
                  type="number"
                  value={chkIncome}
                  onChange={(e) => setChkIncome(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-lime-400 font-mono font-bold focus:border-lime-500/50 focus:outline-none appearance-none"
                />
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-white/40 block">
                  Simultaneous Subsidy Status
                </span>
                <div className="space-y-2">
                  {Object.keys(SCHEME_METADATA_EXT).map((key) => {
                    const matchedSchName = schemes.find(s => s.id === key)?.name || key;
                    const res = calculateEligibility(key);
                    return (
                      <div key={key} className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5 last:border-0 font-semibold">
                        <span className="truncate max-w-[170px] text-white/80">{matchedSchName.split('(')[0]}</span>
                        <span className={`font-mono text-xs font-bold ${res.status === 'eligible' ? 'text-lime-400' : 'text-rose-400'}`}>
                          {res.status === 'eligible' ? 'Eligible' : 'Ineligible'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live Application Status Tracer */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card card-glow-sky rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Compass className="h-4.5 w-4.5 text-sky-400" />
                <span>Live Application Status Tracer</span>
              </h3>
            </div>

            <form onSubmit={handleTraceManualCode} className="space-y-3 text-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reference ID (e.g. FOS-PMK-29472)"
                  value={traceInput}
                  onChange={(e) => setTraceInput(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] pl-3.5 pr-16 py-2.5 text-xs text-lime-400 font-mono focus:border-lime-500/50 focus:outline-none appearance-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-gradient-to-r from-lime-400 to-lime-500 text-black font-extrabold rounded-xl transition hover:brightness-110 text-xs cursor-pointer"
                >
                  Locate
                </button>
              </div>

              {traceError && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 font-semibold">
                  {traceError}
                </div>
              )}

              {traceResult && (
                <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-4 space-y-3 text-xs animate-in slide-in-from-bottom duration-200">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-extrabold text-[10px] text-white uppercase">Dossier Recovered</span>
                    <span className="font-mono text-xs text-lime-400 font-bold">{traceResult.id}</span>
                  </div>
                  <div className="space-y-1 text-white/80 font-semibold">
                    <p className="truncate"><span className="text-white/40">Scheme:</span> <span className="font-bold text-white">{traceResult.schemeName.split('(')[0]}</span></p>
                    <p><span className="text-white/40">Farmer:</span> {traceResult.farmerName}</p>
                    <p><span className="text-white/40">State:</span> {traceResult.state} • <span className="text-white/40 font-mono">Land:</span> {traceResult.landAcres} ac</p>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-white/40 uppercase tracking-wider block">Verification Status</span>
                    <div className="flex items-center gap-2 text-xs text-lime-400 font-bold font-mono">
                      <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                      <span>{traceResult.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </motion.div>

          {/* Submitted Claims Register */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card card-glow-amber rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <ClipboardCheck className="h-4.5 w-4.5 text-amber-400" />
                <span>Submitted Claims Register ({applications.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
              {applications.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => {
                    setTraceInput(app.id);
                    setTraceResult(app);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-lime-500/10 hover:border-lime-500/30 p-3.5 text-xs font-semibold space-y-1 transition cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white truncate max-w-[130px]">{app.schemeName.split('(')[0]}</span>
                    <span className="font-mono text-[10px] text-lime-400 font-bold">{app.id}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/50">
                    <span>Filed: {app.submittedAt.split(' ')[0]}</span>
                    <span className="font-bold text-lime-400">{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
}
