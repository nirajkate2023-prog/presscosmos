# Deploying PressCosmos

The site is plain static HTML with no build step, so hosting is simple. GitHub Pages is
already configured for this repository.

## Current setup

| Setting | Value |
| --- | --- |
| Live URL | https://nirajkate2023-prog.github.io/presscosmos/ |
| Source | `main` branch, repository root |
| Build step | none |
| HTTPS | enabled |

Every push to `main` redeploys automatically. There is no CI workflow and nothing to
configure.

## Pointing presscosmos.com at the site

The custom domain is deliberately **not** activated yet. GitHub redirects the `github.io`
URL to the custom domain as soon as one is set, so enabling it before DNS is live would
break the preview link.

When you are ready, do these two things in this order.

### 1. Create the DNS records at your registrar

For an apex domain (`presscosmos.com`), create four A records:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

For the `www` subdomain, create one CNAME record:

```
CNAME    www    nirajkate2023-prog.github.io
```

Optional but recommended — IPv6 support:

```
AAAA    @    2606:50c0:8000::153
AAAA    @    2606:50c0:8001::153
AAAA    @    2606:50c0:8002::153
AAAA    @    2606:50c0:8003::153
```

Then set the apex domain to redirect to `www`, or vice versa, so you have one canonical
hostname. Pick one and be consistent — this matters for the canonical tags in the HTML.

### 2. Tell GitHub the domain and add the CNAME file

Add a file named `CNAME` in the repository root containing exactly:

```
presscosmos.com
```

Then enable the domain in GitHub (Settings → Pages → Custom domain), or via the API:

```bash
gh api -X PUT repos/nirajkate2023-prog/presscosmos/pages \
  -f cname=presscosmos.com -f build_type=legacy
```

Tick **Enforce HTTPS** once the certificate is issued. GitHub provisions a Let's Encrypt
certificate automatically; it usually takes a few minutes and can take up to 24 hours after
DNS propagates.

### 3. Update the canonical URL

`tools/site.mjs` has a `baseUrl` value. It is already set to `https://presscosmos.com`,
which is the correct production canonical, so no change is needed — but if you launch on a
different domain, change it there and run `node tools/build.mjs`.

## Verifying the deployment

```bash
node tools/check-links.mjs                  # all internal links resolve locally
curl -I https://presscosmos.com/            # 200 OK over HTTPS
curl -s https://presscosmos.com/robots.txt  # crawler policy is live
curl -s https://presscosmos.com/llms.txt    # AI guidance file is live
```

After the domain is live, submit `https://presscosmos.com/sitemap.xml` in Google Search
Console and Bing Webmaster Tools. The `robots.txt` already explicitly allows the major AI
crawlers, and `llms.txt` gives assistants a factual summary of the business.

## Redeploying after changes

```bash
node tools/build.mjs && node tools/check-links.mjs
git add -A && git commit -m "Update site" && git push
```

GitHub Pages picks up the change within about a minute.

## Alternative hosts

Because there is no server-side code, the same repository deploys unchanged to Cloudflare
Pages, Netlify or Vercel by pointing them at the repository root as a static site with no
build command. If you move to Cloudflare Pages you gain edge caching and can set real HTTP
security headers, which GitHub Pages does not allow.
