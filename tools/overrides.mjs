// PressCosmos — content override layer.
//
// The admin panel (admin/) writes JSON into admin/content/. The build reads it
// here and layers it over the defaults in tools/site.mjs and
// tools/content/*.mjs, so an edited page still regenerates with the full
// header, footer, navigation, sitemap and structured data.
//
// Nothing in admin/ is ever served over the web: .htaccess blocks the whole
// directory on Hostinger, and the deployment packager never copies it.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ADMIN_DIR = join(ROOT, 'admin');
export const DATA_DIR = join(ADMIN_DIR, 'content');
export const MEDIA_DIR = join(ROOT, 'assets', 'img');
export const AUTH_FILE = join(ADMIN_DIR, '.auth.json');
export const SITE_FILE = join(DATA_DIR, 'site.json');
export const PAGES_FILE = join(DATA_DIR, 'pages.json');
// One JSON file per page, keyed by slug. This is the shape the Decap CMS
// folder collection writes to (admin/content/pages/<slug>.json).
export const PAGES_DIR = join(DATA_DIR, 'pages');

export const readJson = (file, fallback = null) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

export const writeJson = (file, value) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

export const loadSiteOverrides = () => readJson(SITE_FILE, {}) || {};

// Per-slug page overrides. The Decap CMS "Pages & articles" folder collection
// writes one JSON file per page under admin/content/pages/, while the built-in
// Node panel writes the whole map to admin/content/pages.json. Both are read and
// merged, with the per-file entries (Decap) winning when a slug appears twice.
export const readPagesDir = () => {
  let entries;
  try {
    entries = readdirSync(PAGES_DIR, { withFileTypes: true });
  } catch {
    return {};
  }

  const out = {};
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const name = entry.name;
    if (name.startsWith('.') || !name.toLowerCase().endsWith('.json')) continue;
    const slug = name.slice(0, -'.json'.length);
    if (!slug) continue;
    const value = readJson(join(PAGES_DIR, name), null);
    if (value && typeof value === 'object' && !Array.isArray(value)) out[slug] = value;
  }
  return out;
};

export const loadPageOverrides = () => ({ ...(readJson(PAGES_FILE, {}) || {}), ...readPagesDir() });
export const saveSiteOverrides = (value) => writeJson(SITE_FILE, value);
export const savePageOverrides = (value) => writeJson(PAGES_FILE, value);

/* ------------------------------------------------------------------ helpers */

// Merge plain objects recursively. Arrays and scalars replace outright, which
// is what an editor expects when it rewrites a list.
export const deepMerge = (target, patch) => {
  for (const [key, value] of Object.entries(patch)) {
    const bothPlainObjects =
      value && typeof value === 'object' && !Array.isArray(value) &&
      target[key] && typeof target[key] === 'object' && !Array.isArray(target[key]);
    if (bothPlainObjects) deepMerge(target[key], value);
    else target[key] = value;
  }
  return target;
};

// Replace an exported array in place, so consumers that imported the array
// (or iterated it to build page HTML) observe the new contents.
export const replaceArray = (target, items) => {
  target.length = 0;
  target.push(...items);
  return target;
};
