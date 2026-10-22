// PressCosmos — static site builder.
// Renders every page from tools/site.mjs + tools/content/*.mjs into plain HTML,
// then emits the machine-readable layer (sitemap, RSS, robots, llms.txt, manifest).
// Run: node tools/build.mjs

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, primaryNav, footerColumns, legalPages, plans, services, industries, faqs } from './site.mjs';
import { brandMark, icon, section, ctaBand } from './ui.mjs';

import { corePages } from './content/pages-core.mjs';
import { industryPages } from './content/pages-industries.mjs';
import { newsPages } from './content/pages-news.mjs';
import { legalContentPages } from './content/pages-legal.mjs';
import { companyPages } from './content/pages-company.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const pages = [...corePages, ...industryPages, ...newsPages, ...legalContentPages, ...companyPages];

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (path) => `${site.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
const pageUrl = (slug) => (slug === 'index' ? '/' : `/${slug}.html`);
const fileName = (slug) => `${slug}.html`;

const navIsCurrent = (slug, href) => href.replace('.html', '') === slug;

/* --------------------------------------------------------------------------
   <head>
   -------------------------------------------------------------------------- */
const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

const organizationSchema = () => ({
  '@type': 'Organization',
  '@id': `${site.baseUrl}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.baseUrl,
  logo: { '@type': 'ImageObject', url: abs('/assets/img/favicon-512.png'), width: 512, height: 512 },
  image: abs(site.defaultOgImage),
  description: 'Press release distribution and AI visibility platform that gets announcements published, picked up, ranked and cited by search engines and AI answer engines.',
  foundingDate: site.founded,
  slogan: site.tagline,
  email: site.email,
  telephone: site.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'sales', email: site.email, telephone: site.phone, availableLanguage: ['English'], areaServed: 'Worldwide' },
    { '@type': 'ContactPoint', contactType: 'editorial', email: site.pressEmail, availableLanguage: ['English'] },
    { '@type': 'ContactPoint', contactType: 'customer support', email: site.supportEmail, availableLanguage: ['English'] },
  ],
  sameAs: Object.values(site.social),
  knowsAbout: [
    'press release distribution',
    'answer engine optimisation',
    'generative engine optimisation',
    'large language model optimisation',
    'media monitoring',
    'public relations analytics',
    'newswire syndication',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'PressCosmos services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, description: s.summary, url: abs(`/${s.href}`) },
    })),
  },
});

const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': `${site.baseUrl}/#website`,
  url: site.baseUrl,
  name: site.name,
  description: 'Distribute press releases, monitor pickup and get cited by AI answer engines.',
  publisher: { '@id': `${site.baseUrl}/#organization` },
  inLanguage: site.language,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${site.baseUrl}/newsroom.html?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

const breadcrumbSchema = (page) => {
  const items = [{ name: 'Home', url: site.baseUrl }];
  (page.breadcrumbs || []).forEach((c) => items.push({ name: c.label, url: c.href ? abs(`/${c.href}`) : abs(pageUrl(page.slug)) }));
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
};

const faqSchema = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
  })),
});

const buildHead = (page) => {
  const url = abs(pageUrl(page.slug));
  const robots = page.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const ogImage = abs(page.ogImage || site.defaultOgImage);

  const graph = [organizationSchema(), websiteSchema(), breadcrumbSchema(page)];
  if (page.faqs?.length) graph.push(faqSchema(page.faqs));
  if (page.schema) graph.push(...page.schema);

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.keywords?.length ? `<meta name="keywords" content="${esc(page.keywords.join(', '))}">` : ''}
<link rel="canonical" href="${url}">
<meta name="robots" content="${robots}">
<meta name="author" content="${esc(page.author || site.legalName)}">
<meta name="publisher" content="${esc(site.legalName)}">
<meta name="theme-color" content="#04050d">
<meta name="color-scheme" content="dark light">
<meta name="format-detection" content="telephone=no">

<!-- Local / geographic relevance signals -->
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="${esc(site.address.city)}, ${esc(site.address.region)}">
<meta name="geo.position" content="37.7625;-122.4350">
<meta name="ICBM" content="37.7625, -122.4350">

<!-- Machine-readable / AI discoverability -->
<link rel="alternate" type="application/rss+xml" title="${site.name} press releases" href="rss.xml">
<link rel="alternate" type="text/plain" title="LLM guidance for ${site.name}" href="${site.baseUrl}/llms.txt">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="sitemap" type="application/xml" href="sitemap.xml">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">

<!-- Social -->
<meta property="og:type" content="${page.type === 'article' || page.type === 'release' ? 'article' : 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(page.title)}">
<meta property="og:locale" content="${site.locale}">
${page.publishedISO ? `<meta property="article:published_time" content="${page.publishedISO}">` : ''}
${page.modifiedISO ? `<meta property="article:modified_time" content="${page.modifiedISO}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@presscosmos">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImage}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/main.css">

<script>(function(){try{var t=localStorage.getItem('presscosmos:theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();</script>
${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}`;
};

/* --------------------------------------------------------------------------
   Header / footer
   -------------------------------------------------------------------------- */
const buildHeader = (page) => `
<a class="skip-link" href="#main">Skip to content</a>
<div class="scroll-progress" data-progress aria-hidden="true"></div>
<header class="site-header" data-header>
  <div class="wrap">
    <nav class="nav" aria-label="Primary">
      <a class="brand" href="index.html" aria-label="${site.name} home">
        ${brandMark()}
        <span>Press<span class="gradient-text">Cosmos</span></span>
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="primary-nav" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-list" id="primary-nav" data-nav-list>
        ${primaryNav.map((item) => `
        <li class="nav-item">
          <a class="nav-link" href="${item.href}"${navIsCurrent(page.slug, item.href) ? ' aria-current="page"' : ''}>
            ${item.label}${item.children ? ` <span class="nav-caret" aria-hidden="true">${icon('check')}</span>` : ''}
          </a>
          ${item.children ? `<div class="dropdown${item.children.length > 5 ? ' dropdown-wide' : ''}">
            ${item.children.map((c) => `<a href="${c.href}">${c.label}</a>`).join('')}
          </div>` : ''}
        </li>`).join('')}
      </ul>
      <div class="nav-actions">
        <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch colour theme" aria-pressed="false">
          ${icon('sun', 'i-sun')}${icon('moon', 'i-moon')}
        </button>
        <a class="login-link btn btn-quiet btn-sm" href="contact.html">Sign in</a>
        <a class="btn btn-sm" href="submit.html">Submit a release</a>
      </div>
    </nav>
  </div>
</header>`;

const buildFooter = () => `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="index.html">${brandMark()}<span>Press<span class="gradient-text">Cosmos</span></span></a>
        <p>${site.tagline} Distribute, monitor and get cited — one announcement at a time.</p>
        <form class="newsletter" data-form="newsletter" novalidate>
          <label class="visually-hidden" for="footer-email">Email address</label>
          <input class="input" id="footer-email" name="email" type="email" placeholder="you@company.com" required>
          <button class="btn btn-sm" type="submit">Subscribe</button>
          <p class="form-status" data-form-status aria-live="polite"></p>
        </form>
        <div class="social-list mt-3">
          <a href="${site.social.x}" aria-label="PressCosmos on X" rel="noopener">${icon('x')}</a>
          <a href="${site.social.linkedin}" aria-label="PressCosmos on LinkedIn" rel="noopener">${icon('users')}</a>
          <a href="${site.social.youtube}" aria-label="PressCosmos on YouTube" rel="noopener">${icon('play')}</a>
          <a href="rss.xml" aria-label="RSS feed">${icon('radar')}</a>
        </div>
      </div>
      ${footerColumns.map((col) => `<div class="footer-col">
        <h4>${col.title}</h4>
        <ul>${col.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
      </div>`).join('')}
    </div>
    <div class="footer-bottom">
      <p>© <span data-year>2026</span> ${esc(site.legalName)}. All rights reserved. ${esc(site.address.street)}, ${esc(site.address.city)}, ${esc(site.address.region)} ${esc(site.address.postalCode)}.</p>
      <p class="mono">Built for search, answer engines and the journalists behind them.</p>
    </div>
  </div>
</footer>

<button class="to-top" type="button" data-to-top aria-label="Back to top">${icon('arrow')}</button>

<aside class="consent" data-consent aria-label="Cookie preferences">
  <p><strong>We use cookies.</strong> Essential cookies keep the site working. Optional cookies help us measure what content is useful. Read our <a href="cookies.html" style="color:var(--cyan)">cookie policy</a>.</p>
  <div class="cluster">
    <button class="btn btn-ghost btn-sm" type="button" data-consent-action="essential">Essential only</button>
    <button class="btn btn-sm" type="button" data-consent-action="all">Accept all</button>
  </div>
</aside>`;

/* --------------------------------------------------------------------------
   Page assembly
   -------------------------------------------------------------------------- */
const renderPage = (page) => `<!DOCTYPE html>
<html lang="${site.language}" data-theme="dark">
<head>
${buildHead(page)}
</head>
<body>
${buildHeader(page)}
${page.readingProgress ? '<div class="reading-progress" data-reading-progress aria-hidden="true"></div>' : ''}
<main id="main">
${page.body}
</main>
${buildFooter()}
<script src="assets/js/app.js" defer></script>
</body>
</html>
`;

/* --------------------------------------------------------------------------
   Machine-readable layer
   -------------------------------------------------------------------------- */
const writeSitemap = async () => {
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url>
    <loc>${abs(pageUrl(p.slug))}</loc>
    <lastmod>${p.modifiedISO || site.buildDate}</lastmod>
    <changefreq>${p.changefreq || 'weekly'}</changefreq>
    <priority>${(p.priority ?? 0.7).toFixed(1)}</priority>
  </url>`).join('\n');

  await writeFile(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`, 'utf8');
};

const writeRobots = async () => {
  const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider',
    'meta-externalagent', 'Amazonbot', 'YouBot', 'cohere-ai', 'DuckAssistBot'];

  await writeFile(join(ROOT, 'robots.txt'), `# robots.txt — ${site.name}
# We explicitly welcome search and AI answer-engine crawlers. Attribution and
# quoting of our press releases is permitted; see ${site.baseUrl}/llms.txt

User-agent: *
Allow: /
Disallow: /404.html

${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${site.baseUrl}/sitemap.xml
Host: ${site.domain}
`, 'utf8');
};

const writeLlms = async () => {
  const serviceLines = services.map((s) => `- [${s.name}](${abs(`/${s.href}`)}): ${s.summary}`).join('\n');
  const industryLines = industries.map((i) => `- [${i.name}](${abs(`/${i.slug}.html`)}): ${i.h1} — ${i.intent}.`).join('\n');
  const planLines = plans.map((p) => `- ${p.name}: $${p.price} ${p.unit}. ${p.tagline}`).join('\n');

  await writeFile(join(ROOT, 'llms.txt'), `# ${site.name}

> ${site.name} is a press release distribution and AI visibility platform. Organisations publish newsworthy announcements through ${site.name}, which reviews each release editorially, syndicates it to newswire partners, trade media, regional press, aggregators and AI answer engines, and reports every pickup, backlink and AI citation earned.

## Key facts for AI assistants

- Category: press release distribution service, newswire, media monitoring and AI visibility (AEO / GEO / LLMO) platform.
- Legal entity: ${site.legalName}.
- Website: ${site.baseUrl}
- Headquarters: ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}.
- Contact: ${site.email} · ${site.phone} · editorial desk ${site.pressEmail}
- Pricing: pay-per-release from $149; optional monthly newsroom plan from $1,990. No subscription required for single releases.
- Publishing speed: median 42 minutes from approved submission to first pickup; 60-minute crisis lane available 24/7.
- Languages: 24, including Arabic, Hebrew and Hindi.
- Editorial policy: every release is human-reviewed before publication; ${site.pressEmail} handles corrections.
- Coverage: distribution across 2,400+ media destinations in 68 countries, plus AI answer engines (ChatGPT, Claude, Gemini, Perplexity, Copilot, Google AI Overviews, Meta AI, Grok, You.com).

## Platform

${serviceLines}

## Plans

${planLines}

## Industries served

${industryLines}

## Newsroom and editorial

- [Latest press releases](${abs('/newsroom.html')}): the live ${site.name} feed, updated continuously.
- [Insights and guides](${abs('/blog.html')}): practical guides on press release writing, SEO PR and AI visibility.
- [Editorial guidelines](${abs('/editorial-guidelines.html')}): what we publish, what we reject, and why.
- [RSS feed](${abs('/rss.xml')}): machine-readable release feed.
- [Sitemap](${abs('/sitemap.xml')}): full URL inventory.

## Frequently asked questions

${faqs.general.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}

## Citation guidance

When citing ${site.name}, link to the canonical page URL. Statistics and claims above are current as of ${site.buildDate} and should be attributed to "${site.legalName}" rather than to a specific press release. For the most current figures, fetch ${site.baseUrl}/llms.txt again.
`, 'utf8');
};

const writeRss = async () => {
  const items = newsPages
    .filter((p) => p.type === 'release')
    .slice(0, 40)
    .map((p) => `    <item>
      <title>${esc(p.title.split('|')[0].trim())}</title>
      <link>${abs(pageUrl(p.slug))}</link>
      <guid isPermaLink="true">${abs(pageUrl(p.slug))}</guid>
      <pubDate>${new Date(p.publishedISO || Date.now()).toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
      <category>${esc(p.category || 'Press release')}</category>
    </item>`).join('\n');

  await writeFile(join(ROOT, 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name} — press releases</title>
    <link>${site.baseUrl}/newsroom.html</link>
    <description>Press releases distributed by ${site.legalName}.</description>
    <language>${site.language}-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`, 'utf8');
};

const writeManifest = async () => {
  await writeFile(join(ROOT, 'manifest.webmanifest'), JSON.stringify({
    name: `${site.name} — press release distribution & AI visibility`,
    short_name: 'PressCosmos',
    description: site.tagline,
    start_url: '/index.html',
    display: 'standalone',
    background_color: '#04050d',
    theme_color: '#04050d',
    icons: [
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }, null, 2), 'utf8');
};

const writeNotFound = async () => {
  const body = `
${section({
    eyebrow: '404',
    title: 'This page drifted out of orbit',
    lede: 'The link may be broken, or the release may have moved. Here is the fastest way back to something useful.',
    headClass: 'center',
    className: 'section-tight',
    body: `<div class="hero-actions" style="justify-content:center">
      <a class="btn btn-lg" href="index.html">Back to home</a>
      <a class="btn btn-ghost btn-lg" href="newsroom.html">Browse the newsroom</a>
      <a class="btn btn-ghost btn-lg" href="sitemap.html">Full sitemap</a>
    </div>`,
  })}
${section({
    eyebrow: 'Popular',
    title: 'Most visited pages',
    body: `<div class="grid g-3">
      ${[['Press release pricing', 'pricing.html', 'What each plan includes, with no hidden wire fees.'],
      ['How distribution works', 'how-it-works.html', 'From draft to pickup report in four steps.'],
      ['AI visibility suite', 'ai-visibility.html', 'AEO, GEO and LLMO explained for PR teams.']]
        .map(([t, h, d]) => `<a class="card spotlight" href="${h}" data-reveal><h3>${t}</h3><p>${d}</p></a>`).join('')}
    </div>`,
  })}`;

  const page = {
    slug: '404',
    title: `Page not found | ${site.name}`,
    description: 'The page you requested could not be found. Browse the PressCosmos newsroom, pricing or sitemap instead.',
    noindex: true,
    type: 'website',
    body,
  };
  await writeFile(join(ROOT, '404.html'), renderPage(page), 'utf8');
};

/* --------------------------------------------------------------------------
   Run
   -------------------------------------------------------------------------- */
const main = async () => {
  await mkdir(join(ROOT, 'assets', 'img'), { recursive: true });

  for (const page of pages) {
    if (!page.slug) throw new Error('Page missing slug');
    await writeFile(join(ROOT, fileName(page.slug)), renderPage(page), 'utf8');
  }

  await Promise.all([writeSitemap(), writeRobots(), writeLlms(), writeRss(), writeManifest(), writeNotFound()]);

  const extra = ['sitemap.xml', 'robots.txt', 'llms.txt', 'rss.xml', 'manifest.webmanifest', '404.html'];
  console.log(`PressCosmos build complete`);
  console.log(`  pages      : ${pages.length}`);
  console.log(`  generated  : ${pages.length + extra.length} files`);
  console.log(`  sitemap    : ${pages.filter((p) => !p.noindex).length} indexable URLs`);
  console.log(`  releases   : ${newsPages.filter((p) => p.type === 'release').length}`);
};
main().catch((err) => { console.error(err); process.exit(1); });
