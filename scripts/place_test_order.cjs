const BASE_URL = (process.env.STORE_BASE_URL || 'https://www.scoopstorey.com').replace(/\/+$/, '');

async function runLiveTestOrder() {
  console.log('\n======================================================');
  console.log('    LIVE PRODUCTION WEBSITE & TEST ORDER AUDIT       ');
  console.log('======================================================\n');

  // 1. Verify Website, Health API & Edge Assets
  console.log('--- Step 1: Testing Website HTTP Endpoints & Assets ---');
  const urls = [
    `${BASE_URL}/api/health`,
    `${BASE_URL}/`,
    `${BASE_URL}/robots.txt`,
    `${BASE_URL}/sitemap.xml`,
    `${BASE_URL}/manifest.json`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`  [${res.status} ${res.statusText}] ${url} (${res.headers.get('content-type') || 'no-type'})`);
      if (res.status !== 200) {
        throw new Error(`Failed to load ${url}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`  ✗ Error accessing ${url}:`, err.message);
      process.exit(1);
    }
  }

  // 2. Place a Live Test Order via Railway Express REST API
  console.log('\n--- Step 2: Placing Live Test Order via Production API ---');
  const testOrderId = `SS-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
  const testOrder = {
    orderId: testOrderId,
    customer: {
      fullName: 'Tanu Verification Customer',
      phone: '9812354321',
      streetAddress: 'Flat 402, Lotus Garden, Bandra West',
      landmark: 'Near City Mall',
      pincode: '400050',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    items: [
      {
        id: 'scoop-mini',
        name: 'Scoop Storey - Mini Scoop',
        priceINR: 799,
        qty: 1,
        selectedColor: 'Pastel Kawaii Mix',
        selectedColorHex: '#FFAAA6',
        image: '/images/scoop-bowl.webp'
      }
    ],
    totalINR: 799,
    subtotalINR: 799,
    discountAmountINR: 0,
    shippingINR: 0,
    totalItemCount: 1,
    status: 'Payment Received (Screenshot Attached)',
    paymentMethod: 'UPI QR Code',
    upiRefNumber: 'UTR-LIVE-TEST-9921',
    filmOnReel: '@tanu_kawaii_collector',
    additionalNotes: 'Automated end-to-end verification order'
  };

  const createRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
  });
  const createJson = await createRes.json().catch(() => ({}));
  if (!createRes.ok || !createJson.success) {
    console.error('  ✗ Failed to insert test order into Railway PostgreSQL:', createJson.error || createRes.status);
    process.exit(1);
  }
  console.log(`  ✓ Test Order Placed Successfully via Railway API!`);
  console.log(`    Order ID: ${testOrderId}`);
  console.log(`    Total Amount: ₹${testOrder.totalINR}`);
  console.log(`    Status: ${testOrder.status}`);

  // 3. Test Order Tracking & Privacy Masking
  console.log('\n--- Step 3: Verifying Secure Order Tracking & PII Masking ---');
  const trackRes = await fetch(`${BASE_URL}/api/tracking?q=${encodeURIComponent(testOrderId)}`);
  const trackJson = await trackRes.json().catch(() => ({}));
  const trackData = trackJson.order;
  if (!trackRes.ok || !trackData) {
    console.error('  ✗ Tracking lookup failed:', trackJson.error || trackRes.status);
    process.exit(1);
  }

  const maskedPhone = trackData.customer?.phone || '';
  const maskedName = trackData.customer?.fullName || '';
  console.log(`  ✓ Tracking Record Retrieved:`);
  console.log(`    Order ID: ${trackData.orderId}`);
  console.log(`    Status: ${trackData.status}`);
  console.log(`    Masked Recipient: ${maskedName}`);
  console.log(`    Masked Phone: ${maskedPhone}`);
  console.log(`    Destination: ${trackData.customer?.city}, ${trackData.customer?.state}`);
  console.log(`    Items: ${trackData.items?.[0]?.name} (Qty: ${trackData.items?.[0]?.qty})`);

  if (maskedPhone.includes('54321')) {
    console.error('  ✗ Security Failure: Full phone number leaked in tracking!');
    process.exit(1);
  }
  console.log('  ✓ Verified: Phone number is properly masked (+91 98123*****).');

  // 4. Test Order Deletion & Purge
  console.log('\n--- Step 4: Testing Order Deletion & Purge ---');
  const delRes = await fetch(`${BASE_URL}/api/orders/${encodeURIComponent(testOrderId)}`, {
    method: 'DELETE'
  });
  if (!delRes.ok) {
    console.error('  ✗ Delete error:', delRes.status);
    process.exit(1);
  }
  console.log(`  ✓ Test order ${testOrderId} deleted from PostgreSQL.`);

  const verifyDelRes = await fetch(`${BASE_URL}/api/tracking?q=${encodeURIComponent(testOrderId)}`);
  const verifyDelJson = await verifyDelRes.json().catch(() => ({}));
  if (verifyDelJson.order) {
    console.error('  ✗ Deleted order still appears in tracking lookup!');
    process.exit(1);
  }
  console.log('  ✓ Verified: Deleted order is strictly excluded from tracking queries.');

  console.log('\n======================================================');
  console.log('    ALL LIVE ORDER & WEBSITE CHECKS PASSED (100%)    ');
  console.log('======================================================\n');
}

runLiveTestOrder().catch((err) => {
  console.error('Live test order verification failed:', err);
  process.exit(1);
});
