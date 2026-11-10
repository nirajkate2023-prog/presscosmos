// PressCosmos admin — views.
// Each view is an async function (state, ctx) => HTMLElement. ctx carries the
// shared actions (save, publish, pick media, navigate) supplied by app.js.

import { el, clear, icon, toast, confirmDialog, renderFields, openMediaPicker } from './ui.js';
import { CONTENT_GROUPS, PAGE_FIELDS, RELEASE_FIELDS } from './schema.js';

const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const when = (iso) => (iso ? new Date(iso).toLocaleString() : '—');

/* ------------------------------------------------------------------ dashboard */
export function dashboard(state, ctx) {
  const published = (state.releases || []).filter((r) => r.status === 'published').length;
  const lastPublish = (state.jobs || [])[0];

  const stats = [
    ['Pages', String((state.pages || []).length)],
    ['Content groups', String(Object.keys(state.content || {}).length)],
    ['Published releases', String(published)],
    ['Media items', String((state.media || []).length)],
  ];

  return el('div', null,
    el('div', { class: 'page-head' },
      el('div', null, el('p', { class: 'eyebrow', text: 'Dashboard' }), el('h2', { text: 'Your site at a glance' }),
        el('p', { class: 'muted', text: 'Everything here writes to Supabase. Press Publish when you want it live.' })),
      el('div', { class: 'toolbar' }, el('button', { class: 'btn', type: 'button', onClick: ctx.publish }, icon('rocket'), 'Publish site'))),
    state.loadError ? el('div', { class: 'panel mt-3', style: { borderColor: 'rgba(251,191,36,.5)' } },
      el('div', { class: 'panel-head' }, el('h3', { text: 'Setup needed' })),
      el('p', { class: 'muted', text: 'Could not read the content tables: ' + state.loadError }),
      el('p', { class: 'faint', text: 'Run supabase/schema.sql in the Supabase SQL editor, then reload this page.' })) : null,
    el('div', { class: 'stat-grid' }, stats.map(([k, v]) => el('div', { class: 'stat-card' }, el('div', { class: 'k', text: k }), el('div', { class: 'v', text: v })))),
    el('div', { class: 'panel mt-3' },
      el('div', { class: 'panel-head' }, el('h3', { text: 'Publishing' })),
      el('p', { class: 'muted', text: lastPublish ? `Last requested ${when(lastPublish.created_at)} (${lastPublish.status}).` : 'No publish has been requested yet.' }),
      el('p', { class: 'faint mt-1', text: 'A publish asks the GitHub Action to rebuild the static site from this content, then Hostinger redeploys. Usually live within a couple of minutes.' })),
    el('div', { class: 'panel' },
      el('div', { class: 'panel-head' }, el('h3', { text: 'Quick links' })),
      el('div', { class: 'toolbar' },
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.go('#/pages') }, 'Edit pages'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.go('#/content/site') }, 'Brand & contact'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.go('#/media') }, 'Media library'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.go('#/releases') }, 'Releases'))));
}

/* ------------------------------------------------------------------ content (globals) */
export function contentNav() {
  return CONTENT_GROUPS.map((g) => ({ hash: `#/content/${g.key}`, label: g.label, icon: g.icon, group: 'Content' }));
}

export function contentView(state, ctx, key) {
  const group = CONTENT_GROUPS.find((g) => g.key === key);
  if (!group) return el('div', { class: 'empty', text: 'Unknown content group.' });
  const field = { ...group, name: group.key };
  const model = { [group.key]: clone(state.content[key] ?? (group.type === 'list' ? [] : {})) };

  const form = renderFields([field], model, ctx.fields());
  const saveBtn = el('button', { class: 'btn', type: 'button' }, icon('check'), 'Save changes');
  saveBtn.addEventListener('click', () => ctx.saveContent(key, model[group.key], saveBtn));

  return el('div', null,
    el('div', { class: 'page-head' },
      el('div', null, el('p', { class: 'eyebrow', text: 'Content' }), el('h2', { text: group.label }),
        group.hint ? el('p', { class: 'muted', text: group.hint }) : null),
      el('div', { class: 'toolbar' }, saveBtn)),
    form);
}

/* ------------------------------------------------------------------ pages */
export function pagesView(state, ctx) {
  const search = el('input', { class: 'ainput', type: 'search', placeholder: 'Search pages…', style: { maxWidth: '320px' } });
  const list = el('div', { class: 'rows' });
  const pages = [...(state.pages || [])].sort((a, b) => a.slug.localeCompare(b.slug));

  const render = () => {
    const q = search.value.trim().toLowerCase();
    clear(list);
    const filtered = pages.filter((p) => !q || p.slug.includes(q) || (p.title || '').toLowerCase().includes(q));
    if (!filtered.length) { list.append(el('div', { class: 'empty', text: 'No pages match.' })); return; }
    for (const p of filtered) {
      const row = el('div', { class: 'row-card' },
        el('div', null, el('h4', { text: p.title || p.slug }),
          el('p', { class: 'faint', text: `${p.slug}.html · ${p.type || 'website'}${p.noindex ? ' · noindex' : ''}` })),
        el('div', { class: 'rtools' }, el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.go(`#/page/${p.slug}`) }, 'Edit')));
      list.append(row);
    }
  };
  search.addEventListener('input', render);
  render();

  return el('div', { class: 'content-wide' },
    el('div', { class: 'page-head' }, el('div', null, el('p', { class: 'eyebrow', text: 'Pages' }), el('h2', { text: 'All pages' }), el('p', { class: 'muted', text: 'Edit SEO and body copy. Leaving a field empty keeps the generated value.' }))),
    el('div', { class: 'panel' }, el('div', { class: 'toolbar' }, search)), list);
}

export function pageEditor(state, ctx, slug) {
  const original = (state.pages || []).find((p) => p.slug === slug);
  if (!original) return el('div', { class: 'empty', text: `Page “${slug}” not found.` });
  const model = clone(original);

  const serp = el('div', { class: 'serp' });
  const updateSerp = () => {
    clear(serp);
    serp.append(
      el('div', { class: 'u', text: `https://presscosmos.com/${slug === 'index' ? '' : slug + '.html'}` }),
      el('div', { class: 't', text: (model.title || '').split('|')[0].trim() || 'Untitled page' }),
      el('div', { class: 'd', text: model.description || '' }));
  };

  const form = renderFields(PAGE_FIELDS, model, ctx.fields(updateSerp));

  const saveBtn = el('button', { class: 'btn', type: 'button' }, icon('check'), 'Save page');
  saveBtn.addEventListener('click', () => ctx.savePage(slug, model, saveBtn));
  const resetBtn = el('button', { class: 'btn btn-ghost', type: 'button' }, icon('refresh'), 'Reset body');
  resetBtn.addEventListener('click', async () => {
    if (await confirmDialog('Clear this page’s custom body so it returns to the generated layout?', 'Reset body')) {
      model.html = '';
      ctx.go(`#/page/${slug}`); toast('Body reset — remember to Save.', 'ok');
    }
  });
  updateSerp();

  return el('div', null,
    el('div', { class: 'page-head' },
      el('div', null, el('p', { class: 'eyebrow', text: 'Page' }), el('h2', { text: model.title || slug }),
        el('p', { class: 'faint', text: `${slug}.html` })),
      el('div', { class: 'toolbar' }, el('button', { class: 'btn btn-ghost', type: 'button', onClick: () => ctx.go('#/pages') }, 'Back'), resetBtn, saveBtn)),
    el('div', { class: 'panel' }, form),
    el('div', { class: 'panel' }, el('div', { class: 'panel-head' }, el('h3', { text: 'Search preview' })), serp),
    el('div', { class: 'panel' }, el('div', { class: 'panel-head' }, el('h3', { text: 'Share (Open Graph) preview' })),
      el('div', { class: 'serp' }, el('div', { class: 't', text: (model.title || '').split('|')[0].trim() || 'Untitled' }), el('div', { class: 'd', text: model.description || '' }),
        el('div', { class: 'faint', text: 'presscosmos.com' }))));
}

/* ------------------------------------------------------------------ media */
export function mediaView(state, ctx) {
  const grid = el('div', { class: 'media-grid' });
  const input = el('input', { type: 'file', accept: 'image/*', multiple: true, style: { display: 'none' } });
  const zone = el('div', { class: 'dropzone', text: 'Drag images here, or click to upload' });

  const render = () => {
    clear(grid);
    const items = state.media || [];
    if (!items.length) { grid.append(el('div', { class: 'empty', text: 'No images yet.' })); return; }
    for (const m of items) {
      const card = el('div', { class: 'media-card' });
      card.append(el('img', { src: m.url, alt: m.alt || '', loading: 'lazy' }));
      const body = el('div', { class: 'mbody' });
      const alt = el('input', { class: 'ainput', type: 'text', value: m.alt || '', placeholder: 'Alt text', onChange: (e) => ctx.updateMedia(m.id, { alt: e.target.value }) });
      body.append(alt);
      const foot = el('div', { class: 'mfoot' },
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => { navigator.clipboard?.writeText(m.url); toast('URL copied', 'ok'); } }, 'Copy URL'),
        el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.deleteMedia(m) }, 'Delete'));
      card.append(body, foot);
      grid.append(card);
    }
  };

  const upload = async (files) => {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      await ctx.uploadMedia(file);
    }
  };
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { upload([...input.files]); input.value = ''; });
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));
  zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('is-over'); upload([...e.dataTransfer.files]); });

  render();
  return el('div', { class: 'content-wide' },
    el('div', { class: 'page-head' }, el('div', null, el('p', { class: 'eyebrow', text: 'Media' }), el('h2', { text: 'Image library' }), el('p', { class: 'muted', text: 'Uploads go to Supabase Storage and can be dropped into any image field.' }))),
    zone, input, el('div', { class: 'mt-2' }, grid));
}

/* ------------------------------------------------------------------ releases */
export function releasesView(state, ctx) {
  const list = el('div', { class: 'rows' });
  const render = () => {
    clear(list);
    const items = state.releases || [];
    if (!items.length) { list.append(el('div', { class: 'empty', text: 'No releases yet.' })); return; }
    for (const r of items) {
      const published = r.status === 'published';
      list.append(el('div', { class: 'row-card' },
        el('div', null,
          el('h4', { text: r.title }),
          el('p', { text: r.summary || '' }),
          el('p', { class: 'faint', text: `${when(r.created_at)} · ${r.slug || '—'}` })),
        el('div', { class: 'rtools' },
          el('span', { class: `chip ${published ? 'chip-live' : 'chip-draft'}`, text: r.status }),
          el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.editRelease(r) }, 'Edit'),
          el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.toggleRelease(r) }, published ? 'Unpublish' : 'Publish'),
          el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => ctx.deleteRelease(r) }, 'Delete'))));
    }
  };
  render();
  return el('div', { class: 'content-wide' },
    el('div', { class: 'page-head' },
      el('div', null, el('p', { class: 'eyebrow', text: 'Releases' }), el('h2', { text: 'Press releases' }), el('p', { class: 'muted', text: 'Published releases appear in the live newsroom feed.' })),
      el('div', { class: 'toolbar' }, el('button', { class: 'btn', type: 'button', onClick: () => ctx.editRelease(null) }, icon('plus'), 'New release'))),
    list);
}

export function releaseEditor(ctx, row) {
  const model = clone(row || { title: '', summary: '', body: '', slug: '', category: '', location: '', issuer: '', status: 'draft' });
  const published = el('label', { class: 'switch' },
    el('input', { type: 'checkbox', checked: model.status === 'published', onChange: (e) => { model.status = e.target.checked ? 'published' : 'draft'; } }),
    el('span', { class: 'track' }), el('span', { text: 'Published' }));
  const node = el('div', null, renderFields(RELEASE_FIELDS, model, ctx), el('div', { class: 'afield mt-2' }, published));
  return { node, model };
}

/* ------------------------------------------------------------------ settings */
export async function settingsView(state, ctx) {
  const box = el('div');
  const admins = el('div', { class: 'rows' });
  try {
    const rows = await ctx.sb.rest('/admins?select=email,role,display_name');
    clear(admins);
    rows.forEach((a) => admins.append(el('div', { class: 'row-card' }, el('div', null, el('h4', { text: a.email }), el('p', { class: 'faint', text: a.display_name || '' })), el('div', { class: 'rtools' }, el('span', { class: 'chip', text: a.role })))));
  } catch (e) { admins.append(el('div', { class: 'empty', text: e.message })); }

  box.append(
    el('div', { class: 'page-head' }, el('div', null, el('p', { class: 'eyebrow', text: 'Settings' }), el('h2', { text: 'Workspace' }))),
    el('div', { class: 'panel' }, el('div', { class: 'panel-head' }, el('h3', { text: 'Administrators' })),
      el('p', { class: 'faint', text: 'Add a user in Supabase → Authentication, then give them a row in the admins table.' }), admins),
    el('div', { class: 'panel' }, el('div', { class: 'panel-head' }, el('h3', { text: 'Publishing' })),
      el('p', { class: 'muted', text: 'Content is stored in Supabase. Publish triggers a GitHub Action that rebuilds the static site.' }),
      el('div', { class: 'toolbar mt-2' }, el('button', { class: 'btn', type: 'button', onClick: ctx.publish }, icon('rocket'), 'Publish site'))));
  return box;
}
