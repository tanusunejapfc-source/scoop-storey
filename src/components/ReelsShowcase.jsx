import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  Sparkles, 
  Send, 
  Check 
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { soundFX } from '../utils/audio';

const REELS = [
  {
    id: 'reel-1',
    title: 'Packing 5x Scoop Order for @aaradhya_k 🎀',
    views: '482K',
    likes: '42.8K',
    comments: '1,280',
    audio: 'Original Audio - Bhaskar Scoop Storey (ASMR)',
    tag: '#mysteryscoop #asmrpacking #satisfying',
    image: '/images/asmr-packing.jpg'
  },
  {
    id: 'reel-2',
    title: 'The Golden Scoop Dip: 3x Bear Loot Drop! ✨',
    views: '890K',
    likes: '78.2K',
    comments: '2,410',
    audio: 'Pure ASMR Charm Clinks • Bhaskar',
    tag: '#kawaiicharms #resinart #scoopstorey',
    image: '/images/scoop-bowl.jpg'
  },
  {
    id: 'reel-3',
    title: 'DIY Beaded Phone Strap Tutorial & Order Packing 📱',
    views: '320K',
    likes: '29.4K',
    comments: '890',
    audio: 'Pastel Dreams Chill Beats • Bhaskar',
    tag: '#phonestrap #y2kcharms #crafttok',
    image: '/images/charm-bracelets.jpg'
  },
  {
    id: 'reel-4',
    title: 'Opening the Royal Collector Vault Gift Box 👑',
    views: '1.2M',
    likes: '115K',
    comments: '3,840',
    audio: 'Unboxing Happiness • Bhaskar Scoop Storey',
    tag: '#blindbox #unboxinghappiness #kawaiiaesthetic',
    image: '/images/deluxe-giftbox.jpg'
  }
];

export default function ReelsShowcase() {
  const [activeReel, setActiveReel] = useState(null);
  const [likedReels, setLikedReels] = useState({});
  const [handleInput, setHandleInput] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const toggleLike = (id) => {
    soundFX.playPop(700);
    setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!handleInput.trim()) return;
    soundFX.playSuccess();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setHandleInput('');
    }, 4000);
  };

  return (
    <section id="reels" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel text-pink-600 dark:text-pink-300 text-xs font-bold tracking-wider uppercase mb-2">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Viral ASMR & Packaging Feed</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900 dark:text-white">
            Watch Us Pack on Instagram
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300 max-w-xl text-sm md:text-base">
            Satisfying ASMR sounds, custom orders, and live scoop streams. Follow 
            <a 
              href="https://www.instagram.com/bhaskar_scoopstorey/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-400 font-bold ml-1 hover:underline"
            >
              @bhaskar_scoopstorey
            </a> for daily packing bliss.
          </p>
        </div>

        <a
          href="https://www.instagram.com/bhaskar_scoopstorey/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundFX.playPop(520)}
          className="btn-3d-pink text-white px-5 py-3 rounded-2xl font-display font-bold text-sm flex items-center gap-2 self-start md:self-auto"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>Follow 124+ Posts on IG</span>
        </a>
      </div>

      {/* Reels Grid (Styled like vertical phone screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {REELS.map((reel) => {
          const isLiked = likedReels[reel.id];
          return (
            <div
              key={reel.id}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl border border-pink-200/60 dark:border-pink-900/40 group bg-neutral-900"
            >
              {/* Background Media */}
              <img
                src={reel.image}
                alt={reel.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

              {/* Top Meta: View Count & Brand */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold z-10">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <Play className="w-3 h-3 fill-white" />
                  <span>{reel.views} views</span>
                </div>
                <div className="w-7 h-7 rounded-full overflow-hidden border border-white/40 shadow-sm">
                  <img src="/brand-avatar.jpg" alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Side Interaction Icons (Like, Comment, Share) */}
              <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-20">
                <button
                  onClick={() => toggleLike(reel.id)}
                  className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
                >
                  <div className={`p-2.5 rounded-full backdrop-blur-md ${isLiked ? 'bg-pink-500 text-white' : 'bg-black/40 text-white'}`}>
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold">{reel.likes}</span>
                </button>

                <div className="flex flex-col items-center gap-1 text-white">
                  <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold">{reel.comments}</span>
                </div>

                <a
                  href="https://www.instagram.com/bhaskar_scoopstorey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:scale-110 transition-transform"
                >
                  <Share2 className="w-5 h-5" />
                </a>
              </div>

              {/* Bottom Caption & Audio */}
              <div className="absolute bottom-4 left-4 right-16 text-white z-10">
                <h4 className="font-display font-bold text-sm leading-snug line-clamp-2">
                  {reel.title}
                </h4>
                <div className="text-[11px] text-pink-300 font-medium mt-1">
                  {reel.tag}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/80 mt-2 font-mono truncate">
                  <Volume2 className="w-3 h-3 shrink-0 animate-pulse text-yellow-300" />
                  <span className="truncate">{reel.audio}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Film My Scoop on Instagram" Request Bar */}
      <div className="mt-12 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/15 to-orange-500/10 p-6 md:p-8 border border-pink-200/80 dark:border-pink-900/50 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Feature</span>
          </div>
          <h3 className="text-xl md:text-2xl font-display font-bold text-neutral-900 dark:text-white">
            Want Bhaskar to film your mystery scoop on Instagram?
          </h3>
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-xl">
            Drop your Instagram username when checking out or submit below. We will tag you in the order packing Reel!
          </p>
        </div>

        <form onSubmit={handleSendRequest} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
              @
            </span>
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="your_insta_username"
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-pink-800 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto btn-3d-pink text-white px-5 py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {requestSent ? (
              <>
                <Check className="w-4 h-4 text-yellow-300" />
                <span>Tagged for next Reel!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Request Film On Reel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
