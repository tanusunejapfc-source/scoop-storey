import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause,
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX,
  Sparkles, 
  Send, 
  Check,
  Video,
  ExternalLink
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { useStoreReels } from '../utils/reelsStore';
import InstagramIcon from './InstagramIcon';

export default function ReelsShowcase() {
  const { reels } = useStoreReels();
  const [likedReels, setLikedReels] = useState({});
  const [handleInput, setHandleInput] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  const toggleLike = (id, e) => {
    e?.stopPropagation();
    soundFX.playPop(700);
    setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTogglePlay = (id) => {
    const vid = videoRefs.current[id];
    if (!vid) return;

    if (playingId === id) {
      vid.pause();
      setPlayingId(null);
    } else {
      // Pause any previously playing video
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId].pause();
      }
      vid.play().catch(() => {});
      setPlayingId(id);
      soundFX.playPop(500);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    Object.values(videoRefs.current).forEach(vid => {
      if (vid) vid.muted = nextMuted;
    });
    soundFX.playPop(480);
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-[#E60067] dark:text-pink-300 text-xs font-black tracking-wider uppercase mb-2">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Viral ASMR & Packaging Feed</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
            Watch Us Pack on Instagram
          </h2>
          <p className="mt-2 text-[#554664] dark:text-[#E0D7EB] max-w-xl text-sm md:text-base font-medium">
            Satisfying ASMR sounds, custom orders, and live scoop streams. Follow 
            <a 
              href="https://www.instagram.com/bhaskar_scoopstorey/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E60067] dark:text-pink-400 font-extrabold ml-1 hover:underline"
            >
              @bhaskar_scoopstorey
            </a> for daily packing bliss across India.
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

      {/* Reels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reels.map((reel) => {
          const isLiked = likedReels[reel.id];
          const hasVideo = Boolean(reel.videoUrl && reel.videoUrl !== '__STORED_IN_INDEXEDDB__');
          const isCurrentPlaying = playingId === reel.id;

          return (
            <div
              key={reel.id}
              onClick={() => hasVideo && handleTogglePlay(reel.id)}
              className={`relative aspect-[9/16] rounded-3xl overflow-hidden shadow-xl border-2 border-pink-200 dark:border-pink-900/60 group bg-neutral-900 transition-all ${
                hasVideo ? 'cursor-pointer' : ''
              }`}
            >
              {/* Media: Video or Image */}
              {hasVideo ? (
                <video
                  ref={(el) => { videoRefs.current[reel.id] = el; }}
                  src={reel.videoUrl}
                  poster={reel.image}
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={reel.image || '/images/asmr-packing.jpg'}
                  alt={reel.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { 
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/brand-avatar.jpg'; 
                  }}
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

              {/* Play / Pause Big Center Indicator for Videos */}
              {hasVideo && (
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity pointer-events-none ${
                  isCurrentPlaying ? 'opacity-0 group-hover:opacity-80' : 'opacity-90'
                }`}>
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-2xl border border-white/30 transform transition-transform group-hover:scale-110">
                    {isCurrentPlaying ? (
                      <Pause className="w-6 h-6 fill-white" />
                    ) : (
                      <Play className="w-6 h-6 fill-white ml-1" />
                    )}
                  </div>
                </div>
              )}

              {/* Top Bar: View Count + Avatar + Mute Toggle */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold z-10">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  <Play className="w-3 h-3 fill-white" />
                  <span>{reel.views || '500K'} views</span>
                </div>

                <div className="flex items-center gap-2">
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:scale-110 transition cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink-400" />}
                    </button>
                  )}
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white/40 shadow-sm shrink-0">
                    <img src="/brand-avatar.jpg" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Right Side Social Actions */}
              <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4 z-20">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => toggleLike(reel.id, e)}
                  className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform cursor-pointer"
                >
                  <div className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                    isLiked ? 'bg-[#E60067] text-white shadow-md' : 'bg-black/50 text-white'
                  }`}>
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold">{reel.likes || '45K'}</span>
                </button>

                {/* Comment Counter */}
                <div className="flex flex-col items-center gap-1 text-white">
                  <div className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold">{reel.comments || '1.2K'}</span>
                </div>

                {/* Direct Instagram Link */}
                <a
                  href={reel.instagramUrl || "https://www.instagram.com/bhaskar_scoopstorey/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Open on Instagram"
                  className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:scale-110 transition-transform cursor-pointer hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600"
                  title="Open on Instagram"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              </div>

              {/* Bottom Caption & Audio */}
              <div className="absolute bottom-4 left-4 right-16 text-white z-10">
                <h4 className="font-display font-bold text-sm leading-snug line-clamp-2">
                  {reel.title}
                </h4>
                {reel.tag && (
                  <div className="text-[11px] text-pink-300 font-semibold mt-1 truncate">
                    {reel.tag}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-white/90 mt-2 font-mono truncate">
                  <Volume2 className="w-3 h-3 shrink-0 animate-pulse text-yellow-300" />
                  <span className="truncate">{reel.audio || 'Original Audio • Bhaskar ASMR'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "Film My Scoop on Instagram" Request Bar */}
      <div className="mt-12 rounded-3xl bg-white dark:bg-[#1E172E] p-6 md:p-8 border-2 border-pink-200 dark:border-pink-900/60 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#E60067] dark:text-pink-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Feature</span>
          </div>
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#231733] dark:text-white">
            Want Bhaskar to film your order on an Instagram Reel?
          </h3>
          <p className="text-xs md:text-sm text-[#554664] dark:text-[#D5CBE2] mt-1 max-w-xl font-medium">
            Drop your Instagram username when checking out or submit below. We will tag you in the order packing Reel!
          </p>
        </div>

        <form onSubmit={handleSendRequest} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-sm">
              @
            </span>
            <input
              type="text"
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              placeholder="your_insta_username"
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-pink-50/50 dark:bg-neutral-800 border-2 border-pink-200 dark:border-pink-800 text-sm text-[#231733] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
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
