import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSubpage } from './src/lib/subpage.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'cms-db.json');
const DEFAULT_DB_PATH = path.join(__dirname, 'data', 'cms-default.json');

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};
const PUBLIC_DIR = path.join(__dirname, 'public');

function getCMSData() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return JSON.parse(fs.readFileSync(DEFAULT_DB_PATH, 'utf-8'));
  }
}

function saveCMSData(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  // Static files from public/ (any path with a file extension, kept inside public/)
  if (path.extname(url.pathname) && !url.pathname.endsWith('.html')) {
    let rel;
    try { rel = decodeURIComponent(url.pathname); } catch { res.writeHead(400); res.end(); return; }
    const filePath = path.resolve(PUBLIC_DIR, '.' + rel);
    if (filePath.startsWith(PUBLIC_DIR + path.sep) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  // API Endpoint: /api/cms
  if (url.pathname === '/api/cms') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(getCMSData()));
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await readBody(req);
        const data = getCMSData();

        if (body.action === 'register_warranty') {
          const newWarranty = {
            id: `war-${Date.now().toString().slice(-5)}`,
            customerName: body.customerName || '',
            phone: body.phone || '',
            email: body.email || '',
            carBrand: body.carBrand || 'Other',
            carModel: body.carModel || '',
            productSku: body.productSku || '',
            serialOrInvoice: body.serialOrInvoice || '',
            dealerName: body.dealerName || 'Authorized TYPE ONE Workshop',
            installDate: body.installDate || new Date().toISOString().slice(0, 10),
            status: 'Pending Review',
            createdAt: new Date().toISOString(),
          };
          data.warranties.unshift(newWarranty);
          saveCMSData(data);
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true, warranty: newWarranty, data }));
          return;
        }

        if (body.action === 'submit_inquiry') {
          const newInquiry = {
            id: `inq-${Date.now().toString().slice(-5)}`,
            type: body.type || 'Vehicle Fitment Inquiry',
            name: body.name || '',
            companyName: body.companyName || '',
            phone: body.phone || '',
            email: body.email || '',
            vehicleOrLocation: body.vehicleOrLocation || '',
            message: body.message || '',
            status: 'New',
            createdAt: new Date().toISOString(),
          };
          data.inquiries.unshift(newInquiry);
          saveCMSData(data);
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true, inquiry: newInquiry, data }));
          return;
        }

        if (body.action === 'add_product') {
          const p = body.product || {};
          const newProd = {
            id: `prod-${Date.now().toString().slice(-5)}`,
            name: p.name || `${p.partType} — ${p.carModel}`,
            partType: p.partType || 'Front Strut Bar',
            brand: p.brand || 'Honda',
            carModel: p.carModel || '',
            sku: p.sku || 'T1-NEW-SKU',
            code: p.code || p.sku || 'T1-NEW',
            phase: p.phase || 'Phase 1: Comfort',
            materialSpec:
              p.materialSpec || '1.6mm High-Tensile Oval Steel Tube + 4.5mm Laser Brackets',
            mountingPoints: Number(p.mountingPoints) || 2,
            image:
              p.image ||
              'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
            featured: Boolean(p.featured),
            inStock: p.inStock !== false,
          };
          data.products.unshift(newProd);
          saveCMSData(data);
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true, data }));
          return;
        }

        if (body.action === 'add_export_country') {
          const c = body.exportCountry || {};
          const newCountry = {
            id: `exp-${Date.now().toString().slice(-4)}`,
            country: c.country || 'New Market',
            flag: c.flag || '🌐',
            iso: (c.iso || 'XX').toUpperCase(),
            region: c.region || 'International',
            lat: Number(c.lat) || 0,
            lng: Number(c.lng) || 0,
            isHQ: false,
            hubCity: c.hubCity || c.country || '',
            focusModels: c.focusModels || 'Multi-Point Strut & Anti-Roll Bars',
            status: c.status || 'Active Export Market',
          };
          if (!data.globalExports) data.globalExports = [];
          data.globalExports.push(newCountry);
          saveCMSData(data);
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true, data }));
          return;
        }

        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Unknown action' }));
        return;
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: String(err) }));
        return;
      }
    }

    if (req.method === 'PUT') {
      try {
        const body = await readBody(req);
        if (body.action === 'reset_default') {
          const defData = JSON.parse(fs.readFileSync(DEFAULT_DB_PATH, 'utf-8'));
          const saved = saveCMSData(defData);
          res.writeHead(200);
          res.end(JSON.stringify({ ok: true, data: saved }));
          return;
        }

        const current = getCMSData();
        const updated = saveCMSData({
          ...current,
          ...(body.siteConfig ? { siteConfig: body.siteConfig } : {}),
          ...(body.globalExports ? { globalExports: body.globalExports } : {}),
          ...(body.products ? { products: body.products } : {}),
          ...(body.phases ? { phases: body.phases } : {}),
          ...(body.warranties ? { warranties: body.warranties } : {}),
          ...(body.inquiries ? { inquiries: body.inquiries } : {}),
          ...(body.supportedBrands ? { supportedBrands: body.supportedBrands } : {}),
        });
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true, data: updated }));
        return;
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: String(err) }));
        return;
      }
    }
  }

  // Serve 3D Blueprint Viewer at /blueprint or /blueprint.html
  if (url.pathname === '/blueprint' || url.pathname === '/blueprint.html') {
    const bpHtml = fs.readFileSync(path.join(__dirname, 'public', 'blueprint.html'), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(bpHtml);
    return;
  }

  // Serve Admin CMS Portal at /admin
  if (url.pathname === '/admin' || url.pathname === '/admin/') {
    const adminHtml = fs.readFileSync(path.join(__dirname, 'public', 'admin.html'), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(adminHtml);
    return;
  }

  // Home page at /
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const indexHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(indexHtml);
    return;
  }

  // Sub pages: /applications, /how-it-fits, /manufacturing, /about, /contact
  const slug = url.pathname.replace(/^\/+|\/+$/g, '');
  const subHtml = /^[a-z-]+$/.test(slug) ? renderSubpage(__dirname, slug) : null;
  if (subHtml) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(subHtml);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<!doctype html><title>Page not found | TYPE ONE</title><p>This page does not exist. <a href="/">Go to the TYPE ONE home page</a>.</p>');
});

server.listen(PORT, () => {
  console.log(`TYPE ONE Enterprise Website & Admin CMS running at http://localhost:${PORT}`);
});
