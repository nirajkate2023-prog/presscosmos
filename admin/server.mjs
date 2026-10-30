// PressCosmos admin — local server.
//
// Zero dependencies, like the rest of the project. Binds to 127.0.0.1 by
// default, so the panel is only reachable from the machine running it, and
// every mutation requires a session cookie plus a CSRF token.
//
// Run: node admin/server.mjs [port]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

import { ROOT } from '../tools/overrides.mjs';
import {
  isConfigured, readAuth, writeAuth, changePassword, describePassword, verifyPassword,
  createSession, getSession, destroySession, lockStatus, recordFailure, clearFailures,
} from './lib/auth.mjs';
import { SECTIONS, PAGE_FIELDS } from './lib/schema.mjs';
import * as content from './lib/content.mjs';

const PORT = Number(process.env.PORT || process.argv[2] || 4000);
const HOST = process.env.ADMIN_HOST || '127.0.0.1';
const PUBLIC_DIR = join(ROOT, 'admin', 'public');
const COOKIE = 'pc_admin';
const MAX_BODY = 16 * 1024 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

/* --------------------------------------------------------------- utilities */

const json = (res, status, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
};

const readJsonBody = (req) => new Promise((resolvePromise, reject) => {
  let size = 0;
  const chunks = [];
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY) {
      reject(new Error('Request body is too large.'));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw) return resolvePromise({});
    try {
      resolvePromise(JSON.parse(raw));
    } catch {
      reject(new Error('Request body was not valid JSON.'));
    }
  });
  req.on('error', reject);
});

const parseCookies = (req) => Object.fromEntries(
  (req.headers.cookie || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf('=');
      return index === -1 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
    }),
);

const setCookie = (res, token) => {
  res.setHeader('set-cookie', `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`);
};

const clearCookie = (res) => {
  res.setHeader('set-cookie', `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
};

// Only ever serve inside the given directory, and reject traversal outright.
const resolveInside = (base, urlPath) => {
  const clean = decodeURIComponent(urlPath).replace(/\\/g, '/').replace(/^\/+/, '');
  if (!clean || clean.split('/').includes('..')) return null;
  const target = resolve(base, clean);
  if (target !== base && !target.startsWith(base + sep)) return null;
  return target;
};

const BLOCKED_SEGMENTS = new Set(['admin', 'tools', 'content', 'node_modules', 'build', '.git', '.commandcode']);

const serveFile = async (res, file, status = 200) => {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) return false;
  const body = await readFile(file);
  res.writeHead(status, {
    'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
    'content-length': body.length,
    'cache-control': 'no-store',
  });
  res.end(body);
  return true;
};

/* --------------------------------------------------------------- API guard */

const requireSession = (req, res) => {
  const session = getSession(parseCookies(req)[COOKIE]);
  if (!session) {
    json(res, 401, { error: 'Not signed in.' });
    return null;
  }
  return session;
};

const requireCsrf = (req, res, session) => {
  if (req.headers['x-csrf-token'] !== session.csrf) {
    json(res, 403, { error: 'Your session expired or the request was tampered with. Sign in again.' });
    return false;
  }
  return true;
};

/* -------------------------------------------------------------------- API */

const api = async (req, res, pathname, query) => {
  const method = req.method;

  // -- session ------------------------------------------------------------
  if (pathname === '/api/session' && method === 'GET') {
    const session = getSession(parseCookies(req)[COOKIE]);
    return json(res, 200, {
      configured: isConfigured(),
      authenticated: Boolean(session),
      username: session?.username || null,
      csrf: session?.csrf || null,
      port: PORT,
    });
  }

  // -- first-run setup ----------------------------------------------------
  if (pathname === '/api/setup' && method === 'POST') {
    if (isConfigured()) return json(res, 400, { error: 'This admin panel already has an account. Sign in instead.' });
    const { username, password } = await readJsonBody(req);
    if (!username || String(username).trim().length < 3) return json(res, 400, { error: 'Choose a username with at least 3 characters.' });
    const problem = describePassword(password);
    if (problem) return json(res, 400, { error: problem });

    writeAuth(String(username).trim(), password);
    const { token, session } = createSession(String(username).trim());
    setCookie(res, token);
    return json(res, 200, { ok: true, username: session.username, csrf: session.csrf });
  }

  // -- login / logout -----------------------------------------------------
  if (pathname === '/api/login' && method === 'POST') {
    if (!isConfigured()) return json(res, 400, { error: 'No admin account yet. Reload to run setup.' });

    const key = req.socket.remoteAddress || 'local';
    const lockedFor = lockStatus(key);
    if (lockedFor) return json(res, 429, { error: `Too many failed attempts. Try again in ${lockedFor} minute(s).` });

    const { username, password } = await readJsonBody(req);
    const auth = readAuth();
    const ok = auth
      && String(username || '').trim().toLowerCase() === auth.username.toLowerCase()
      && verifyPassword(String(password || ''), auth.hash);

    if (!ok) {
      recordFailure(key);
      return json(res, 401, { error: 'Incorrect username or password.' });
    }

    clearFailures(key);
    const { token, session } = createSession(auth.username);
    setCookie(res, token);
    return json(res, 200, { ok: true, username: session.username, csrf: session.csrf });
  }

  if (pathname === '/api/logout' && method === 'POST') {
    destroySession(parseCookies(req)[COOKIE]);
    clearCookie(res);
    return json(res, 200, { ok: true });
  }

  // -- everything below needs a session ----------------------------------
  const session = requireSession(req, res);
  if (!session) return undefined;
  if (method !== 'GET' && !requireCsrf(req, res, session)) return undefined;

  if (pathname === '/api/password' && method === 'POST') {
    const { current, next } = await readJsonBody(req);
    const auth = readAuth();
    if (!auth || !verifyPassword(String(current || ''), auth.hash)) {
      return json(res, 401, { error: 'Your current password is not correct.' });
    }
    const problem = describePassword(next);
    if (problem) return json(res, 400, { error: problem });
    changePassword(next);
    return json(res, 200, { ok: true });
  }

  if (pathname === '/api/schema' && method === 'GET') {
    return json(res, 200, { sections: SECTIONS, pageFields: PAGE_FIELDS });
  }

  if (pathname === '/api/content' && method === 'GET') {
    const values = {};
    for (const section of SECTIONS) values[section.key] = content.getSection(section.key);
    return json(res, 200, { values, overriddenSections: content.getOverriddenSections() });
  }

  if (pathname === '/api/section' && method === 'POST') {
    const { key, value } = await readJsonBody(req);
    return json(res, 200, { ok: true, value: content.saveSection(key, value) });
  }

  if (pathname === '/api/section/reset' && method === 'POST') {
    const { key } = await readJsonBody(req);
    return json(res, 200, { ok: true, value: content.resetSection(key) });
  }

  if (pathname === '/api/pages' && method === 'GET') {
    return json(res, 200, { pages: content.listPages() });
  }

  if (pathname === '/api/page' && method === 'GET') {
    return json(res, 200, { page: content.getPage(query.get('slug')) });
  }

  if (pathname === '/api/page' && method === 'POST') {
    const { slug, patch } = await readJsonBody(req);
    return json(res, 200, { ok: true, page: content.savePage(slug, patch || {}) });
  }

  if (pathname === '/api/page/reset' && method === 'POST') {
    const { slug } = await readJsonBody(req);
    return json(res, 200, { ok: true, page: content.resetPage(slug) });
  }

  if (pathname === '/api/media' && method === 'GET') {
    return json(res, 200, { media: content.listMedia() });
  }

  if (pathname === '/api/media' && method === 'POST') {
    const { filename, data } = await readJsonBody(req);
    return json(res, 200, { ok: true, ...content.saveMedia(filename, data) });
  }

  if (pathname === '/api/media/delete' && method === 'POST') {
    const { file } = await readJsonBody(req);
    return json(res, 200, { ok: true, ...content.deleteMedia(file) });
  }

  if (pathname === '/api/replace' && method === 'POST') {
    const body = await readJsonBody(req);
    return json(res, 200, content.searchReplace(body));
  }

  if (pathname === '/api/build' && method === 'POST') {
    return json(res, 200, await content.publishPreview());
  }

  if (pathname === '/api/publish/preview' && method === 'POST') {
    return json(res, 200, await content.publishPreview());
  }

  if (pathname === '/api/publish' && method === 'POST') {
    const body = await readJsonBody(req);
    return json(res, 200, await content.publish(body));
  }

  return json(res, 404, { error: 'Unknown endpoint.' });
};

/* ----------------------------------------------------------------- routes */

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);
  const { pathname } = url;

  try {
    if (pathname.startsWith('/api/')) {
      await api(req, res, pathname, url.searchParams);
      return;
    }

    // The panel itself.
    if (pathname === '/' || pathname === '/admin') {
      res.writeHead(302, { location: '/admin/' });
      return res.end();
    }

    if (pathname === '/admin/') {
      if (await serveFile(res, join(PUBLIC_DIR, 'index.html'))) return;
      res.writeHead(500, { 'content-type': 'text/plain' });
      return res.end('admin/public/index.html is missing.');
    }

    if (pathname.startsWith('/admin/')) {
      const file = resolveInside(PUBLIC_DIR, pathname.slice('/admin'.length));
      if (file && await serveFile(res, file)) return;
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('Not found');
    }

    // Live preview of the built site, so edits can be checked in place.
    if (pathname === '/site') {
      res.writeHead(302, { location: '/site/' });
      return res.end();
    }

    if (pathname.startsWith('/site/')) {
      const rel = pathname.slice('/site'.length);
      const segments = rel.split('/').filter(Boolean);
      const blocked = segments.some((part) => part.startsWith('.') || BLOCKED_SEGMENTS.has(part));
      const target = blocked ? null : resolveInside(ROOT, rel === '/' ? '/index.html' : rel);
      if (target && await serveFile(res, target)) return;
      if (await serveFile(res, join(ROOT, '404.html'), 404)) return;
      res.writeHead(404, { 'content-type': 'text/plain' });
      return res.end('Not found');
    }

    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    if (res.headersSent) return;
    json(res, 500, { error: err.message || String(err) });
  }
});

server.listen(PORT, HOST, () => {
  const configured = isConfigured();
  console.log('');
  console.log('  PressCosmos admin');
  console.log(`  ${configured ? 'Sign in at  ' : 'Set up at   '}http://localhost:${PORT}/admin/`);
  console.log(`  Live preview  http://localhost:${PORT}/site/`);
  console.log('');
  if (!configured) console.log('  No account yet — the first screen will ask you to create one.\n');
  if (HOST !== '127.0.0.1') console.log(`  WARNING: bound to ${HOST}. Only do this on a network you trust.\n`);
  console.log('  Stop the server with Ctrl+C.');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${PORT} is already in use. Try: node admin/server.mjs ${PORT + 1}\n`);
    process.exit(1);
  }
  throw err;
});
