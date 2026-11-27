import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { resolveUploadRoot } from './uploadStorage.js';
import { getPool, isDatabaseReady } from './db.js';

const RASTER_EXT_RE = /\.(jpg|jpeg|png)$/i;
const SCAN_FOLDERS = ['products', 'categories', 'reviews', 'payments', 'uploads'];

let activeOptimizationPromise = null;
let lastOptimizationReport = null;

export function getLastOptimizationReport() {
  return lastOptimizationReport;
}

function collectCandidateFiles(rootDir) {
  const files = [];

  for (const folder of SCAN_FOLDERS) {
    const dir = path.join(rootDir, folder);
    if (!fs.existsSync(dir)) continue;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!RASTER_EXT_RE.test(entry.name)) continue;
      files.push({
        folder,
        name: entry.name,
        fullPath: path.join(dir, entry.name)
      });
    }
  }

  return files;
}

function rewriteUrlsInValue(value, urlMap) {
  if (typeof value === 'string') {
    if (urlMap.has(value)) {
      return { value: urlMap.get(value), changed: true };
    }
    // Also handle full URLs ending with /uploads/...
    for (const [oldRel, newRel] of urlMap.entries()) {
      if (value.endsWith(oldRel)) {
        return {
          value: value.slice(0, value.length - oldRel.length) + newRel,
          changed: true
        };
      }
    }
    return { value, changed: false };
  }

  if (Array.isArray(value)) {
    let anyChanged = false;
    const nextArr = value.map((item) => {
      const res = rewriteUrlsInValue(item, urlMap);
      if (res.changed) anyChanged = true;
      return res.value;
    });
    return { value: anyChanged ? nextArr : value, changed: anyChanged };
  }

  if (value && typeof value === 'object') {
    let anyChanged = false;
    const nextObj = { ...value };
    for (const key of Object.keys(nextObj)) {
      const res = rewriteUrlsInValue(nextObj[key], urlMap);
      if (res.changed) {
        nextObj[key] = res.value;
        anyChanged = true;
      }
    }
    return { value: anyChanged ? nextObj : value, changed: anyChanged };
  }

  return { value, changed: false };
}

async function convertSingleImage(fileInfo, quality = 84) {
  const beforeBytes = fs.statSync(fileInfo.fullPath).size;
  const baseName = fileInfo.name.replace(RASTER_EXT_RE, '');
  const webpName = `${baseName}.webp`;
  const webpPath = path.join(path.dirname(fileInfo.fullPath), webpName);

  const oldUrl = `/uploads/${fileInfo.folder}/${fileInfo.name}`;
  const newUrl = `/uploads/${fileInfo.folder}/${webpName}`;

  const pipeline = sharp(fileInfo.fullPath, { failOn: 'none' }).rotate();
  const meta = await pipeline.metadata();

  if ((meta.width && meta.width > 1200) || (meta.height && meta.height > 1200)) {
    pipeline.resize({
      width: 1200,
      height: 1200,
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  const webpBuffer = await pipeline
    .webp({
      quality,
      effort: 6,
      smartSubsample: true
    })
    .toBuffer();

  if (!webpBuffer || webpBuffer.length === 0) {
    return { converted: false, reason: 'empty_output', beforeBytes, afterBytes: beforeBytes };
  }

  // Only swap if WebP actually reduces size cleanly (prevents inflating tiny files)
  if (webpBuffer.length >= beforeBytes) {
    return { converted: false, reason: 'not_smaller', beforeBytes, afterBytes: beforeBytes };
  }

  fs.writeFileSync(webpPath, webpBuffer);

  return {
    converted: true,
    oldPath: fileInfo.fullPath,
    webpPath,
    oldUrl,
    newUrl,
    beforeBytes,
    afterBytes: webpBuffer.length
  };
}

async function updateDatabaseUrls(urlMap) {
  if (!isDatabaseReady() || urlMap.size === 0) {
    return { productsUpdated: 0, reviewsUpdated: 0, ordersUpdated: 0, configsUpdated: 0 };
  }

  const pool = getPool();
  const client = await pool.connect();
  let productsUpdated = 0;
  let reviewsUpdated = 0;
  let ordersUpdated = 0;
  let configsUpdated = 0;

  try {
    await client.query('BEGIN');

    // 1. Products table (image, images, colors)
    const prodRes = await client.query(`SELECT id, image, images, colors FROM products`);
    for (const row of prodRes.rows) {
      const rImg = rewriteUrlsInValue(row.image, urlMap);
      const rImgs = rewriteUrlsInValue(row.images, urlMap);
      const rColors = rewriteUrlsInValue(row.colors, urlMap);
      if (rImg.changed || rImgs.changed || rColors.changed) {
        await client.query(
          `UPDATE products
           SET image = $1, images = $2::jsonb, colors = $3::jsonb, updated_at = NOW()
           WHERE id = $4`,
          [rImg.value, JSON.stringify(rImgs.value), JSON.stringify(rColors.value), row.id]
        );
        productsUpdated++;
      }
    }

    // 2. Reviews table
    const revRes = await client.query(`SELECT id, images FROM reviews`);
    for (const row of revRes.rows) {
      const rImgs = rewriteUrlsInValue(row.images, urlMap);
      if (rImgs.changed) {
        await client.query(
          `UPDATE reviews SET images = $1::jsonb WHERE id = $2`,
          [JSON.stringify(rImgs.value), row.id]
        );
        reviewsUpdated++;
      }
    }

    // 3. Orders table
    const ordRes = await client.query(`SELECT order_id, customer, items FROM orders`);
    for (const row of ordRes.rows) {
      const rCust = rewriteUrlsInValue(row.customer, urlMap);
      const rItems = rewriteUrlsInValue(row.items, urlMap);
      if (rCust.changed || rItems.changed) {
        await client.query(
          `UPDATE orders SET customer = $1::jsonb, items = $2::jsonb, updated_at = NOW() WHERE order_id = $3`,
          [JSON.stringify(rCust.value), JSON.stringify(rItems.value), row.order_id]
        );
        ordersUpdated++;
      }
    }

    // 4. Site Configs table (categories, reels, payment_settings, reviews snapshot)
    const cfgRes = await client.query(
      `SELECT key, value FROM site_configs WHERE key = ANY($1::text[])`,
      [['categories', 'reels', 'payment_settings', 'reviews']]
    );
    for (const row of cfgRes.rows) {
      const rVal = rewriteUrlsInValue(row.value, urlMap);
      if (rVal.changed) {
        await client.query(
          `UPDATE site_configs SET value = $1::jsonb, updated_at = NOW() WHERE key = $2`,
          [JSON.stringify(rVal.value), row.key]
        );
        configsUpdated++;
      }
    }

    await client.query('COMMIT');
    return { productsUpdated, reviewsUpdated, ordersUpdated, configsUpdated };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function optimizeExistingUploads({ quality = 84 } = {}) {
  if (activeOptimizationPromise) {
    return activeOptimizationPromise;
  }

  activeOptimizationPromise = (async () => {
    const startedAt = Date.now();
    const uploadRoot = resolveUploadRoot();
    const candidates = collectCandidateFiles(uploadRoot);

    if (candidates.length === 0) {
      const report = {
        ok: true,
        scanned: 0,
        converted: 0,
        skipped: 0,
        failed: 0,
        beforeKB: 0,
        afterKB: 0,
        savedKB: 0,
        savedPercent: 0,
        dbUpdates: { productsUpdated: 0, reviewsUpdated: 0, ordersUpdated: 0, configsUpdated: 0 },
        durationMs: Date.now() - startedAt,
        ranAt: new Date().toISOString()
      };
      lastOptimizationReport = report;
      return report;
    }

    const urlMap = new Map();
    const oldPathsToRemove = [];
    let converted = 0;
    let skipped = 0;
    let failed = 0;
    let beforeBytesTotal = 0;
    let afterBytesTotal = 0;

    for (const fileInfo of candidates) {
      try {
        const res = await convertSingleImage(fileInfo, quality);
        beforeBytesTotal += res.beforeBytes;
        afterBytesTotal += res.afterBytes;
        if (res.converted) {
          converted++;
          urlMap.set(res.oldUrl, res.newUrl);
          oldPathsToRemove.push(res.oldPath);
        } else {
          skipped++;
        }
      } catch (err) {
        failed++;
        console.warn(`Image optimization skipped for ${fileInfo.name}:`, err.message);
      }
    }

    let dbUpdates = { productsUpdated: 0, reviewsUpdated: 0, ordersUpdated: 0, configsUpdated: 0 };
    if (urlMap.size > 0 && isDatabaseReady()) {
      dbUpdates = await updateDatabaseUrls(urlMap);
    }

    // Delete superseded source .jpg/.png files only after DB commit succeeded
    if (!isDatabaseReady() && urlMap.size > 0) {
      console.warn('Database not ready during upload optimization; keeping original files intact alongside WebP.');
    } else {
      for (const oldPath of oldPathsToRemove) {
        try {
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (unlinkErr) {
          console.warn(`Could not remove old file ${oldPath}:`, unlinkErr.message);
        }
      }
    }

    const beforeKB = Math.round(beforeBytesTotal / 1024);
    const afterKB = Math.round(afterBytesTotal / 1024);
    const savedKB = Math.max(0, beforeKB - afterKB);
    const savedPercent = beforeBytesTotal > 0
      ? Math.round(((beforeBytesTotal - afterBytesTotal) / beforeBytesTotal) * 100)
      : 0;

    const report = {
      ok: true,
      scanned: candidates.length,
      converted,
      skipped,
      failed,
      beforeKB,
      afterKB,
      savedKB,
      savedPercent,
      dbUpdates,
      durationMs: Date.now() - startedAt,
      ranAt: new Date().toISOString()
    };

    lastOptimizationReport = report;

    if (isDatabaseReady() && converted > 0) {
      try {
        await getPool().query(
          `INSERT INTO site_configs (key, value, updated_at)
           VALUES ('uploads_webp_optimization_report', $1::jsonb, NOW())
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [JSON.stringify(report)]
        );
      } catch {}
    }

    console.log(
      `Image optimization complete: ${converted}/${candidates.length} converted to WebP (${beforeKB} KB -> ${afterKB} KB, saved ${savedKB} KB / ${savedPercent}%)`
    );

    return report;
  })();

  try {
    return await activeOptimizationPromise;
  } finally {
    activeOptimizationPromise = null;
  }
}
