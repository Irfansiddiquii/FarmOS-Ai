'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalDB, ForumPost } from '@/lib/db-store';
import { 
  Heart, 
  MessageSquare, 
  Plus, 
  ChevronDown, 
  Check, 
  Globe, 
  HelpCircle, 
  GraduationCap, 
  Trophy, 
  Tag, 
  MapPin, 
  Sparkles, 
  FileText, 
  Clock, 
  Send,
  AlertCircle,
  Eye,
  CheckCircle2,
  X
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

export default function CommunityTab() {
  const [posts, setPosts] = useState<ForumPost[]>(() => LocalDB.getForum());
  const [filterCat, setFilterCat] = useState<'all' | 'discussion' | 'question' | 'expert' | 'success'>('all');
  const [showForm, setShowForm] = useState(false);
  const [showCategoryChooserModal, setShowCategoryChooserModal] = useState(false);

  useEffect(() => {
    LocalDB.syncAllFromSupabase().then(() => {
      setPosts(LocalDB.getForum());
    });
  }, []);

  // 1. Discussion Form State
  const [discTitle, setDiscTitle] = useState('');
  const [discCategory, setDiscCategory] = useState('General Agronomy');
  const [discContent, setDiscContent] = useState('');
  const [discTags, setDiscTags] = useState('');
  const [discVisibility, setDiscVisibility] = useState('Public Community');

  // 2. Question Form State
  const [qTitle, setQTitle] = useState('');
  const [qContent, setQContent] = useState('');
  const [qCrop, setQCrop] = useState('');
  const [qCategory, setQCategory] = useState('Pathology & Pest');
  const [qUrgency, setQUrgency] = useState('Normal');
  const [qLocation, setQLocation] = useState('Karnal, Haryana');

  // 3. Expert Post Form State
  const [expTitle, setExpTitle] = useState('');
  const [expTopic, setExpTopic] = useState('Agronomy Science');
  const [expContent, setExpContent] = useState('');
  const [expReferences, setExpReferences] = useState('');

  // 4. Success Story Form State
  const [succTitle, setSuccTitle] = useState('');
  const [succContent, setSuccContent] = useState('');
  const [succCrop, setSuccCrop] = useState('');
  const [succYield, setSuccYield] = useState('');
  const [succProfit, setSuccProfit] = useState('');
  const [succTips, setSuccTips] = useState('');

  // Reply State
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleToggleForm = () => {
    if (filterCat === 'all') {
      setShowCategoryChooserModal(true);
    } else {
      setShowForm(!showForm);
    }
  };

  // Submit Handler for Discussion
  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discTitle || !discContent) return;

    const fullContent = `${discContent}\n\n🏷️ Tags: ${discTags || '#Agronomy'}\n👁️ Visibility: ${discVisibility}`;
    await LocalDB.addForumPost(discTitle, fullContent, 'discussion');
    setDiscTitle('');
    setDiscContent('');
    setDiscTags('');
    setShowForm(false);
    setPosts(LocalDB.getForum());
  };

  // Submit Handler for Question
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle || !qContent) return;

    const fullContent = `🌾 Target Crop: ${qCrop || 'General Crop'}\n🚨 Urgency: ${qUrgency}\n📍 Location: ${qLocation}\n\n${qContent}`;
    await LocalDB.addForumPost(`❓ [Q&A] ${qTitle}`, fullContent, 'question');
    setQTitle('');
    setQContent('');
    setQCrop('');
    setShowForm(false);
    setPosts(LocalDB.getForum());
  };

  // Submit Handler for Expert Post
  const handleCreateExpertPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expContent) return;

    const fullContent = `🎓 Topic: ${expTopic}\n📚 References: ${expReferences || 'ICAR Agricultural Board'}\n\n${expContent}`;
    await LocalDB.addForumPost(`🎓 [Expert Article] ${expTitle}`, fullContent, 'expert');
    setExpTitle('');
    setExpContent('');
    setExpReferences('');
    setShowForm(false);
    setPosts(LocalDB.getForum());
  };

  // Submit Handler for Success Story
  const handleCreateSuccessStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!succTitle || !succContent) return;

    const fullContent = `🏆 Harvested Crop: ${succCrop}\n🌾 Total Yield: ${succYield || '4500'} kg/ac\n💰 Net Profit: ₹${succProfit || '1,20,000'}\n\n💡 Pro Tips: ${succTips}\n\n${succContent}`;
    await LocalDB.addForumPost(`🏆 [Success Story] ${succTitle}`, fullContent, 'success');
    setSuccTitle('');
    setSuccContent('');
    setSuccCrop('');
    setSuccYield('');
    setSuccProfit('');
    setSuccTips('');
    setShowForm(false);
    setPosts(LocalDB.getForum());
  };

  const handleLike = async (id: string) => {
    await LocalDB.likePost(id);
    setPosts(LocalDB.getForum());
  };

  const handleCreateReply = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await LocalDB.AddReplyToPost(postId, replyText);
    setReplyText('');
    setActiveReplyId(null);
    setPosts(LocalDB.getForum());
  };

  const filteredPosts = posts.filter(p => filterCat === 'all' || p.category === filterCat);

  // Custom Select Option Arrays
  const discussionCategoryOptions: CustomOption[] = [
    { value: 'General Agronomy', label: 'General Agronomy Discussion', icon: '🍃' },
    { value: 'Soil Management', label: 'Soil Health & Organic Matter', icon: '🪨' },
    { value: 'Crop Health', label: 'Pest & Pathology Diagnostics', icon: '🐛' },
    { value: 'Market Trends', label: 'Grain APMC Price Dynamics', icon: '📈' }
  ];

  const visibilityOptions: CustomOption[] = [
    { value: 'Public Community', label: 'Public Community Broadcast', icon: '🌍' },
    { value: 'Verified Farmers Only', label: 'Verified Farmers Network Only', icon: '🔒' }
  ];

  const questionCategoryOptions: CustomOption[] = [
    { value: 'Pathology & Pest', label: 'Leaf Disease & Pest Pathology', icon: '🐛' },
    { value: 'Irrigation & Water', label: 'Irrigation & Moisture Deficit', icon: '💧' },
    { value: 'Subsidies & Relief', label: 'Government Subsidies & Schemes', icon: '📜' },
    { value: 'General Q&A', label: 'General Agronomic Query', icon: '❓' }
  ];

  const urgencyOptions: CustomOption[] = [
    { value: 'Normal', label: 'Normal - Regular Advice Needed', icon: '🟢' },
    { value: 'Urgent', label: 'Urgent - Active Crop Outbreak', icon: '🟠' },
    { value: 'Critical', label: 'Critical - Immediate Rescue Needed', icon: '🔴' }
  ];

  const expertTopicOptions: CustomOption[] = [
    { value: 'Agronomy Science', label: 'Agronomy Science & Bio-dosing', icon: '🎓' },
    { value: 'Soil Biotechnology', label: 'Soil Micro-flora & Nitrogen Fixation', icon: '🧪' },
    { value: 'Pesticide Safety', label: 'Neem & Chemical Safety Rules', icon: '🛡️' },
    { value: 'Climate Resilience', label: 'Monsoon Drought Adaptation', icon: '🌧️' }
  ];

  return (
    <div className="space-y-6 text-[#E0E2E0] pb-12">
      
      {/* 1. TOP TITLE HEADER & CATEGORY TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/10 border border-lime-500/20 px-3 py-0.5 text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider">
            <Globe className="h-3 w-3" />
            Farmer Knowledge Exchange Network
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Agronomy Forums
          </h1>
        </div>

        <button
          onClick={handleToggleForm}
          className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-2.5 text-xs font-extrabold text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>
            {showForm 
              ? 'Cancel Form' 
              : filterCat === 'all' 
                ? 'Create New Thread' 
                : filterCat === 'discussion' 
                  ? 'New Discussion' 
                  : filterCat === 'question' 
                    ? 'Ask Question' 
                    : filterCat === 'expert' 
                      ? 'Publish Article' 
                      : 'Share Story'}
          </span>
        </button>
      </div>

      {/* Category Pills Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
        {[
          { id: 'all', label: 'All Feeds', icon: <Globe className="h-3.5 w-3.5" /> },
          { id: 'discussion', label: 'Discussion', icon: <FileText className="h-3.5 w-3.5" /> },
          { id: 'question', label: 'Questions', icon: <HelpCircle className="h-3.5 w-3.5" /> },
          { id: 'expert', label: 'Expert Posts', icon: <GraduationCap className="h-3.5 w-3.5" /> },
          { id: 'success', label: 'Success Stories', icon: <Trophy className="h-3.5 w-3.5" /> }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setFilterCat(cat.id as any);
              setShowForm(false);
            }}
            className={`rounded-2xl px-4 py-2 text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              filterCat === cat.id
                ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-black shadow-md shadow-lime-500/20'
                : 'bg-white/[0.02] border border-white/10 text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 2. DEDICATED CATEGORY FORMS */}

      {/* Form A: Discussion Form */}
      <AnimatePresence>
        {showForm && filterCat === 'discussion' && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateDiscussion}
            className="space-y-4 rounded-3xl glass-card border border-white/10 p-6 text-xs max-w-2xl shadow-2xl relative z-20"
          >
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-lime-400" />
                <span>Create Agronomy Discussion Thread</span>
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Discussion Title *</label>
              <input
                type="text"
                placeholder="e.g. Best practices for neem oil application on rice crop"
                value={discTitle}
                onChange={(e) => setDiscTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Discussion Category</label>
                <CustomSelect
                  options={discussionCategoryOptions}
                  value={discCategory}
                  onChange={setDiscCategory}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Audience Visibility</label>
                <CustomSelect
                  options={visibilityOptions}
                  value={discVisibility}
                  onChange={setDiscVisibility}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Discussion Details *</label>
              <textarea
                rows={4}
                placeholder="Formulate your agronomic insight, crop observations, or farming techniques here..."
                value={discContent}
                onChange={(e) => setDiscContent(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] p-3.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Hashtag Tags</label>
              <input
                type="text"
                placeholder="e.g. #Organic, #Basmati, #SoilHealth"
                value={discTags}
                onChange={(e) => setDiscTags(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
            >
              Broadcast Discussion Thread
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Form B: Questions Form */}
      <AnimatePresence>
        {showForm && filterCat === 'question' && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateQuestion}
            className="space-y-4 rounded-3xl glass-card border border-white/10 p-6 text-xs max-w-2xl shadow-2xl relative z-20"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-sky-400" />
                <span>Ask Farmer Query / Q&A</span>
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Question Title *</label>
              <input
                type="text"
                placeholder="e.g. Yellowing on lower leaves of Basmati - Is it Zinc deficiency?"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Target Crop</label>
                <input
                  type="text"
                  placeholder="e.g. Wheat HD-2967"
                  value={qCrop}
                  onChange={(e) => setQCrop(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Query Category</label>
                <CustomSelect
                  options={questionCategoryOptions}
                  value={qCategory}
                  onChange={setQCategory}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Urgency Level</label>
                <CustomSelect
                  options={urgencyOptions}
                  value={qUrgency}
                  onChange={setQUrgency}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Question Description *</label>
              <textarea
                rows={4}
                placeholder="Describe leaf symptoms, irrigation history, or recent fertilizer applications..."
                value={qContent}
                onChange={(e) => setQContent(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] p-3.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
            >
              Ask Community Experts
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Form C: Expert Post Form */}
      <AnimatePresence>
        {showForm && filterCat === 'expert' && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateExpertPost}
            className="space-y-4 rounded-3xl glass-card border border-white/10 p-6 text-xs max-w-2xl shadow-2xl relative z-20"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <GraduationCap className="h-4.5 w-4.5 text-amber-400" />
                <span>Publish Expert Agronomy Article</span>
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Article Title *</label>
              <input
                type="text"
                placeholder="e.g. Scientific guidelines for split nitrogen dosing in heavy clay soil"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Research Topic Specialty</label>
              <CustomSelect
                options={expertTopicOptions}
                value={expTopic}
                onChange={setExpTopic}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Rich Article Content *</label>
              <textarea
                rows={5}
                placeholder="Write your research findings, chemical dosages, or agronomist safety notes..."
                value={expContent}
                onChange={(e) => setExpContent(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] p-3.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">References & Institutional Citation</label>
              <input
                type="text"
                placeholder="e.g. ICAR Research Bulletin 2025"
                value={expReferences}
                onChange={(e) => setExpReferences(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
            >
              Publish Expert Research Article
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Form D: Success Story Form */}
      <AnimatePresence>
        {showForm && filterCat === 'success' && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateSuccessStory}
            className="space-y-4 rounded-3xl glass-card border border-white/10 p-6 text-xs max-w-2xl shadow-2xl relative z-20"
          >
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Trophy className="h-4.5 w-4.5 text-amber-400" />
                <span>Share Farmer Success Story</span>
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Story Title *</label>
              <input
                type="text"
                placeholder="e.g. Achieved 18,400 kg Basmati yield using drip irrigation"
                value={succTitle}
                onChange={(e) => setSuccTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Harvested Crop</label>
                <input
                  type="text"
                  placeholder="e.g. Pusa 1121"
                  value={succCrop}
                  onChange={(e) => setSuccCrop(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Yield (Kg / Ac)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={succYield}
                  onChange={(e) => setSuccYield(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Net Profit (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 120000"
                  value={succProfit}
                  onChange={(e) => setSuccProfit(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-white/50 uppercase tracking-wider block">Key Advice & Lessons *</label>
              <textarea
                rows={4}
                placeholder="Share your sowing techniques, fertilizer timings, and advice for fellow farmers..."
                value={succContent}
                onChange={(e) => setSuccContent(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#080B08] p-3.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 py-3 text-xs font-black text-black hover:brightness-110 transition shadow-lg shadow-lime-500/20 cursor-pointer"
            >
              Publish Success Story
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 3. CATEGORY CHOOSER MODAL FOR "ALL FEEDS" */}
      <AnimatePresence>
        {showCategoryChooserModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/20 bg-[#0C100C]/98 backdrop-blur-2xl p-6 shadow-2xl space-y-4 ring-1 ring-lime-400/30"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-extrabold text-white text-sm">Select Thread Category to Publish</h3>
                <button
                  onClick={() => setShowCategoryChooserModal(false)}
                  className="p-1 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'discussion', title: '🍃 Agronomy Discussion', desc: 'Start a open farming discussion thread.' },
                  { id: 'question', title: '❓ Ask Q&A Query', desc: 'Ask agronomist experts for pest/disease advice.' },
                  { id: 'expert', title: '🎓 Expert Research Post', desc: 'Publish certified scientific agricultural research.' },
                  { id: 'success', title: '🏆 Harvest Success Story', desc: 'Share yield records and profit milestones.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFilterCat(item.id as any);
                      setShowCategoryChooserModal(false);
                      setShowForm(true);
                    }}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-lime-500/10 hover:border-lime-500/30 text-left transition cursor-pointer space-y-1"
                  >
                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                    <p className="text-[10px] text-white/50 font-medium">{item.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. THREADS & POST CARDS GRID */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div 
            key={post.id} 
            whileHover={{ y: -4, scale: 1.008 }}
            className={`glass-card rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl ${
              post.category === 'question' 
                ? 'card-glow-rose' 
                : post.category === 'expert' 
                  ? 'card-glow-amber' 
                  : post.category === 'success'
                    ? 'card-glow-emerald'
                    : 'card-glow-lime'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-600 text-black font-black text-sm ring-2 ring-white/10 shadow-inner">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{post.title}</h4>
                  <p className="text-[10px] text-white/50 font-medium mt-0.5">
                    Posted by: <span className="text-white font-bold">{post.authorName}</span> • <span className="capitalize text-lime-400 font-mono">{post.authorRole}</span>
                  </p>
                </div>
              </div>

              <span className={`rounded-full px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                post.category === 'question'
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                  : post.category === 'expert'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                    : post.category === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-lime-500/15 border border-lime-500/30 text-lime-400'
              }`}>
                {post.category}
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5 whitespace-pre-line">
              {post.content}
            </p>

            {/* Likes count & replies trigger */}
            <div className="flex items-center justify-between text-xs font-bold text-white/50 pt-1">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 hover:text-rose-400 transition cursor-pointer"
                >
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" /> 
                  <span className="font-mono">{post.likes} Likes</span>
                </button>
                
                <button
                  onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-lime-400 transition cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-lime-400" /> 
                  <span className="font-mono">{post.replies.length} Replies</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-white/40">{post.date}</span>
            </div>

            {/* Comments thread */}
            {post.replies.length > 0 && (
              <div className="border-t border-white/10 pt-3 space-y-2 pl-4 sm:pl-6">
                {post.replies.map((rep) => (
                  <div key={rep.id} className="rounded-2xl bg-white/[0.02] p-3 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white/50 uppercase">
                      <span>{rep.authorName} ({rep.authorRole})</span>
                      <span>{rep.date}</span>
                    </div>
                    <p className="text-xs text-white/80 font-medium leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write comment input */}
            {activeReplyId === post.id && (
              <form
                onSubmit={(e) => handleCreateReply(e, post.id)}
                className="flex items-center gap-2 pl-4 sm:pl-6 pt-3 border-t border-white/10"
              >
                <input
                  type="text"
                  placeholder="Write an agronomic reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-2xl border border-white/10 bg-[#080B08] px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:border-lime-500/50 focus:outline-none font-semibold appearance-none"
                  required
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 px-4 py-2.5 font-extrabold text-black text-xs hover:brightness-110 transition shadow-md shadow-lime-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            )}

          </motion.div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="glass-card rounded-3xl border border-white/10 bg-[#080B08]/90 p-12 text-center text-white/40 space-y-2">
            <Globe className="h-10 w-10 text-white/20 mx-auto" />
            <h4 className="text-xs font-bold text-white/60">No threads published in this channel category</h4>
            <p className="text-[10px] text-white/30">Click + Create New Thread above to publish the first topic.</p>
          </div>
        )}
      </div>

    </div>
  );
}
