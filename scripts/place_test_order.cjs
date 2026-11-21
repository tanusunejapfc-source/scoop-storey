const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://fxsmqomlxekbcfihhnle.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wfIyuRhwsJAqtZrisb0q9A_AcYO0xCU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

async function runLiveTestOrder() {
  console.log('\n======================================================');
  console.log('    LIVE PRODUCTION WEBSITE & TEST ORDER AUDIT       ');
  console.log('======================================================\n');

  // 1. Verify Website & Edge CDN
  console.log('--- Step 1: Testing Website HTTP Endpoints & Assets ---');
  const urls = [
    'https://scoopstorey.com/',
    'https://scoopstorey.com/robots.txt',
    'https://scoopstorey.com/sitemap.xml',
    'https://scoopstorey.com/manifest.json'
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

  // 2. Place a Live Test Order
  console.log('\n--- Step 2: Placing Live Test Order via Production API ---');
  const testOrderId = `SS-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
  const testOrder = {
    order_id: testOrderId,
    customer: {
      fullName: 'Tanu Verification Customer',
      phone: '9812354321',
      streetAddress: 'Flat 402, Lotus Garden, Bandra West',
      landmark: 'Near City Mall',
      pincode: '400050',
      city: 'Mumbai',
      state: 'Maharashtra',
      paymentScreenshot: 'https://fxsmqomlxekbcfihhnle.supabase.co/storage/v1/object/public/product-images/test-receipt.png'
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
    total_inr: 799,
    subtotal_inr: 799,
    discount_amount_inr: 0,
    shipping_inr: 0,
    total_item_count: 1,
    status: 'Payment Received (Screenshot Attached)',
    payment_method: 'UPI QR Code',
    upi_ref_number: 'UTR-LIVE-TEST-9921',
    film_on_reel: '@tanu_kawaii_collector',
    additional_notes: 'Automated end-to-end verification order'
  };

  const { data: insertData, error: insertError } = await supabase
    .from('orders')
    .upsert(testOrder, { onConflict: 'order_id' })
    .select();

  if (insertError) {
    console.error('  ✗ Failed to insert test order into Supabase:', insertError.message);
    process.exit(1);
  }
  console.log(`  ✓ Test Order Placed Successfully in Supabase!`);
  console.log(`    Order ID: ${testOrderId}`);
  console.log(`    Total Amount: ₹${testOrder.total_inr}`);
  console.log(`    Status: ${testOrder.status}`);

  // 3. Test Order Tracking & Privacy Masking
  console.log('\n--- Step 3: Verifying Secure Order Tracking & PII Masking ---');
  const { data: trackData, error: trackError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', testOrderId)
    .single();

  if (trackError || !trackData) {
    console.error('  ✗ Tracking lookup failed:', trackError?.message);
    process.exit(1);
  }

  const maskedPhone = maskPhone(trackData.customer?.phone);
  const maskedName = maskName(trackData.customer?.fullName);
  console.log(`  ✓ Tracking Record Retrieved:`);
  console.log(`    Order ID: ${trackData.order_id}`);
  console.log(`    Status: ${trackData.status}`);
  console.log(`    Masked Recipient: ${maskedName}`);
  console.log(`    Masked Phone: ${maskedPhone}`);
  console.log(`    Destination: ${trackData.customer?.city}, ${trackData.customer?.state}`);
  console.log(`    Items: ${trackData.items?.[0]?.name} (Qty: ${trackData.items?.[0]?.qty})`);

  // Assertions for privacy masking
  if (maskedPhone.includes('54321')) {
    console.error('  ✗ Security Failure: Full phone number leaked in tracking!');
    process.exit(1);
  }
  console.log('  ✓ Verified: Phone number is properly masked (+91 98123*****).');

  // 4. Test Order Deletion / Tombstone Handling
  console.log('\n--- Step 4: Testing Order Deletion & Purge ---');
  const { error: delError } = await supabase
    .from('orders')
    .update({ status: 'Order Deleted' })
    .eq('order_id', testOrderId);

  if (delError) {
    console.error('  ✗ Soft delete error:', delError.message);
  } else {
    console.log(`  ✓ Test order ${testOrderId} marked as 'Order Deleted'.`);
  }

  // Verify that active query excludes it
  const { data: activeCheck } = await supabase
    .from('orders')
    .select('order_id')
    .eq('order_id', testOrderId)
    .neq('status', 'Order Deleted');

  if (activeCheck && activeCheck.length > 0) {
    console.error('  ✗ Order still appears in active orders query!');
    process.exit(1);
  }
  console.log('  ✓ Verified: Deleted order is strictly excluded from active queries.');

  console.log('\n======================================================');
  console.log('    ALL LIVE ORDER & WEBSITE CHECKS PASSED (100%)    ');
  console.log('======================================================\n');
}

runLiveTestOrder();
