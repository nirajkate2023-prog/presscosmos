# PressCosmos

A press release distribution and AI visibility platform — built as a fast, dependency-free
static site so it can be hosted anywhere and read by anything, including AI crawlers.

| | |
| --- | --- |
| **Production** | https://presscosmos.com (Hostinger — see `DEPLOY.md`) |
| **Staging preview** | https://nirajkate2023-prog.github.io/presscosmos/ |
| **Repository** | https://github.com/nirajkate2023-prog/presscosmos |
| **Pages** | 62 |
| **Runtime dependencies** | none |

---

## Why it is built this way

Press releases have two audiences now: people, and retrieval systems. This site is built to be
read by both.

- **No framework and zero dependencies.** Plain HTML, one CSS file, one JS file. `package.json`
  exists only to expose the build scripts — it declares **no dependencies**, so nothing is ever
  installed and there is no dependency tree to go stale or vulnerable.
- **Everything is committed.** Generated HTML, CSS, JS and images all live in the repository,
  so any static host serves the site directly with no CI step and no build command.
- **Animations are progressive.** Scroll reveals, kinetic headlines, orbit visuals, marquee,
  counters and card tilt all degrade to static content, and are fully disabled under
  `prefers-reduced-motion`.
- **Responsive from 320px up.** Phone, large phone, tablet and desktop layouts, with touch
  targets at 44px, a slide-down mobile menu, scrollable comparison tables with a pinned first
  column, and 16px form inputs so iOS Safari never zooms on focus.
- **Structured for AEO / GEO / LLMO.** Every page carries JSON-LD, a quick-answer block,
  breadcrumbs and machine-readable metadata. `llms.txt`, `robots.txt` and `rss.xml` are
  generated too.

## Structure

```
index.html, about.html, ...      62 generated pages (do not hand-edit — they are built)
assets/css/main.css              design system, tokens, components, motion, responsive layer
assets/js/app.js                 interaction + animation engine (no dependencies)
assets/img/                      generated social card and icons
favicon.svg, favicon-32.png      icons
sitemap.xml, robots.txt          crawler layer
llms.txt                         AI assistant guidance file (LLMO)
rss.xml, manifest.webmanifest    feeds and PWA metadata
404.html                         styled not-found page
.htaccess                        Apache/LiteSpeed config for Hostinger:
                                 HTTPS + canonical host, security headers, CSP,
                                 compression, caching, MIME types, source protection
package.json                     project manifest: npm scripts only, no dependencies
tools/build.mjs                  site builder: renders pages + emits machine-readable files
tools/site.mjs                   brand, navigation, plans, industries, FAQs (single source of truth)
tools/ui.mjs                     component library (cards, heroes, FAQs, CTAs, icons)
tools/content/*.mjs              page content, grouped by section
tools/overrides.mjs              content override layer: layers admin edits over the defaults
tools/gen-assets.ps1             regenerates the PNG social card and icons
tools/make-deploy.ps1            builds the Hostinger upload package (folder + zip)
tools/check-links.mjs            verifies every internal link and asset resolves
tools/preview.mjs                local static preview server
admin/                           content managers (see below)
admin/index.html, config.yml     Decap CMS — the online editor, served at /admin/
admin/server.mjs, lib/, public/  local Node panel (never deployed — blocked by .htaccess)
admin/content/*.json             your edits, layered over the defaults above
tools/seed-cms.mjs               seeds admin/content/ from the current site content
.github/workflows/rebuild-site.yml  rebuilds the HTML when the CMS commits content
ADMIN.md                         local Node panel guide: setup, editing, publishing, security
DECAP.md                         Decap CMS guide: OAuth setup, editing, publishing
DEPLOY.md                        Hostinger + GitHub Pages instructions, DNS, SSL
```

## Admin panel

A local content editor for the whole site. No database, no CMS, no dependencies — it edits the
content layer and drives the same build.

```bash
npm run admin        # http://localhost:4000/admin/
npm run admin:passwd # reset the password
```

Edit brand details, navigation, pricing, FAQs, any page's copy, links and images, with a live
preview; then press **Publish** to rebuild, run the link check and push. The first run asks you
to create an admin account. See **`ADMIN.md`** for the full guide.

## Content manager (Decap CMS)

A browser-based editor, served with the site at **`/admin/`**, for editing content from anywhere
— no local tooling required. You sign in with GitHub; saves are committed to the repository and
a GitHub Action (`rebuild-site.yml`) rebuilds the static HTML automatically. Edit any page's
copy, the navigation and footer links, brand and pricing settings, upload images, or add new
blog posts and press releases.

It needs a one-time OAuth proxy so GitHub sign-in can work — see **`DECAP.md`** for the setup,
and `admin/config.yml` for the collections. Both panels edit the same `admin/content/` layer and
can be used interchangeably.

## Commands

```bash
npm run build      # regenerate all HTML + sitemap + robots + llms.txt + rss
npm run check      # verify every internal link resolves
npm run verify     # build, then check
npm run preview    # local preview at http://localhost:4321
npm start          # same as preview
npm run admin      # local Node panel at http://localhost:4000/admin/
npm run cms:local  # Decap CMS locally (npx decap-server) — see DECAP.md
npm run seed:cms   # one-off: seed admin/content/ from the current content
```

The same commands work without npm, if you prefer:

```bash
node tools/build.mjs
node tools/check-links.mjs
node tools/preview.mjs
```

On Windows, build the deployment package with:

```powershell
npm run package:hostinger    # -> presscosmos-hostinger.zip
npm run assets               # regenerate the social card and icons
```

## Editing content

The easy route is the **admin panel** (`npm run admin`) — see `ADMIN.md`. It writes JSON into
`admin/content/`, which the builder layers over the defaults below, so you never have to touch
the generator source.

Editing by hand, everything editable lives in three places:

1. **`tools/site.mjs`** — brand details, contact info, navigation, footer, pricing plans,
   industries, testimonials and FAQ content.
2. **`tools/content/`** — the copy for each page, grouped by section:
   `pages-core.mjs` (home and platform), `pages-industries.mjs` (12 verticals),
   `pages-news.mjs` (newsroom, releases, guides), `pages-company.mjs` (company and utility),
   `pages-legal.mjs` (policies).
3. **`assets/css/main.css`** — design tokens at the top of the file control the entire look:
   colours, type scale, spacing, radii, shadows and easing curves. The responsive layer is
   section 20 at the bottom of the same file.

Anything in `admin/content/*.json` wins over the equivalent default in `tools/`, so if a value
will not change, check whether the admin panel has written an override for it.

After editing, run `npm run verify`.

## Things to change before going live commercially

- **Contact details** in `tools/site.mjs` (email, phone, address) are placeholders.
- **The submission form has no backend.** It validates in the browser and shows a
  confirmation. Point it at your API or CRM before taking real submissions.
- **Sample press releases and case studies** are illustrative. Company names, figures and
  quotations are fictional. Replace them with real content before launch.
- **Network statistics** (2,400+ destinations, 68 countries, 42-minute median) are the site's
  own published figures. Replace them with your verified numbers.
- **Legal pages** are careful templates, not legal advice. Have counsel review them.
- **No third-party logos are used** anywhere. Distribution partners are described by category
  rather than by trademark — add real partner names only once contracts exist.

## Accessibility

Targets WCAG 2.2 AA: semantic landmarks, keyboard operation, visible focus states, contrast
checked in both themes, 200% text scaling, 44px touch targets on coarse pointers, and complete
`prefers-reduced-motion` support. See `accessibility.html` for the published statement and
known limitations.
