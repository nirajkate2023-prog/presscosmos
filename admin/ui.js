// PressCosmos admin — DOM helpers, components and the schema-driven form engine.
// No dependencies. Everything is plain DOM so the dashboard stays framework-free.

/* -------------------------------------------------------------------------- */
/*  DOM helpers                                                               */
/* -------------------------------------------------------------------------- */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) node.setAttribute(k, '');
    else node.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}
export const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };

/* Small inline icon set that echoes the public site's line icons. */
const PATHS = {
  grid: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.4"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',
  send: '<path d="M4.5 12.5 20 4l-6.2 16-2.4-6.1z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3.5 12.6 8.5 4.7 8.5-4.7"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
  rocket: '<path d="M5 15c-1.5 1.5-2 6-2 6s4.5-.5 6-2M14 4c3 0 6 3 6 6-1.5 4.5-6 8-6 8l-4-4s3.5-4.5 8-6"/>',
  check: '<path d="m4.5 12.5 5 5 10-10"/>',
  x: '<path d="M4 4l16 16M20 4 4 20"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 12h10M16 8l4 4-4 4"/>',
};
export function icon(name, cls = '') {
  const p = PATHS[name] || PATHS.grid;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  if (cls) svg.setAttribute('class', cls);
  svg.innerHTML = p;
  return svg;
}

/* -------------------------------------------------------------------------- */
/*  Toasts                                                                    */
/* -------------------------------------------------------------------------- */
let toastWrap;
export function toast(message, kind = '') {
  if (!toastWrap) { toastWrap = el('div', { class: 'toast-wrap' }); document.body.append(toastWrap); }
  const node = el('div', { class: `toast ${kind}` });
  node.append(el('span', { html: kind === 'err' ? '⚠' : kind === 'ok' ? '✓' : 'ℹ' }), el('span', { text: message }));
  toastWrap.append(node);
  setTimeout(() => { node.style.transition = 'opacity .3s'; node.style.opacity = '0'; setTimeout(() => node.remove(), 300); }, 3800);
}

/* -------------------------------------------------------------------------- */
/*  Modal / confirm                                                           */
/* -------------------------------------------------------------------------- */
export function modal({ title, body, actions = [], align = 'center' }) {
  return new Promise((resolve) => {
    const back = el('div', { class: `backdrop ${align}` });
    const close = (val) => { back.remove(); resolve(val); };
    back.addEventListener('mousedown', (e) => { if (e.target === back) close(null); });
    document.addEventListener('keydown', function onEsc(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', onEsc); close(null); } });
    const box = el('div', { class: back.classList.contains('top') ? 'palette' : 'modal', role: 'dialog', 'aria-modal': 'true' });
    if (title) box.append(el('h3', { text: title }));
    if (typeof body === 'string') box.append(el('p', { class: 'muted', text: body }));
    else if (body) box.append(body);
    const bar = el('div', { class: 'toolbar mt-3', style: { justifyContent: 'flex-end' } });
    for (const a of actions) {
      bar.append(el('button', { class: `btn ${a.variant || 'btn-ghost'} btn-sm`, type: 'button', text: a.label, onClick: () => close(a.value) }));
    }
    if (actions.length) box.append(bar);
    back.append(box);
    document.body.append(back);
    const first = box.querySelector('input, textarea, button');
    if (first) first.focus();
  });
}
export const confirmDialog = (message, confirmLabel = 'Delete') =>
  modal({ title: 'Are you sure?', body: message, actions: [{ label: 'Cancel', value: false }, { label: confirmLabel, value: true, variant: '' }] })
    .then((v) => v === true);

/* -------------------------------------------------------------------------- */
/*  Command palette                                                           */
/* -------------------------------------------------------------------------- */
export function openPalette(commands) {
  return new Promise((resolve) => {
    const back = el('div', { class: 'backdrop top' });
    const input = el('input', { type: 'text', placeholder: 'Search pages, content and actions…', 'aria-label': 'Command palette' });
    const list = el('div', { class: 'palette-list' });
    const box = el('div', { class: 'palette' }, input, list);
    back.append(box);
    let active = 0;
    let filtered = commands;

    const render = () => {
      clear(list);
      filtered.forEach((cmd, i) => {
        const item = el('div', { class: `palette-item ${i === active ? 'is-active' : ''}`, onClick: () => choose(cmd) },
          icon(cmd.icon || 'chevron'), el('span', { text: cmd.label }), cmd.group ? el('span', { class: 'k', text: cmd.group }) : null);
        list.append(item);
      });
      if (!filtered.length) list.append(el('div', { class: 'empty', text: 'No matches' }));
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      filtered = !q ? commands : commands.filter((c) => c.label.toLowerCase().includes(q) || (c.keywords || '').includes(q));
      active = 0; render();
    };
    const choose = (cmd) => { back.remove(); document.removeEventListener('keydown', onKey); resolve(cmd); };
    const onKey = (e) => {
      if (e.key === 'Escape') { back.remove(); document.removeEventListener('keydown', onKey); resolve(null); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) choose(filtered[active]); }
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', onKey);
    back.addEventListener('mousedown', (e) => { if (e.target === back) { back.remove(); document.removeEventListener('keydown', onKey); resolve(null); } });
    document.body.append(back);
    render(); input.focus();
  });
}

/* -------------------------------------------------------------------------- */
/*  Media picker                                                              */
/* -------------------------------------------------------------------------- */
export function openMediaPicker(sb) {
  return new Promise((resolve) => {
    const grid = el('div', { class: 'media-grid' });
    const wrap = el('div', null, el('p', { class: 'faint', text: 'Choose an image from the library.' }), grid);
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };
    modal({ title: 'Media library', body: wrap, actions: [{ label: 'Cancel', value: null }, { label: 'Use URL', value: '__url__' }] })
      .then((v) => { if (v === '__url__') { const url = prompt('Image URL'); done(url || null); } else done(null); });
    sb.rest('/media?select=url,alt,title&order=created_at.desc')
      .then((rows) => {
        clear(grid);
        if (!rows.length) { grid.append(el('div', { class: 'empty', text: 'No images yet — upload some in Media.' })); return; }
        rows.forEach((m) => grid.append(el('button', { class: 'media-card', type: 'button', style: { cursor: 'pointer', padding: '0', textAlign: 'left' }, onClick: () => done(m.url) },
          el('img', { src: m.url, alt: m.alt || '', loading: 'lazy' }),
          el('div', { class: 'mbody' }, el('span', { class: 'faint', text: m.alt || m.title || m.url.split('/').pop() })))));
      })
      .catch((err) => { clear(grid); grid.append(el('div', { class: 'empty', text: err.message })); });
  });
}

/* -------------------------------------------------------------------------- */
/*  Schema-driven form engine                                                 */
/* -------------------------------------------------------------------------- */
export function renderFields(fields, model, ctx = {}) {
  const wrap = el('div');
  for (const field of fields) wrap.append(renderField(field, model, ctx));
  return wrap;
}

function labelFor(field) {
  const lbl = el('label', { class: 'alabel', text: field.label });
  if (field.hint) lbl.append(el('span', { class: 'hint', text: '  ' + field.hint }));
  return lbl;
}

function renderField(field, model, ctx) {
  if (field.name && model[field.name] === undefined) {
    model[field.name] = field.type === 'boolean' ? false : field.type === 'list' ? [] : field.type === 'number' ? 0 : '';
  }
  const value = field.name ? model[field.name] : undefined;

  // Boolean → switch
  if (field.type === 'boolean') {
    const input = el('input', { type: 'checkbox', checked: !!value, onChange: (e) => { model[field.name] = e.target.checked; ctx.onChange?.(); } });
    return el('div', { class: 'afield' }, el('label', { class: 'switch' }, input, el('span', { class: 'track' }), el('span', { text: field.label })));
  }

  // Select
  if (field.type === 'select') {
    const sel = el('select', { class: 'aselect', onChange: (e) => { model[field.name] = e.target.value; ctx.onChange?.(); } });
    for (const opt of field.options) sel.append(el('option', { value: opt, selected: opt === value }, opt));
    return el('div', { class: 'afield' }, labelFor(field), sel);
  }

  // Image
  if (field.type === 'image') {
    const thumb = el('img', { class: 'thumb', src: value || '', alt: '' });
    const preview = el('div', { class: 'preview' }, thumb);
    const input = el('input', { class: 'ainput', type: 'text', value: value || '', placeholder: '/assets/img/… or https://…', onInput: (e) => { model[field.name] = e.target.value; thumb.src = e.target.value; ctx.onChange?.(); } });
    const upload = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Upload' });
    const choose = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Choose' });
    upload.addEventListener('click', () => ctx.onUpload?.().then((url) => { if (url) { input.value = url; thumb.src = url; model[field.name] = url; ctx.onChange?.(); } }));
    choose.addEventListener('click', () => ctx.onPick?.().then((url) => { if (url) { input.value = url; thumb.src = url; model[field.name] = url; ctx.onChange?.(); } }));
    return el('div', { class: 'afield' }, labelFor(field), preview, input, el('div', { class: 'toolbar' }, upload, choose));
  }

  // Nested object
  if (field.fields && field.type !== 'list') {
    const box = el('div', { class: 'panel mt-2' }, el('div', { class: 'panel-head' }, el('h3', { text: field.label })));
    if (!model[field.name] || typeof model[field.name] !== 'object') model[field.name] = {};
    box.append(renderFields(field.fields, model[field.name], ctx));
    return box;
  }

  // List (repeater)
  if (field.type === 'list') return renderRepeater(field, model, ctx);

  // Primitives: text / email / url / number / textarea
  const isArea = field.type === 'textarea';
  let input;
  if (isArea) {
    input = el('textarea', { class: `atextarea ${field.mono ? 'mono' : ''}`, onInput: (e) => { model[field.name] = e.target.value; ctx.onChange?.(); } });
    input.value = value ?? '';
  } else {
    input = el('input', { class: 'ainput', type: field.type === 'number' ? 'number' : field.type || 'text', value: value ?? '', onInput: (e) => { model[field.name] = field.type === 'number' ? Number(e.target.value) : e.target.value; ctx.onChange?.(); } });
  }
  return el('div', { class: 'afield' }, labelFor(field), input);
}

function renderRepeater(field, model, ctx) {
  if (!Array.isArray(model[field.name])) model[field.name] = [];
  const arr = model[field.name];
  const list = el('div', { class: 'repeater' });

  const title = (item, i) => {
    const v = field.summary ? item?.[field.summary] : (typeof item === 'string' ? item : null);
    return String((v ?? item?.[field.fields?.[0]?.name]) || `${field.itemLabel || 'item'} ${i + 1}`).slice(0, 70);
  };

  const reindex = () => { clear(list); arr.forEach((it, i) => list.append(row(it, i))); ctx.onChange?.(); };

  const move = (i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; reindex(); };
  const del = (i) => { arr.splice(i, 1); reindex(); };

  const row = (item, i) => {
    // List of primitives
    if (field.itemType) {
      let input;
      if (field.itemType === 'textarea') {
        input = el('textarea', { class: 'atextarea', style: { minHeight: '60px' }, onInput: (e) => { arr[i] = e.target.value; ctx.onChange?.(); } });
        input.value = item ?? '';
      } else {
        input = el('input', { class: 'ainput', type: 'text', value: item ?? '', onInput: (e) => { arr[i] = e.target.value; ctx.onChange?.(); } });
      }
      const tools = el('div', { class: 'rtools' }, iconBtn('chevron', () => {}), iconBtn('up', () => move(i, -1)), iconBtn('down', () => move(i, 1)), iconBtn('trash', () => del(i), 'danger'));
      tools.children[0].style.visibility = 'hidden';
      return el('div', { class: 'rrow is-open' }, el('div', { class: 'rrow-head' }, el('span', { class: 'handle', text: '⋮⋮' }), input, tools));
    }

    // List of objects
    const rrow = el('div', { class: 'rrow' });
    const head = el('div', { class: 'rrow-head' });
    const titleEl = el('span', { class: 'rtitle', text: title(item, i) });
    const handle = el('span', { class: 'handle', draggable: 'true', title: 'Drag to reorder', text: '⋮⋮' });
    handle.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', String(i)); rrow.classList.add('dragging'); });
    handle.addEventListener('dragend', () => rrow.classList.remove('dragging'));
    rrow.addEventListener('dragover', (e) => { e.preventDefault(); rrow.classList.add('drop-target'); });
    rrow.addEventListener('dragleave', () => rrow.classList.remove('drop-target'));
    rrow.addEventListener('drop', (e) => {
      e.preventDefault(); rrow.classList.remove('drop-target');
      const from = Number(e.dataTransfer.getData('text/plain')); const to = i;
      if (Number.isInteger(from) && from !== to) { const [m] = arr.splice(from, 1); arr.splice(to, 0, m); reindex(); }
    });
    const toggle = iconBtn('chevron', () => rrow.classList.toggle('is-open'));
    const tools = el('div', { class: 'rtools' }, toggle, iconBtn('up', () => move(i, -1)), iconBtn('down', () => move(i, 1)), iconBtn('trash', () => del(i), 'danger'));
    head.append(handle, titleEl, tools);
    const body = el('div', { class: 'rrow-body' });
    const itemModel = item && typeof item === 'object' ? item : (arr[i] = {});
    body.append(renderFields(field.fields, itemModel, { ...ctx, onChange: () => { titleEl.textContent = title(itemModel, i); ctx.onChange?.(); } }));
    rrow.append(head, body);
    return rrow;
  };

  arr.forEach((it, i) => list.append(row(it, i)));

  const addBtn = el('button', { class: 'btn btn-ghost btn-sm mt-1', type: 'button' }, icon('plus'), `Add ${field.itemLabel || 'item'}`);
  addBtn.addEventListener('click', () => { arr.push(field.fields ? {} : ''); reindex(); const rows = list.querySelectorAll('.rrow'); const last = rows[rows.length - 1]; if (last) last.classList.add('is-open'); });

  const box = el('div', { class: 'afield' }, el('div', { class: 'panel-head' }, el('span', { class: 'alabel', text: field.label })), list, addBtn);
  return box;
}

function iconBtn(name, onClick, extra = '') {
  return el('button', { class: `iconbtn ${extra}`, type: 'button', title: name, onClick, html: '' }, icon(name));
}
