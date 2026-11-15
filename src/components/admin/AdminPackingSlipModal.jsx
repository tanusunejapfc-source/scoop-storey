import React from 'react';
import { Printer, X, Check, Package, Sparkles } from 'lucide-react';
import { soundFX } from '../../utils/audio';

export default function AdminPackingSlipModal({
  order,
  isOpen,
  onClose
}) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    soundFX.playPop(600);
    window.print();
  };

  const formattedDate = new Date(order.timestamp || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white text-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls (Hidden on print) */}
        <div className="print:hidden p-4 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#E60067]" />
            <span className="font-display font-extrabold text-sm text-[#231733]">
              Thermal Label & Packing Slip Preview (Order #{order.orderId})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#E60067] hover:bg-pink-700 text-white font-display font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-pink-100 text-neutral-400 hover:text-neutral-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Label & Slip Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-neutral-900 font-sans print:p-0 print:m-0">
          
          {/* Header Row */}
          <div className="flex items-start justify-between border-b-2 border-neutral-900 pb-4">
            <div>
              <h1 className="font-display font-black text-2xl tracking-tight text-[#E60067]">
                SCOOP STOREY
              </h1>
              <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider">
                Luxury Aesthetic & Korean Accessories • India
              </p>
              <p className="text-[10px] text-neutral-400">
                Instagram: @scoopstorey • WhatsApp: +91 8199922653
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-lg block">
                #{order.orderId}
              </span>
              <span className="text-[11px] text-neutral-500 font-medium block">
                Date: {formattedDate}
              </span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-neutral-100 border border-neutral-300">
                {order.isPartialCod ? 'PARTIAL COD' : 'PREPAID ORDER'}
              </span>
            </div>
          </div>

          {/* Delivery & Dispatch Route */}
          <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4 text-xs">
            {/* Customer Shipping Address */}
            <div className="space-y-1">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                Deliver To:
              </span>
              <p className="font-extrabold text-sm text-neutral-900">
                {order.customer?.fullName || 'Customer'}
              </p>
              <p className="font-semibold text-neutral-700">
                {order.customer?.streetAddress}
              </p>
              {order.customer?.landmark && (
                <p className="text-[11px] text-neutral-500">
                  Landmark: {order.customer.landmark}
                </p>
              )}
              <p className="font-extrabold text-neutral-900">
                {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
              </p>
              <p className="font-mono font-bold text-neutral-800 pt-0.5">
                📞 +91 {order.customer?.phone}
              </p>
            </div>

            {/* Courier & Merchant Return Info */}
            <div className="space-y-1 border-l pl-4 border-neutral-200 text-right sm:text-left">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                Courier & Return Info:
              </span>
              <p className="font-bold text-neutral-900">
                Courier Partner: {order.courierName || 'Delhivery Express'}
              </p>
              <p className="font-mono font-bold text-neutral-800">
                AWB: {order.trackingNumber || 'PENDING'}
              </p>
              <div className="pt-2 text-[10px] text-neutral-500">
                <p className="font-bold text-neutral-700">Return If Undelivered To:</p>
                <p>Scoop Storey Boutique, Warehouse Hub, Delhi NCR - 110001</p>
              </div>
            </div>
          </div>

          {/* Special Reel Packaging Note */}
          {order.filmOnReel && (
            <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700 flex items-center justify-between">
              <span>🎬 Film Packaging on Instagram Reel:</span>
              <span className="font-mono font-extrabold">{order.filmOnReel}</span>
            </div>
          )}

          {/* Itemized Packing Checklist */}
          <div>
            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider block mb-2">
              Packer's Checklist & Manifest:
            </span>
            <table className="w-full text-left text-xs border border-neutral-200 rounded-xl overflow-hidden">
              <thead className="bg-neutral-100 font-extrabold text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="p-2.5 w-10 text-center">Packed</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Color / Variant</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {(order.items || []).map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 text-center">
                      <div className="w-4 h-4 rounded border-2 border-neutral-400 mx-auto" />
                    </td>
                    <td className="p-2.5 font-bold text-neutral-900">
                      {it.name}
                    </td>
                    <td className="p-2.5 text-neutral-600 font-semibold">
                      {it.selectedColor || 'Standard'}
                    </td>
                    <td className="p-2.5 text-center font-bold">
                      {it.qty || 1}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      ₹{(it.priceINR || 0) * (it.qty || 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="border-t-2 border-neutral-900 pt-3 flex items-center justify-between">
            <div className="text-xs">
              {order.isPartialCod ? (
                <div>
                  <span className="text-amber-800 font-black block">
                    ⚠️ CASH TO COLLECT: ₹{order.balanceDueOnDeliveryINR}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    Advance of ₹{order.advancePaidINR} paid via UPI ({order.upiRefNumber})
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-emerald-700 font-black block">
                    ✅ FULLY PREPAID (Do Not Collect Cash)
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    UTR: {order.upiRefNumber || 'Online'}
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-neutral-500 block">Total Invoice:</span>
              <span className="font-display font-black text-xl text-neutral-900">
                ₹{order.totalINR}
              </span>
            </div>
          </div>

          {/* Customer Thank You */}
          <div className="text-center pt-4 border-t border-dashed border-neutral-300 text-[11px] text-neutral-500">
            <p className="font-bold text-neutral-700">Thank you for ordering from Scoop Storey! 🎀</p>
            <p>Tag us @scoopstorey on Instagram to get featured on our page!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
