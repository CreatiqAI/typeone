// Builds a sub page (/applications, /how-it-fits, ...) from public/details.html and data/pages.json.
// The page's title, description, canonical, share tags, breadcrumb schema and a no-script h1 are
// written into the HTML on the server, so search engines see them without running the script.
import fs from 'node:fs';
import path from 'node:path';

export const SITE = 'https://typeone.com.my';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function loadPages(root) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', 'pages.json'), 'utf-8'));
}

export function renderSubpage(root, slug) {
  const pages = loadPages(root);
  const page = pages[slug];
  if (!page) return null;
  const url = `${SITE}/${slug}`;
  const html = fs.readFileSync(path.join(root, 'public', 'details.html'), 'utf-8');
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: page.crumb, item: url },
    ],
  };
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="TYPE ONE Stable Bar">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:image" content="${SITE}/share.jpg">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="icon" href="/favicon.png" type="image/png">`,
    `<meta name="theme-color" content="#f6f6f3">`,
    `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`,
    `<script>window.__PAGE__=${JSON.stringify(page).replace(/</g, '\\u003c')}</script>`,
  ].join('\n  ');
  const noscript =
    `<div id="app"><main><h1>${esc(page.h1)}</h1><p>${esc(page.intro)}</p>` +
    `<p><a href="/">Home</a> · <a href="/applications">Bars</a> · <a href="/how-it-fits">Fitting</a> · ` +
    `<a href="/manufacturing">Factory</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p></main></div>`;
  return html
    .replace('<html lang="en" class="scroll-smooth">', `<html lang="en" class="scroll-smooth" data-page="${esc(slug)}">`)
    .replace('<!--PAGE_HEAD-->', head)
    .replace('<div id="app"></div>', noscript);
}
