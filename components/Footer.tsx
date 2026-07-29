'use client';

import React from 'react';
import { motion } from 'motion/react';
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
  Globe
} from 'lucide-react';

interface FooterProps {
  isLoggedIn?: boolean;
  setAuthReqTab?: (tab: 'login' | 'register' | null) => void;
  onSwitchTab?: (tab: string) => void;
}

export default function Footer({ isLoggedIn, setAuthReqTab, onSwitchTab }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (tabName: string) => {
    if (onSwitchTab) {
      onSwitchTab(tabName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <div className="inline-flex items-center gap-3 bg-[#0C100C]/80 border border-lime-500/20 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-[0_0_15px_rgba(163,230,53,0.05)]">
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
                { name: 'Dashboard Overview', tab: 'dashboard' },
                { name: 'Farm Management', tab: 'farms-crops' },
                { name: 'AI Disease Assistant', tab: 'ai-engine' },
                { name: 'Marketplace & APMC', tab: 'marketplace' },
                { name: 'Farm Analytics', tab: 'analytics' },
                { name: 'Govt Agri Schemes', tab: 'schemes' },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavClick(item.tab)}
                    className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group cursor-pointer"
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
                { name: 'Agronomy Docs', icon: FileText },
                { name: 'Community Forum', icon: Users, tab: 'community' },
                { name: 'Expert Consultations', icon: Sparkles, tab: 'expert' },
                { name: 'Weather Telemetry', icon: Globe },
                { name: 'Support & Help Desk', icon: HelpCircle },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => item.tab ? handleNavClick(item.tab) : scrollToTop()}
                    className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Account Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#A3E635]" />
              Legal & Access
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-medium">
              <li>
                <a href="#privacy" className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group">
                  <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group">
                  <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#cookies" className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group">
                  <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                  Cookie Preferences
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-[#A3E635] transition-colors flex items-center gap-1.5 group">
                  <span className="h-1 w-1 rounded-full bg-white/20 group-hover:bg-[#A3E635] transition-colors" />
                  Security & Compliance
                </a>
              </li>
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
    </footer>
  );
}
