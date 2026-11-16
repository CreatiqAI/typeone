'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Wrench,
  Gauge,
  Layers,
  Search,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
  Award,
  Car,
  FileCheck2,
  Building2,
  Lock,
  MessageSquare,
  X,
  Check,
  Filter,
} from 'lucide-react';
import type { CMSDatabase, ProductItem } from '@/lib/cms-store';

const CHASSIS_HOTSPOTS = [
  {
    id: 'Front Strut Bar',
    label: '01 • Front Strut Tower Bar',
    position: 'Upper Engine Bay',
    phase: 'Phase 1: Comfort',
    spec: '1.4mm–1.6mm High-Tensile Oval Steel',
    benefit: 'Ties left & right MacPherson strut towers together to eliminate front-end flex under turn-in and braking.',
    coords: { top: '22%', left: '26%' },
  },
  {
    id: 'Front Lower Bar',
    label: '02 • Front Lower 4-Point Brace',
    position: 'Front Subframe Crossmember',
    phase: 'Phase 2: Stability',
    spec: '4-Point Subframe Triangulation',
    benefit: 'Locks the lower control arm mounting points to maintain precise steering geometry over bumps.',
    coords: { top: '58%', left: '24%' },
  },
  {
    id: 'Middle Lower Bar',
    label: '03 • Middle Lower 4/6-Point Matrix',
    position: 'Central Chassis Tunnel',
    phase: 'Phase 2: Stability',
    spec: 'Multi-Point Floorpan Reinforcement',
    benefit: 'Prevents monocoque twisting between the front cabin and rear axle, especially critical on MPVs and SUVs.',
    coords: { top: '52%', left: '50%' },
  },
  {
    id: 'Rear Anti-Roll Bar',
    label: '04 • Rear Solid Anti-Roll Sway Bar',
    position: 'Rear Suspension Axle',
    phase: 'Phase 1: Comfort',
    spec: '16mm–28mm Cold-Formed Solid Spring Steel',
    benefit: 'Dramatically reduces boat-like body roll during cornering and highway lane changes without stiffening vertical ride comfort.',
    coords: { top: '34%', left: '75%' },
  },
  {
    id: 'Camber Kit',
    label: '05 • Adjustable Camber / Toe Kit & Rear Lower Bar',
    position: 'Rear Multi-Link & Trailing Arm',
    phase: 'Phase 3: Performance',
    spec: 'Forged Steel + 4.5mm Laser Brackets',
    benefit: 'Restores optimal tire contact patch and prevents uneven inner-edge tire wear under hard cornering.',
    coords: { top: '65%', left: '78%' },
  },
];

export default function TypeOneClientPage({ initialData }: { initialData: CMSDatabase }) {
  const [cms, setCms] = useState<CMSDatabase>(initialData);
  const { siteConfig, phases, products, supportedBrands } = cms;

  // Catalog filters
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [selectedPartType, setSelectedPartType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhaseTab, setActivePhaseTab] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState(CHASSIS_HOTSPOTS[0]);
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);

  // Interactive Forms (Warranty & Inquiry)
  const [activeFormTab, setActiveFormTab] = useState<'inquiry' | 'warranty'>('inquiry');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  const [inquiryForm, setInquiryForm] = useState({
    type: 'Vehicle Fitment Inquiry' as 'Dealer Application' | 'Vehicle Fitment Inquiry' | 'General Support',
    name: '',
    companyName: '',
    phone: '',
    email: '',
    vehicleOrLocation: '',
    message: '',
  });

  const [warrantyForm, setWarrantyForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    carBrand: 'Honda',
    carModel: '',
    productSku: '',
    serialOrInvoice: '',
    dealerName: '',
    installDate: new Date().toISOString().slice(0, 10),
  });

  const allBrands = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach((p) => set.add(p.brand));
    supportedBrands.forEach((b) => set.add(b.name));
    return Array.from(set);
  }, [products, supportedBrands]);

  const allPartTypes = useMemo(() => {
    const set = new Set<string>(['All']);
    products.forEach((p) => set.add(p.partType));
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchBrand = selectedBrand === 'All' || item.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchPhase = selectedPhase === 'All' || item.phase === selectedPhase;
      const matchPart =
        selectedPartType === 'All' ||
        item.partType.toLowerCase().includes(selectedPartType.toLowerCase());
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.carModel.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.partType.toLowerCase().includes(q);

      return matchBrand && matchPhase && matchPart && matchQuery;
    });
  }, [products, selectedBrand, selectedPhase, selectedPartType, searchQuery]);

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccessMessage(null);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_inquiry',
          ...inquiryForm,
        }),
      });
      if (res.ok) {
        setFormSuccessMessage(
          'Your inquiry has been logged in the TYPE ONE CMS! Our engineering & sales team will respond within 24 hours.'
        );
        setInquiryForm({
          type: 'Vehicle Fitment Inquiry',
          name: '',
          companyName: '',
          phone: '',
          email: '',
          vehicleOrLocation: '',
          message: '',
        });
      }
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleWarrantySubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccessMessage(null);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_warranty',
          ...warrantyForm,
        }),
      });
      const json = await res.json();
      if (res.ok && json.warranty) {
        setFormSuccessMessage(
          `Lifetime Warranty Registration #${json.warranty.id.toUpperCase()} submitted! You can verify its status with our team or in the Admin CMS.`
        );
        setWarrantyForm({
          customerName: '',
          phone: '',
          email: '',
          carBrand: 'Honda',
          carModel: '',
          productSku: '',
          serialOrInvoice: '',
          dealerName: '',
          installDate: new Date().toISOString().slice(0, 10),
        });
      }
    } finally {
      setFormSubmitting(false);
    }
  }

  function openProductInquiry(product: ProductItem) {
    setSelectedProductModal(null);
    setActiveFormTab('inquiry');
    setInquiryForm((prev) => ({
      ...prev,
      type: 'Vehicle Fitment Inquiry',
      vehicleOrLocation: `${product.carModel} (${product.sku})`,
      message: `Hi TYPE ONE, I would like to check availability and installation pricing for ${product.name} [SKU: ${product.sku}].`,
    }));
    const el = document.getElementById('portal-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      {/* Top Announcement Bar */}
      {siteConfig.seo.showAnnouncement && (
        <div className="bg-gradient-to-r from-red-950/90 via-red-700 to-red-950/90 border-b border-red-500/30 text-white text-xs sm:text-sm py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-white/15 text-[11px] font-mono uppercase tracking-wider">
                LIVE CATALOG
              </span>
              <span>{siteConfig.seo.announcementBanner}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-red-200 transition-colors cursor-pointer"
              >
                WhatsApp HQ: {siteConfig.contact.phoneMobile}
              </a>
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 px-2.5 py-1 rounded border border-white/20 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3 text-red-400" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Enterprise Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090D16]/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/25 border border-red-400/30">
              <span className="font-mono font-bold text-lg tracking-tighter text-white">T1</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xl font-bold tracking-wider text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  TYPE ONE
                </span>
                <span className="text-[10px] font-mono bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">
                  ®
                </span>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                STABLE BAR MANUFACTURER • MY
              </p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#fitment-catalog" className="hover:text-white transition-colors cursor-pointer">
              Vehicle Catalog
            </a>
            <a href="#chassis-interactive" className="hover:text-white transition-colors cursor-pointer">
              Interactive Chassis
            </a>
            <a href="#three-phase-system" className="hover:text-white transition-colors cursor-pointer">
              3-Phase System
            </a>
            <a href="#engineering-quality" className="hover:text-white transition-colors cursor-pointer">
              Metallurgy & R&D
            </a>
            <a
              href="#portal-section"
              onClick={() => setActiveFormTab('warranty')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Lifetime Warranty
            </a>
            <a
              href="#portal-section"
              onClick={() => {
                setActiveFormTab('inquiry');
                setInquiryForm((p) => ({ ...p, type: 'Dealer Application' }));
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dealer Program
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Manage CMS</span>
            </Link>
            <a
              href="#fitment-catalog"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 transition-all cursor-pointer"
            >
              <span>Find Your Car</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION + QUICK VEHICLE FINDER */}
      <section className="relative carbon-pattern tech-grid-bg border-b border-slate-800/80 overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{siteConfig.hero.badge}</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {siteConfig.hero.titleLine1}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-amber-400 block mt-1">
                  {siteConfig.hero.titleHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {siteConfig.hero.subtitle}
              </p>

              {/* Quick Vehicle Fitment Search Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-400">
                    <Car className="w-4 h-4" />
                    <span>Instant Vehicle Fitment Lookup</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {products.length} Active SKUs • 100% Plug & Play
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      1. Car Brand
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      {allBrands.map((b) => (
                        <option key={b} value={b}>
                          {b === 'All' ? 'All Vehicle Makes (30+)' : b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                      2. Upgrade Stage
                    </label>
                    <select
                      value={selectedPhase}
                      onChange={(e) => setSelectedPhase(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="All">All 3 Phases</option>
                      <option value="Phase 1: Comfort">Phase 1: Comfort (Daily)</option>
                      <option value="Phase 2: Stability">Phase 2: Stability (Subframe)</option>
                      <option value="Phase 3: Performance">Phase 3: Performance (Full)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <a
                      href="#fitment-catalog"
                      className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>View Fitments ({filteredProducts.length})</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Key Trust Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {siteConfig.hero.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90"
                  >
                    <div
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {st.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Chassis Stress & Bar Placement Explorer */}
            <div id="chassis-interactive" className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-900/90 border border-slate-700/80 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 block">
                      INTERACTIVE CAD ARCHITECTURE
                    </span>
                    <h2
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Multi-Point Chassis Reinforcement Map
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                    No Welding • Bolt-On
                  </span>
                </div>

                {/* Visual Chassis Diagram */}
                <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 mb-4 overflow-hidden">
                  <img
                    src="https://typeone.com.my/wp-content/uploads/2024/04/full-set-car.webp"
                    alt="TYPE ONE Full Set Multi-Point Chassis Architecture"
                    className="w-full h-56 object-contain mx-auto opacity-95"
                  />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {CHASSIS_HOTSPOTS.map((spot) => {
                      const isActive = activeHotspot.id === spot.id;
                      return (
                        <button
                          key={spot.id}
                          type="button"
                          onClick={() => {
                            setActiveHotspot(spot);
                            setSelectedPartType(spot.id);
                          }}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-mono transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-600/30'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {spot.label.split('•')[1]?.trim() || spot.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Hotspot Technical Spec Box */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-red-500/30 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-red-400 uppercase">
                      {activeHotspot.label}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {activeHotspot.phase}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeHotspot.benefit}</p>
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                    <span className="font-mono text-slate-400">Spec: {activeHotspot.spec}</span>
                    <a
                      href="#fitment-catalog"
                      onClick={() => setSelectedPartType(activeHotspot.id)}
                      className="text-red-400 hover:text-red-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Filter {activeHotspot.id}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORTED VEHICLE BRANDS BAR */}
      <section className="py-8 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              PRECISION ENGINEERED FOR 30+ JAPANESE, CONTINENTAL, EV & MALAYSIAN MAKES
            </p>
            <span className="text-xs text-slate-400">
              Click any make below to filter compatible chassis bars
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2.5">
            {supportedBrands.map((brand) => {
              const active = selectedBrand.toLowerCase() === brand.name.toLowerCase();
              return (
                <button
                  key={brand.name}
                  type="button"
                  onClick={() => {
                    setSelectedBrand(active ? 'All' : brand.name);
                    const el = document.getElementById('fitment-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    active
                      ? 'bg-red-600/20 border-red-500 text-white'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold tracking-wide">{brand.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {brand.vehicleCount}+ Models
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3-PHASE SUSPENSION UPGRADE ARCHITECTURE */}
      <section id="three-phase-system" className="py-20 bg-[#090D16] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
              <Layers className="w-4 h-4" />
              <span>HOW IT FUNCTIONS • MODULAR CHASSIS TUNING</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {siteConfig.engineering.headline}
            </h2>
            <p className="text-slate-400 mt-3 text-base leading-relaxed">
              {siteConfig.engineering.subheadline}
            </p>
          </div>

          {/* Phase Selector Tabs */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {phases.map((phase, index) => {
              const isSelected = activePhaseTab === index;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setActivePhaseTab(index)}
                  className={`text-left p-6 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border-red-500 shadow-xl shadow-red-950/20'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                      {phase.phaseNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Rigidity: {phase.rigidityScore}%
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold text-white mt-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {phase.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">{phase.subtitle}</p>
                </button>
              );
            })}
          </div>

          {/* Active Phase Details Card */}
          {phases[activePhaseTab] && (
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-red-400">
                  <span>{phases[activePhaseTab].phaseNumber} SPECIFICATION</span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {phases[activePhaseTab].title} — {phases[activePhaseTab].subtitle}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {phases[activePhaseTab].description}
                </p>

                <div className="space-y-2.5">
                  <div className="text-xs font-mono uppercase text-slate-400">
                    Key Driver Benefits:
                  </div>
                  {phases[activePhaseTab].benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Telemetry Meters */}
                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">HANDLING RESPONSE</span>
                      <span className="text-white font-bold">
                        {phases[activePhaseTab].handlingScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all duration-300"
                        style={{ width: `${phases[activePhaseTab].handlingScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">CABIN COMFORT</span>
                      <span className="text-emerald-400 font-bold">
                        {phases[activePhaseTab].comfortScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${phases[activePhaseTab].comfortScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">CHASSIS RIGIDITY</span>
                      <span className="text-amber-400 font-bold">
                        {phases[activePhaseTab].rigidityScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${phases[activePhaseTab].rigidityScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center">
                  <img
                    src={phases[activePhaseTab].diagramImage}
                    alt={phases[activePhaseTab].title}
                    className="w-full h-64 object-contain"
                  />
                  <div className="mt-4 w-full flex flex-wrap gap-2 justify-center">
                    {phases[activePhaseTab].components.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* VEHICLE FITMENT & PRODUCT CATALOG */}
      <section id="fitment-catalog" className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>OFFICIAL CHASSIS COMPONENT CATALOG</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Explore Multi-Point Stable Bars & Fitments
              </h2>
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search car model, SKU (e.g. FL5, Dashing, RAR22)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 mb-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mr-2">
              <Filter className="w-3.5 h-3.5 text-red-400" />
              <span>FILTERS:</span>
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
            >
              {allBrands.map((b) => (
                <option key={b} value={b}>
                  Make: {b}
                </option>
              ))}
            </select>

            <select
              value={selectedPartType}
              onChange={(e) => setSelectedPartType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
            >
              {allPartTypes.map((pt) => (
                <option key={pt} value={pt}>
                  Component: {pt}
                </option>
              ))}
            </select>

            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 cursor-pointer"
            >
              <option value="All">Stage: All Phases</option>
              <option value="Phase 1: Comfort">Phase 1: Comfort</option>
              <option value="Phase 2: Stability">Phase 2: Stability</option>
              <option value="Phase 3: Performance">Phase 3: Performance</option>
            </select>

            {(selectedBrand !== 'All' ||
              selectedPartType !== 'All' ||
              selectedPhase !== 'All' ||
              searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBrand('All');
                  setSelectedPartType('All');
                  setSelectedPhase('All');
                  setSearchQuery('');
                }}
                className="text-xs font-mono text-red-400 hover:text-red-300 underline ml-auto cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
              <Car className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">
                Don&apos;t see your exact vehicle model listed?
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-5">
                TYPE ONE manufactures over 1,500+ chassis bar SKUs across 30+ makes in Kuala Lumpur. Send us your car model and year for immediate fitment confirmation.
              </p>
              <a
                href="#portal-section"
                onClick={() => setActiveFormTab('inquiry')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold cursor-pointer"
              >
                <span>Request Fitment for Your Car</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductModal(product)}
                  className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-red-500/60 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer shadow-lg"
                >
                  <div className="relative h-52 bg-white p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/90 text-white text-[11px] font-mono font-semibold">
                        {product.brand}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-mono uppercase">
                        {product.mountingPoints}-Point
                      </span>
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 text-[10px] font-mono">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-red-400 mb-1">
                        <span>{product.partType}</span>
                        <span>{product.phase}</span>
                      </div>
                      <h3
                        className="text-lg font-bold text-white group-hover:text-red-400 transition-colors"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5">{product.materialSpec}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {product.inStock ? 'Factory In Stock' : 'Made to Order'}
                      </span>
                      <span className="text-xs font-semibold text-white group-hover:text-red-400 inline-flex items-center gap-1">
                        <span>Specs & Fitment</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ENGINEERING, METALLURGY & ABOUT TYPE ONE */}
      <section id="engineering-quality" className="py-20 bg-[#090D16] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400">
                <Award className="w-4 h-4" />
                <span>WHY CHOOSE TYPE ONE • IN-HOUSE MALAYSIAN R&D</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {siteConfig.about.headline}
              </h2>
              <p className="text-slate-300 leading-relaxed">{siteConfig.about.description}</p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {siteConfig.about.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
                  >
                    <div className="text-xs font-mono text-red-400 uppercase">{item.spec}</div>
                    <h3
                      className="text-lg font-bold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-red-400 uppercase">
                      METALLURGY & STRUCTURAL STANDARDS
                    </span>
                    <h3
                      className="text-xl font-bold text-white mt-0.5"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Screened Raw Material Specifications
                    </h3>
                  </div>
                  <Wrench className="w-6 h-6 text-red-500" />
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-slate-400">STRUT & LOWER BARS</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {siteConfig.engineering.strutTubeThickness}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Oval profile resists bending moments under lateral G-forces while maintaining ground clearance.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-mono text-xs shrink-0">
                      1.4–1.6mm
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-slate-400">SOLID ANTI-ROLL BARS</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {siteConfig.engineering.antiRollBarThickness}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        One-piece solid spring steel calibrated to each vehicle&apos;s curb weight and suspension geometry.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-mono text-xs shrink-0">
                      16–28mm
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-slate-400">MOUNTING BRACKETS</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {siteConfig.engineering.bracketPlateThickness}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {siteConfig.engineering.installationNote}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-mono text-xs shrink-0">
                      4.3–4.5mm
                    </span>
                  </div>
                </div>

                <img
                  src="https://typeone.com.my/wp-content/uploads/2024/05/Homepage-Processing-Flow-TYPEONE-1.webp"
                  alt="TYPE ONE In-House Design, R&D and Manufacturing Flow"
                  className="w-full rounded-xl border border-slate-800 bg-white p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PORTAL: LIFETIME WARRANTY REGISTRATION + DEALER / FITMENT INQUIRIES */}
      <section id="portal-section" className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Left Info & Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400">
                <Building2 className="w-4 h-4" />
                <span>DIRECT FACTORY HQ & DEALER NETWORK</span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Partner With TYPE ONE or Register Your Lifetime Warranty
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you are an automotive workshop looking to join our authorized dealer network, a driver checking fitment for your car, or registering your genuine TYPE ONE bar for our Lifetime Structural Warranty—submit directly below.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400">
                      Manufacturing HQ & Installation Center
                    </div>
                    <div className="text-sm font-medium text-white mt-0.5">
                      {siteConfig.contact.address}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400">
                      Direct Hotlines & WhatsApp
                    </div>
                    <div className="text-sm font-medium text-white mt-0.5">
                      Office: {siteConfig.contact.phoneOffice} • Mobile: {siteConfig.contact.phoneMobile}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono uppercase text-slate-400">Operating Hours</div>
                    <div className="text-sm text-white mt-0.5">{siteConfig.contact.hoursWeekday}</div>
                    <div className="text-xs text-slate-400">
                      {siteConfig.contact.hoursSaturday} ({siteConfig.contact.hoursSunday})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Portal Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
                {/* Switcher Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFormTab('inquiry');
                      setFormSuccessMessage(null);
                    }}
                    className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeFormTab === 'inquiry'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Dealer & Fitment Inquiry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFormTab('warranty');
                      setFormSuccessMessage(null);
                    }}
                    className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeFormTab === 'warranty'
                        ? 'bg-red-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Lifetime Warranty Registration</span>
                  </button>
                </div>

                {formSuccessMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>{formSuccessMessage}</div>
                  </div>
                )}

                {activeFormTab === 'inquiry' ? (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-2">
                      {(
                        [
                          'Vehicle Fitment Inquiry',
                          'Dealer Application',
                          'General Support',
                        ] as const
                      ).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setInquiryForm({ ...inquiryForm, type: t })}
                          className={`py-2 px-3 rounded-lg text-xs font-mono border text-center cursor-pointer transition-all ${
                            inquiryForm.type === t
                              ? 'bg-red-500/15 border-red-500 text-red-300 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Your Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          placeholder="e.g. Kelvin Tan"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          required
                          type="text"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          placeholder="e.g. +6012-345 6789"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          {inquiryForm.type === 'Dealer Application'
                            ? 'Workshop Name & City *'
                            : 'Vehicle Make, Model & Year *'}
                        </label>
                        <input
                          required
                          type="text"
                          value={inquiryForm.vehicleOrLocation}
                          onChange={(e) =>
                            setInquiryForm({ ...inquiryForm, vehicleOrLocation: e.target.value })
                          }
                          placeholder={
                            inquiryForm.type === 'Dealer Application'
                              ? 'e.g. Apex Auto Sdn Bhd (Johor Bahru)'
                              : 'e.g. Honda Civic FE 2023 / BYD Seal'
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Inquiry Details *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={inquiryForm.message}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, message: e.target.value })
                        }
                        placeholder="Tell us which bars or dealer package you are interested in..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-3 px-5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                    >
                      {formSubmitting ? 'Submitting to CMS...' : `Submit ${inquiryForm.type}`}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleWarrantySubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Owner Full Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={warrantyForm.customerName}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, customerName: e.target.value })
                          }
                          placeholder="Full Name as per IC"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Phone Number *
                        </label>
                        <input
                          required
                          type="text"
                          value={warrantyForm.phone}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, phone: e.target.value })
                          }
                          placeholder="+6012-345 6789"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          value={warrantyForm.email}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, email: e.target.value })
                          }
                          placeholder="owner@email.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Vehicle Model & Year *
                        </label>
                        <input
                          required
                          type="text"
                          value={warrantyForm.carModel}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, carModel: e.target.value })
                          }
                          placeholder="e.g. Jetour Dashing 2025 / Civic FE"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Product SKU / Code *
                        </label>
                        <input
                          required
                          type="text"
                          value={warrantyForm.productSku}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, productSku: e.target.value })
                          }
                          placeholder="e.g. JD22Y-FS2-01069"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Receipt / Serial No. *
                        </label>
                        <input
                          required
                          type="text"
                          value={warrantyForm.serialOrInvoice}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, serialOrInvoice: e.target.value })
                          }
                          placeholder="e.g. INV-2026-0912"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                          Installation Date *
                        </label>
                        <input
                          required
                          type="date"
                          value={warrantyForm.installDate}
                          onChange={(e) =>
                            setWarrantyForm({ ...warrantyForm, installDate: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                        Authorized Dealer / Workshop Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={warrantyForm.dealerName}
                        onChange={(e) =>
                          setWarrantyForm({ ...warrantyForm, dealerName: e.target.value })
                        }
                        placeholder="e.g. TYPE ONE HQ Desa Aman KL"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-3 px-5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                    >
                      {formSubmitting
                        ? 'Registering Warranty...'
                        : 'Activate Official Lifetime Structural Warranty'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE FOOTER (CLEANED OF ALL ELEMENTOR LOREM IPSUM BUGS!) */}
      <footer className="bg-[#060911] py-12 border-t border-slate-800/80 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold">
              <span>{siteConfig.contact.companyLegalName}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{siteConfig.contact.address}</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <a href="#fitment-catalog" className="hover:text-white transition-colors">
              Catalog
            </a>
            <a href="#three-phase-system" className="hover:text-white transition-colors">
              3-Phase Theory
            </a>
            <a href="#portal-section" className="hover:text-white transition-colors">
              Warranty Registration
            </a>
            <Link href="/admin" className="text-red-400 hover:text-red-300 transition-colors">
              Admin CMS Login
            </Link>
          </div>
        </div>
      </footer>

      {/* PRODUCT SPECIFICATION MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 bg-white relative flex items-center justify-center h-64">
              <img
                src={selectedProductModal.image}
                alt={selectedProductModal.name}
                className="max-h-56 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                  {selectedProductModal.phase}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                  SKU: {selectedProductModal.sku}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                  {selectedProductModal.mountingPoints}-Point Bolt-On
                </span>
              </div>

              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {selectedProductModal.name}
              </h3>

              <p className="text-sm text-slate-300">
                <strong>Material & Construction:</strong> {selectedProductModal.materialSpec}.
                Engineered with registered Malaysian industrial design for 100% plug-and-play installation on OEM mounting points without drilling or welding.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openProductInquiry(selectedProductModal)}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm text-center cursor-pointer"
                >
                  Inquire Installation / Dealer Quote
                </button>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
                    `Hi TYPE ONE! I want to check stock & installation for ${selectedProductModal.name} (SKU: ${selectedProductModal.sku})`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm text-center cursor-pointer"
                >
                  WhatsApp Direct
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
