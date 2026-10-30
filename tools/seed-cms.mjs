// PressCosmos — seed the Decap CMS content store from the current site content.
//
// Decap CMS reads existing files to populate its editor. Until a file exists the
// editor is blank, and saving a blank editor would wipe the section it controls.
// This script writes that starting point once:
//
//   admin/content/site.json        the site-wide sections (brand, nav, plans…)
//   admin/content/pages/<slug>.json one file per page, with its current copy
//
// Values are copied verbatim from what the site currently renders, so running
// `node tools/build.mjs` immediately afterwards produces byte-identical HTML.
// Re-running is safe: any per-page CMS edit is preserved and folded in.
//
// Run: node tools/seed-cms.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

import { DATA_DIR, PAGES_DIR, loadPageOverrides } from './overrides.mjs';
import {
  site, stats, networkChannels, services, industries, plans, audienceSegments,
  testimonials, faqs, legalPages, primaryNav, footerColumns,
} from './site.mjs';
import { corePages } from './content/pages-core.mjs';
import { industryPages } from './content/pages-industries.mjs';
import { newsPages } from './content/pages-news.mjs';
import { legalContentPages } from './content/pages-legal.mjs';
import { companyPages } from './content/pages-company.mjs';

const write = (file, value) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

/* --------------------------------------------------------- site-wide sections */
// buildDate is stamped at build time, so it is never stored as editable content.
const { buildDate, ...editableSite } = site;

write(join(DATA_DIR, 'site.json'), {
  site: editableSite,
  stats,
  plans,
  services,
  industries,
  testimonials,
  faqs,
  primaryNav,
  footerColumns,
  legalPages,
  audienceSegments,
  networkChannels,
});

/* ------------------------------------------------------------------- pages */
// The ordered set of fields the Decap "Pages & articles" collection exposes.
const PAGE_FIELDS = [
  'title', 'description', 'keywords', 'body',
  'type', 'category', 'publishedISO', 'modifiedISO',
  'priority', 'changefreq', 'noindex',
];

const pick = (page) => {
  const out = {};
  for (const key of PAGE_FIELDS) {
    const value = page[key];
    if (value === undefined || value === null) continue;
    if (key === 'noindex' && value !== true) continue; // only store when set
    out[key] = value;
  }
  return out;
};

const defaults = [...corePages, ...industryPages, ...newsPages, ...legalContentPages, ...companyPages];
const existing = loadPageOverrides();

for (const page of defaults) {
  write(join(PAGES_DIR, `${page.slug}.json`), pick({ ...page, ...(existing[page.slug] || {}) }));
}

console.log(`Seeded admin/content/site.json and ${defaults.length} page files in admin/content/pages/.`);
