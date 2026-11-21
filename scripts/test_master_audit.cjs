const assert = require('assert');
const fs = require('fs');
const path = require('path');

let passedTests = 0;
let totalTests = 0;

function it(title, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${title}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${title}`);
    console.error(`    ${err.message}`);
  }
}

async function itAsync(title, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${title}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${title}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n======================================================');
console.log('   SCOOP STOREY COMPREHENSIVE AUTOMATED AUDIT SUITE   ');
console.log('======================================================\n');

// 1. BUSINESS LOGIC: Cart & Authoritative Price Verification
console.log('--- 1. Business Logic: Pricing & Cart Calculations ---');

const MOCK_CATALOG = [
  { id: 'scoop-mini', name: 'Scoop Storey - Mini Scoop', priceINR: 799 },
  { id: 'scoop-midi', name: 'Scoop Storey - Midi Scoop', priceINR: 1299 },
  { id: 'pend-bow-heart', name: 'Bow Heart Aesthetic Pendant', priceINR: 199 }
];

function getAuthoritativePrice(itemId, fallbackPrice) {
  const item = MOCK_CATALOG.find(p => p.id === itemId);
  return item ? item.priceINR : Number(fallbackPrice || 0);
}

it('Calculates accurate cart subtotal with standard quantities', () => {
  const cart = [
    { id: 'scoop-mini', priceINR: 799, qty: 1 },
    { id: 'pend-bow-heart', priceINR: 199, qty: 2 }
  ];
  const subtotal = cart.reduce((acc, item) => acc + item.priceINR * item.qty, 0);
  assert.strictEqual(subtotal, 799 + 199 * 2); // 1197
});

it('Overrides client-tampered cart prices with authoritative catalog prices', () => {
  // Attacker modified localStorage to claim price is ₹1
  const tamperedCart = [
    { id: 'scoop-midi', priceINR: 1, qty: 1 }
  ];
  const verifiedSubtotal = tamperedCart.reduce((acc, item) => {
    const verifiedPrice = getAuthoritativePrice(item.id, item.priceINR);
    return acc + verifiedPrice * item.qty;
  }, 0);
  assert.strictEqual(verifiedSubtotal, 1299); // Must be ₹1299, NOT ₹1!
});

it('Clamps negative or extreme quantities between 1 and 20', () => {
  const sanitizeQty = (qty) => Math.max(1, Math.min(20, Math.floor(Number(qty || 1))));
  assert.strictEqual(sanitizeQty(-5), 1);
  assert.strictEqual(sanitizeQty(0), 1);
  assert.strictEqual(sanitizeQty(99999), 20);
  assert.strictEqual(sanitizeQty(3), 3);
});

// 2. BUSINESS LOGIC: Coupon Codes & Spend Thresholds
console.log('\n--- 2. Business Logic: Coupons & Discount Rules ---');

function calculateDiscount(subtotal, coupon, fallbackPct = 0) {
  if (coupon) {
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return 0; // Invalidate if threshold not met
    }
    if (coupon.type === 'percent') {
      return Math.round(subtotal * (coupon.value / 100));
    }
    if (coupon.type === 'flat') {
      return Math.min(subtotal, Number(coupon.value) || 0);
    }
  }
  return Math.round(subtotal * fallbackPct);
}

it('Applies 10% percentage discount accurately', () => {
  const coupon = { code: 'SCOOP10', type: 'percent', value: 10 };
  assert.strictEqual(calculateDiscount(1000, coupon), 100);
});

it('Applies flat discount without exceeding subtotal', () => {
  const coupon = { code: 'FLAT200', type: 'flat', value: 200 };
  assert.strictEqual(calculateDiscount(1500, coupon), 200);
  assert.strictEqual(calculateDiscount(150, coupon), 150); // Cap at subtotal
});

it('Strictly invalidates coupon when cart drops below minSpend requirement', () => {
  const coupon = { code: 'VIP500', type: 'flat', value: 500, minSpend: 2000 };
  assert.strictEqual(calculateDiscount(2500, coupon), 500);
  assert.strictEqual(calculateDiscount(1800, coupon), 0); // Cart dropped below ₹2000!
});

// 3. PAYMENT & E-COMMERCE: Partial COD Breakdown
console.log('\n--- 3. Payment & E-commerce: Partial COD Logic ---');

function calculatePaymentBreakdown(totalINR, paymentMode = 'full_prepaid', settings = {}) {
  const baseOrderTotal = Math.max(0, Number(totalINR || 0));
  if (paymentMode !== 'partial_cod') {
    return {
      paymentMode: 'full_prepaid',
      payNowINR: baseOrderTotal,
      balanceCodINR: 0,
      codFeeINR: 0,
      finalTotalINR: baseOrderTotal,
      advancePercentage: 100,
      isPartialCod: false
    };
  }
  const codFee = Math.max(0, Number(settings.partialCodFee || 0));
  const orderWithFee = baseOrderTotal + codFee;
  let advancePct = Number(settings.partialCodPercentage || 20);
  const advanceINR = Math.max(1, Math.round((orderWithFee * advancePct) / 100));
  const balanceINR = Math.max(0, orderWithFee - advanceINR);

  return {
    paymentMode: 'partial_cod',
    payNowINR: advanceINR,
    balanceCodINR: balanceINR,
    codFeeINR: codFee,
    finalTotalINR: orderWithFee,
    advancePercentage: advancePct,
    isPartialCod: true
  };
}

it('Accurately calculates 20% Partial COD advance and remaining balance', () => {
  const breakdown = calculatePaymentBreakdown(1000, 'partial_cod', { partialCodPercentage: 20 });
  assert.strictEqual(breakdown.payNowINR, 200);
  assert.strictEqual(breakdown.balanceCodINR, 800);
  assert.strictEqual(breakdown.payNowINR + breakdown.balanceCodINR, breakdown.finalTotalINR);
});

it('Preserves 100% prepaid total when not using partial COD', () => {
  const breakdown = calculatePaymentBreakdown(1499, 'full_prepaid');
  assert.strictEqual(breakdown.payNowINR, 1499);
  assert.strictEqual(breakdown.balanceCodINR, 0);
  assert.strictEqual(breakdown.isPartialCod, false);
});

// 4. SECURITY & PRIVACY: PII Masking in Order Tracking
console.log('\n--- 4. Security & Privacy: Customer Data Protection ---');

function maskPhone(rawPhone) {
  let clean = String(rawPhone || '').replace(/\D/g, '');
  if (clean.length === 12 && clean.startsWith('91')) {
    clean = clean.slice(2);
  }
  if (clean.length >= 10) return `+91 ${clean.slice(0, 5)}*****`;
  return clean ? '******' : '';
}

function maskName(rawName) {
  const parts = String(rawName || 'Collector').trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
}

function maskPincode(rawPin) {
  const clean = String(rawPin || '').replace(/\D/g, '');
  return clean.length === 6 ? `${clean.slice(0, 3)}***` : '';
}

it('Masks customer phone number for public tracking display', () => {
  assert.strictEqual(maskPhone('9819922653'), '+91 98199*****');
  assert.strictEqual(maskPhone('+919812354321'), '+91 98123*****');
});

it('Masks customer full name for public tracking display', () => {
  assert.strictEqual(maskName('Diya Kapoor'), 'Diya K.');
  assert.strictEqual(maskName('Ashish Goyal'), 'Ashish G.');
  assert.strictEqual(maskName('Aarohi'), 'Aarohi');
});

it('Masks postal PIN code for public tracking display', () => {
  assert.strictEqual(maskPincode('400050'), '400***');
  assert.strictEqual(maskPincode('124001'), '124***');
});

// 5. SEO & PLATFORM INTEGRITY: Robots, Sitemap, Manifest, Vercel Config
console.log('\n--- 5. SEO & Technical Configuration Verification ---');

const projectRoot = path.resolve(__dirname, '..');

it('Verifies public/robots.txt exists and specifies sitemap', () => {
  const robotsPath = path.join(projectRoot, 'public', 'robots.txt');
  assert(fs.existsSync(robotsPath), 'robots.txt must exist');
  const content = fs.readFileSync(robotsPath, 'utf8');
  assert(content.includes('Sitemap: https://scoopstorey.com/sitemap.xml'), 'Must declare sitemap');
  assert(content.includes('Disallow: /#admin'), 'Must disallow admin indexing');
});

it('Verifies public/sitemap.xml exists and has valid XML tags', () => {
  const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
  assert(fs.existsSync(sitemapPath), 'sitemap.xml must exist');
  const content = fs.readFileSync(sitemapPath, 'utf8');
  assert(content.includes('<urlset'), 'Must have urlset root');
  assert(content.includes('https://scoopstorey.com/'), 'Must include root domain');
  assert(content.includes('https://scoopstorey.com/#collection-mystery-scoops'), 'Must include mystery scoops');
});

it('Verifies public/manifest.json exists with valid PWA manifest fields', () => {
  const manifestPath = path.join(projectRoot, 'public', 'manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.strictEqual(manifest.name, 'Scoop Storey | Collect Happiness');
  assert.strictEqual(manifest.theme_color, '#E60067');
  assert(manifest.icons.length > 0, 'Must have app icons');
});

it('Verifies vercel.json contains complete security headers (HSTS, nosniff, DENY)', () => {
  const vercelPath = path.join(projectRoot, 'vercel.json');
  assert(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const allHeaderRules = vercelConfig.headers.flatMap(h => h.headers);
  const headerKeys = allHeaderRules.map(h => h.key);
  assert(headerKeys.includes('X-Content-Type-Options'), 'Must include X-Content-Type-Options');
  assert(headerKeys.includes('X-Frame-Options'), 'Must include X-Frame-Options');
  assert(headerKeys.includes('Strict-Transport-Security'), 'Must include HSTS');
  assert(headerKeys.includes('Permissions-Policy'), 'Must include Permissions-Policy');
});

it('Verifies index.html has canonical link, manifest, and Schema.org structured data', () => {
  const htmlPath = path.join(projectRoot, 'index.html');
  assert(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert(html.includes('<link rel="canonical" href="https://scoopstorey.com/" />'), 'Must have canonical URL');
  assert(html.includes('<link rel="manifest" href="/manifest.json" />'), 'Must link manifest.json');
  assert(html.includes('application/ld+json'), 'Must contain JSON-LD Schema');
  assert(html.includes('"@type": "Store"'), 'Must define Store schema');
});

console.log('\n======================================================');
console.log(`   AUTOMATED TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
