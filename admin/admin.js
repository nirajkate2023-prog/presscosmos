// PressCosmos admin — panel behaviour.
// Depends on config.js (settings) and supabase-client.js (window.pcSupabase).
(function () {
  'use strict';

  var sb = window.pcSupabase;
  var $ = function (id) { return document.getElementById(id); };

  var loginView = $('login-view');
  var appView = $('app-view');
  var setupWarning = $('setup-warning');
  var userEmail = $('user-email');
  var signOutBtn = $('sign-out');

  var loginForm = $('login-form');
  var loginError = $('login-error');
  var loginSubmit = $('login-submit');

  var releaseForm = $('release-form');
  var releaseError = $('release-error');
  var releaseSubmit = $('release-submit');
  var releaseList = $('release-list');
  var listError = $('list-error');

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function show(el, visible) { if (el) el.hidden = !visible; }

  function showError(el, message) {
    if (!el) return;
    if (message) { el.textContent = message; el.hidden = false; }
    else { el.textContent = ''; el.hidden = true; }
  }

  function render() {
    var configured = sb.configured;
    var signedIn = configured && Boolean(sb.user());

    show(setupWarning, !configured);
    show(loginView, configured && !signedIn);
    show(appView, signedIn);
    show(signOutBtn, signedIn);
    show(userEmail, signedIn);
    if (signedIn) userEmail.textContent = sb.user().email || '';
  }

  // ---------------------------------------------------------------- auth
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    showError(loginError, '');

    var email = $('email').value.trim();
    var password = $('password').value;
    if (!email || !password) { showError(loginError, 'Enter your email and password.'); return; }

    loginSubmit.disabled = true;
    loginSubmit.textContent = 'Signing in…';
    try {
      await sb.signIn(email, password);
      loginForm.reset();
      render();
      await loadReleases();
    } catch (err) {
      showError(loginError, err.message || 'Sign in failed.');
    } finally {
      loginSubmit.disabled = false;
      loginSubmit.textContent = 'Sign in';
    }
  });

  signOutBtn.addEventListener('click', async function () {
    signOutBtn.disabled = true;
    await sb.signOut();
    signOutBtn.disabled = false;
    releaseList.innerHTML = '';
    render();
  });

  // ------------------------------------------------------------- releases
  async function loadReleases() {
    if (!sb.user()) return;
    showError(listError, '');
    releaseList.innerHTML = '<p class="mono" style="color:var(--faint)">Loading…</p>';
    try {
      var rows = await sb.rest('/releases?select=id,title,summary,status,created_at&order=created_at.desc');
      if (!rows || !rows.length) {
        releaseList.innerHTML = '<p class="mono" style="color:var(--faint)">No releases yet. Create one above.</p>';
        return;
      }
      releaseList.innerHTML = rows.map(function (row) {
        var published = row.status === 'published';
        var when = row.created_at ? new Date(row.created_at).toLocaleString() : '';
        return '' +
          '<article class="card release-row" data-id="' + esc(row.id) + '">' +
            '<div>' +
              '<h3>' + esc(row.title) + '</h3>' +
              (row.summary ? '<p>' + esc(row.summary) + '</p>' : '') +
              '<p class="release-meta"><span class="tag ' + (published ? 'tag-published' : '') + '">' + esc(row.status) + '</span> ' + esc(when) + '</p>' +
            '</div>' +
            '<button class="btn btn-ghost btn-sm" type="button" data-delete="' + esc(row.id) + '">Delete</button>' +
          '</article>';
      }).join('');
    } catch (err) {
      showError(listError, err.message || 'Could not load releases.');
      releaseList.innerHTML = '';
    }
  }

  releaseForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    showError(releaseError, '');

    var title = $('r-title').value.trim();
    if (!title) { showError(releaseError, 'A headline is required.'); return; }

    var payload = {
      title: title,
      summary: $('r-summary').value.trim() || null,
      body: $('r-body').value.trim() || null,
      status: $('r-published').checked ? 'published' : 'draft',
    };

    releaseSubmit.disabled = true;
    releaseSubmit.textContent = 'Saving…';
    try {
      await sb.rest('/releases', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payload),
      });
      releaseForm.reset();
      await loadReleases();
    } catch (err) {
      showError(releaseError, err.message || 'Could not save the release.');
    } finally {
      releaseSubmit.disabled = false;
      releaseSubmit.textContent = 'Save release';
    }
  });

  releaseList.addEventListener('click', async function (event) {
    var button = event.target.closest('[data-delete]');
    if (!button) return;
    var id = button.getAttribute('data-delete');
    if (!id || !window.confirm('Delete this release? This cannot be undone.')) return;

    button.disabled = true;
    showError(listError, '');
    try {
      await sb.rest('/releases?id=eq.' + encodeURIComponent(id), { method: 'DELETE' });
      await loadReleases();
    } catch (err) {
      button.disabled = false;
      showError(listError, err.message || 'Could not delete the release.');
    }
  });

  // ---------------------------------------------------------------- boot
  (async function boot() {
    sb.init();
    if (sb.session) await sb.ensureFresh();
    render();
    if (sb.user()) await loadReleases();
  })();
})();
