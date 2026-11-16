# TYPE ONE Malaysia (`typeone.com.my`) — Enterprise Redesign & Zero-Cost CMS

## Why This Stack Wins (100% Free, Zero Hidden Costs)
- **Framework:** Next.js (App Router, TypeScript) + Tailwind CSS + Lucide SVG Icons
- **Built-in Enterprise Admin CMS (`/admin`):** Zero SaaS seat fees, zero plugin vulnerabilities, zero usage traps.
- **Persistent Local/File Database (`data/cms-db.json`):** Instant read/write persistence out of the box with 1-click JSON backup & factory restore. Can be swapped to free PostgreSQL (Supabase/Neon) or SQLite at any time.

## What We Fixed from the Legacy `typeone.com.my` WordPress Site
During our automated audit of the live `typeone.com.my` WordPress + Elementor + WooCommerce site, we uncovered and resolved:
1. **60+ Render-Blocking Stylesheets & Plugins:** Replaced Astra + Elementor + Essential Addons + WOOF Filter + Ultimate Member with a single, instantaneous Next.js build.
2. **Broken Template Placeholder Text in Production:** Removed leftover Elementor template leaks (`Lorem ipsum dolor sit amet...`, `329 Queensberry Street, North Birmingham VIC 3051`, `Scroll to Top Carsentro`) and fixed footer typos (`Car Chasis Knowledge`).
3. **Clunky Multi-Page Theory Navigation:** Consolidated *Car Chassis Knowledge*, *Chassis Friendly*, and *How It Functions (Phase 1, 2, 3)* into an interactive **Multi-Point CAD Chassis Explorer** and **3-Phase Telemetry System**.
4. **Integrated Warranty & Dealer Portal:** Built-in **Lifetime Structural Warranty Registration** and **Dealer Partnership / Vehicle Fitment Inquiry CRM** that feed directly into the `/admin` CMS dashboard.

## Quick Start

```bash
npm install
npm run dev
```

- **Public Redesigned Website:** `http://localhost:3000`
- **Admin CMS Portal:** `http://localhost:3000/admin`
  - **Demo Email:** `admin@typeone.com.my`
  - **Demo Password:** `typeone2026`
