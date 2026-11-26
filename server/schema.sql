-- Scoop Storey PostgreSQL Schema (Railway)
-- Executed automatically on server startup (idempotent)

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT DEFAULT '',
  price_inr INTEGER NOT NULL DEFAULT 199,
  image TEXT DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  includes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  customer JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_inr NUMERIC NOT NULL DEFAULT 0,
  subtotal_inr NUMERIC NOT NULL DEFAULT 0,
  discount_amount_inr NUMERIC NOT NULL DEFAULT 0,
  shipping_inr NUMERIC NOT NULL DEFAULT 0,
  total_item_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'WhatsApp Verification Pending',
  payment_method TEXT NOT NULL DEFAULT 'UPI QR Code',
  upi_ref_number TEXT,
  film_on_reel TEXT,
  additional_notes TEXT,
  courier_name TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL DEFAULT 'general',
  product_name TEXT NOT NULL DEFAULT 'Scoop Storey Store',
  customer_name TEXT NOT NULL,
  handle TEXT DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  title TEXT DEFAULT '',
  comment TEXT DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  verified_buyer BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending',
  is_custom_merchant BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

CREATE TABLE IF NOT EXISTS site_configs (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telemetry_sessions (
  visitor_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  started_at BIGINT NOT NULL,
  last_active BIGINT NOT NULL,
  device TEXT NOT NULL DEFAULT 'Mobile',
  channel TEXT NOT NULL DEFAULT 'Direct Storefront',
  region TEXT NOT NULL DEFAULT 'India',
  pageviews INTEGER NOT NULL DEFAULT 1,
  has_cart BOOLEAN NOT NULL DEFAULT false,
  cart_count INTEGER NOT NULL DEFAULT 0,
  in_checkout BOOLEAN NOT NULL DEFAULT false,
  reached_checkout BOOLEAN NOT NULL DEFAULT false,
  completed_order BOOLEAN NOT NULL DEFAULT false,
  current_page TEXT NOT NULL DEFAULT '/',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_last_active ON telemetry_sessions (last_active DESC);
