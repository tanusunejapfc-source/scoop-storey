import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Sparkles, 
  ArrowUpDown, 
  RotateCcw,
  Package,
  Layers,
  Check,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { soundFX } from '../../utils/audio';

const INVENTORY_STORAGE_KEY = 'bhaskar_inventory_stock_levels_v1';

export default function AdminInventoryStock({
  products = [],
  onUpdateProduct,
  allCategoryNames = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out' | 'in'
  
  // Custom stock quantities stored per product ID (defaults to 20 units if unset)
  const [stockMap, setStockMap] = useState(() => {
    try {
      const saved = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed sensible initial stock
    const init = {};
    products.forEach((p, idx) => {
      init[p.id] = p.stockCount !== undefined ? p.stockCount : 15 + (idx % 20);
    });
    return init;
  });

  const [draftStocks, setDraftStocks] = useState({});
  const [draftPrices, setDraftPrices] = useState({});
  const [savedSuccessId, setSavedSuccessId] = useState(null);

  // Stock status helper
  const getStockStatus = (count) => {
    if (count <= 0) return { label: 'Sold Out', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300' };
    if (count <= 5) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300' };
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' };
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return products.filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      const matchesCat = selectedCat === 'All' || p.category === selectedCat;
      const count = draftStocks[p.id] !== undefined ? draftStocks[p.id] : (stockMap[p.id] ?? 15);

      let matchesStock = true;
      if (stockFilter === 'out') matchesStock = count <= 0;
      else if (stockFilter === 'low') matchesStock = count > 0 && count <= 5;
      else if (stockFilter === 'in') matchesStock = count > 5;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, selectedCat, stockFilter, draftStocks, stockMap]);

  // Overall Inventory Telemetry
  const inventoryMetrics = useMemo(() => {
    let totalItems = 0;
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      const count = stockMap[p.id] ?? 15;
      totalItems += count;
      totalValuation += count * (Number(p.priceINR) || 0);
      if (count <= 0) outOfStockCount++;
      else if (count <= 5) lowStockCount++;
    });

    return {
      skuCount: products.length,
      totalUnits: totalItems,
      totalValuation,
      lowStockCount,
      outOfStockCount
    };
  }, [products, stockMap]);

  const handleStockChange = (productId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setDraftStocks(prev => ({ ...prev, [productId]: num }));
  };

  const handlePriceChange = (productId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setDraftPrices(prev => ({ ...prev, [productId]: num }));
  };

  const handleSaveItem = (product) => {
    const newStock = draftStocks[product.id] !== undefined ? draftStocks[product.id] : (stockMap[product.id] ?? 15);
    const newPrice = draftPrices[product.id] !== undefined ? draftPrices[product.id] : product.priceINR;

    // Update stock map in localStorage
    const updatedMap = { ...stockMap, [product.id]: newStock };
    setStockMap(updatedMap);
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedMap));
    } catch {}

    // Update product via store action
    onUpdateProduct({
      ...product,
      priceINR: newPrice,
      stockCount: newStock,
      badge: newStock <= 0 ? 'Sold Out' : newStock <= 5 ? 'Low Stock ⚡' : product.badge
    });

    soundFX.playPop(650);
    soundFX.playChime();
    setSavedSuccessId(product.id);
    setTimeout(() => setSavedSuccessId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-amber-500/5 dark:from-amber-900/20 dark:via-pink-900/20 dark:to-neutral-900/40 border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#E60067] flex items-center justify-center text-white shadow-md shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-[#231733] dark:text-white">
                Inventory & Stock Management Command
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                {inventoryMetrics.skuCount} SKUs Tracked
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Bulk update inventory stock levels, prices and auto-trigger low stock badges
            </p>
          </div>
        </div>

        {/* Global Inventory Metrics */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 shadow-xs text-center">
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Total Units</span>
            <span className="text-xs font-black text-[#231733] dark:text-white">{inventoryMetrics.totalUnits}</span>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 shadow-xs text-center">
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Stock Value</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">₹{inventoryMetrics.totalValuation.toLocaleString('en-IN')}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-2xl border text-center shadow-xs ${
            inventoryMetrics.lowStockCount > 0 
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40' 
              : 'bg-white dark:bg-neutral-800 border-pink-200 dark:border-neutral-700'
          }`}>
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Low Stock</span>
            <span className="text-xs font-black text-amber-600">{inventoryMetrics.lowStockCount} items</span>
          </div>

          <div className={`px-3 py-1.5 rounded-2xl border text-center shadow-xs ${
            inventoryMetrics.outOfStockCount > 0 
              ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40' 
              : 'bg-white dark:bg-neutral-800 border-pink-200 dark:border-neutral-700'
          }`}>
            <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Sold Out</span>
            <span className="text-xs font-black text-rose-600">{inventoryMetrics.outOfStockCount} items</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#1E172E] p-3 rounded-2xl border border-pink-200/80 dark:border-pink-900/60 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#E60067] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKUs by name or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-100 dark:border-neutral-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Stock Filter Buttons */}
          <div className="flex items-center gap-1 bg-pink-50/60 dark:bg-neutral-900 p-1 rounded-xl border border-pink-100 dark:border-neutral-800">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'low', label: '⚡ Low Stock' },
              { id: 'out', label: '❌ Sold Out' },
              { id: 'in', label: '✅ Healthy' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setStockFilter(btn.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  stockFilter === btn.id
                    ? 'bg-[#E60067] text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#E60067]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-pink-50/60 dark:bg-neutral-900 border border-pink-100 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {allCategoryNames.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Spreadsheet-Style Bulk Inventory Table */}
      <div className="bg-white dark:bg-[#1E172E] rounded-3xl border-2 border-pink-100 dark:border-pink-900/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pink-50/70 dark:bg-neutral-900/70 text-neutral-500 font-extrabold uppercase tracking-wider border-b border-pink-100 dark:border-pink-900/40">
              <tr>
                <th className="p-3.5 sm:p-4">Merchandise Item</th>
                <th className="p-3.5 sm:p-4">Category</th>
                <th className="p-3.5 sm:p-4">Stock Level</th>
                <th className="p-3.5 sm:p-4">Inventory Units</th>
                <th className="p-3.5 sm:p-4">Price (₹)</th>
                <th className="p-3.5 sm:p-4 text-right">Quick Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100/60 dark:divide-pink-900/40">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    No products match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const currentStock = draftStocks[p.id] !== undefined ? draftStocks[p.id] : (stockMap[p.id] ?? 15);
                  const currentPrice = draftPrices[p.id] !== undefined ? draftPrices[p.id] : p.priceINR;
                  const isSaved = savedSuccessId === p.id;
                  const isModified = draftStocks[p.id] !== undefined || draftPrices[p.id] !== undefined;
                  const status = getStockStatus(currentStock);

                  return (
                    <tr 
                      key={p.id}
                      className="hover:bg-pink-50/40 dark:hover:bg-neutral-800/50 transition"
                    >
                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.image || p.images?.[0] || '/images/deluxe-giftbox.jpg'} 
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                            }}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-pink-200/60 shadow-xs"
                          />
                          <div>
                            <span className="font-extrabold text-[#231733] dark:text-white block truncate max-w-xs">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              SKU: {p.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 font-semibold text-neutral-600 dark:text-neutral-300">
                        <span className="px-2 py-0.5 rounded-lg bg-pink-100/70 dark:bg-neutral-800 text-[#E60067] dark:text-pink-300 text-[10px] font-extrabold">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-1.5 max-w-[110px]">
                          <input
                            type="number"
                            min="0"
                            value={currentStock}
                            onChange={(e) => handleStockChange(p.id, e.target.value)}
                            className="w-16 px-2.5 py-1.5 rounded-xl bg-pink-50/60 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-extrabold text-xs text-center focus:outline-none focus:ring-1 focus:ring-pink-400"
                          />
                          <span className="text-[10px] text-neutral-400">pcs</span>
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <div className="flex items-center gap-1 max-w-[120px]">
                          <span className="text-neutral-400 font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={currentPrice}
                            onChange={(e) => handlePriceChange(p.id, e.target.value)}
                            className="w-20 px-2.5 py-1.5 rounded-xl bg-pink-50/60 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-display font-extrabold text-xs focus:outline-none focus:ring-1 focus:ring-pink-400"
                          />
                        </div>
                      </td>

                      <td className="p-3.5 sm:p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveItem(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto shadow-xs ${
                            isSaved
                              ? 'bg-emerald-600 text-white'
                              : isModified
                              ? 'bg-[#E60067] text-white hover:opacity-90'
                              : 'bg-pink-100 hover:bg-pink-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
