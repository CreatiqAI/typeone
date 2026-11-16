import fs from 'fs';
import path from 'path';

export interface ProductItem {
  id: string;
  name: string;
  partType: string;
  brand: string;
  carModel: string;
  sku: string;
  code: string;
  phase: 'Phase 1: Comfort' | 'Phase 2: Stability' | 'Phase 3: Performance';
  materialSpec: string;
  mountingPoints: number;
  image: string;
  featured: boolean;
  inStock: boolean;
}

export interface EngineeringPhase {
  id: string;
  phaseNumber: string;
  title: string;
  subtitle: string;
  components: string[];
  description: string;
  benefits: string[];
  handlingScore: number;
  comfortScore: number;
  rigidityScore: number;
  diagramImage: string;
}

export interface WarrantyRegistration {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  carBrand: string;
  carModel: string;
  productSku: string;
  serialOrInvoice: string;
  dealerName: string;
  installDate: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  createdAt: string;
}

export interface LeadInquiry {
  id: string;
  type: 'Dealer Application' | 'Vehicle Fitment Inquiry' | 'General Support';
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  vehicleOrLocation: string;
  message: string;
  status: 'New' | 'Contacted' | 'Partner Approved';
  createdAt: string;
}

export interface SiteConfig {
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    stats: { value: string; label: string }[];
  };
  about: {
    establishedYear: string;
    headline: string;
    description: string;
    highlights: {
      title: string;
      spec: string;
      description: string;
    }[];
  };
  engineering: {
    headline: string;
    subheadline: string;
    strutTubeThickness: string;
    antiRollBarThickness: string;
    bracketPlateThickness: string;
    installationNote: string;
  };
  contact: {
    companyLegalName: string;
    address: string;
    phoneOffice: string;
    phoneMobile: string;
    whatsappNumber: string;
    email: string;
    hoursWeekday: string;
    hoursSaturday: string;
    hoursSunday: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
  };
  seo: {
    siteTitle: string;
    metaDescription: string;
    announcementBanner: string;
    showAnnouncement: boolean;
  };
}

export interface CMSDatabase {
  siteConfig: SiteConfig;
  phases: EngineeringPhase[];
  products: ProductItem[];
  supportedBrands: { name: string; logo: string; vehicleCount: number }[];
  warranties: WarrantyRegistration[];
  inquiries: LeadInquiry[];
  lastUpdated: string;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'cms-db.json');

export const INITIAL_CMS_DATA: CMSDatabase = {
  lastUpdated: new Date().toISOString(),
  siteConfig: {
    hero: {
      badge: 'MALAYSIA REGISTERED INDUSTRIAL DESIGN • EST. 2017',
      titleLine1: "MALAYSIA'S PREMIER MULTI-POINT",
      titleHighlight: 'CHASSIS STABLE BAR MANUFACTURER',
      subtitle:
        'Engineered under one roof in Kuala Lumpur—from R&D and CAD stress analysis to precision CNC & laser manufacturing. Eliminate body roll, distribute chassis stress evenly, and transform cornering stability with 100% plug-and-play installation and a Lifetime Warranty.',
      primaryCtaText: 'Find Bars For Your Vehicle',
      secondaryCtaText: 'Become an Authorized Dealer',
      stats: [
        { value: '2017', label: 'Established in KL' },
        { value: '30+ Makes', label: 'JDM, Conti, EV & Local' },
        { value: '4.5mm', label: 'High-Tensile Bracket Steel' },
        { value: 'Lifetime', label: 'Official Product Warranty' },
      ],
    },
    about: {
      establishedYear: '2017',
      headline: 'Complete In-House Suspension Engineering: Design, R&D to Manufacturing',
      description:
        'Established in 2017, TYPE ONE STABLE BAR has rapidly risen to become Malaysia’s premier manufacturer of multi-point chassis-strengthening bars. Unlike conventional 2-point bars, TYPE ONE multi-point stable bars distribute torsional stress evenly across the chassis without compromising cabin comfort or requiring any welding.',
      highlights: [
        {
          title: 'Screened High-Grade Steel',
          spec: '1.4mm–1.6mm Oval Tubes / 16–28mm Solid Steel',
          description:
            'Strut bars use precision hollow steel and oval tubes (1.4mm–1.6mm wall), while Anti-Roll Bars use solid spring steel (16mm–28mm) with 4.3mm–4.5mm steel mounting brackets.',
        },
        {
          title: 'Registered Industrial Design',
          spec: '100% Plug & Play • Zero Welding Required',
          description:
            'Protected by registered industrial design in Malaysia. Every bar bolts directly into factory OEM chassis mounting points—preserving your vehicle structural integrity.',
        },
        {
          title: 'Multi-Point Stress Distribution',
          spec: 'Neutralizes Impact & Chassis Twist',
          description:
            'When entering a fast corner or hitting uneven tarmac, weight transfer twists the monocoque. TYPE ONE multi-point geometry locks suspension towers and subframes into a unified rigid cage.',
        },
        {
          title: 'Backed by Lifetime Warranty',
          spec: 'Online Serial & Invoice Verification',
          description:
            'Every genuine TYPE ONE stable bar comes with a Lifetime Structural Warranty upon online registration through our official portal.',
        },
      ],
    },
    engineering: {
      headline: 'Car Chassis Knowledge & The 3-Phase Upgrade Architecture',
      subheadline:
        'Whether you drive a daily family SUV, a high-torque EV, or a track-focused hot hatch, our modular 3-Phase chassis system lets you tune rigidity progressively.',
      strutTubeThickness: '1.4mm – 1.6mm High-Tensile Hollow Oval Steel',
      antiRollBarThickness: '16mm – 28mm Cold-Formed Solid Steel',
      bracketPlateThickness: '4.3mm – 4.5mm Laser-Cut Steel Plates',
      installationNote: '100% Bolt-On OEM Chassis Fitment (No Cutting or Welding)',
    },
    contact: {
      companyLegalName: 'TYPE ONE STABLE BAR (Bluetact Sdn Bhd)',
      address: 'No. 2, Jalan Ida 1b, Industrial Desa Aman, 52200 Kuala Lumpur, Malaysia',
      phoneOffice: '+603-6277 3028',
      phoneMobile: '+6016-206 3368',
      whatsappNumber: '60162063368',
      email: 'typeone.info@gmail.com',
      hoursWeekday: 'Monday – Friday: 9:00 AM – 6:00 PM',
      hoursSaturday: 'Saturday: 9:00 AM – 3:00 PM',
      hoursSunday: 'Sunday & Public Holidays: Closed',
      facebookUrl: 'https://www.facebook.com/typeonestablebar',
      instagramUrl: 'https://www.instagram.com/typeone_stablebar',
      youtubeUrl: 'https://www.youtube.com/@typeonestablebar',
    },
    seo: {
      siteTitle: "TYPE ONE Malaysia | Multi-Point Strut Bar & Chassis Strengthening Manufacturer",
      metaDescription:
        "Malaysia's leading manufacturer of multi-point strut bars, anti-roll bars, lower bars & camber kits. Registered industrial design, 100% bolt-on, lifetime warranty.",
      announcementBanner:
        'NEW 2026 FITMENTS RELEASED: Jetour Dashing, iCAUR V23 EV, Denza D9, Xpeng G6, BYD Seal & Honda Civic FL5 Type R — Inquire for Dealer & Retail Fitment!',
      showAnnouncement: true,
    },
  },
  phases: [
    {
      id: 'phase-1',
      phaseNumber: 'PHASE 01',
      title: 'Comfort & Daily Stability',
      subtitle: 'Front Strut Bar + Rear Anti-Roll Bar',
      components: ['Front Multi-Point Strut Bar', 'Rear Solid Anti-Roll Bar'],
      description:
        'The essential foundation for daily drivers and family MPVs/SUVs. Connecting the front strut towers prevents front-end flex under braking and turn-in, while the solid rear anti-roll bar dramatically reduces body sway during highway lane changes and cornering.',
      benefits: [
        'Eliminates boat-like body roll on highways and roundabouts',
        'Maintains 100% factory ride comfort with zero harshness',
        'Reduces uneven tire wear by keeping tread flat on the tarmac',
      ],
      handlingScore: 78,
      comfortScore: 98,
      rigidityScore: 72,
      diagramImage: 'https://typeone.com.my/wp-content/uploads/2024/04/front-strut-bar-e1712632625309.webp',
    },
    {
      id: 'phase-2',
      phaseNumber: 'PHASE 02',
      title: 'Enhanced Subframe Stability',
      subtitle: 'Front Lower Bar + Middle Lower Bar + Rear Lower Bar',
      components: ['Front 4-Point Lower Bar', 'Middle 4/6-Point Lower Bar', 'Rear Lower Tie Bar'],
      description:
        'Reinforces the underbody subframe tunnel where torsional twist is highest. By tying together the front crossmember, middle chassis rails, and rear trailing arms, Phase 2 keeps the entire floorpan planted over undulating roads.',
      benefits: [
        'Locks front and rear subframes against lateral deflection',
        'Sharper steering feedback and mid-corner composure',
        'Neutralizes side-impact and uneven road shock across the floorpan',
      ],
      handlingScore: 90,
      comfortScore: 92,
      rigidityScore: 88,
      diagramImage: 'https://typeone.com.my/wp-content/uploads/2024/04/middle-lower-bar.webp',
    },
    {
      id: 'phase-3',
      phaseNumber: 'PHASE 03',
      title: 'Maximum Track & Performance Rigidity',
      subtitle: 'Complete Full-Set Multi-Point Bar Architecture',
      components: [
        'Full Strut & Anti-Roll Suite',
        'Complete Underbody Lower Matrix',
        'Side Bars, Rear Anti-Crash Bar & Camber/Toe Kits',
      ],
      description:
        'Engineered for spirited drivers and high-output EVs/Turbos desiring race-car-like chassis precision. Combines upper tower bracing, full underbody triangulation, side impact bars, and adjustable camber/toe arms for total alignment mastery.',
      benefits: [
        'Maximum torsional rigidity across all 3 vehicle axes',
        'Eliminates understeer and oversteer caused by chassis deformity',
        'Precision wheel alignment control under extreme cornering loads',
      ],
      handlingScore: 99,
      comfortScore: 86,
      rigidityScore: 99,
      diagramImage: 'https://typeone.com.my/wp-content/uploads/2024/04/full-set-car.webp',
    },
  ],
  supportedBrands: [
    { name: 'Honda', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Toyota.webp', vehicleCount: 42 },
    { name: 'Toyota', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Toyota.webp', vehicleCount: 38 },
    { name: 'Perodua', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Perodua.webp', vehicleCount: 18 },
    { name: 'Proton', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/proton.webp', vehicleCount: 22 },
    { name: 'Jetour', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Chery.webp', vehicleCount: 11 },
    { name: 'Chery', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Chery.webp', vehicleCount: 14 },
    { name: 'BMW', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/BMW.webp', vehicleCount: 24 },
    { name: 'Mercedes', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Mercedes.webp', vehicleCount: 19 },
    { name: 'Mazda', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Mazda.webp', vehicleCount: 16 },
    { name: 'Volkswagen', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/volkswagen.webp', vehicleCount: 15 },
    { name: 'Tesla', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Tesla.webp', vehicleCount: 8 },
    { name: 'Porsche', logo: 'https://typeone.com.my/wp-content/uploads/2024/03/Porsche.webp', vehicleCount: 6 },
  ],
  products: [
    {
      id: 'prod-9559',
      name: 'Front Strut Bar — Jetour Dashing 22Y',
      partType: 'Front Strut Bar',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-FS2-01069',
      code: 'FS2-01069',
      phase: 'Phase 1: Comfort',
      materialSpec: '1.6mm High-Tensile Oval Steel Tube + 4.5mm Brackets',
      mountingPoints: 2,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-9562',
      name: 'Rear Anti-Roll Bar (22mm) — Jetour Dashing 22Y',
      partType: 'Rear Anti-Roll Bar',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-RAR22-01070RB',
      code: 'RAR22-01070RB',
      phase: 'Phase 1: Comfort',
      materialSpec: '22mm Cold-Formed Solid Spring Steel',
      mountingPoints: 2,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/2-Rear-Anti-Roll-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-9565',
      name: 'Front Lower 4-Point Bar — Jetour Dashing 22Y',
      partType: 'Front Lower Bar',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-FL4-01071',
      code: 'FL4-01071',
      phase: 'Phase 2: Stability',
      materialSpec: '1.6mm Hollow Steel Multi-Point Subframe Brace',
      mountingPoints: 4,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/3-Front-Lower-Bar-01071-Jetour-Dashing-22Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-9574',
      name: 'Middle Lower 6-Point Bar — Jetour Dashing 22Y',
      partType: 'Middle Lower Bar',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-ML6-01074P',
      code: 'ML6-01074P',
      phase: 'Phase 2: Stability',
      materialSpec: '1.6mm Multi-Point Oval Steel Chassis Matrix',
      mountingPoints: 6,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/4-Middle-Lower-Bar-01074P-Jetour-Dashing-22Y-BAR.png',
      featured: false,
      inStock: true,
    },
    {
      id: 'prod-9577',
      name: 'Rear Lower 4-Point Bar — Jetour Dashing 22Y',
      partType: 'Rear Lower Bar',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-RL4-00918P',
      code: 'RL4-00918P',
      phase: 'Phase 2: Stability',
      materialSpec: '1.6mm Hollow Steel Subframe Reinforcement',
      mountingPoints: 4,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/5-Rear-Lower-Bar-00918P-Jetour-Dashing-22Y-BAR.png',
      featured: false,
      inStock: true,
    },
    {
      id: 'prod-9586',
      name: 'Rear Adjustable Camber Kit — Jetour Dashing 22Y',
      partType: 'Camber Kit',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-OCK4-01078P',
      code: 'OCK4-01078P',
      phase: 'Phase 3: Performance',
      materialSpec: 'Forged Alloy Steel + Heavy-Duty Hardened Bushings',
      mountingPoints: 4,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/11-Camber-Kit-Jetour-Dashing-22Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-9592',
      name: 'Rear Anti-Crash Structural Bar — Jetour Dashing 22Y',
      partType: 'Rear Anti Crash Bar',
      brand: 'Jetour',
      carModel: 'Jetour Dashing 22Y',
      sku: 'JD22Y-RBAC-80054',
      code: 'RBAC-80054',
      phase: 'Phase 3: Performance',
      materialSpec: '4.5mm Plate + Heavy-Gauge Impact Beam',
      mountingPoints: 4,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/12-Rear-Anti-Crash-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: false,
      inStock: true,
    },
    {
      id: 'prod-9545',
      name: 'Front Anti-Roll Bar (30mm) — iCAUR V23 (EV) 25Y',
      partType: 'Front Anti-Roll Bar',
      brand: 'iCAUR',
      carModel: 'iCAUR V23 (EV) 25Y',
      sku: 'IV2325Y-FAR30-01241RB',
      code: 'FAR30-01241RB',
      phase: 'Phase 1: Comfort',
      materialSpec: '30mm Heavy-Duty Solid Steel for EV High Torque/Weight',
      mountingPoints: 2,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/6-Front-Anti-Roll-Bar-Icaur-V23-25Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-9548',
      name: 'Adjustable Camber Kit — iCAUR V23 (EV) 25Y',
      partType: 'Camber Kit',
      brand: 'iCAUR',
      carModel: 'iCAUR V23 (EV) 25Y',
      sku: 'IV2325Y-OCK4-01242P',
      code: 'OCK4-01242P',
      phase: 'Phase 3: Performance',
      materialSpec: 'Precision CNC Turnbuckle + Reinforced Bushings',
      mountingPoints: 4,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/11-Camber-Kit-Icaur-V23-25Y-KIT.png',
      featured: false,
      inStock: true,
    },
    {
      id: 'prod-honda-fl5-fs',
      name: 'Multi-Point Front Strut Tower Bar — Honda Civic FL5 Type R 23Y',
      partType: 'Front Strut Bar',
      brand: 'Honda',
      carModel: 'Honda Civic FL5 23Y (TYPE R)',
      sku: 'HCFL5-FS4-00891',
      code: 'FS4-00891',
      phase: 'Phase 1: Comfort',
      materialSpec: '1.6mm Oval Tube 4-Point Tower Brace + 4.5mm Brackets',
      mountingPoints: 4,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-honda-fe-rar',
      name: 'Rear Solid Anti-Roll Bar (20mm) — Honda Civic FE RS e:HEV 22Y',
      partType: 'Rear Anti-Roll Bar',
      brand: 'Honda',
      carModel: 'Honda Civic FE 22Y',
      sku: 'HCFE22-RAR20-00712',
      code: 'RAR20-00712',
      phase: 'Phase 1: Comfort',
      materialSpec: '20mm Solid Spring Steel + Polyurethane Mounts',
      mountingPoints: 2,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/2-Rear-Anti-Roll-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: false,
      inStock: true,
    },
    {
      id: 'prod-toyota-vellfire-full',
      name: 'Middle Lower 6-Point Chassis Brace — Toyota Alphard / Vellfire AGH30/40',
      partType: 'Middle Lower Bar',
      brand: 'Toyota',
      carModel: 'Toyota Vellfire / Alphard',
      sku: 'TV30-ML6-00419',
      code: 'ML6-00419',
      phase: 'Phase 2: Stability',
      materialSpec: '1.6mm Oval Tube MPV Cabin-Stability Frame',
      mountingPoints: 6,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/4-Middle-Lower-Bar-01074P-Jetour-Dashing-22Y-BAR.png',
      featured: true,
      inStock: true,
    },
    {
      id: 'prod-perodua-myvi-fs',
      name: '3-Point Front Strut & Master Cylinder Brace — Perodua Myvi Gen3 (D20N)',
      partType: 'Front Strut Bar',
      brand: 'Perodua',
      carModel: 'Perodua Myvi Gen3 18Y+',
      sku: 'PMG3-FS3-00215',
      code: 'FS3-00215',
      phase: 'Phase 1: Comfort',
      materialSpec: '1.6mm High-Tensile Oval Steel + Brake Stopper',
      mountingPoints: 3,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: false,
      inStock: true,
    },
    {
      id: 'prod-proton-x50-rar',
      name: 'Rear Anti-Roll Sway Bar (22mm) — Proton X50 / X70',
      partType: 'Rear Anti-Roll Bar',
      brand: 'Proton',
      carModel: 'Proton X50 20Y+',
      sku: 'PX50-RAR22-00588',
      code: 'RAR22-00588',
      phase: 'Phase 1: Comfort',
      materialSpec: '22mm Solid Spring Steel + 4.5mm Laser Brackets',
      mountingPoints: 2,
      image: 'https://typeone.com.my/wp-content/uploads/2026/06/2-Rear-Anti-Roll-Bar-Jetour-Dashing-22Y-BAR.png',
      featured: false,
      inStock: true,
    },
  ],
  warranties: [
    {
      id: 'war-1001',
      customerName: 'Ahmad Faiz bin Razak',
      phone: '+6012-389 4412',
      email: 'faiz.razak@gmail.com',
      carBrand: 'Honda',
      carModel: 'Honda Civic FE RS 2023',
      productSku: 'HCFE22-RAR20-00712',
      serialOrInvoice: 'INV-T1-2026-0891',
      dealerName: 'T1 Factory Outlet Desa Aman KL',
      installDate: '2026-10-28',
      status: 'Verified',
      createdAt: '2026-10-29T10:15:00Z',
    },
    {
      id: 'war-1002',
      customerName: 'Jason Lim Wei Kang',
      phone: '+6017-882 1903',
      email: 'jasonlim.wk@outlook.com',
      carBrand: 'Jetour',
      carModel: 'Jetour Dashing 2025',
      productSku: 'JD22Y-FS2-01069',
      serialOrInvoice: 'INV-JB-44210',
      dealerName: 'Apex Motorsport Sunway',
      installDate: '2026-11-10',
      status: 'Pending Review',
      createdAt: '2026-11-11T14:30:00Z',
    },
  ],
  inquiries: [
    {
      id: 'inq-2001',
      type: 'Dealer Application',
      name: 'Kelvin Tan',
      companyName: 'ProTrack Alignment & Suspension Sdn Bhd',
      phone: '+6019-445 9980',
      email: 'kelvin@protrackpenang.com.my',
      vehicleOrLocation: 'Bayan Lepas, Penang',
      message: 'We operate a 6-bay alignment workshop in Penang and want to become an authorized Northern Region dealer for TYPE ONE full sets.',
      status: 'New',
      createdAt: '2026-11-14T09:20:00Z',
    },
    {
      id: 'inq-2002',
      type: 'Vehicle Fitment Inquiry',
      name: 'Syafiq Ridzuan',
      companyName: '',
      phone: '+6013-220 7115',
      email: 'syafiq.r@yahoo.com',
      vehicleOrLocation: 'Toyota Vellfire AGH30',
      message: 'Looking for Phase 1 + Phase 2 package quote including installation at your Desa Aman KL HQ this Saturday.',
      status: 'Contacted',
      createdAt: '2026-11-13T16:45:00Z',
    },
  ],
};

export function getCMSData(): CMSDatabase {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_CMS_DATA, null, 2), 'utf-8');
      return INITIAL_CMS_DATA;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(raw) as CMSDatabase;
  } catch {
    return INITIAL_CMS_DATA;
  }
}

export function saveCMSData(data: CMSDatabase): CMSDatabase {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}
