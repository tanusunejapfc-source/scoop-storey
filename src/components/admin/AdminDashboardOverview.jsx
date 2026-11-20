import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Truck, 
  Users, 
  Sparkles, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Package, 
  ExternalLink, 
  ChevronRight, 
  Flame, 
  Award, 
  Layers, 
  ArrowRight, 
  RefreshCw, 
  CreditCard, 
  Phone, 
  Radio 
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import { getTelemetryData } from '../../utils/analyticsTelemetry';

export default function AdminDashboardOverview({
  orders = [],
  products = [],
  onNavigate,
  onStartNewProduct,
  onRefreshOrders
}) {
  const [timeRange, setTimeRange] = useState('all'); // 'all' | '7d' | '30d' | 'today'
  const [realtimePresence, setRealtimePresence] = useState(null);

  // Listen to true live presence sync from Supabase Realtime
  useEffect(() => {
    const handlePresence = (e) => {
      if (e.detail) setRealtimePresence(e.detail);
    };
    window.addEventListener('scoop_realtime_presence_sync', handlePresence);
    return () => window.removeEventListener('scoop_realtime_presence_sync', handlePresence);
  }, []);

  const liveVisitorsCount = realtimePresence?.liveVisitors !== undefined 
    ? realtimePresence.liveVisitors 
    : getTelemetryData(orders).liveVisitorsRightNow;

  // Time filter calculation
  const filteredOrders = useMemo(() => {
    const now = Date.now();
    if (timeRange === 'today') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return orders.filter(o => (o.timestamp || 0) >= startOfToday.getTime());
    }
    if (timeRange === '7d') {
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      return orders.filter(o => (o.timestamp || 0) >= sevenDaysAgo);
    }
    if (timeRange === '30d') {
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      return orders.filter(o => (o.timestamp || 0) >= thirtyDaysAgo);
    }
    return orders;
  }, [orders, timeRange]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    let totalRevenue = 0;
    let upiRevenue = 0;
    let whatsappRevenue = 0;
    let pendingFulfillmentCount = 0;
    let deliveredCount = 0;
    let scoopOrderCount = 0;
    const uniqueCustomers = new Set();
    const productSalesMap = {};
    const categorySalesMap = {};

    filteredOrders.forEach(ord => {
      const rev = Number(ord.totalINR) || 0;
      totalRevenue += rev;

      if (ord.paymentMethod?.toLowerCase().includes('upi') || ord.source?.toLowerCase().includes('upi')) {
        upiRevenue += rev;
      } else {
        whatsappRevenue += rev;
      }

      const st = ord.status?.toLowerCase() || '';
      if (st.includes('delivered')) {
        deliveredCount++;
      } else if (!st.includes('cancelled')) {
        pendingFulfillmentCount++;
      }

      if (ord.customer?.phone) {
        uniqueCustomers.add(ord.customer.phone.trim());
      }

      let hasScoop = false;
      (ord.items || []).forEach(item => {
        const id = item.id || item.name;
        const qty = Number(item.qty) || 1;
        const itemTotal = (Number(item.priceINR) || 0) * qty;

        if (id.includes('scoop') || (item.name && item.name.toLowerCase().includes('scoop'))) {
          hasScoop = true;
        }

        if (!productSalesMap[item.name]) {
          productSalesMap[item.name] = {
            id,
            name: item.name,
            qty: 0,
            revenue: 0,
            image: item.image || '/images/deluxe-giftbox.webp'
          };
        }
        productSalesMap[item.name].qty += qty;
        productSalesMap[item.name].revenue += itemTotal;

        // Category breakdown lookup from catalog products
        const matchedProd = products.find(p => p.id === item.id || p.name === item.name);
        const cat = matchedProd?.category || (item.name?.includes('Scoop') ? 'Mystery Scoops' : 'Jewellery & Accessories');
        categorySalesMap[cat] = (categorySalesMap[cat] || 0) + itemTotal;
      });

      if (hasScoop) scoopOrderCount++;
    });

    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const scoopRate = totalOrders > 0 ? Math.round((scoopOrderCount / totalOrders) * 100) : 0;

    // Top 5 Products Leaderboard
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Category Sales List sorted
    const topCategories = Object.entries(categorySalesMap)
      .map(([name, rev]) => ({ name, revenue: rev, percentage: totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0 }))
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalOrders,
      totalRevenue,
      upiRevenue,
      whatsappRevenue,
      pendingFulfillmentCount,
      deliveredCount,
      uniqueCustomersCount: uniqueCustomers.size,
      aov,
      scoopRate,
      topProducts,
      topCategories
    };
  }, [filteredOrders, products]);

  // 7-Day Trend Visual Data
  const last7DaysData = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = orders.filter(o => {
        const t = o.timestamp || 0;
        return t >= d.getTime() && t < nextDay.getTime();
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (Number(o.totalINR) || 0), 0);

      days.push({
        label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        revenue: dayRevenue,
        orderCount: dayOrders.length
      });
    }

    const maxRev = Math.max(...days.map(d => d.revenue), 1000);
    return { days, maxRev };
  }, [orders]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Controls & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/5 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-neutral-900/40 border border-pink-200/80 dark:border-pink-900/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-[#231733] dark:text-white">
                Executive Revenue & Performance Center
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Store
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Real-time financial telemetry, average order volume & fulfillment velocity
            </p>
          </div>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 p-1 rounded-2xl border border-pink-200 dark:border-neutral-700 shadow-xs shrink-0">
          {[
            { id: 'all', label: 'All-Time' },
            { id: '30d', label: '30 Days' },
            { id: '7d', label: '7 Days' },
            { id: 'today', label: 'Today' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => {
                setTimeRange(btn.id);
                soundFX.playPop(500);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                timeRange === btn.id
                  ? 'bg-[#E60067] text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-[#E60067]'
              }`}
            >
              {btn.label}
            </button>
          ))}

          {onRefreshOrders && (
            <button
              onClick={() => {
                onRefreshOrders();
                soundFX.playPop(600);
              }}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition"
              title="Refresh telemetry data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Live Telemetry Banner (Shopify Live View Quick Look) */}
      <div 
        onClick={() => onNavigate('analytics')}
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-pink-500/10 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group hover:border-emerald-500/60 transition-all shadow-xs"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                Live Storefront Visitors Right Now
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                ● LIVE
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Shoppers actively browsing categories, spinning 3D scoops & building cart orders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 self-start md:self-center">
          <div className="text-left md:text-right">
            <div className="font-display font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 tracking-tight flex items-baseline gap-1.5">
              <span>{liveVisitorsCount}</span>
              <span className="text-xs font-semibold text-neutral-500">live {liveVisitorsCount === 1 ? 'shopper' : 'shoppers'}</span>
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Active sessions in last 5m
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-emerald-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 group-hover:border-emerald-400 transition shrink-0">
            <span>Shopify Live View</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Total Gross Sales */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950 text-[#E60067] dark:text-pink-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Prepaid: ₹{metrics.upiRevenue.toLocaleString('en-IN')}</span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="text-neutral-500">WA: ₹{metrics.whatsappRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Metric 2: Orders Count */}
        <div 
          onClick={() => onNavigate('orders')}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white flex items-center justify-between">
            <span>{metrics.totalOrders}</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#E60067] transition-colors" />
          </div>
          <div className="mt-2 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            {metrics.deliveredCount} delivered successfully
          </div>
        </div>

        {/* Metric 3: Average Order Value (AOV) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs hover:shadow-lg transition-all">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order (AOV)</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white">
            ₹{metrics.aov.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            {metrics.scoopRate}% orders include a Mystery Scoop
          </div>
        </div>

        {/* Metric 4: Pending Shipments */}
        <div 
          onClick={() => onNavigate('orders')}
          className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Dispatch</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-300 group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-display font-extrabold text-[#231733] dark:text-white flex items-center justify-between">
            <span className={metrics.pendingFulfillmentCount > 0 ? 'text-[#E60067] dark:text-pink-400' : ''}>
              {metrics.pendingFulfillmentCount}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#E60067] transition-colors" />
          </div>
          <div className="mt-2 text-[11px] font-semibold text-neutral-500">
            Across {metrics.uniqueCustomersCount} unique customers
          </div>
        </div>

      </div>

      {/* Middle Section: 7-Day Revenue Visualizer & Category Revenue Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Revenue Trend Bar Visualizer */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
                Daily Revenue Velocity (Last 7 Days)
              </h3>
              <p className="text-xs text-neutral-500">
                Track peak ordering spikes and weekly sales momentum
              </p>
            </div>
            <span className="text-xs font-bold text-[#E60067] dark:text-pink-400">
              Peak: ₹{last7DaysData.maxRev.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Bar Chart */}
          <div className="pt-6 pb-2 grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 border-b border-pink-100 dark:border-pink-900/40">
            {last7DaysData.days.map((d, idx) => {
              const heightPct = Math.max(12, Math.round((d.revenue / last7DaysData.maxRev) * 100));
              const isToday = idx === 6;

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-extrabold text-neutral-400 group-hover:text-[#E60067] transition-colors opacity-0 group-hover:opacity-100">
                    ₹{d.revenue}
                  </span>
                  <div className="w-full max-w-[42px] bg-pink-100 dark:bg-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-end p-0.5 group-hover:shadow-md transition-all">
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-xl transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-[#E60067] to-pink-400 shadow-md'
                          : 'bg-gradient-to-t from-purple-600 to-pink-500 opacity-80 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <span className={`text-[11px] font-bold block ${isToday ? 'text-[#E60067] dark:text-pink-400' : 'text-neutral-500'}`}>
                      {d.label}
                    </span>
                    <span className="text-[9px] text-neutral-400 block font-medium">
                      {d.orderCount} ord
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
                Revenue by Department
              </h3>
              <Layers className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Category sales contribution to store gross
            </p>

            <div className="space-y-3.5">
              {metrics.topCategories.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No categorized sales yet
                </div>
              ) : (
                metrics.topCategories.slice(0, 5).map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-neutral-700 dark:text-neutral-200 truncate max-w-[65%]">
                        {cat.name}
                      </span>
                      <span className="text-[#E60067] dark:text-pink-400 font-extrabold">
                        ₹{cat.revenue.toLocaleString('en-IN')} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-pink-100 dark:bg-neutral-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-700"
                        style={{ width: `${Math.max(5, cat.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('categories')}
            className="w-full py-2.5 px-3 rounded-2xl bg-pink-50 dark:bg-neutral-800 hover:bg-[#E60067] text-[#E60067] dark:text-pink-300 hover:text-white font-display font-bold text-xs transition flex items-center justify-center gap-1.5 border border-pink-200 dark:border-neutral-700"
          >
            <span>Manage Store Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Bottom Section: Top Bestsellers & Recent Orders Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Products Leaderboard */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
                Bestselling Product Leaderboard
              </h3>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-[#E60067] dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>View All {products.length} Products</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {metrics.topProducts.length === 0 ? (
              <div className="py-10 text-center text-xs text-neutral-400">
                No orders recorded yet to rank bestsellers
              </div>
            ) : (
              metrics.topProducts.map((p, idx) => (
                <div 
                  key={idx}
                  onClick={() => onNavigate('products', p.id)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/70 dark:hover:bg-neutral-800 transition cursor-pointer border border-pink-100/60 dark:border-pink-900/40 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                      idx === 1 ? 'bg-slate-300 text-slate-800' :
                      idx === 2 ? 'bg-amber-700 text-amber-100' :
                      'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      #{idx + 1}
                    </span>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/deluxe-giftbox.webp';
                      }}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-pink-200/60"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[#231733] dark:text-white truncate group-hover:text-[#E60067] transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {p.qty} units sold
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display font-extrabold text-xs sm:text-sm text-[#E60067] dark:text-pink-400">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Recent Orders Stream */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-100 dark:border-pink-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white">
                Recent Orders Activity
              </h3>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-[#E60067] dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All Orders</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 5).map((ord) => (
              <div 
                key={ord.orderId}
                onClick={() => onNavigate('orders', ord.orderId)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50/70 dark:hover:bg-neutral-800 transition cursor-pointer border border-pink-100/60 dark:border-pink-900/40 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-100 to-purple-100 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-xs font-black text-[#E60067] shrink-0">
                    📦
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#231733] dark:text-white truncate">
                        #{ord.orderId}
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate">
                        • {ord.customer?.fullName || 'Customer'}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 truncate">
                      {ord.customer?.city || 'India'} • {ord.items?.length || 1} item{ord.items?.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-display font-black text-xs sm:text-sm text-[#231733] dark:text-white">
                    ₹{ord.totalINR}
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    ord.status?.includes('Delivered')
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : ord.status?.includes('Shipped')
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {ord.status || 'Received'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
