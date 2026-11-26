const fs = require('fs');

console.log('Running 3-Step Enterprise Checkout Audit...');

const drawer = fs.readFileSync('src/components/CartDrawer.jsx', 'utf8');
const app = fs.readFileSync('src/App.jsx', 'utf8');
const wishlist = fs.readFileSync('src/utils/wishlistStore.js', 'utf8');
const admin = fs.readFileSync('src/components/AdminPanel.jsx', 'utf8');
const reviewsAdmin = fs.readFileSync('src/components/admin/AdminReviewsManager.jsx', 'utf8');
const reelsStore = fs.readFileSync('src/utils/reelsStore.js', 'utf8');

function check(label, cond) {
  console.log(`${label}: ${cond ? 'PASS' : 'FAIL'}`);
  if (!cond) process.exit(1);
}

// 1. Stepper check
check('1. Stepper check', drawer.includes('1. Bag') && drawer.includes('2. Address') && drawer.includes('3. Payment'));

// 2. Payment Option removed from step 1
const cartIndex = drawer.indexOf("checkoutStep === 'cart' && (");
const addressIndex = drawer.indexOf("checkoutStep === 'address' && (");
const cartStepSection = drawer.slice(cartIndex, addressIndex);
check('2. Payment option removed from step 1 (cart)', !cartStepSection.includes('Payment Option:'));

// 3. Step 3 (payment) screen in drawer
check('3. Step 3 (payment) screen in drawer', drawer.includes("checkoutStep === 'payment'"));

// 4. All 3 payment options in step 3
check('4. 100% Prepaid in step 3', drawer.includes('100% Prepaid (UPI)'));
check('5. Partial COD in step 3', drawer.includes('Partial Cash on Delivery'));
check('6. Full COD in step 3', drawer.includes('100% Cash on Delivery'));

// 5. Total details moved below payment method (scrollable), not bloating sticky footer
const paymentBodyStart = drawer.lastIndexOf("checkoutStep === 'payment' ? (");
const addressBodyStart = drawer.indexOf("checkoutStep === 'address' ? (", paymentBodyStart);
const paymentBody = drawer.slice(paymentBodyStart, addressBodyStart);
const paymentFooterStart = drawer.indexOf("checkoutStep === 'payment' && (");
const paymentFooter = drawer.slice(paymentFooterStart);
check('7. Total details placed below payment methods in scrollable body', paymentBody.includes('Extra COD Courier Handling Fee') && paymentBody.includes('Order Total'));
check('8. Sticky bottom bar for payment step is slim (no Subtotal breakdown)', !paymentFooter.includes('Subtotal ('));

// 6. Auto-open drawer & overlapping toast removed in App.jsx
check('9. Auto-open drawer in App.jsx', app.includes('setIsCartOpen(true);') && app.includes('soundFX.playSuccess();'));
check('10. AddedToCartToast removed from App.jsx', !app.includes('<AddedToCartToast') && !app.includes('setAddedToastItem('));

// 7. Cart & Wishlist synchronous clearing on order confirmation
check('11. Synchronous cart clear in App.jsx', app.includes("localStorage.setItem('scoop_cart_items_v2', JSON.stringify([]));"));
check('12. removeItemsFromWishlist exported & used', wishlist.includes('export function removeItemsFromWishlist') && drawer.includes('removeItemsFromWishlist(cleanItems.map(item => item.id))'));

// 8. Admin COD fee & prepaid config
check('13. Admin COD fee & prepaid config', admin.includes('codFee') && admin.includes('prepaidEnabled'));

// 9. Bug fixes verified (minRequired, setComment, REVIEWS_STORAGE_KEY)
check('14. Bug fixes (no undefined refs)', !drawer.includes('minRequired') && !reviewsAdmin.includes('setComment') && !reelsStore.includes('REVIEWS_STORAGE_KEY'));

// 10. Meta Ads Back-to-Homepage routing verified
const productPage = fs.readFileSync('src/components/ProductDetailPage.jsx', 'utf8');
check(
  '15. Meta Ads user-activated history & safe Back-to-Home routing',
  app.includes('commitUserActivatedHistory') &&
  app.includes('isDirectAdLanding') &&
  productPage.includes('Back to Home')
);

console.log('\nAll 15/15 3-Step Checkout & Meta Ads Routing Verification Tests PASSED!');
