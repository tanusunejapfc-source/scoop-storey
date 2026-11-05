// Official Postal PIN Code Auto-Detection API for India

const STATE_MAPPINGS = {
  'delhi': 'Delhi NCR',
  'new delhi': 'Delhi NCR',
  'nct of delhi': 'Delhi NCR',
  'jammu and kashmir': 'Jammu & Kashmir',
  'jammu & kashmir': 'Jammu & Kashmir',
  'orissa': 'Odisha',
  'pondicherry': 'Puducherry',
  'uttaranchal': 'Uttarakhand'
};

export async function lookupPincode(pincode) {
  const cleanPin = String(pincode).replace(/\D/g, '').slice(0, 6);
  if (cleanPin.length !== 6) {
    return { success: false, error: 'PIN Code must be 6 digits' };
  }

  // Primary API: Official India Post API (Free, open, complete)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const rawCity = po.District || po.Division || po.Block || po.Name || '';
        const rawState = po.State || '';

        const matchedState = normalizeState(rawState);

        return {
          success: true,
          city: formatCity(rawCity),
          state: matchedState,
          district: po.District || '',
          source: 'IndiaPost'
        };
      }
    }
  } catch (err) {
    console.warn('Primary PIN API fetch failed, trying fallback:', err);
  }

  // Fallback API: Zippopotam
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.zippopotam.us/in/${cleanPin}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        const rawCity = place['place name'] || '';
        const rawState = place.state || '';

        return {
          success: true,
          city: formatCity(rawCity),
          state: normalizeState(rawState),
          source: 'Zippopotam'
        };
      }
    }
  } catch (err) {
    console.warn('Fallback PIN API failed:', err);
  }

  return { success: false, error: 'Could not auto-detect location' };
}

function normalizeState(raw) {
  if (!raw) return 'Maharashtra';
  const clean = raw.trim().toLowerCase();
  if (STATE_MAPPINGS[clean]) {
    return STATE_MAPPINGS[clean];
  }

  // Case insensitive match against common Indian states
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 
    'Chhattisgarh', 'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 
    'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 
    'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const found = states.find(s => s.toLowerCase() === clean || clean.includes(s.toLowerCase()));
  return found || raw;
}

function formatCity(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

