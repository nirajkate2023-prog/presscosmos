// PressCosmos admin — content store.
//
// Bridges three things for the admin panel:
//   1. the default content that lives in tools/ (the generated site source)
//   2. the JSON overrides the panel writes to admin/content/
//   3. the actions that turn edits into a published site (build, verify, commit)

import { readdirSync, readFileSync, writeFileSync, statSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname, basename, resolve, relative, sep } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import * as siteData from '../../tools/site.mjs';
import { corePages } from '../../tools/content/pages-core.mjs';
import { industryPages } from '../../tools/content/pages-industries.mjs';
import { newsPages } from '../../tools/content/pages-news.mjs';
import { legalContentPages } from '../../tools/content/pages-legal.mjs';
import { companyPages } from '../../tools/content/pages-company.mjs';

import {
  ROOT, MEDIA_DIR,
  deepMerge,
  loadSiteOverrides, saveSiteOverrides, loadPageOverrides, savePageOverrides,
} from '../../tools/overrides.mjs';
import { SECTION_KEYS, PAGE_FIELDS } from './schema.mjs';

const run = promisify(execFile);
const exec = (file, args) => run(file, args, { cwd: ROOT, maxBuffer: 16 * 1024 * 1024 })
  .then(({ stdout, stderr }) => ({ ok: true, output: `${stdout}${stderr}`.trim() }))
  .catch((err) => ({ ok: false, output: `${err.stdout || ''}${err.stderr || err.message}`.trim() }));

/* -------------------------------------------------------- site-wide content */

const DEFAULT_SECTIONS = {
  site: siteData.site,
  stats: siteData.stats,
  plans: siteData.plans,
  services: siteData.services,
  industries: siteData.industries,
  testimonials: siteData.testimonials,
  faqs: siteData.faqs,
  primaryNav: siteData.primaryNav,
  footerColumns: siteData.footerColumns,
  legalPages: siteData.legalPages,
  audienceSegments: siteData.audienceSegments,
  networkChannels: siteData.networkChannels,
};

const stripBuildDate = (value) => {
  const { buildDate, ...rest } = value || {};
  return rest;
};

// Overrides are stored complete, so when one exists it is the value of record
// and the module default it replaced is stale. Read the file on every call so
// the panel always reflects what was last saved.
export const getSection = (key) => {
  if (!SECTION_KEYS.includes(key)) throw new Error(`Unknown section: ${key}`);
  const overrides = loadSiteOverrides();

  // Only `site` carries buildDate, and only `site` is merged rather than
  // replaced — spreading an array would flatten it into a numeric object.
  if (key === 'site') {
    const base = stripBuildDate(DEFAULT_SECTIONS.site);
    return deepMerge(structuredClone(base), stripBuildDate(overrides.site));
  }

  if (key === 'faqs') {
    const base = structuredClone(DEFAULT_SECTIONS.faqs);
    if (!overrides.faqs) return base;
    for (const [group, items] of Object.entries(overrides.faqs)) {
      if (Array.isArray(items)) base[group] = items;
    }
    return base;
  }

  return Object.hasOwn(overrides, key) ? overrides[key] : DEFAULT_SECTIONS[key];
};

export const getOverriddenSections = () => {
  const overrides = loadSiteOverrides();
  return SECTION_KEYS.filter((key) => Object.hasOwn(overrides, key));
};

export const saveSection = (key, value) => {
  if (!SECTION_KEYS.includes(key)) throw new Error(`Unknown section: ${key}`);
  const overrides = loadSiteOverrides();
  if (key === 'site') {
    overrides.site = { ...stripBuildDate(overrides.site), ...stripBuildDate(value) };
  } else {
    overrides[key] = value;
  }
  saveSiteOverrides(overrides);
  return getSection(key);
};

export const resetSection = (key) => {
  const overrides = loadSiteOverrides();
  delete overrides[key];
  saveSiteOverrides(overrides);
  return getSection(key);
};

/* ------------------------------------------------------------------- pages */

const DEFAULT_PAGES = [...corePages, ...industryPages, ...newsPages, ...legalContentPages, ...companyPages];

export const listPages = () => {
  const overrides = loadPageOverrides();
  return DEFAULT_PAGES.map((page) => ({
    slug: page.slug,
    url: page.slug === 'index' ? '/' : `/${page.slug}.html`,
    title: overrides[page.slug]?.title ?? page.title,
    description: overrides[page.slug]?.description ?? page.description,
    type: page.type || 'website',
    editable: PAGE_FIELDS,
    overridden: Object.keys(overrides[page.slug] || {}),
  }));
};

export const getPage = (slug) => {
  const base = DEFAULT_PAGES.find((page) => page.slug === slug);
  if (!base) throw new Error(`Unknown page: ${slug}`);
  const override = loadPageOverrides()[slug] || {};
  const body = override.body ?? base.body;

  return {
    slug,
    url: slug === 'index' ? '/' : `/${slug}.html`,
    meta: {
      type: base.type || 'website',
      noindex: Boolean(base.noindex),
      breadcrumbs: base.breadcrumbs || [],
    },
    effective: {
      title: override.title ?? base.title,
      description: override.description ?? base.description,
      keywords: override.keywords ?? base.keywords ?? [],
      body,
    },
    defaults: {
      title: base.title,
      description: base.description,
      keywords: base.keywords ?? [],
      body: base.body,
    },
    overridden: Object.keys(override),
  };
};

const cleanPagePatch = (patch) => {
  const clean = {};
  for (const field of PAGE_FIELDS) {
    if (!Object.hasOwn(patch, field)) continue;
    if (field === 'keywords') {
      clean.keywords = (Array.isArray(patch.keywords) ? patch.keywords : String(patch.keywords).split(','))
        .map((k) => String(k).trim())
        .filter(Boolean);
    } else if (field === 'body') {
      clean.body = String(patch.body);
    } else {
      clean[field] = String(patch[field]);
    }
  }
  return clean;
};

export const savePage = (slug, patch) => {
  const overrides = loadPageOverrides();
  overrides[slug] = { ...(overrides[slug] || {}), ...cleanPagePatch(patch) };
  savePageOverrides(overrides);
  return getPage(slug);
};

export const resetPage = (slug) => {
  const overrides = loadPageOverrides();
  delete overrides[slug];
  savePageOverrides(overrides);
  return getPage(slug);
};

/* ------------------------------------------------------------------- media */

const IMAGE_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const listMedia = () => {
  if (!existsSync(MEDIA_DIR)) return [];
  return readdirSync(MEDIA_DIR)
    .filter((file) => IMAGE_TYPES[extname(file).toLowerCase()])
    .map((file) => {
      const info = statSync(join(MEDIA_DIR, file));
      return {
        file,
        path: `assets/img/${file}`,
        bytes: info.size,
        modified: info.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.modified.localeCompare(a.modified));
};

const safeName = (filename) => {
  const ext = extname(filename).toLowerCase();
  if (!IMAGE_TYPES[ext]) throw new Error('Unsupported file type. Use PNG, JPG, WEBP, GIF, SVG, AVIF or ICO.');
  const stem = basename(filename, extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 60) || 'image';
  return { stem, ext };
};

export const saveMedia = (filename, base64) => {
  if (typeof base64 !== 'string' || !base64) throw new Error('No file data received.');
  const buffer = Buffer.from(base64, 'base64');
  if (!buffer.length) throw new Error('The uploaded file is empty.');
  if (buffer.length > MAX_UPLOAD_BYTES) throw new Error('Image is larger than 8 MB. Resize it and try again.');

  const { stem, ext } = safeName(filename);
  mkdirSync(MEDIA_DIR, { recursive: true });

  let file = `${stem}${ext}`;
  let counter = 2;
  while (existsSync(join(MEDIA_DIR, file))) {
    file = `${stem}-${counter}${ext}`;
    counter += 1;
  }

  writeFileSync(join(MEDIA_DIR, file), buffer);
  return { file, path: `assets/img/${file}` };
};

export const deleteMedia = (file) => {
  const target = resolve(MEDIA_DIR, basename(String(file)));
  if (!target.startsWith(resolve(MEDIA_DIR) + sep)) throw new Error('Invalid file path.');
  if (!existsSync(target)) throw new Error('That image no longer exists.');
  unlinkSync(target);
  return { deleted: basename(target) };
};

/* ------------------------------------------------------------ search replace */

const CONTENT_FILES = [
  'tools/site.mjs',
  ...['core', 'industries', 'news', 'legal', 'company'].map((name) => `tools/content/pages-${name}.mjs`),
];
const ASSET_FILES = ['assets/css/main.css', 'assets/js/app.js'];

const SCOPES = {
  content: () => CONTENT_FILES,
  assets: () => ASSET_FILES,
  pages: () => readdirSync(ROOT).filter((f) => f.endsWith('.html')),
  all: () => [...CONTENT_FILES, ...ASSET_FILES, ...readdirSync(ROOT).filter((f) => f.endsWith('.html'))],
};

export const searchReplace = ({ find, text, scope = 'content', confirm = false }) => {
  if (typeof find !== 'string' || find.length < 2) throw new Error('Enter at least 2 characters to search for.');
  if (!SCOPES[scope]) throw new Error(`Unknown scope: ${scope}`);
  const replacement = typeof text === 'string' ? text : '';
  if (confirm && !replacement) throw new Error('Enter the replacement text before confirming.');

  const results = [];
  let total = 0;

  for (const rel of SCOPES[scope]()) {
    const full = join(ROOT, rel);
    if (!existsSync(full)) continue;
    const source = readFileSync(full, 'utf8');
    const count = source.split(find).length - 1;
    if (!count) continue;

    const samples = source.split(/\r?\n/)
      .filter((line) => line.includes(find))
      .slice(0, 3)
      .map((line) => line.trim().slice(0, 180));

    if (confirm) writeFileSync(full, source.split(find).join(replacement), 'utf8');

    total += count;
    results.push({ file: relative(ROOT, full).split(sep).join('/'), count, samples });
  }

  return { applied: confirm, find, text: replacement, scope, total, results };
};

/* ----------------------------------------------------------------- publish */

export const publishPreview = async () => {
  const build = await exec('node', ['tools/build.mjs']);
  if (!build.ok) return { ok: false, stage: 'build', output: build.output };

  const verify = await exec('node', ['tools/check-links.mjs']);
  const status = await exec('git', ['status', '--porcelain']);

  const changed = status.output.split(/\r?\n/).filter(Boolean).map((line) => ({
    state: line.slice(0, 2).trim() || '??',
    file: line.slice(3),
  }));

  return {
    ok: verify.ok,
    stage: verify.ok ? 'ready' : 'verify',
    output: [build.output, verify.output].join('\n\n'),
    changed,
    notable: changed.filter((entry) => entry.state === '??' && entry.file.startsWith('admin/')),
  };
};

export const publish = async ({ message, push = false } = {}) => {
  const preview = await publishPreview();
  if (!preview.ok) return { ...preview, committed: false };
  if (!preview.changed.length) return { ...preview, committed: false, note: 'Nothing to publish — the site is already up to date.' };

  const commitMessage = (typeof message === 'string' && message.trim()) || 'Update site content';

  const add = await exec('git', ['add', '-A']);
  if (!add.ok) return { ok: false, stage: 'add', output: add.output, committed: false };

  const staged = await exec('git', ['diff', '--cached', '--name-only']);
  if (!staged.output) return { ...preview, committed: false, note: 'Nothing staged to commit.' };

  const commit = await exec('git', ['commit', '-m', commitMessage]);
  if (!commit.ok) return { ok: false, stage: 'commit', output: commit.output, committed: false };

  let pushResult = null;
  if (push) pushResult = await exec('git', ['push']);

  return {
    ok: !push || Boolean(pushResult?.ok),
    stage: push ? (pushResult?.ok ? 'pushed' : 'push') : 'committed',
    output: [commit.output, pushResult?.output].filter(Boolean).join('\n\n'),
    committed: true,
    pushed: Boolean(push && pushResult?.ok),
    changed: preview.changed,
    files: staged.output.split(/\r?\n/).filter(Boolean),
  };
};
