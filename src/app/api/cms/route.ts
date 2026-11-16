import { NextRequest, NextResponse } from 'next/server';
import {
  getCMSData,
  saveCMSData,
  INITIAL_CMS_DATA,
  WarrantyRegistration,
  LeadInquiry,
  ProductItem,
} from '@/lib/cms-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getCMSData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = getCMSData();

    if (body.action === 'register_warranty') {
      const newWarranty: WarrantyRegistration = {
        id: `war-${Date.now().toString().slice(-5)}`,
        customerName: body.customerName || '',
        phone: body.phone || '',
        email: body.email || '',
        carBrand: body.carBrand || '',
        carModel: body.carModel || '',
        productSku: body.productSku || '',
        serialOrInvoice: body.serialOrInvoice || '',
        dealerName: body.dealerName || 'Direct / Authorized Workshop',
        installDate: body.installDate || new Date().toISOString().slice(0, 10),
        status: 'Pending Review',
        createdAt: new Date().toISOString(),
      };
      data.warranties.unshift(newWarranty);
      saveCMSData(data);
      return NextResponse.json({ ok: true, warranty: newWarranty });
    }

    if (body.action === 'submit_inquiry') {
      const newInquiry: LeadInquiry = {
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
      return NextResponse.json({ ok: true, inquiry: newInquiry });
    }

    if (body.action === 'add_product') {
      const newProd: ProductItem = {
        id: `prod-${Date.now().toString().slice(-5)}`,
        name: body.product.name,
        partType: body.product.partType,
        brand: body.product.brand,
        carModel: body.product.carModel,
        sku: body.product.sku,
        code: body.product.code || body.product.sku,
        phase: body.product.phase || 'Phase 1: Comfort',
        materialSpec: body.product.materialSpec || '1.6mm High-Tensile Oval Steel + 4.5mm Brackets',
        mountingPoints: Number(body.product.mountingPoints) || 2,
        image:
          body.product.image ||
          'https://typeone.com.my/wp-content/uploads/2026/06/1-Front-Strut-Bar-Jetour-Dashing-22Y-BAR.png',
        featured: Boolean(body.product.featured),
        inStock: body.product.inStock !== false,
      };
      data.products.unshift(newProd);
      saveCMSData(data);
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset_default') {
      const reset = saveCMSData(structuredClone(INITIAL_CMS_DATA));
      return NextResponse.json({ ok: true, data: reset });
    }

    const current = getCMSData();
    const updated = saveCMSData({
      ...current,
      ...(body.siteConfig ? { siteConfig: body.siteConfig } : {}),
      ...(body.products ? { products: body.products } : {}),
      ...(body.phases ? { phases: body.phases } : {}),
      ...(body.warranties ? { warranties: body.warranties } : {}),
      ...(body.inquiries ? { inquiries: body.inquiries } : {}),
      ...(body.supportedBrands ? { supportedBrands: body.supportedBrands } : {}),
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
