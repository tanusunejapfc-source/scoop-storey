import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  Tag, 
  Radio, 
  Eye, 
  Megaphone,
  Palette,
  Power
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import { fetchConfigFromCloud, syncConfigToCloud } from '../../utils/apiClient';

export const COUPONS_STORAGE_KEY = 'bhaskar_store_coupons_v1';
export const ANNOUNCEMENT_STORAGE_KEY = 'bhaskar_announcement_cms_v1';

export async function syncDiscountsToCloud(couponsData, announcementData) {
  try {
    const payload = {
      coupons: couponsData,
      announcement: announcementData,
      updatedAt: new Date().toISOString()
    };
    await syncConfigToCloud('discounts', payload);
  } catch {}
}

export async function fetchDiscountsFromCloud() {
  if (typeof window === 'undefined') return null;
  try {
    const data = await fetchConfigFromCloud('discounts');
    if (data && typeof data === 'object') {
      if (Array.isArray(data.coupons)) {
        try { localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(data.coupons)); } catch {}
      }
      if (data.announcement) {
        try { localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(data.announcement)); } catch {}
        window.dispatchEvent(new CustomEvent('scoop_announcement_updated', { detail: data.announcement }));
      }
      return data;
    }
  } catch {}
  return null;
}

export const INITIAL_COUPONS = [
  { id: 'c1', code: 'PINK10', type: 'percent', value: 10, minSpend: 999, maxUses: 100, active: true },
  { id: 'c2', code: 'SCOOP50', type: 'flat', value: 50, minSpend: 699, maxUses: 500, active: true },
  { id: 'c3', code: 'FREESHIP', type: 'shipping', value: 0, minSpend: 1499, maxUses: 200, active: true }
];

export const INITIAL_ANNOUNCEMENT = {
  enabled: true,
  text: '🌸 PREPAID EXCLUSIVE: Free Extra Mystery Charm on every order above ₹999! • All-India Express Courier Dispatch ✈️',
  bgTheme: 'pink' // 'pink' | 'purple' | 'gold' | 'black'
};

export default function AdminDiscountsCMS() {
  // Coupons State
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState('percent');
  const [newValue, setNewValue] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(799);
  const [newMaxUses, setNewMaxUses] = useState(100);
  const [toastMsg, setToastMsg] = useState('');

  // Announcement CMS State
  const [announcement, setAnnouncement] = useState(() => {
    try {
      const saved = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENT;
    } catch {
      return INITIAL_ANNOUNCEMENT;
    }
  });

  useEffect(() => {
    fetchDiscountsFromCloud().then(data => {
      if (data) {
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
        if (data.announcement) setAnnouncement(data.announcement);
      }
    });
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSaveAnnouncement = () => {
    try {
      localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, JSON.stringify(announcement));
      window.dispatchEvent(new CustomEvent('scoop_announcement_updated', { detail: announcement }));
    } catch {}
    syncDiscountsToCloud(coupons, announcement);
    soundFX.playPop(650);
    soundFX.playChime();
    showToast('Announcement Bar updated live across all devices!');
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const codeClean = newCode.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
    const created = {
      id: `c-${Date.now().toString().slice(-6)}`,
      code: codeClean,
      type: newType,
      value: Number(newValue) || 0,
      minSpend: Number(newMinSpend) || 0,
      maxUses: Number(newMaxUses) || 50,
      active: true
    };

    const updated = [created, ...coupons];
    setCoupons(updated);
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    syncDiscountsToCloud(updated, announcement);

    setNewCode('');
    soundFX.playPop(700);
    showToast(`Coupon ${codeClean} created and synced live!`);
  };

  const handleToggleCoupon = (id) => {
    const updated = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    setCoupons(updated);
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    syncDiscountsToCloud(updated, announcement);
    soundFX.playPop(500);
  };

  const handleDeleteCoupon = (id) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    syncDiscountsToCloud(updated, announcement);
    soundFX.playPop(400);
    showToast('Coupon removed across all devices');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Section 1: Storefront Live Announcement Bar CMS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-[#E60067] dark:text-pink-300">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
                Live Storefront Announcement Ticker (CMS)
              </h3>
              <p className="text-xs text-neutral-500">
                Update the promotional banner running across the top of your shop in real time
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
              {announcement.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <input
              type="checkbox"
              checked={announcement.enabled}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, enabled: e.target.checked }))}
              className="w-5 h-5 accent-[#E60067] rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Ticker Text Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block">
            Announcement Text / Offer Message
          </label>
          <textarea
            value={announcement.text}
            onChange={(e) => setAnnouncement(prev => ({ ...prev, text: e.target.value }))}
            rows={2}
            className="w-full p-3 rounded-2xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-400"
            placeholder="e.g. Free Extra Charm on orders above ₹999..."
          />
        </div>

        {/* Ticker Theme Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-pink-100 dark:border-pink-900/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500">Banner Theme:</span>
            {[
              { id: 'pink', label: '🌸 Pink Glam', bg: 'bg-gradient-to-r from-pink-500 to-purple-600' },
              { id: 'gold', label: '✨ 24K Gold', bg: 'bg-gradient-to-r from-amber-500 to-amber-700' },
              { id: 'black', label: '🖤 Luxe Noir', bg: 'bg-gradient-to-r from-neutral-900 to-neutral-800' }
            ].map(thm => (
              <button
                key={thm.id}
                type="button"
                onClick={() => setAnnouncement(prev => ({ ...prev, bgTheme: thm.id }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  announcement.bgTheme === thm.id
                    ? 'border-2 border-[#E60067] text-[#E60067] bg-pink-50 dark:bg-neutral-800 shadow-xs'
                    : 'border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <span>{thm.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSaveAnnouncement}
            className="py-2 px-4 rounded-xl bg-[#E60067] hover:bg-pink-700 text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-md transition self-start sm:self-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Ticker to Live Shop</span>
          </button>
        </div>
      </div>

      {/* Section 2: Promotional Coupons Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Coupon Form */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#E60067]" />
            <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
              Create New Coupon Code
            </h3>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. FESTIVE15"
                className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-mono font-bold uppercase focus:outline-none focus:ring-1 focus:ring-pink-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Discount Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-bold focus:outline-none"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Cash (₹)</option>
                  <option value="shipping">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Value ({newType === 'percent' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  min="0"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Min Spend (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                  Max Uses
                </label>
                <input
                  type="number"
                  min="1"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-bold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl btn-3d-pink text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Promotional Coupon</span>
            </button>
          </form>
        </div>

        {/* Active Coupons List */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
                Active Promo Codes & Rules ({coupons.length})
              </h3>
              <p className="text-xs text-neutral-500">
                Coupons validated automatically in customer shopping bag
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {coupons.map((c) => (
              <div 
                key={c.id}
                className="p-3.5 rounded-2xl border border-pink-100 dark:border-pink-900/40 hover:bg-pink-50/50 dark:hover:bg-neutral-800 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-neutral-800 text-[#E60067] dark:text-pink-300 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-pink-200 dark:border-neutral-700">
                    %
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#231733] dark:text-white">
                        {c.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {c.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      {c.type === 'percent' ? `${c.value}% Off` : c.type === 'flat' ? `₹${c.value} Flat Off` : 'Free Shipping'} • Min Spend: ₹{c.minSpend} • Max: {c.maxUses} uses
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleCoupon(c.id)}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    {c.active ? 'Pause' : 'Activate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
