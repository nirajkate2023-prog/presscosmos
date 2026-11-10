// PressCosmos — fetch CMS content from Supabase at build time.
//
// Used by tools/build.mjs. When SUPABASE_URL and SUPABASE_SERVICE_KEY are set
// (i.e. in the "Rebuild site" GitHub Action), the content the dashboard manages
// is fetched and merged over the defaults. When they are absent — a plain clone
// or a local `node tools/build.mjs` — this returns null and the site builds
// from tools/site.mjs and tools/content/*.mjs exactly as before.

const URL_BASE = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = process.env.SUPABASE_SERVICE_KEY || '';

export const hasRemote = Boolean(URL_BASE && KEY);

async function rest(path) {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${path} -> HTTP ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/**
 * Load the CMS content set. Returns null when Supabase is not configured.
 * Shape: { content: { [key]: value }, pages: { [slug]: row }, media: [row], updatedAt }
 */
export async function loadRemote() {
  if (!hasRemote) return null;

  const [contentRows, pageRows, mediaRows] = await Promise.all([
    rest('content?select=key,value,updated_at'),
    rest('pages?select=*'),
    rest('media?select=id,url,alt,title,width,height'),
  ]);

  const content = {};
  const pages = {};
  let updatedAt = '';

  for (const row of contentRows) {
    content[row.key] = row.value;
    if (row.updated_at && row.updated_at > updatedAt) updatedAt = row.updated_at;
  }
  for (const row of pageRows) {
    pages[row.slug] = row;
    if (row.updated_at && row.updated_at > updatedAt) updatedAt = row.updated_at;
  }

  return { content, pages, media: mediaRows, updatedAt: updatedAt || null };
}
