'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

let msgCounter = 0;

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Pranam! I am FarmOS AI, your personal crop doctor & agronomist. Ask me anything about crop diseases, nitrogen splitting, pest controls, or soil planning. I speak Hindi, English, and Hinglish!' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const presetQuestions = [
    { label: 'Leaf turned yellow 🍂', query: 'My wheat leaves are turning yellow from the margins. Is it nitrogen deficiency?' },
    { label: 'Increase paddy yield 🌾', query: 'What fertilizer schedule should I follow to maximize Basmati paddy yield?' },
    { label: 'Bt Cotton pests 🐛', query: 'Suggest an organic control mechanism for pink bollworm in cotton crop.' }
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: `m-${++msgCounter}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Network response got interrupted');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: `m-${++msgCounter}-reply`,
        role: 'assistant',
        content: data.reply
      }]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `m-${++msgCounter}-err`,
        role: 'assistant',
        content: "Kshama karein (Apologies), my satellite link is momentarily offline. Please retry sending your query in a few seconds."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-500 text-black shadow-xl hover:bg-lime-400 transition duration-300 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6 animate-pulse" />
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="flex h-[450px] w-88 flex-col rounded-2xl border border-white/5 bg-[#0A0D0A] shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-[#050705] border-b border-white/5 px-4 py-3 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-500/10 border border-lime-500/20 text-lime-400">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">FarmOS Advisor</h4>
                <p className="text-[10px] text-lime-450 font-bold">Assistant Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#050705] custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-lime-500 text-black rounded-tr-none'
                      : 'bg-[#0A0D0A] text-[#E0E2E0] border border-white/5 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-white/5 bg-[#0A0D0A] px-3.5 py-3 shadow-sm text-xs font-semibold text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 animate-bounce rounded-full bg-lime-500"></span>
                    <span className="flex h-2 w-2 animate-bounce delay-100 rounded-full bg-lime-500"></span>
                    <span className="flex h-2 w-2 animate-bounce delay-200 rounded-full bg-lime-500"></span>
                    <span className="font-mono text-[10px] tracking-wide text-white/40">Analysing Leaf Chemistry...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick presets */}
          {messages.length === 1 && (
            <div className="border-t border-white/5 bg-[#0A0D0A] px-4 py-2">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Quick Scenarios</p>
              <div className="flex flex-wrap gap-1">
                {presetQuestions.map((pq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(pq.query)}
                    className="rounded bg-lime-500/10 border border-lime-500/20 px-2 py-1 text-[11px] font-bold text-lime-450 hover:bg-lime-500/25 transition text-left"
                  >
                    {pq.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex items-center gap-1.5 border-t border-white/5 bg-[#0A0D0A] p-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type in English, Hindi/हिन्दी, Hinglish..."
              className="flex-1 rounded-lg border border-white/10 bg-[#050705] text-[#E0E2E0] px-3 py-2 text-xs font-semibold focus:border-lime-500/50 focus:outline-none placeholder-white/20"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-500 text-black shadow-md hover:bg-lime-400 transition disabled:opacity-50"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
