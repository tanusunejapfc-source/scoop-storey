import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://fxsmqomlxekbcfihhnle.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_wfIyuRhwsJAqtZrisb0q9A_AcYO0xCU';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Upload an image file to Supabase Storage ('product-images' bucket)
 * Returns permanent public URL accessible by everyone worldwide
 */
export async function uploadImageToSupabase(file) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'jpg';
    const cleanName = (file.name ? file.name.replace(/\.[^/.]+$/, '') : 'img')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const filePath = `uploads/${cleanName}-${Date.now().toString().slice(-6)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (err) {
    console.warn('Supabase image upload exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Upload a video file to Supabase Storage ('product-images' bucket)
 * Returns permanent public CDN URL accessible by everyone worldwide
 */
export async function uploadVideoToSupabase(file) {
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  try {
    const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'mp4';
    const cleanName = (file.name ? file.name.replace(/\.[^/.]+$/, '') : 'reel-video')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-');
    const filePath = `reels/${cleanName}-${Date.now().toString().slice(-6)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true,
        contentType: file.type || 'video/mp4'
      });

    if (uploadError) {
      console.warn('Supabase video upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { success: true, url: urlData.publicUrl };
  } catch (err) {
    console.warn('Supabase video upload exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all products from Supabase
 */
export async function fetchProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products error:', error.message);
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      // Map database columns to app schema
      return data.map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
        badge: row.badge,
        priceINR: Number(row.price_inr) || 199,
        image: row.image,
        images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.image],
        description: row.description,
        includes: Array.isArray(row.includes) ? row.includes : [],
        colors: Array.isArray(row.colors) ? row.colors : [],
        specifications: row.specifications || {},
        inStock: row.in_stock !== false
      }));
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
    return null;
  }
}

/**
 * Upsert product to Supabase
 */
export async function saveProductToSupabase(product) {
  if (!supabase) return false;
  try {
    const row = {
      id: product.id,
      name: product.name,
      category: product.category,
      badge: product.badge || '',
      price_inr: Number(product.priceINR) || 199,
      image: product.image || (Array.isArray(product.images) && product.images[0]) || '/images/deluxe-giftbox.webp',
      images: Array.isArray(product.images) ? product.images : [product.image],
      description: product.description || '',
      includes: Array.isArray(product.includes) ? product.includes : [],
      colors: Array.isArray(product.colors) ? product.colors : [],
      specifications: product.specifications || {},
      in_stock: product.inStock !== false,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase upsert product error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save product exception:', err);
    return false;
  }
}

/**
 * Delete product from Supabase
 */
export async function deleteProductFromSupabase(productId) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Upload customer payment screenshot proof to Supabase Storage ('product-images/payments/' bucket path)
 * Returns permanent public URL accessible worldwide by Admin
 */
export async function uploadPaymentProofToSupabase(fileOrBlob, orderId = 'order') {
  if (!supabase) return null;
  try {
    const ext = fileOrBlob.name ? fileOrBlob.name.split('.').pop().toLowerCase() : 'jpg';
    const filePath = `payments/receipt-${orderId.replace(/[^a-zA-Z0-9_-]/g, '')}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, fileOrBlob, {
        contentType: fileOrBlob.type || 'image/jpeg',
        cacheControl: '31536000',
        upsert: true
      });

    if (uploadError) {
      console.warn('Payment proof storage upload error:', uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn('Payment proof upload exception:', err);
    return null;
  }
}

/**
 * Save an order to Supabase
 */
export async function saveOrderToSupabase(order) {
  if (!supabase) return false;
  try {
    const proofUrl = order.paymentScreenshot || order.customer?.paymentScreenshot || null;
    const customerPayload = {
      ...(order.customer || {}),
      paymentScreenshot: proofUrl,
      payment_screenshot: proofUrl,
      advancePaidINR: order.advancePaidINR ?? null,
      balanceDueOnDeliveryINR: order.balanceDueOnDeliveryINR ?? null,
      isPartialCod: Boolean(order.isPartialCod)
    };

    const row = {
      order_id: order.orderId,
      customer: customerPayload,
      items: order.items,
      total_inr: order.totalINR,
      subtotal_inr: order.subtotalINR,
      discount_amount_inr: order.discountAmountINR || 0,
      shipping_inr: order.shippingINR || 0,
      total_item_count: order.totalItemCount || 1,
      status: order.status || 'WhatsApp Verification Pending',
      payment_method: order.paymentMethod || 'UPI QR Code',
      upi_ref_number: order.upiRefNumber || null,
      film_on_reel: order.filmOnReel || null,
      additional_notes: order.additionalNotes || null,
      created_at: new Date(order.timestamp || Date.now()).toISOString()
    };

    const { error } = await supabase
      .from('orders')
      .upsert(row, { onConflict: 'order_id' });

    if (error) {
      console.warn('Supabase save order error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase order exception:', err);
    return false;
  }
}

/**
 * Update order status in Supabase
 */
export async function updateOrderStatusInSupabase(orderId, newStatus) {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('order_id', orderId);

    if (error) {
      console.warn('Supabase update order status error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update status exception:', err);
    return false;
  }
}

/**
 * Update courier tracking details in Supabase
 */
export async function updateOrderTrackingInSupabase(orderId, { status, courierName, trackingNumber }) {
  if (!supabase) return false;
  try {
    const patch = {};
    if (status) patch.status = status;
    if (courierName !== undefined) patch.courier_name = courierName;
    if (trackingNumber !== undefined) patch.tracking_number = trackingNumber;

    const { error } = await supabase
      .from('orders')
      .update(patch)
      .eq('order_id', orderId);

    return !error;
  } catch (err) {
    console.warn('Supabase update tracking exception:', err);
    return false;
  }
}

/**
 * Delete an order from Supabase (soft delete mark + hard delete attempt)
 */
export async function deleteOrderFromSupabase(orderId) {
  if (!supabase) return false;
  try {
    // 1. Mark as Order Deleted so any select queries immediately ignore it
    await supabase
      .from('orders')
      .update({ status: 'Order Deleted' })
      .eq('order_id', orderId);

    // 2. Also attempt hard delete in case RLS permits it
    await supabase
      .from('orders')
      .delete()
      .eq('order_id', orderId);

    return true;
  } catch (err) {
    console.warn('Supabase delete order exception:', err);
    return false;
  }
}

/**
 * Clear all orders from Supabase
 */
export async function clearAllOrdersFromSupabase(orderIds = []) {
  if (!supabase) return false;
  try {
    if (Array.isArray(orderIds) && orderIds.length > 0) {
      await supabase
        .from('orders')
        .update({ status: 'Order Deleted' })
        .in('order_id', orderIds);

      await supabase
        .from('orders')
        .delete()
        .in('order_id', orderIds);
    } else {
      await supabase
        .from('orders')
        .update({ status: 'Order Deleted' })
        .neq('status', 'Order Deleted');

      await supabase
        .from('orders')
        .delete()
        .neq('order_id', '___NEVER_MATCH___');
    }
    return true;
  } catch (err) {
    console.warn('Supabase clear orders exception:', err);
    return false;
  }
}

/**
 * Fetch all real orders from Supabase cloud database
 */
export async function fetchOrdersFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .neq('status', 'Order Deleted')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders error:', error.message);
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      // Filter out any orders marked as deleted
      const activeRows = data.filter(row => {
        const s = (row.status || '').toLowerCase();
        return !s.includes('deleted') && !s.includes('order deleted');
      });

      return activeRows.map(row => {
        const cust = row.customer || { fullName: 'Customer', phone: '', city: '', state: '' };
        const screenshot = cust.paymentScreenshot || cust.payment_screenshot || row.payment_screenshot || null;
        const isPartial = Boolean(
          cust.isPartialCod || 
          row.payment_method?.toLowerCase().includes('partial') || 
          row.status?.toLowerCase().includes('partial')
        );

        return {
          orderId: row.order_id,
          timestamp: new Date(row.created_at).getTime(),
          date: new Date(row.created_at).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          source: row.payment_method === 'WhatsApp Direct' ? 'WhatsApp Order' : (row.payment_method || 'Prepaid UPI / QR Code'),
          status: row.status || 'WhatsApp Verification Pending',
          paymentMethod: row.payment_method || 'UPI QR Code',
          upiRefNumber: row.upi_ref_number || null,
          paymentScreenshot: screenshot,
          isPartialCod: isPartial,
          advancePaidINR: cust.advancePaidINR ?? (isPartial ? Math.round((Number(row.total_inr) || 0) * 0.2) : null),
          balanceDueOnDeliveryINR: cust.balanceDueOnDeliveryINR ?? (isPartial ? (Number(row.total_inr) || 0) - Math.round((Number(row.total_inr) || 0) * 0.2) : 0),
          customer: cust,
          items: Array.isArray(row.items) ? row.items : [],
          totalItemCount: Number(row.total_item_count) || (Array.isArray(row.items) ? row.items.length : 1),
          subtotalINR: Number(row.subtotal_inr) || Number(row.total_inr) || 0,
          discountAmountINR: Number(row.discount_amount_inr) || 0,
          shippingINR: Number(row.shipping_inr) || 0,
          totalINR: Number(row.total_inr) || 0,
          filmOnReel: row.film_on_reel || null,
          additionalNotes: row.additional_notes || null
        };
      });
    }
    return [];
  } catch (err) {
    console.warn('Supabase fetch orders exception:', err);
    return null;
  }
}
