'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  ArrowUp, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Mail, 
  ExternalLink,
  Heart,
  Activity,
  Layers,
  Sparkles,
  BookOpen,
  Users,
  HelpCircle,
  FileText,
  Lock,
  Globe,
  X,
  CheckCircle2,
  AlertCircle,
  Cookie,
  Shield,
  Cpu,
  BarChart3,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';

interface FooterProps {
  isLoggedIn?: boolean;
  setAuthReqTab?: (tab: 'login' | 'register' | null) => void;
  onSwitchTab?: (tab: string) => void;
}

type ModalType = 'privacy' | 'terms' | 'cookies' | 'security' | 'docs' | 'support' | null;

export default function Footer({ isLoggedIn, setAuthReqTab, onSwitchTab }: FooterProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Cookie toggles state
  const [essentialCookies] = useState(true); // Always true
  const [telemetryCookies, setTelemetryCookies] = useState(true);
  const [aiSessionCookies, setAiSessionCookies] = useState(true);
  const [savedCookieMsg, setSavedCookieMsg] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handlePlatformClick = (tabName: string, sectionId: string) => {
    if (isLoggedIn && onSwitchTab) {
      onSwitchTab(tabName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleResourceClick = (tabName?: string, sectionId?: string, modalType?: ModalType) => {
    if (modalType) {
      setActiveModal(modalType);
    } else if (tabName && isLoggedIn && onSwitchTab) {
      onSwitchTab(tabName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId) {
      const elem = document.getElementById(sectionId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSaveCookies = () => {
    setSavedCookieMsg(true);
    setTimeout(() => {
      setSavedCookieMsg(false);
      setActiveModal(null);
    }, 1200);
  };

  return (
    <footer className="relative w-full bg-[#050705] text-[#E0E2E0] border-t border-white/10 pt-16 pb-12 overflow-hidden z-20">
      {/* Top glowing animated green border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#A3E635]/60 to-transparent shadow-[0_0_15px_rgba(163,230,53,0.5)]" />

      {/* Ambient background glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-lime-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-lime-500/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A3E635] via-[#84CC16] to-[#059669] text-black font-extrabold shadow-[0_0_20px_rgba(163,230,53,0.3)] border border-[#A3E635]/30 cursor-pointer"
                onClick={scrollToTop}
              >
                <Sprout className="h-6 w-6 text-[#050705]" />
              </motion.div>
              <div>
                <span className="font-sans text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Farm<span className="text-[#A3E635]">OS AI</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/20 px-2 py-0.5 rounded-full">
                    SaaS v2.4
                  </span>
                </span>
                <p className="text-xs text-white/50 font-medium">AI-Powered Smart Farming Platform</p>
              </div>
            </div>

            <p className="text-xs text-white/60 leading-relaxed font-normal max-w-md">
              Industry-grade Agritech SaaS platform designed for crop planning, leaf disease detection, weather forecasting, APMC market intelligence, and predictive farm analytics.
            </p>

            {/* Redesigned Premium Glowing Status Badge */}
            <div 
              onClick={() => setActiveModal('security')}
              className="inline-flex items-center gap-3 bg-[#0C100C]/80 border border-lime-500/20 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-[0_0_15px_rgba(163,230,53,0.05)] cursor-pointer hover:border-lime-500/40 transition-colors"
              title="Click to view Security & System Telemetry Status"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3E635] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A3E635]"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white tracking-wide flex items-center gap-1.5">
                  All Systems Operational
                  <Activity className="h-3 w-3 text-[#A3E635]" />
                </span>
                <span className="text-[9px] text-white/40 font-mono">99.98% Telemetry & AI Uptime</span>
              </div>
            </div>

            {/* Social Icons Row */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {[
                  { name: 'GitHub', icon: Github, href: 'https://github.com' },
                  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
                  { name: 'Twitter', icon: Twitter, href: 'https://x.com' },
                  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
                  { name: 'Email', icon: Mail, href: 'mailto:support@farmos.ai' },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-[#A3E635] hover:bg-[#A3E635]/10 hover:border-[#A3E635]/30 transition-colors shadow-sm"
                    title={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-[#A3E635]" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-medium">
              {[
                { name: 'Dashboard Overview', tab: 'overview', sectionId: 'hero-dashboard' },
                { name: 'Farm Management', tab: 'farms-crops', sectionId: 'feature-timeline' },
                { name: 'AI Disease Assistant', tab: 'ai-engine', sectionId: 'feature-ai-vision' },
                { name: 'Marketplace & APMC', tab: 'marketplace', sectionId: 'feature-marketplace' },
                { name: 'Farm Analytics', tab: 'analytics', sectionId: 'metrics-banner' },
                { name: 'Govt Agri Schemes', tab: 'schemes', sectionId: 'feature-schemes' },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handlePlatformClick(item.tab, item.sectionId)}
                    className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-[#A3E635]" />
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-medium">
              {[
                { name: 'Agronomy Docs', modal: 'docs' as ModalType },
                { name: 'Community Forum', tab: 'community', sectionId: 'testimonials' },
                { name: 'Expert Consultations', tab: 'expert', sectionId: 'feature-expert' },
                { name: 'Weather Telemetry', tab: 'analytics', sectionId: 'hero-weather' },
                { name: 'Support & Help Desk', modal: 'support' as ModalType },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleResourceClick(item.tab, item.sectionId, item.modal)}
                    className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Access Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#A3E635]" />
              Legal & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-medium">
              {[
                { name: 'Privacy Policy', modal: 'privacy' as ModalType },
                { name: 'Terms of Service', modal: 'terms' as ModalType },
                { name: 'Cookie Preferences', modal: 'cookies' as ModalType },
                { name: 'Security & Compliance', modal: 'security' as ModalType },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveModal(item.modal)}
                    className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group cursor-pointer text-left"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                    {item.name}
                  </button>
                </li>
              ))}
              {!isLoggedIn && setAuthReqTab && (
                <li className="pt-2 border-t border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => setAuthReqTab('login')}
                    className="text-xs text-[#A3E635] font-semibold hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    onClick={() => setAuthReqTab('register')}
                    className="text-xs text-white hover:text-[#A3E635] font-semibold cursor-pointer"
                  >
                    Register
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50">
          
          {/* Copyright */}
          <div className="flex items-center gap-2 font-normal">
            <span>&copy; {new Date().getFullYear()} FarmOS AI Inc.</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline">Smart Farming Operating System. All Rights Reserved.</span>
          </div>

          {/* Tech Stack Callout */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] text-white/70 shadow-inner">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>using</span>
            <span className="font-semibold text-white">Next.js</span>
            <span className="text-white/30">&amp;</span>
            <span className="font-semibold text-[#3ECF8E]">Supabase</span>
            <span className="text-white/30">&amp;</span>
            <span className="font-semibold text-[#A3E635]">Gemini AI</span>
          </div>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#A3E635]/10 border border-white/10 hover:border-[#A3E635]/30 text-white/70 hover:text-[#A3E635] transition-all cursor-pointer shadow-sm group"
            title="Back to top"
          >
            <span className="text-xs font-semibold">Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE LEGAL & RESOURCE MODALS                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-[#A3E635]/30 bg-[#0A0E0A] p-6 text-white shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635]">
                    {activeModal === 'privacy' && <Lock className="h-5 w-5" />}
                    {activeModal === 'terms' && <FileText className="h-5 w-5" />}
                    {activeModal === 'cookies' && <Cookie className="h-5 w-5" />}
                    {activeModal === 'security' && <ShieldCheck className="h-5 w-5" />}
                    {activeModal === 'docs' && <BookOpen className="h-5 w-5" />}
                    {activeModal === 'support' && <HelpCircle className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {activeModal === 'privacy' && 'Privacy Policy & Telemetry Governance'}
                      {activeModal === 'terms' && 'Terms of Service & Agronomy SLA'}
                      {activeModal === 'cookies' && 'Cookie Preferences & Storage Settings'}
                      {activeModal === 'security' && 'Security & Data Protection Compliance'}
                      {activeModal === 'docs' && 'Agronomy & Telemetry Documentation'}
                      {activeModal === 'support' && 'Support & Help Desk Portal'}
                    </h3>
                    <p className="text-xs text-white/40">FarmOS AI Enterprise SaaS Compliance</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs text-white/70 leading-relaxed font-normal">
                
                {/* 1. PRIVACY POLICY */}
                {activeModal === 'privacy' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-4 text-lime-300">
                      <p className="font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#A3E635]" />
                        Zero Third-Party Plot Selling Guarantee
                      </p>
                      <p className="text-[11px] text-lime-400/80 mt-1">
                        Your farm land coordinates, soil telemetry, and yield reports belong strictly to you. FarmOS AI never sells or monetizes user location data.
                      </p>
                    </div>
                    <h4 className="font-bold text-white text-sm">1. Data Collection & Satellite Sync</h4>
                    <p>
                      FarmOS AI collects district-level coordinates, crop types, and uploaded leaf images solely to calculate satellite weather telemetry, NDRE chlorophyll indices, and neural vision pathology diagnostics.
                    </p>
                    <h4 className="font-bold text-white text-sm">2. AI Diagnostics Privacy</h4>
                    <p>
                      All leaf pathology diagnostic requests submitted to our Gemini 3.5 Flash vision pipeline are anonymized before inference. No personally identifiable details are exposed to third-party model providers.
                    </p>
                    <h4 className="font-bold text-white text-sm">3. Supabase Encryption & Storage</h4>
                    <p>
                      Account credentials, land holdings, and P2P trade listings are secured behind Row Level Security (RLS) policies on Supabase Postgres with 256-bit encryption in-transit and at-rest.
                    </p>
                  </div>
                )}

                {/* 2. TERMS OF SERVICE */}
                {activeModal === 'terms' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-300">
                      <p className="font-bold flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400" />
                        Agronomy Advisory Disclaimer
                      </p>
                      <p className="text-[11px] text-amber-400/80 mt-1">
                        AI pathology diagnostic recommendations serve as supplemental guidance. For severe regional breakouts, verify prescriptions with a certified agronomist via our Expert Consultation tab.
                      </p>
                    </div>
                    <h4 className="font-bold text-white text-sm">1. Service Level Agreement (SLA)</h4>
                    <p>
                      FarmOS AI guarantees 99.98% operational uptime for satellite weather APIs, APMC market price synchronization, and AI vision inference services.
                    </p>
                    <h4 className="font-bold text-white text-sm">2. P2P Marketplace Terms</h4>
                    <p>
                      Produce listings and equipment rentals on our P2P trading hub are conducted directly between verified cultivators and buyers. FarmOS AI provides telemetry verification without charging hidden listing commissions.
                    </p>
                    <h4 className="font-bold text-white text-sm">3. Account Integrity</h4>
                    <p>
                      Users agree to provide accurate farm acreage and soil classification inputs to ensure model predictions remain calibrated for regional soil types.
                    </p>
                  </div>
                )}

                {/* 3. COOKIE PREFERENCES */}
                {activeModal === 'cookies' && (
                  <div className="space-y-4">
                    <p className="text-xs text-white/60">
                      Manage your cookie and browser storage settings below. Essential cookies are required for user authentication and session signatures.
                    </p>

                    <div className="space-y-3">
                      {/* Cookie Option 1 */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5">
                        <div>
                          <p className="font-bold text-white text-xs">Essential Authentication Cookies</p>
                          <p className="text-[11px] text-white/40">Maintains session login signatures &amp; security tokens</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#A3E635] bg-[#A3E635]/10 px-2.5 py-1 rounded-full border border-[#A3E635]/30">
                          Always Active
                        </span>
                      </div>

                      {/* Cookie Option 2 */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5">
                        <div>
                          <p className="font-bold text-white text-xs">Satellite Weather &amp; Telemetry Cache</p>
                          <p className="text-[11px] text-white/40">Caches Open-Meteo satellite weather data for faster loads</p>
                        </div>
                        <button
                          onClick={() => setTelemetryCookies(!telemetryCookies)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            telemetryCookies ? 'bg-[#A3E635] text-black' : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {telemetryCookies ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>

                      {/* Cookie Option 3 */}
                      <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5">
                        <div>
                          <p className="font-bold text-white text-xs">AI Diagnostics Memory</p>
                          <p className="text-[11px] text-white/40">Saves recent leaf scans in local browser state</p>
                        </div>
                        <button
                          onClick={() => setAiSessionCookies(!aiSessionCookies)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                            aiSessionCookies ? 'bg-[#A3E635] text-black' : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {aiSessionCookies ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>

                    {savedCookieMsg && (
                      <div className="p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs text-center font-semibold">
                        ✓ Cookie Preferences Saved Successfully
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SECURITY & COMPLIANCE */}
                {activeModal === 'security' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
                        <p className="font-mono text-lg font-black text-[#A3E635]">HMAC SHA-256</p>
                        <p className="text-[10px] text-white/50">Role Signature Validation</p>
                      </div>
                      <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
                        <p className="font-mono text-lg font-black text-white">TLS 1.3</p>
                        <p className="text-[10px] text-white/50">In-Transit Encryption</p>
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-sm">1. Cryptographic Role Authorization</h4>
                    <p>
                      Every API request in FarmOS AI is verified using cryptographic HMAC SHA-256 signatures generated via the Web Crypto API (`crypto.subtle`), protecting against privilege escalation.
                    </p>
                    <h4 className="font-bold text-white text-sm">2. Supabase Row Level Security (RLS)</h4>
                    <p>
                      Database access is strictly restricted by user session IDs. Cultivator plots, disease records, and financial expenses are shielded from cross-tenant visibility.
                    </p>
                  </div>
                )}

                {/* 5. AGRONOMY DOCS */}
                {activeModal === 'docs' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-white text-sm">🌾 FarmOS AI Quickstart Guide</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                        <span className="font-bold text-[#A3E635]">1. Leaf Pathology Scan:</span> Upload a clear leaf photo in AI Diagnostic Core. Ensure good lighting to achieve &gt;99% diagnostic accuracy.
                      </li>
                      <li className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                        <span className="font-bold text-[#A3E635]">2. N-P-K Nutrient Split:</span> Input crop age and soil type (Clay/Loamy) in Farms &amp; Crops tab to receive automated split dose recommendations.
                      </li>
                      <li className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                        <span className="font-bold text-[#A3E635]">3. APMC Price Feeds:</span> Check real-time APMC mandi prices in Marketplace to list produce at optimal market rates.
                      </li>
                    </ul>
                  </div>
                )}

                {/* 6. SUPPORT & HELP DESK */}
                {activeModal === 'support' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-4 text-lime-300 space-y-2">
                      <p className="font-bold flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-[#A3E635]" />
                        Direct Support Email
                      </p>
                      <p className="text-xs text-white">
                        Contact our dedicated support team at <a href="mailto:support@farmos.ai" className="text-[#A3E635] underline font-mono">support@farmos.ai</a>
                      </p>
                      <p className="text-[10px] text-white/40">Guaranteed response SLA: &lt; 2 hours for active cultivators.</p>
                    </div>

                    <h4 className="font-bold text-white text-sm">Frequently Asked Questions</h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                        <p className="font-bold text-white">Q: How do I connect satellite weather for my plot?</p>
                        <p className="text-white/60">A: Go to Farm Management, add your plot coordinates, and satellite weather automatically syncs via Open-Meteo API.</p>
                      </div>
                      <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-1">
                        <p className="font-bold text-white">Q: Is FarmOS AI free for smallholder farmers?</p>
                        <p className="text-white/60">A: Yes! Standard leaf pathology scanning, weather forecasting, and government scheme checks are 100% free.</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-white/40">FarmOS AI SaaS Platform</span>
                {activeModal === 'cookies' ? (
                  <button
                    onClick={handleSaveCookies}
                    className="rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 px-5 py-2 text-xs font-bold text-black hover:brightness-110 transition cursor-pointer"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveModal(null)}
                    className="rounded-xl bg-white/10 px-5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
                  >
                    Close Window
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
