// PressCosmos — internal link and asset checker.
// Verifies every local href/src in the generated HTML resolves to a real file,
// and that no page references an image or stylesheet that does not exist.
// Run: node tools/check-links.mjs

import { readFile, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const files = (await readdir(ROOT)).filter((f) => f.endsWith('.html'));
const skip = /^(https?:|mailto:|tel:|#|data:|\/\/)/;
const problems = [];
const checked = new Set();

const exists = async (target) => {
  try { await access(join(ROOT, target)); return true; } catch { return false; }
};

for (const file of files) {
  const html = await readFile(join(ROOT, file), 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const ref of refs) {
    if (skip.test(ref)) continue;
    const target = ref.split('#')[0].split('?')[0];
    if (!target) continue;
    const key = `${file} -> ${target}`;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!(await exists(target))) problems.push(key);
  }
}

// Also verify the machine-readable files reference real pages.
const sitemap = await readFile(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const badLocs = [];
for (const loc of locs) {
  const slug = loc.replace(/^https?:\/\/[^/]+\//, '').replace(/\/$/, '') || 'index.html';
  const target = slug.includes('.') ? slug : `${slug}.html`;
  if (!(await exists(target))) badLocs.push(loc);
}

console.log(`Checked ${files.length} HTML files, ${checked.size} unique local references.`);
if (problems.length) {
  console.log(`\nBROKEN REFERENCES (${problems.length}):`);
  problems.forEach((p) => console.log('  ' + p));
} else {
  console.log('All local links and assets resolve.');
}
if (badLocs.length) {
  console.log(`\nSITEMAP URLS WITHOUT A FILE (${badLocs.length}):`);
  badLocs.forEach((l) => console.log('  ' + l));
} else {
  console.log(`Sitemap: all ${locs.length} URLs map to generated files.`);
}
process.exit(problems.length || badLocs.length ? 1 : 0);
