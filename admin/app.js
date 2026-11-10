// PressCosmos admin — application shell, auth, router and shared actions.
// Vanilla ES module. Depends on window.pcSupabase (supabase-client.js).

import { el, clear, icon, toast, confirmDialog, modal, openPalette, openMediaPicker, renderFields } from './ui.js';
import { CONTENT_GROUPS } from './schema.js';
import * as views from './views.js';

const sb = window.pcSupabase;
const app = document.getElementById('app');
const boot = document.getElementById('boot');

const state = { content: {}, pages: [], media: [], releases: [], jobs: [], dirty: false, user: null };
const email = () => (sb.user() && sb.user().email) || 'unknown';

/* -------------------------------------------------------------------------- */
/*  Auth                                                                      */
/* -------------------------------------------------------------------------- */
function renderLogin(message) {
  clear(app);
  app.hidden = false;
  const err = el('p', { class: 'alert alert-error', hidden: true });
  const form = el('form', { class: 'login-form' },
    el('div', { class: 'afield' }, el('label', { class: 'alabel', text: 'Email' }), el('input', { class: 'ainput', id: 'email', type: 'email', autocomplete: 'username', required: true })),
    el('div', { class: 'afield' }, el('label', { class: 'alabel', text: 'Password' }), el('input', { class: 'ainput', id: 'password', type: 'password', autocomplete: 'current-password', required: true })),
    el('button', { class: 'btn', type: 'submit' }, 'Sign in'), err);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const btn = form.querySelector('button');
    btn.disabled = true;
    try {
      await sb.signIn(document.getElementById('email').value.trim(), document.getElementById('password').value);
      await start();
    } catch (ex) {
      err.textContent = ex.message || 'Sign in failed.';
      err.hidden = false;
    } finally { btn.disabled = false; }
  });

  app.append(el('div', { class: 'login-wrap' }, el('div', { class: 'card login-card' },
    el('a', { class: 'brand', href: '../index.html' }, 'Press', el('span', { class: 'gradient-text', text: 'Cosmos' }), el('span', { class: 'pill', text: 'Admin' })),
    el('p', { class: 'eyebrow mt-2', text: 'Restricted area' }),
    el('h1', { class: 'display', text: 'Sign in' }),
    el('p', { class: 'lede', text: 'Content management for presscosmos.com.' }),
    message ? el('p', { class: 'alert alert-warn', text: message }) : null,
    form,
    el('p', { class: 'login-hint', text: 'Admin access only. Accounts are managed in Supabase.' }))));
}

/* -------------------------------------------------------------------------- */
/*  State                                                                     */
/* -------------------------------------------------------------------------- */
async function loadState() {
  const [content, pages, media, releases, jobs] = await Promise.all([
    sb.rest('/content?select=key,value'),
    sb.rest('/pages?select=*'),
    sb.rest('/media?select=*&order=created_at.desc'),
    sb.rest('/releases?select=*&order=created_at.desc'),
    sb.rest('/publish_jobs?select=*&order=created_at.desc&limit=5').catch(() => []),
  ]);
  state.content = Object.fromEntries((content || []).map((r) => [r.key, r.value]));
  state.pages = pages || [];
  state.media = media || [];
  state.releases = releases || [];
  state.jobs = jobs || [];
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                   */
/* -------------------------------------------------------------------------- */
function markDirty(on = true) { state.dirty = on; const d = document.getElementById('dirty'); if (d) d.hidden = !on; }

async function saveContent(key, value, btn) {
  btn.disabled = true;
  try {
    const prev = state.content[key];
    if (prev !== undefined) {
      await sb.rest('/revisions', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify([{ entity: `content:${key}`, value: prev, created_by: email() }]) });
    }
    await sb.rest('/content', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify([{ key, value, updated_at: new Date().toISOString(), updated_by: email() }]) });
    state.content[key] = value;
    markDirty(true);
    toast('Saved. Publish to make it live.', 'ok');
  } catch (e) { toast(e.message, 'err'); } finally { btn.disabled = false; }
}

async function savePage(slug, model, btn) {
  btn.disabled = true;
  try {
    const prev = state.pages.find((p) => p.slug === slug);
    if (prev) await sb.rest('/revisions', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify([{ entity: `pages:${slug}`, value: prev, created_by: email() }]) });
    const row = {
      slug,
      title: model.title || null,
      description: model.description || null,
      keywords: Array.isArray(model.keywords) ? model.keywords : [],
      html: model.html || null,
      type: model.type || 'website',
      category: model.category || null,
      noindex: !!model.noindex,
      priority: model.priority ?? 0.7,
      changefreq: model.changefreq || 'weekly',
      og_image: model.og_image || null,
      updated_at: new Date().toISOString(),
      updated_by: email(),
    };
    await sb.rest('/pages', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify([row]) });
    const i = state.pages.findIndex((p) => p.slug === slug);
    if (i >= 0) state.pages[i] = { ...state.pages[i], ...row }; else state.pages.push(row);
    markDirty(true);
    toast('Page saved. Publish to make it live.', 'ok');
  } catch (e) { toast(e.message, 'err'); } finally { btn.disabled = false; }
}

async function publish() {
  try {
    await sb.rest('/publish_jobs', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify([{ status: 'requested', note: 'manual', created_by: email() }]) });
    markDirty(false);
    toast('Publish requested — the site rebuilds in a minute or two.', 'ok');
  } catch (e) { toast(e.message, 'err'); }
}

const slugify = (s) => s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || 'image';

async function uploadFile(file) {
  const path = `${Date.now()}-${slugify(file.name)}${(file.name.match(/\.[a-z0-9]+$/i) || [''])[0]}`;
  const url = await sb.upload(path, file);
  const row = { storage_path: path, url, alt: '', title: file.name, bytes: file.size, mime: file.type };
  const saved = await sb.rest('/media', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify([row]) });
  state.media.unshift(saved[0] || row);
  return url;
}

function pickFile() {
  return new Promise((resolve) => {
    const i = el('input', { type: 'file', accept: 'image/*' });
    i.addEventListener('change', () => resolve(i.files[0] || null));
    i.click();
  });
}

async function uploadViaPicker() {
  const file = await pickFile();
  if (!file) return null;
  try { return await uploadFile(file); } catch (e) { toast(e.message, 'err'); return null; }
}

async function updateMedia(id, patch) {
  try { await sb.rest(`/media?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(patch) }); toast('Updated', 'ok'); }
  catch (e) { toast(e.message, 'err'); }
}

async function deleteMedia(m) {
  if (!(await confirmDialog('Delete this image from the library?', 'Delete'))) return;
  try {
    await sb.remove([m.storage_path]);
    await sb.rest(`/media?id=eq.${m.id}`, { method: 'DELETE' });
    state.media = state.media.filter((x) => x.id !== m.id);
    render();
  } catch (e) { toast(e.message, 'err'); }
}

async function openReleaseEditor(row) {
  const { node, model } = views.releaseEditor(fieldsCtx(), row);
  const ok = await modal({ title: row ? 'Edit release' : 'New release', body: node, actions: [{ label: 'Cancel', value: false }, { label: 'Save', value: true, variant: '' }] });
  if (!ok) return;
  const payload = {
    title: model.title || '(untitled)',
    summary: model.summary || null,
    body: model.body || null,
    slug: model.slug || null,
    category: model.category || null,
    location: model.location || null,
    issuer: model.issuer || null,
    status: model.status === 'published' ? 'published' : 'draft',
  };
  try {
    if (row) await sb.rest(`/releases?id=eq.${row.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(payload) });
    else await sb.rest('/releases', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify([payload]) });
    state.releases = await sb.rest('/releases?select=*&order=created_at.desc');
    render(); toast('Release saved', 'ok');
  } catch (e) { toast(e.message, 'err'); }
}

async function toggleRelease(r) {
  try {
    await sb.rest(`/releases?id=eq.${r.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: r.status === 'published' ? 'draft' : 'published' }) });
    r.status = r.status === 'published' ? 'draft' : 'published';
    render(); toast('Updated', 'ok');
  } catch (e) { toast(e.message, 'err'); }
}

async function deleteRelease(r) {
  if (!(await confirmDialog(`Delete “${r.title}”?`, 'Delete'))) return;
  try { await sb.rest(`/releases?id=eq.${r.id}`, { method: 'DELETE' }); state.releases = state.releases.filter((x) => x.id !== r.id); render(); toast('Deleted', 'ok'); }
  catch (e) { toast(e.message, 'err'); }
}

// The render context handed to every form: marks the page dirty and wires the
// media picker / uploader into image fields.
function fieldsCtx(extra) {
  return {
    onChange: () => { markDirty(true); extra && extra(); },
    onPick: () => openMediaPicker(sb),
    onUpload: () => uploadViaPicker(),
  };
}

/* -------------------------------------------------------------------------- */
/*  Shell + router                                                            */
/* -------------------------------------------------------------------------- */
const go = (hash) => { location.hash = hash; };

function navModel() {
  const items = [
    { hash: '#/dashboard', label: 'Dashboard', icon: 'grid' },
    { hash: '#/pages', label: 'Pages', icon: 'file', badge: String(state.pages.length) },
    ...CONTENT_GROUPS.map((g) => ({ hash: `#/content/${g.key}`, label: g.label, icon: g.icon, group: 'Content' })),
    { hash: '#/media', label: 'Media', icon: 'image', group: 'Assets', badge: String(state.media.length) },
    { hash: '#/releases', label: 'Releases', icon: 'send', group: 'Assets', badge: String(state.releases.length) },
    { hash: '#/settings', label: 'Settings', icon: 'settings', group: 'Workspace' },
  ];
  return items;
}

function buildShell() {
  clear(app);
  app.hidden = false;
  const nav = el('nav', { class: 'side-nav' });
  let lastGroup;
  for (const it of navModel()) {
    if (it.group && it.group !== lastGroup) { nav.append(el('div', { class: 'side-group', text: it.group })); lastGroup = it.group; }
    nav.append(el('a', { class: 'side-link', href: it.hash, dataset: { hash: it.hash } }, icon(it.icon), el('span', { text: it.label }), it.badge ? el('span', { class: 'badge', text: it.badge }) : null));
  }

  const search = el('button', { class: 'side-search', type: 'button', onClick: openCommandPalette }, icon('search'), el('span', { text: 'Search…' }), el('kbd', { text: '⌘K' }));
  const side = el('aside', { class: 'side' },
    el('div', { class: 'side-brand' }, el('a', { class: 'brand', href: '../index.html' }, 'Press', el('span', { class: 'gradient-text', text: 'Cosmos' })), el('span', { class: 'pill', text: 'Admin' })),
    search, nav,
    el('div', { class: 'side-foot' },
      el('span', { class: 'topbar-user', text: 'Signed in as ' + email() }),
      el('div', { class: 'toolbar' },
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: publish }, icon('rocket'), 'Publish'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: toggleTheme }, 'Theme'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: signOut }, icon('logout'), 'Sign out'))));

  const dirty = el('span', { class: 'chip chip-draft', id: 'dirty', hidden: !state.dirty, text: 'Unpublished changes' });
  const topbar = el('header', { class: 'topbar' },
    el('button', { class: 'btn btn-ghost btn-sm side-toggle', type: 'button', onClick: () => side.classList.toggle('is-open') }, '☰'),
    el('h1', { id: 'view-title', text: 'Dashboard' }),
    dirty,
    el('div', { class: 'spacer' }),
    el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: openCommandPalette }, icon('search'), 'Search'),
    el('a', { class: 'btn btn-ghost btn-sm', href: '../index.html' }, 'View site'),
    el('button', { class: 'btn btn-sm', type: 'button', onClick: publish }, icon('rocket'), 'Publish'));

  const view = el('div', { id: 'view', class: 'content' });
  app.append(el('div', { class: 'app-shell' }, side, el('div', { class: 'main' }, topbar, view)));

  window.addEventListener('hashchange', render);
  document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCommandPalette(); } });
  render();
}

async function render() {
  const view = document.getElementById('view');
  if (!view) return;
  const parts = (location.hash || '#/dashboard').replace(/^#\/?/, '').split('/');
  const title = document.getElementById('view-title');
  let node;

  try {
    if (parts[0] === 'pages') { node = views.pagesView(state, ctx()); title.textContent = 'Pages'; }
    else if (parts[0] === 'page' && parts[1]) { node = views.pageEditor(state, ctx(), decodeURIComponent(parts[1])); title.textContent = 'Edit page'; }
    else if (parts[0] === 'content' && parts[1]) { node = views.contentView(state, ctx(), parts[1]); title.textContent = 'Content'; }
    else if (parts[0] === 'media') { node = views.mediaView(state, ctx()); title.textContent = 'Media'; }
    else if (parts[0] === 'releases') { node = views.releasesView(state, ctx()); title.textContent = 'Releases'; }
    else if (parts[0] === 'settings') { node = await views.settingsView(state, ctx()); title.textContent = 'Settings'; }
    else { node = views.dashboard(state, ctx()); title.textContent = 'Dashboard'; if (!location.hash) location.hash = '#/dashboard'; }
  } catch (e) { node = el('div', { class: 'empty', text: e.message }); }

  clear(view).append(node);

  document.querySelectorAll('.side-link').forEach((a) => a.classList.toggle('is-active', a.dataset.hash === location.hash));
  view.parentElement.parentElement.querySelector('.side')?.classList.remove('is-open');
}

function ctx() {
  return {
    sb, go, publish, saveContent, savePage, fields: fieldsCtx,
    editRelease: openReleaseEditor, toggleRelease, deleteRelease,
    uploadMedia: async (file) => { await uploadFile(file); render(); },
    updateMedia, deleteMedia,
  };
}

function openCommandPalette() {
  const cmds = [
    { label: 'Go to dashboard', icon: 'grid', action: () => go('#/dashboard') },
    { label: 'Publish site', icon: 'rocket', action: publish },
    { label: 'Media library', icon: 'image', action: () => go('#/media') },
    { label: 'Releases', icon: 'send', action: () => go('#/releases') },
    { label: 'Settings', icon: 'settings', action: () => go('#/settings') },
    ...CONTENT_GROUPS.map((g) => ({ label: `Content · ${g.label}`, icon: g.icon, action: () => go(`#/content/${g.key}`) })),
    ...(state.pages || []).map((p) => ({ label: `Page · ${p.title || p.slug}`, icon: 'file', keywords: p.slug, action: () => go(`#/page/${p.slug}`) })),
  ];
  openPalette(cmds).then((cmd) => cmd && cmd.action());
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', cur);
  try { localStorage.setItem('presscosmos:theme', cur); } catch (e) { /* ignore */ }
}
async function signOut() { await sb.signOut(); location.reload(); }

/* -------------------------------------------------------------------------- */
/*  Boot                                                                      */
/* -------------------------------------------------------------------------- */
async function start() {
  try { await loadState(); state.loadError = null; }
  catch (e) { state.loadError = e.message; toast(`Could not load content: ${e.message}`, 'err'); }
  buildShell();
}

(async function init() {
  boot.hidden = false;
  if (!sb.configured) { clear(app); app.hidden = false; app.append(el('div', { class: 'login-wrap' }, el('div', { class: 'card', text: 'Supabase is not configured. Set url and anonKey in admin/config.js.' }))); boot.remove(); return; }
  sb.init();
  if (sb.session) await sb.ensureFresh();
  boot.remove();
  if (sb.user()) await start(); else renderLogin();
})();
