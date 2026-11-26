import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../src/data/storeData.js';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool = null;
let dbReady = false;
let lastDbError = null;

function buildSslConfig(connectionString) {
  if (!connectionString) return false;
  const lower = connectionString.toLowerCase();
  if (
    lower.includes('localhost') ||
    lower.includes('127.0.0.1') ||
    lower.includes('.railway.internal') ||
    lower.includes('sslmode=disable')
  ) {
    return false;
  }
  return { rejectUnauthorized: false };
}

export function getPool() {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  pool = new Pool({
    connectionString,
    ssl: buildSslConfig(connectionString),
    max: 12,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });

  pool.on('error', (err) => {
    console.warn('Unexpected PostgreSQL pool error:', err.message);
  });

  return pool;
}

export function isDatabaseReady() {
  return Boolean(pool && dbReady);
}

export function getDatabaseStatus() {
  return {
    configured: Boolean(process.env.DATABASE_URL),
    ready: dbReady,
    error: lastDbError
  };
}

export async function query(text, params = []) {
  const p = getPool();
  if (!p) {
    throw new Error('DATABASE_URL is not configured');
  }
  return p.query(text, params);
}

async function seedInitialProducts(client) {
  const seedFlagRes = await client.query(
    `SELECT value FROM site_configs WHERE key = 'initial_products_seeded'`
  );
  if (seedFlagRes.rows.length > 0 && seedFlagRes.rows[0].value?.seeded) {
    return;
  }

  const countRes = await client.query(`SELECT COUNT(*)::int AS cnt FROM products`);
  const existingCount = countRes.rows[0]?.cnt || 0;

  if (existingCount === 0 && Array.isArray(DEFAULT_PRODUCTS) && DEFAULT_PRODUCTS.length > 0) {
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
    console.log(`Seeded ${DEFAULT_PRODUCTS.length} initial Scoop Storey products into PostgreSQL.`);
  }

  await client.query(
    `INSERT INTO site_configs (key, value, updated_at)
     VALUES ('initial_products_seeded', $1::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [JSON.stringify({ seeded: true, seededAt: new Date().toISOString() })]
  );
}

export async function initDatabase(retries = 5) {
  const p = getPool();
  if (!p) {
    console.warn('DATABASE_URL not set — running without PostgreSQL connection (local fallback mode).');
    return false;
  }

  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await p.connect();
      try {
        await client.query(schemaSql);
        await seedInitialProducts(client);
        dbReady = true;
        lastDbError = null;
        console.log('PostgreSQL connected & Scoop Storey schema initialized.');
        return true;
      } finally {
        client.release();
      }
    } catch (err) {
      lastDbError = err.message;
      console.warn(`PostgreSQL init attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }

  return false;
}
