import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Video, 
  Check, 
  AlertCircle,
  Maximize2,
  X 
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { PRODUCTS, CATEGORIES } from '../data/storeData';
import WhatsAppIcon from './WhatsAppIcon';

export { PRODUCTS };

export default function ProductCatalog({ onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [addedItem, setAddedItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const filteredProducts = activeCategory === 'All Items'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleAdd = (product) => {
    soundFX.playPop(650);
    soundFX.playChime();
    onAddToCart(product);
    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <section id="menu" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Policy Reminder Banner */}
      <div className="mb-8 p-3 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:bg-neutral-800/90 border-2 border-pink-300 dark:border-pink-800 flex items-center justify-center gap-2 text-xs font-bold text-[#231733] dark:text-[#E0D7EB] text-center shadow-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-[#E60067]" />
        <span>Order Rule: Minimum 3 Products Required • Single Item Order Not Available • 100% Prepaid Delivery</span>
      </div>

      {/* Title & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-extrabold tracking-wider uppercase mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>Official Scoop Storey India Catalog</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#231733] dark:text-white">
            The Scoop Menu
          </h2>
          <p className="mt-2 text-[#554664] dark:text-[#E0D7EB] font-medium max-w-xl text-sm md:text-base">
            Explore authentic Pendants, Charm Bracelets, Self-Care Eye Masks, Korean Wallets, and Mystery Scoops. All prices in <strong className="text-[#231733] dark:text-white font-bold">₹ (INR)</strong> only.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                soundFX.playPop(500);
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-[#E60067] text-white border-[#E60067] shadow-md'
                  : 'bg-white dark:bg-[#1E172E] text-[#231733] dark:text-[#E0D7EB] border-pink-200/80 dark:border-pink-900 hover:bg-pink-50 dark:hover:bg-neutral-800 shadow-xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredProducts.map((product) => {
          const isJustAdded = addedItem === product.id;
          const whatsappUrl = `https://wa.me/918199922653?text=${encodeURIComponent(`Hi! Mujhe ${product.name} Rs ${product.priceINR} wala order karna hai - Only Prepaid`)}`;

          return (
            <div
              key={product.id}
              className="group rounded-3xl bg-white dark:bg-[#1E172E] overflow-hidden border-2 border-pink-200/80 dark:border-pink-900/60 hover:shadow-2xl hover:border-pink-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-md"
            >
              <div>
                {/* Standard Uniform Aspect Ratio Container (4:5 Standard E-Commerce Ratio) */}
                <div 
                  onClick={() => setPreviewImage(product)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-pink-50/40 dark:from-[#251A38] dark:via-[#1E172E] dark:to-[#181126] flex items-center justify-center p-3 cursor-zoom-in"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md text-xs font-black text-[#E60067] dark:text-pink-400 shadow-sm border border-pink-200/60 dark:border-pink-800 pointer-events-none">
                    {product.badge}
                  </span>

                  {/* Zoom Action Pill */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(product);
                    }}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-[#231733] dark:text-white shadow-xs hover:bg-pink-100 dark:hover:bg-neutral-800 transition"
                    title="View Full Resolution Look"
                    aria-label="View Full Resolution Look"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Pack on Reel Tag */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white shadow-xs pointer-events-none">
                    <Video className="w-3 h-3 text-pink-400" />
                    <span>Eligible for IG Reel packing</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[11px] font-black text-[#E60067] dark:text-pink-400 uppercase tracking-wider mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-display font-extrabold text-base md:text-lg text-[#231733] dark:text-white group-hover:text-[#E60067] transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#554664] dark:text-[#D5CBE2] line-clamp-2 leading-relaxed font-medium">
                    {product.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-3.5 pt-3 border-t border-pink-100 dark:border-pink-900/40 space-y-1">
                    {product.includes.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-[#483A54] dark:text-[#D5CBE2]">
                        <Check className="w-3.5 h-3.5 text-[#E60067] dark:text-pink-400 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="p-5 pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-display font-black text-[#231733] dark:text-white">
                      ₹{product.priceINR}
                    </span>
                    <span className="text-[10px] text-[#716182] dark:text-neutral-400 font-bold ml-1">
                      (Prepaid)
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`py-2 px-3.5 rounded-xl font-display font-bold text-xs tracking-wide transition-all flex items-center gap-1.5 ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'btn-3d-pink text-white'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-white" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Buy on WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Buy on WhatsApp (+91 8199922653)</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL LOOK LIGHTBOX MODAL */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-[#1E172E] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden p-4 sm:p-6 shadow-2xl border-2 border-pink-300 dark:border-pink-700 flex flex-col items-center animate-scaleUp"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition z-10 shadow-md"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full flex-1 overflow-y-auto flex items-center justify-center py-2">
              <img
                src={previewImage.image}
                alt={previewImage.name}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-md"
              />
            </div>

            <div className="w-full mt-3 pt-3 border-t border-pink-100 dark:border-pink-900/40 flex items-center justify-between text-xs sm:text-sm font-bold text-[#231733] dark:text-white">
              <div>
                <span>{previewImage.name}</span>
                <span className="block text-[11px] text-pink-600 dark:text-pink-400 font-semibold">{previewImage.category}</span>
              </div>
              <span className="text-[#E60067] dark:text-pink-400 font-extrabold text-base">₹{previewImage.priceINR}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
