// PressCosmos admin — minimal Supabase client (Auth + PostgREST).
//
// Supabase Auth and data are plain HTTPS APIs, so this talks to them with
// fetch() and no third-party library. Nothing is installed and nothing is
// loaded from a CDN, which keeps the site dependency-free and the Content
// Security Policy tight (only connect-src needs to allow *.supabase.co).
//
// Exposes window.pcSupabase.
(function () {
  'use strict';

  var cfg = window.PRESSCOSMOS_SUPABASE || {};
  var SESSION_KEY = 'presscosmos:admin-session';
  var base = String(cfg.url || '').replace(/\/+$/, '');
  var anonKey = String(cfg.anonKey || '');

  function withHeaders(extra) {
    var h = { apikey: anonKey, 'Content-Type': 'application/json' };
    if (extra) { for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) h[k] = extra[k]; } }
    return h;
  }

  function parse(text) {
    if (!text) return null;
    try { return JSON.parse(text); } catch (e) { return null; }
  }

  async function call(path, options) {
    var res;
    try {
      res = await fetch(base + path, options);
    } catch (err) {
      throw new Error('Network error — check that the Supabase URL in config.js is correct and reachable.');
    }
    var body = parse(await res.text());
    if (!res.ok) {
      var message = (body && (body.error_description || body.msg || body.message || body.error)) || res.statusText || 'Request failed';
      var e = new Error(message);
      e.status = res.status;
      throw e;
    }
    return body;
  }

  var client = {
    configured: Boolean(base && anonKey),
    session: null,

    // Load any stored session (survives a page reload).
    init: function () {
      try { this.session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
      catch (e) { this.session = null; }
      return this.session;
    },

    save: function (session) {
      this.session = session || null;
      try {
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        else localStorage.removeItem(SESSION_KEY);
      } catch (e) { /* private mode — session simply will not persist */ }
    },

    user: function () { return (this.session && this.session.user) || null; },

    signIn: async function (email, password) {
      var session = await call('/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: withHeaders(),
        body: JSON.stringify({ email: email, password: password }),
      });
      this.save(session);
      return session;
    },

    signOut: async function () {
      if (this.session && this.session.access_token) {
        try {
          await call('/auth/v1/logout', { method: 'POST', headers: withHeaders({ Authorization: 'Bearer ' + this.session.access_token }) });
        } catch (e) { /* already invalid — clear locally regardless */ }
      }
      this.save(null);
    },

    refresh: async function () {
      if (!this.session || !this.session.refresh_token) return null;
      try {
        var session = await call('/auth/v1/token?grant_type=refresh_token', {
          method: 'POST',
          headers: withHeaders(),
          body: JSON.stringify({ refresh_token: this.session.refresh_token }),
        });
        this.save(session);
        return session;
      } catch (e) {
        this.save(null);
        return null;
      }
    },

    // Returns a valid session, refreshing the access token if it is near expiry.
    ensureFresh: async function () {
      if (!this.session) return null;
      var expiresAt = (this.session.expires_at || 0) * 1000;
      if (expiresAt && Date.now() > expiresAt - 30000) return (await this.refresh()) ? this.session : null;
      return this.session;
    },

    // PostgREST helper. path is everything after /rest/v1, e.g. "/releases?select=*".
    rest: async function (path, options) {
      options = options || {};
      if (!(await this.ensureFresh())) throw new Error('Your session has expired. Please sign in again.');
      var extra = { Authorization: 'Bearer ' + this.session.access_token };
      if (options.headers) { for (var k in options.headers) { if (Object.prototype.hasOwnProperty.call(options.headers, k)) extra[k] = options.headers[k]; } }
      return call('/rest/v1' + path, Object.assign({}, options, { headers: withHeaders(extra) }));
    },
  };

  window.pcSupabase = client;
})();
