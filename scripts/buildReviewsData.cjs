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

// 3. ENGLISH TEMPLATES
const CATEGORY_TEMPLATES_EN = {
  'Mystery Scoops': [
    {
      title: 'Saw my scoop packed on Instagram Reels! 💖',
      comment: 'I ordered the scoop after watching their viral reel and honestly the unboxing was so magical! The charms have proper weight, vibrant colors, and the extra free stickers and candy made my day.',
      rating: 5
    },
    {
      title: 'Got 3 rare charms and the cutest bear keychain! ✨',
      comment: 'Tanu genuinely scoops generously! I was worried I would only get small beads, but I got a gorgeous butterfly charm, faceted crystal, and mini lip oil. Worth every single rupee.',
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
      title: 'Very dainty and pretty 💫',
      comment: 'Chain length is perfect for sitting right below the collarbone. Cute design and feels solid in hand. Very satisfied with my purchase.',
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
      title: 'Gifted this to my sister and she cried happy tears! 🎁',
      comment: 'The pink box presentation and wax seal made it feel so personal. Sister hasn’t taken it off since she opened it.',
      rating: 5
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
      title: 'Doesn’t pinch or pull ankle hairs! 🌸',
      comment: 'Super comfortable to sleep in. The anti-tarnish coating is genuine. Excellent quality from Scoop Storey.',
      rating: 5
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
      title: 'Got so many compliments at college! 💖',
      comment: 'Everyone in my class wanted to know where I bought this pastel wallet. Arrived neatly packaged in protective wrap with zero chemical odor.',
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
    }
  ]
};

// 4. AUTHENTIC HINGLISH TEMPLATES
const CATEGORY_TEMPLATES_HINGLISH = {
  'Mystery Scoops': [
    {
      title: 'Instagram reel dekh ke order kiya tha, sach me bohot pyara hai! 💖',
      comment: 'Maine Big Scoop order kiya tha aur video me packing dekh ke excitement level alag hi tha! Charms bohot heavy aur high quality ke hain, plastic bilkul nahi lagte. Extra stickers aur free candy ke liye thank you Tanu di! 10/10 recommend karungi.',
      rating: 5
    },
    {
      title: 'Bohot zyada cute surprises nikle yaar! ✨',
      comment: 'Honestly mujhe laga tha normal beads aayenge, but itne sundar charms nikle! Teddy bear keychain aur pink lip glaze dono mile. Packaging wax seal ke sath itni premium thi ki dil khush ho gaya.',
      rating: 5
    },
    {
      title: 'Sister ke birthday gift ke liye mangwaya tha, she was screaming! 🎀',
      comment: 'Unboxing ka maza hi alag tha. Pink shredded paper, aesthetic greeting card aur itne sare cute items. Meri behen ko bohot zyada pasand aaya. Ab apne liye bhi ek scoop order karungi!',
      rating: 5
    },
    {
      title: 'Prepaid order tha thoda darr tha but super legit nikla! 🌸',
      comment: 'Order place karte hi WhatsApp pe tracking mil gaya tha aur 3 din me Gurgaon deliver ho gaya. Sare charms ekdum scratchless aur glossy hain. Packaging 100/10!',
      rating: 5
    },
    {
      title: 'ASMR unboxing literally best tha 💕',
      comment: 'Hostel me sab roommates ne milke open kiya, sabko bohot aesthetic laga. Price ke hisab se bohot saara cute stuff mil gaya. Full paisa vasool!',
      rating: 5
    },
    {
      title: 'Rare gold bear charm mil gaya mujhe! 🧸👑',
      comment: 'Maine reel me dekha tha gold bear aur wahi mere parcel me nikla! Itna khush main kabhi kisi parcel se nahi hui. Pure happiness in a box.',
      rating: 5
    },
    {
      title: 'Bohot achi variety aayi parcel me ✨',
      comment: 'Lip gloss, claw clip, stickers aur 8 cute charms! Quality sach me achi hai. Dosto ko bhi recommend kiya hai maine.',
      rating: 4
    }
  ],

  'Pendants & Chains': [
    {
      title: 'Sach me 100% anti-tarnish hai, daily wear kar rahi hu! ✨',
      comment: 'Mujhe Mumbai ke humid weather me imitation jewelry pehanne se neck pe green marks ho jate the, but is chain ke sath bilkul aisa nahi hua! Gym me aur shower me bhi pehana, shine abhi bhi real 18K gold jaisi hai.',
      rating: 5
    },
    {
      title: 'College me sabne pucha kahan se liya! 💖',
      comment: 'Itna dainty aur elegant lagta hai collarbone pe. Simple white shirt ya kurti dono pe bohot aesthetic look deta hai. Clasp bhi bohot strong hai aur chain silky smooth hai.',
      rating: 5
    },
    {
      title: 'Sensitive skin ke liye perfect hai 🌸',
      comment: 'Meri skin bohot jaldi react karti hai fake metal se, but isko 1 month se daily pehan rahi hu zero itching ya redness. Quality sach me top notch hai.',
      rating: 5
    },
    {
      title: 'Real gold jaisi finishing hai, bilkul brassy nahi lagti 🎀',
      comment: 'Warm golden tone hai jo Tanishq ya CaratLane jaisa lagta hai. Price ke hisab se itni premium quality milna impossible hai Instagram pe. Loved it!',
      rating: 5
    },
    {
      title: 'Packaging dekh ke hi premium feel aa gaya 🎁',
      comment: 'Cute pink pouch me aaya aur sath me jewelry care tips bhi the. Wax seal box bohot aesthetic lagta hai. Best gifting option!',
      rating: 5
    },
    {
      title: 'Waterproof test pass ho gaya! 💧✨',
      comment: 'Diwali pe regular use kiya, haath dhote waqt bhi nahi utara. Bilkul dull nahi hua. Full paisa vasool pendant!',
      rating: 5
    },
    {
      title: 'Bohot sundar chain hai, simple aur classy 💫',
      comment: 'Daily wear ke liye best hai. Office me sabhi colleagues ne compliment diya. Delivery Delhi me 3 din me ho gayi thi.',
      rating: 4
    }
  ],

  'Bracelets': [
    {
      title: 'Chhote wrist ke liye perfect adjustable fit hai! 🎀',
      comment: 'Meri wrist bohot patli hai to normal bracelets gir jate hain, but iske extender links bohot helpful hain. Pastel charms bohot pyare lagte hain haath me.',
      rating: 5
    },
    {
      title: 'Buri nazar se protection aur aesthetic look dono! 🧿✨',
      comment: 'Evil eye charm ka enamel work bohot neat hai. Daily office me smartwatch ke sath layer karti hu, bohot classy lagta hai.',
      rating: 5
    },
    {
      title: 'Charms ki quality itni solid hai socha nahi tha 💖',
      comment: 'Kahi se bhi rough edges nahi hain aur kapdo me nahi atakta. Sweet tinkling sound aati hai jab haath hilao. Loved it!',
      rating: 5
    },
    {
      title: 'Photo se bhi zyada sundar laga real me 🌸',
      comment: 'Sunlight me charms itne chamakte hain! Gift wrapping wax seal ke sath aayi thi jo bohot luxury lagti hai. Super happy with purchase.',
      rating: 5
    }
  ],

  'Anklets': [
    {
      title: 'Goa trip pe pehana tha, sea water me bhi fade nahi hua! 🌊✨',
      comment: 'Liquid snake chain bohot smooth hai ankle pe. Na baal khinchte hain na salwar me phasta hai. Bilkul waterproof hai, bilkul tarnish nahi hua!',
      rating: 5
    },
    {
      title: 'Feet pe itna graceful aur minimal look deta hai 💫',
      comment: 'Daily sneakers aur sandals dono ke sath suit karta hai. Shine bohot rich hai aur clasp lock bohot secure hai. Definitely worth buying!',
      rating: 5
    },
    {
      title: 'Pure gold anklet jaisa shine karta hai 💕',
      comment: 'Dainty look hai par chain sturdy hai, chalte waqt tutne ka darr nahi rehta. Packaging bhi bohot cute thi.',
      rating: 5
    }
  ],

  'Eye Masks': [
    {
      title: 'Itna soft hai jaise cloud pe so rahi hu! ☁️😴',
      comment: 'Laptop screen time ke baad aankhon ko itna sukoon milta hai. Light bilkul pass nahi hoti aur elastic band sir dard nahi karta.',
      rating: 5
    },
    {
      title: 'Hostel me late night study lights se bachne ka best jugad 🌙✨',
      comment: 'Roommate late night light on rakhti hai par is mask ke sath pitch dark sleep aati hai. Hair blowout bhi kharab nahi hota.',
      rating: 5
    },
    {
      title: 'Embroidery bohot neat aur kawaii hai 🎀',
      comment: 'Fabric silk jaisa silky aur cooling hai. Travel ke liye bag me carry karna bohot easy hai.',
      rating: 5
    }
  ],

  'Self-Care': [
    {
      title: 'Soda can wet wipes bohot cute aur handy hain! 🥤✨',
      comment: 'College tote bag me aur car me carry karna bohot convenient hai. Wipes dry nahi hote aur fragrance bohot mild aur refreshing hai.',
      rating: 5
    },
    {
      title: 'Nose pore strips ne sare stubborn blackheads nikaal diye! 🌸',
      comment: 'Nose bridge geela karke lagaya aur 15 min baad peel kiya, skin itni clean ho gayi! Bilkul skin peel nahi hoti aur pain bhi nahi hota.',
      rating: 5
    }
  ],

  'Korean wallets and bags': [
    {
      title: 'Puff quilted feel itna soft hai jaise baby pillow! ☁️👛',
      comment: 'Blush pink shade exactly Pinterest aesthetic jaisa hai. 6 cards, cash aur mini lipstick sab fit ho gaya mere small sling bag me.',
      rating: 5
    },
    {
      title: 'Gold zipper bohot smooth hai, bilkul atakta nahi ✨',
      comment: 'Stitching bohot clean hai aur koi cheap smell nahi thi. Quality dekh ke lagta hai 1000+ ka wallet hai.',
      rating: 5
    },
    {
      title: 'College me sabhi ladkiyo ne compliment kiya 🎀',
      comment: 'Itna chic aur compact hai. Daily metro card nikaalna bohot easy ho gaya hai isse.',
      rating: 5
    }
  ],

  'Make up': [
    {
      title: 'Lips pe bilkul chip-chip nahi hota, itna juicy shine! 💄✨',
      comment: 'Glassy reflection deta hai aur lips dry nahi hote. Sweet fruity fragrance hai aur Indian skin tone pe natural pink tint lagta hai.',
      rating: 5
    },
    {
      title: 'Jelly blush ka natural dewy glow bohot natural hai 🌸',
      comment: 'Fingers se easily blend ho jata hai aur base foundation ko disturb nahi karta. College ke liye no-makeup makeup look ke liye best hai.',
      rating: 5
    },
    {
      title: 'Glitter eyeshadow ka zero fallout hai! ✨💖',
      comment: 'Dry hone ke baad bilkul failta nahi. Party lights me aankhein itni chamakti hain, loved the shimmer wand!',
      rating: 5
    }
  ],

  'Soft Toys': [
    {
      title: 'Itna zyada squishy aur soft cuddle buddy hai! 🧸💖',
      comment: 'Fabric microfiber hai to fur bilkul shed nahi hota. Face stitching itni cute hai. Study table pe mera constant partner ban gaya hai.',
      rating: 5
    },
    {
      title: 'Parcel open karke meri choti behen khushi se cheekh padi! 🎀✨',
      comment: 'Pink box packaging bilkul fairytale jaisi thi. Squeeze karne pe wapas shape le leta hai. Best cute gift ever!',
      rating: 5
    }
  ],

  'Key chains': [
    {
      title: 'Floating glitter bear itna mesmerizing lagta hai! 🧸✨',
      comment: 'Scooty aur car keys dono me clip kar liya hai. Sunlight me liquid glitter bohot sundar lagta hai. Metal ring bohot sturdy hai.',
      rating: 5
    },
    {
      title: 'Phone wristlet strap heavy phone ko bhi aaram se sambhalta hai 📱💖',
      comment: 'Cord bohot thick hai to tutne ka darr nahi hai. Haath me latka ke chalna bohot convenient ho gaya hai college me.',
      rating: 5
    }
  ],

  'Hair Accessories': [
    {
      title: 'Finally thick hair ke liye strong grip wala claw clip mila! 🦋✨',
      comment: 'Mere baal bohot heavy aur ghane hain, normal clips tut jate the. Iska spring bohot strong hai aur matte finish baalo ko tightly hold karta hai pura din.',
      rating: 5
    },
    {
      title: 'Cloud scrunchie se baalo me dent bilkul nahi padta ☁️🎀',
      comment: 'Velvet fabric itna gentle hai ki baal khinchte nahi hain. Raat ko bandh ke sone ke baad bhi hair smooth rehta hai.',
      rating: 5
    }
  ]
};

// 5. Generate 16 to 19 reviews per product with dates in the last 3 months
const allGeneratedReviews = [];
const now = Date.now(); // Current date: Nov 17, 2026

let revCounter = 200;
let hinglishCount = 0;
let englishCount = 0;

PRODUCTS.forEach((product, prodIndex) => {
  // Target 16 to 19 reviews per product
  const reviewsCount = Math.floor(Math.random() * 4) + 16; // 16, 17, 18, or 19 reviews
  
  const enTemplates = CATEGORY_TEMPLATES_EN[product.category] || CATEGORY_TEMPLATES_EN['Pendants & Chains'];
  const hiTemplates = CATEGORY_TEMPLATES_HINGLISH[product.category] || CATEGORY_TEMPLATES_HINGLISH['Pendants & Chains'];
  
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

    // Random choice: ~48% Hinglish, ~52% English
    const isHinglish = (r + prodIndex) % 2 === 0;
    if (isHinglish) hinglishCount++;
    else englishCount++;

    const templatePool = isHinglish ? hiTemplates : enTemplates;
    const templateIndex = (r + prodIndex) % templatePool.length;
    const template = templatePool[templateIndex];

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
      language: isHinglish ? 'hinglish' : 'english',
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
console.log(`Language breakdown: ${hinglishCount} Hinglish reviews, ${englishCount} English reviews.`);

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
 * Balanced blend of authentic English and natural Hinglish conversational reviews.
 */

export const INITIAL_PRODUCT_REVIEWS = ${JSON.stringify(allGeneratedReviews, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Successfully written to ${outPath}`);
