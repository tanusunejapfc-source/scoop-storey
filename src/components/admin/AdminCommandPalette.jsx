import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Receipt, 
  Package, 
  Tags, 
  Plus, 
  QrCode, 
  Video, 
  Key, 
  Bell, 
  BarChart3, 
  Activity,
  Users, 
  Boxes, 
  Percent, 
  Star,
  Download,
  RotateCcw,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function AdminCommandPalette({
  isOpen,
  onClose,
  onNavigate,
  orders = [],
  products = [],
  onStartNewProduct,
  onExportJSON,
  onResetDefaults
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Compute matched results
  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = [];

    // Navigation Pages
    const navItems = [
      { id: 'dashboard', title: 'Executive Dashboard', subtitle: 'Revenue, KPIs & Bestsellers', icon: BarChart3, category: 'Navigation', action: () => onNavigate('dashboard') },
      { id: 'analytics', title: 'Analytics & Live View', subtitle: 'Live visitors, conversion funnel & traffic sources', icon: Activity, category: 'Navigation', action: () => onNavigate('analytics') },
      { id: 'orders', title: 'Orders & Fulfillment', subtitle: `${orders.length} total orders recorded`, icon: Receipt, category: 'Navigation', action: () => onNavigate('orders') },
      { id: 'customers', title: 'Customer CRM & LTV', subtitle: 'Customer directory, lifetime value & WhatsApp', icon: Users, category: 'Navigation', action: () => onNavigate('customers') },
      { id: 'inventory', title: 'Stock & Inventory Control', subtitle: 'Low stock alerts and batch quantity updates', icon: Boxes, category: 'Navigation', action: () => onNavigate('inventory') },
      { id: 'products', title: 'Products Catalog', subtitle: `${products.length} products live in store`, icon: Package, category: 'Navigation', action: () => onNavigate('products') },
      { id: 'categories', title: 'Categories & Merge Manager', subtitle: 'Organize and merge store departments', icon: Tags, category: 'Navigation', action: () => onNavigate('categories') },
      { id: 'discounts', title: 'Coupons & Storefront CMS', subtitle: 'Manage promo codes and top announcement ticker', icon: Percent, category: 'Navigation', action: () => onNavigate('discounts') },
      { id: 'reviews', title: 'Ratings & Customer Reviews', subtitle: 'Moderate reviews and upload custom customer feedback', icon: Star, category: 'Navigation', action: () => onNavigate('reviews') },
      { id: 'payments', title: 'UPI & QR Payment Settings', subtitle: 'Manage merchant UPI ID and QR code', icon: QrCode, category: 'Navigation', action: () => onNavigate('payments') },
      { id: 'reels', title: 'ASMR Reels Studio', subtitle: 'Upload videos and manage Instagram reels', icon: Video, category: 'Navigation', action: () => onNavigate('reels') },
      { id: 'alerts', title: 'Notification Alerts', subtitle: 'Configure Telegram & Email order dispatches', icon: Bell, category: 'Navigation', action: () => onNavigate('alerts') },
      { id: 'security', title: 'Passcode & Access Security', subtitle: 'Change admin password and lock timeout', icon: Key, category: 'Navigation', action: () => onNavigate('security') }
    ];

    navItems.forEach(item => {
      if (!q || item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.id.includes(q)) {
        list.push(item);
      }
    });

    // Quick Actions
    const quickActions = [
      { id: 'action-new', title: 'Create New Product', subtitle: 'Add product photos, prices, colors & specifications', icon: Plus, category: 'Quick Actions', action: () => onStartNewProduct() },
      { id: 'action-export', title: 'Export Catalog Backup (JSON)', subtitle: 'Download a complete snapshot of all products', icon: Download, category: 'Quick Actions', action: () => onExportJSON() },
      { id: 'action-reset', title: 'Reset to Factory Defaults', subtitle: 'Restore original product catalog presets', icon: RotateCcw, category: 'Quick Actions', action: () => onResetDefaults() }
    ];

    quickActions.forEach(act => {
      if (!q || act.title.toLowerCase().includes(q) || act.subtitle.toLowerCase().includes(q)) {
        list.push(act);
      }
    });

    // Matching Orders (Top 5 matches)
    if (q) {
      const matchedOrders = orders.filter(o => 
        (o.orderId && o.orderId.toLowerCase().includes(q)) ||
        (o.customer?.fullName && o.customer.fullName.toLowerCase().includes(q)) ||
        (o.customer?.phone && o.customer.phone.includes(q)) ||
        (o.upiRefNumber && o.upiRefNumber.includes(q))
      ).slice(0, 5);

      matchedOrders.forEach(ord => {
        list.push({
          id: `order-${ord.orderId}`,
          title: `Order #${ord.orderId} — ₹${ord.totalINR}`,
          subtitle: `${ord.customer?.fullName || 'Customer'} • ${ord.status || 'Pending'} • ${ord.customer?.phone || ''}`,
          icon: ShoppingBag,
          category: 'Orders',
          action: () => onNavigate('orders', ord.orderId)
        });
      });

      // Matching Products (Top 5 matches)
      const matchedProducts = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      ).slice(0, 5);

      matchedProducts.forEach(prod => {
        list.push({
          id: `prod-${prod.id}`,
          title: `${prod.name} — ₹${prod.priceINR}`,
          subtitle: `${prod.category || 'Product'} • ${prod.colors?.length || 0} colors`,
          icon: Package,
          category: 'Products',
          action: () => onNavigate('products', prod.id)
        });
      });
    }

    return list;
  }, [query, orders, products, onNavigate, onStartNewProduct, onExportJSON, onResetDefaults]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        executeResult(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeResult = (item) => {
    soundFX.playPop(550);
    item.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#1A1325] rounded-3xl shadow-2xl border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden flex flex-col text-[#231733] dark:text-white"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-pink-100 dark:border-pink-900/40 bg-pink-50/40 dark:bg-neutral-900/50">
          <Search className="w-5 h-5 text-[#E60067] dark:text-pink-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, order #, customer, or product..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs sm:text-sm">
              No matching commands or records found for "{query}"
            </div>
          ) : (
            results.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeResult(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'hover:bg-pink-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-neutral-800 text-[#E60067] dark:text-pink-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm truncate">
                          {item.title}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-pink-100' : 'text-neutral-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 border-t border-pink-100 dark:border-pink-900/40 bg-pink-50/30 dark:bg-neutral-900/40 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px]">ENTER</kbd> to select</span>
          </div>
          <span className="font-bold text-[#E60067] dark:text-pink-400">Scoop Command Spotlight</span>
        </div>
      </div>
    </div>
  );
}
