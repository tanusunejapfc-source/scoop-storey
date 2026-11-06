import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fxsmqomlxekbcfihhnle.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wfIyuRhwsJAqtZrisb0q9A_AcYO0xCU';

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
      image: product.image || (Array.isArray(product.images) && product.images[0]) || '/images/deluxe-giftbox.jpg',
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
 * Save an order to Supabase
 */
export async function saveOrderToSupabase(order) {
  if (!supabase) return false;
  try {
    const row = {
      order_id: order.orderId,
      customer: order.customer,
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
