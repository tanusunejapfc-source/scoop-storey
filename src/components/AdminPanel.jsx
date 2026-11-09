import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Check,
  ShoppingBag,
  Phone,
  MapPin,
  Copy,
  Clock,
  ExternalLink,
  Receipt,
  FileText,
  QrCode,
  CreditCard,
  RefreshCw,
  Tags,
  Layers,
  ChevronRight,
  AlertCircle,
  Video,
  Play,
  Film,
  Key,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { categoryToSlug } from '../data/storeData';
import { useStoreOrders } from '../utils/orderStore';
import { usePaymentSettings, getQrDisplayUrl } from '../utils/paymentStore';
import { saveStoredProducts } from '../utils/productStore';
import { uploadImageToSupabase } from '../utils/supabaseClient';
import { useStoreReels, captureVideoPoster } from '../utils/reelsStore';
import { 
  getStoredCategories, 
  saveStoredCategories, 
  slugifyCategory, 
  resetStoredCategories 
} from '../utils/categoryStore';
import WhatsAppIcon from './WhatsAppIcon';

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
  { label: 'Bracelets Collection', url: '/images/charm-bracelets.jpg' },
  { label: 'Anklets Collection', url: '/images/bracelets-anklets.jpg' },
  { label: 'Butterfly Charm Bracelet', url: '/images/bracelets/butterfly-charm-bracelet.png' },
  { label: 'Scoop Bowl', url: '/images/scoop-bowl.jpg' },
  { label: 'Deluxe Gift Box', url: '/images/deluxe-giftbox.jpg' },
  { label: 'Eye Masks Collection', url: '/images/eyemasks-skincare.jpg' },
  { label: 'Self-Care Essentials', url: '/images/eyemasks-skincare.jpg' },
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

// Lightweight image compression helper for fast device uploads & lean localStorage/IndexedDB persistence
// Formats product images to standard 4:5 aspect ratio (800 × 1000 px) with clean white background fill
const compressImage = (file, targetWidth = 800, targetHeight = 1000, quality = 0.85) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Fill background white so transparent PNGs render cleanly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Center and cover: maintain aspect ratio, fill canvas, center image
        const srcAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let drawWidth, drawHeight, offsetX, offsetY;
        if (srcAspect > targetAspect) {
          drawHeight = targetHeight;
          drawWidth = img.width * (targetHeight / img.height);
          offsetX = (targetWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = targetWidth;
          drawHeight = img.height * (targetWidth / img.width);
          offsetX = 0;
          offsetY = (targetHeight - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Always compress to JPEG at specified quality (crisp 800x1000 4:5 standard)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target?.result || null);
      img.src = e.target?.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

// Admin passcode storage configuration
export const ADMIN_PASSCODE_KEY = 'bhaskar_admin_passcode_v1';
export const DEFAULT_PASSCODE = 'scoop123';

export function getAdminPasscode() {
  try {
    const val = localStorage.getItem(ADMIN_PASSCODE_KEY);
    if (val && val.trim()) return val.trim();
  } catch (err) {
    console.error('Error reading admin passcode:', err);
  }
  return DEFAULT_PASSCODE;
}

export function saveAdminPasscode(newPasscode) {
  try {
    localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode.trim());
    return true;
  } catch (err) {
    console.error('Error saving admin passcode:', err);
    return false;
  }
}

export function resetAdminPasscode() {
  try {
    localStorage.removeItem(ADMIN_PASSCODE_KEY);
    return true;
  } catch (err) {
    console.error('Error resetting admin passcode:', err);
    return false;
  }
}

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
  const [showLoginPasscode, setShowLoginPasscode] = useState(false);

  // Security & Passcode Change Form States
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  // Primary navigation: 'orders' | 'products' | 'categories' | 'edit' | 'new' | 'payments' | 'reels' | 'security'
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // Orders store hook
  const { orders, refreshOrders, updateStatus, deleteOrder, clearOrders } = useStoreOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh orders whenever Admin Panel opens
  useEffect(() => {
    if (isOpen) {
      refreshOrders();
    }
  }, [isOpen, refreshOrders]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    soundFX.playPop(550);
    refreshOrders();
    showToast('Orders refreshed! 🎀');
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Reels store hook & management states
  const { reels, updateReel, addReel, deleteReel, resetReels } = useStoreReels();
  const [editingReel, setEditingReel] = useState(null);
  const [reelFormData, setReelFormData] = useState({
    id: '',
    title: '',
    views: '480K',
    likes: '42K',
    comments: '1,200',
    audio: 'Original Audio - Bhaskar Scoop Storey (ASMR)',
    tag: '#mysteryscoop #asmrpacking #satisfying',
    image: '',
    videoUrl: '',
    instagramUrl: 'https://www.instagram.com/bhaskar_scoopstorey/'
  });
  const [videoUploading, setVideoUploading] = useState(false);
  const [posterUploading, setPosterUploading] = useState(false);
  const [quickUploadReelId, setQuickUploadReelId] = useState(null);
  const quickVideoInputRef = useRef(null);

  const handleOpenEditReel = (reel) => {
    soundFX.playPop(520);
    setEditingReel(reel);
    setReelFormData({
      id: reel.id,
      title: reel.title || '',
      views: reel.views || '500K',
      likes: reel.likes || '45K',
      comments: reel.comments || '1,200',
      audio: reel.audio || 'Original Audio • Bhaskar ASMR',
      tag: reel.tag || '',
      image: reel.image || '',
      videoUrl: reel.videoUrl || '',
      instagramUrl: reel.instagramUrl || 'https://www.instagram.com/bhaskar_scoopstorey/'
    });
  };

  const handleOpenAddReel = () => {
    soundFX.playPop(550);
    const newId = `reel-${Date.now()}`;
    setEditingReel({ id: newId, isNew: true });
    setReelFormData({
      id: newId,
      title: 'Packing 5x Scoop Order for @customer 🎀',
      views: '120K',
      likes: '14.5K',
      comments: '420',
      audio: 'Original Audio - Bhaskar ASMR',
      tag: '#mysteryscoop #asmrpacking #scoopstorey',
      image: '/images/asmr-packing.jpg',
      videoUrl: '',
      instagramUrl: 'https://www.instagram.com/bhaskar_scoopstorey/'
    });
  };

  const handleSaveReel = (e) => {
    e?.preventDefault();
    if (!reelFormData.title.trim()) {
      showToast('Please enter a reel title');
      return;
    }

    if (editingReel?.isNew) {
      addReel(reelFormData);
      showToast('New ASMR Reel created! 🎥');
    } else {
      updateReel(reelFormData);
      showToast('Reel updated successfully! ✨');
    }

    soundFX.playSuccess();
    setEditingReel(null);
  };

  const handleDeleteReel = (reelId) => {
    const confirm = window.confirm('Are you sure you want to delete this Reel?');
    if (!confirm) return;
    deleteReel(reelId);
    showToast('Reel deleted');
    soundFX.playPop(420);
    if (editingReel?.id === reelId) setEditingReel(null);
  };

  const handleReelVideoUpload = async (file, targetId = null) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Please select a valid video file (.mp4, .webm, .mov, etc.)');
      return;
    }

    setVideoUploading(true);
    soundFX.playPop(520);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;

      let posterDataUrl = null;
      try {
        posterDataUrl = await captureVideoPoster(file);
      } catch {
        // ignore
      }

      if (targetId) {
        const found = reels.find(r => r.id === targetId);
        if (found) {
          updateReel({
            ...found,
            videoUrl: dataUrl,
            image: posterDataUrl || found.image
          });
          showToast('Video uploaded and saved to Reel! 🎥');
          soundFX.playSuccess();
        }
      } else {
        setReelFormData(prev => ({
          ...prev,
          videoUrl: dataUrl,
          image: prev.image || posterDataUrl || ''
        }));
        showToast('Video attached! Click Save Reel to confirm.');
        soundFX.playSuccess();
      }
      setVideoUploading(false);
    };

    reader.onerror = () => {
      alert('Failed to read video file');
      setVideoUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleReelPosterUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPosterUploading(true);
    soundFX.playPop(520);
    const compressed = await compressImage(file, 900, 1600, 0.85);
    if (compressed) {
      setReelFormData(prev => ({ ...prev, image: compressed }));
      showToast('Cover poster image updated! 🖼️');
      soundFX.playSuccess();
    }
    setPosterUploading(false);
  };

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

  // Payment & QR Settings State
  const { settings: paymentSettings, updateSettings: updatePaymentSettings, reset: resetPaymentSettings } = usePaymentSettings();
  const [paymentForm, setPaymentForm] = useState(paymentSettings);
  const qrFileInputRef = useRef(null);
  const productFileInputRef = useRef(null);

  // Category Store & Management
  const [categoryList, setCategoryList] = useState(getStoredCategories);

  // Sync categoryList with storage on external changes
  useEffect(() => {
    const handleCatUpdate = (e) => {
      if (e?.detail) setCategoryList(e.detail);
      else setCategoryList(getStoredCategories());
    };
    window.addEventListener('scoop_categories_updated', handleCatUpdate);
    return () => window.removeEventListener('scoop_categories_updated', handleCatUpdate);
  }, []);

  // Dynamic list of all category names from metadata + products
  const allCategoryNames = useMemo(() => {
    const metaNames = categoryList.map(c => c.name);
    const prodCats = products.map(p => p.category).filter(Boolean);
    return Array.from(new Set([...metaNames, ...prodCats]));
  }, [categoryList, products]);

  // Category Add/Edit Modal
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    mode: 'add',
    name: '',
    oldName: '',
    icon: '🎀',
    badge: 'New Drop 🎀',
    description: ''
  });

  // Delete Category Confirmation Modal
  const [deleteCategoryModal, setDeleteCategoryModal] = useState({
    isOpen: false,
    categoryName: '',
    reassignTo: 'Mystery Scoops'
  });

  // Bulk Move Modal
  const [bulkMoveModal, setBulkMoveModal] = useState({
    isOpen: false,
    selectedProductIds: [],
    targetCategory: ''
  });

  const handleOpenAddCategoryModal = () => {
    setCategoryModal({
      isOpen: true,
      mode: 'add',
      name: '',
      oldName: '',
      icon: '🎀',
      badge: 'New Drop 🎀',
      description: ''
    });
    soundFX.playPop(500);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setCategoryModal({
      isOpen: true,
      mode: 'edit',
      name: cat.name,
      oldName: cat.name,
      icon: cat.icon || '✨',
      badge: cat.badge || '',
      description: cat.description || ''
    });
    soundFX.playPop(500);
  };

  const handleSaveCategorySubmit = (e) => {
    e?.preventDefault();
    const trimmedName = categoryModal.name.trim();
    if (!trimmedName) {
      showToast('Please enter a category name');
      return;
    }

    if (categoryModal.mode === 'add') {
      if (allCategoryNames.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
        showToast('A category with this name already exists');
        return;
      }
      const newCat = {
        id: slugifyCategory(trimmedName),
        name: trimmedName,
        icon: categoryModal.icon || '🎀',
        badge: categoryModal.badge || 'New Drop 🎀',
        description: categoryModal.description || `Cute ${trimmedName} collection.`,
        isDefault: false
      };
      const updated = [...categoryList, newCat];
      setCategoryList(updated);
      saveStoredCategories(updated);
      showToast(`Category "${trimmedName}" created! ✨`);
    } else {
      const oldName = categoryModal.oldName;
      const nameChanged = oldName !== trimmedName;

      if (nameChanged && allCategoryNames.some(c => c.toLowerCase() === trimmedName.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
        showToast('Another category already uses this name');
        return;
      }

      let updated = categoryList.map(c => {
        if (c.name === oldName) {
          return {
            ...c,
            id: slugifyCategory(trimmedName),
            name: trimmedName,
            icon: categoryModal.icon || c.icon || '✨',
            badge: categoryModal.badge,
            description: categoryModal.description
          };
        }
        return c;
      });

      if (!updated.some(c => c.name === trimmedName)) {
        updated.push({
          id: slugifyCategory(trimmedName),
          name: trimmedName,
          icon: categoryModal.icon || '✨',
          badge: categoryModal.badge || '',
          description: categoryModal.description || '',
          isDefault: false
        });
      }

      setCategoryList(updated);
      saveStoredCategories(updated);

      if (nameChanged) {
        let count = 0;
        products.forEach(p => {
          if (p.category === oldName) {
            onUpdateProduct({ ...p, category: trimmedName });
            count++;
          }
        });
        showToast(`Category renamed & ${count} products updated! ✨`);
      } else {
        showToast(`Category "${trimmedName}" updated! ✨`);
      }
    }

    setCategoryModal(prev => ({ ...prev, isOpen: false }));
    soundFX.playSuccess();
  };

  const handleDeleteCategoryConfirm = () => {
    const catName = deleteCategoryModal.categoryName;
    const reassignTo = deleteCategoryModal.reassignTo || 'Mystery Scoops';
    if (!catName) return;

    let count = 0;
    products.forEach(p => {
      if (p.category === catName) {
        onUpdateProduct({ ...p, category: reassignTo });
        count++;
      }
    });

    const updated = categoryList.filter(c => c.name !== catName);
    setCategoryList(updated);
    saveStoredCategories(updated);

    setDeleteCategoryModal({ isOpen: false, categoryName: '', reassignTo: '' });
    soundFX.playPop(450);
    showToast(`Category deleted. ${count} products reassigned to "${reassignTo}".`);
  };

  const handleBulkMoveSubmit = () => {
    const target = bulkMoveModal.targetCategory;
    const ids = bulkMoveModal.selectedProductIds;
    if (!target) {
      showToast('Please select a target category');
      return;
    }
    if (!ids.length) {
      showToast('Please select at least 1 product');
      return;
    }

    let count = 0;
    products.forEach(p => {
      if (ids.includes(p.id)) {
        onUpdateProduct({ ...p, category: target });
        count++;
      }
    });

    setBulkMoveModal({ isOpen: false, selectedProductIds: [], targetCategory: '' });
    soundFX.playSuccess();
    showToast(`Moved ${count} products to "${target}"! 🎀`);
  };

  const handleResetCategoriesConfirm = () => {
    if (window.confirm('Reset all categories to default? This will restore standard categories.')) {
      const resetList = resetStoredCategories();
      setCategoryList(resetList);
      soundFX.playPop(550);
      showToast('Categories reset to defaults! 🎀');
    }
  };

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const storedPass = getAdminPasscode();
    const entered = passcode.trim();
    if (
      entered === storedPass ||
      (storedPass === DEFAULT_PASSCODE && (entered === 'admin' || entered === 'bhaskar'))
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('bhaskar_admin_auth', 'true');
      setPasscodeError('');
      soundFX.playSuccess();
      showToast('Admin access granted! 🎀');
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
      soundFX.playPop(300);
    }
  };

  const handleChangePasscode = (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');

    const storedPass = getAdminPasscode();

    if (!currentPassInput.trim()) {
      setSecurityError('Please enter your current passcode.');
      soundFX.playPop(300);
      return;
    }

    if (
      currentPassInput.trim() !== storedPass &&
      !(storedPass === DEFAULT_PASSCODE && (currentPassInput.trim() === 'admin' || currentPassInput.trim() === 'bhaskar'))
    ) {
      setSecurityError('Current passcode is incorrect.');
      soundFX.playPop(300);
      return;
    }

    if (!newPassInput.trim()) {
      setSecurityError('Please enter a new passcode.');
      soundFX.playPop(300);
      return;
    }

    if (newPassInput.trim().length < 4) {
      setSecurityError('New passcode must be at least 4 characters long.');
      soundFX.playPop(300);
      return;
    }

    if (newPassInput.trim() !== confirmPassInput.trim()) {
      setSecurityError('New passcodes do not match. Please re-enter.');
      soundFX.playPop(300);
      return;
    }

    const ok = saveAdminPasscode(newPassInput.trim());
    if (ok) {
      soundFX.playSuccess();
      setSecuritySuccess('Admin passcode updated successfully! 🔒');
      showToast('Admin passcode updated! 🔒');
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    } else {
      setSecurityError('Failed to save passcode. Please try again.');
      soundFX.playPop(300);
    }
  };

  const handleResetPasscode = () => {
    if (window.confirm('Reset admin passcode back to factory default?')) {
      resetAdminPasscode();
      soundFX.playSuccess();
      setSecuritySuccess('Admin passcode reset to default!');
      showToast('Admin passcode reset to default! 🔑');
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setSecurityError('');
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
  const handleAddImage = (url, makePrimary = false) => {
    const raw = typeof url === 'string' ? url : newImageUrl;
    const imgUrl = (raw || '').trim();

    if (!imgUrl) {
      if (productFileInputRef.current) {
        productFileInputRef.current.click();
      } else {
        showToast('Please enter an image URL or choose a file');
      }
      return;
    }

    setFormData(prev => {
      const prevImages = Array.isArray(prev.images) ? prev.images : [];
      const filtered = prevImages.filter(x => x !== imgUrl);
      const nextImages = makePrimary ? [imgUrl, ...filtered] : [...filtered, imgUrl];
      return {
        ...prev,
        images: nextImages,
        image: makePrimary ? imgUrl : (prev.image || imgUrl)
      };
    });

    setNewImageUrl('');
    soundFX.playPop(600);
    showToast(makePrimary ? 'Primary thumbnail updated!' : 'Image added to gallery!');
  };

  const handleProductFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file');
        continue;
      }
      try {
        const compressedDataUrl = await compressImage(file, 800, 1000, 0.85);
        if (!compressedDataUrl) continue;

        let finalUrl = compressedDataUrl;

        // 1. Try uploading directly to Supabase Storage (Cloud CDN URL for all visitors)
        try {
          const sbRes = await uploadImageToSupabase(file);
          if (sbRes?.success && sbRes?.url) {
            finalUrl = sbRes.url;
          }
        } catch (e) {
          console.warn('Supabase upload skipped:', e);
        }

        // 2. Fallback: Auto-save image to public/images/uploads via dev server API when running locally
        if (finalUrl === compressedDataUrl) {
          try {
            const res = await fetch('/api/dev/upload-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: file.name.replace(/\.[^/.]+$/, ''),
                dataUrl: compressedDataUrl
              })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.url) {
                finalUrl = data.url;
              }
            }
          } catch {
            // Dev API not available (e.g. running on Vercel)
          }
        }

        setFormData(prev => {
          const prevImages = Array.isArray(prev.images) ? prev.images : [];
          // Prepend newly uploaded photo so it becomes the primary image immediately
          const nextImages = [finalUrl, ...prevImages.filter(x => x !== finalUrl)];
          return {
            ...prev,
            images: nextImages,
            image: finalUrl
          };
        });

        soundFX.playSuccess();
        showToast(`Uploaded "${file.name}" as primary photo!`);
      } catch (err) {
        console.error('Failed to load image:', err);
        showToast(`Failed to upload ${file.name}`);
      }
    }

    e.target.value = '';
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
    setFormData(prev => {
      const prevImages = Array.isArray(prev.images) ? prev.images : [];
      const filtered = prevImages.filter(x => x !== img);
      return {
        ...prev,
        image: img,
        images: [img, ...filtered]
      };
    });
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

    const primaryImage = formData.image || formData.images[0] || '/images/deluxe-giftbox.jpg';
    const allImages = formData.images && formData.images.length > 0
      ? [primaryImage, ...formData.images.filter(x => x !== primaryImage)]
      : [primaryImage];

    const payload = {
      ...formData,
      priceINR: Number(formData.priceINR) || 199,
      image: primaryImage,
      images: allImages
    };

    if (activeTab === 'edit') {
      onUpdateProduct(payload);
      showToast(`Updated "${payload.name}" successfully!`);
    } else {
      onAddProduct(payload);
      showToast(`Added new product "${payload.name}"!`);
    }

    // Auto-sync catalog to src/data/storeData.js via Vite dev server when running locally
    try {
      const updatedCatalog = activeTab === 'edit'
        ? products.map(p => p.id === payload.id ? payload : p)
        : [payload, ...products];

      fetch('/api/dev/save-storedata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedCatalog })
      }).catch(() => {});
    } catch {
      // Ignore in production
    }

    soundFX.playSuccess();
    setActiveTab('products');
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      onDeleteProduct(id);

      try {
        const updatedCatalog = products.filter(p => p.id !== id);
        fetch('/api/dev/save-storedata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ products: updatedCatalog })
        }).catch(() => {});
      } catch {
        // Ignore
      }

      soundFX.playPop(300);
      showToast(`Product "${name}" deleted.`);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    // Attempt local auto-sync to codebase
    fetch('/api/dev/save-storedata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    }).catch(() => {});

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scoop_storey_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Catalog saved & exported! 🎀');
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
          saveStoredProducts(parsed);
          showToast('Catalog imported successfully!');
          setTimeout(() => window.location.reload(), 400);
        } else {
          showToast('Invalid catalog format.');
        }
      } catch {
        showToast('Error reading JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Copy full shipping address to clipboard
  const handleCopyAddress = (order) => {
    const cust = order.customer;
    if (!cust) return;
    const addr = `${cust.fullName}\nPhone: +91 ${cust.phone}\n${cust.streetAddress}${cust.landmark ? ` (Near ${cust.landmark})` : ''}\n${cust.city}, ${cust.state} - ${cust.pincode}`;
    navigator.clipboard.writeText(addr);
    setCopiedOrderId(order.orderId);
    soundFX.playPop(500);
    showToast('Shipping address copied to clipboard!');
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleCopyText = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedOrderId(key);
    soundFX.playPop(500);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleQrFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPaymentForm(prev => ({ ...prev, qrImage: base64 }));
      soundFX.playPop(600);
      showToast('QR Code image selected! Click "Save Payment Settings" to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomQr = () => {
    setPaymentForm(prev => ({ ...prev, qrImage: '' }));
    soundFX.playPop(400);
    showToast('Custom QR removed. System will use auto-generated UPI QR.');
  };

  const handleSavePaymentSettings = (e) => {
    e?.preventDefault();
    updatePaymentSettings(paymentForm);
    soundFX.playSuccess();
    showToast('UPI & QR settings saved successfully! ✨');
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      o.orderId.toLowerCase().includes(q) || 
      (o.customer?.fullName || '').toLowerCase().includes(q) ||
      (o.customer?.phone || '').includes(q) ||
      (o.customer?.city || '').toLowerCase().includes(q) ||
      (o.upiRefNumber || '').toLowerCase().includes(q);

    const matchesStatus = orderStatusFilter === 'All' || 
      (orderStatusFilter === 'UPI QR' && (o.paymentMethod === 'UPI QR Code' || o.upiRefNumber || o.source?.includes('UPI'))) ||
      (orderStatusFilter === 'WhatsApp' && o.source?.includes('WhatsApp')) ||
      (orderStatusFilter === 'Online' && (o.source?.includes('Online') || o.source?.includes('Instant'))) ||
      o.status === orderStatusFilter;

    return matchesQuery && matchesStatus;
  });

  // Filter products for the catalog tab
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Total revenue stats
  const totalOrdersCount = orders.length;
  const totalRevenueINR = orders.reduce((acc, o) => acc + (o.totalINR || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status?.includes('Pending') || o.status?.includes('New')).length;

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
                Track WhatsApp & Online orders, manage product images, colors & specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('security');
                    soundFX.playPop(450);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'security'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'glass-pill text-neutral-600 dark:text-neutral-300 hover:text-[#E60067]'
                  }`}
                  title="Change Admin Passcode"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Passcode</span>
                </button>

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
              </>
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
              Enter passcode to view customer orders and manage store products.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div className="relative">
                <input
                  type={showLoginPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (passcodeError) setPasscodeError('');
                  }}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-3 rounded-2xl bg-pink-50/60 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-center font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPasscode(!showLoginPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition p-1"
                  title={showLoginPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showLoginPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passcodeError && (
                <div className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-950/40 py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/40">
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
                {/* 1. ORDERS TAB (PRIMARY) */}
                <button
                  onClick={() => {
                    setActiveTab('orders');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Orders & WhatsApp Hauls ({orders.length})</span>
                </button>

                {/* 2. ALL PRODUCTS TAB */}
                <button
                  onClick={() => {
                    setActiveTab('products');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'products'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Products ({products.length})</span>
                </button>

                {/* 3. MANAGE CATEGORIES TAB */}
                <button
                  onClick={() => {
                    setActiveTab('categories');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'categories'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Tags className="w-3.5 h-3.5" />
                  <span>Categories ({allCategoryNames.length})</span>
                </button>

                {/* 3. ADD NEW PRODUCT TAB */}
                <button
                  onClick={handleStartNew}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'new'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>

                {/* 4. UPI & QR PAYMENT SETTINGS TAB */}
                <button
                  onClick={() => {
                    setActiveTab('payments');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'payments'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI & QR Settings</span>
                </button>

                {/* 5. ASMR REELS & VIDEO UPLOADS TAB */}
                <button
                  onClick={() => {
                    setActiveTab('reels');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'reels'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>ASMR Reels & Videos ({reels.length})</span>
                </button>

                {/* 6. SECURITY & PASSCODE TAB */}
                <button
                  onClick={() => {
                    setActiveTab('security');
                    soundFX.playPop(450);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-[#E60067] text-white shadow-sm'
                      : 'hover:bg-pink-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Passcode & Security</span>
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

            {/* TAB 1: ORDERS & INVOICES MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Orders Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40">
                    <span className="text-[11px] text-neutral-500 font-semibold block">Total Orders</span>
                    <span className="text-xl font-display font-black text-neutral-900 dark:text-white mt-0.5 block">
                      {totalOrdersCount}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40">
                    <span className="text-[11px] text-neutral-500 font-semibold block">Total Revenue</span>
                    <span className="text-xl font-display font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      ₹{totalRevenueINR}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40">
                    <span className="text-[11px] text-neutral-500 font-semibold block">Pending Action</span>
                    <span className="text-xl font-display font-black text-amber-500 mt-0.5 block">
                      {pendingOrdersCount}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-500 font-semibold block">Sync & Clear</span>
                      <span className="text-[10px] text-neutral-400">Live order records</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleManualRefresh}
                        className={`p-1.5 rounded-xl text-[#E60067] hover:bg-pink-50 dark:hover:bg-neutral-800 transition ${isRefreshing ? 'animate-spin' : ''}`}
                        title="Refresh live orders"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Clear all stored customer orders?')) {
                            clearOrders();
                            soundFX.playPop(300);
                            showToast('Order history cleared.');
                          }
                        }}
                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Clear orders"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search & Filter Orders */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search Order ID, Name, Phone, City..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
                    {['All', 'UPI QR', 'WhatsApp', 'Online'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                          orderStatusFilter === st
                            ? 'bg-[#231733] dark:bg-white text-white dark:text-[#231733] border-transparent'
                            : 'bg-white dark:bg-neutral-800 border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Cards List */}
                {filteredOrders.length === 0 ? (
                  <div className="p-10 rounded-2xl glass-panel text-center text-neutral-400 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-pink-300" />
                    <h4 className="font-display font-bold text-base text-neutral-800 dark:text-neutral-200">
                      No customer orders found
                    </h4>
                    <p className="text-xs">
                      When customers place orders via WhatsApp or Online Prepaid, they will automatically appear here with complete address details.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredOrders.map((ord) => {
                      const isWhatsApp = ord.source?.includes('WhatsApp');
                      const cust = ord.customer || {};

                      return (
                        <div
                          key={ord.orderId}
                          className="p-4 sm:p-5 rounded-2xl glass-panel border border-pink-200/80 dark:border-pink-900/40 shadow-sm space-y-3.5 hover:border-pink-300 transition"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-pink-100 dark:border-neutral-800">
                            <div className="flex items-center gap-2.5">
                              <span className="font-display font-black text-sm text-[#E60067] dark:text-pink-400">
                                {ord.orderId}
                              </span>

                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                                ord.paymentMethod === 'UPI QR Code' || ord.upiRefNumber
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                                  : isWhatsApp
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                              }`}>
                                {ord.paymentMethod === 'UPI QR Code' || ord.upiRefNumber ? (
                                  <QrCode className="w-3 h-3 text-amber-600" />
                                ) : isWhatsApp ? (
                                  <WhatsAppIcon className="w-3 h-3" />
                                ) : (
                                  <Receipt className="w-3 h-3" />
                                )}
                                <span>{ord.source}</span>
                              </span>

                              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {ord.date}
                              </span>
                            </div>

                            {/* Status Selector Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-neutral-500">Status:</span>
                              <select
                                value={ord.status || 'New Order'}
                                onChange={(e) => {
                                  updateStatus(ord.orderId, e.target.value);
                                  soundFX.playPop(500);
                                  showToast(`Status updated to "${e.target.value}"`);
                                }}
                                className="px-2.5 py-1 text-xs font-bold rounded-xl bg-pink-50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-[#E60067] dark:text-pink-400 focus:outline-none"
                              >
                                <option value="WhatsApp Verification Pending">⏳ WhatsApp Pending Verification</option>
                                <option value="Payment Received (QR Verified)">💰 Payment Received (QR Verified)</option>
                                <option value="Packing on IG Reel">🎬 Packing on IG Reel</option>
                                <option value="Dispatched / In Transit">🚚 Dispatched / In Transit</option>
                                <option value="Delivered Successfully">✅ Delivered Successfully</option>
                              </select>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete order ${ord.orderId}?`)) {
                                    deleteOrder(ord.orderId);
                                    soundFX.playPop(300);
                                    showToast(`Order ${ord.orderId} removed`);
                                  }
                                }}
                                className="p-1.5 text-neutral-400 hover:text-rose-500 transition"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Customer Shipping & Contact Details */}
                          <div className="p-3.5 rounded-xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-700/60 text-xs space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                                <span className="font-display font-bold text-neutral-900 dark:text-white text-sm">
                                  {cust.fullName || 'Customer'}
                                </span>
                                <span className="text-neutral-400">•</span>
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-pink-400" />
                                  +91 {cust.phone}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* 1-Click WhatsApp Chat */}
                                {cust.phone && (
                                  <a
                                    href={`https://wa.me/91${cust.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi ${cust.fullName}! Bhaskar from Scoop Storey here regarding your order ${ord.orderId}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition"
                                  >
                                    <WhatsAppIcon className="w-3 h-3" />
                                    <span>Chat with Customer</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}

                                {/* Copy Address for Courier Label */}
                                <button
                                  onClick={() => handleCopyAddress(ord)}
                                  className="px-2.5 py-1 rounded-lg glass-pill font-bold text-[11px] text-neutral-700 dark:text-neutral-300 hover:text-pink-600 flex items-center gap-1 transition"
                                >
                                  {copiedOrderId === ord.orderId ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span className="text-emerald-600">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Address</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Full Address */}
                            <p className="text-neutral-600 dark:text-neutral-400 pl-6 leading-relaxed">
                              {cust.streetAddress}
                              {cust.landmark ? `, Near ${cust.landmark}` : ''}
                              <br />
                              <strong>{cust.city}</strong>, {cust.state} — <strong>PIN: {cust.pincode}</strong>
                            </p>

                            {/* UPI Reference / UTR Number Verification Box */}
                            {ord.upiRefNumber && (
                              <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                                    <QrCode className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                                      Prepaid UPI Ref / UTR No. (Bank Verification):
                                    </span>
                                    <span className="font-mono font-black text-sm text-emerald-950 dark:text-emerald-100 tracking-wider">
                                      {ord.upiRefNumber}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleCopyText(ord.upiRefNumber, `utr-${ord.orderId}`)}
                                  className="self-start sm:self-center px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-50 transition shadow-xs"
                                >
                                  {copiedOrderId === `utr-${ord.orderId}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedOrderId === `utr-${ord.orderId}` ? 'Copied!' : 'Copy UTR'}</span>
                                </button>
                              </div>
                            )}

                            {/* Payment Screenshot if uploaded */}
                            {ord.paymentScreenshot && (
                              <div className="mt-2 p-2 rounded-xl bg-pink-50/70 dark:bg-neutral-800/70 border border-pink-200 dark:border-neutral-700 flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                  <img src={ord.paymentScreenshot} alt="Receipt" className="w-9 h-9 rounded-lg object-cover border" />
                                  <span className="font-bold text-neutral-800 dark:text-neutral-200">Customer attached receipt screenshot</span>
                                </div>
                                <a
                                  href={ord.paymentScreenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-pink-300 text-[#E60067] font-bold text-[11px] flex items-center gap-1 hover:bg-pink-50"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>View Image</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Ordered Products Breakdown */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold text-neutral-500 block uppercase tracking-wider">
                              Ordered Items ({ord.items?.length || 0}):
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {ord.items?.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-pink-100 dark:border-neutral-800 flex items-center gap-2 text-xs"
                                >
                                  <img
                                    src={it.image || '/images/deluxe-giftbox.jpg'}
                                    alt={it.name}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                                    }}
                                    className="w-10 h-10 rounded-lg object-cover bg-pink-50 dark:bg-neutral-800 p-0.5 border border-pink-200/50 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h6 className="font-bold text-neutral-900 dark:text-white truncate">
                                      {it.name}
                                    </h6>
                                    {it.selectedColor && (
                                      <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                                        {it.selectedColorHex && (
                                          <span
                                            className="w-2 h-2 rounded-full border border-black/20"
                                            style={{ backgroundColor: it.selectedColorHex }}
                                          />
                                        )}
                                        <span>Color: {it.selectedColor}</span>
                                      </div>
                                    )}
                                    <span className="text-pink-600 dark:text-pink-400 font-extrabold text-[11px]">
                                      x{it.qty} = ₹{it.priceINR * it.qty}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Customer Additional Notes if any */}
                          {ord.additionalNotes && (
                            <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-100 dark:border-neutral-800 text-xs">
                              <div className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-0.5">
                                <FileText className="w-3.5 h-3.5 text-pink-500" />
                                <span>Customer Additional Note:</span>
                              </div>
                              <p className="text-neutral-600 dark:text-neutral-300 italic pl-5">
                                "{ord.additionalNotes}"
                              </p>
                            </div>
                          )}

                          {/* Footer with IG Reel & Total */}
                          <div className="pt-2 border-t border-pink-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              {ord.filmOnReel && (
                                <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold text-[11px] flex items-center gap-1">
                                  🎬 Film on IG: {ord.filmOnReel}
                                </span>
                              )}
                            </div>

                            <div className="font-display font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center gap-2">
                              <span>Total Amount:</span>
                              <span className="text-[#E60067] dark:text-pink-400">
                                ₹{ord.totalINR}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: UPI & QR PAYMENT GATEWAY SETTINGS */}
            {activeTab === 'payments' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#E60067] text-white">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-neutral-900 dark:text-white">
                          UPI & QR Payment Gateway Settings
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Upload your custom payment QR code or configure UPI ID & mobile number for receiving 100% prepaid customer payments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePaymentSettings}
                    className="px-5 py-2.5 rounded-xl bg-[#E60067] hover:bg-pink-600 text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md transition self-start sm:self-center"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Payment Settings</span>
                  </button>
                </div>

                {/* Main Grid: Form on Left, Live Customer Preview on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* LEFT: SETTINGS FORM (7 cols) */}
                  <form onSubmit={handleSavePaymentSettings} className="lg:col-span-7 space-y-5">
                    
                    {/* 1. QR Code Upload Card */}
                    <div className="p-5 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-[#E60067]" />
                          <span>Store Payment QR Code</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          paymentForm.qrImage 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
                        }`}>
                          {paymentForm.qrImage ? 'Custom QR Uploaded ✨' : 'Auto-Generated UPI QR Active'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-pink-50/50 dark:bg-neutral-800/50 border border-pink-100 dark:border-neutral-700">
                        {/* Thumbnail */}
                        <div className="w-32 h-32 shrink-0 rounded-2xl bg-white p-2 border-2 border-pink-200 shadow-md flex items-center justify-center overflow-hidden">
                          <img
                            src={getQrDisplayUrl(paymentForm, 499, 'PREVIEW')}
                            alt="Active QR"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="space-y-2.5 flex-1 text-center sm:text-left">
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium leading-relaxed">
                            Upload your official Google Pay, PhonePe, Paytm, or Bank QR code image. Customers will scan this directly to complete their prepaid order.
                          </p>

                          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                            <input
                              type="file"
                              ref={qrFileInputRef}
                              accept="image/*"
                              onChange={handleQrFileUpload}
                              className="hidden"
                            />
                            
                            <button
                              type="button"
                              onClick={() => qrFileInputRef.current?.click()}
                              className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition shadow-xs"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{paymentForm.qrImage ? 'Change QR Image' : 'Upload QR Code Image'}</span>
                            </button>

                            {paymentForm.qrImage && (
                              <button
                                type="button"
                                onClick={handleRemoveCustomQr}
                                className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition"
                              >
                                Use Auto UPI QR
                              </button>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 block">
                            Accepts PNG, JPG, WebP (up to 5MB)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. UPI Details Card */}
                    <div className="p-5 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40 space-y-4">
                      <div className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#E60067]" />
                        <span>UPI ID & Phone Number Settings</span>
                      </div>

                      <div className="space-y-3.5">
                        {/* UPI ID */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                            UPI ID / VPA <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentForm.upiId}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, upiId: e.target.value }))}
                            placeholder="e.g. 8199922653@upi or bhaskar@okaxis"
                            className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-pink-400"
                          />
                          <span className="text-[10px] text-neutral-400 mt-1 block">
                            Customers can copy this with 1 click to pay in any UPI application.
                          </span>
                        </div>

                        {/* UPI Phone Number */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                            UPI Mobile / Phone Number <span className="text-pink-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">+91</span>
                            <input
                              type="text"
                              maxLength={10}
                              value={paymentForm.upiPhone}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, upiPhone: e.target.value.replace(/\D/g, '') }))}
                              placeholder="10-digit number (e.g. 8199922653)"
                              className="w-full pl-12 pr-3 py-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-mono tracking-wide focus:outline-none focus:ring-1 focus:ring-pink-400"
                            />
                          </div>
                          <span className="text-[10px] text-neutral-400 mt-1 block">
                            Direct phone number for customers searching in Google Pay, PhonePe, or Paytm.
                          </span>
                        </div>

                        {/* Payee / Business Name */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                            Beneficiary / Payee Display Name <span className="text-pink-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={paymentForm.payeeName}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, payeeName: e.target.value }))}
                            placeholder="e.g. Bhaskar - Scoop Storey"
                            className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400 font-medium"
                          />
                        </div>

                        {/* Customer Guidance Notes */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                            Instructions / Message on Checkout
                          </label>
                          <textarea
                            rows={2}
                            value={paymentForm.instructions}
                            onChange={(e) => setPaymentForm(prev => ({ ...prev, instructions: e.target.value }))}
                            placeholder="Custom payment instructions shown to customer"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400 resize-none font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3 px-5 rounded-2xl bg-[#E60067] hover:bg-pink-600 text-white font-display font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Payment Settings</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Reset all payment settings back to defaults?')) {
                            resetPaymentSettings();
                            showToast('Reset to default UPI settings');
                          }
                        }}
                        className="py-3 px-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </form>

                  {/* RIGHT: LIVE CUSTOMER PREVIEW (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        Customer Checkout Preview
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                        Live Preview
                      </span>
                    </div>

                    {/* Simulated Customer Payment Card */}
                    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-300 dark:border-pink-800 shadow-xl space-y-4">
                      <div className="text-center space-y-1">
                        <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold uppercase tracking-wide">
                          Scoop Storey Prepaid UPI
                        </span>
                        <div className="font-display font-black text-2xl text-neutral-900 dark:text-white">
                          ₹597 <span className="text-xs font-normal text-neutral-400">(Prepaid)</span>
                        </div>
                      </div>

                      {/* QR Code in preview */}
                      <div className="w-44 h-44 mx-auto p-2 bg-white rounded-2xl border-2 border-pink-200 shadow-sm flex items-center justify-center overflow-hidden">
                        <img
                          src={getQrDisplayUrl(paymentForm, 597, 'SS-SAMPLE')}
                          alt="Preview QR"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Copyable Pills Preview */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-100 dark:border-neutral-700 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-neutral-400 font-bold block uppercase">UPI ID</span>
                            <span className="font-mono font-bold text-xs">{paymentForm.upiId || '8199922653@upi'}</span>
                          </div>
                          <span className="px-2 py-1 rounded-md bg-white dark:bg-neutral-900 text-[#E60067] text-[10px] font-bold border border-pink-200">Copy</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-100 dark:border-neutral-700 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-neutral-400 font-bold block uppercase">UPI Mobile</span>
                            <span className="font-mono font-bold text-xs">+91 {paymentForm.upiPhone || '8199922653'}</span>
                          </div>
                          <span className="px-2 py-1 rounded-md bg-white dark:bg-neutral-900 text-[#E60067] text-[10px] font-bold border border-pink-200">Copy</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                        Payee: <strong>{paymentForm.payeeName}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
            {activeTab === 'products' && (
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
                    {['All', ...allCategoryNames].map((cat) => (
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
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('categories');
                        soundFX.playPop(500);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border border-dashed border-pink-400 text-[#E60067] dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/40 flex items-center gap-1.5 shrink-0"
                      title="Manage Categories"
                    >
                      <Tags className="w-3.5 h-3.5" />
                      <span>Manage Categories</span>
                    </button>
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
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                          }}
                          className="w-14 h-18 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 border border-pink-200/50 shrink-0"
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
                          onClick={() => handleDeleteProduct(p.id, p.name)}
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

            {/* TAB 3 & 4: EDIT OR ADD PRODUCT FORM */}
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold">Category</label>
                        <button
                          type="button"
                          onClick={handleOpenAddCategoryModal}
                          className="text-[10px] text-[#E60067] dark:text-pink-400 font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ New Category</span>
                        </button>
                      </div>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      >
                        {allCategoryNames.map(c => (
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-pink-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#E60067] dark:text-pink-400">
                      <ImageIcon className="w-4 h-4" />
                      <span>Product Images Gallery ({formData.images.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => productFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-[#E60067] hover:bg-[#D8005A] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        title="Upload a new photo from your device"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Thumbnail Spotlight Card */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-pink-50/70 dark:from-pink-950/30 dark:to-neutral-900 border border-pink-200/80 dark:border-pink-900/50 flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-20 h-25 aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-pink-400 shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={formData.image || formData.images[0] || '/images/deluxe-giftbox.jpg'}
                        alt="Primary Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                        }}
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#E60067] text-white text-[9px] font-black uppercase">
                        Main
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-extrabold text-[#231733] dark:text-white">
                        <span>Current Primary Store Thumbnail</span>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        This is the photo shown in the catalog, collections, and cart. Newly uploaded device photos are automatically set as main.
                      </p>
                      <button
                        type="button"
                        onClick={() => productFileInputRef.current?.click()}
                        className="text-xs font-bold text-[#E60067] dark:text-pink-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Replace with new photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Active Images Grid with mobile-friendly controls */}
                  <div>
                    <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 block mb-2">
                      All Gallery Photos ({formData.images.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {formData.images.map((img, idx) => {
                        const isMain = formData.image === img || (idx === 0 && !formData.image);
                        return (
                          <div 
                            key={idx}
                            className={`relative rounded-2xl overflow-hidden border-2 p-1.5 bg-white dark:bg-neutral-900 transition-all ${
                              isMain ? 'border-[#E60067] shadow-md ring-2 ring-pink-400/30' : 'border-pink-200 dark:border-neutral-700 hover:border-pink-300'
                            }`}
                          >
                            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                              <img 
                                src={img} 
                                alt={`Gallery ${idx + 1}`} 
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                                }}
                                className="w-full h-full object-cover rounded-lg"
                              />

                              {isMain && (
                                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-[#E60067] text-white text-[9px] font-black uppercase shadow-xs">
                                  Primary
                                </span>
                              )}
                            </div>

                            {/* Mobile-friendly action buttons */}
                            <div className="mt-2 pt-1.5 border-t border-pink-100 dark:border-neutral-800 flex items-center justify-between gap-1">
                              {!isMain ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(img)}
                                  className="px-2 py-1 rounded-lg bg-pink-100 dark:bg-pink-950 text-[#E60067] dark:text-pink-300 hover:bg-[#E60067] hover:text-white text-[10px] font-bold transition flex-1 text-center cursor-pointer"
                                  title="Make this the primary thumbnail"
                                >
                                  Set Main
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex-1 text-center">
                                  ✓ Main
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                                title="Remove image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add New Image Controls */}
                  <div className="pt-2 border-t border-pink-100 dark:border-neutral-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
                        Add Image (URL, Local Path, or Device Upload)
                      </label>
                      <span className="text-[10px] text-neutral-500 font-medium">
                        Device files, local paths & web URLs supported
                      </span>
                    </div>

                    {/* Hidden Native File Input for Device Photo Upload */}
                    <input
                      type="file"
                      ref={productFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleProductFileUpload}
                      className="hidden"
                    />

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImage();
                          }
                        }}
                        placeholder="e.g. /images/pendants/pearl-pendant.jpg or https://..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddImage()}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Add entered image URL (or browse from device if input is empty)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => productFileInputRef.current?.click()}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-pink-100 dark:bg-pink-950/80 text-[#E60067] dark:text-pink-300 border border-pink-300 dark:border-pink-800 font-bold text-xs hover:bg-pink-200 dark:hover:bg-pink-900 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          title="Upload product photo directly from your device"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload from Device</span>
                        </button>
                      </div>
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
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-pink-50 dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 hover:border-pink-400 transition cursor-pointer"
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
                    onClick={() => setActiveTab('products')}
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

            {/* TAB 4: CATEGORY & COLLECTION MANAGER */}
            {activeTab === 'categories' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-rose-500/15 border-2 border-pink-200 dark:border-pink-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-extrabold text-[#E60067] dark:text-pink-400 mb-2">
                      <Tags className="w-3.5 h-3.5" />
                      <span>Category & Collection Manager</span>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-[#231733] dark:text-white">
                      Manage Store Categories & Collections
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-xl">
                      Bracelets and Anklets are kept separate, and Eye Masks and Self-Care are kept separate. You can create custom categories, edit names, or bulk reassign products.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenAddCategoryModal}
                      className="px-4 py-2.5 rounded-2xl btn-3d-pink text-white font-display font-bold text-xs flex items-center gap-2 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Category</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBulkMoveModal({
                          isOpen: true,
                          selectedProductIds: [],
                          targetCategory: allCategoryNames[0] || 'Mystery Scoops'
                        });
                        soundFX.playPop(500);
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-display font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-95 transition"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Bulk Move Products</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetCategoriesConfirm}
                      className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-neutral-800 border border-pink-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 font-bold text-xs hover:bg-pink-50 dark:hover:bg-neutral-700 transition flex items-center gap-1.5"
                      title="Reset Categories to Defaults"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-200/80 dark:border-pink-900/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Total Categories</span>
                    <strong className="text-xl font-black text-neutral-900 dark:text-white mt-0.5 block">{allCategoryNames.length}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-200/80 dark:border-pink-900/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Total Products</span>
                    <strong className="text-xl font-black text-neutral-900 dark:text-white mt-0.5 block">{products.length}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-neutral-800/80 border border-pink-200/80 dark:border-pink-900/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Avg Items / Cat</span>
                    <strong className="text-xl font-black text-neutral-900 dark:text-white mt-0.5 block">
                      {(products.length / Math.max(1, allCategoryNames.length)).toFixed(1)}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">Supabase Sync</span>
                    <strong className="text-sm font-black text-emerald-700 dark:text-emerald-300 mt-1 block flex items-center gap-1">
                      <Check className="w-4 h-4" /> Live & Cloud Synced
                    </strong>
                  </div>
                </div>

                {/* Categories Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allCategoryNames.map((catName) => {
                    const meta = categoryList.find(c => c.name === catName) || {
                      id: slugifyCategory(catName),
                      name: catName,
                      icon: '✨',
                      badge: 'Collection 🎀',
                      description: `Handpicked cute items curated under ${catName}.`,
                      isDefault: false
                    };

                    const catProducts = products.filter(p => p.category === catName);
                    const inStockCount = catProducts.filter(p => p.inStock !== false).length;

                    return (
                      <div
                        key={catName}
                        className="p-4 rounded-3xl bg-white dark:bg-neutral-800/90 border-2 border-pink-200/80 dark:border-pink-900/50 hover:border-pink-400 transition shadow-sm flex flex-col justify-between gap-3 group"
                      >
                        <div>
                          {/* Card Header: Icon, Name & Action buttons */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 via-purple-100 to-pink-50 dark:from-pink-950 dark:to-neutral-900 border border-pink-200 dark:border-pink-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                                {meta.icon || '🎀'}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-display font-extrabold text-sm sm:text-base text-[#231733] dark:text-white truncate">
                                  {catName}
                                </h4>
                                {meta.badge && (
                                  <span className="inline-block text-[10px] font-bold text-pink-600 dark:text-pink-300 bg-pink-100/80 dark:bg-pink-950/60 px-2 py-0.5 rounded-md border border-pink-200 dark:border-pink-800 truncate max-w-full">
                                    {meta.badge}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCategoryModal(meta)}
                                className="p-1.5 rounded-xl text-neutral-500 hover:text-[#E60067] hover:bg-pink-50 dark:hover:bg-neutral-700 transition"
                                title={`Edit ${catName}`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const otherCategory = allCategoryNames.find(c => c !== catName) || 'Mystery Scoops';
                                  setDeleteCategoryModal({
                                    isOpen: true,
                                    categoryName: catName,
                                    reassignTo: otherCategory
                                  });
                                  soundFX.playPop(400);
                                }}
                                className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-neutral-700 transition"
                                title={`Delete ${catName}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2.5 line-clamp-2 leading-relaxed">
                            {meta.description || `Explore our cute ${catName} line.`}
                          </p>

                          <div className="mt-2 text-[10px] text-neutral-400 font-mono">
                            #{categoryToSlug(catName)}
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="pt-3 border-t border-pink-100 dark:border-neutral-700 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-[#E60067] dark:text-pink-300 font-extrabold text-[11px]">
                              {catProducts.length} {catProducts.length === 1 ? 'Product' : 'Products'}
                            </span>
                            {catProducts.length > 0 && inStockCount === 0 && (
                              <span className="text-[10px] text-rose-500 font-bold">Out of stock</span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(catName);
                              setActiveTab('products');
                              soundFX.playPop(500);
                            }}
                            className="text-xs font-bold text-[#E60067] dark:text-pink-400 hover:underline flex items-center gap-1"
                          >
                            <span>View Items</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODAL 1: ADD / EDIT CATEGORY MODAL */}
            {categoryModal.isOpen && (
              <div 
                onClick={() => setCategoryModal(prev => ({ ...prev, isOpen: false }))}
                className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
              >
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#1E172E] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-pink-300 dark:border-pink-800 space-y-4 animate-scaleUp text-[#231733] dark:text-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/80 flex items-center justify-center text-[#E60067] dark:text-pink-400">
                        <Tags className="w-4 h-4" />
                      </div>
                      <h4 className="font-display font-extrabold text-base">
                        {categoryModal.mode === 'add' ? 'Create New Category' : `Edit Category: ${categoryModal.oldName}`}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCategoryModal(prev => ({ ...prev, isOpen: false }))}
                      className="p-1 rounded-xl hover:bg-pink-100 dark:hover:bg-neutral-800 transition text-neutral-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCategorySubmit} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Category Name *</label>
                      <input
                        type="text"
                        value={categoryModal.name}
                        onChange={(e) => setCategoryModal({ ...categoryModal, name: e.target.value })}
                        placeholder="e.g. Hair Accessories, Phone Charms, Stationery"
                        className="w-full px-3 py-2.5 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-bold focus:outline-none focus:ring-1 focus:ring-pink-400"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Category Emoji Icon</label>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-neutral-800 flex items-center justify-center text-xl shrink-0 border border-pink-200 dark:border-neutral-700">
                          {categoryModal.icon || '🎀'}
                        </div>
                        <input
                          type="text"
                          value={categoryModal.icon}
                          onChange={(e) => setCategoryModal({ ...categoryModal, icon: e.target.value })}
                          placeholder="Type or click emoji below"
                          className="flex-1 px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                        />
                      </div>

                      {/* Quick Emoji Picker Buttons */}
                      <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-pink-50/40 dark:bg-neutral-900/60 border border-pink-100 dark:border-pink-900/40">
                        {['🎀', '✨', '🧸', '🍨', '💫', '💤', '🌸', '👛', '💎', '🍓', '🦋', '💍', '👑', '📦', '💖', '🌈'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setCategoryModal(prev => ({ ...prev, icon: emoji }))}
                            className={`w-7 h-7 rounded-lg text-base flex items-center justify-center transition hover:scale-110 ${
                              categoryModal.icon === emoji ? 'bg-pink-300 dark:bg-pink-800 ring-2 ring-pink-500' : 'hover:bg-white dark:hover:bg-neutral-800'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Badge Tag (Optional)</label>
                      <input
                        type="text"
                        value={categoryModal.badge}
                        onChange={(e) => setCategoryModal({ ...categoryModal, badge: e.target.value })}
                        placeholder="e.g. New Drop 🎀, Summer Shimmer ☀️, Viral on Insta ✨"
                        className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Description (Optional)</label>
                      <textarea
                        rows={2}
                        value={categoryModal.description}
                        onChange={(e) => setCategoryModal({ ...categoryModal, description: e.target.value })}
                        placeholder="Short overview shown on the collection card..."
                        className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 resize-none focus:outline-none focus:ring-1 focus:ring-pink-400"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setCategoryModal(prev => ({ ...prev, isOpen: false }))}
                        className="px-4 py-2 rounded-xl border border-pink-200 dark:border-neutral-700 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl btn-3d-pink text-white font-display font-bold shadow-md"
                      >
                        {categoryModal.mode === 'add' ? 'Create Category' : 'Save Category'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODAL 2: DELETE CATEGORY CONFIRMATION MODAL */}
            {deleteCategoryModal.isOpen && (
              <div 
                onClick={() => setDeleteCategoryModal({ isOpen: false, categoryName: '', reassignTo: '' })}
                className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
              >
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#1E172E] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300 dark:border-rose-900 space-y-4 animate-scaleUp text-[#231733] dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-base text-rose-600 dark:text-rose-400">
                        Delete Category "{deleteCategoryModal.categoryName}"?
                      </h4>
                      <span className="text-xs text-neutral-500">Safe deletion with product reassignment</span>
                    </div>
                  </div>

                  {(() => {
                    const affected = products.filter(p => p.category === deleteCategoryModal.categoryName);
                    const remainingCategories = allCategoryNames.filter(c => c !== deleteCategoryModal.categoryName);

                    return (
                      <div className="space-y-3 text-xs">
                        {affected.length > 0 ? (
                          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 leading-relaxed">
                            <strong>Notice:</strong> There are currently <strong>{affected.length} products</strong> in this category. To avoid losing or orphaning items, choose where they should be moved:
                          </div>
                        ) : (
                          <p className="text-neutral-600 dark:text-neutral-300">
                            There are 0 products in this category. It can be safely deleted.
                          </p>
                        )}

                        {affected.length > 0 && (
                          <div>
                            <label className="block font-bold mb-1">Reassign {affected.length} products to:</label>
                            <select
                              value={deleteCategoryModal.reassignTo}
                              onChange={(e) => setDeleteCategoryModal({ ...deleteCategoryModal, reassignTo: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 font-bold focus:outline-none focus:ring-1 focus:ring-pink-400"
                            >
                              {remainingCategories.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setDeleteCategoryModal({ isOpen: false, categoryName: '', reassignTo: '' })}
                            className="px-4 py-2 rounded-xl border border-pink-200 dark:border-neutral-700 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteCategoryConfirm}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-display font-bold shadow-md transition"
                          >
                            Delete Category
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB 5: ASMR REELS & VIDEO UPLOADS */}
            {activeTab === 'reels' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-rose-500/15 border-2 border-pink-200 dark:border-pink-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-extrabold text-[#E60067] dark:text-pink-400 mb-2">
                      <Video className="w-3.5 h-3.5" />
                      <span>Instagram ASMR Packing Reels Studio</span>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-[#231733] dark:text-white">
                      Upload & Edit Packing Videos
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-xl">
                      Upload video files (.mp4, .webm, .mov) or set video links, update view counters, edit order titles, and add Instagram links for your homepage feed.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenAddReel}
                      className="px-4 py-2.5 rounded-2xl btn-3d-pink text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Reel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset all reels back to original defaults?')) {
                          resetReels();
                          showToast('Reels reset to default');
                        }
                      }}
                      className="px-3 py-2 rounded-2xl border border-pink-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-pink-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>

                {/* Hidden Quick Video File Input */}
                <input
                  ref={quickVideoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0] && quickUploadReelId) {
                      handleReelVideoUpload(e.target.files[0], quickUploadReelId);
                    }
                    e.target.value = '';
                  }}
                />

                {/* Reels Grid in Admin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {reels.map((reel, index) => {
                    const hasVideo = Boolean(reel.videoUrl && reel.videoUrl !== '__STORED_IN_INDEXEDDB__');
                    return (
                      <div
                        key={reel.id}
                        className="rounded-3xl bg-white dark:bg-[#1E172E] border-2 border-pink-200 dark:border-pink-900/60 overflow-hidden shadow-md flex flex-col justify-between group hover:border-pink-400 transition"
                      >
                        <div>
                          {/* 9:16 Aspect Video / Poster Preview */}
                          <div className="relative aspect-[9/16] w-full bg-neutral-900 overflow-hidden">
                            {hasVideo ? (
                              <video
                                src={reel.videoUrl}
                                poster={reel.image}
                                muted
                                loop
                                playsInline
                                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={reel.image || '/images/asmr-packing.jpg'}
                                alt={reel.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { 
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/brand-avatar.jpg'; 
                                }}
                              />
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3 z-10">
                              {hasVideo ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-black flex items-center gap-1 shadow-xs backdrop-blur-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>Video Active</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-black/60 text-pink-300 text-[10px] font-black flex items-center gap-1 shadow-xs backdrop-blur-xs border border-white/20">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>Cover Image Only</span>
                                </span>
                              )}
                            </div>

                            {/* Slot number */}
                            <span className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-black/60 text-white text-[11px] font-black flex items-center justify-center border border-white/20">
                              #{index + 1}
                            </span>

                            {/* Views & Likes stats overlay */}
                            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/75 backdrop-blur-md text-white text-[10px] flex items-center justify-between border border-white/10">
                              <span className="font-bold flex items-center gap-1">
                                <Play className="w-2.5 h-2.5 fill-white" />
                                <span>{reel.views || '500K'}</span>
                              </span>
                              <span className="font-bold flex items-center gap-1">
                                <Heart className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
                                <span>{reel.likes || '45K'}</span>
                              </span>
                              <span className="text-neutral-400 truncate max-w-[80px]">
                                {reel.comments || '1.2K'}💬
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-3.5 space-y-1.5">
                            <h5 className="font-display font-bold text-xs text-[#231733] dark:text-white line-clamp-2">
                              {reel.title}
                            </h5>
                            <p className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold truncate">
                              {reel.tag || '#mysteryscoop #asmr'}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              🎵 {reel.audio || 'Original Audio'}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-3 pt-0 border-t border-pink-100 dark:border-neutral-800 space-y-2">
                          <div className="grid grid-cols-2 gap-1.5 pt-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditReel(reel)}
                              className="w-full py-1.5 px-2 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[#E60067] dark:text-pink-300 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setQuickUploadReelId(reel.id);
                                quickVideoInputRef.current?.click();
                              }}
                              className="w-full py-1.5 px-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/80 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                              title="Upload video file directly to this reel"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>{hasVideo ? 'Replace Video' : 'Upload Video'}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            {reel.instagramUrl && (
                              <a
                                href={reel.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 dark:text-pink-400 font-bold hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View on IG</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteReel(reel.id)}
                              className="text-neutral-400 hover:text-rose-500 font-bold ml-auto flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODAL 3: BULK MOVE PRODUCTS MODAL */}
            {bulkMoveModal.isOpen && (
              <div 
                onClick={() => setBulkMoveModal({ isOpen: false, selectedProductIds: [], targetCategory: '' })}
                className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
              >
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#1E172E] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col p-5 sm:p-6 shadow-2xl border-2 border-pink-300 dark:border-pink-800 space-y-4 animate-scaleUp text-[#231733] dark:text-white overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-pink-100 dark:border-pink-900/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base">Bulk Move Products</h4>
                        <span className="text-[11px] text-neutral-500">Reassign multiple items to a category at once</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBulkMoveModal({ isOpen: false, selectedProductIds: [], targetCategory: '' })}
                      className="p-1 rounded-xl hover:bg-pink-100 dark:hover:bg-neutral-800 transition text-neutral-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Target Category Selector */}
                  <div className="p-3.5 rounded-2xl bg-pink-50/60 dark:bg-neutral-900/70 border border-pink-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      Destination Category:
                    </span>
                    <select
                      value={bulkMoveModal.targetCategory}
                      onChange={(e) => setBulkMoveModal({ ...bulkMoveModal, targetCategory: e.target.value })}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-pink-300 dark:border-neutral-600 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-pink-400"
                    >
                      {allCategoryNames.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selection Bar */}
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-300 px-1">
                    <span>
                      {bulkMoveModal.selectedProductIds.length} of {products.length} products selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBulkMoveModal(prev => ({
                          ...prev,
                          selectedProductIds: products.map(p => p.id)
                        }))}
                        className="text-[#E60067] dark:text-pink-400 hover:underline"
                      >
                        Select All
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setBulkMoveModal(prev => ({ ...prev, selectedProductIds: [] }))}
                        className="text-neutral-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Product Checkbox List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-72 border rounded-2xl p-2 border-pink-100 dark:border-neutral-800">
                    {products.map((p) => {
                      const isChecked = bulkMoveModal.selectedProductIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition cursor-pointer text-xs ${
                            isChecked
                              ? 'bg-pink-100/70 dark:bg-pink-950/50 border-pink-400'
                              : 'bg-white dark:bg-neutral-800/80 border-pink-100 dark:border-neutral-700/60 hover:bg-pink-50/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setBulkMoveModal(prev => ({
                                ...prev,
                                selectedProductIds: isChecked
                                  ? prev.selectedProductIds.filter(id => id !== p.id)
                                  : [...prev.selectedProductIds, p.id]
                              }));
                            }}
                            className="w-4 h-4 rounded text-pink-600 focus:ring-pink-400 cursor-pointer"
                          />

                          <img
                            src={p.image || p.images?.[0] || '/images/deluxe-giftbox.jpg'}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/deluxe-giftbox.jpg';
                            }}
                            className="w-9 h-11 rounded-lg object-cover bg-neutral-100 dark:bg-neutral-900 border shrink-0"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-neutral-900 dark:text-white truncate">
                              {p.name}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                              <span>Current: <strong className="text-pink-600 dark:text-pink-400">{p.category}</strong></span>
                              <span>•</span>
                              <span>₹{p.priceINR}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Modal Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-pink-100 dark:border-pink-900/40 text-xs">
                    <button
                      type="button"
                      onClick={() => setBulkMoveModal({ isOpen: false, selectedProductIds: [], targetCategory: '' })}
                      className="px-4 py-2 rounded-xl border border-pink-200 dark:border-neutral-700 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkMoveSubmit}
                      disabled={bulkMoveModal.selectedProductIds.length === 0}
                      className="px-5 py-2.5 rounded-xl btn-3d-pink text-white font-display font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      <span>
                        Move {bulkMoveModal.selectedProductIds.length} Products to "{bulkMoveModal.targetCategory}"
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL 4: EDIT / ADD ASMR REEL MODAL */}
            {editingReel && (
              <div
                onClick={() => setEditingReel(null)}
                className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#1E172E] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-5 sm:p-6 shadow-2xl border-2 border-pink-300 dark:border-pink-800 space-y-4 animate-scaleUp text-[#231733] dark:text-white overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E60067] to-purple-600 text-white flex items-center justify-center shadow-md">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base">
                          {editingReel.isNew ? 'Create New ASMR Packing Reel' : 'Edit ASMR Reel & Upload Video'}
                        </h4>
                        <span className="text-[11px] text-neutral-500">
                          Configure video, cover poster, views, likes & Instagram links
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingReel(null)}
                      className="p-1 rounded-xl hover:bg-pink-100 dark:hover:bg-neutral-800 transition text-neutral-400 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body Form */}
                  <form onSubmit={handleSaveReel} className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {/* Video Upload Section */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-purple-50/60 dark:from-neutral-800/80 dark:to-neutral-800/40 border border-pink-200 dark:border-pink-900/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-[#E60067]" />
                          <span>Video File (.mp4, .webm, .mov)</span>
                        </label>
                        {videoUploading && (
                          <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold animate-pulse">
                            Processing video file...
                          </span>
                        )}
                      </div>

                      {/* Video Player Preview if attached */}
                      {reelFormData.videoUrl ? (
                        <div className="space-y-2">
                          <div className="relative aspect-[9/16] max-h-64 rounded-2xl bg-black overflow-hidden border border-pink-300 dark:border-neutral-700 mx-auto flex items-center justify-center">
                            <video
                              src={reelFormData.videoUrl}
                              poster={reelFormData.image}
                              controls
                              playsInline
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'video/*';
                                input.onchange = (e) => {
                                  if (e.target.files?.[0]) handleReelVideoUpload(e.target.files[0]);
                                };
                                input.click();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-neutral-700 text-[#E60067] dark:text-pink-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Replace Video</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                showToast('Generating cover from video...');
                                const poster = await captureVideoPoster(reelFormData.videoUrl);
                                if (poster) {
                                  setReelFormData(prev => ({ ...prev, image: poster }));
                                  showToast('Cover poster generated!');
                                } else {
                                  showToast('Could not extract frame');
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-neutral-700 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Auto-Create Poster Frame</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setReelFormData(prev => ({ ...prev, videoUrl: '' }))}
                              className="px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                            >
                              Remove Video
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'video/*';
                            input.onchange = (e) => {
                              if (e.target.files?.[0]) handleReelVideoUpload(e.target.files[0]);
                            };
                            input.click();
                          }}
                          className="border-2 border-dashed border-pink-300 dark:border-pink-800 rounded-2xl p-6 text-center hover:bg-pink-100/50 dark:hover:bg-neutral-800 transition cursor-pointer space-y-1.5"
                        >
                          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-neutral-700 text-[#E60067] dark:text-pink-300 flex items-center justify-center mx-auto">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                            Click to upload video file (MP4, WebM, MOV)
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            Saved permanently in IndexedDB — persists across reloads!
                          </p>
                        </div>
                      )}

                      {/* Or Video URL input */}
                      <div className="pt-1">
                        <label className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Or enter direct Video URL:
                        </label>
                        <input
                          type="text"
                          value={reelFormData.videoUrl?.startsWith('data:') ? '' : reelFormData.videoUrl}
                          onChange={(e) => setReelFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="e.g. https://.../reel-packing.mp4"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:border-[#E60067]"
                        />
                      </div>
                    </div>

                    {/* Cover Poster Image Upload */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/60 border border-pink-200 dark:border-neutral-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#E60067]" />
                          <span>Cover Poster Image</span>
                        </label>
                        {posterUploading && (
                          <span className="text-[11px] text-pink-600 font-bold animate-pulse">Compressing...</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={reelFormData.image || '/images/asmr-packing.jpg'}
                          alt="Poster preview"
                          className="w-14 h-20 rounded-xl object-cover bg-neutral-900 border border-pink-200 shrink-0"
                          onError={(e) => { 
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/brand-avatar.jpg'; 
                          }}
                        />

                        <div className="flex-1 space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                if (e.target.files?.[0]) handleReelPosterUpload(e.target.files[0]);
                              };
                              input.click();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-neutral-700 text-[#E60067] dark:text-pink-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Cover Photo</span>
                          </button>

                          <input
                            type="text"
                            value={reelFormData.image?.startsWith('data:') ? '' : reelFormData.image}
                            onChange={(e) => setReelFormData(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="Or enter image URL (/images/asmr-packing.jpg)"
                            className="w-full px-3 py-1.5 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reel Title & Hashtags */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Reel Caption / Order Note:
                        </label>
                        <input
                          type="text"
                          value={reelFormData.title}
                          onChange={(e) => setReelFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Packing 5x Scoop Order for @diya_aesthetic 🎀"
                          className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none focus:border-[#E60067] font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Hashtags:
                          </label>
                          <input
                            type="text"
                            value={reelFormData.tag}
                            onChange={(e) => setReelFormData(prev => ({ ...prev, tag: e.target.value }))}
                            placeholder="e.g. #mysteryscoop #asmrpacking #satisfying"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Audio Track Name:
                          </label>
                          <input
                            type="text"
                            value={reelFormData.audio}
                            onChange={(e) => setReelFormData(prev => ({ ...prev, audio: e.target.value }))}
                            placeholder="e.g. Pure ASMR Charm Clinks • Bhaskar"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Metrics: Views, Likes, Comments */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">Views Count:</label>
                          <input
                            type="text"
                            value={reelFormData.views}
                            onChange={(e) => setReelFormData(prev => ({ ...prev, views: e.target.value }))}
                            placeholder="e.g. 482K"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1">Likes Count:</label>
                          <input
                            type="text"
                            value={reelFormData.likes}
                            onChange={(e) => setReelFormData(prev => ({ ...prev, likes: e.target.value }))}
                            placeholder="e.g. 42.8K"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1">Comments Count:</label>
                          <input
                            type="text"
                            value={reelFormData.comments}
                            onChange={(e) => setReelFormData(prev => ({ ...prev, comments: e.target.value }))}
                            placeholder="e.g. 1,280"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Instagram Link */}
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Instagram Post / Reel URL:
                        </label>
                        <input
                          type="text"
                          value={reelFormData.instagramUrl}
                          onChange={(e) => setReelFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                          placeholder="https://www.instagram.com/reel/..."
                          className="w-full px-3 py-2 text-xs rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Modal Footer Buttons */}
                    <div className="pt-3 flex items-center justify-between border-t border-pink-100 dark:border-pink-900/40">
                      <button
                        type="button"
                        onClick={() => setEditingReel(null)}
                        className="px-4 py-2 rounded-xl border border-pink-200 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl btn-3d-pink text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Reel & Publish</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 6: STORE MANAGER SECURITY & PASSCODE */}
            {activeTab === 'security' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Header Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#E60067] text-white shadow-md">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-neutral-900 dark:text-white">
                        Admin Passcode & Store Security
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Change the secret passcode used to access customer orders, UPI payments, and store catalog.
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black self-start sm:self-center flex items-center gap-1.5 ${
                    getAdminPasscode() !== DEFAULT_PASSCODE
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{getAdminPasscode() !== DEFAULT_PASSCODE ? 'Custom Passcode Active 🛡️' : 'Default Passcode Active'}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl">
                  {/* Left Column: Change Passcode Form */}
                  <div className="lg:col-span-7">
                    <form onSubmit={handleChangePasscode} className="p-5 sm:p-6 rounded-3xl glass-panel border border-pink-200 dark:border-pink-900/40 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 pb-2 border-b border-pink-100 dark:border-pink-900/30">
                        <Lock className="w-4 h-4 text-[#E60067]" />
                        <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white">
                          Change Store Passcode
                        </h4>
                      </div>

                      {/* Status / feedback alerts */}
                      {securityError && (
                        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{securityError}</span>
                        </div>
                      )}

                      {securitySuccess && (
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>{securitySuccess}</span>
                        </div>
                      )}

                      {/* Current Passcode Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                          Current Passcode <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPass ? 'text' : 'password'}
                            value={currentPassInput}
                            onChange={(e) => {
                              setCurrentPassInput(e.target.value);
                              if (securityError) setSecurityError('');
                            }}
                            placeholder="Enter current passcode"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition p-1"
                            title={showCurrentPass ? "Hide passcode" : "Show passcode"}
                          >
                            {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* New Passcode Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                          New Passcode <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={newPassInput}
                            onChange={(e) => {
                              setNewPassInput(e.target.value);
                              if (securityError) setSecurityError('');
                            }}
                            placeholder="Enter new private passcode (min. 4 characters)"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition p-1"
                            title={showNewPass ? "Hide passcode" : "Show passcode"}
                          >
                            {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Passcode Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                          Confirm New Passcode <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? 'text' : 'password'}
                            value={confirmPassInput}
                            onChange={(e) => {
                              setConfirmPassInput(e.target.value);
                              if (securityError) setSecurityError('');
                            }}
                            placeholder="Re-type new passcode"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-pink-50/50 dark:bg-neutral-900 border border-pink-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition p-1"
                            title={showConfirmPass ? "Hide passcode" : "Show passcode"}
                          >
                            {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-between">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-3d-pink text-white font-display font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Update Passcode</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetPasscode}
                          className="w-full sm:w-auto px-3 py-2 rounded-xl text-neutral-500 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Restore default passcode"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset to Default</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Security Guidance */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="p-5 rounded-3xl bg-pink-50/60 dark:bg-neutral-800/60 border border-pink-200/80 dark:border-neutral-700 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#E60067] dark:text-pink-400 uppercase tracking-wide">
                        <Shield className="w-4 h-4" />
                        <span>Security Advice</span>
                      </div>
                      <ul className="text-xs text-neutral-600 dark:text-neutral-300 space-y-2 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 font-bold">•</span>
                          <span><strong>Private Access:</strong> Only share this passcode with staff who handle orders or update products.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 font-bold">•</span>
                          <span><strong>Safe Storage:</strong> Your passcode is securely saved in your browser's persistent storage.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 font-bold">•</span>
                          <span><strong>Hidden Default:</strong> The default password notice has been removed from the login screen so store visitors cannot see it.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
