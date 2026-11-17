import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, ShieldCheck, Clock } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { soundFX } from '../utils/audio';

const QUICK_PROMPTS = [
  { label: '🚚 Check Delivery PIN', text: 'Hi Tanu! Can you check if free delivery is available for my PIN code?' },
  { label: '🎀 Mystery Scoop Inquiry', text: 'Hi! I want to know what items come in the Mystery Scoop.' },
  { label: '🎬 Pack on IG Reel', text: 'Hi Tanu! I want my order to be packed on an Instagram Reel video.' },
  { label: '💬 General Inquiry', text: 'Hi Tanu! I have a question about Scoop Storey products.' }
];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleOpen = () => {
    soundFX.playPop(520);
    setIsOpen(!isOpen);
  };

  const handleSendPrompt = (text) => {
    soundFX.playPop(600);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918199922653?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    handleSendPrompt(customMsg.trim());
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* Expanded Chat Box Popup */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-[310px] sm:w-[350px] rounded-3xl glass-panel border-2 border-pink-200 dark:border-pink-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          {/* Header Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/brand-avatar.jpg"
                  alt="Tanu - Scoop Storey"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  <span>Scoop Storey Support</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Online • Replies in minutes</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFX.playPop(400);
                setIsOpen(false);
              }}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3 bg-white/90 dark:bg-[#1A1326]/90 max-h-[360px] overflow-y-auto">
            {/* Bubble Message */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-neutral-800 dark:text-neutral-200 text-xs leading-relaxed space-y-1">
              <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <span>👋 Welcome to Scoop Storey!</span>
              </p>
              <p>
                Have questions about our Kawaii charms, delivery PIN codes, or ASMR order packing? Tap a quick option below:
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Quick Questions
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPrompt(prompt.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-pink-50/60 hover:bg-pink-100/80 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 border border-pink-200/60 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition flex items-center justify-between group cursor-pointer"
                  >
                    <span>{prompt.label}</span>
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question Input */}
            <form onSubmit={handleCustomSend} className="pt-1">
              <div className="relative">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!customMsg.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-40 cursor-pointer"
                  aria-label="Send WhatsApp message"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>

            <div className="pt-1 text-center">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Direct WhatsApp Helpline: +91 8199922653</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={handleOpen}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-95 transition-all cursor-pointer border-2 border-white/40"
        aria-label="Chat with Scoop Storey on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <WhatsAppIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        <span className="font-display font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline">
          Chat With Us
        </span>
      </button>
    </div>
  );
}
