# PressCosmos admin panel

A local content editor for the site. You run it on your own computer, log in, change
whatever you like, and press **Publish** — the panel rebuilds all 62 pages plus
`sitemap.xml`, `robots.txt`, `llms.txt` and `rss.xml`, checks every link, and pushes the
result so your host redeploys.

The live site stays exactly as it is: plain static HTML with no server, no database and no
runtime dependencies.

> A second, **browser-based** editor also ships with the site: **Decap CMS** at `/admin/`, for
> editing from anywhere with a GitHub sign-in. It is documented in **`DECAP.md`**. Both tools
> write the same `admin/content/` files, so you can use either. This document covers the local
> Node panel only.

---

## Quick start

```bash
npm run admin
```

Then open **http://localhost:4000/admin/**.

The first time you run it, the panel asks you to create an admin account — pick a username
and a password (at least 10 characters, with a letter and a number). That is a one-time step.
Nothing in the admin panel is ever reachable from the public site.

Stop the server with **Ctrl+C**.

### Forgot the password?

```bash
npm run admin:passwd
```

Prompts for a new password with the input hidden. Everything else is untouched.

---

## What you can change

| Screen | What it controls |
| --- | --- |
| **Dashboard** | Counts, a rebuild button, and a reminder of how publishing works |
| **Pages** | Every one of the 62 pages: SEO title, meta description, keywords and the page body. Includes a live preview |
| **Media library** | Upload images to `assets/img`, copy their paths, delete them |
| **Find & replace** | Change a phone number, link or phrase everywhere in one go, with a match preview before anything is written |
| **Brand & contact** | Site name, legal name, tagline, domain, emails, phone, address, social links |
| **Statistics** | The headline numbers in the stat rows |
| **Pricing plans** | Plans, prices, features — drives the pricing page, the submit form and `llms.txt` |
| **Services** | Platform services and their icons, summaries and bullets |
| **Industries** | The 12 verticals, including their page headlines |
| **Testimonials** | Customer quotes |
| **FAQs** | Answer groups reused across the FAQ page, service pages and structured data |
| **Menu** | Top navigation, including dropdown links |
| **Footer** | Footer columns and links |
| **Legal page list** | Names shown in the footer legal column |
| **Audience segments** | Startups, agencies, enterprise, IR |
| **Network channels** | The marquee list of channel names |
| **Password & session** | Change your password |

Any list — plans, services, industries, FAQs, menu items, footer links — supports **add**,
**remove** and **reorder** with the ↑ ↓ ✕ buttons on each item.

### Two things worth knowing

- **Site-wide changes propagate everywhere.** Change the brand email or phone number in
  *Brand & contact* and it updates the header, footer, contact page, JSON-LD structured data
  and `llms.txt` together. Rename an industry and its page, menu entry and footer link all
  follow.
- **Editing a page body detaches it.** A page body is HTML. Once you edit one and save, that
  page keeps your version and stops picking up later site-wide changes, because it no longer
  interpolates the live values. Use **Reset to default** on the page to undo that and start
  from the generated content again.

---

## Publishing

Open **Publish** and either:

1. **Check & build (no commit)** — regenerates the site and runs the link checker without
   touching git. Use this to see what would change.
2. **Publish** — same, then `git add`, `git commit` and (if ticked) `git push`.

If the build or the link check fails, **nothing is committed**. The file list and raw command
output are shown so you can see what happened.

`git push` uses the credentials already configured on your computer. If the push fails, the
commit still succeeded locally and you can push manually.

You can also just commit normally with git and push — the panel writes ordinary files into the
repository, there is nothing special about them.

---

## How your edits are stored

`npm run admin` does not rewrite the generator source. It writes two JSON files:

```
admin/content/site.json     brand, contact, plans, services, industries, FAQs, menu, footer…
admin/content/pages.json    per-page overrides keyed by slug
```

`tools/build.mjs` reads them at build time and layers them over the defaults in
`tools/site.mjs` and `tools/content/*.mjs`. If an override file is missing or empty, the
site builds from the original defaults exactly as before.

These two files **are meant to be committed** — they are your content. Their absence simply
means "no edits yet", so a fresh clone still builds.

Deleting a key from one of those files (or pressing **Reset to default** in the panel) returns
that section to the original content.

---

## Keeping the admin private

The panel binds to `127.0.0.1` and is only reachable from the machine running it. Even so, the
repository contains the panel source, so it is protected on the server as well:

- The root `.htaccess` blocks `/admin/` outright.
- `admin/.htaccess` denies every request to the directory, so the panel stays private even if
  the repository is checked out somewhere the root rules do not apply.
- `tools/make-deploy.ps1` never copies `admin/` into the deployment package.
- `admin/.auth.json` (the password hash) and session files are in `.gitignore`.

The password is stored as a salted **scrypt** hash, never in plain text. Sessions are held in
memory behind an `HttpOnly; SameSite=Strict` cookie, every write needs a CSRF token, and six
failed logins lock the form for 15 minutes. Restarting the server signs everyone out.

Do not commit `admin/.auth.json` and do not upload the `admin/` folder by hand.

---

## Troubleshooting

**Port 4000 is already in use** — pass another port:

```bash
node admin/server.mjs 4001
```

**"Your session expired or the request was tampered with"** — the server restarted, or the tab
sat idle for more than 8 hours. Reload and sign in again.

**The preview does not show my change** — the preview serves the built files. Save, then click
**Rebuild preview** (the page editor has the button next to the preview pane).

**Publish says the link check failed** — a page references a file that does not exist. The
output lists the broken references; fix them and publish again. Nothing was committed.

**I want to undo a published change** — `git revert` or `git reset` as usual. The panel writes
ordinary commits.

---

## For developers

- `admin/server.mjs` — HTTP server, routing, auth guard, static preview.
- `admin/lib/auth.mjs` — scrypt hashing, sessions, login throttling.
- `admin/lib/schema.mjs` — **the editable content schema**. The browser renders every form
  from this file, so adding a field here is all it takes to expose it in the UI.
- `admin/lib/content.mjs` — reads defaults + overrides, saves edits, media, find & replace,
  and the build/verify/commit pipeline.
- `admin/public/` — the panel UI (one HTML file, one CSS file, one JS module).
- `tools/overrides.mjs` — the shared override layer used by the build.

Like the rest of the project, the panel has **no dependencies**.
