const fs = require('fs');

console.log('Running 3-Step Enterprise Checkout Audit...');

const drawer = fs.readFileSync('src/components/CartDrawer.jsx', 'utf8');

// 1. Verify Stepper
const hasStepper = drawer.includes('1. Bag') && drawer.includes('2. Address') && drawer.includes('3. Payment');
console.log('1. Stepper check:', hasStepper ? 'PASS' : 'FAIL');
if (!hasStepper) process.exit(1);

// 2. Verify Payment Option removed from step 1
const cartIndex = drawer.indexOf("checkoutStep === 'cart' && (");
const addressIndex = drawer.indexOf("checkoutStep === 'address' && (");
const cartStepSection = drawer.slice(cartIndex, addressIndex);
const paymentRemovedFromStep1 = !cartStepSection.includes('Payment Option:');
console.log('2. Payment option removed from step 1 (cart):', paymentRemovedFromStep1 ? 'PASS' : 'FAIL');
if (!paymentRemovedFromStep1) process.exit(1);

// 3. Verify Step 3 (payment) screen in drawer
const hasPaymentStep = drawer.includes("checkoutStep === 'payment'");
console.log('3. Step 3 (payment) screen in drawer:', hasPaymentStep ? 'PASS' : 'FAIL');
if (!hasPaymentStep) process.exit(1);

// 4. Verify 3 options in payment step
const hasPrepaid = drawer.includes('100% Prepaid (Instant UPI)');
const hasPartialCod = drawer.includes('Partial Cash on Delivery');
const hasFullCod = drawer.includes('100% Cash on Delivery');
const hasCodFee = drawer.includes('Extra Courier Handling Fee');

console.log('4. 100% Prepaid in step 3:', hasPrepaid ? 'PASS' : 'FAIL');
console.log('5. Partial COD in step 3:', hasPartialCod ? 'PASS' : 'FAIL');
console.log('6. Full COD in step 3:', hasFullCod ? 'PASS' : 'FAIL');
console.log('7. Full COD extra fee display:', hasCodFee ? 'PASS' : 'FAIL');
if (!hasPrepaid || !hasPartialCod || !hasFullCod || !hasCodFee) process.exit(1);

// 8. Verify auto-open on add to cart in App.jsx
const app = fs.readFileSync('src/App.jsx', 'utf8');
const hasAutoOpen = app.includes('setIsCartOpen(true);') && app.includes('soundFX.playSuccess();');
console.log('8. Auto-open drawer in App.jsx:', hasAutoOpen ? 'PASS' : 'FAIL');
if (!hasAutoOpen) process.exit(1);

// 9. Verify AdminPanel has COD fee and prepaid toggle
const admin = fs.readFileSync('src/components/AdminPanel.jsx', 'utf8');
const hasAdminCodFee = admin.includes('codFee') && admin.includes('prepaidEnabled');
console.log('9. Admin COD fee & prepaid config:', hasAdminCodFee ? 'PASS' : 'FAIL');
if (!hasAdminCodFee) process.exit(1);

console.log('\nAll 9/9 3-Step Checkout Verification Tests PASSED!');
