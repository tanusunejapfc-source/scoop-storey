const fs = require('fs');
const path = require('path');

// 1. Load products from storeData.js
const storeDataCode = fs.readFileSync(path.join(__dirname, '../src/data/storeData.js'), 'utf8');
const match = storeDataCode.match(/export const PRODUCTS = (\[[\s\S]*?\n\];)/);
if (!match) {
  console.error('Could not find PRODUCTS in storeData.js');
  process.exit(1);
}
const PRODUCTS = eval(match[1]);
console.log(`Loaded ${PRODUCTS.length} products.`);

// 2. Pool of 75 Authentic Indian Female Names & Handles
const femaleReviewers = [
  { name: 'Ananya Sharma', handle: '@ananya_glam' },
  { name: 'Priya Patel', handle: '@priya.crafts' },
  { name: 'Sneha Verma', handle: '@sneha_vibe' },
  { name: 'Riya Sen', handle: '@riya.styles' },
  { name: 'Pooja Nair', handle: '@pooja_sparkles' },
  { name: 'Tanvi Kapoor', handle: '@tanvi.diaries' },
  { name: 'Ishita Gupta', handle: '@ishita_in' },
  { name: 'Aadhya Iyer', handle: '@aadhya_n' },
  { name: 'Meera Joshi', handle: '@meera.looks' },
  { name: 'Simran Kaur', handle: '@simran_kawaii' },
  { name: 'Divya Rao', handle: '@divya.jewels' },
  { name: 'Shreya Chawla', handle: '@shreya_c' },
  { name: 'Kriti Agarwal', handle: '@kriti.vibes' },
  { name: 'Anika Deshmukh', handle: '@anika_d' },
  { name: 'Neha Bansal', handle: '@neha.aesthetic' },
  { name: 'Roshni Saxena', handle: '@roshni_s' },
  { name: 'Aarohi Bhatt', handle: '@aarohi.b' },
  { name: 'Mansi Kulkarni', handle: '@mansi_k' },
  { name: 'Diya Mukherjee', handle: '@diya.crafts' },
  { name: 'Sanya Singhania', handle: '@sanya_s' },
  { name: 'Bhavna Reddy', handle: '@bhavna_r' },
  { name: 'Aditi Mathur', handle: '@aditi.style' },
  { name: 'Natasha Hegde', handle: '@natasha_h' },
  { name: 'Kavya Menon', handle: '@kavya_m' },
  { name: 'Avani Chopra', handle: '@avani_c' },
  { name: 'Tanya Sethi', handle: '@tanya.sethi' },
  { name: 'Pallavi Das', handle: '@pallavi_d' },
  { name: 'Riddhi Shah', handle: '@riddhi_shah' },
  { name: 'Niharika Malhotra', handle: '@niharika_m' },
  { name: 'Mehak Oberoi', handle: '@mehak_o' },
  { name: 'Lavanya Pillai', handle: '@lavanya_p' },
  { name: 'Charu Goyal', handle: '@charu_g' },
  { name: 'Trisha Bose', handle: '@trisha_b' },
  { name: 'Jyoti Pandey', handle: '@jyoti_p' },
  { name: 'Swati Mishra', handle: '@swati_m' },
  { name: 'Vrinda Mehta', handle: '@vrinda_mehta' },
  { name: 'Muskan Jain', handle: '@muskan_j' },
  { name: 'Payal Agarwal', handle: '@payal_a' },
  { name: 'Radhika Khandelwal', handle: '@radhika_k' },
  { name: 'Sakshi Mittal', handle: '@sakshi_m' },
  { name: 'Alisha Khan', handle: '@alisha_k' },
  { name: 'Sanjana Tiwari', handle: '@sanjana_t' },
  { name: 'Khushi Dave', handle: '@khushi_d' },
  { name: 'Shruti Tripathi', handle: '@shruti_t' },
  { name: 'Devika Nambiar', handle: '@devika_n' },
  { name: 'Palak Chugh', handle: '@palak_c' },
  { name: 'Akanksha Rastogi', handle: '@akanksha_r' },
  { name: 'Sonali Ghosh', handle: '@sonali_g' },
  { name: 'Garima Somani', handle: '@garima_s' },
  { name: 'Kashish Ahuja', handle: '@kashish_a' },
  { name: 'Pragya Narang', handle: '@pragya_n' },
  { name: 'Anushree Dutta', handle: '@anushree_d' },
  { name: 'Disha Somani', handle: '@disha_s' },
  { name: 'Jasleen Sandhu', handle: '@jasleen_s' },
  { name: 'Nikita Bajaj', handle: '@nikita_b' },
  { name: 'Preeti Kaushik', handle: '@preeti_k' },
  { name: 'Richa Bhardwaj', handle: '@richa_b' },
  { name: 'Komal Singhal', handle: '@komal_s' },
  { name: 'Ritika Wadhwa', handle: '@ritika_w' },
  { name: 'Saloni Jain', handle: '@saloni_j' },
  { name: 'Yashika Taneja', handle: '@yashika_t' },
  { name: 'Bhavika Mahajan', handle: '@bhavika_m' },
  { name: 'Harleen Sethi', handle: '@harleen_s' },
  { name: 'Urvashi Dahiya', handle: '@urvashi_d' },
  { name: 'Shweta Goel', handle: '@shweta_g' },
  { name: 'Namrata Joshi', handle: '@namrata_j' },
  { name: 'Chetna Jindal', handle: '@chetna_j' },
  { name: 'Deepali Tyagi', handle: '@deepali_t' },
  { name: 'Kajal Chadha', handle: '@kajal_c' },
  { name: 'Gunjan Juneja', handle: '@gunjan_j' },
  { name: 'Srishti Rawat', handle: '@srishti_r' },
  { name: 'Mansi Bhatt', handle: '@mansi_bhatt' },
  { name: 'Chhavi Grover', handle: '@chhavi_g' },
  { name: 'Prerna Mathur', handle: '@prerna_m' },
  { name: 'Alka Singhal', handle: '@alka_s' }
];

// Month names for date formatting
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Realistic review templates organized by category
const CATEGORY_TEMPLATES = {
  'Mystery Scoops': [
    {
      title: 'Saw my scoop packed on Instagram Reels! 💖',
      comment: 'I ordered the scoop after watching their viral reel and honestly the unboxing was so magical! The charms have proper weight, vibrant colors, and the extra free stickers and candy made my day.',
      rating: 5
    },
    {
      title: 'Got 3 rare charms and the cutest bear keychain! ✨',
      comment: 'Bhaskar genuinely scoops generously! I was worried I would only get small beads, but I got a gorgeous butterfly charm, faceted crystal, and mini lip oil. Worth every single rupee.',
      rating: 5
    },
    {
      title: 'Packaging felt like a birthday gift to myself 🎀',
      comment: 'The pink parcel with the wax seal, pink crinkle paper, and cute greeting card is unmatched. Quality of charms is top notch. Ordering another scoop for my sister’s birthday!',
      rating: 5
    },
    {
      title: 'Addictive ASMR scoop experience 🍨',
      comment: 'Super fast delivery to Mumbai in 3 days. Loved every surprise item in my scoop. They are heavy, glossy and not cheap plastic at all.',
      rating: 5
    },
    {
      title: 'Exceeded all my expectations! 🌸',
      comment: 'My very first mystery scoop and I am obsessed! You get so many aesthetic treasures that easily cost double if bought individually. 100% recommended!',
      rating: 5
    },
    {
      title: 'Loved the surprises, super cute! ✨',
      comment: 'Everything was packed with so much love and care. Charms are super glossy and the bonus free gifts made it even sweeter. Will order again soon.',
      rating: 5
    },
    {
      title: 'Best impulse buy of the month! 🎁',
      comment: 'Was hesitant about prepaid orders but Scoop Storey is 100% legit. Got tracking details on WhatsApp immediately and package arrived safely in bubble wrap.',
      rating: 5
    },
    {
      title: 'So satisfying to unbox with friends 💕',
      comment: 'My hostel roommates and I gathered around to open this. We were screaming at how cute every piece was, especially the pastel charms and beaded keychain!',
      rating: 5
    },
    {
      title: 'Great haul, loved the variety 🧸',
      comment: 'Received a lovely mix of stationery, cute beauty essentials, and aesthetic charms. Exactly what I wanted from a mystery scoop parcel.',
      rating: 4
    },
    {
      title: 'Generous scoop and super aesthetic packaging 🎀',
      comment: 'The details on the charms are so crisp! No scratches, high gloss finish, and the little freebies were such a thoughtful touch.',
      rating: 5
    }
  ],

  'Pendants & Chains': [
    {
      title: 'Wore it for 2 months straight, zero tarnish! ✨',
      comment: 'I have worn this in the shower, during gym workouts, and in Mumbai humidity. It has NOT turned green at all! Genuine anti-tarnish 18K PVD gold finish. Looks like real gold jewelry.',
      rating: 5
    },
    {
      title: 'Dainty, elegant, and so luxurious 💖',
      comment: 'The chain is silky smooth and catches the light beautifully. I get so many compliments in college whenever I wear it. Looks way more expensive than it actually is!',
      rating: 5
    },
    {
      title: 'Hypoallergenic and so gentle on sensitive skin 🌸',
      comment: 'My skin usually reacts badly to fake jewelry within 2 hours. I have been wearing this pendant non-stop for 3 weeks with zero redness or irritation. Extremely happy!',
      rating: 5
    },
    {
      title: 'Perfect layering necklace! 🎀',
      comment: 'Pairs so well with both western dresses and Indian kurtis. The clasp is sturdy and the pendant has a nice substantial feel to it. Beautiful craftsmanship.',
      rating: 5
    },
    {
      title: 'Packaging was like a luxury boutique parcel 🎁',
      comment: 'Came in a sturdy jewelry pouch with anti-tarnish care tips. The gold shine is warm and rich, not yellow or brassy. 10/10.',
      rating: 5
    },
    {
      title: 'Waterproof test passed! 💧',
      comment: 'Washed my hands and took showers without taking it off. Color is still sparkling bright gold. Best anti-tarnish brand on Instagram right now.',
      rating: 5
    },
    {
      title: 'Ordered one, came back for three more! ✨',
      comment: 'The aesthetic is so Pinterest-worthy. Gifted one to my bestie and she loved it. Delivery was prompt and packaging was secure.',
      rating: 5
    },
    {
      title: 'Very dainty and pretty 💫',
      comment: 'Chain length is perfect for sitting right below the collarbone. Cute design and feels solid in hand. Very satisfied with my purchase.',
      rating: 5
    },
    {
      title: 'Super shiny and lightweight 💕',
      comment: 'You barely feel it on your neck, but everyone notices it! The gold luster looks identical to real 18K jewelry from branded stores.',
      rating: 5
    },
    {
      title: 'Great everyday pendant, lovely finish 🌟',
      comment: 'Clasp is easy to hook and the pendant detail is so clean. Arrived in Bangalore in 3 days with prepaid tracking.',
      rating: 4
    }
  ],

  'Bracelets': [
    {
      title: 'Adjustable chain fits my small wrist perfectly! 🎀',
      comment: 'I always struggle to find bracelets that don’t slip off my small wrist. The extender links on this are great! The enamel work is smooth and vibrant.',
      rating: 5
    },
    {
      title: 'Such a cute fairy-core aesthetic bracelet 🌸',
      comment: 'The pastel charms make the softest, delicate tinkling sound. Wore it to a brunch party and three different girls asked me where I bought it from!',
      rating: 5
    },
    {
      title: 'Wards off the evil eye in style 🧿✨',
      comment: 'The evil eye charm has fine detailing and the gold chain has kept its shine even after daily wear. Super happy with the quality.',
      rating: 5
    },
    {
      title: 'Sturdy clasp and doesn’t catch on clothing 💖',
      comment: 'The links are smoothly polished so it doesn’t pull knitted sweaters or hair. Love layering it alongside my smartwatch.',
      rating: 5
    },
    {
      title: 'Looks even prettier in person than on screen! 💫',
      comment: 'The photos don’t do justice to how sparkly and refined the charms look under sunlight. Packaging was pristine and aesthetic.',
      rating: 5
    },
    {
      title: 'High quality charm bracelet at such an affordable price ✨',
      comment: 'Usually charm bracelets break within a week, but this feels very sturdy. Handcrafted with obvious attention to detail.',
      rating: 5
    },
    {
      title: 'Gifted this to my sister and she cried happy tears! 🎁',
      comment: 'The pink box presentation and wax seal made it feel so personal. Sister hasn’t taken it off since she opened it.',
      rating: 5
    },
    {
      title: 'Very chic and comfortable 🌸',
      comment: 'Lightweight on the wrist and doesn’t pinch skin. Will definitely order the butterfly variant next!',
      rating: 4
    }
  ],

  'Anklets': [
    {
      title: 'Waterproof and beach-ready! 🌊✨',
      comment: 'Took this on a trip to Goa and wore it in the sea water and pool. Dried it off and it’s still sparkling gold with zero tarnish or discoloration!',
      rating: 5
    },
    {
      title: 'Fluid herringbone chain feels like liquid gold 💫',
      comment: 'So smooth against the ankle skin. It doesn’t catch on salwar hems or sneakers. Adds such a dainty, feminine touch to any outfit.',
      rating: 5
    },
    {
      title: 'Minimalist beauty that gets noticed everywhere 💖',
      comment: 'The bead stations are subtle yet eye-catching. The extension chain allows for a relaxed or snug fit depending on footwear.',
      rating: 5
    },
    {
      title: 'Doesn’t pinch or pull ankle hairs! 🌸',
      comment: 'Super comfortable to sleep in. The anti-tarnish coating is genuine. Excellent quality from Scoop Storey.',
      rating: 5
    },
    {
      title: 'Dainty and strong link construction 🎀',
      comment: 'I was worried it might snap while walking, but the links are well soldered and strong. Shipped very fast to Pune.',
      rating: 5
    },
    {
      title: 'Lovely summer shimmer on feet ✨',
      comment: 'Looks fantastic with sandals and ankle jeans. Great polish and comes in a cute protective pouch.',
      rating: 4
    }
  ],

  'Eye Masks': [
    {
      title: 'Like sleeping on a soft marshmallow cloud! ☁️😴',
      comment: 'The silk fabric is so soothing on tired eyes after looking at a laptop all day. Blocks out 100% of room light without pressing uncomfortably on eyelashes.',
      rating: 5
    },
    {
      title: 'Super cute embroidery and doesn’t ruin blowout hair 🎀',
      comment: 'The elastic band has the perfect tension—not too tight, but stays put even if you toss and turn at night. The kawaii design is adorable!',
      rating: 5
    },
    {
      title: 'Hostel essential for uninterrupted sleep! 🌙✨',
      comment: 'My roommates keep the study lamp on late, but with this mask I sleep in total pitch darkness. Fabric is breathable and doesn’t cause sweat.',
      rating: 5
    },
    {
      title: 'Gentle on delicate eye area and skin 🌸',
      comment: 'No morning pillow creases on my face! The soft padding feels cooling and relaxing. Washable and holds its shape.',
      rating: 5
    },
    {
      title: 'Cutest travel sleeping accessory ever ✈️💖',
      comment: 'Used this on a long train journey and slept like a baby. Super soft and compact to carry in any purse.',
      rating: 5
    }
  ],

  'Self-Care': [
    {
      title: 'The viral soda can wipes are SO practical! 🥤✨',
      comment: 'Fits right in the cup holder of my car and side pocket of my backpack. The wipes are moist, have a gentle pleasant scent, and don’t leave sticky residue.',
      rating: 5
    },
    {
      title: 'Pore strips pulled out so many stubborn blackheads! 🌸',
      comment: 'Followed the instructions to wet the nose bridge properly and the strip adhered firmly. Peeled off cleanly and my nose felt baby smooth immediately.',
      rating: 5
    },
    {
      title: 'Gentle on sensitive skin with zero irritation 💖',
      comment: 'Usually facial wipes make my cheeks sting, but these are very mild and refreshing. Love the aesthetic packaging too!',
      rating: 5
    },
    {
      title: 'Great college bag essential 🎒🎀',
      comment: 'My friends always ask me for a wipe from the cute soda can! Dispenses one wipe at a time smoothly.',
      rating: 5
    },
    {
      title: 'Very effective and cute self-care treat 💫',
      comment: 'Pore strips are just as good as the expensive Korean brands. Skin feels clear and pores look noticeably smaller.',
      rating: 4
    }
  ],

  'Korean wallets and bags': [
    {
      title: 'Cloud-quilted texture is so buttery soft! ☁️👛',
      comment: 'The vegan leather feels premium and squishy. Holds 8 cards, coins, and folded notes without bulging awkwardly. Fits into my small baguette bag easily.',
      rating: 5
    },
    {
      title: 'Smooth gold zip that never snags ✨',
      comment: 'Hardware quality is fantastic. The pastel color matches the photos 100%. Looks like an expensive Korean lifestyle brand purchase.',
      rating: 5
    },
    {
      title: 'Compact yet surprisingly spacious! 🎀',
      comment: 'I managed to fit my metro card, debit cards, cash, and even a mini lip balm inside. The stitching along the seams is super neat.',
      rating: 5
    },
    {
      title: 'Got so many compliments at college! 💖',
      comment: 'Everyone in my class wanted to know where I bought this pastel wallet. Arrived neatly packaged in protective wrap with zero chemical odor.',
      rating: 5
    },
    {
      title: 'Aesthetic, practical, and durable 🌸',
      comment: 'Have been using it daily for 6 weeks now and the corners haven’t peeled or scuffed. Best aesthetic wallet for daily use.',
      rating: 5
    }
  ],

  'Make up': [
    {
      title: 'Juicy glassy lips without that annoying sticky feel! 💄✨',
      comment: 'Gives the prettiest dewy reflection and hydrates lips for hours. The subtle fruity scent is delicious and the tint looks so natural on Indian skin tones.',
      rating: 5
    },
    {
      title: 'Jelly blush gives the most natural youthful flush 🌸',
      comment: 'Bounces on the cheeks and blends effortlessly with just fingertips. Doesn’t disturb my sunscreen or base underneath. Super cute tube too!',
      rating: 5
    },
    {
      title: 'Liquid glitter eyeshadow with ZERO fallout! ✨💖',
      comment: 'Dries down quickly and stays in place all night without flaking into my eyes. The shimmer catches stage and wedding lights like magic.',
      rating: 5
    },
    {
      title: 'Perfect everyday glow makeup 🎀',
      comment: 'Gives that effortless clean-girl Korean glass-skin vibe. Very lightweight and doesn’t clog pores.',
      rating: 5
    },
    {
      title: 'High shine and gorgeous pigmentation 💫',
      comment: 'Looks stunning on top of any nude lipstick or alone. Applicator is soft and precise. Love it!',
      rating: 4
    }
  ],

  'Soft Toys': [
    {
      title: 'The softest, squishiest cuddle companion ever! 🧸💖',
      comment: 'The plush fabric is premium microfiber and has zero shedding. The stitching on the face is flawless. My best study desk companion!',
      rating: 5
    },
    {
      title: 'Daughter gasped with joy when she unboxed it! 🎀✨',
      comment: 'The package arrived wrapped like a fairytale parcel. The plushie is generously stuffed and springs right back when squeezed. Pure happiness.',
      rating: 5
    },
    {
      title: 'Super cute kawaii aesthetic and perfect gift 🌸',
      comment: 'Bought this for my bestie’s birthday and she immediately made it her bed pillow. Adorable details and no weird odor at all.',
      rating: 5
    },
    {
      title: 'Marshmallow soft texture, 10/10 cuddle comfort ☁️',
      comment: 'Holding this while watching movies or reading is so comforting. Very high quality craftsmanship.',
      rating: 5
    },
    {
      title: 'Charming addition to my bedroom decor 💕',
      comment: 'Looks just like the photos. The pastel tones blend so nicely with my room aesthetic.',
      rating: 5
    }
  ],

  'Key chains': [
    {
      title: 'The floating glitter bear is so mesmerizing! 🧸✨',
      comment: 'The liquid moves smoothly inside the acrylic bear and the glitter shimmers under sunlight. Adds so much personality to my scooty and car keys!',
      rating: 5
    },
    {
      title: 'Sturdy phone wristlet that actually holds heavy phones 📱💖',
      comment: 'The cord is thick and securely fastened. I don’t worry about dropping my phone while walking. The pastel beads are high quality and don’t chip.',
      rating: 5
    },
    {
      title: 'Sweet little chime bell that doesn’t annoy 🔔🎀',
      comment: 'Soft sweet chime makes it so easy to find my keys in a big tote bag. Detailing on the anime strap is crisp and colorful.',
      rating: 5
    },
    {
      title: 'High quality acrylic and strong lobster clasp 🌸',
      comment: 'Metal ring has good spring tension and hasn’t loosened over weeks of daily key jangling. Super cute accessory.',
      rating: 5
    },
    {
      title: 'Elevates every tote bag and backpack 🎒✨',
      comment: 'Clipped it to my canvas college tote and it instantly made it look 10x cuter. Great little gift idea too!',
      rating: 5
    }
  ],

  'Hair Accessories': [
    {
      title: 'Actually holds my thick long hair without slipping! 🦋✨',
      comment: 'Indian girls with thick hair know the struggle of flimsy claw clips breaking. This spring is strong and the matte claws grip firmly all day without pain.',
      rating: 5
    },
    {
      title: 'Cloud plush scrunchie leaves ZERO hair creases ☁️🎀',
      comment: 'The elastic is gentle and the velvet fabric doesn’t snag or pull out hair strands when removing. Wore it to bed and hair was smooth in the morning.',
      rating: 5
    },
    {
      title: 'Pearl pins add such luxury elegance to traditional wear 🌸',
      comment: 'Wore these pearl bobby pins with a pastel saree for a family wedding. They stayed snug in my bun for 8 hours without needing bobby pin adjustments.',
      rating: 5
    },
    {
      title: 'Matte pastel finish is so aesthetic and chic 💖',
      comment: 'Doesn’t look like cheap plastic. The duo pack is great value and both colors match almost every outfit in my wardrobe.',
      rating: 5
    },
    {
      title: 'Sturdy spring and gentle on scalp 💫',
      comment: 'Doesn’t pinch the scalp or give tension headaches. Very satisfied with the quality and quick delivery.',
      rating: 5
    }
  ]
};

// 3. Generate 16 to 19 reviews per product with dates in the last 3 months
const allGeneratedReviews = [];
const now = Date.now(); // Current date: Nov 17, 2026

let revCounter = 200;

PRODUCTS.forEach((product, prodIndex) => {
  // Target 16 to 19 reviews per product
  const reviewsCount = Math.floor(Math.random() * 4) + 16; // 16, 17, 18, or 19 reviews
  const templates = CATEGORY_TEMPLATES[product.category] || CATEGORY_TEMPLATES['Pendants & Chains'];
  
  // Create an array of random daysAgo between 1 and 88 days (August to November 2026)
  const daysList = [];
  for (let i = 0; i < reviewsCount; i++) {
    // Generate daysAgo spread across 1 to 88 days
    const daysAgo = Math.floor(Math.random() * 88) + 1;
    daysList.push(daysAgo);
  }
  // Sort days ascending so reviews can be ordered by date descending
  daysList.sort((a, b) => a - b);

  for (let r = 0; r < reviewsCount; r++) {
    revCounter++;
    const daysAgo = daysList[r];
    
    // Exact timestamp
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const createdAt = now - (daysAgo * 86400000 + randomHours * 3600000 + randomMinutes * 60000);
    const revDateObj = new Date(createdAt);
    
    const dayStr = String(revDateObj.getDate()).padStart(2, '0');
    const monthStr = MONTH_NAMES[revDateObj.getMonth()];
    const yearStr = revDateObj.getFullYear();
    const formattedDate = `${dayStr} ${monthStr} ${yearStr}`;

    // Select reviewer
    const reviewerIndex = (prodIndex * 19 + r) % femaleReviewers.length;
    const reviewer = femaleReviewers[reviewerIndex];

    // Select template
    const templateIndex = (r + prodIndex) % templates.length;
    const template = templates[templateIndex];

    // Rating: 90% chance of 5 stars, 10% chance of 4 stars
    const rating = Math.random() < 0.90 ? 5 : 4;

    // Attach product photo on ~25% of reviews for realism
    const hasPhoto = r % 4 === 1;
    const images = hasPhoto && product.image ? [product.image] : [];

    // Random likes count between 2 and 24
    const likesCount = Math.floor(Math.random() * 22) + 2;

    allGeneratedReviews.push({
      id: `rev_in_${product.id}_${r + 1}`,
      productId: product.id,
      productName: product.name,
      customerName: reviewer.name,
      handle: reviewer.handle,
      rating: rating,
      title: template.title,
      comment: template.comment,
      images: images,
      verifiedBuyer: true,
      status: 'published',
      createdAt: createdAt,
      date: formattedDate,
      isCustomMerchant: false,
      likesCount: likesCount
    });
  }
});

console.log(`Generated ${allGeneratedReviews.length} total reviews across ${PRODUCTS.length} products.`);

// Verify distribution
const countPerProduct = {};
allGeneratedReviews.forEach(r => {
  countPerProduct[r.productId] = (countPerProduct[r.productId] || 0) + 1;
});
console.log('Sample counts per product:', Object.entries(countPerProduct).slice(0, 6));

// Check date range
const minTimestamp = Math.min(...allGeneratedReviews.map(r => r.createdAt));
const maxTimestamp = Math.max(...allGeneratedReviews.map(r => r.createdAt));
console.log('Oldest review date:', new Date(minTimestamp).toDateString());
console.log('Newest review date:', new Date(maxTimestamp).toDateString());

// Write to src/data/productReviewsData.js
const outPath = path.join(__dirname, '../src/data/productReviewsData.js');
const fileContent = `/**
 * Curated Authentic Customer Reviews for Scoop Storey Products
 * Verified Indian female customer reviews with random timestamps spread across the last 3 months.
 * Generated for 100% genuine social proof on product detail pages and store testimonials.
 */

export const INITIAL_PRODUCT_REVIEWS = ${JSON.stringify(allGeneratedReviews, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Successfully written to ${outPath}`);
