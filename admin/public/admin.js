// PressCosmos admin — panel application.
//
// Renders every editor from the schema the server sends, so the panel and the
// content model cannot drift apart. All value writes go through the events
// attached below; nothing user-supplied is ever injected as HTML.

const root = document.getElementById('root');

const state = {
  csrf: null,
  username: null,
  schema: null,
  values: {},
  overriddenSections: [],
  pages: [],
  media: [],
};

/* ------------------------------------------------------------------ helpers */

function append(parent, children) {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    if (Array.isArray(child)) append(parent, child);
    else if (child instanceof Node) parent.appendChild(child);
    else parent.appendChild(document.createTextNode(String(child)));
  }
}

function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'dataset') Object.assign(el.dataset, value);
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, String(value));
  }
  append(el, children);
  return el;
}

const getPath = (object, path) => path.split('.').reduce((acc, key) => (acc === null || acc === undefined ? acc : acc[key]), object);

function setPath(object, path, value) {
  const parts = path.split('.');
  let cursor = object;
  for (const key of parts.slice(0, -1)) {
    if (typeof cursor[key] !== 'object' || cursor[key] === null) cursor[key] = {};
    cursor = cursor[key];
  }
  cursor[parts.at(-1)] = value;
}

function toast(message, kind = 'info') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = h('div', { class: 'toast-wrap' });
    document.body.appendChild(wrap);
  }
  const node = h('div', { class: `toast toast-${kind}` }, message);
  wrap.appendChild(node);
  setTimeout(() => node.remove(), kind === 'err' ? 8000 : 4500);
}

async function api(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (state.csrf) headers['x-csrf-token'] = state.csrf;

  const res = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();

  let data = {};
  if (text) {
    try { data = JSON.parse(text); } catch { data = { error: text }; }
  }
  if (!res.ok) {
    if (res.status === 401 && path !== '/api/login' && path !== '/api/setup') {
      state.csrf = null;
      state.username = null;
      renderLogin();
    }
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

const bytes = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/* -------------------------------------------------------------- auth screens */

function renderSetup() {
  const username = h('input', { type: 'text', autocomplete: 'username', placeholder: 'admin' });
  const password = h('input', { type: 'password', autocomplete: 'new-password' });
  const confirm = h('input', { type: 'password', autocomplete: 'new-password' });
  const status = h('p', { class: 'hint' });

  const submit = async (event) => {
    event.preventDefault();
    if (password.value !== confirm.value) {
      status.textContent = 'The two passwords do not match.';
      return;
    }
    try {
      const data = await api('/api/setup', { method: 'POST', body: { username: username.value, password: password.value } });
      state.csrf = data.csrf;
      state.username = data.username;
      toast('Admin account created. Welcome.', 'ok');
      await loadAll();
      renderApp();
    } catch (err) {
      status.textContent = err.message;
    }
  };

  root.replaceChildren(h('main', { class: 'auth' }, h('form', { class: 'auth-card', onsubmit: submit },
    h('div', { class: 'auth-mark' }, h('span', { class: 'auth-dot' }), 'PressCosmos admin'),
    h('h1', {}, 'Create your admin account'),
    h('p', { class: 'lede' }, 'This is a one-time step. The password is stored as a salted hash in admin/.auth.json, which is never committed to git and never uploaded to the web server.'),
    h('div', { class: 'field' }, h('label', {}, 'Username'), username),
    h('div', { class: 'field' }, h('label', {}, 'Password'), password, h('p', { class: 'hint' }, 'At least 10 characters, with a letter and a number.')),
    h('div', { class: 'field' }, h('label', {}, 'Confirm password'), confirm),
    h('div', { class: 'field' }, h('button', { class: 'btn btn-primary', type: 'submit' }, 'Create account and sign in')),
    status,
  )));
}

function renderLogin() {
  const username = h('input', { type: 'text', autocomplete: 'username' });
  const password = h('input', { type: 'password', autocomplete: 'current-password' });
  const status = h('p', { class: 'hint' });

  const submit = async (event) => {
    event.preventDefault();
    status.textContent = 'Checking…';
    try {
      const data = await api('/api/login', { method: 'POST', body: { username: username.value, password: password.value } });
      state.csrf = data.csrf;
      state.username = data.username;
      await loadAll();
      renderApp();
    } catch (err) {
      status.textContent = err.message;
    }
  };

  root.replaceChildren(h('main', { class: 'auth' }, h('form', { class: 'auth-card', onsubmit: submit },
    h('div', { class: 'auth-mark' }, h('span', { class: 'auth-dot' }), 'PressCosmos admin'),
    h('h1', {}, 'Sign in'),
    h('p', { class: 'lede' }, 'Sign in to edit your website content.'),
    h('div', { class: 'field' }, h('label', {}, 'Username'), username),
    h('div', { class: 'field' }, h('label', {}, 'Password'), password),
    h('div', { class: 'field' }, h('button', { class: 'btn btn-primary', type: 'submit' }, 'Sign in')),
    status,
  )));
}

/* ------------------------------------------------------------------ data load */

async function loadAll() {
  const [schema, content, pages, media] = await Promise.all([
    api('/api/schema'),
    api('/api/content'),
    api('/api/pages'),
    api('/api/media'),
  ]);
  state.schema = schema;
  state.values = content.values;
  state.overriddenSections = content.overriddenSections;
  state.pages = pages.pages;
  state.media = media.media;
}

/* -------------------------------------------------------------------- shell */

const BOOT = async () => {
  let session;
  try {
    session = await api('/api/session');
  } catch (err) {
    root.className = 'boot is-error';
    root.textContent = `Could not reach the admin server.\n\n${err.message}`;
    return;
  }

  if (!session.configured) return renderSetup();
  if (!session.authenticated) return renderLogin();

  state.csrf = session.csrf;
  state.username = session.username;
  try {
    await loadAll();
  } catch (err) {
    root.className = 'boot is-error';
    root.textContent = err.message;
    return;
  }
  renderApp();
};

function navigate(hash) {
  if (location.hash === hash) renderRoute();
  else location.hash = hash;
}

function renderApp() {
  root.className = '';
  root.replaceChildren(h('div', { class: 'shell', id: 'shell' }));
  renderRoute();
  window.addEventListener('hashchange', renderRoute);
}

const NAV = () => {
  const sections = state.schema?.sections || [];
  return [
    { group: 'Overview', items: [
      { label: 'Dashboard', hash: '#/dashboard' },
      { label: 'Publish', hash: '#/publish' },
    ] },
    { group: 'Pages & media', items: [
      { label: 'Pages', hash: '#/pages' },
      { label: 'Media library', hash: '#/media' },
      { label: 'Find & replace', hash: '#/replace' },
    ] },
    { group: 'Site content', items: sections.map((s) => ({ label: s.label, hash: `#/section/${s.key}` })) },
    { group: 'Account', items: [{ label: 'Password & session', hash: '#/account' }] },
  ];
};

function renderRoute() {
  const shell = document.getElementById('shell');
  if (!shell) return;

  const raw = location.hash.replace(/^#\/?/, '');
  const [head, param] = raw.split('/');
  const route = head || 'dashboard';

  const active = route === 'page' ? '#/pages' : route === 'section' ? `#/section/${param}` : `#/${route}`;

  const side = h('aside', { class: 'side' },
    h('div', { class: 'side-brand' }, h('span', { class: 'auth-dot' }), 'PressCosmos'),
    NAV().map((section) => h('nav', { class: 'side-group' },
      h('h2', {}, section.group),
      section.items.map((item) => h('a', {
        class: `navlink${active === item.hash ? ' is-active' : ''}`,
        href: item.hash,
      }, item.label)),
    )),
  );

  const main = h('div', { class: 'main' });
  shell.replaceChildren(side, main);

  const view = h('div', { class: 'view' });
  main.appendChild(view);

  const titles = { dashboard: 'Dashboard', pages: 'Pages', media: 'Media library', replace: 'Find & replace', publish: 'Publish', account: 'Password & session' };
  const heading = route === 'section'
    ? (state.schema?.sections.find((s) => s.key === param)?.label || 'Edit')
    : route === 'page' ? 'Edit page' : (titles[route] || 'Admin');

  const bar = h('header', { class: 'topbar' },
    h('div', {}, h('h1', {}, heading), h('p', { class: 'sub' }, `Signed in as ${state.username}`)),
    h('div', { class: 'cluster', style: 'display:flex;gap:.5rem' },
      h('a', { class: 'btn btn-sm', href: '/site/', target: '_blank', rel: 'noopener' }, 'View site'),
      h('button', { class: 'btn btn-sm', type: 'button', onclick: signOut }, 'Sign out'),
    ),
  );
  main.insertBefore(bar, view);

  const views = {
    dashboard: viewDashboard,
    pages: viewPages,
    page: (target) => viewPage(target, param),
    media: viewMedia,
    replace: viewReplace,
    publish: viewPublish,
    account: viewAccount,
    section: (target) => viewSection(target, param),
  };
  (views[route] || viewDashboard)(view);
}

async function signOut() {
  try { await api('/api/logout', { method: 'POST', body: {} }); } catch { /* signing out anyway */ }
  state.csrf = null;
  renderLogin();
}

/* ------------------------------------------------------- generic field inputs */

// A scalar control is wrapped in its <label> so clicking the text focuses the
// input and screen readers announce the pairing. A nested repeater cannot be
// wrapped in a label, so it gets a plain heading instead.
function fieldRow(label, control, options = {}) {
  const hint = options.hint ? h('p', { class: 'hint' }, options.hint) : null;
  if (options.nestable) {
    return h('div', { class: 'field' }, h('span', { class: 'label' }, label), control, hint);
  }
  return h('label', { class: 'field' }, h('span', { class: 'label' }, label), control, hint);
}

function fieldControl(field, value, onChange) {
  switch (field.type) {
    case 'number':
      return h('input', { type: 'number', value: value ?? 0, oninput: (e) => onChange(Number(e.target.value) || 0) });

    case 'textarea':
      return h('textarea', { rows: field.rows || 4, placeholder: field.placeholder || '', value: value ?? '', oninput: (e) => onChange(e.target.value) });

    case 'bool':
      return h('input', { type: 'checkbox', checked: Boolean(value), onchange: (e) => onChange(e.target.checked) });

    case 'lines':
      return h('textarea', {
        rows: field.rows || 5,
        placeholder: field.placeholder || 'One per line',
        value: (Array.isArray(value) ? value : []).join('\n'),
        oninput: (e) => onChange(e.target.value.split('\n').map((line) => line.trim()).filter(Boolean)),
      });

    case 'select':
      return h('select', { onchange: (e) => onChange(e.target.value) },
        (field.options || []).map((option) => h('option', { value: option, selected: option === value }, option)));

    case 'pairs':
      return repeater({
        items: Array.isArray(value) ? value : [],
        fields: field.pairFields,
        itemName: 'link',
        onChange,
      });

    default:
      return h('input', { type: 'text', placeholder: field.placeholder || '', value: value ?? '', oninput: (e) => onChange(e.target.value) });
  }
}

const fieldRowFor = (field, value, onChange) => fieldRow(
  field.label,
  fieldControl(field, value, onChange),
  { nestable: field.type === 'pairs' || field.type === 'bool' },
);

function repeater({ items, fields, itemName = 'item', titleField, onChange }) {
  const current = (Array.isArray(items) ? items : []).map((item) => ({ ...item }));
  const wrap = h('div');

  const commit = (structural) => {
    onChange(current.map((item) => ({ ...item })));
    if (structural) draw();
  };

  function draw() {
    wrap.replaceChildren();

    if (!current.length) wrap.appendChild(h('p', { class: 'empty' }, `Nothing here yet — add your first ${itemName}.`));

    current.forEach((item, index) => {
      const key = titleField || fields[0].key;
      const card = h('div', { class: 'item' },
        h('div', { class: 'item-bar' },
          h('strong', {}, item[key] || `${itemName} ${index + 1}`),
          h('div', { class: 'item-actions' },
            h('button', { class: 'btn btn-icon', type: 'button', title: 'Move up', disabled: index === 0, onclick: () => move(index, -1) }, '↑'),
            h('button', { class: 'btn btn-icon', type: 'button', title: 'Move down', disabled: index === current.length - 1, onclick: () => move(index, 1) }, '↓'),
            h('button', { class: 'btn btn-icon btn-danger', type: 'button', title: 'Remove', onclick: () => remove(index) }, '✕'),
          ),
        ),
      );

      const grid = h('div', { class: 'grid-2' });
      for (const field of fields) {
        grid.appendChild(fieldRowFor(field, item[field.key], (v) => {
          current[index] = { ...current[index], [field.key]: v };
          commit(false);
        }));
      }
      card.appendChild(grid);
      wrap.appendChild(card);
    });

    wrap.appendChild(h('button', {
      class: 'btn btn-sm',
      type: 'button',
      onclick: () => {
        const blank = {};
        for (const field of fields) blank[field.key] = field.type === 'lines' || field.type === 'pairs' ? [] : field.type === 'bool' ? false : field.type === 'number' ? 0 : '';
        current.push(blank);
        commit(true);
      },
    }, `+ Add ${itemName}`));
  }

  function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= current.length) return;
    [current[index], current[target]] = [current[target], current[index]];
    commit(true);
  }

  function remove(index) {
    current.splice(index, 1);
    commit(true);
  }

  draw();
  return wrap;
}

/* ----------------------------------------------------------------- dashboard */

function viewDashboard(view) {
  const editedPages = state.pages.filter((p) => p.overridden.length).length;
  const sections = state.schema?.sections || [];

  view.appendChild(h('div', { class: 'grid-2' },
    card('Pages', `${state.pages.length}`, `${editedPages} edited by you`),
    card('Site sections', `${sections.length}`, `${state.overriddenSections.length} edited by you`),
    card('Images', `${state.media.length}`, 'in assets/img'),
  ));

  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, 'How this works'), h('p', {}, 'Edit anything, then publish. The panel regenerates the whole site from your content and pushes it, so navigation, footer, sitemap and structured data stay consistent.')),
    ),
    h('ol', { style: 'margin:0;padding-left:1.2rem;color:var(--muted);font-size:.9rem' },
      h('li', {}, 'Change content, links, prices or images using the sections on the left.'),
      h('li', {}, 'Press Save on each section you edit.'),
      h('li', {}, 'Open Publish to rebuild, check every link, and push the change live.'),
    ),
  ));

  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' }, h('div', {}, h('h2', {}, 'Handy to know'))),
    h('ul', { style: 'margin:0;padding-left:1.2rem;color:var(--muted);font-size:.9rem' },
      h('li', {}, 'Changing a brand or contact detail updates every page that uses it, including structured data and llms.txt.'),
      h('li', {}, 'Renaming an industry or legal page also updates the menu and footer entries built from it.'),
      h('li', {}, 'If you edit a page body, that page stops picking up future site-wide changes — use Reset to default to start again.'),
      h('li', {}, 'You can always see your edits live before publishing via View site.'),
    ),
  ));

  view.appendChild(h('div', { class: 'toolbar' },
    h('button', { class: 'btn btn-primary', type: 'button', onclick: () => navigate('#/publish') }, 'Go to publish'),
    h('a', { class: 'btn', href: '/site/', target: '_blank', rel: 'noopener' }, 'Preview the site'),
    h('button', {
      class: 'btn', type: 'button',
      onclick: async (e) => {
        e.target.disabled = true;
        e.target.textContent = 'Rebuilding…';
        try {
          const result = await api('/api/build', { method: 'POST', body: {} });
          toast(result.ok ? 'Preview rebuilt.' : `Rebuild problem: ${result.stage}`, result.ok ? 'ok' : 'err');
        } catch (err) { toast(err.message, 'err'); }
        e.target.disabled = false;
        e.target.textContent = 'Rebuild preview';
      },
    }, 'Rebuild preview'),
  ));
}

const card = (label, value, note) => h('div', { class: 'panel' },
  h('p', { class: 'hint', style: 'margin:0' }, label),
  h('p', { style: 'font-size:2rem;font-weight:650;margin:.2rem 0 0;letter-spacing:-.02em' }, value),
  h('p', { class: 'hint', style: 'margin:.15rem 0 0' }, note),
);

/* ---------------------------------------------------------------- section edit */

function viewSection(view, key) {
  const section = state.schema?.sections.find((s) => s.key === key);
  if (!section) {
    view.appendChild(h('p', { class: 'empty' }, 'Unknown section.'));
    return;
  }

  let draft = structuredClone(state.values[key] ?? (section.kind === 'strings' ? [] : {}));
  const isOverridden = () => state.overriddenSections.includes(key);

  const body = h('div');

  const draw = () => {
    body.replaceChildren();

    if (isOverridden()) body.appendChild(h('p', {}, h('span', { class: 'badge badge-edited' }, 'Edited')));
    if (section.help) body.appendChild(h('p', { class: 'hint', style: 'margin:.4rem 0 1rem' }, section.help));

    if (section.kind === 'strings') {
      body.appendChild(fieldRow(
        section.label,
        fieldControl({ type: 'lines', rows: 14, placeholder: 'One per line' }, draft, (v) => { draft = v; }),
      ));
      return;
    }

    if (section.kind === 'object') {
      const grid = h('div', { class: 'grid-2' });
      for (const field of section.fields) {
        grid.appendChild(fieldRowFor(field, getPath(draft, field.key), (v) => setPath(draft, field.key, v)));
      }
      body.appendChild(grid);
      return;
    }

    if (section.kind === 'groups') {
      for (const group of section.groups) {
        body.appendChild(h('div', { class: 'panel' },
          h('div', { class: 'panel-head' }, h('div', {}, h('h2', {}, groupLabel(group)))),
          repeater({
            items: draft[group] || [],
            fields: section.fields,
            itemName: 'question',
            titleField: section.titleField,
            onChange: (items) => { draft[group] = items; },
          }),
        ));
      }
      return;
    }

    body.appendChild(repeater({
      items: draft,
      fields: section.fields,
      itemName: section.itemName || 'item',
      titleField: section.titleField,
      onChange: (items) => { draft = items; },
    }));
  };

  draw();

  const save = async (button) => {
    button.disabled = true;
    button.textContent = 'Saving…';
    try {
      const result = await api('/api/section', { method: 'POST', body: { key, value: draft } });
      state.values[key] = result.value;
      if (!state.overriddenSections.includes(key)) state.overriddenSections.push(key);
      toast(`Saved ${section.label}.`, 'ok');
      renderRoute();
    } catch (err) {
      toast(err.message, 'err');
      button.disabled = false;
      button.textContent = 'Save changes';
    }
  };

  const reset = async () => {
    if (!confirm(`Reset ${section.label} to the original content? Your edits here are discarded.`)) return;
    try {
      const result = await api('/api/section/reset', { method: 'POST', body: { key } });
      state.values[key] = result.value;
      state.overriddenSections = state.overriddenSections.filter((k) => k !== key);
      toast(`${section.label} reset to the default.`, 'ok');
      renderRoute();
    } catch (err) { toast(err.message, 'err'); }
  };

  view.appendChild(h('section', { class: 'panel' }, body));

  view.appendChild(h('div', { class: 'sticky-actions' },
    h('button', { class: 'btn btn-primary', type: 'button', onclick: (e) => save(e.target) }, 'Save changes'),
    isOverridden() ? h('button', { class: 'btn btn-danger', type: 'button', onclick: reset }, 'Reset to default') : null,
    h('button', { class: 'btn', type: 'button', onclick: () => navigate('#/publish') }, 'Publish'),
  ));
}

const groupLabel = (group) => ({ general: 'General questions', pricing: 'Pricing questions', ai: 'AI visibility questions', distribution: 'Distribution questions' }[group] || group);

/* -------------------------------------------------------------------- pages */

function viewPages(view) {
  const filter = h('input', { type: 'text', placeholder: 'Filter pages by slug or title…', oninput: () => draw() });
  const table = h('table', { class: 'table' });
  const body = h('tbody');

  function draw() {
    const term = filter.value.trim().toLowerCase();
    const rows = state.pages.filter((page) => !term
      || page.slug.includes(term)
      || String(page.title).toLowerCase().includes(term));

    body.replaceChildren(...(rows.length ? rows.map((page) => h('tr', {},
      h('td', {}, h('a', { href: `#/page/${page.slug}` }, page.slug),
        page.overridden.length ? h('div', {}, h('span', { class: 'badge badge-edited' }, 'edited')) : null),
      h('td', {}, String(page.title).split('|')[0].trim()),
      h('td', { class: 'hint' }, page.url),
      h('td', {}, h('a', { class: 'btn btn-sm', href: `#/page/${page.slug}` }, 'Edit')),
    )) : [h('tr', {}, h('td', { colspan: 4, class: 'empty' }, 'No pages match that filter.'))]));
  }

  draw();

  view.appendChild(h('div', { class: 'toolbar' }, filter));
  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' }, h('div', {},
      h('h2', {}, `${state.pages.length} pages`),
      h('p', {}, 'Edit the SEO title, description, keywords and body of any page. Bodies are HTML — use the preview to check your work.'))),
    table,
  ));
  table.appendChild(h('thead', {}, h('tr', {}, h('th', {}, 'Slug'), h('th', {}, 'Title'), h('th', {}, 'URL'), h('th', {}, ''))));
  table.appendChild(body);
}

async function viewPage(view, slug) {
  let page;
  try {
    page = (await api(`/api/page?slug=${encodeURIComponent(slug)}`)).page;
  } catch (err) {
    view.appendChild(h('p', { class: 'empty' }, err.message));
    return;
  }

  const draft = {
    title: page.effective.title,
    description: page.effective.description,
    keywords: (page.effective.keywords || []).join(', '),
    body: page.effective.body,
  };
  const overridden = new Set(page.overridden);

  const frame = h('iframe', { class: 'preview-frame', src: `/site/${slug}.html`, title: 'Page preview' });

  const labelled = (label, control, hint) => fieldRow(label, control, { hint });

  const editor = h('section', { class: 'panel' },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, slug === 'index' ? 'Home page' : slug),
        h('p', {}, `Live URL: ${page.url}${page.meta.noindex ? ' — this page is excluded from search engines' : ''}`)),
      overridden.size ? h('span', { class: 'badge badge-edited' }, 'edited') : null,
    ),
    h('div', { class: 'grid-2' },
      labelled('SEO title', h('input', { type: 'text', value: draft.title, oninput: (e) => { draft.title = e.target.value; } })),
      labelled('Keywords', h('input', { type: 'text', value: draft.keywords, placeholder: 'comma, separated', oninput: (e) => { draft.keywords = e.target.value; } })),
    ),
    labelled('Meta description', h('textarea', { rows: 2, value: draft.description, oninput: (e) => { draft.description = e.target.value; } }), 'Shown in search results and social shares. Around 150–160 characters is ideal.'),
    labelled('Page content (HTML)', h('textarea', { class: 'code', value: draft.body, spellcheck: 'false', oninput: (e) => { draft.body = e.target.value; } }), 'The editable part of the page. The header, footer, menu and structured data are added automatically.'),
  );

  const save = async (button) => {
    button.disabled = true;
    button.textContent = 'Saving…';
    try {
      const result = await api('/api/page', {
        method: 'POST',
        body: { slug, patch: { title: draft.title, description: draft.description, keywords: draft.keywords, body: draft.body } },
      });
      page = result.page;
      const listed = state.pages.find((p) => p.slug === slug);
      if (listed) {
        listed.title = page.effective.title;
        listed.overridden = page.overridden;
      }
      toast('Page saved. Rebuild the preview to see it.', 'ok');
      button.disabled = false;
      button.textContent = 'Save page';
    } catch (err) {
      toast(err.message, 'err');
      button.disabled = false;
      button.textContent = 'Save page';
    }
  };

  const reset = async () => {
    if (!confirm('Reset this page to the original content? Your edits are discarded.')) return;
    try {
      await api('/api/page/reset', { method: 'POST', body: { slug } });
      toast('Page reset to the default.', 'ok');
      renderRoute();
    } catch (err) { toast(err.message, 'err'); }
  };

  const rebuild = async (button) => {
    button.disabled = true;
    button.textContent = 'Rebuilding…';
    try {
      const result = await api('/api/build', { method: 'POST', body: {} });
      if (!result.ok) toast(`Rebuild stopped at the ${result.stage} step. See Publish for details.`, 'err');
      else {
        frame.src = `/site/${slug}.html?t=${Date.now()}`;
        toast('Preview rebuilt.', 'ok');
      }
    } catch (err) { toast(err.message, 'err'); }
    button.disabled = false;
    button.textContent = 'Rebuild preview';
  };

  view.appendChild(editor);
  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, 'Preview'),
        h('p', {}, 'This is the generated page. Save, then rebuild to see your edits.')),
      h('div', { style: 'display:flex;gap:.5rem' },
        h('button', { class: 'btn btn-sm', type: 'button', onclick: (e) => rebuild(e.target) }, 'Rebuild preview'),
        h('a', { class: 'btn btn-sm', href: `/site/${slug}.html`, target: '_blank', rel: 'noopener' }, 'Open in new tab'),
      ),
    ),
    frame,
  ));

  view.appendChild(h('div', { class: 'sticky-actions' },
    h('button', { class: 'btn btn-primary', type: 'button', onclick: (e) => save(e.target) }, 'Save page'),
    overridden.size ? h('button', { class: 'btn btn-danger', type: 'button', onclick: reset }, 'Reset to default') : null,
    h('a', { class: 'btn', href: '#/pages' }, 'Back to pages'),
  ));
}

/* -------------------------------------------------------------------- media */

function viewMedia(view) {
  const grid = h('div', { class: 'media-grid' });

  const draw = () => {
    grid.replaceChildren(...(state.media.length
      ? state.media.map((item) => h('div', { class: 'media-card' },
        h('img', { src: `/${item.path}`, alt: item.file, loading: 'lazy' }),
        h('div', { class: 'media-meta' },
          h('code', {}, item.path),
          h('p', { class: 'hint', style: 'margin:.3rem 0 0' }, bytes(item.bytes)),
          h('div', { class: 'media-actions' },
            h('button', {
              class: 'btn btn-sm', type: 'button',
              onclick: async () => {
                try { await navigator.clipboard.writeText(`/${item.path}`); toast('Path copied.', 'ok'); }
                catch { toast(`/${item.path}`, 'info'); }
              },
            }, 'Copy path'),
            h('button', {
              class: 'btn btn-sm btn-danger', type: 'button',
              onclick: async () => {
                if (!confirm(`Delete ${item.file}? Pages that use it will show a broken image.`)) return;
                try {
                  await api('/api/media/delete', { method: 'POST', body: { file: item.file } });
                  state.media = state.media.filter((m) => m.file !== item.file);
                  draw();
                  toast('Image deleted.', 'ok');
                } catch (err) { toast(err.message, 'err'); }
              },
            }, 'Delete'),
          ),
        ),
      )) : [h('p', { class: 'empty' }, 'No images yet. Upload one below.')]));
  };

  draw();

  const picker = h('input', {
    type: 'file', accept: 'image/*', multiple: true,
    onchange: async (event) => {
      const files = [...event.target.files];
      for (const file of files) {
        try {
          const data = await new Promise((resolvePromise, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolvePromise(String(reader.result).split(',')[1]);
            reader.onerror = () => reject(new Error('Could not read that file.'));
            reader.readAsDataURL(file);
          });
          const result = await api('/api/media', { method: 'POST', body: { filename: file.name, data } });
          state.media.unshift({ file: result.file, path: result.path, bytes: file.size, modified: new Date().toISOString() });
          toast(`Uploaded ${result.file}`, 'ok');
        } catch (err) {
          toast(`${file.name}: ${err.message}`, 'err');
        }
      }
      event.target.value = '';
      draw();
    },
  });

  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, 'Upload an image'),
        h('p', {}, 'Files are saved to assets/img and committed with the site. PNG, JPG, WEBP, GIF, SVG, AVIF or ICO, up to 8 MB each. Use Copy path to get the URL to paste into a page.')),
      picker),
    grid,
  ));
}

/* ------------------------------------------------------------ find & replace */

function viewReplace(view) {
  const find = h('input', { type: 'text', placeholder: 'Text or link to find…' });
  const text = h('input', { type: 'text', placeholder: 'Replace with…' });
  const scope = h('select', {},
    h('option', { value: 'content' }, 'Page content and site data'),
    h('option', { value: 'pages' }, 'Generated HTML pages'),
    h('option', { value: 'assets' }, 'CSS and JavaScript'),
    h('option', { value: 'all' }, 'Everything'),
  );
  const output = h('div');

  const runReplace = async (confirmStep) => {
    output.replaceChildren(h('p', { class: 'empty' }, 'Searching…'));
    try {
      const result = await api('/api/replace', {
        method: 'POST',
        body: { find: find.value, text: text.value, scope: scope.value, confirm: confirmStep },
      });

      if (!result.total) {
        output.replaceChildren(h('p', { class: 'empty' }, 'No matches found.'));
        return;
      }

      output.replaceChildren(
        h('p', {}, confirmStep
          ? `Replaced ${result.total} occurrence(s) across ${result.results.length} file(s). Rebuild the site to apply.`
          : `Found ${result.total} occurrence(s) across ${result.results.length} file(s):`),
        h('table', { class: 'table' },
          h('thead', {}, h('tr', {}, h('th', {}, 'File'), h('th', {}, 'Matches'), h('th', {}, 'Examples'))),
          h('tbody', {}, result.results.map((entry) => h('tr', {},
            h('td', {}, h('code', {}, entry.file)),
            h('td', {}, String(entry.count)),
            h('td', { class: 'hint' }, entry.samples.map((sample) => h('div', {}, sample))),
          ))),
        ),
      );

      if (confirmStep) {
        toast(`Replaced ${result.total} occurrence(s).`, 'ok');
        output.appendChild(h('p', { class: 'hint' }, 'Open Publish to rebuild, check and push. Git keeps the previous version if you need to undo.'));
      } else {
        output.appendChild(h('div', { class: 'toolbar', style: 'margin-top:1rem' },
          h('button', {
            class: 'btn btn-danger', type: 'button',
            onclick: () => {
              if (confirm(`Replace all ${result.total} occurrence(s)?`)) runReplace(true);
            },
          }, `Replace all ${result.total}`),
        ));
      }
    } catch (err) {
      output.replaceChildren(h('p', { class: 'empty' }, err.message));
    }
  };

  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, 'Find & replace everywhere'),
        h('p', {}, 'The quickest way to change a phone number, a link or a phrase across the whole site. Matches are found first and only changed once you confirm.')),
    ),
    h('div', { class: 'grid-2' },
      h('div', { class: 'field' }, h('label', {}, 'Find'), find),
      h('div', { class: 'field' }, h('label', {}, 'Replace with'), text),
    ),
    h('div', { class: 'field', style: 'margin-top:.85rem' }, h('label', {}, 'Where'), scope),
    h('div', { class: 'field', style: 'margin-top:1rem' },
      h('button', { class: 'btn', type: 'button', onclick: () => runReplace(false) }, 'Find matches')),
    h('div', { class: 'alert' }, 'This edits the project source files directly. Changes are recoverable through git, but check the preview before you publish.'),
    output,
  ));
}

/* ------------------------------------------------------------------ publish */

function viewPublish(view) {
  const message = h('input', { type: 'text', placeholder: 'Update site content', value: 'Update site content' });
  const push = h('input', { type: 'checkbox', checked: true });
  const output = h('div');

  const check = async (button, commit) => {
    button.disabled = true;
    const label = button.textContent;
    button.textContent = commit ? 'Publishing…' : 'Checking…';
    try {
      const path = commit ? '/api/publish' : '/api/publish/preview';
      const result = await api(path, { method: 'POST', body: commit ? { message: message.value, push: push.checked } : {} });

      const blocks = [];

      if (commit) {
        blocks.push(h('p', {}, result.note
          || (result.pushed ? 'Published: site rebuilt, committed and pushed. Your host will redeploy shortly.'
            : result.committed ? 'Committed locally. Push was not selected, so nothing has left this machine yet.'
              : 'Publishing stopped before committing.')));
      } else {
        blocks.push(h('p', {}, result.ok
          ? 'Build and link check passed. Review the files below, then publish.'
          : `Stopped at the ${result.stage} step — nothing was committed.`));
      }

      if (result.changed?.length) {
        blocks.push(h('table', { class: 'table' },
          h('thead', {}, h('tr', {}, h('th', {}, 'State'), h('th', {}, 'File'))),
          h('tbody', {}, result.changed.slice(0, 200).map((entry) => h('tr', {},
            h('td', {}, h('span', { class: 'badge' }, entry.state)),
            h('td', {}, h('code', {}, entry.file)),
          ))),
        ));
      }

      if (result.output) blocks.push(h('pre', { class: 'log' }, result.output));

      output.replaceChildren(...blocks);
      toast(commit ? 'Publish finished.' : 'Check finished.', result.ok ? 'ok' : 'err');
    } catch (err) {
      output.replaceChildren(h('p', { class: 'empty' }, err.message));
      toast(err.message, 'err');
    }
    button.disabled = false;
    button.textContent = label;
  };

  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, 'Publish your changes'),
        h('p', {}, 'This regenerates all 62 pages plus the sitemap, robots.txt, llms.txt and RSS feed, verifies every internal link, commits the result and pushes it. Your host redeploys from the push.')),
    ),
    h('div', { class: 'grid-2' },
      h('div', { class: 'field' }, h('label', {}, 'Commit message'),
        message,
        h('p', { class: 'hint' }, 'A short note describing what changed.')),
      h('div', { class: 'field' }, h('label', {}, 'Push to the live repository'),
        h('label', { class: 'checkbox' }, push, 'Push after committing'),
        h('p', { class: 'hint' }, 'Leave this off to commit locally and review with git first.')),
    ),
    h('div', { class: 'toolbar', style: 'margin-top:1rem' },
      h('button', { class: 'btn', type: 'button', onclick: (e) => check(e.target, false) }, 'Check & build (no commit)'),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: (e) => check(e.target, true) }, 'Publish'),
    ),
    h('div', { class: 'alert' }, h('code', {}, 'git push'), ' uses the credentials already configured on this computer. If the push fails, commit still succeeded and you can push manually.'),
    output,
  ));
}

/* ------------------------------------------------------------------ account */

function viewAccount(view) {
  const current = h('input', { type: 'password', autocomplete: 'current-password' });
  const next = h('input', { type: 'password', autocomplete: 'new-password' });
  const confirmField = h('input', { type: 'password', autocomplete: 'new-password' });
  const status = h('p', { class: 'hint' });

  const submit = async (event) => {
    event.preventDefault();
    if (next.value !== confirmField.value) {
      status.textContent = 'The two new passwords do not match.';
      return;
    }
    try {
      await api('/api/password', { method: 'POST', body: { current: current.value, next: next.value } });
      toast('Password changed.', 'ok');
      current.value = '';
      next.value = '';
      confirmField.value = '';
      status.textContent = 'Password updated. You are still signed in.';
    } catch (err) {
      status.textContent = err.message;
    }
  };

  view.appendChild(h('form', { class: 'panel', onsubmit: submit },
    h('div', { class: 'panel-head' },
      h('div', {}, h('h2', {}, 'Change password'),
        h('p', {}, `Signed in as ${state.username}. Sessions last 8 hours of inactivity and are stored in memory, so restarting the server signs everyone out.`)),
    ),
    h('div', { class: 'grid-2' },
      h('div', { class: 'field' }, h('label', {}, 'Current password'), current),
      h('div', { class: 'field' }, h('label', {}, 'New password'), next),
      h('div', { class: 'field' }, h('label', {}, 'Confirm new password'), confirmField),
    ),
    h('div', { class: 'toolbar', style: 'margin-top:1rem' },
      h('button', { class: 'btn btn-primary', type: 'submit' }, 'Update password'),
    ),
    status,
  ));

  view.appendChild(h('section', { class: 'panel' },
    h('div', { class: 'panel-head' }, h('div', {}, h('h2', {}, 'Forgot the password?'))),
    h('p', { class: 'hint' }, 'Stop the server and run this in the project folder to set a new one:'),
    h('pre', { class: 'log' }, 'npm run admin:passwd'),
  ));
}

BOOT();
