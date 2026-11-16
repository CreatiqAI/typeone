'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FileEdit,
  ShieldCheck,
  Users,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Lock,
  LogOut,
  CheckCircle2,
  Search,
  Layers,
  Phone,
  Sparkles,
} from 'lucide-react';
import type { CMSDatabase, ProductItem } from '@/lib/cms-store';

export default function AdminCMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@typeone.com.my');
  const [passwordInput, setPasswordInput] = useState('typeone2026');
  const [loginError, setLoginError] = useState('');

  const [cms, setCms] = useState<CMSDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'pages' | 'phases' | 'warranties' | 'inquiries'
  >('overview');

  // Product Manager state
  const [productSearch, setProductSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<ProductItem>>({
    name: '',
    brand: 'Honda',
    carModel: '',
    partType: 'Front Strut Bar',
    sku: '',
    phase: 'Phase 1: Comfort',
    materialSpec: '1.6mm High-Tensile Oval Steel + 4.5mm Brackets',
    mountingPoints: 2,
    image:
      'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
    featured: true,
    inStock: true,
  });

  useEffect(() => {
    const savedSession = sessionStorage.getItem('typeone_cms_auth');
    if (savedSession === 'true') {
      setIsAuthenticated(true);
    }
    fetchCMS();
  }, []);

  async function fetchCMS() {
    setLoading(true);
    try {
      const res = await fetch('/api/cms', { cache: 'no-store' });
      const data = await res.json();
      setCms(data);
    } finally {
      setLoading(false);
    }
  }

  function showNotification(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (
      emailInput.trim().toLowerCase() === 'admin@typeone.com.my' &&
      passwordInput === 'typeone2026'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('typeone_cms_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin@typeone.com.my / typeone2026');
    }
  }

  async function saveAllChanges(updatedCms: CMSDatabase, message = 'Changes published to live website!') {
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCms),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCms(json.data);
        showNotification(message);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!cms) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_product',
          product: newProduct,
        }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCms(json.data);
        setShowAddModal(false);
        setNewProduct({
          name: '',
          brand: 'Honda',
          carModel: '',
          partType: 'Front Strut Bar',
          sku: '',
          phase: 'Phase 1: Comfort',
          materialSpec: '1.6mm High-Tensile Oval Steel + 4.5mm Brackets',
          mountingPoints: 2,
          image:
            'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
          featured: true,
          inStock: true,
        });
        showNotification('New product SKU added to live catalog!');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleResetDemo() {
    if (!confirm('Reset all CMS content and catalog to default TYPE ONE data?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_default' }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setCms(json.data);
        showNotification('CMS reset to factory default data.');
      }
    } finally {
      setSaving(false);
    }
  }

  function handleExportJSON() {
    if (!cms) return;
    const blob = new Blob([JSON.stringify(cms, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typeone-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D16] tech-grid-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-mono font-bold text-white">
                T1
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TYPE ONE Enterprise CMS</h1>
                <p className="text-xs text-slate-400 font-mono">Zero-Cost Self-Hosted Admin Portal</p>
              </div>
            </div>
            <Lock className="w-5 h-5 text-red-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-mono text-red-400 uppercase font-semibold">
              Demo Admin Credentials (Pre-filled):
            </div>
            <div>
              Email: <code className="text-white">admin@typeone.com.my</code>
            </div>
            <div>
              Password: <code className="text-white">typeone2026</code>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer"
            >
              Sign In to Admin CMS
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-slate-400 hover:text-white inline-flex items-center gap-1.5"
            >
              <span>← Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !cms) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center font-mono text-sm">
        Loading TYPE ONE CMS Workspace...
      </div>
    );
  }

  const filteredAdminProducts = cms.products.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.carModel.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col lg:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-2xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-mono font-bold text-white">
                T1
              </div>
              <div>
                <div className="text-sm font-bold text-white">TYPE ONE CMS</div>
                <div className="text-[10px] font-mono text-emerald-400">● Live Connected</div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              {
                id: 'products',
                label: `Product Catalog (${cms.products.length})`,
                icon: Package,
              },
              { id: 'pages', label: 'Hero, About & Contact', icon: FileEdit },
              { id: 'phases', label: '3-Phase System Editor', icon: Layers },
              {
                id: 'warranties',
                label: `Warranty Claims (${cms.warranties.length})`,
                icon: ShieldCheck,
              },
              {
                id: 'inquiries',
                label: `Dealer & Leads (${cms.inquiries.length})`,
                icon: Users,
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2 mt-6">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            <span>View Live Website</span>
          </Link>

          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-xs font-mono text-slate-300 border border-slate-800 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup Database JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('typeone_cms_auth');
              setIsAuthenticated(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-red-400 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        {/* Top Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase text-red-400">
              SELF-HOSTED ENTERPRISE CONTENT MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-0.5">
              {activeTab === 'overview' && 'Executive CMS Overview'}
              {activeTab === 'products' && 'Vehicle Fitment & Stable Bar Catalog'}
              {activeTab === 'pages' && 'Website Copy, Hero & Contact Editor'}
              {activeTab === 'phases' && '3-Phase Suspension Architecture Editor'}
              {activeTab === 'warranties' && 'Lifetime Warranty Registration Portal'}
              {activeTab === 'inquiries' && 'Dealer Applications & Customer Inquiries'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDemo}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveAllChanges(cms)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : 'Publish Changes'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">Active Catalog SKUs</div>
                <div className="text-3xl font-bold text-white mt-2">{cms.products.length}</div>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="text-xs text-red-400 hover:underline mt-3 inline-block cursor-pointer"
                >
                  Manage Catalog →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">
                  Supported Car Brands
                </div>
                <div className="text-3xl font-bold text-white mt-2">
                  {cms.supportedBrands.length} Makes
                </div>
                <div className="text-xs text-slate-400 mt-3">JDM, Conti, EV & Malaysian</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">
                  Warranty Registrations
                </div>
                <div className="text-3xl font-bold text-emerald-400 mt-2">
                  {cms.warranties.length}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('warranties')}
                  className="text-xs text-red-400 hover:underline mt-3 inline-block cursor-pointer"
                >
                  Verify Claims →
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 uppercase">
                  Dealer & Fitment Leads
                </div>
                <div className="text-3xl font-bold text-amber-400 mt-2">
                  {cms.inquiries.length}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-red-400 hover:underline mt-3 inline-block cursor-pointer"
                >
                  Review Leads →
                </button>
              </div>
            </div>

            {/* Quick Announcement Bar Editor right on Dashboard */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Quick Edit: Sitewide Top Announcement Bar
                  </h2>
                  <p className="text-xs text-slate-400">
                    Instantly broadcast new vehicle releases, promotions, or holiday hours at the top of typeone.com.my
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cms.siteConfig.seo.showAnnouncement}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          seo: {
                            ...cms.siteConfig.seo,
                            showAnnouncement: e.target.checked,
                          },
                        },
                      })
                    }
                    className="rounded accent-red-600"
                  />
                  <span>Show Banner</span>
                </label>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={cms.siteConfig.seo.announcementBanner}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      siteConfig: {
                        ...cms.siteConfig,
                        seo: {
                          ...cms.siteConfig.seo,
                          announcementBanner: e.target.value,
                        },
                      },
                    })
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => saveAllChanges(cms, 'Announcement banner updated!')}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Banner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search SKU, car model, or brand..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle Bar SKU</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredAdminProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl bg-white object-contain p-1 shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-400">
                          {prod.brand}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          SKU: {prod.sku}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{prod.phase}</span>
                      </div>
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) => {
                          const updated = cms.products.map((item) =>
                            item.id === prod.id ? { ...item, name: e.target.value } : item
                          );
                          setCms({ ...cms, products: updated });
                        }}
                        className="mt-1 text-base font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-red-500 focus:outline-none w-full sm:w-96"
                      />
                      <div className="text-xs text-slate-400 mt-0.5">{prod.materialSpec}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <label className="flex items-center gap-1.5 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prod.inStock}
                        onChange={(e) => {
                          const updated = cms.products.map((item) =>
                            item.id === prod.id ? { ...item, inStock: e.target.checked } : item
                          );
                          const next = { ...cms, products: updated };
                          setCms(next);
                          saveAllChanges(next, `Updated stock status for ${prod.sku}`);
                        }}
                        className="accent-emerald-500"
                      />
                      <span>In Stock</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = cms.products.filter((item) => item.id !== prod.id);
                        const next = { ...cms, products: updated };
                        setCms(next);
                        saveAllChanges(next, `Removed ${prod.sku} from catalog.`);
                      }}
                      className="p-2 rounded-lg bg-slate-950 hover:bg-red-600/20 text-slate-400 hover:text-red-400 border border-slate-800 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HERO, ABOUT & CONTACT EDITOR */}
        {activeTab === 'pages' && (
          <div className="space-y-8 max-w-4xl">
            {/* Hero Section Editor */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                1. Homepage Hero Section
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Top Badge Text
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.hero.badge}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          hero: { ...cms.siteConfig.hero, badge: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Headline Line 1
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.hero.titleLine1}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          hero: { ...cms.siteConfig.hero, titleLine1: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Highlighted Headline Line 2
                </label>
                <input
                  type="text"
                  value={cms.siteConfig.hero.titleHighlight}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      siteConfig: {
                        ...cms.siteConfig,
                        hero: { ...cms.siteConfig.hero, titleHighlight: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Hero Description Copy
                </label>
                <textarea
                  rows={3}
                  value={cms.siteConfig.hero.subtitle}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      siteConfig: {
                        ...cms.siteConfig,
                        hero: { ...cms.siteConfig.hero, subtitle: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>

            {/* Engineering & About Editor */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                2. About Us & Metallurgy Specifications
              </h2>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  About Headline
                </label>
                <input
                  type="text"
                  value={cms.siteConfig.about.headline}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      siteConfig: {
                        ...cms.siteConfig,
                        about: { ...cms.siteConfig.about, headline: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Company Story
                </label>
                <textarea
                  rows={3}
                  value={cms.siteConfig.about.description}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      siteConfig: {
                        ...cms.siteConfig,
                        about: { ...cms.siteConfig.about, description: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Strut Tube Spec
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.engineering.strutTubeThickness}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          engineering: {
                            ...cms.siteConfig.engineering,
                            strutTubeThickness: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Anti-Roll Bar Spec
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.engineering.antiRollBarThickness}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          engineering: {
                            ...cms.siteConfig.engineering,
                            antiRollBarThickness: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Bracket Plate Spec
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.engineering.bracketPlateThickness}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          engineering: {
                            ...cms.siteConfig.engineering,
                            bracketPlateThickness: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Contact & HQ Info Editor */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
                3. Factory Address, Phone & WhatsApp Settings
              </h2>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Factory HQ Address
                </label>
                <input
                  type="text"
                  value={cms.siteConfig.contact.address}
                  onChange={(e) =>
                    setCms({
                      ...cms,
                      siteConfig: {
                        ...cms.siteConfig,
                        contact: { ...cms.siteConfig.contact, address: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Office Phone
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.contact.phoneOffice}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          contact: { ...cms.siteConfig.contact, phoneOffice: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Mobile / WhatsApp Display
                  </label>
                  <input
                    type="text"
                    value={cms.siteConfig.contact.phoneMobile}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          contact: { ...cms.siteConfig.contact, phoneMobile: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={cms.siteConfig.contact.email}
                    onChange={(e) =>
                      setCms({
                        ...cms,
                        siteConfig: {
                          ...cms.siteConfig,
                          contact: { ...cms.siteConfig.contact, email: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 3-PHASE SYSTEM EDITOR */}
        {activeTab === 'phases' && (
          <div className="space-y-6 max-w-4xl">
            {cms.phases.map((phase, idx) => (
              <div
                key={phase.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-red-600/20 text-red-400">
                    {phase.phaseNumber}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Phase Title
                    </label>
                    <input
                      type="text"
                      value={phase.title}
                      onChange={(e) => {
                        const nextPhases = [...cms.phases];
                        nextPhases[idx] = { ...phase, title: e.target.value };
                        setCms({ ...cms, phases: nextPhases });
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Included Bars Subtitle
                    </label>
                    <input
                      type="text"
                      value={phase.subtitle}
                      onChange={(e) => {
                        const nextPhases = [...cms.phases];
                        nextPhases[idx] = { ...phase, subtitle: e.target.value };
                        setCms({ ...cms, phases: nextPhases });
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Engineering Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={phase.description}
                    onChange={(e) => {
                      const nextPhases = [...cms.phases];
                      nextPhases[idx] = { ...phase, description: e.target.value };
                      setCms({ ...cms, phases: nextPhases });
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: WARRANTY REGISTRATIONS */}
        {activeTab === 'warranties' && (
          <div className="space-y-4">
            {cms.warranties.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-slate-400">#{w.id}</span>
                    <span className="font-bold text-white">{w.customerName}</span>
                    <span
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded ${
                        w.status === 'Verified'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {w.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Vehicle: <strong>{w.carModel}</strong> • SKU: <code>{w.productSku}</code> • Invoice/Serial:{' '}
                    <code>{w.serialOrInvoice}</code>
                  </div>
                  <div className="text-xs text-slate-400">
                    Dealer: {w.dealerName} • Installed: {w.installDate} • Contact: {w.phone} ({w.email})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = cms.warranties.map((item) =>
                        item.id === w.id
                          ? {
                              ...item,
                              status: (item.status === 'Verified'
                                ? 'Pending Review'
                                : 'Verified') as 'Verified' | 'Pending Review',
                            }
                          : item
                      );
                      const next = { ...cms, warranties: updated };
                      setCms(next);
                      saveAllChanges(next, `Updated warranty #${w.id}`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono cursor-pointer"
                  >
                    {w.status === 'Verified' ? 'Mark Pending' : 'Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: INQUIRIES & DEALER LEADS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {cms.inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-red-500/15 text-red-400">
                      {inq.type}
                    </span>
                    <span className="font-bold text-white">{inq.name}</span>
                    <span className="text-xs font-mono text-slate-400">
                      ({inq.vehicleOrLocation})
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                      {inq.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{inq.message}</p>
                  <div className="text-xs text-slate-400">
                    Phone: {inq.phone} • Email: {inq.email}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={inq.status}
                    onChange={(e) => {
                      const updated = cms.inquiries.map((item) =>
                        item.id === inq.id
                          ? {
                              ...item,
                              status: e.target.value as
                                | 'New'
                                | 'Contacted'
                                | 'Partner Approved',
                            }
                          : item
                      );
                      const next = { ...cms, inquiries: updated };
                      setCms(next);
                      saveAllChanges(next, `Lead status updated to ${e.target.value}`);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Partner Approved">Partner Approved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL: ADD NEW PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Add New Vehicle Chassis Bar SKU</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Product Display Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Front Strut Bar — BYD Seal Performance 24Y"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Vehicle Make *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. BYD, Honda, Perodua"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Car Model & Year *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. BYD Seal 24Y"
                    value={newProduct.carModel}
                    onChange={(e) => setNewProduct({ ...newProduct, carModel: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Component Type *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Front Strut Bar / Rear Anti-Roll Bar"
                    value={newProduct.partType}
                    onChange={(e) => setNewProduct({ ...newProduct, partType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Official SKU Code *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. BYDS-FS2-01120"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Upgrade Phase
                  </label>
                  <select
                    value={newProduct.phase}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        phase: e.target.value as ProductItem['phase'],
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  >
                    <option value="Phase 1: Comfort">Phase 1: Comfort</option>
                    <option value="Phase 2: Stability">Phase 2: Stability</option>
                    <option value="Phase 3: Performance">Phase 3: Performance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Mounting Points
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={newProduct.mountingPoints}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, mountingPoints: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Save & Publish SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
