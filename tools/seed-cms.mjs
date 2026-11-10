// PressCosmos — seed Supabase content/pages from the generator defaults.
//
// One-off: makes the database equal to what the site currently generates, so the
// dashboard starts from real content. Re-running upserts (safe).
//
// Run:
//   $env:SUPABASE_URL='https://<project>.supabase.co'
//   $env:SUPABASE_SERVICE_KEY='sb_secret_...'
//   node tools/seed-cms.mjs

import * as siteData from './site.mjs';
import { corePages } from './content/pages-core.mjs';
import { industryPages } from './content/pages-industries.mjs';
import { newsPages } from './content/pages-news.mjs';
import { legalContentPages } from './content/pages-legal.mjs';
import { companyPages } from './content/pages-company.mjs';

const URL_BASE = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = process.env.SUPABASE_SERVICE_KEY || '';

if (!URL_BASE || !KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY before running the seed.');
  process.exit(1);
}

const globals = {
  site: siteData.site,
  stats: siteData.stats,
  networkChannels: siteData.networkChannels,
  services: siteData.services,
  industries: siteData.industries,
  plans: siteData.plans,
  audienceSegments: siteData.audienceSegments,
  testimonials: siteData.testimonials,
  faqs: siteData.faqs,
  legalPages: siteData.legalPages,
  primaryNav: siteData.primaryNav,
  footerColumns: siteData.footerColumns,
};

const pages = [
  ...corePages,
  ...industryPages,
  ...newsPages,
  ...legalContentPages,
  ...companyPages,
];

async function upsert(table, rows) {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${table} -> HTTP ${res.status} ${await res.text()}`);
}

const contentRows = Object.entries(globals).map(([key, value]) => ({ key, value }));
const pageRows = pages.map((p) => ({
  slug: p.slug,
  title: p.title || null,
  description: p.description || null,
  keywords: Array.isArray(p.keywords) ? p.keywords : [],
  html: p.body || null,
  type: p.type || 'website',
  category: p.category || null,
  noindex: Boolean(p.noindex),
  priority: p.priority ?? 0.7,
  changefreq: p.changefreq || 'weekly',
  published_iso: p.publishedISO || null,
  modified_iso: p.modifiedISO || null,
  og_image: p.ogImage || null,
}));

await upsert('content', contentRows);
await upsert('pages', pageRows);

console.log(`Seeded ${contentRows.length} content rows and ${pageRows.length} pages.`);
