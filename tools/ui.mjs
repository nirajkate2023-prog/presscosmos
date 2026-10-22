// PressCosmos — HTML component helpers used by every page template.
// Pure string functions: no framework, no runtime cost.

/* ---------------------------------- icons --------------------------------- */
const ICONS = {
  send: '<path d="M4.5 12.5 20 4l-6.2 16-2.4-6.1z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4"/>',
  radar: '<path d="M12 12 19 5"/><path d="M3.6 14.4A9 9 0 1 0 9 3.7"/><path d="M7.2 14.9A4.6 4.6 0 1 0 9.4 8.3"/><circle cx="12" cy="12" r="1.6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  building: '<path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15"/><path d="M15 11h3a2 2 0 0 1 2 2v8"/><path d="M8 8h3M8 12h3M8 16h3M2 21h20"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  shield: '<path d="M12 3l7.5 3v6c0 4.6-3.1 7.9-7.5 9-4.4-1.1-7.5-4.4-7.5-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
  trend: '<path d="M3 17.5 9 11l4 4 8-8.5"/><path d="M21 6.5v5h-5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17"/><path d="M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3.2 2"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20a6.4 6.4 0 0 1 12.4 0"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.4M18 20a6.5 6.5 0 0 0-2.2-4.9"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.4"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
  bolt: '<path d="M13.4 2 5 13.4h5.4L9.8 22 18.5 10.5h-5.6z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3.5 12.6 8.5 4.7 8.5-4.7"/><path d="m3.5 16.6 8.5 4.7 8.5-4.7"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.4"/><path d="m3.8 7.2 8.2 5.6 8.2-5.6"/>',
  phone: '<path d="M6.2 3.5h3.1l1.6 4-2 1.4a11.4 11.4 0 0 0 5.7 5.7l1.4-2 4 1.6v3.1a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2z"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  download: '<path d="M12 3v11"/><path d="m7.5 10 4.5 4.5 4.5-4.5"/><path d="M4.5 20h15"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10.2 8.6 16 12l-5.8 3.4z"/>',
  star: '<path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9z"/>',
  filter: '<path d="M3.5 5.5h17l-6.4 7.6V20l-4.2-2.4v-4.5z"/>',
  quote: '<path d="M9.5 6C6.9 7.4 5.4 9.6 5.4 12.4c0 3 1.7 4.9 4 4.9 2 0 3.4-1.4 3.4-3.3 0-1.9-1.3-3.2-3.1-3.2h-.5c.2-1.3 1.2-2.4 2.6-3.2zM19 6c-2.6 1.4-4.1 3.6-4.1 6.4 0 3 1.7 4.9 4 4.9 2 0 3.4-1.4 3.4-3.3 0-1.9-1.3-3.2-3.1-3.2h-.5c.2-1.3 1.2-2.4 2.6-3.2z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 10h17M8 3.5V6M16 3.5V6"/>',
  tag: '<path d="M4 10.6V5a1 1 0 0 1 1-1h5.6a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.8l-5.6 5.6a2 2 0 0 1-2.8 0L3.6 12a2 2 0 0 1-.6-1.4z"/><circle cx="8.2" cy="8.2" r="1.4"/>',
  external: '<path d="M14 4h6v6"/><path d="m20 4-8.5 8.5"/><path d="M18 14v4.5a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2H11"/>',
  check: '<path d="m4.5 12.5 5 5 10-10"/>',
  arrow: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
  x: '<path d="M4 4l16 16M20 4 4 20"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',
  moon: '<path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2z"/>',
  cpu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/><path d="M10 3.5v3M14 3.5v3M10 17.5v3M14 17.5v3M3.5 10h3M3.5 14h3M17.5 10h3M17.5 14h3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/>',
  camera: '<path d="M3.5 8.5h3l1.4-2h8.2l1.4 2h3v10h-17z"/><circle cx="12" cy="13" r="3.2"/>',
};

export const icon = (name, cls = '') => {
  const path = ICONS[name] || ICONS.sparkle;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${path}</svg>`;
};

const solid = (name, cls = '') => {
  const path = ICONS[name] || ICONS.sparkle;
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${path}</svg>`;
};

/* --------------------------------- accents -------------------------------- */
export const brandMark = () => `
<svg class="brand-mark" viewBox="0 0 30 30" aria-hidden="true">
  <defs>
    <linearGradient id="bm" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#7c5cff"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
  <circle cx="15" cy="15" r="6.4" fill="url(#bm)" class="planet"/>
  <g class="orbit" stroke="url(#bm)" fill="none" stroke-width="1.3">
    <ellipse cx="15" cy="15" rx="13.4" ry="5.6"/>
    <ellipse cx="15" cy="15" rx="13.4" ry="5.6" transform="rotate(60 15 15)"/>
    <ellipse cx="15" cy="15" rx="13.4" ry="5.6" transform="rotate(120 15 15)"/>
  </g>
  <circle cx="27.6" cy="15" r="1.7" fill="#22d3ee"/>
</svg>`;

/* Art variants for story/blog cards — pure inline SVG, no image requests. */
const ART = [
  (id) => `<svg viewBox="0 0 400 225" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="400" y2="225" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><g fill="none" stroke="url(#${id})" stroke-width="1.4" opacity=".85"><ellipse cx="200" cy="112" rx="150" ry="52"/><ellipse cx="200" cy="112" rx="150" ry="52" transform="rotate(48 200 112)"/><ellipse cx="200" cy="112" rx="150" ry="52" transform="rotate(96 200 112)"/></g><circle cx="200" cy="112" r="34" fill="url(#${id})" opacity=".9"/></svg>`,
  (id) => `<svg viewBox="0 0 400 225" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="225" x2="400" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f472b6"/><stop offset="1" stop-color="#7c5cff"/></linearGradient></defs><g stroke="url(#${id})" fill="none" stroke-width="2" opacity=".9"><path d="M0 170c40-70 70 30 110-20s60-80 100-40 80 90 190 20"/><path d="M0 195c50-50 80 20 120-30s70-60 110-20 70 70 170 10" opacity=".5"/></g><circle cx="310" cy="60" r="20" fill="url(#${id})" opacity=".85"/></svg>`,
  (id) => `<svg viewBox="0 0 400 225" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="400" y2="225" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#a3e635"/></linearGradient></defs><g stroke="url(#${id})" stroke-width="1.2" fill="none" opacity=".8"><path d="M40 185V95M100 185V45M160 185v-70M220 185V70M280 185v-52M340 185v-96"/></g><g fill="url(#${id})" opacity=".95"><circle cx="40" cy="95" r="7"/><circle cx="100" cy="45" r="7"/><circle cx="160" cy="115" r="7"/><circle cx="220" cy="70" r="7"/><circle cx="280" cy="133" r="7"/><circle cx="340" cy="89" r="7"/></g></svg>`,
  (id) => `<svg viewBox="0 0 400 225" aria-hidden="true"><defs><radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#fb7185"/></radialGradient></defs><g fill="none" stroke="url(#${id})" stroke-width="1.3" opacity=".9"><circle cx="120" cy="112" r="70"/><circle cx="260" cy="112" r="70"/><circle cx="190" cy="112" r="110" opacity=".45"/></g><circle cx="190" cy="112" r="28" fill="url(#${id})"/></svg>`,
  (id) => `<svg viewBox="0 0 400 225" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="400" y2="225" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7c5cff"/><stop offset=".5" stop-color="#f472b6"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><g fill="url(#${id})" opacity=".9"><rect x="30" y="30" width="150" height="80" rx="12" opacity=".55"/><rect x="200" y="60" width="170" height="120" rx="12" opacity=".8"/><rect x="60" y="130" width="120" height="70" rx="12" opacity=".7"/></g></svg>`,
  (id) => `<svg viewBox="0 0 400 225" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="400" y2="225" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a3e635"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><g stroke="url(#${id})" fill="none" stroke-width="1.4" opacity=".85"><path d="M30 190 90 60l60 90 60-110 60 100 70-80"/></g><g fill="url(#${id})"><circle cx="90" cy="60" r="6"/><circle cx="150" cy="150" r="6"/><circle cx="210" cy="40" r="6"/><circle cx="270" cy="140" r="6"/><circle cx="340" cy="60" r="6"/></g></svg>`,
];
export const art = (seed = 0) => {
  const id = `a${Math.abs(seed) % 6}-${Math.abs(seed * 7) % 97}`;
  return ART[Math.abs(seed) % ART.length](id);
};

/* -------------------------------- primitives ------------------------------ */
export const crumbs = (items = []) => `
<nav class="crumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="index.html">Home</a></li>
    ${items.map((c) => `<li>${c.href ? `<a href="${c.href}">${c.label}</a>` : `<span aria-current="page">${c.label}</span>`}</li>`).join('')}
  </ol>
</nav>`;

export const pageHero = ({ eyebrow, h1, lede, actions = '', aside = '', crumbItems = [], badge = '' }) => `
<section class="page-hero">
  <div class="wrap">
    ${crumbItems.length ? crumbs(crumbItems) : ''}
    <div class="page-hero-side" style="margin-top:1.5rem">
      <div>
        ${badge ? `<p class="pill ${badge.class || ''}" style="margin-bottom:1rem">${badge.text}</p>` : ''}
        ${eyebrow ? `<p class="eyebrow" style="margin-bottom:1rem">${eyebrow}</p>` : ''}
        <h1${h1.length < 40 ? ' class="display"' : ''}>${h1}</h1>
        ${lede ? `<p class="lede">${lede}</p>` : ''}
        ${actions ? `<div class="hero-actions">${actions}</div>` : ''}
      </div>
      ${aside}
    </div>
  </div>
</section>`;

export const section = ({ id = '', eyebrow, title, lede, body, className = '', headClass = '' }) => `
<section class="section ${className}"${id ? ` id="${id}"` : ''}>
  <div class="wrap">
    ${title ? `<div class="section-head ${headClass}" data-reveal>
      ${eyebrow ? `<p class="eyebrow" style="margin-bottom:1rem">${eyebrow}</p>` : ''}
      <h2>${title}</h2>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
    </div>` : ''}
    ${body || ''}
  </div>
</section>`;

export const card = ({ iconName, title, text, bullets = [], href, cta = 'Learn more', tag = '', reveal = true }) => `
<article class="card spotlight"${reveal ? ' data-reveal' : ''}>
  ${tag ? `<span class="tag" style="margin-bottom:.9rem;display:inline-block">${tag}</span>` : ''}
  ${iconName ? `<div class="card-icon">${icon(iconName)}</div>` : ''}
  <h3>${title}</h3>
  ${text ? `<p>${text}</p>` : ''}
  ${bullets.length ? `<ul class="ticks">${bullets.map((b) => `<li>${b}</li>`).join('')}</ul>` : ''}
  ${href ? `<p style="margin-top:1.25rem"><a class="link-arrow" href="${href}">${cta} ${icon('arrow')}</a></p>` : ''}
</article>`;

export const statRow = (stats) => `
<div class="stat-row" data-stagger>
  ${stats.map((s) => `<div>
    <p class="stat-value"><span data-count="${s.value}">0</span><span class="gradient-text">${s.suffix}</span></p>
    <p class="stat-label">${s.label}</p>
  </div>`).join('')}
</div>`;

export const ticker = (items) => `
<div class="marquee" aria-hidden="true">
  ${[0, 1].map(() => `<div class="marquee-track">${items.map((i) => `<span class="marquee-item">${i}</span>`).join('')}</div>`).join('')}
</div>`;

export const callout = ({ title, text, kind = '' }) => `
<aside class="callout ${kind}" data-reveal>
  ${title ? `<strong>${title}</strong>` : ''}
  ${text}
</aside>`;

export const answer = (html) => `
<div class="callout callout-answer" data-reveal>
  <strong>Quick answer</strong>
  ${html}
</div>`;

export const takeaways = (items) => `
<div class="callout callout-takeaways" data-reveal>
  <strong>Key takeaways</strong>
  <ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>
</div>`;

export const faqSection = ({ items, title = 'Frequently asked questions', eyebrow = 'Answers', lede = '', id = 'faq' }) => `
<section class="section" id="${id}">
  <div class="wrap">
    <div class="split" style="align-items:start">
      <div class="section-head" style="margin-bottom:0" data-reveal>
        <p class="eyebrow" style="margin-bottom:1rem">${eyebrow}</p>
        <h2>${title}</h2>
        ${lede ? `<p class="lede">${lede}</p>` : ''}
        <p class="mt-3 muted" style="font-size:var(--step--1)">Still stuck? <a class="link-arrow" href="contact.html">Talk to a specialist ${icon('arrow')}</a></p>
      </div>
      <div class="faq-list" data-accordion="single">
        ${items.map((f, i) => `<div class="faq-item">
          <h3 style="margin:0"><button class="faq-q" type="button">${f.q}<span class="icon" aria-hidden="true"></span></button></h3>
          <div class="faq-a"><div class="faq-a-inner prose" style="font-size:var(--step-0)">${f.a}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

export const ctaBand = ({ title = 'Put your next announcement in front of the people who act on it.', text = 'Launch in under an hour. Editorial review, distribution, monitoring and AI visibility in one place.', primary = 'Submit a press release', primaryHref = 'submit.html', secondary = 'See pricing', secondaryHref = 'pricing.html' }) => `
<section class="section">
  <div class="wrap">
    <div class="cta-band" data-reveal>
      <p class="eyebrow" style="justify-content:center;display:inline-flex">Get started</p>
      <h2 style="margin-top:1rem">${title}</h2>
      <p class="lede mx-auto" style="margin-top:1rem;max-width:60ch">${text}</p>
      <div class="hero-actions" style="justify-content:center">
        <a class="btn btn-lg" href="${primaryHref}">${primary}</a>
        <a class="btn btn-ghost btn-lg" href="${secondaryHref}">${secondary}</a>
      </div>
      <p class="mono faint mt-3">No subscription required · Cancel anytime · Human editorial review on every release</p>
    </div>
  </div>
</section>`;

export const planCard = (plan) => `
<article class="card plan spotlight${plan.popular ? ' is-popular' : ''}" data-reveal>
  ${plan.popular ? '<span class="plan-badge">Most popular</span>' : ''}
  <h3>${plan.name}</h3>
  <p style="font-size:var(--step--1)">${plan.tagline}</p>
  <p class="plan-price"><span class="amount gradient-text">$${plan.price.toLocaleString('en-US')}</span><span class="unit">${plan.unit}</span></p>
  <a class="btn ${plan.popular ? '' : 'btn-ghost'} btn-block" href="submit.html?plan=${plan.slug}">Start with ${plan.name}</a>
  <ul>${plan.features.map((f) => `<li>${icon('check')}<span>${f}</span></li>`).join('')}</ul>
</article>`;

export const listCheck = (items) => `<ul class="list-check">${items.map((i) => `<li>${icon('check')}<span>${i}</span></li>`).join('')}</ul>`;

export const storyCard = ({ href, title, excerpt, category, date, readTime, seed = 0 }) => `
<article class="card story spotlight" data-reveal>
  <a class="story-art" href="${href}" aria-hidden="true" tabindex="-1">${art(seed)}</a>
  <div class="story-body">
    <p class="story-meta"><span>${category}</span><span>·</span><time datetime="${date.iso}">${date.label}</time></p>
    <h3><a href="${href}">${title}</a></h3>
    <p>${excerpt}</p>
    <div class="story-foot"><span>${readTime}</span><a class="link-arrow" href="${href}">Read ${icon('arrow')}</a></div>
  </div>
</article>`;

export const releaseRow = ({ href, title, summary, category, date, location, seed = 0 }) => `
<article class="release-row" data-reveal data-filter-item data-tags="${category.toLowerCase()}">
  <div>
    <p class="where">${category}</p>
    <p class="mono faint" style="margin-top:.35rem"><time datetime="${date.iso}">${date.label}</time></p>
  </div>
  <div>
    <h3><a href="${href}">${title}</a></h3>
    <p class="muted" style="margin-top:.4rem;font-size:var(--step--1)">${summary}</p>
    <p class="mono faint" style="margin-top:.5rem">${location}</p>
  </div>
  <a class="btn btn-ghost btn-sm" href="${href}">Read release</a>
</article>`;

export const quote = (t) => `
<figure class="card spotlight" data-reveal>
  <div style="color:var(--violet);width:26px">${solid('quote')}</div>
  <blockquote style="margin-top:1rem;font-family:var(--font-display);font-size:var(--step-1);line-height:1.5">${t.quote}</blockquote>
  <figcaption style="margin-top:1.25rem;display:flex;gap:.7rem;align-items:center">
    <span class="avatar" aria-hidden="true">${t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
    <span><strong style="display:block;font-size:var(--step--1)">${t.name}</strong><span class="muted" style="font-size:var(--step--1)">${t.role}, ${t.company}</span></span>
  </figcaption>
</figure>`;

export const icons = { solid, ICONS };
