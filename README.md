# 🧸 Bhaskar Scoop Storey — 3D Kawaii Mystery Scoop Website

> **Official 3D Interactive Web Experience for [@bhaskar_scoopstorey](https://www.instagram.com/bhaskar_scoopstorey/)**  
> *"• Collect Happiness •"*

A modern, stylish, and interactive 3D e-commerce and brand showcase for **Bhaskar Scoop Storey**, bringing the sensory delight of Kawaii mystery scoops, faceted acrylic charms, and ASMR packaging directly to the web.

![Scoop Storey Preview](public/images/deluxe-giftbox.jpg)

---

## ✨ Key Features

- **🌟 Interactive 3D Hero Scene (Three.js)**:
  - Real-time procedural 3D charms (Kawaii Gummy Bears, Faceted Glass Hearts, Puffy 5-Point Stars, Iridescent Moon Pearls, Gemstones).
  - Floating reflective rose-gold scoop spoon.
  - Full raycasting: Hover for spring bounce, click for 360° flip animation with tactile chime feedback.
  - Dynamic mouse/gyroscope parallax camera movement.

- **🥄 The 3D Virtual Scoop Machine**:
  - Interactive scoop simulator with 4 tiers: *Baby Bear*, *Starlight Mystery*, *Royal Deluxe*, and *Bhaskar's Vault Gold Scoop*.
  - Live 3D scoop dip and haul animation with confetti bursts (`canvas-confetti`).
  - Generated loot breakdown with rarity scoring (*Common*, *Rare*, *Epic*, *Legendary*).
  - One-click "Add This Exact Haul to Bag".

- **🔍 360° Real-time 3D Charm Inspector**:
  - Drag to rotate charms 360° in real-time WebGL.
  - Switch charm specimens and test custom pastel glaze pigments on the fly.

- **🛍️ The Scoop Menu & E-Commerce Catalog**:
  - Categorized product filters with custom editorial photography.
  - Badges indicating "Eligible for IG Reel packing".

- **📱 Instagram Reels & ASMR Lounge**:
  - Vertical phone-screen styled video player showcasing viral packing ASMR.
  - "Film My Scoop on Instagram" form linking customer orders to upcoming Reels.

- **🎧 Tactile ASMR Sound Engine (Web Audio API)**:
  - Synthesizes clicks, charm rattles, scoop swooshes, and celebratory chords with zero latency.
  - Toggleable mute switch in navbar.

- **🌗 Dual Theme Engine**:
  - *Pastel Cloud Dream* (Light Mode) & *Midnight Neon Candy* (Dark Mode).

- **🛒 Glassmorphic Slide-Out Cart**:
  - Dynamic Free Shipping progress bar (unlocks at ₹999 / $35).
  - Promo code discounts (`SCOOP10`, `HAPPINESS`).
  - Direct Instagram DM order generator + Simulated Instant Checkout.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **3D Graphics**: Three.js (WebGL, PBR MeshPhysicalMaterials, procedural geometries)
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism & Neumorphic Design System
- **Icons**: Lucide React + Custom Instagram SVG
- **Audio**: Web Audio API Synthesizer
- **Effects**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/tanusunejapfc-source/scoop-storey.git

# Enter project directory
cd scoop-storey

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

The optimized static build will be output to the `dist/` directory.

---

## 📸 Socials

- **Instagram**: [@bhaskar_scoopstorey](https://www.instagram.com/bhaskar_scoopstorey/)
- **Slogan**: Collect Happiness 🎀
