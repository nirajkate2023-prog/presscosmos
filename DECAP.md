# Decap CMS content manager

Decap CMS is the browser-based content editor for the site. It is served with the
site at **`/admin/`**, so you can edit content from anywhere — no local tooling,
no database, no server of our own.

It is one of two admin tools in this repository. The other is the local Node
panel (`npm run admin`, see `ADMIN.md`). They edit the same content files and
neither replaces the other.

---

## How it works

```
Decap CMS (/admin/)  →  commits JSON to admin/content/  →  GitHub Action runs
node tools/build.mjs  →  commits the regenerated HTML  →  your host redeploys
```

- Decap writes **JSON**, never HTML.
- `tools/build.mjs` reads that JSON (via `tools/overrides.mjs`) and layers it over
  the generated defaults in `tools/site.mjs` and `tools/content/*.mjs`, then
  renders all pages plus `sitemap.xml`, `robots.txt`, `llms.txt` and `rss.xml`.
- The **“Rebuild site from CMS content”** GitHub Action (`.github/workflows/rebuild-site.yml`)
  runs the build automatically on every push that changes `admin/content/`, and
  commits the result. That is what makes an edit appear on the live site.

Where content lives:

| File | Written by | Controls |
| --- | --- | --- |
| `admin/content/site.json` | Decap → **Site settings** | Brand, contact, navigation, footer, pricing, services, industries, testimonials, FAQs, stats, network channels |
| `admin/content/pages/<slug>.json` | Decap → **Pages & articles** | One file per page: title, meta description, keywords, HTML body, and post metadata |
| `assets/img/` | Decap media library | Uploaded images (referenced as `/assets/img/<file>`) |

---

## One-time setup (GitHub sign-in)

The GitHub backend needs a small OAuth proxy, because GitHub OAuth requires a
server to exchange the login code for a token. This is a one-time step.

### 1. Create a GitHub OAuth App

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Application name:** PressCosmos CMS (or anything you like)
- **Homepage URL:** `https://presscosmos.com/admin/`
- **Authorization callback URL:** `https://<YOUR-PROXY-HOST>/callback`

Note the **Client ID** and generate a **Client Secret**.

### 2. Deploy an OAuth proxy

Deploy any Decap / Netlify-CMS GitHub OAuth provider and give it the client id and
secret from step 1. A long-standing, widely used option is
**`vencax/netlify-cms-github-oauth-provider`** (deployable straight to Render,
Railway, Vercel, Fly.io or a plain container); an equivalent Cloudflare Worker
works too. Whichever you use, it must expose:

- `GET /auth` — redirects the browser to GitHub
- `GET /callback` — completes the exchange and posts the token back to the CMS

Set its environment to the OAuth App’s client id and secret (the provider’s README
names the exact variables — typically `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET`),
and, if it asks, allow the origin `https://presscosmos.com`.

### 3. Point the CMS at the proxy

Edit `admin/config.yml` and replace the placeholder:

```yaml
backend:
  name: github
  repo: nirajkate2023-prog/presscosmos
  branch: main
  base_url: https://<YOUR-PROXY-HOST>   # ← your proxy URL, no trailing slash
```

Commit and push. The Action rebuilds; the deployed `/admin/` now signs in.

### 4. Give editors access

The GitHub backend requires **push access** to `nirajkate2023-prog/presscosmos`.
Add each editor as a collaborator (Settings → Collaborators), or have them work
through a fork if you enable open authoring later.

That’s it. Open **`https://presscosmos.com/admin/`**, click **Login with GitHub**,
approve the OAuth App, and you are in.

---

## Editing content

**Pages & articles** lists all 62 existing pages (seeded from the current site)
plus anything you add. Use the filters (Site pages / Blog articles / Press
releases) to narrow the list.

- **Edit a page** — change the title, meta description, keywords and HTML body,
  then **Publish**. The page rebuilds within a couple of minutes.
- **Add a blog post or press release** — click **New Page**, set *Page type* to
  `article` or `release`, write the body, and Publish. New posts appear on
  `/blog.html` and `/newsroom.html` automatically and are added to the sitemap
  (releases also join `rss.xml`).
- **Upload an image** — use the media button on an image field, or the Media
  library. Files land in `assets/img/` and are referenced as `/assets/img/<file>`.
- **Links** — edit navigation and footer under **Site settings → Menu** and
  **Footer columns**; edit inline links inside a page body as HTML.

### Two things worth knowing

- **Editing a page body detaches it.** Once you save a body, that page keeps your
  version and stops automatically picking up site-wide changes. Change a phone
  number under *Site settings* and it updates the header, footer, navigation,
  structured data and `llms.txt` — but not a body you have already edited.
- **Press Publish, then wait.** The Action takes a minute or two; then the live
  page updates. (You can also trigger the workflow by hand from the Actions tab.)

---

## Editing locally (no OAuth setup)

You can run the CMS against your working copy:

```bash
npm run cms:local     # npx decap-server — proxies to the local repository
npm run preview       # serves the site at http://localhost:4321
```

Then open **http://localhost:4321/admin/**. `local_backend` is only honoured on
`localhost`, so the deployed site still uses the GitHub backend.

The local Node panel (`npm run admin`) remains available too — see `ADMIN.md`.
Note that it writes page edits to `admin/content/pages.json`, while Decap writes
one file per page under `admin/content/pages/`; both are read by the build, with
the per-page files taking precedence.

---

## Keeping the CMS private

- `/admin/index.html` and `/admin/config.yml` are public by design (a static-site
  CMS has no server to hide behind). Everything else in `admin/` is refused by
  `admin/.htaccess`: `server.mjs`, `passwd.mjs`, `lib/`, `public/`, `content/`
  and dotfiles.
- Access is controlled by GitHub: only collaborators with push access can sign in
  and save.
- The root `.htaccess` sends a stricter Content Security Policy everywhere except
  `/admin/`, which gets a policy loose enough for the CMS (CDN script, editor
  `eval`, and calls to the GitHub API).

---

## Troubleshooting

**“Login” does nothing / proxy error** — `base_url` is still the placeholder, or
the proxy is unreachable, or the OAuth App callback URL does not match the proxy
host. Fix `admin/config.yml` and re-check the OAuth App.

**A page shows 404 after publishing** — the Action may still be running, or it
failed. Check the **Actions** tab for “Rebuild site from CMS content”.

**My change is on GitHub but not on the live site** — the host redeploys from
`main`; confirm the Action committed the rebuilt HTML, then redeploy on Hostinger
(Git deployment pulls on push; the zip/upload route needs a fresh upload).

**Uploaded image is broken on the page** — image paths are `/assets/img/<file>`;
confirm the file exists in `assets/img/` in the repository.

**I want to undo a change** — every CMS save is a normal git commit; `git revert`
it.
