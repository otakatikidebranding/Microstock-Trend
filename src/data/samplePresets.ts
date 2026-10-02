export interface SamplePreset {
  id: string;
  name: string;
  category: string;
  assetType: '3d' | 'vector' | 'photo' | 'illustration';
  description: string;
  notes: string;
  dataUrl: string;
}

// Crisp inline SVGs converted to data URLs for instant reference testing
const svgAiTeam = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgGrad)" />
  <!-- Isometric Grid Plane -->
  <g opacity="0.25">
    <path d="M400,100 L750,300 L400,500 L50,300 Z" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
    <path d="M400,160 L680,320 L400,480 L120,320 Z" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="6,6"/>
  </g>
  <!-- Futuristic 3D Desk & Tech Nodes -->
  <g transform="translate(400, 300)">
    <!-- Central Hologram -->
    <ellipse cx="0" cy="-20" rx="120" ry="60" fill="url(#glow)" opacity="0.4" filter="blur(10px)"/>
    <polygon points="0,-120 70,-40 0,40 -70,-40" fill="url(#cyanGrad)" opacity="0.85"/>
    <polygon points="0,-120 70,-40 0,-10 -70,-40" fill="#7dd3fc" opacity="0.6"/>
    <!-- Floating Charts & UI Cards -->
    <rect x="-180" y="-140" width="80" height="50" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2" opacity="0.9"/>
    <line x1="-165" y1="-120" x2="-120" y2="-120" stroke="#38bdf8" stroke-width="3"/>
    <line x1="-165" y1="-105" x2="-140" y2="-105" stroke="#94a3b8" stroke-width="2"/>
    
    <rect x="100" y="-130" width="90" height="55" rx="8" fill="#1e293b" stroke="#a855f7" stroke-width="2" opacity="0.9"/>
    <circle cx="125" cy="-105" r="12" fill="#a855f7" opacity="0.6"/>
    <line x1="145" y1="-110" x2="175" y2="-110" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="145" y1="-100" x2="165" y2="-100" stroke="#94a3b8" stroke-width="2"/>

    <!-- 3D Avatars / People Team -->
    <!-- Person Left -->
    <circle cx="-120" cy="20" r="22" fill="#fbcfe8"/>
    <path d="M-145,70 C-145,40 -95,40 -95,70 Z" fill="#3b82f6"/>
    <!-- Person Right -->
    <circle cx="120" cy="20" r="22" fill="#fed7aa"/>
    <path d="M95,70 C95,40 145,40 145,70 Z" fill="#10b981"/>
    <!-- Person Center Leader -->
    <circle cx="0" cy="50" r="26" fill="#fde68a"/>
    <path d="M-30,110 C-30,75 30,75 30,110 Z" fill="#8b5cf6"/>
  </g>
  <!-- Text copy space placeholder notice -->
  <text x="60" y="80" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="2">TOP SELLER MOCKUP: 3D ISOMETRIC AI WORKPLACE</text>
</svg>`;

const svgRamadan = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="50%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#065f46" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#nightSky)" />
  <!-- Elegant Arabic Arch Frame -->
  <path d="M150,600 L150,260 C150,140 400,60 400,60 C400,60 650,140 650,260 L650,600" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.6"/>
  
  <!-- Crescent Moon with Stars -->
  <g transform="translate(400, 200)">
    <path d="M-30,-70 C30,-70 80,-20 80,40 C80,100 30,150 -30,150 C20,130 50,80 50,40 C50,0 20,-50 -30,-70 Z" fill="url(#goldGrad)" />
    <!-- 8-pointed star -->
    <path d="M-60,0 L-45,-15 L-30,0 L-45,15 Z M-45,-20 L-45,20 M-65,0 L-25,0" stroke="#fef08a" stroke-width="2" fill="#fef08a"/>
    <circle cx="80" cy="-60" r="3" fill="#fef08a"/>
    <circle cx="-120" cy="-80" r="2.5" fill="#fef08a"/>
    <circle cx="140" cy="40" r="3" fill="#fef08a"/>
  </g>

  <!-- Hanging Lanterns (Fanous) -->
  <g transform="translate(260, 180)">
    <line x1="0" y1="-120" x2="0" y2="0" stroke="#eab308" stroke-width="1.5"/>
    <polygon points="0,0 18,25 -18,25" fill="url(#goldGrad)"/>
    <rect x="-15" y="25" width="30" height="35" rx="3" fill="#047857" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="42" r="6" fill="#fef08a" opacity="0.9"/>
    <polygon points="-18,60 18,60 0,75" fill="url(#goldGrad)"/>
  </g>
  <g transform="translate(540, 180)">
    <line x1="0" y1="-120" x2="0" y2="0" stroke="#eab308" stroke-width="1.5"/>
    <polygon points="0,0 18,25 -18,25" fill="url(#goldGrad)"/>
    <rect x="-15" y="25" width="30" height="35" rx="3" fill="#047857" stroke="url(#goldGrad)" stroke-width="2"/>
    <circle cx="0" cy="42" r="6" fill="#fef08a" opacity="0.9"/>
    <polygon points="-18,60 18,60 0,75" fill="url(#goldGrad)"/>
  </g>

  <!-- Mosque Silhouette Background -->
  <path d="M180,600 L180,480 C180,460 210,440 230,480 L230,600 L320,600 C320,420 400,380 400,380 C400,380 480,420 480,600 L570,600 C590,440 620,460 620,480 L620,600 Z" fill="#064e3b" opacity="0.8"/>
  <text x="60" y="80" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="2">SEASONAL VECTOR: MODERN RAMADAN KAREEM GREETING</text>
</svg>`;

const svgGreenEnergy = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="70%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#f0fdf4" />
    </linearGradient>
    <linearGradient id="hill1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>
    <linearGradient id="solarBlue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#skyGrad)" />
  
  <!-- Sun & Clean Energy Ray -->
  <circle cx="680" cy="140" r="55" fill="#facc15" opacity="0.85"/>
  <circle cx="680" cy="140" r="75" fill="#fef08a" opacity="0.3"/>

  <!-- Rolling Hills -->
  <path d="M-50,450 Q200,320 500,420 T850,380 L850,600 L-50,600 Z" fill="#166534" opacity="0.7"/>
  <path d="M-50,490 Q250,390 600,470 T850,450 L850,600 L-50,600 Z" fill="url(#hill1)" />

  <!-- Wind Turbines -->
  <g transform="translate(180, 220)">
    <line x1="0" y1="0" x2="0" y2="240" stroke="#f8fafc" stroke-width="5"/>
    <circle cx="0" cy="0" r="7" fill="#cbd5e1"/>
    <line x1="0" y1="0" x2="0" y2="-80" stroke="#f8fafc" stroke-width="4"/>
    <line x1="0" y1="0" x2="69" y2="40" stroke="#f8fafc" stroke-width="4"/>
    <line x1="0" y1="0" x2="-69" y2="40" stroke="#f8fafc" stroke-width="4"/>
  </g>
  <g transform="translate(320, 260) scale(0.75)">
    <line x1="0" y1="0" x2="0" y2="240" stroke="#f8fafc" stroke-width="5"/>
    <circle cx="0" cy="0" r="7" fill="#cbd5e1"/>
    <line x1="0" y1="0" x2="0" y2="-80" stroke="#f8fafc" stroke-width="4"/>
    <line x1="0" y1="0" x2="69" y2="40" stroke="#f8fafc" stroke-width="4"/>
    <line x1="0" y1="0" x2="-69" y2="40" stroke="#f8fafc" stroke-width="4"/>
  </g>

  <!-- Solar Panels in Foreground -->
  <g transform="translate(440, 460)">
    <polygon points="0,40 160,-20 220,10 60,70" fill="url(#solarBlue)" stroke="#e2e8f0" stroke-width="2"/>
    <line x1="40" y1="25" x2="100" y2="55" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="80" y1="10" x2="140" y2="40" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="120" y1="-5" x2="180" y2="25" stroke="#93c5fd" stroke-width="1.5"/>

    <polygon points="120,70 280,10 340,40 180,100" fill="url(#solarBlue)" stroke="#e2e8f0" stroke-width="2"/>
    <line x1="160" y1="55" x2="220" y2="85" stroke="#93c5fd" stroke-width="1.5"/>
    <line x1="200" y1="40" x2="260" y2="70" stroke="#93c5fd" stroke-width="1.5"/>
  </g>
  <text x="60" y="80" fill="#047857" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="2">COMMERCIAL VECTOR: SUSTAINABLE RENEWABLE CLEAN ENERGY</text>
</svg>`;

const svgCyberTech = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="cyberBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030712" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#cyberBg)" />
  
  <!-- Cyber Matrix Lines -->
  <g opacity="0.3" stroke="#0ea5e9" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="600" stroke-dasharray="8,4"/>
    <line x1="250" y1="0" x2="250" y2="600" stroke-dasharray="4,8"/>
    <line x1="550" y1="0" x2="550" y2="600" stroke-dasharray="6,6"/>
    <line x1="700" y1="0" x2="700" y2="600" stroke-dasharray="10,4"/>
    <line x1="0" y1="180" x2="800" y2="180"/>
    <line x1="0" y1="420" x2="800" y2="420"/>
  </g>

  <!-- Big Glowing Cyber Security Shield -->
  <g transform="translate(400, 290)">
    <path d="M0,-140 C80,-140 140,-120 140,-50 C140,70 50,140 0,170 C-50,140 -140,70 -140,-50 C-140,-120 -80,-140 0,-140 Z" fill="url(#shieldGrad)" opacity="0.85" stroke="#38bdf8" stroke-width="4"/>
    <path d="M0,-115 C60,-115 110,-100 110,-40 C110,55 40,115 0,140 C-40,115 -110,55 -110,-40 C-110,-100 -60,-115 0,-115 Z" fill="#0f172a" opacity="0.9"/>
    <!-- Padlock inside shield -->
    <rect x="-35" y="-10" width="70" height="55" rx="10" fill="#38bdf8"/>
    <path d="M-22,-10 L-22,-35 C-22,-50 22,-50 22,-35 L22,-10" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round"/>
    <circle cx="0" cy="15" r="7" fill="#0f172a"/>
    <polygon points="-2,15 2,15 4,30 -4,30" fill="#0f172a"/>
  </g>

  <text x="60" y="80" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="2">TECH ILLUSTRATION: CYBERSECURITY &amp; DATA PRIVACY</text>
</svg>`;

const toDataUrl = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "sample-ai-team",
    name: "3D Isometric AI Workplace",
    category: "Technology & Business",
    assetType: "3d",
    description: "Render 3D isometric tim korporat berkolaborasi dengan antarmuka hologram kecerdasan buatan (AI).",
    notes: "Fokus analisis untuk Adobe Stock kategori Enterprise AI & Hybrid Workspace.",
    dataUrl: toDataUrl(svgAiTeam),
  },
  {
    id: "sample-ramadan",
    name: "Ramadan Kareem Flat Luxury",
    category: "Seasonal & Cultural",
    assetType: "vector",
    description: "Vektor islami kontemporer dengan ornamen bulan sabit emas, lentera fanous, dan siluet masjid.",
    notes: "Persiapan event musiman Q1 untuk banner marketing, kartu ucapan, dan social media kit.",
    dataUrl: toDataUrl(svgRamadan),
  },
  {
    id: "sample-green-energy",
    name: "Sustainable Clean Energy",
    category: "Environment & ESG",
    assetType: "vector",
    description: "Lansekap perbukitan hijau dengan turbin angin modern dan solar panel ramah lingkungan.",
    notes: "Komersial untuk laporan ESG perusahaan, edukasi transisi energi hijau, dan artikel lingkungan.",
    dataUrl: toDataUrl(svgGreenEnergy),
  },
  {
    id: "sample-cyber-tech",
    name: "Cybersecurity Shield Shield",
    category: "Cybersecurity & Fintech",
    assetType: "illustration",
    description: "Ilustrasi perisai keamanan digital, gembok enkripsi data, dan grid matriks keamanan siber.",
    notes: "Kategori top buyer di Shutterstock dan Adobe Stock untuk software SaaS B2B.",
    dataUrl: toDataUrl(svgCyberTech),
  },
];
