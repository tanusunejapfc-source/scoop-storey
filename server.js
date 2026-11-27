import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  isDatabaseReady,
  getDatabaseStatus,
  query,
  getPool
} from './server/db.js';
import {
  ensureUploadRoot,
  resolveUploadRoot,
  hasPersistentVolume,
  resolveSafeExtension,
  saveBufferToVolume,
  sanitizeFolder
} from './server/uploadStorage.js';
import {
  optimizeExistingUploads,
  getLastOptimizationReport
} from './server/optimizeUploads.js';
import { PRODUCTS as DEFAULT_PRODUCTS } from './src/data/storeData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, 'dist');
const PORT = Number(process.env.PORT || 3000);

const CONFIG_KEYS = new Set([
  'discounts',
  'categories',
  'deleted_categories',
  'deleted_products',
  'deleted_orders',
  'notifications',
  'payment_settings',
  'reels',
  'reviews'
]);

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Security headers (parity with vercel.json)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 55 * 1024 * 1024 // 55MB max (videos up to 50MB)
  }
});

// Ensure upload folders exist on boot
const uploadRoot = ensureUploadRoot();

// Serve persistent uploaded assets (images, videos, payment screenshots)
app.use(
  '/uploads',
  express.static(uploadRoot, {
    maxAge: '365d',
    immutable: true
  })
);

function mapProductRow(row) {
  const images = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : (row.image ? [row.image] : ['/images/deluxe-giftbox.webp']);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    badge: row.badge || '',
    priceINR: Number(row.price_inr) || 199,
    image: row.image || images[0],
    images,
    description: row.description || '',
    includes: Array.isArray(row.includes) ? row.includes : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    specifications: row.specifications || {},
    inStock: row.in_stock !== false
  };
}

function mapOrderRow(row) {
  const cust = row.customer || { fullName: 'Customer', phone: '', city: '', state: '' };
  const screenshot = cust.paymentScreenshot || cust.payment_screenshot || null;
  const isPartial = Boolean(
    cust.isPartialCod ||
    row.payment_method?.toLowerCase().includes('partial') ||
    row.status?.toLowerCase().includes('partial')
  );
  const ts = new Date(row.created_at).getTime();

  return {
    orderId: row.order_id,
    timestamp: ts,
    date: new Date(ts).toLocaleDateString('en-IN', {
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
    additionalNotes: row.additional_notes || null,
    courierName: row.courier_name || null,
    trackingNumber: row.tracking_number || null
  };
}

function mapReviewRow(row) {
  const ts = new Date(row.created_at).getTime();
  return {
    id: row.id,
    productId: row.product_id || 'general',
    productName: row.product_name || 'Scoop Storey Store',
    customerName: row.customer_name || 'Customer',
    handle: row.handle || '',
    rating: Number(row.rating) || 5,
    title: row.title || '',
    comment: row.comment || '',
    images: Array.isArray(row.images) ? row.images : [],
    verifiedBuyer: row.verified_buyer !== false,
    status: row.status || 'pending',
    createdAt: ts,
    date: new Date(ts).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    isCustomMerchant: Boolean(row.is_custom_merchant),
    likesCount: Number(row.likes_count) || 0,
    reply: row.reply || undefined
  };
}

async function appendConfigArrayIds(key, ids) {
  if (!isDatabaseReady() || !Array.isArray(ids) || ids.length === 0) return;
  const res = await query(`SELECT value FROM site_configs WHERE key = $1`, [key]);
  const existing = Array.isArray(res.rows[0]?.value) ? res.rows[0].value : [];
  const next = Array.from(new Set([...existing, ...ids]));
  await query(
    `INSERT INTO site_configs (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(next)]
  );
}

function requireDb(res) {
  if (!isDatabaseReady()) {
    res.status(503).json({ error: 'PostgreSQL database is not connected yet' });
    return false;
  }
  return true;
}

// =======================
// HEALTH CHECK
// =======================
app.get('/api/health', async (req, res) => {
  let counts = null;
  let optimization = getLastOptimizationReport();
  if (isDatabaseReady()) {
    try {
      const [pRes, oRes] = await Promise.all([
        query(`SELECT COUNT(*)::int AS count FROM products`),
        query(`SELECT COUNT(*)::int AS count FROM orders WHERE status != 'Order Deleted'`)
      ]);
      counts = {
        products: pRes.rows[0]?.count ?? 0,
        orders: oRes.rows[0]?.count ?? 0
      };
      if (!optimization) {
        const optRes = await query(
          `SELECT value FROM site_configs WHERE key = 'uploads_webp_optimization_report'`
        );
        optimization = optRes.rows[0]?.value ?? null;
      }
    } catch {}
  }

  res.json({
    ok: true,
    database: getDatabaseStatus(),
    storage: {
      persistentVolume: hasPersistentVolume(),
      uploadRoot: resolveUploadRoot(),
      optimization
    },
    counts,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/optimize-uploads', async (req, res) => {
  try {
    const rawQuality = req.body?.quality;
    const quality = Number.isFinite(Number(rawQuality))
      ? Math.min(95, Math.max(50, Math.round(Number(rawQuality))))
      : 84;
    const report = await optimizeExistingUploads({ quality });
    res.json(report);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// =======================
// MEDIA UPLOAD (Volume)
// =======================
app.post('/api/upload', uploadMiddleware.single('file'), (req, res) => {
  try {
    const folder = sanitizeFolder(req.body?.folder || req.query?.folder || 'uploads');

    // Case 1: Multipart file upload
    if (req.file) {
      const ext = resolveSafeExtension(req.file.mimetype, req.file.originalname);
      if (!ext) {
        return res.status(400).json({ success: false, error: 'Unsupported file format' });
      }
      const saved = saveBufferToVolume({
        buffer: req.file.buffer,
        folder,
        baseName: req.body?.name || req.file.originalname,
        extension: ext
      });
      return res.json({ success: true, ...saved });
    }

    // Case 2: JSON dataUrl upload
    const { name, dataUrl } = req.body || {};
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      const match = dataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ success: false, error: 'Invalid dataUrl format' });
      }
      const ext = resolveSafeExtension(match[1], name || '');
      if (!ext) {
        return res.status(400).json({ success: false, error: 'Unsupported media MIME type' });
      }
      const buffer = Buffer.from(match[2], 'base64');
      const saved = saveBufferToVolume({
        buffer,
        folder,
        baseName: name || 'media',
        extension: ext
      });
      return res.json({ success: true, ...saved });
    }

    return res.status(400).json({ success: false, error: 'No file or valid dataUrl provided' });
  } catch (err) {
    console.warn('Upload error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// =======================
// PRODUCTS API
// =======================
app.get('/api/products', async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { rows } = await query(`SELECT * FROM products ORDER BY created_at DESC`);
    res.json({ products: rows.map(mapProductRow) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  if (!requireDb(res)) return;
  const payload = req.body;
  const list = Array.isArray(payload?.products)
    ? payload.products
    : [payload?.product || payload];

  const validList = list.filter((p) => p && p.id && p.name);
  if (validList.length === 0) {
    return res.status(400).json({ error: 'Invalid product payload' });
  }

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const product of validList) {
      const fallbackImg = '/images/deluxe-giftbox.webp';
      const imgs = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : [fallbackImg]);
      await client.query(
        `INSERT INTO products (
          id, name, category, badge, price_inr, image, images, description,
          includes, colors, specifications, in_stock, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9::jsonb, $10::jsonb, $11::jsonb, $12, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          badge = EXCLUDED.badge,
          price_inr = EXCLUDED.price_inr,
          image = EXCLUDED.image,
          images = EXCLUDED.images,
          description = EXCLUDED.description,
          includes = EXCLUDED.includes,
          colors = EXCLUDED.colors,
          specifications = EXCLUDED.specifications,
          in_stock = EXCLUDED.in_stock,
          updated_at = NOW()`,
        [
          String(product.id),
          String(product.name),
          String(product.category || 'Accessories'),
          String(product.badge || ''),
          Math.max(0, Math.round(Number(product.priceINR) || 199)),
          String(product.image || imgs[0] || fallbackImg),
          JSON.stringify(imgs),
          String(product.description || ''),
          JSON.stringify(Array.isArray(product.includes) ? product.includes : []),
          JSON.stringify(Array.isArray(product.colors) ? product.colors : []),
          JSON.stringify(product.specifications || {}),
          product.inStock !== false
        ]
      );
    }
    await client.query('COMMIT');
    res.json({ success: true, count: validList.length });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.post('/api/products/delete-batch', async (req, res) => {
  if (!requireDb(res)) return;
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String).filter(Boolean) : [];
  if (ids.length === 0) return res.json({ success: true, count: 0 });
  try {
    await query(`DELETE FROM products WHERE id = ANY($1::text[])`, [ids]);
    await appendConfigArrayIds('deleted_products', ids);
    res.json({ success: true, count: ids.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/reset', async (req, res) => {
  if (!requireDb(res)) return;
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM products`);
    await client.query(`DELETE FROM site_configs WHERE key = 'deleted_products'`);
    for (const product of DEFAULT_PRODUCTS) {
      await client.query(
        `INSERT INTO products (
          id, name, category, badge, price_inr, image, images, description,
          includes, colors, specifications, in_stock, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9::jsonb, $10::jsonb, $11::jsonb, $12, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          product.name,
          product.category,
          product.badge || '',
          Math.round(Number(product.priceINR) || 199),
          product.image || (Array.isArray(product.images) && product.images[0]) || '/images/deluxe-giftbox.webp',
          JSON.stringify(Array.isArray(product.images) ? product.images : (product.image ? [product.image] : [])),
          product.description || '',
          JSON.stringify(Array.isArray(product.includes) ? product.includes : []),
          JSON.stringify(Array.isArray(product.colors) ? product.colors : []),
          JSON.stringify(product.specifications || {}),
          product.inStock !== false
        ]
      );
    }
    await client.query('COMMIT');
    res.json({ success: true, products: DEFAULT_PRODUCTS });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete('/api/products/:id', async (req, res) => {
  if (!requireDb(res)) return;
  const id = String(req.params.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Missing product ID' });
  try {
    await query(`DELETE FROM products WHERE id = $1`, [id]);
    await appendConfigArrayIds('deleted_products', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ORDERS & TRACKING API
// =======================
app.get('/api/orders', async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { rows } = await query(
      `SELECT * FROM orders
       WHERE LOWER(COALESCE(status, '')) NOT LIKE '%deleted%'
       ORDER BY created_at DESC`
    );
    res.json({ orders: rows.map(mapOrderRow) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  if (!requireDb(res)) return;
  const order = req.body?.order || req.body;
  if (!order || !order.orderId) {
    return res.status(400).json({ error: 'Missing orderId' });
  }

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

    const sanitizedItems = (Array.isArray(order.items) ? order.items : []).map((it) => ({
      id: String(it.id || ''),
      name: String(it.name || 'Scoop Storey Item'),
      priceINR: Math.max(0, Number(it.priceINR || it.price || 0)),
      qty: Math.max(1, Math.min(20, Math.floor(Number(it.qty || it.quantity || 1)))),
      image: it.image || '/images/deluxe-giftbox.webp',
      selectedColor: it.selectedColor || null,
      selectedColorHex: it.selectedColorHex || null
    }));

    const createdAtIso = new Date(order.timestamp || Date.now()).toISOString();

    await query(
      `INSERT INTO orders (
        order_id, customer, items, total_inr, subtotal_inr, discount_amount_inr,
        shipping_inr, total_item_count, status, payment_method, upi_ref_number,
        film_on_reel, additional_notes, courier_name, tracking_number, created_at, updated_at
      ) VALUES ($1, $2::jsonb, $3::jsonb, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
      ON CONFLICT (order_id) DO UPDATE SET
        customer = EXCLUDED.customer,
        items = EXCLUDED.items,
        total_inr = EXCLUDED.total_inr,
        subtotal_inr = EXCLUDED.subtotal_inr,
        discount_amount_inr = EXCLUDED.discount_amount_inr,
        shipping_inr = EXCLUDED.shipping_inr,
        total_item_count = EXCLUDED.total_item_count,
        status = EXCLUDED.status,
        payment_method = EXCLUDED.payment_method,
        upi_ref_number = EXCLUDED.upi_ref_number,
        film_on_reel = EXCLUDED.film_on_reel,
        additional_notes = EXCLUDED.additional_notes,
        courier_name = COALESCE(EXCLUDED.courier_name, orders.courier_name),
        tracking_number = COALESCE(EXCLUDED.tracking_number, orders.tracking_number),
        updated_at = NOW()`,
      [
        String(order.orderId),
        JSON.stringify(customerPayload),
        JSON.stringify(sanitizedItems),
        Math.max(0, Number(order.totalINR) || 0),
        Math.max(0, Number(order.subtotalINR) || Number(order.totalINR) || 0),
        Math.max(0, Number(order.discountAmountINR) || 0),
        Math.max(0, Number(order.shippingINR) || 0),
        Math.max(1, Number(order.totalItemCount) || sanitizedItems.length || 1),
        String(order.status || 'WhatsApp Verification Pending'),
        String(order.paymentMethod || 'UPI QR Code'),
        order.upiRefNumber || null,
        order.filmOnReel || null,
        order.additionalNotes || null,
        order.courierName || null,
        order.trackingNumber || null,
        createdAtIso
      ]
    );

    res.json({ success: true, orderId: String(order.orderId) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:orderId/status', async (req, res) => {
  if (!requireDb(res)) return;
  const { orderId } = req.params;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'Missing status' });
  try {
    await query(`UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2`, [
      String(status),
      String(orderId)
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:orderId/tracking', async (req, res) => {
  if (!requireDb(res)) return;
  const { orderId } = req.params;
  const { status, courierName, trackingNumber } = req.body || {};
  try {
    await query(
      `UPDATE orders
       SET status = COALESCE($1, status),
           courier_name = COALESCE($2, courier_name),
           tracking_number = COALESCE($3, tracking_number),
           updated_at = NOW()
       WHERE order_id = $4`,
      [
        status || null,
        courierName !== undefined ? courierName : null,
        trackingNumber !== undefined ? trackingNumber : null,
        String(orderId)
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders/clear', async (req, res) => {
  if (!requireDb(res)) return;
  const orderIds = Array.isArray(req.body?.orderIds) ? req.body.orderIds.map(String).filter(Boolean) : [];
  try {
    if (orderIds.length > 0) {
      await query(`DELETE FROM orders WHERE order_id = ANY($1::text[])`, [orderIds]);
      await appendConfigArrayIds('deleted_orders', orderIds);
    } else {
      await query(`DELETE FROM orders`);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  if (!requireDb(res)) return;
  const { orderId } = req.params;
  try {
    await query(`DELETE FROM orders WHERE order_id = $1`, [String(orderId)]);
    await appendConfigArrayIds('deleted_orders', [String(orderId)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Privacy-safe public order tracking (masks PII on server!)
app.get('/api/tracking', async (req, res) => {
  const cleanQ = String(req.query?.q || '').trim();
  if (!cleanQ || cleanQ.length < 3) {
    return res.json({ order: null });
  }
  if (!isDatabaseReady()) {
    return res.json({ order: null });
  }

  try {
    const cleanDigits = cleanQ.replace(/\D/g, '');
    const isOrderId = cleanQ.toUpperCase().startsWith('SS-');
    let result;

    if (isOrderId) {
      result = await query(
        `SELECT * FROM orders
         WHERE LOWER(COALESCE(status, '')) NOT LIKE '%deleted%'
           AND UPPER(order_id) = $1
         LIMIT 1`,
        [cleanQ.toUpperCase()]
      );
    } else if (cleanDigits.length === 10) {
      result = await query(
        `SELECT * FROM orders
         WHERE LOWER(COALESCE(status, '')) NOT LIKE '%deleted%'
           AND regexp_replace(COALESCE(customer->>'phone', ''), '\\D', '', 'g') LIKE $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [`%${cleanDigits}`]
      );
    } else {
      result = await query(
        `SELECT * FROM orders
         WHERE LOWER(COALESCE(status, '')) NOT LIKE '%deleted%'
           AND order_id ILIKE $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [`%${cleanQ}%`]
      );
    }

    if (!result.rows || result.rows.length === 0) {
      return res.json({ order: null });
    }

    const row = result.rows[0];
    const cust = row.customer || {};

    let rawPhone = String(cust.phone || '').replace(/\D/g, '');
    if (rawPhone.length === 12 && rawPhone.startsWith('91')) {
      rawPhone = rawPhone.slice(2);
    }
    const maskedPhone = rawPhone.length >= 10
      ? `+91 ${rawPhone.slice(0, 5)}*****`
      : (rawPhone ? '******' : '');

    const nameParts = String(cust.fullName || 'Collector').trim().split(/\s+/);
    const maskedName = nameParts.length > 1
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : (nameParts[0] || 'Collector');

    const rawPin = String(cust.pincode || '').replace(/\D/g, '');
    const maskedPin = rawPin.length === 6 ? `${rawPin.slice(0, 3)}***` : '';

    return res.json({
      order: {
        orderId: row.order_id,
        timestamp: new Date(row.created_at).getTime(),
        date: new Date(row.created_at).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        status: row.status || 'Order Confirmed',
        courierName: row.courier_name || null,
        trackingNumber: row.tracking_number || null,
        items: Array.isArray(row.items)
          ? row.items.map((it) => ({
              id: it.id,
              name: it.name,
              qty: it.qty,
              selectedColor: it.selectedColor,
              image: it.image
            }))
          : [],
        totalINR: Number(row.total_inr) || 0,
        subtotalINR: Number(row.subtotal_inr) || Number(row.total_inr) || 0,
        filmOnReel: row.film_on_reel || null,
        customer: {
          fullName: maskedName,
          city: cust.city || 'India',
          state: cust.state || '',
          pincode: maskedPin,
          phone: maskedPhone
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// REVIEWS API
// =======================
app.get('/api/reviews', async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const { rows } = await query(`SELECT * FROM reviews ORDER BY created_at DESC`);
    res.json({ reviews: rows.map(mapReviewRow) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  if (!requireDb(res)) return;
  const rev = req.body?.review || req.body;
  if (!rev || !rev.id) {
    return res.status(400).json({ error: 'Missing review id' });
  }
  try {
    await query(
      `INSERT INTO reviews (
        id, product_id, product_name, customer_name, handle, rating, title,
        comment, images, verified_buyer, status, is_custom_merchant, likes_count, reply, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        reply = EXCLUDED.reply,
        likes_count = EXCLUDED.likes_count,
        images = EXCLUDED.images`,
      [
        String(rev.id),
        String(rev.productId || 'general'),
        String(rev.productName || 'Scoop Storey Store'),
        String(rev.customerName || 'Happy Customer'),
        String(rev.handle || ''),
        Math.min(5, Math.max(1, Number(rev.rating) || 5)),
        String(rev.title || ''),
        String(rev.comment || ''),
        JSON.stringify(Array.isArray(rev.images) ? rev.images : []),
        rev.verifiedBuyer !== false,
        String(rev.status || 'pending'),
        Boolean(rev.isCustomMerchant),
        Number(rev.likesCount) || 0,
        rev.reply || null,
        new Date(rev.createdAt || Date.now()).toISOString()
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/reviews/:id', async (req, res) => {
  if (!requireDb(res)) return;
  const { id } = req.params;
  const { status, reply, likesCount } = req.body || {};
  try {
    await query(
      `UPDATE reviews
       SET status = COALESCE($1, status),
           reply = COALESCE($2, reply),
           likes_count = COALESCE($3, likes_count)
       WHERE id = $4`,
      [
        status ?? null,
        reply !== undefined ? reply : null,
        likesCount !== undefined ? Number(likesCount) : null,
        String(id)
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  if (!requireDb(res)) return;
  try {
    await query(`DELETE FROM reviews WHERE id = $1`, [String(req.params.id)]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// SITE CONFIGS API (replaces Supabase Storage config/*.json)
// =======================
app.get('/api/config/:key', async (req, res) => {
  const key = String(req.params.key || '').trim();
  if (!CONFIG_KEYS.has(key)) {
    return res.status(400).json({ error: 'Unknown config key' });
  }
  if (!requireDb(res)) return;
  try {
    const { rows } = await query(`SELECT value, updated_at FROM site_configs WHERE key = $1`, [key]);
    if (rows.length === 0) {
      return res.json({ value: null });
    }
    res.json({ value: rows[0].value, updatedAt: rows[0].updated_at });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/config/:key', async (req, res) => {
  const key = String(req.params.key || '').trim();
  if (!CONFIG_KEYS.has(key)) {
    return res.status(400).json({ error: 'Unknown config key' });
  }
  if (!requireDb(res)) return;
  const value = req.body && 'value' in req.body ? req.body.value : req.body;
  try {
    await query(
      `INSERT INTO site_configs (key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [key, JSON.stringify(value)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// TELEMETRY & LIVE PRESENCE API
// =======================
app.post('/api/telemetry/session', async (req, res) => {
  if (!isDatabaseReady()) {
    return res.json({ success: false, skipped: true });
  }
  const s = req.body || {};
  if (!s.visitorId) {
    return res.status(400).json({ error: 'Missing visitorId' });
  }
  const now = Date.now();
  try {
    await query(
      `INSERT INTO telemetry_sessions (
        visitor_id, session_id, started_at, last_active, device, channel, region,
        pageviews, has_cart, cart_count, in_checkout, reached_checkout, completed_order, current_page, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      ON CONFLICT (visitor_id) DO UPDATE SET
        session_id = EXCLUDED.session_id,
        last_active = EXCLUDED.last_active,
        device = EXCLUDED.device,
        channel = COALESCE(NULLIF(EXCLUDED.channel, 'Direct Storefront'), telemetry_sessions.channel),
        region = EXCLUDED.region,
        pageviews = GREATEST(telemetry_sessions.pageviews, EXCLUDED.pageviews),
        has_cart = EXCLUDED.has_cart,
        cart_count = EXCLUDED.cart_count,
        in_checkout = EXCLUDED.in_checkout,
        reached_checkout = telemetry_sessions.reached_checkout OR EXCLUDED.reached_checkout,
        completed_order = telemetry_sessions.completed_order OR EXCLUDED.completed_order,
        current_page = EXCLUDED.current_page,
        updated_at = NOW()`,
      [
        String(s.visitorId).slice(0, 80),
        String(s.sessionId || `sess_${now}`).slice(0, 80),
        Number(s.startedAt) || now,
        now,
        String(s.device || 'Mobile').slice(0, 32),
        String(s.channel || 'Direct Storefront').slice(0, 64),
        String(s.region || 'India').slice(0, 64),
        Math.max(1, Number(s.pageviews) || 1),
        Boolean(s.hasCart),
        Math.max(0, Number(s.cartCount) || 0),
        Boolean(s.inCheckout),
        Boolean(s.reachedCheckout),
        Boolean(s.completedOrder),
        String(s.currentPage || '/').slice(0, 120)
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/telemetry/summary', async (req, res) => {
  if (!isDatabaseReady()) {
    return res.json({ sessions: [], presence: { liveVisitors: 1, activeCarts: 0, activeCheckouts: 0 } });
  }
  try {
    const { rows } = await query(
      `SELECT * FROM telemetry_sessions ORDER BY last_active DESC LIMIT 500`
    );
    const now = Date.now();
    const ACTIVE_WINDOW_MS = 90 * 1000;

    let liveVisitors = 0;
    let activeCarts = 0;
    let activeCheckouts = 0;

    const sessions = rows.map((r) => {
      const lastActive = Number(r.last_active) || 0;
      if (now - lastActive <= ACTIVE_WINDOW_MS) {
        liveVisitors++;
        if (r.has_cart) activeCarts++;
        if (r.in_checkout) activeCheckouts++;
      }
      return {
        sessionId: r.session_id,
        visitorId: r.visitor_id,
        startedAt: Number(r.started_at),
        lastActive,
        device: r.device,
        channel: r.channel,
        region: r.region,
        pageviews: Number(r.pageviews) || 1,
        hasCart: Boolean(r.has_cart),
        cartCount: Number(r.cart_count) || 0,
        inCheckout: Boolean(r.in_checkout),
        reachedCheckout: Boolean(r.reached_checkout),
        completedOrder: Boolean(r.completed_order),
        currentPage: r.current_page || '/'
      };
    });

    res.json({
      sessions,
      presence: {
        liveVisitors: Math.max(1, liveVisitors),
        activeCarts,
        activeCheckouts
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unknown API / upload route guard before SPA HTML fallback
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Seamless .webp fallback when cached browser/localStorage links request old .jpg/.jpeg/.png paths
app.get('/uploads/*', (req, res, next) => {
  const rawRel = String(req.params[0] || '').trim();
  const normalizedRel = path.posix.normalize(rawRel.replace(/\\/g, '/')).replace(/^\/+/, '');
  if (!normalizedRel || normalizedRel.startsWith('..') || !/\.(jpe?g|png)$/i.test(normalizedRel)) {
    return next();
  }
  const rootDir = path.resolve(resolveUploadRoot());
  const rootPrefix = rootDir.endsWith(path.sep) ? rootDir : `${rootDir}${path.sep}`;
  const webpRel = normalizedRel.replace(/\.(jpe?g|png)$/i, '.webp');
  const candidatePath = path.resolve(rootDir, webpRel);
  if (candidatePath.startsWith(rootPrefix) && fs.existsSync(candidatePath)) {
    return res.sendFile(candidatePath, {
      maxAge: '365d',
      immutable: true
    });
  }
  return next();
});

app.all('/uploads/*', (req, res) => {
  res.status(404).send('File not found');
});

// =======================
// STATIC FRONTEND (dist/)
// =======================
if (fs.existsSync(DIST_DIR)) {
  app.use(
    '/assets',
    express.static(path.join(DIST_DIR, 'assets'), {
      maxAge: '365d',
      immutable: true
    })
  );
  app.use(
    '/images',
    express.static(path.join(DIST_DIR, 'images'), {
      maxAge: '365d',
      immutable: true
    })
  );
  app.use(
    express.static(DIST_DIR, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
      }
    })
  );

  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Start server immediately so healthcheck passes, initialize PostgreSQL asynchronously with retries
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Scoop Storey server running on http://0.0.0.0:${PORT}`);
  initDatabase()
    .then((ready) => {
      if (ready) {
        optimizeExistingUploads().catch((err) => {
          console.warn('Startup upload optimization error:', err.message);
        });
      }
    })
    .catch((err) => {
      console.warn('Database initialization error:', err.message);
    });
});
