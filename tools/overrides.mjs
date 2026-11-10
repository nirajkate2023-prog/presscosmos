// PressCosmos — merge CMS overrides over the generator defaults.
//
// The dashboard stores edited content as JSON in Supabase. build.mjs loads it
// via content-source.mjs and layers it over the defaults here. Objects merge
// field-by-field; arrays replace wholesale (an edited list is the whole list).

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export function deepMerge(base, patch) {
  if (patch === undefined || patch === null) return base;
  if (Array.isArray(patch)) return patch;
  if (isPlainObject(patch) && isPlainObject(base)) {
    const out = { ...base };
    for (const key of Object.keys(patch)) out[key] = deepMerge(base[key], patch[key]);
    return out;
  }
  return patch;
}

const GLOBAL_KEYS = [
  'site', 'stats', 'networkChannels', 'services', 'industries', 'plans',
  'audienceSegments', 'testimonials', 'faqs', 'legalPages', 'primaryNav', 'footerColumns',
];

/** Merge the remote globals over the defaults. Returns the defaults untouched when remote is null. */
export function applyGlobals(defaults, remote) {
  if (!remote || !remote.content) return { ...defaults };
  const out = { ...defaults };
  for (const key of GLOBAL_KEYS) {
    if (remote.content[key] !== undefined) out[key] = deepMerge(defaults[key], remote.content[key]);
  }
  return out;
}

/**
 * Apply per-page overrides (SEO + optional HTML body) by slug.
 * A page whose `html` is set keeps that version and stops tracking the
 * generated body — clearing it in the dashboard returns to the generated body.
 */
export function applyPageOverrides(pages, remote) {
  if (!remote || !remote.pages) return pages;
  return pages.map((page) => {
    const o = remote.pages[page.slug];
    if (!o) return page;
    const merged = { ...page };
    if (o.title != null && o.title !== '') merged.title = o.title;
    if (o.description != null && o.description !== '') merged.description = o.description;
    if (Array.isArray(o.keywords) && o.keywords.length) merged.keywords = o.keywords;
    if (o.noindex != null) merged.noindex = o.noindex;
    if (o.priority != null) merged.priority = Number(o.priority);
    if (o.changefreq) merged.changefreq = o.changefreq;
    if (o.type) merged.type = o.type;
    if (o.category != null) merged.category = o.category;
    if (o.og_image) merged.ogImage = o.og_image;
    if (o.published_iso) merged.publishedISO = o.published_iso;
    if (o.modified_iso) merged.modifiedISO = o.modified_iso;
    if (o.html) merged.body = o.html;
    return merged;
  });
}
