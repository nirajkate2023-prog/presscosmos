# Deploying PressCosmos

The site is plain static HTML — no build step, no database, no Node.js, no PHP. That means it
runs anywhere: Hostinger shared hosting, Cloudflare Pages, Netlify, GitHub Pages, or a plain
Apache box.

**Canonical production URL:** `https://presscosmos.com`
**Staging preview:** `https://nirajkate2023-prog.github.io/presscosmos/`

---

## Hostinger (primary deployment)

Everything needed is already in `main`. Two ways to get it live.

### Option A — Git deployment (recommended)

Hostinger pulls the repository and redeploys on every push to `main`.

1. In hPanel go to **Advanced → GIT**.
2. Create a repository:
   - **Repository**: `https://github.com/nirajkate2023-prog/presscosmos.git`
   - **Branch**: `main`
   - **Install path**: `public_html`
3. Click **Create**. Hostinger clones the repo into `public_html`.
4. **Build command: leave it empty.** The site is already built and committed, so there is
   nothing to compile. A `package.json` is present for convenience (`npm run build`,
   `npm run verify`) but it declares **no dependencies**, so `npm install` is never required. If
   your panel insists on a build command, `npm run build` works wherever Node is available and
   just regenerates identical files.
5. If the panel offers an install step, you can skip it. It is harmless either way — the
   `.htaccess` blocks `node_modules/`, `package.json` and `/build/` from being served.

The included `.htaccess` blocks web access to `/tools/`, `/README.md`, `/DEPLOY.md`, `/.git`
and dotfiles, so pulling the whole repository is safe.

To redeploy after a change: push to `main`, then hit **Redeploy** in hPanel.

### Option B — Upload the packaged zip

Build a clean package containing only the site files:

```powershell
powershell -ExecutionPolicy Bypass -File tools/make-deploy.ps1
```

That creates `build/hostinger/` and `presscosmos-hostinger.zip`, with an
`UPLOAD-INSTRUCTIONS.txt` inside the package. Then in hPanel:

1. **Files → File Manager**, open `public_html`.
2. Delete Hostinger's placeholder files (`default.php`, `index.php`) so they do not shadow
   `index.html`.
3. Upload `presscosmos-hostinger.zip`, right-click → **Extract**, then delete the zip.
4. Confirm `.htaccess` extracted — enable **Show hidden files** in File Manager to see it.

Or upload the contents of `build/hostinger/` over SFTP. The result must be
`public_html/index.html`, not `public_html/hostinger/index.html`.

### After uploading

1. **Enable SSL**: hPanel → **Security → SSL**, and wait until it shows as active.
2. `.htaccess` forces `https://` and redirects `www` → non-`www` (matching the canonical tags
   in the HTML). If the site shows an SSL error immediately after deploying, SSL is not active
   yet — comment out the two redirect lines in **section 3** of `.htaccess` and the site will
   serve over http until the certificate issues.
3. Point the domain at Hostinger (see DNS below), then verify:

```bash
curl -I https://presscosmos.com/
curl -s https://presscosmos.com/robots.txt
curl -s https://presscosmos.com/llms.txt
```

4. Submit `https://presscosmos.com/sitemap.xml` in Google Search Console and Bing Webmaster
   Tools.

### What the `.htaccess` does

| Section | Purpose |
| --- | --- |
| 1 | `index.html` as directory index, no directory listings, UTF-8 default |
| 2 | Custom `404.html` |
| 3 | Force HTTPS and one canonical hostname (`www` → non-`www`) |
| 4 | Optional extensionless URLs (commented out) |
| 5 | Security headers: `nosniff`, frame options, referrer policy, permissions policy, HSTS, CSP |
| 6 | Compression for HTML, CSS, JS, JSON, XML, SVG, fonts |
| 7 | Caching: HTML revalidates on every deploy, assets cached 7 days |
| 8 | MIME types for `.webmanifest`, `.svg`, `.woff2`, feeds |
| 9–10 | Blocks `/tools/`, `/.git`, `*.mjs`, `*.ps1`, `*.md` and dotfiles from the web |
| 11 | UTF-8 for HTML, text and XML |

Every block is wrapped in `<IfModule>`, so a module Hostinger does not load cannot cause a
500 error.

### DNS

Hostinger gives you nameservers when you add the domain. Either:

- **Use Hostinger's nameservers** — set the pair shown in your hPanel at your registrar and
  wait for propagation, or
- **Keep DNS elsewhere** — point the apex `A` record at your Hostinger shared IP (shown under
  **Hosting plan → Server details**), and add a `CNAME` for `www` pointing at the same host.

Once `presscosmos.com` resolves to Hostinger you can leave the GitHub Pages copy running as a
staging preview: Pages ignores `.htaccess`, so both hosts serve the same repository.

---

## GitHub Pages (staging preview)

Already enabled, serving from `main`.

## Current setup

| Setting | Value |
| --- | --- |
| Live URL | https://nirajkate2023-prog.github.io/presscosmos/ |
| Source | `main` branch, repository root |
| Build step | none |
| HTTPS | enabled |

Every push to `main` redeploys automatically. There is no CI workflow and nothing to
configure.

## If you host on GitHub Pages instead of Hostinger

> **Stop and read.** The DNS records in this section are **GitHub's IP addresses**. Do not add
> them if you are deploying to Hostinger — pointing your DNS at GitHub would send traffic to
> the Pages copy (which cannot read `.htaccess`) and permanently redirect your
> `github.io` URL to your domain. Use this section only if you decide to make GitHub Pages the
> production host.

The custom domain is deliberately **not** activated. GitHub redirects the `github.io` URL to
the custom domain as soon as one is set, so enabling it before DNS is live would break the
staging link.

### 1. Create the DNS records at your registrar (GitHub hosting only)

For an apex domain (`presscosmos.com`), four A records:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

For `www`, one CNAME:

```
CNAME    www    nirajkate2023-prog.github.io
```

Optional IPv6:

```
AAAA    @    2606:50c0:8000::153
AAAA    @    2606:50c0:8001::153
AAAA    @    2606:50c0:8002::153
AAAA    @    2606:50c0:8003::153
```

Pick one canonical hostname (`www` or bare) and redirect the other to it — the canonical tags
in the HTML use the bare domain.

### 2. Add the CNAME file and enable the domain

Create a file named `CNAME` in the repository root containing exactly:

```
presscosmos.com
```

Then either enable it in **Settings → Pages → Custom domain**, or:

```bash
gh api -X PUT repos/nirajkate2023-prog/presscosmos/pages \
  -f cname=presscosmos.com -f build_type=legacy
```

Tick **Enforce HTTPS** once the certificate is issued. GitHub provisions a Let's Encrypt
certificate automatically; it usually takes a few minutes and can take up to 24 hours after
DNS propagates.

### 3. Canonical URL

`tools/site.mjs` holds `baseUrl`, already set to `https://presscosmos.com` — the correct
production canonical either way. If you launch on a different domain, change it there and run
`node tools/build.mjs`.

---

## Verifying a deployment

```bash
node tools/check-links.mjs                  # every internal link and asset resolves
curl -I https://presscosmos.com/            # 200 OK over HTTPS
curl -s https://presscosmos.com/robots.txt  # crawler policy is live
curl -s https://presscosmos.com/llms.txt    # AI guidance file is live
node tools/preview.mjs                      # local preview at http://localhost:4321
```

After the domain is live, submit `https://presscosmos.com/sitemap.xml` in Google Search
Console and Bing Webmaster Tools. `robots.txt` already explicitly allows the major AI crawlers,
and `llms.txt` gives assistants a factual summary of the business.

## Redeploying after a change

```powershell
node tools/build.mjs
node tools/check-links.mjs
git add -A
git commit -m "Update site"
git push
```

Then either let the Hostinger Git webhook pull the change, or re-run
`tools/make-deploy.ps1` and re-upload the package. GitHub Pages picks up a push within about
a minute.

## Admin panel (`/admin/`)

The admin panel lives in `admin/` and is a real login backed by
[Supabase](https://supabase.com) Auth. Supabase validates the credentials on its own servers,
so the login is genuine on a static host — and it works identically on Hostinger **and** on
GitHub Pages, because no `.htaccess` is involved. There is no build step and no dependency:
the panel talks to Supabase's Auth and REST APIs with `fetch`.

### One-time setup

1. **Create a project** at [supabase.com](https://supabase.com) (the free tier is plenty).
2. **Create the table.** Dashboard → **SQL Editor** → New query → paste the contents of
   `supabase/schema.sql` → **Run**. This creates the `releases` table and its Row Level
   Security policies.
3. **Create your admin user.** Dashboard → **Authentication → Users → Add user**. Enter an
   email and password and tick **Auto Confirm User** so you can sign in straight away.
4. **Add the project keys.** Dashboard → **Project Settings → API**. Copy the **Project URL**
   and the **anon public** key into `admin/config.js`:

   ```js
   window.PRESSCOSMOS_SUPABASE = {
     url: 'https://YOUR-PROJECT.supabase.co',
     anonKey: 'YOUR-ANON-PUBLIC-KEY',
   };
   ```

   The anon key is a **public** key by design — it is meant to be shipped to browsers and is
   safe to commit. Security comes from Row Level Security, not from hiding this key.
5. **Commit and push** `admin/config.js`, then visit `https://presscosmos.com/admin/` and sign
   in with the user from step 3. The header **Sign in** button points at `/admin/`.

### How it is secured

- The password is checked by Supabase's servers; the browser only ever holds a short-lived
  token, so there is no credential to read out of the page.
- `supabase/schema.sql` enables Row Level Security: anonymous visitors may read published
  releases only, while signed-in admins get full access. The public anon key cannot read
  drafts or write anything.
- The session is kept in `localStorage` and refreshed automatically; **Sign out** revokes it.
- The `Content-Security-Policy` in `.htaccess` permits network calls only to `*.supabase.co`.

### Managing access

Add or remove users in the Supabase dashboard (Authentication → Users). `robots.txt` disallows
`/admin/` so search and AI crawlers stay away.

> The admin panel manages a `releases` table in Supabase. The public newsroom pages are still
> generated at build time from `tools/content/`; wiring the site to render from Supabase is a
> separate, deliberate step (client-side rendering would work against the site's SEO/AEO
> goals).

---

## Alternative hosts

Because there is no server-side code, the same repository deploys unchanged to Cloudflare
Pages, Netlify or Vercel by pointing them at the repository root as a static site with no
build command. If you move to Cloudflare Pages you gain edge caching and can set real HTTP
security headers, which GitHub Pages does not allow.
