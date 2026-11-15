import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  Crown, 
  Star, 
  Heart, 
  ExternalLink, 
  ArrowRight, 
  FileText, 
  Save, 
  X, 
  Check, 
  Calendar,
  Clock,
  Filter
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import WhatsAppIcon from '../WhatsAppIcon';

const CRM_NOTES_KEY = 'bhaskar_customer_crm_notes_v1';

export default function AdminCustomerCRM({
  orders = [],
  onNavigateToOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'vip' | 'repeat' | 'new'
  const [sortBy, setSortBy] = useState('spent-high'); // 'spent-high' | 'orders-high' | 'recent'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerNotes, setCustomerNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(CRM_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [noteDraft, setNoteDraft] = useState('');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  // Aggregate Customer Profiles from Order Records
  const customers = useMemo(() => {
    const customerMap = {};

    orders.forEach(ord => {
      const phone = ord.customer?.phone?.trim() || 'No Phone';
      const name = ord.customer?.fullName?.trim() || 'Valued Customer';
      const orderTotal = Number(ord.totalINR) || 0;
      const orderTimestamp = ord.timestamp || Date.now();

      if (!customerMap[phone]) {
        customerMap[phone] = {
          phone,
          fullName: name,
          city: ord.customer?.city || 'India',
          state: ord.customer?.state || '',
          streetAddress: ord.customer?.streetAddress || '',
          pincode: ord.customer?.pincode || '',
          totalOrders: 0,
          totalSpent: 0,
          firstOrderTime: orderTimestamp,
          lastOrderTime: orderTimestamp,
          orders: [],
          reelHandles: new Set(),
          categoriesBought: new Set()
        };
      }

      const c = customerMap[phone];
      c.totalOrders += 1;
      c.totalSpent += orderTotal;
      if (orderTimestamp < c.firstOrderTime) c.firstOrderTime = orderTimestamp;
      if (orderTimestamp > c.lastOrderTime) c.lastOrderTime = orderTimestamp;
      c.orders.push(ord);

      if (ord.filmOnReel) {
        c.reelHandles.add(ord.filmOnReel);
      }

      (ord.items || []).forEach(item => {
        if (item.name) c.categoriesBought.add(item.name);
      });
    });

    return Object.values(customerMap).map(c => {
      const isVIP = c.totalSpent >= 2500 || c.totalOrders >= 3;
      const isRepeat = c.totalOrders >= 2 && !isVIP;
      const tier = isVIP ? 'vip' : isRepeat ? 'repeat' : 'new';

      return {
        ...c,
        tier,
        aov: c.totalOrders > 0 ? Math.round(c.totalSpent / c.totalOrders) : 0,
        reelHandle: Array.from(c.reelHandles)[0] || null
      };
    });
  }, [orders]);

  // Filter and Sort Customers
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return customers
      .filter(c => {
        const matchesQuery = 
          !q ||
          c.fullName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.city.toLowerCase().includes(q) ||
          (c.reelHandle && c.reelHandle.toLowerCase().includes(q));

        const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
        return matchesQuery && matchesTier;
      })
      .sort((a, b) => {
        if (sortBy === 'spent-high') return b.totalSpent - a.totalSpent;
        if (sortBy === 'orders-high') return b.totalOrders - a.totalOrders;
        if (sortBy === 'recent') return b.lastOrderTime - a.lastOrderTime;
        return 0;
      });
  }, [customers, searchQuery, tierFilter, sortBy]);

  // Overall CRM Stats
  const crmStats = useMemo(() => {
    const totalCount = customers.length;
    const vipCount = customers.filter(c => c.tier === 'vip').length;
    const repeatCount = customers.filter(c => c.tier === 'repeat' || c.tier === 'vip').length;
    const repeatRate = totalCount > 0 ? Math.round((repeatCount / totalCount) * 100) : 0;
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgLTV = totalCount > 0 ? Math.round(totalRevenue / totalCount) : 0;

    return { totalCount, vipCount, repeatRate, avgLTV };
  }, [customers]);

  const handleOpenCustomer = (cust) => {
    soundFX.playPop(550);
    setSelectedCustomer(cust);
    setNoteDraft(customerNotes[cust.phone] || '');
  };

  const handleSaveNote = () => {
    if (!selectedCustomer) return;
    const updated = {
      ...customerNotes,
      [selectedCustomer.phone]: noteDraft
    };
    setCustomerNotes(updated);
    try {
      localStorage.setItem(CRM_NOTES_KEY, JSON.stringify(updated));
    } catch {}
    soundFX.playChime();
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Top CRM Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-pink-500/5 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-neutral-900/40 border border-pink-200/80 dark:border-pink-900/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-[#E60067] flex items-center justify-center text-white shadow-md shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-[#231733] dark:text-white">
                Customer Relationship & Lifetime Value (LTV) Hub
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-[10px]">
                {customers.length} Profiles
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Track repeat buyers, order histories, WhatsApp outreach & private merchant notes
            </p>
          </div>
        </div>

        {/* Global CRM Metric Pills */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-center shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Repeat Rate</span>
            <span className="text-xs font-black text-purple-600 dark:text-purple-400">{crmStats.repeatRate}%</span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-center shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">VIP Royalty</span>
            <span className="text-xs font-black text-amber-500">{crmStats.vipCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-center shadow-xs">
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Avg LTV</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{crmStats.avgLTV}</span>
          </div>
        </div>
      </div>

      {/* Search & Tier Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1E172E] p-3 rounded-2xl border border-pink-200/80 dark:border-pink-900/60 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#E60067] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, city, or Instagram..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-100 dark:border-neutral-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Tier Filter */}
          <div className="flex items-center gap-1 bg-pink-50/60 dark:bg-neutral-900 p-1 rounded-xl border border-pink-100 dark:border-neutral-800">
            {[
              { id: 'all', label: 'All' },
              { id: 'vip', label: '👑 VIP' },
              { id: 'repeat', label: '🌟 Repeat' },
              { id: 'new', label: '🌸 New' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTierFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  tierFilter === tab.id
                    ? 'bg-[#E60067] text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#E60067]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-pink-50/60 dark:bg-neutral-900 border border-pink-100 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="spent-high">Highest Spend</option>
            <option value="orders-high">Most Orders</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white dark:bg-[#1E172E] rounded-3xl border-2 border-pink-100 dark:border-pink-900/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pink-50/70 dark:bg-neutral-900/70 text-neutral-500 font-extrabold uppercase tracking-wider border-b border-pink-100 dark:border-pink-900/40">
              <tr>
                <th className="p-3.5 sm:p-4">Customer</th>
                <th className="p-3.5 sm:p-4">Location</th>
                <th className="p-3.5 sm:p-4">Tier Status</th>
                <th className="p-3.5 sm:p-4">Orders</th>
                <th className="p-3.5 sm:p-4">Total LTV Spend</th>
                <th className="p-3.5 sm:p-4">Last Active</th>
                <th className="p-3.5 sm:p-4 text-right">Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100/60 dark:divide-pink-900/40">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 text-xs">
                    No customers found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const hasNote = !!customerNotes[cust.phone];

                  return (
                    <tr 
                      key={cust.phone}
                      onClick={() => handleOpenCustomer(cust)}
                      className="hover:bg-pink-50/50 dark:hover:bg-neutral-800/60 transition cursor-pointer group"
                    >
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm shrink-0 ${
                            cust.tier === 'vip' 
                              ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-sm'
                              : cust.tier === 'repeat'
                              ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white'
                              : 'bg-pink-100 dark:bg-neutral-800 text-[#E60067] dark:text-pink-300'
                          }`}>
                            {cust.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors">
                                {cust.fullName}
                              </span>
                              {hasNote && (
                                <span className="w-2 h-2 rounded-full bg-purple-500" title="Has Merchant Note" />
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              +91 {cust.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 font-semibold text-neutral-600 dark:text-neutral-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{cust.city || 'India'}</span>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          cust.tier === 'vip'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            : cust.tier === 'repeat'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {cust.tier === 'vip' && <Crown className="w-3 h-3 text-amber-600" />}
                          {cust.tier === 'repeat' && <Star className="w-3 h-3 text-purple-600" />}
                          <span>{cust.tier === 'vip' ? 'VIP Royalty' : cust.tier === 'repeat' ? 'Repeat Buyer' : 'New Collector'}</span>
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4 font-extrabold text-neutral-800 dark:text-neutral-200">
                        {cust.totalOrders} order{cust.totalOrders > 1 ? 's' : ''}
                      </td>

                      <td className="p-3.5 sm:p-4 font-display font-extrabold text-[#E60067] dark:text-pink-400">
                        ₹{cust.totalSpent.toLocaleString('en-IN')}
                        <span className="text-[10px] text-neutral-400 font-medium block">
                          (AOV: ₹{cust.aov})
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4 text-neutral-500 text-[11px]">
                        {new Date(cust.lastOrderTime).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>

                      <td className="p-3.5 sm:p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`https://wa.me/91${cust.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${cust.fullName}! 🎀 Thank you for being such a wonderful part of Scoop Storey! Let us know if you need any assistance with your order.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition"
                          title="Message on WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-end animate-fadeIn"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="w-full max-w-lg h-full bg-white dark:bg-[#1E172E] shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between border-l border-pink-200 dark:border-neutral-800 animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-pink-100 dark:border-pink-900/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 flex items-center justify-center font-display font-extrabold text-xl text-white shadow-md">
                    {selectedCustomer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#231733] dark:text-white">
                      {selectedCustomer.fullName}
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono">
                      +91 {selectedCustomer.phone}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 rounded-xl hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-pink-50/60 dark:bg-neutral-900/60 border border-pink-100 dark:border-pink-900/40 text-center">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Lifetime Value</span>
                  <span className="text-sm font-black text-[#E60067] dark:text-pink-400">
                    ₹{selectedCustomer.totalSpent}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Total Orders</span>
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                    {selectedCustomer.totalOrders}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Avg Order (AOV)</span>
                  <span className="text-sm font-black text-amber-500">
                    ₹{selectedCustomer.aov}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-pink-900/40 space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">Default Shipping Address</span>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                  {selectedCustomer.streetAddress}
                </p>
                <p className="text-xs text-neutral-500">
                  {selectedCustomer.city}, {selectedCustomer.state} - {selectedCustomer.pincode}
                </p>
                {selectedCustomer.reelHandle && (
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#E60067]">
                    <span>🎬 Reel Mention:</span>
                    <span className="underline">{selectedCustomer.reelHandle}</span>
                  </div>
                )}
              </div>

              {/* Internal Private Merchant Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#231733] dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-500" />
                    <span>Internal Merchant Notes</span>
                  </span>
                  {noteSavedToast && (
                    <span className="text-[10px] font-bold text-emerald-600 animate-fadeIn flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Saved!
                    </span>
                  )}
                </div>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add private customer notes (e.g., Prefers extra free charms, Reel requested, Birthday on Dec 12)..."
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Note</span>
                </button>
              </div>

              {/* Order History Timeline */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold text-[#231733] dark:text-white block">
                  Past Orders ({selectedCustomer.orders.length})
                </span>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {selectedCustomer.orders.map((ord) => (
                    <div 
                      key={ord.orderId}
                      onClick={() => {
                        setSelectedCustomer(null);
                        onNavigateToOrder(ord.orderId);
                      }}
                      className="p-3 rounded-2xl border border-pink-100 dark:border-pink-900/40 hover:bg-pink-50/70 dark:hover:bg-neutral-800 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-[#231733] dark:text-white group-hover:text-[#E60067]">
                            #{ord.orderId}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(ord.timestamp || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          {ord.items?.length || 1} item{ord.items?.length > 1 ? 's' : ''} • {ord.status || 'Received'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-extrabold text-xs text-[#E60067]">
                          ₹{ord.totalINR}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Outreach Bar */}
            <div className="pt-4 border-t border-pink-100 dark:border-pink-900/40">
              <a
                href={`https://wa.me/91${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedCustomer.fullName}! 🎀 This is Scoop Storey. We're getting in touch regarding your orders!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Open WhatsApp Direct Chat</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
