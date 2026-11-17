import { NextResponse } from 'next/server';
import { renderSubpage } from '@/lib/subpage.mjs';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const html = renderSubpage(process.cwd(), slug);
  if (!html) return new NextResponse('Not found', { status: 404 });
  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
