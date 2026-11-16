import React from 'react';
import { 
  BarChart3, 
  Activity,
  Receipt, 
  Package, 
  Tags, 
  Boxes, 
  Users, 
  Percent, 
  Star,
  Video, 
  QrCode, 
  Bell, 
  Key, 
  Lock, 
  Search, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  orders = [],
  products = [],
  reels = [],
  categoriesCount = 0,
  pendingOrdersCount = 0,
  pendingReviewsCount = 0,
  isCollapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  onLock,
  onClose
}) {
  const navSections = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
        { 
          id: 'analytics', 
          label: 'Analytics & Live View', 
          icon: Activity, 
          badge: 'LIVE', 
          badgeColor: 'bg-emerald-500 text-white animate-pulse' 
        }
      ]
    },
    {
      group: 'SALES & CLIENTS',
      items: [
        { 
          id: 'orders', 
          label: 'Orders & Shipping', 
          icon: Receipt, 
          badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : null,
          badgeColor: 'bg-[#E60067] text-white'
        },
        { id: 'customers', label: 'Customer CRM', icon: Users, badge: null }
      ]
    },
    {
      group: 'CATALOG & STOCK',
      items: [
        { id: 'products', label: 'Products', icon: Package, badge: `${products.length}`, badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400' },
        { id: 'categories', label: 'Categories & Merge', icon: Tags, badge: categoriesCount ? `${categoriesCount}` : null },
        { id: 'inventory', label: 'Stock & Inventory', icon: Boxes, badge: null }
      ]
    },
    {
      group: 'GROWTH & CMS',
      items: [
        { 
          id: 'reviews', 
          label: 'Ratings & Reviews', 
          icon: Star, 
          badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : null,
          badgeColor: 'bg-amber-500 text-white animate-pulse'
        },
        { id: 'discounts', label: 'Coupons & CMS', icon: Percent, badge: null },
        { id: 'reels', label: 'ASMR Reels Studio', icon: Video, badge: reels.length ? `${reels.length}` : null }
      ]
    },
    {
      group: 'CONFIGURATION',
      items: [
        { id: 'payments', label: 'UPI & Payments', icon: QrCode, badge: null },
        { id: 'alerts', label: 'Alerts & Webhooks', icon: Bell, badge: null },
        { id: 'security', label: 'Passcode & Access', icon: Key, badge: null }
      ]
    }
  ];

  return (
    <aside 
      className={`h-full bg-white dark:bg-[#160E22] border-r border-pink-200/80 dark:border-pink-900/40 flex flex-col justify-between transition-all duration-300 select-none shrink-0 ${
        isCollapsed ? 'w-16 sm:w-20' : 'w-64 sm:w-72'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-2">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-display font-extrabold text-xs sm:text-sm text-[#231733] dark:text-white truncate">
                    Scoop Storey OS
                  </h1>
                </div>
                <span className="px-1.5 py-0.2 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold text-[9px] uppercase tracking-wider inline-block">
                  v2.4 Enterprise
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sliders className="w-4 h-4" />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden sm:flex p-1.5 rounded-xl hover:bg-pink-50 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Command Palette Trigger Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className={`w-full py-2 px-2.5 rounded-2xl bg-pink-50/70 hover:bg-pink-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-pink-200/80 dark:border-pink-900/60 text-neutral-500 dark:text-neutral-400 text-xs font-semibold flex items-center transition shadow-xs group ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title="Press Ctrl+K to search anything"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-[#E60067] dark:text-pink-400 shrink-0" />
              {!isCollapsed && <span className="truncate">Quick Search...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-[10px] font-mono font-bold text-neutral-400">
                Ctrl+K
              </kbd>
            )}
          </button>
        </div>

        {/* Nav Links Sections */}
        <nav className="px-3 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-none">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {sec.group}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      soundFX.playPop(500);
                    }}
                    className={`w-full py-2 px-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E60067] to-purple-600 text-white shadow-md'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-pink-50/80 dark:hover:bg-neutral-900/80 hover:text-[#E60067]'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#E60067] dark:text-pink-400'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-neutral-800 text-[#E60067] dark:text-pink-300')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-pink-100 dark:border-pink-900/40 bg-pink-50/30 dark:bg-neutral-900/30 space-y-2">
        {!isCollapsed && (
          <div className="px-2 py-1 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Online</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400">SSL • AES-256</span>
          </div>
        )}

        <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col' : ''}`}>
          <button
            type="button"
            onClick={onLock}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-neutral-800 transition flex items-center gap-1.5 ${
              isCollapsed ? 'w-full justify-center' : 'flex-1'
            }`}
            title="Lock Admin Session"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Lock Session</span>}
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:text-[#E60067] hover:bg-pink-100/60 dark:hover:bg-neutral-800 transition flex items-center gap-1.5 ${
              isCollapsed ? 'w-full justify-center' : 'flex-1 justify-center'
            }`}
            title="Exit Admin Panel"
          >
            <X className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Exit Portal</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
