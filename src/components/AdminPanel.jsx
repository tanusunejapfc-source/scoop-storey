import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Image as ImageIcon, 
  Palette, 
  ListChecks, 
  Package, 
  Search, 
  Download, 
  Upload, 
  Lock, 
  Unlock,
  Sliders,
  Sparkles,
  Check
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { CATEGORIES } from '../data/storeData';

const PRESET_LOCAL_IMAGES = [
  { label: 'Pearl Pendant', url: '/images/pendants/pearl-pendant.jpg' },
  { label: 'Monalisa Gem', url: '/images/pendants/monalisa-pendant.png' },
  { label: 'Sunburst Pendant', url: '/images/pendants/sun-pendant.png' },
  { label: 'Bow Heart Pendant', url: '/images/pendants/bow-heart-pendant.png' },
  { label: 'Heart Pendant', url: '/images/pendants/heart-pendant.png' },
  { label: 'Little Heart', url: '/images/pendants/little-heart-pendant.png' },
  { label: 'Rose Heart', url: '/images/pendants/rose-heart-pendant.png' },
  { label: 'Snake Chain Pendant', url: '/images/pendants/snake-chain-pendant.png' },
  { label: 'Pendants Collection', url: '/images/pendants.jpg' },
  { label: 'Bracelets & Anklets', url: '/images/bracelets-anklets.jpg' },
  { label: 'Charm Bracelets', url: '/images/charm-bracelets.jpg' },
  { label: 'Scoop Bowl', url: '/images/scoop-bowl.jpg' },
  { label: 'Deluxe Gift Box', url: '/images/deluxe-giftbox.jpg' },
  { label: 'Eye Masks & Skincare', url: '/images/eyemasks-skincare.jpg' },
  { label: 'Korean Wallets', url: '/images/korean-wallets.jpg' },
  { label: 'ASMR Packing Stage', url: '/images/asmr-packing.jpg' }
];

const PRESET_COLORS = [
  { name: '18K Yellow Gold', hex: '#E5C158' },
  { name: 'Rose Gold', hex: '#E0A899' },
  { name: 'Silver Shimmer', hex: '#D8D8D8' },
  { name: 'Blush Pink', hex: '#FFB6C1' },
  { name: 'Ivory White', hex: '#FFFDD0' },
  { name: 'Lavender Mist', hex: '#E6E6FA' },
  { name: 'Matcha Mint', hex: '#C1E1C1' },
  { name: 'Midnight Black', hex: '#2A2A2A' }
];

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetDefaults
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('bhaskar_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'edit' | 'new'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Form states for Editing or Adding a Product
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Pendants & Chains',
    priceINR: 199,
    badge: 'Popular 🎀',
    description: '',
    image: '',
    images: [],
    colors: [],
    specifications: {},
    includes: [],
    inStock: true
  });

  // Inputs for adding new images, colors, specs, includes
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#E5C158');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newIncludeText, setNewIncludeText] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === 'scoop123' || passcode.trim() === 'admin' || passcode.trim() === 'bhaskar') {
      setIsAuthenticated(true);
      sessionStorage.setItem('bhaskar_admin_auth', 'true');
      setPasscodeError('');
      soundFX.playSuccess();
      showToast('Admin access granted! 🎀');
    } else {
      setPasscodeError('Incorrect passcode. Try "scoop123"');
      soundFX.playPop(300);
    }
  };

  const handleStartEdit = (prod) => {
    setFormData({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      priceINR: prod.priceINR,
      badge: prod.badge || '',
      description: prod.description || '',
      image: prod.image || (prod.images?.[0] || ''),
      images: prod.images ? [...prod.images] : [prod.image],
      colors: prod.colors ? [...prod.colors] : [{ name: 'Standard', hex: '#E5C158' }],
      specifications: prod.specifications ? { ...prod.specifications } : {},
      includes: prod.includes ? [...prod.includes] : [],
      inStock: prod.inStock !== false
    });
    setActiveTab('edit');
    soundFX.playPop(500);
  };

  const handleStartNew = () => {
    const newId = `custom-item-${Date.now().toString().slice(-6)}`;
    setFormData({
      id: newId,
      name: '',
      category: 'Pendants & Chains',
      priceINR: 199,
      badge: 'New Arrival ✨',
      description: 'Aesthetic Kawaii jewelry hand-selected for Scoop Storey.',
      image: '/images/pendants.jpg',
      images: ['/images/pendants.jpg', '/images/asmr-packing.jpg'],
      colors: [
        { name: '18K Yellow Gold', hex: '#E5C158' },
        { name: 'Rose Gold', hex: '#E0A899' }
      ],
      specifications: {
        'Material': 'Anti-Tarnish Alloy',
        'Finish': '18K Gold Plated',
        'Packaging': 'Velvet Gift Card'
      },
      includes: ['Anti-Tarnish Plating', 'Gift Display Box', 'Prepaid Shipping'],
      inStock: true
    });
    setActiveTab('new');
    soundFX.playPop(500);
  };

  // Image actions
  const handleAddImage = (url) => {
    const imgUrl = (url || newImageUrl).trim();
    if (!imgUrl) return;
    if (formData.images.includes(imgUrl)) {
      showToast('Image already added!');
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imgUrl],
      image: prev.image || imgUrl
    }));
    setNewImageUrl('');
    soundFX.playPop(600);
    showToast('Image added to gallery!');
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const nextImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: nextImages,
        image: nextImages[0] || '/images/deluxe-giftbox.jpg'
      };
    });
    soundFX.playPop(400);
  };

  const handleSetPrimaryImage = (img) => {
    setFormData(prev => ({
      ...prev,
      image: img
    }));
    soundFX.playPop(500);
    showToast('Primary thumbnail updated!');
  };

  // Color actions
  const handleAddColor = (name, hex) => {
    const colName = (name || newColorName).trim();
    const colHex = hex || newColorHex;
    if (!colName) {
      showToast('Please enter a color name');
      return;
    }
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: colName, hex: colHex }]
    }));
    setNewColorName('');
    soundFX.playPop(600);
    showToast(`Color "${colName}" added!`);
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
    soundFX.playPop(400);
  };

  // Specification actions
  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) {
      showToast('Enter both key and value');
      return;
    }
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey.trim()]: newSpecVal.trim()
      }
    }));
    setNewSpecKey('');
    setNewSpecVal('');
    soundFX.playPop(600);
    showToast('Specification added!');
  };

  const handleRemoveSpec = (key) => {
    setFormData(prev => {
      const nextSpecs = { ...prev.specifications };
      delete nextSpecs[key];
      return { ...prev, specifications: nextSpecs };
    });
    soundFX.playPop(400);
  };

  // Includes / Highlights actions
  const handleAddInclude = () => {
    if (!newIncludeText.trim()) return;
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, newIncludeText.trim()]
    }));
    setNewIncludeText('');
    soundFX.playPop(600);
    showToast('Highlight added!');
  };

  const handleRemoveInclude = (idx) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== idx)
    }));
    soundFX.playPop(400);
  };

  // Save product form
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Product name is required!');
      return;
    }

    const payload = {
      ...formData,
      priceINR: Number(formData.priceINR) || 199,
      image: formData.image || formData.images[0] || '/images/deluxe-giftbox.jpg'
    };

    if (activeTab === 'edit') {
      onUpdateProduct(payload);
      showToast(`Updated "${payload.name}" successfully!`);
    } else {
      onAddProduct(payload);
      showToast(`Added new product "${payload.name}"!`);
    }

    soundFX.playSuccess();
    setActiveTab('list');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      onDeleteProduct(id);
      soundFX.playPop(300);
      showToast(`Product "${name}" deleted.`);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scoop_storey_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Catalog exported as JSON!');
  };

  // Import JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem('bhaskar_store_products_v2', JSON.stringify(parsed));
          window.location.reload();
        } else {
          showToast('Invalid catalog format.');
        }
      } catch {
        showToast('Error reading JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Filter products for the list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn">
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-[#1E172E] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border-2 border-pink-300 dark:border-pink-800 flex flex-col animate-scaleUp text-[#231733] dark:text-white"
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-neutral-900 text-white text-xs font-bold shadow-xl border border-pink-400 flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 dark:border-pink-900/40 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-neutral-900 dark:to-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg">
                  Scoop Storey Admin Panel
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold text-[10px] uppercase tracking-wider">
                  Live Manager
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Directly manage products, image galleries, color variants & specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem('bhaskar_admin_auth');
                  soundFX.playPop(400);
                  showToast('Logged out of Admin');
                }}
                className="p-2 text-xs font-bold text-neutral-500 hover:text-rose-500 transition"
                title="Lock Admin Panel"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-pill hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTH CHECK SCREEN */}
        {!isAuthenticated ? (
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-pink-100 dark:bg-neutral-800 flex items-center justify-center text-3xl mb-4 shadow-sm border border-pink-200 dark:border-neutral-700">
              🔐
            </div>
            <h4 className="font-display font-extrabold text-xl text-neutral-900 dark:text-white">
              Store Manager Access
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-5">
              Enter passcode to manage products, colors, and images. (Default: <code>scoop123</code>)
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (scoop123)"
                className="w-full px-4 py-3 rounded-2xl bg-pink-50/60 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-center font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              {passcodeError && (
                <div className="text-xs text-rose-500 font-semibold">
                  {passcodeError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl btn-3d-pink text-white font-display font-bold text-sm flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Store Manager</span>
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 py-2.5 bg-pink-50/40 dark:bg-neutral-900/60 border-b border-pink-100 dark:border-pink-900/30 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('list');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'list'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>All Products ({products.length})</span>
                </button>

                <button
                  onClick={handleStartNew}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'new'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>

                {activeTab === 'edit' && (
                  <button
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E60067] text-white shadow-sm flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editing: {formData.name || 'Product'}</span>
                  </button>
                )}
              </div>

              {/* Reset & Backup Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportJSON}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold glass-pill text-neutral-600 dark:text-neutral-300 hover:text-pink-600 flex items-center gap-1"
                  title="Export catalog as JSON backup"
                >
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <label className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold glass-pill text-neutral-600 dark:text-neutral-300 hover:text-pink-600 flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span className="hidden sm:inline">Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm('Reset all products back to original factory defaults? Any custom added products will be cleared.')) {
                      onResetDefaults();
                      soundFX.playPop(300);
                      showToast('Catalog reset to factory default!');
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1"
                  title="Reset to original defaults"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
              </div>
            </div>

            {/* TAB 1: PRODUCT LIST VIEW */}
            {activeTab === 'list' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Search & Category Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search product name..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
                    {['All', ...CATEGORIES.filter(c => c !== 'All Items')].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                          selectedCategory === cat
                            ? 'bg-[#231733] dark:bg-white text-white dark:text-[#231733] border-transparent'
                            : 'bg-white dark:bg-neutral-800 border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Products Table/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/40 flex items-center justify-between gap-3 hover:border-pink-300 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.image || p.images?.[0] || '/images/deluxe-giftbox.jpg'}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-contain bg-pink-50/80 dark:bg-neutral-800 border border-pink-200/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                              {p.category}
                            </span>
                            <span className="text-xs font-extrabold text-neutral-900 dark:text-white">
                              ₹{p.priceINR}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white truncate">
                            {p.name}
                          </h4>

                          {/* Mini badges for Images, Colors, Specs */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-pink-50 dark:bg-neutral-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5 text-pink-500" />
                              {p.images?.length || 1} images
                            </span>

                            <div className="flex items-center gap-1 bg-pink-50 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                              <Palette className="w-2.5 h-2.5 text-purple-500" />
                              <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                                {p.colors?.length || 0} colors
                              </span>
                              <div className="flex items-center gap-0.5 ml-1">
                                {p.colors?.slice(0, 3).map((col, idx) => (
                                  <span
                                    key={idx}
                                    className="w-2 h-2 rounded-full border border-black/20"
                                    style={{ backgroundColor: col.hex }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-xs transition"
                          title="Edit Images, Colors & Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 dark:bg-neutral-800 dark:hover:bg-rose-950 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2 & 3: EDIT OR ADD PRODUCT FORM */}
            {(activeTab === 'edit' || activeTab === 'new') && (
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* 1. GENERAL INFO */}
                <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/40 space-y-3">
                  <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400">
                    <Package className="w-4 h-4" />
                    <span>Basic Product Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Baroque Pearl Drop Pendant"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        value={formData.priceINR}
                        onChange={(e) => setFormData({ ...formData, priceINR: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      >
                        {CATEGORIES.filter(c => c !== 'All Items').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. Best Seller 💖 or Special Edition"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Write cute product details..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 resize-none focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>
                </div>

                {/* 2. IMAGE GALLERY MANAGER */}
                <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400">
                      <ImageIcon className="w-4 h-4" />
                      <span>Product Images Gallery ({formData.images.length})</span>
                    </div>
                    <span className="text-[11px] text-neutral-500">First image is primary thumbnail</span>
                  </div>

                  {/* Current Active Images Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {formData.images.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`relative group rounded-2xl overflow-hidden border-2 p-1 bg-white dark:bg-neutral-900 ${
                          formData.image === img ? 'border-pink-500 shadow-md ring-2 ring-pink-400/30' : 'border-pink-200 dark:border-neutral-700'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Gallery ${idx + 1}`} 
                          className="w-full aspect-square object-contain rounded-xl"
                        />
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img)}
                            className="p-1.5 rounded-lg bg-pink-500 text-white text-[10px] font-bold hover:bg-pink-600 transition"
                            title="Set as primary thumbnail"
                          >
                            Main
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {formData.image === img && (
                          <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[9px] font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Image Input */}
                  <div className="pt-2 border-t border-pink-100 dark:border-neutral-800 space-y-2">
                    <label className="block text-[11px] font-bold">Add Image URL or Local Path</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="e.g. /images/pendants/pearl-pendant.jpg or https://..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddImage()}
                        className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Image</span>
                      </button>
                    </div>

                    {/* Quick Pick from Preset Store Assets */}
                    <div className="pt-1">
                      <span className="text-[10px] text-neutral-500 font-semibold block mb-1.5">
                        Quick Pick from Project Images:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PRESET_LOCAL_IMAGES.map((pImg, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAddImage(pImg.url)}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-pink-50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 hover:border-pink-400 transition"
                          >
                            + {pImg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. COLOR / VARIANT MANAGER */}
                <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400">
                      <Palette className="w-4 h-4" />
                      <span>Color / Finish Variants ({formData.colors.length})</span>
                    </div>
                    <span className="text-[11px] text-neutral-500">Customer can pick from these colors</span>
                  </div>

                  {/* Active Colors Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {formData.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xs"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-xs font-bold">{c.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-0.5 hover:text-rose-500 transition"
                          title="Remove color"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Color Form */}
                  <div className="pt-2 border-t border-pink-100 dark:border-neutral-800 space-y-2">
                    <label className="block text-[11px] font-bold">Add New Color</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 p-1 rounded-xl border border-pink-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-xs font-mono pr-2">{newColorHex}</span>
                      </div>

                      <input
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="e.g. Rose Gold, 18K Gold, Silver..."
                        className="w-48 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />

                      <button
                        type="button"
                        onClick={() => handleAddColor()}
                        className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Color</span>
                      </button>
                    </div>

                    {/* Quick Preset Colors */}
                    <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-neutral-500 font-semibold">Presets:</span>
                      {PRESET_COLORS.map((pc, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddColor(pc.name, pc.hex)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-pink-50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 flex items-center gap-1 hover:border-pink-400 transition"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pc.hex }} />
                          <span>+ {pc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. SPECIFICATIONS MANAGER */}
                <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400">
                      <ListChecks className="w-4 h-4" />
                      <span>Specifications Table ({Object.keys(formData.specifications).length})</span>
                    </div>
                    <span className="text-[11px] text-neutral-500">Material, Dimensions, Plating, Care</span>
                  </div>

                  {/* Current Specs */}
                  <div className="space-y-1.5">
                    {Object.entries(formData.specifications).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-neutral-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300">{key}:</span>
                          <span className="text-neutral-600 dark:text-neutral-400">{val}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(key)}
                          className="p-1 hover:text-rose-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Spec Row */}
                  <div className="pt-2 border-t border-pink-100 dark:border-neutral-800 space-y-2">
                    <label className="block text-[11px] font-bold">Add Specification</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Feature (e.g. Material, Chain Length, Plating)"
                        className="w-1/3 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                      <input
                        type="text"
                        value={newSpecVal}
                        onChange={(e) => setNewSpecVal(e.target.value)}
                        placeholder="Detail (e.g. 18K Gold Plated Stainless Steel)"
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpec}
                        className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. HIGHLIGHTS & INCLUDES MANAGER */}
                <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-pink-100 dark:border-pink-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400">
                      <Check className="w-4 h-4" />
                      <span>Key Highlights & Includes ({formData.includes.length})</span>
                    </div>
                    <span className="text-[11px] text-neutral-500">Checklist shown on product cards</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {formData.includes.map((inc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-semibold"
                      >
                        <span>{inc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInclude(i)}
                          className="text-neutral-400 hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-pink-100 dark:border-neutral-800">
                    <input
                      type="text"
                      value={newIncludeText}
                      onChange={(e) => setNewIncludeText(e.target.value)}
                      placeholder="e.g. Anti-Tarnish Coating or Velvet Pouch Included"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclude}
                      className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Highlight</span>
                    </button>
                  </div>
                </div>

                {/* 6. SAVE & CANCEL BAR */}
                <div className="sticky bottom-0 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-pink-200 dark:border-pink-900/60 shadow-xl flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-5 py-2.5 rounded-xl border border-pink-200 dark:border-neutral-700 font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl btn-3d-pink text-white font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes to Catalog</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
