// PressCosmos — core marketing pages (home, platform, pricing, comparison).

import { site, stats, networkChannels, services, industries, plans, testimonials, faqs } from '../site.mjs';
import {
  icon, section, card, pageHero, statRow, ticker, callout, answer, faqSection, ctaBand,
  planCard, storyCard, quote, listCheck, crumbs,
} from '../ui.mjs';

const d = (label, iso) => ({ label, iso });

/* --------------------------------- HOME ---------------------------------- */
const home = {
  slug: 'index',
  title: `Press Release Distribution & AI Visibility Platform | ${site.name}`,
  description:
    'PressCosmos distributes press releases to 2,400+ media destinations and formats every announcement so journalists find it and AI answer engines cite it. Pay-per-release from $149.',
  keywords: ['press release distribution', 'newswire', 'submit press release', 'AI visibility', 'AEO', 'GEO', 'LLMO', 'PR distribution service'],
  priority: 1.0,
  changefreq: 'daily',
  type: 'website',
  faqs: faqs.general,
  body: `
<section class="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <p class="pill" style="margin-bottom:1.25rem"><span class="pill-live">Live</span> 2,395 releases distributed in the last 24 hours</p>
        <h1><span class="kinetic" data-kinetic>Published, picked up, and cited by AI.</span></h1>
        <p class="lede">PressCosmos is the press release distribution platform built for how people actually find news in ${new Date().getFullYear()}: search engines, news apps, and AI assistants that answer questions instead of listing links. Send one release and reach journalists, trade desks and answer engines at once.</p>
        <div class="hero-actions">
          <a class="btn btn-lg" href="submit.html">Submit a press release ${icon('arrow')}</a>
          <a class="btn btn-ghost btn-lg" href="how-it-works.html">See how it works</a>
        </div>
        <ul class="hero-proof" aria-label="Key service facts">
          <li class="kpi"><b>42 min</b> median to first pickup</li>
          <li class="kpi"><b>24</b> languages</li>
          <li class="kpi"><b>68</b> countries</li>
          <li class="kpi"><b>9</b> AI engines tracked</li>
        </ul>
      </div>
      <div class="orbit-visual" data-parallax="0.035" role="img" aria-label="Illustration of an announcement orbiting through media channels, trade press and AI answer engines">
        <div class="core"></div>
        <div class="ring ring-3"><span class="satellite"></span></div>
        <div class="ring ring-2"><span class="satellite"></span></div>
        <div class="ring"><span class="satellite"></span></div>
        <span class="chip chip-a">${icon('globe')} Newswire partners</span>
        <span class="chip chip-b">${icon('cpu')} AI answer engines</span>
        <span class="chip chip-c">${icon('mic')} Broadcast desks</span>
      </div>
    </div>
  </div>
</section>

<section class="section-tight" aria-label="Distribution network">
  <div class="wrap">
    <p class="center mono faint" style="margin-bottom:1rem">Every release can be routed to channels like these</p>
  </div>
  ${ticker(networkChannels)}
</section>

${section({
    className: 'section-tight',
    body: `<div class="panel panel-glass" style="padding:clamp(1.5rem,4vw,2.75rem);border-radius:var(--r-xl)">
    ${statRow(stats)}
    <p class="mono faint mt-3">Figures reflect rolling 30-day network averages. <a href="analytics.html" style="color:var(--cyan)">See how we measure this →</a></p>
  </div>`,
  })}

${section({
    eyebrow: 'Why PressCosmos',
    title: 'Built for the way news is discovered now',
    lede: 'Traditional wires were designed for a world where a release existed on a page and waited to be found. PressCosmos is designed for search results, answer engines and journalists who are already overwhelmed.',
    body: `<div class="bento" data-stagger>
    <article class="card b-2 b-tall spotlight">
      <div class="card-icon">${icon('cpu')}</div>
      <h3>AI visibility baked into every release</h3>
      <p>Each announcement ships with structured data, a plain-language summary block, stable canonical URLs and clean semantic HTML — the signals that make a model willing to quote you by name.</p>
      <ul class="ticks">
        <li>NewsArticle and Organization schema on every page</li>
        <li>Answer-engine formatted summary and key points</li>
        <li>llms.txt guidance and open AI crawler policy</li>
        <li>Share-of-answer tracking across 9 engines</li>
      </ul>
      <p style="margin-top:1.25rem"><a class="link-arrow" href="ai-visibility.html">Explore the AI Visibility Suite ${icon('arrow')}</a></p>
    </article>
    <article class="card b-2 spotlight">
      <div class="card-icon">${icon('radar')}</div>
      <h3>Pickup you can actually see</h3>
      <p>A live map of every outlet that carried the story, plus backlink inventory, sentiment and referral traffic.</p>
      <p style="margin-top:1.25rem"><a class="link-arrow" href="media-monitoring.html">Monitoring ${icon('arrow')}</a></p>
    </article>
    <article class="card b-2 spotlight">
      <div class="card-icon">${icon('shield')}</div>
      <h3>Human editors, not an auto-poster</h3>
      <p>Every release is reviewed for disclosure, verifiability and newsworthiness before it goes out. 98% approval, usually with improvements.</p>
      <p style="margin-top:1.25rem"><a class="link-arrow" href="editorial-guidelines.html">Editorial standards ${icon('arrow')}</a></p>
    </article>
    <article class="card b-2 spotlight">
      <div class="card-icon">${icon('globe')}</div>
      <h3>Targeting that earns regional pickups</h3>
      <p>Country, state and metro-level routing combined with vertical targeting lifts regional pickup 30–60% over blanket distribution.</p>
      <p style="margin-top:1.25rem"><a class="link-arrow" href="distribution.html">Distribution ${icon('arrow')}</a></p>
    </article>
    <article class="card b-4 spotlight">
      <div class="card-icon">${icon('chart')}</div>
      <h3>Board-ready reporting without the spreadsheet archaeology</h3>
      <p>Referral traffic, backlink equity, AI citation share and pipeline attribution in one dashboard, exportable as a PDF your CEO will actually read.</p>
      <p style="margin-top:1.25rem"><a class="link-arrow" href="analytics.html">Analytics &amp; attribution ${icon('arrow')}</a></p>
    </article>
  </div>`,
  })}

${section({
    eyebrow: 'Platform',
    title: 'Everything your announcement needs, in one place',
    lede: 'Pick the pieces you need. Most teams start with distribution and add AI visibility and monitoring in the same campaign.',
    className: 'section',
    body: `<div class="card-grid">${services.map((s) => card({ iconName: s.icon, title: s.name, text: s.summary, href: s.href, cta: 'Explore' })).join('')}</div>`,
  })}

${section({
    eyebrow: 'The difference',
    title: 'Getting published is step one. Being repeated is the point.',
    body: `<div class="split">
    <div class="stack" data-reveal style="--flow:1.15rem">
      <p class="lede">A press release that nobody reads is a PDF with a press release at the top. PressCosmos optimises the four things that decide whether your announcement travels:</p>
      ${listCheck([
      '<strong>Retrievability</strong> — clean HTML, canonical URLs, a sitemap and an open crawler policy so machines can read you.',
      '<strong>Answerability</strong> — a direct answer to the reader\'s obvious question in the first 60 words, so an assistant has something quotable.',
      '<strong>Attribution</strong> — your organisation named consistently as an entity, with a structured knowledge signal behind it.',
      '<strong>Corroboration</strong> — syndication across independent outlets, which is still the strongest signal that a claim is worth repeating.',
    ])}
      <p><a class="link-arrow" href="compare.html">Compare PressCosmos with other wires ${icon('arrow')}</a></p>
    </div>
    <div class="panel panel-glass" style="padding:clamp(1.25rem,3vw,2rem)" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">Example answer block</p>
      <div class="callout callout-answer">
        <strong>What does PressCosmos do?</strong>
        PressCosmos distributes press releases to 2,400+ media destinations and formats each one for AI answer engines. Releases cost from $149 with no subscription, go live in a median of 42 minutes, and include a pickup, backlink and AI citation report.
      </div>
      <p class="mono faint mt-3">This structure — short question, complete answer, named entity, specific numbers — is what gets lifted into AI answers.</p>
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'How it works',
    title: 'Four steps from draft to distribution report',
    body: `<ol class="grid g-4" data-stagger>
    ${[
      ['Draft or upload', 'Write in our editor or paste an existing release. AI drafting is available but never required.', '1'],
      ['Editorial review', 'A human editor checks disclosure, claims and formatting, then approves — usually within an hour.', '2'],
      ['Distribute', 'Route by tier, industry, country and metro. Translation and multimedia attach here.', '3'],
      ['Measure and repeat', 'Watch the pickup map, backlinks and AI citations, then reuse what worked.', '4'],
    ].map(([t, c, n]) => `<li class="card spotlight">
      <p class="mono gradient-text" style="font-size:var(--step-2);font-weight:700">${n}</p>
      <h3 style="margin-top:.5rem">${t}</h3>
      <p>${c}</p>
    </li>`).join('')}
  </ol>
  <div class="hero-actions"><a class="btn btn-ghost" href="how-it-works.html">See the full process ${icon('arrow')}</a></div>`,
  })}

${section({
    eyebrow: 'Industries',
    title: 'Distribution tuned to your sector',
    lede: 'Relevance beats volume. Each industry route carries its own media list, keyword guidance and reviewer specialism.',
    body: `<div class="grid g-4">
    ${industries.slice(0, 8).map((i) => `<a class="card spotlight" href="${i.slug}.html" data-reveal>
      <h3 style="font-size:var(--step-0)">${i.name}</h3>
      <p style="font-size:var(--step--1)">${i.stat}</p>
    </a>`).join('')}
  </div>
  <div class="hero-actions"><a class="btn btn-ghost" href="industries.html">All industries ${icon('arrow')}</a></div>`,
  })}

${section({
    eyebrow: 'Pricing',
    title: 'Pay per release. No seats, no annual lock-in.',
    lede: 'Every plan includes editorial review, a permanent hosted release page and pickup reporting.',
    body: `<div class="plan-grid">${plans.map(planCard).join('')}</div>
  <p class="center muted mt-3" style="font-size:var(--step--1)">Agency and volume pricing starts 22% below list. <a class="link-arrow" href="contact.html">Request a workspace quote ${icon('arrow')}</a></p>`,
  })}

${section({
    eyebrow: 'Customers',
    title: 'What teams say after switching',
    body: `<div class="card-grid">${testimonials.slice(0, 3).map(quote).join('')}</div>
  <p class="center mt-3"><a class="link-arrow" href="testimonials.html">Read more customer reviews ${icon('arrow')}</a></p>`,
  })}

${faqSection({ items: faqs.general.slice(0, 6), lede: 'The questions we get asked most by comms teams evaluating us against their current wire.' })}

${ctaBand({})}`,
};

/* -------------------------------- ABOUT ---------------------------------- */
const about = {
  slug: 'about',
  title: `About PressCosmos | Press Release Distribution Without the Legacy Baggage`,
  description:
    'PressCosmos was founded in 2026 to rebuild press release distribution for search and AI discovery. Meet the team, the editorial standard, and the numbers behind the network.',
  keywords: ['about PressCosmos', 'press release company', 'newswire company', 'AI PR platform'],
  breadcrumbs: [{ label: 'About' }],
  priority: 0.8,
  body: `
${pageHero({
    eyebrow: 'About us',
    h1: 'We rebuilt the newswire for a world that asks questions, not just queries.',
    lede: 'PressCosmos exists because the industry it sits in spent twenty years optimising for fax machines, then put a login screen in front of it. Distribution still matters — how people find news changed completely.',
    crumbItems: [{ label: 'About' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="contact.html">Talk to us</a>',
    aside: `<div class="panel panel-glass" style="padding:1.6rem" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">At a glance</p>
      <div class="grid g-2" style="gap:1rem">
        ${[['Founded', site.founded], ['Headquarters', `${site.address.city}, ${site.address.region}`], ['Editorial desk', site.pressEmail], ['Coverage', '68 countries']]
        .map(([k, v]) => `<div><p class="mono faint" style="font-size:.68rem;letter-spacing:.12em;text-transform:uppercase">${k}</p><p style="font-size:var(--step--1);font-weight:600">${v}</p></div>`).join('')}
      </div>
    </div>`,
  })}

${section({
    body: `<div class="panel panel-glass" style="padding:clamp(1.5rem,4vw,2.5rem);border-radius:var(--r-xl)">
    ${statRow(stats)}
  </div>`,
    className: 'section-tight',
  })}

${section({
    eyebrow: 'Our position',
    title: 'The problem we set out to fix',
    body: `<div class="split">
    <div class="stack prose" data-reveal style="--flow:1.1rem">
      <p>Somewhere between the press release being invented and AI assistants summarising the news for us, distribution stopped being enough. A release could be technically published everywhere and still be invisible — not because it was badly written, but because the machine reading it could not work out who said what, to whom, and why it mattered.</p>
      <p>Legacy wires answered that with price tiers and a bigger logo wall. We answered it with engineering: structured data on every release, plain-language answer blocks, entity-precise organisation markup, an open crawler policy, and reporting that tells you whether you were <em>quoted</em> rather than merely indexed.</p>
      <p>We are not trying to be the cheapest place to dump a link. We are trying to be the distribution layer that a comms team trusts with the one announcement a quarter that actually moves the business.</p>
    </div>
    <div class="grid" style="gap:1rem" data-reveal="right">
      ${card({ iconName: 'cpu', title: 'Engineered for retrieval', text: 'Semantic HTML, structured data and machine-readable feeds are defaults here, not add-ons sold at a premium tier.', reveal: false })}
      ${card({ iconName: 'users', title: 'Editors with a byline', text: 'Every release is reviewed by a named human being who can explain their decision. No black-box rejections.', reveal: false })}
      ${card({ iconName: 'trend', title: 'Honest measurement', text: 'We report pickup, backlinks and AI citations. We do not invent "media impressions" to pad a report.', reveal: false })}
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Principles',
    title: 'What we will and will not do',
    body: `<div class="bento" data-stagger>
    ${[
      ['We will never guarantee coverage', 'No ethical distributor can promise that a journalist writes about you. We guarantee delivery to contracted lanes and publish a live pickup log.'],
      ['We will reject spam', 'Crypto pump announcements, undisclosed paid content, adult and gambling releases without compliance paperwork, and anything with an unverifiable claim.'],
      ['We will label sponsored content', 'If a placement is paid, it says so. Disguising advertising as earned media is how this industry lost the public\'s trust.'],
      ['We will publish corrections', 'Corrections are visible, timestamped and permanent — including when the mistake was ours.'],
      ['We will not sell your outreach data', 'Your media list is yours. We do not resell contact databases or use your campaign performance to pitch your competitors.'],
      ['We will keep pricing public', 'List pricing on the pricing page, always. Quote-only pricing wastes everyone\'s afternoon.'],
    ].map(([t, c], i) => `<article class="card ${i === 0 ? 'b-2 b-tall' : 'b-2'} spotlight"><h3>${t}</h3><p>${c}</p></article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Leadership',
    title: 'The people accountable for your release',
    lede: 'A deliberately small editorial and engineering team. You will recognise the same names across releases, reviews and reports.',
    body: `<div class="card-grid">
    ${[
      ['Amara Osei', 'Chief Executive', 'Former head of newsroom operations at a global wire; spent eleven years on the receiving end of press releases before deciding to fix the sending side.', 'AO'],
      ['Stefan Ferreira', 'Head of Editorial', 'Twenty years editing business and technology desks. Owns the editorial guidelines and the approval rate you will see quoted on this site.', 'SF'],
      ['Dr. Lian Chen', 'VP, Search &amp; AI Products', 'Applied NLP researcher. Builds the entity graph, structured-data layer and share-of-answer measurement that power the AI Visibility Suite.', 'LC'],
      ['Rohit Menon', 'Head of Distribution', 'Maintains the partner network and the regional routing logic. If your release landed in the right metro, that was his team.', 'RM'],
    ].map(([n, r, b, i]) => `<article class="card spotlight" data-reveal>
      <div style="display:flex;gap:.85rem;align-items:center">
        <span class="avatar" style="width:52px;height:52px">${i}</span>
        <span><strong style="display:block">${n}</strong><span class="muted" style="font-size:var(--step--1)">${r}</span></span>
      </div>
      <p class="mt-3" style="font-size:var(--step--1)">${b}</p>
    </article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Accountability',
    title: 'How we are measured',
    body: `<div class="grid g-3">
    ${card({ iconName: 'clock', title: 'Publishing latency', text: 'Median 42 minutes from approved submission to first syndicated pickup. Published monthly on the analytics page.' })}
    ${card({ iconName: 'check', title: 'Approval turnaround', text: 'Editorial decisions within 60 minutes on priority plans, four business hours standard.' })}
    ${card({ iconName: 'shield', title: 'Correction response', text: 'Corrections published within two hours of verification, with the original text retained and labelled.' })}
  </div>
  <p class="mt-3"><a class="link-arrow" href="editorial-guidelines.html">Read our editorial guidelines ${icon('arrow')}</a></p>`,
  })}

${ctaBand({ title: 'Work with a distributor that shows its working.', text: 'Start with one release. Keep the reporting. Decide after you have seen the pickup map.' })}`,
};

/* ----------------------------- HOW IT WORKS ------------------------------ */
const howItWorks = {
  slug: 'how-it-works',
  title: `How Press Release Distribution Works | ${site.name}`,
  description:
    'A step-by-step walkthrough of PressCosmos distribution: drafting, editorial review, tiered syndication, translations, multimedia and the pickup report you receive.',
  keywords: ['how press release distribution works', 'newswire process', 'press release submission process'],
  breadcrumbs: [{ label: 'How it works' }],
  priority: 0.8,
  faqs: faqs.distribution,
  schema: [{
    '@type': 'HowTo',
    name: 'How to distribute a press release with PressCosmos',
    description: 'The four-stage process from drafting an announcement to reading the distribution report.',
    totalTime: 'PT1H',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Draft or upload your release', text: 'Write in the PressCosmos editor or paste an existing release. Add headline, dateline, body, boilerplate and contact details.' },
      { '@type': 'HowToStep', position: 2, name: 'Choose targeting and plan', text: 'Select plan tier, industry vertical, countries, states or metros, and any translation variants.' },
      { '@type': 'HowToStep', position: 3, name: 'Editorial review', text: 'A human editor verifies disclosure, claims and formatting, then approves the release — usually within 60 minutes on priority plans.' },
      { '@type': 'HowToStep', position: 4, name: 'Distribution and reporting', text: 'The release syndicates to the selected network lanes. You receive a pickup map, backlink inventory and AI citation report.' },
    ],
  }],
  body: `
${pageHero({
    eyebrow: 'Process',
    h1: 'How a PressCosmos release actually gets out the door',
    lede: 'Nothing here is magic. It is a short pipeline with a human in the middle and a report at the end.',
    crumbItems: [{ label: 'How it works' }],
    actions: '<a class="btn" href="submit.html">Start a submission</a><a class="btn btn-ghost" href="pricing.html">See pricing</a>',
  })}

${section({
    body: answer('A PressCosmos release goes through four stages: you draft or upload it, you choose targeting, a human editor reviews and approves it, and then it syndicates to your selected network lanes with a pickup report following automatically. Median time from approved submission to first pickup is 42 minutes on priority plans.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'Stage 01',
    title: 'Draft or upload',
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem" data-reveal>
      <p>Write directly in the editor or paste a release you already have. The editor checks the things that cause most rejections before you submit: is there a dateline, is the headline under 100 characters, is there a boilerplate, is every claim attributable.</p>
      <p>Optional AI drafting and tightening is available and clearly labelled. It is never required, and it never bypasses human review.</p>
      <h3>What you need before you start</h3>
    </div>
    <div class="panel panel-glass" style="padding:1.6rem" data-reveal="right">
      ${listCheck([
      'A headline that states the news, not the slogan',
      'A dateline: city, state or country, and date',
      'The first paragraph answering who, what, when, where, why',
      'At least one quotable sentence from a named person',
      'An "About" boilerplate for the issuing organisation',
      'Media contact details that a journalist can actually use',
    ])}
      <p class="mono faint mt-3">Missing something? Our editors will help you fix it rather than reject you.</p>
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Stage 02',
    title: 'Choose targeting',
    body: `<div class="split">
    <div class="panel panel-glass" style="padding:1.6rem" data-reveal>
      <p class="eyebrow" style="margin-bottom:1rem">Routing options</p>
      <div class="grid" style="gap:.9rem">
        ${[
      ['Tier', 'National, regional, trade-only or international ladders.'],
      ['Vertical', 'One primary industry plus up to three secondary routes.'],
      ['Geography', 'Country, region, state or metro-level delivery.'],
      ['Language', 'Up to 24 languages with independent indexable pages.'],
      ['Format', 'Images, video embeds, audio, PDFs and data tables.'],
    ].map(([k, v]) => `<div class="between" style="border-bottom:1px solid var(--border);padding-bottom:.7rem">
        <strong style="font-size:var(--step--1)">${k}</strong><span class="muted" style="font-size:var(--step--1);text-align:right;max-width:62%">${v}</span>
      </div>`).join('')}
      </div>
    </div>
    <div class="stack prose" style="--flow:1rem" data-reveal="right">
      <p>Targeting is where most campaigns win or lose. Sending a regional retail story to national financial desks produces noise. Sending it to the fifteen metros where you actually operate produces pickups.</p>
      <p>You can save routing presets per brand or per client, which makes agency workflows and recurring campaigns far less tedious.</p>
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Stage 03',
    title: 'Editorial review',
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem" data-reveal>
      <p>A human editor reads your release. They are checking four things: is the news verifiable, is anything material undisclosed, is the formatting technically correct, and will a journalist consider this newsworthy.</p>
      <p>Reviews come back as approved, approved with suggested changes, or returned with a written reason. Returned releases are credited in full.</p>
    </div>
    <div class="grid" style="gap:1rem" data-reveal="right">
      ${card({ iconName: 'clock', title: '60 minutes', text: 'Priority review turnaround on Amplify, Newsmaker and Studio plans during business hours.', reveal: false })}
      ${card({ iconName: 'file', title: 'Written reasons', text: 'Every decision comes with an explanation — including the ones that say yes.', reveal: false })}
      ${card({ iconName: 'lock', title: 'Embargo respected', text: 'Set an embargo and the release holds until the minute you specify, in the timezone you specify.', reveal: false })}
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Stage 04',
    title: 'Distribution and reporting',
    body: `<div class="panel panel-glass" style="padding:clamp(1.25rem,3vw,2rem);border-radius:var(--r-xl)" data-reveal>
    <p class="eyebrow" style="margin-bottom:1.25rem">What lands in your dashboard</p>
    <div class="grid g-4">
      ${[
      ['Pickup map', 'Every outlet that carried the release, plotted by geography and filterable by vertical.'],
      ['Backlink inventory', 'Live URLs with domain authority, anchor text and follow status.'],
      ['AI citation report', 'Which answer engines quoted you, for which questions, with what accuracy.'],
      ['Referral analytics', 'Traffic your release drove, segmented by channel and session quality.'],
    ].map(([t, c]) => `<div><strong style="display:block;font-size:var(--step-0)">${t}</strong><p class="muted" style="font-size:var(--step--1);margin-top:.3rem">${c}</p></div>`).join('')}
    </div>
    <p class="mt-3"><a class="link-arrow" href="analytics.html">See the analytics layer in detail ${icon('arrow')}</a></p>
  </div>`,
  })}

${faqSection({ items: faqs.distribution, title: 'Distribution questions', eyebrow: 'Details' })}
${ctaBand({ title: 'Ready to send one?', text: 'Submitting takes about ten minutes if you already have the copy written.' })}`,
};

/* ------------------------------- SERVICES -------------------------------- */
const servicesPage = {
  slug: 'services',
  title: `Press Release Services | Distribution, AI Visibility & Monitoring | ${site.name}`,
  description:
    'Eight services that cover the full announcement lifecycle: newswire distribution, AI visibility (AEO/GEO/LLMO), media monitoring, analytics, branded newsrooms, SEO PR, crisis comms and investor relations.',
  keywords: ['press release services', 'PR distribution services', 'media monitoring', 'newsroom hosting'],
  breadcrumbs: [{ label: 'Services' }],
  priority: 0.9,
  body: `
${pageHero({
    eyebrow: 'Services',
    h1: 'Everything between writing the announcement and proving it worked.',
    lede: 'You can buy any of these on its own. Most teams run distribution plus monitoring first, then add AI visibility once they see how often an assistant answers a question about their category.',
    crumbItems: [{ label: 'Services' }],
    actions: '<a class="btn" href="pricing.html">Compare plans</a><a class="btn btn-ghost" href="contact.html">Book a walkthrough</a>',
  })}

${section({
    body: answer('PressCosmos provides eight services: newswire distribution, an AI Visibility Suite covering AEO/GEO/LLMO, media monitoring, analytics and attribution, branded newsroom hosting, SEO PR, crisis communications and investor relations distribution. They can be bought individually or combined in one campaign.'),
    className: 'section-tight pt-0',
  })}

${section({ body: `<div class="card-grid">${services.map((s) => card({ iconName: s.icon, title: s.name, text: s.summary, bullets: s.bullets, href: s.href, cta: 'See details' })).join('')}</div>` })}

${section({
    eyebrow: 'Choose your path',
    title: 'Most teams fit one of these three shapes',
    body: `<div class="grid g-3">
    ${[
      ['One big announcement', 'Launch, funding, acquisition or a product moment you need to land properly.', ['Distribution (Amplify or Newsmaker)', 'AI visibility formatting', 'Pickup and citation report'], 'pricing.html', 'See per-release plans'],
      ['A steady news rhythm', 'Weekly or monthly releases that should compound into authority instead of scattering.', ['Studio plan with 12 releases a month', 'Branded newsroom on your domain', 'Quarterly AI citation audit'], 'newsroom-hosting.html', 'Explore the newsroom'],
      ['Agency or enterprise', 'Multi-client workspaces, approval chains and white-label reporting.', ['Volume pricing and workspaces', 'White-label dashboards', 'API and automation'], 'agencies.html', 'For agencies'],
    ].map(([t, c, items, href, cta]) => `<article class="card spotlight" data-reveal>
      <h3>${t}</h3><p>${c}</p>
      ${listCheck(items)}
      <p class="mt-3"><a class="link-arrow" href="${href}">${cta} ${icon('arrow')}</a></p>
    </article>`).join('')}
  </div>`,
  })}

${ctaBand({})}`,
};

/* ------------------------------ DISTRIBUTION ------------------------------ */
const distribution = {
  slug: 'distribution',
  title: `Press Release Distribution Network | ${site.name}`,
  description:
    'How PressCosmos routes releases: tiered newswire ladders, vertical and geographic targeting, 24-language syndication, multimedia handling and guaranteed delivery lanes.',
  keywords: ['press release distribution network', 'newswire tiers', 'syndication', 'submit to news outlets'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'Distribution' }],
  priority: 0.9,
  faqs: faqs.distribution,
  body: `
${pageHero({
    eyebrow: 'Service',
    h1: 'Distribution built on routing, not spray-and-pray.',
    lede: 'Two releases with identical copy can have wildly different outcomes because of where they were sent. Tiering, vertical matching and geography decide whether a journalist sees your story or scrolls past it.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'Distribution' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="pricing.html">Compare tiers</a>',
  })}

${section({
    body: answer('PressCosmos distribution reaches 2,400+ media destinations across 68 countries through tiered lanes: Tier 1 national and international newswires, Tier 2 regional and trade media, Tier 3 aggregators and niche desks, and Tier 4 AI answer engines and data feeds. Targeting can be set by industry, country, state, metro and language.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'Tiers',
    title: 'The distribution ladder',
    body: `<div class="table-scroll" data-reveal>
    <table class="compare">
      <caption class="visually-hidden">PressCosmos distribution tiers compared</caption>
      <thead><tr><th scope="col">Tier</th><th scope="col">Destinations</th><th scope="col">Typical use</th><th scope="col">Available on</th></tr></thead>
      <tbody>
        <tr><td><strong>Tier 1 — National &amp; international</strong></td><td>Major newswires, national business desks, financial data feeds</td><td>Earnings, funding rounds, material corporate news</td><td>Amplify and above</td></tr>
        <tr><td><strong>Tier 2 — Regional &amp; trade</strong></td><td>Metro dailies, regional business journals, industry trade press</td><td>Store openings, hires, local milestones</td><td>All plans</td></tr>
        <tr><td><strong>Tier 3 — Niche &amp; aggregators</strong></td><td>Vertical blogs, aggregators, newsletter networks</td><td>Product updates, thought leadership, events</td><td>All plans</td></tr>
        <tr><td><strong>Tier 4 — AI &amp; data feeds</strong></td><td>Answer engines, knowledge graphs, machine-readable feeds</td><td>Every release — this is where citations come from</td><td>All plans</td></tr>
      </tbody>
    </table>
  </div>`,
  })}

${section({
    eyebrow: 'Targeting',
    title: 'Filters that change the outcome',
    body: `<div class="bento" data-stagger>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('tag')}</div><h3>Industry vertical</h3><p>One primary vertical and up to three secondary routes. A fintech release can ride financial desks and technology desks without being dumped into a general news bucket.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('pin')}</div><h3>Geography</h3><p>Country, region, state or metro. Regional targeting typically lifts local pickup rates by 30–60% compared with untargeted distribution.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('globe')}</div><h3>Language</h3><p>24 languages including Arabic, Hebrew and Hindi, each with an independent indexable page and native-speaker review.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('camera')}</div><h3>Multimedia</h3><p>Images, video embeds, audio and PDF media kits. Rich media increases time-on-page and the odds of a desk picking the story up.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('clock')}</div><h3>Embargo and scheduling</h3><p>Hold until a precise minute and timezone, or schedule a coordinated multi-release rollout across regions.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('layers')}</div><h3>Presets and repeat routing</h3><p>Save a routing recipe per brand or client and reuse it. Agency teams cut submission time roughly in half.</p></article>
  </div>`,
  })}

${section({
    eyebrow: 'Delivery guarantees',
    title: 'What we commit to in writing',
    body: `<div class="grid g-3">
    ${card({ iconName: 'check', title: 'Contracted lane delivery', text: 'If your release is approved and paid, it is delivered to every lane in your selected tier. No "up to" language.' })}
    ${card({ iconName: 'file', title: 'A published pickup log', text: 'Every destination that received the release is listed in your dashboard, with a timestamp.' })}
    ${card({ iconName: 'shield', title: 'No fake outlets', text: 'We do not pad a network with auto-generated domains that exist only to host syndicated copy.' })}
    ${card({ iconName: 'radar', title: 'Monitoring from minute one', text: 'Pickup detection starts at publication, not the next morning, and updates live.' })}
    ${card({ iconName: 'trend', title: 'Backlink transparency', text: 'Every earned link is reported with follow status. We do not count nofollow syndication as link equity.' })}
    ${card({ iconName: 'users', title: 'A human to call', text: 'Named account contact on Amplify and above, during and after the campaign.' })}
  </div>`,
  })}

${faqSection({ items: faqs.distribution, title: 'Distribution FAQ', eyebrow: 'Details' })}
${ctaBand({ title: 'Route your next release properly.', text: 'Tell us the story and the audience. We will tell you which lanes make sense — including when the answer is fewer lanes than you expected.' })}`,
};

/* ------------------------------ AI VISIBILITY ---------------------------- */
const aiVisibility = {
  slug: 'ai-visibility',
  title: `AI Visibility Suite — AEO, GEO & LLMO for PR | ${site.name}`,
  description:
    'Get cited by ChatGPT, Claude, Gemini, Perplexity and AI Overviews. PressCosmos applies answer engine optimisation, generative engine optimisation and LLM optimisation to every release.',
  keywords: ['AEO', 'GEO', 'LLMO', 'answer engine optimisation', 'generative engine optimisation', 'get cited by ChatGPT', 'AI search PR'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'AI Visibility Suite' }],
  priority: 0.95,
  faqs: faqs.ai,
  body: `
${pageHero({
    eyebrow: 'Service',
    badge: { text: 'The category we are building', class: 'pill-live' },
    h1: 'Be the source an AI assistant quotes, not the one it skips.',
    lede: 'When someone asks an assistant "who does press release distribution with AI citation tracking", the model answers from whatever it can retrieve and corroborate. AEO, GEO and LLMO decide whether that answer includes you.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'AI Visibility Suite' }],
    actions: '<a class="btn" href="submit.html">Test it on one release</a><a class="btn btn-ghost" href="contact.html">Request an AI audit</a>',
    aside: `<div class="panel panel-glass" style="padding:1.5rem" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">Tracked answer engines</p>
      <div class="chip-row">${['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Copilot', 'Google AI Overviews', 'Meta AI', 'Grok', 'You.com'].map((e) => `<span class="tag">${e}</span>`).join('')}</div>
      <p class="mono faint mt-3">Share-of-answer reported monthly with accuracy scoring and source attribution.</p>
    </div>`,
  })}

${section({
    body: answer('AEO (Answer Engine Optimisation) structures content so it can be lifted as a direct answer. GEO (Generative Engine Optimisation) makes your brand likely to be cited inside AI-generated responses. LLMO (Large Language Model Optimisation) makes your organisation factually retrievable and correctly described by models. PressCosmos applies all three to every press release it distributes.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'The three disciplines',
    title: 'AEO, GEO and LLMO — what each one actually means',
    body: `<div class="grid g-3" data-stagger>
    ${[
      ['AEO', 'Answer Engine Optimisation', 'Optimising for the machine that answers a question directly.', ['A 40–60 word answer block near the top of the release', 'Question-shaped subheadings and FAQ pairs', 'FAQPage structured data on every FAQ section', 'Tables and lists that survive being extracted']],
      ['GEO', 'Generative Engine Optimisation', 'Optimising to be cited inside a generated response, with attribution.', ['Independent corroboration across syndicated outlets', 'Entity-consistent naming of your organisation', 'Original data points that are worth quoting', 'Stable canonical URLs so citations do not rot']],
      ['LLMO', 'Large Language Model Optimisation', 'Optimising what a model knows and says about your brand.', ['Organization schema with identity, location and contacts', 'llms.txt guidance plus an open crawler policy', 'Machine-readable feeds and a clean sitemap', 'Clear, factual, unembellished claims']],
    ].map(([acro, full, text, items]) => `<article class="card spotlight" data-reveal>
      <p class="eyebrow" style="margin-bottom:.6rem">${acro}</p>
      <h3>${full}</h3>
      <p>${text}</p>
      ${listCheck(items)}
    </article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Mechanics',
    title: 'What we change in the release itself',
    body: `<div class="split">
    <div class="panel panel-glass" style="padding:clamp(1.25rem,3vw,2rem)" data-reveal>
      <p class="eyebrow" style="margin-bottom:1rem">Before</p>
      <p style="font-family:var(--font-mono);font-size:var(--step--1);color:var(--muted);line-height:1.75">
        FOR IMMEDIATE RELEASE<br><br>
        <strong style="color:var(--ink)">Acme Corp Announces Exciting New Synergy Initiative!</strong><br><br>
        Acme, a leading provider of innovative solutions, today announced a groundbreaking initiative that will transform the industry landscape and deliver unprecedented value to stakeholders across the ecosystem...
      </p>
    </div>
    <div class="panel panel-glass" style="padding:clamp(1.25rem,3vw,2rem);border-color:rgba(34,211,238,.35)" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">After</p>
      <p style="font-size:var(--step--1);line-height:1.75">
        <strong style="color:var(--ink)">Acme Corp launches supplier emissions reporting for 1,200 manufacturers</strong><br><br>
        <span class="muted">SAN FRANCISCO, October 22, 2026 — </span>Acme Corp today launched Supplier Carbon Ledger, a reporting tool that lets 1,200 manufacturers calculate Scope 3 emissions from their supply chains. The company says the tool reduces reporting time from six weeks to four days. Pricing starts at $900 per month.
      </p>
      <p class="mono faint mt-3">Named entity · specific numbers · direct answer · attribution-ready</p>
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Measurement',
    title: 'Share of answer, not share of voice',
    body: `<div class="grid g-4">
    ${[
      ['Citation rate', 'How often you appear in responses to your tracked question set, per engine.'],
      ['Accuracy score', 'Whether the facts the model states about you are correct and current.'],
      ['Source mix', 'Which of your pages and which third-party outlets the model cited.'],
      ['Category ownership', 'Your share of citations against named competitors for the same questions.'],
    ].map(([t, c]) => card({ iconName: 'chart', title: t, text: c })).join('')}
  </div>
  <p class="mt-3"><a class="link-arrow" href="analytics.html">See how this reports alongside traffic and revenue ${icon('arrow')}</a></p>`,
  })}

${section({
    eyebrow: 'Caveats',
    title: 'What we cannot do',
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem">
      <p>We can make your announcement retrievable, answerable, attributable and corroborated. We cannot force a language model to prefer you over a competitor, and neither can anyone else who is being straight with you.</p>
      <p>What we will do is measure honestly: if your citation rate does not move, the report will say so, and we will tell you what we would change next time.</p>
    </div>
    <div class="grid" style="gap:1rem">
      ${callout({ title: 'No prompt injection, no manipulation', text: 'We do not bury instructions in copy, stuff hidden text, or attempt to game retrieval. It breaks eventually, and it is a reputational risk we will not take on your behalf.' })}
      ${callout({ title: 'Results are lagged', text: 'Model freshness varies. Expect 2–8 weeks before a change in retrievability reliably shows up in citation share.' })}
    </div>
  </div>`,
  })}

${faqSection({ items: faqs.ai, title: 'AI visibility questions', eyebrow: 'Answers' })}
${ctaBand({ title: 'Find out what assistants currently say about you.', text: 'We will run a baseline audit across nine engines and show you the raw answers — before you buy anything.' , primary: 'Request an AI visibility audit', primaryHref: 'contact.html', secondary: 'See pricing', secondaryHref: 'pricing.html' })}`,
};

/* --------------------------------- SEO PR -------------------------------- */
const seoPr = {
  slug: 'seo-pr',
  title: `SEO PR Services | Press Releases That Rank and Earn Links | ${site.name}`,
  description:
    'Keyword-mapped headlines, entity-rich body copy and contextual backlinks that improve rankings without reading like advertising. Editorial review keeps every release compliant.',
  keywords: ['SEO PR', 'press release SEO', 'backlinks from press releases', 'keyword optimization press release'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'SEO PR' }],
  priority: 0.85,
  faqs: faqs.ai,
  body: `
${pageHero({
    eyebrow: 'Service',
    h1: 'PR that earns rankings, written so a journalist will still run it.',
    lede: 'Search optimisation and newsworthiness are not opposites. They only look like opposites when someone stuffs a keyword into a headline that nobody would ever write.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'SEO PR' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="press-release-seo-guide.html">Read the SEO PR guide</a>',
  })}

${section({
    body: answer('SEO PR is the practice of writing and distributing press releases so they rank in search results and earn editorial backlinks, without compromising newsworthiness. PressCosmos maps each release to search intent, uses the target phrase naturally in the headline and first paragraph, and reports the backlinks and rankings it produced.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'Method',
    title: 'Five things we optimise, in order',
    body: `<ol class="grid g-2" data-stagger>
    ${[
      ['Intent, not volume', 'We start from the question a person types when they are ready to act, not the phrase with the biggest monthly volume.'],
      ['Headline phrasing', 'The target phrase goes in the headline only when a human editor would have written it that way anyway.'],
      ['First 60 words', 'Where search snippets and AI answers come from. Specific, factual, no preamble.'],
      ['Entity clarity', 'Your organisation, the product, the location and the category named precisely and consistently.'],
      ['Link context', 'Anchor text variance comes from how syndicating outlets naturally describe you, not from a spreadsheet.'],
    ].map(([t, c], i) => `<li class="card spotlight">
      <p class="mono gradient-text" style="font-size:var(--step-2);font-weight:700">0${i + 1}</p>
      <h3 style="margin-top:.5rem">${t}</h3><p>${c}</p>
    </li>`).join('')}
  </ol>`,
  })}

${section({
    eyebrow: 'Compliance',
    title: 'Why we say no to link schemes',
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem">
      <p>Selling guaranteed keyword-rich dofollow links from a newswire is a paid link scheme. Search engines treat it as such, and the penalties land on your domain, not ours.</p>
      <p>What actually works is slower and more durable: earn editorial links because the story is genuinely useful, and structure the page so search engines can understand it.</p>
    </div>
    <div class="panel panel-glass" style="padding:1.6rem">
      ${listCheck([
      'No hidden or client-side cloaked text',
      'No keyword-stuffed anchor blocks',
      'No guaranteed dofollow links sold as a product',
      'Paid placements labelled as sponsored',
      'Disclosed relationships on every release',
      'Corrections rather than quiet edits',
    ])}
    </div>
  </div>`,
  })}

${ctaBand({ title: 'Write it once. Rank and get cited with the same release.', primary: 'Start a submission', primaryHref: 'submit.html' })}`,
};

/* ---------------------------- MEDIA MONITORING --------------------------- */
const mediaMonitoring = {
  slug: 'media-monitoring',
  title: `Media Monitoring & Press Release Pickup Tracking | ${site.name}`,
  description:
    'Track press release pickup across 180,000+ sources in real time with sentiment scoring, journalist alerts, competitive share of voice and a live pickup map.',
  keywords: ['media monitoring', 'press release pickup tracking', 'sentiment analysis PR', 'share of voice'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'Media Monitoring' }],
  priority: 0.85,
  body: `
${pageHero({
    eyebrow: 'Service',
    h1: 'Watch where your story actually landed — as it happens.',
    lede: 'You sent it to 300 desks. Twelve of them carried it in the first hour. Which twelve, in which metros, with what tone, and who else reported the same story that morning?',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'Media Monitoring' }],
    actions: '<a class="btn" href="submit.html">Add monitoring to a release</a><a class="btn btn-ghost" href="analytics.html">See reporting</a>',
  })}

${section({
    body: answer('PressCosmos media monitoring tracks press release pickup across 180,000+ sources in near real time. It reports which outlets carried the release, the sentiment and tone of coverage, referral traffic, journalist and outlet alerts, and competitive share of voice against named rivals.'),
    className: 'section-tight pt-0',
  })}

${section({
    body: `<div class="bento" data-stagger>
    <article class="card b-3 spotlight">
      <div class="card-icon">${icon('radar')}</div>
      <h3>Live pickup map</h3>
      <p>Every outlet plotted geographically, filterable by vertical and tier, updating as pickups are detected. Useful for planning the next metro you target and for showing a regional sales team exactly where their market responded.</p>
      <p class="mono faint mt-2">Detection begins at publication, not the next business morning.</p>
    </article>
    <article class="card b-3 spotlight">
      <div class="card-icon">${icon('chart')}</div>
      <h3>Sentiment and tone</h3>
      <p>Coverage scored for sentiment, with the specific sentence that drove the score highlighted so you can quote it in your report.</p>
    </article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('mail')}</div><h3>Journalist alerts</h3><p>Get notified when a specific writer, desk or beat picks up your story — or covers a competitor in your category.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('users')}</div><h3>Share of voice</h3><p>Compare your coverage volume and sentiment against up to five named competitors over any date range.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('bolt')}</div><h3>Crisis triggers</h3><p>Alert thresholds on negative sentiment spikes, with a one-click path into the crisis publishing lane.</p></article>
    <article class="card b-4 spotlight">
      <div class="card-icon">${icon('filter')}</div>
      <h3>Coverage beyond your own releases</h3>
      <p>Monitoring is not limited to PressCosmos distribution. Track competitor announcements, category keywords, executive names and regulatory terms across the open web so you know what your market is reading on the day you plan to announce.</p>
    </article>
  </div>`,
  })}

${section({
    eyebrow: 'In practice',
    title: 'How comms teams use the feed',
    body: `<div class="grid g-3">
    ${[
      ['During a launch', 'Confirm which tier really drove coverage, then shift paid amplification toward the metros that responded.'],
      ['In a weekly report', 'Export coverage volume, sentiment trend and top outlets as a one-page summary for leadership.'],
      ['In a crisis', 'Detect the first negative pickup within minutes and trigger the standby editor before it spreads.'],
    ].map(([t, c]) => card({ iconName: 'clock', title: t, text: c })).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Stop guessing which outlets ran it.', text: 'Monitoring is included on every plan, with deeper historical and competitor tracking on Amplify and above.' })}`,
};

/* -------------------------------- ANALYTICS ------------------------------ */
const analytics = {
  slug: 'analytics',
  title: `PR Analytics & Attribution | Prove Press Release ROI | ${site.name}`,
  description:
    'Measure referral traffic, backlink equity, AI citation share and revenue attribution from every press release in one dashboard with board-ready exports.',
  keywords: ['PR analytics', 'press release ROI', 'PR attribution', 'backlink reporting'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'Analytics' }],
  priority: 0.85,
  body: `
${pageHero({
    eyebrow: 'Service',
    h1: 'A press release report your CFO will not roll their eyes at.',
    lede: 'Impressions are a currency invented by people who did not want to be measured. Here is what we count instead.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'Analytics' }],
    actions: '<a class="btn" href="submit.html">Start a campaign</a><a class="btn btn-ghost" href="contact.html">Request a sample report</a>',
  })}

${section({
    body: answer('PressCosmos analytics measures press release performance through referral sessions, backlink inventory with authority and follow status, AI citation share across nine answer engines, brand search lift, and where possible pipeline and revenue attribution via UTM and CRM integration.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'Metrics',
    title: 'The four numbers that matter',
    body: `<div class="grid g-4">
    ${[
      ['Referral sessions', 'Real people arriving from a real outlet, segmented by source and session quality.'],
      ['Link equity earned', 'Domains linking to you, with authority and follow status — nofollow syndication counted separately.'],
      ['AI citation share', 'How often and how accurately answer engines name you for your tracked questions.'],
      ['Brand demand lift', 'Change in branded search volume in the four weeks after distribution.'],
    ].map(([t, c]) => card({ iconName: 'trend', title: t, text: c })).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Reporting',
    title: 'Built for three different audiences',
    body: `<div class="grid g-3">
    ${[
      ['For the comms lead', 'Campaign-level view: what went out, where it landed, what the tone was, what to do differently next time.'],
      ['For the executive', 'One page: reach, quality of coverage, citations, and the trend against the previous two campaigns.'],
      ['For finance', 'Attribution view: assisted conversions, pipeline influenced, cost per qualified session, with methodology documented.'],
    ].map(([t, c]) => card({ iconName: 'file', title: t, text: c })).join('')}
  </div>
  <div class="callout mt-4" data-reveal>
    <strong>A note on attribution honesty</strong>
    Most PR-attributed revenue is assisted, not last-click. We show you assisted models with the assumptions written down, and we never claim a direct causal link that the data cannot support.
  </div>`,
  })}

${ctaBand({ title: 'Get a sample report before you buy.', text: 'Send us one past release and we will show you the shape of the reporting you would receive.' })}`,
};

/* ----------------------------- NEWSROOM HOSTING --------------------------- */
const newsroomHosting = {
  slug: 'newsroom-hosting',
  title: `Branded Newsroom Hosting | Own Your Announcements | ${site.name}`,
  description:
    'A hosted, indexable newsroom on your own domain — NewsArticle schema, journalist resources, media assets, RSS and JSON feeds, and full brand control.',
  keywords: ['branded newsroom', 'online newsroom', 'hosted press room', 'newsroom SEO'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'Branded Newsroom' }],
  priority: 0.85,
  body: `
${pageHero({
    eyebrow: 'Service',
    h1: 'Stop renting your own news.',
    lede: 'Every release you publish on someone else\'s domain compounds someone else\'s authority. A branded newsroom puts the archive, the links and the rankings on your domain — where they keep working after the campaign ends.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'Branded Newsroom' }],
    actions: '<a class="btn" href="contact.html">Book a newsroom demo</a><a class="btn btn-ghost" href="pricing.html">See Studio plan</a>',
  })}

${section({
    body: answer('A PressCosmos branded newsroom is a hosted, fully indexable press centre on your own domain. It publishes releases as NewsArticle-structured pages, hosts media assets and journalist resources, generates RSS and JSON feeds automatically, and keeps a permanent, searchable archive you control.'),
    className: 'section-tight pt-0',
  })}

${section({
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem" data-reveal>
      <h3 class="mt-0">What is included</h3>
      ${listCheck([
      'Custom domain with SSL and full visual branding',
      'NewsArticle, Organization and BreadcrumbList structured data',
      'Journalist resources: press contact, fact sheet, logo pack, executive bios',
      'Multimedia galleries with automatic alt text and captions',
      'Auto-generated RSS and JSON feeds for aggregators and partners',
      'Category and tag archives that build topical authority',
      'Search, date and category filtering for visitors',
      'Revision history with visible correction notices',
      'Localisation workflow for multi-language newsrooms',
      'Analytics on the newsroom itself, not just the release',
    ])}
    </div>
    <div class="panel panel-glass" style="padding:1.6rem" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">Why it compounds</p>
      <p class="muted" style="font-size:var(--step--1)">A release published on a third-party wire earns a link once. The same release on your own newsroom, internally linked to the previous eighteen releases, becomes a topical cluster that search engines and retrieval systems read as evidence you are a consistent source on the subject.</p>
      <p class="mono faint mt-3">Newsroom + distribution is the combination most comms teams should be running.</p>
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Setup',
    title: 'Live in a week',
    body: `<ol class="grid g-4" data-stagger>
    ${[
      ['Brand import', 'We take your colours, type and logo and build the shell against your brand guide.'],
      ['Content migration', 'Existing releases imported with original dates preserved for accurate archives.'],
      ['Domain and DNS', 'Subdomain or root domain, SSL issued, redirects mapped from your old press page.'],
      ['Review and launch', 'You approve on staging, we flip DNS and submit the sitemap.'],
    ].map(([t, c], i) => `<li class="card spotlight"><p class="mono gradient-text" style="font-size:var(--step-2);font-weight:700">0${i + 1}</p><h3 style="margin-top:.5rem">${t}</h3><p>${c}</p></li>`).join('')}
  </ol>`,
  })}

${ctaBand({ title: 'Turn press releases into an asset you own.', text: 'Included with Studio plans or available as a standalone hosting engagement.', primary: 'Talk to us', primaryHref: 'contact.html', secondary: 'See the Studio plan', secondaryHref: 'pricing.html' })}`,
};

/* --------------------------- CRISIS COMMUNICATIONS ------------------------ */
const crisis = {
  slug: 'crisis-communications',
  title: `Crisis Communications Distribution | ${site.name}`,
  description:
    'A 60-minute emergency publishing lane with 24/7 standby editors, holding statements, coordinated regional rollout and verified correction distribution.',
  keywords: ['crisis communications', 'holding statement', 'emergency press release', 'reputation management PR'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'Crisis Communications' }],
  priority: 0.8,
  body: `
${pageHero({
    eyebrow: 'Service',
    badge: { text: '24/7 standby lane', class: 'pill-live' },
    h1: 'When the story is already moving, you have one hour.',
    lede: 'The first statement sets the frame for everything that follows. Our crisis lane exists so that a considered, verified holding statement is published before the second wave of coverage, not after it.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'Crisis Communications' }],
    actions: '<a class="btn" href="contact.html">Set up a crisis lane</a><a class="btn btn-ghost" href="editorial-guidelines.html">Editorial standards</a>',
  })}

${section({
    body: answer('The PressCosmos crisis lane publishes an approved statement in under 60 minutes, at any hour, through a 24/7 standby editor. It includes holding statement templates, coordinated multi-region rollout, monitoring with negative-sentiment triggers, and verified correction distribution when facts change.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'The lane',
    title: 'What happens when you trigger it',
    body: `<div class="grid g-4" data-stagger>
    ${[
      ['T-0 · Trigger', 'You call the crisis number, page the standby editor and confirm the facts you can stand behind.'],
      ['T+20 min · Draft', 'A holding statement is drafted from your pre-approved templates and legal guardrails.'],
      ['T+45 min · Approval', 'One named approver signs off. Compressed approval chain, not a committee.'],
      ['T+60 min · Publish', 'Statement goes live across your selected regions with monitoring alerts armed.'],
    ].map(([t, c]) => `<article class="card spotlight"><h3 style="font-size:var(--step-0)">${t}</h3><p>${c}</p></article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Preparation',
    title: 'The work that happens before you need it',
    body: `<div class="grid g-2">
    ${card({ iconName: 'file', title: 'Holding statement library', text: 'Six pre-drafted, pre-approved statement shapes covering the most common crisis categories, ready to adapt in minutes.' })}
    ${card({ iconName: 'users', title: 'Named approvers', text: 'A documented approval chain with after-hours contacts, so nobody spends twenty minutes working out who can authorise.' })}
    ${card({ iconName: 'radar', title: 'Trigger thresholds', text: 'Negative-sentiment and volume thresholds that page you automatically rather than waiting for someone to notice.' })}
    ${card({ iconName: 'shield', title: 'Legal guardrails', text: 'Pre-agreed language on litigation, disclosure and regulated industries so a statement never creates a second problem.' })}
  </div>
  <div class="callout mt-4" data-reveal>
    <strong>Corrections handled properly</strong>
    If facts change after publication, we distribute a labelled correction with the original text retained. Quiet edits are how organisations lose credibility twice for the same incident.
  </div>`,
  })}

${ctaBand({ title: 'Set the lane up before you need it.', text: 'Crisis lane access is included on Newsmaker and Studio plans, and available as a standalone retainer.', primary: 'Talk to a crisis lead', primaryHref: 'contact.html', secondary: 'See pricing', secondaryHref: 'pricing.html' })}`,
};

/* ---------------------------- INVESTOR RELATIONS ------------------------- */
const investorRelations = {
  slug: 'investor-relations',
  title: `Investor Relations Distribution | Earnings & Material News | ${site.name}`,
  description:
    'Regulation-aware distribution for earnings, funding and material news, with analyst-desk delivery, terminal feeds, quiet-period controls and full audit records.',
  keywords: ['investor relations distribution', 'earnings press release', 'material news disclosure', 'analyst desk delivery'],
  breadcrumbs: [{ label: 'Services', href: 'services.html' }, { label: 'Investor Relations' }],
  priority: 0.8,
  body: `
${pageHero({
    eyebrow: 'Service',
    h1: 'Material news needs a distribution record, not just a webpage.',
    lede: 'When a release moves a share price, someone will eventually ask who received it and exactly when. The answer should be a timestamped log, not a recollection.',
    crumbItems: [{ label: 'Services', href: 'services.html' }, { label: 'Investor Relations' }],
    actions: '<a class="btn" href="contact.html">Talk to the IR team</a><a class="btn btn-ghost" href="enterprise.html">Enterprise controls</a>',
  })}

${section({
    body: answer('PressCosmos investor relations distribution delivers earnings releases, funding announcements and material news to financial terminals, analyst desks and major financial media. It supports quiet-period controls, multi-region regulatory variants, approval chains and an immutable distribution log for audit purposes.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'Capabilities',
    title: 'Built for a disclosure regime',
    body: `<div class="grid g-3">
    ${card({ iconName: 'clock', title: 'Earnings calendar', text: 'Schedule releases against your reporting calendar months ahead, with versioned drafts and staged approvals.' })}
    ${card({ iconName: 'chart', title: 'Terminal and analyst delivery', text: 'Delivery to financial data terminals and analyst desks across 41 markets, alongside standard media lanes.' })}
    ${card({ iconName: 'lock', title: 'Quiet-period controls', text: 'Lock distribution during defined windows and require named approval before anything can move.' })}
    ${card({ iconName: 'globe', title: 'Regulatory variants', text: 'Region-specific language and disclosure formatting, translated and reviewed by financial translators.' })}
    ${card({ iconName: 'file', title: 'Immutable audit log', text: 'Every recipient, timestamp and revision recorded and exportable. Records are append-only.' })}
    ${card({ iconName: 'shield', title: 'Selective disclosure support', text: 'Simultaneous delivery across all lanes to avoid selective-disclosure problems.' })}
  </div>`,
  })}

${section({
    eyebrow: 'Integration',
    title: 'Fits the systems your IR team already uses',
    body: `<div class="grid g-2">
    ${callout({ title: 'Workflow', text: 'Approval routing that mirrors your internal chain, with read receipts so the compliance officer can see exactly who signed off and when.' })}
    ${callout({ title: 'Data', text: 'Structured financial data blocks in releases, plus API and webhook delivery into your IR site, CRM and reporting stack.' })}
  </div>`,
  })}

${ctaBand({ title: 'Give your next disclosure an audit trail.', text: 'IR engagements are scoped with your counsel and compliance team. Expect a short technical call before anything is signed.', primary: 'Request an IR consultation', primaryHref: 'contact.html', secondary: 'See enterprise controls', secondaryHref: 'enterprise.html' })}`,
};

/* --------------------------------- PRICING ------------------------------- */
const pricing = {
  slug: 'pricing',
  title: `Press Release Distribution Pricing | Pay Per Release from $149 | ${site.name}`,
  description:
    'Transparent press release pricing: Launch $149, Amplify $349, Newsmaker $899 per release, and Studio $1,990 per month for up to 12 releases. No seats, no annual lock-in.',
  keywords: ['press release pricing', 'newswire cost', 'press release distribution price', 'PR distribution pricing'],
  breadcrumbs: [{ label: 'Pricing' }],
  priority: 0.95,
  faqs: [...faqs.pricing, ...faqs.general.slice(0, 2)],
  schema: [{
    '@type': 'Product',
    name: 'PressCosmos press release distribution',
    description: 'Press release distribution, AI visibility formatting, monitoring and reporting on a pay-per-release basis.',
    brand: { '@type': 'Brand', name: 'PressCosmos' },
    offers: plans.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price,
      priceCurrency: 'USD',
      description: p.tagline,
      url: `${site.baseUrl}/pricing.html#${p.slug}`,
      availability: 'https://schema.org/InStock',
    })),
  }],
  body: `
${pageHero({
    eyebrow: 'Pricing',
    h1: 'Published prices. No quote wall.',
    lede: 'Every plan includes human editorial review, a permanent hosted release page and pickup reporting. Pay per release, or upgrade to Studio if you are publishing every week.',
    crumbItems: [{ label: 'Pricing' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="compare.html">Compare with other wires</a>',
  })}

${section({
    body: answer('PressCosmos costs $149 per release on the Launch plan, $349 on Amplify, $899 on Newsmaker, or $1,990 per month on Studio for up to twelve releases. There are no per-seat fees and no annual contract required for per-release plans. All plans include editorial review and permanent hosting.'),
    className: 'section-tight pt-0',
  })}

${section({ body: `<div class="plan-grid">${plans.map(planCard).join('')}</div>` })}

${section({
    eyebrow: 'Compare',
    title: 'What is actually different between the plans',
    body: `<div class="table-scroll" data-reveal>
    <table class="compare">
      <caption class="visually-hidden">Feature comparison across PressCosmos plans</caption>
      <thead><tr><th scope="col">Feature</th><th scope="col">Launch</th><th scope="col" class="col-highlight">Amplify</th><th scope="col">Newsmaker</th><th scope="col">Studio</th></tr></thead>
      <tbody>
        ${[
      ['Distribution tier', 'Tier 2–3', 'Tier 1–3', 'Tier 1–4 + terminals', 'Tier 1–4 + terminals'],
      ['Editorial review', '4 business hours', '60 minutes', '60 minutes', 'Priority queue'],
      ['AI answer-engine formatting', 'Included', 'Included', 'Included', 'Included'],
      ['Share-of-answer tracking', '—', '9 engines', '9 engines', '9 engines + quarterly audit'],
      ['Languages', '1', '3', '10', 'Unlimited'],
      ['Multimedia embeds', '1 asset', 'Unlimited', 'Unlimited', 'Unlimited'],
      ['Pickup map & sentiment', 'Basic', 'Full', 'Full + alerts', 'Full + alerts'],
      ['Backlink inventory', 'Summary', 'Full', 'Full', 'Full'],
      ['Branded newsroom', '—', '—', 'Add-on', 'Included'],
      ['Crisis lane', 'Add-on', 'Add-on', 'Included', 'Included'],
      ['Journalist outreach', '—', '—', 'Included', 'Included'],
      ['Account manager', '—', 'Dedicated', 'Dedicated', 'Strategic + editorial'],
      ['API & automation', '—', '—', '—', 'Included'],
    ].map((row) => `<tr><th scope="row" style="font-weight:600;font-size:var(--step--1)">${row[0]}</th>${row.slice(1).map((c, i) => `<td class="${i === 0 ? 'col-highlight' : ''} ${c === '—' ? 'no' : ''}">${c}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>`,
  })}

${section({
    eyebrow: 'Add-ons',
    title: 'Extras, priced individually',
    body: `<div class="grid g-4">
    ${[
      ['Translation', '$89', 'Per additional language, native-speaker reviewed.'],
      ['Branded newsroom', '$199/mo', 'Hosted newsroom on your domain, any plan.'],
      ['Crisis lane', '$249/mo', '24/7 standby editor and 60-minute publishing.'],
      ['Journalist outreach', '$199', 'Manual pitching to a targeted list of 25 writers.'],
      ['Extra multimedia', '$29', 'Per asset beyond your plan allowance.'],
      ['Correction distribution', 'Free', 'When the correction is for our error. $49 otherwise.'],
      ['AI visibility audit', '$399', 'Baseline across nine engines plus 90-day tracking.'],
      ['API access', '$99/mo', 'Programmatic submission and reporting endpoints.'],
    ].map(([t, p, c]) => `<article class="card spotlight" data-reveal>
      <p class="mono gradient-text" style="font-size:var(--step-1);font-weight:700">${p}</p>
      <h3 style="margin-top:.4rem;font-size:var(--step-0)">${t}</h3>
      <p style="font-size:var(--step--1)">${c}</p>
    </article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Volume',
    title: 'Agency and enterprise pricing',
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem">
      <p>If you distribute ten or more releases a month, list pricing stops being sensible. Volume pricing starts 22% below list and scales with commitment.</p>
      <p>Agency workspaces add multi-client separation, white-label reporting and shared routing presets. Enterprise adds SAML SSO, approval chains, audit logging, custom retention and a signed data processing agreement.</p>
    </div>
    <div class="panel panel-glass" style="padding:1.6rem">
      ${listCheck([
      'Volume discount from 10 releases per month',
      'White-label dashboards for agency clients',
      'SSO, SCIM and audit logging on enterprise',
      'DPA, custom retention and regional data residency',
      'Invoice and PO billing on annual terms',
      'Named onboarding and quarterly business review',
    ])}
      <p class="mt-3"><a class="btn btn-block" href="contact.html">Request a workspace quote</a></p>
    </div>
  </div>`,
  })}

${faqSection({ items: [...faqs.pricing, ...faqs.general.slice(0, 2)], title: 'Pricing questions', eyebrow: 'Answers' })}
${ctaBand({ title: 'Try one release at list price.', text: 'No onboarding fee, no minimum commitment, and the reporting is yours to keep.' })}`,
};

/* --------------------------------- COMPARE ------------------------------- */
const compare = {
  slug: 'compare',
  title: `Compare Press Release Distribution Platforms | ${site.name}`,
  description:
    'How PressCosmos compares with PR Newswire, EIN Presswire, IssueWire, 24-7 Press Release and OpenPR across pricing, AI visibility, editorial review, newsroom hosting and reporting.',
  keywords: ['compare press release services', 'PR Newswire alternative', 'EIN Presswire alternative', 'best press release distribution service'],
  breadcrumbs: [{ label: 'Compare platforms' }],
  priority: 0.9,
  faqs: [
    { q: 'Which press release distribution service is best?', a: 'It depends on what you need. Legacy wires such as PR Newswire are strongest for regulated, large-scale corporate disclosure. Low-cost self-serve platforms such as IssueWire and OpenPR are best for volume at minimum cost. PressCosmos is built for teams who need distribution plus AI answer-engine visibility, with human editorial review on every release at mid-market pricing.' },
    { q: 'Is a cheaper wire good enough?', a: 'For a link you can show a client, often yes. For an announcement where the business outcome depends on a journalist or an AI assistant picking it up, distribution quality and formatting usually matter more than the fee difference.' },
    { q: 'Can I use more than one distribution service?', a: 'Yes, and plenty of teams do. Some run a premium wire for material news and a lower-cost lane for routine updates. PressCosmos supports that arrangement because we report citations and backlinks against any campaign, not only our own distribution.' },
    { q: 'What does PressCosmos do that legacy wires do not?', a: 'Three things: answer-engine formatting is included on every plan rather than sold as an upgrade; AI citation tracking across nine engines is reported alongside traffic; and branded newsroom hosting is available on any plan so authority accrues to your own domain.' },
  ],
  body: `
${pageHero({
    eyebrow: 'Comparison',
    h1: 'An honest comparison — including where we are not the right choice.',
    lede: 'Every platform in this category does something well. Here is a side-by-side view so you can pick deliberately rather than by logo recognition.',
    crumbItems: [{ label: 'Compare platforms' }],
    actions: '<a class="btn" href="pricing.html">See our pricing</a><a class="btn btn-ghost" href="submit.html">Test one release</a>',
  })}

${section({
    body: answer('PressCosmos competes with PR Newswire, EIN Presswire, IssueWire, 24-7 Press Release and OpenPR. We differentiate on three axes: AI answer-engine visibility included at every price point, human editorial review on all plans, and branded newsroom hosting so earned authority accrues to your own domain. Legacy wires still lead on regulated corporate disclosure scale; low-cost platforms lead on price alone.'),
    className: 'section-tight pt-0',
  })}

${section({
    eyebrow: 'Side by side',
    title: 'Platform comparison',
    lede: 'Assessed on public information at the time of writing. If a competitor changes their offering, tell us and we will update this table.',
    body: `<div class="table-scroll" data-reveal>
    <table class="compare">
      <caption class="visually-hidden">Comparison of press release distribution platforms</caption>
      <thead><tr>
        <th scope="col">Criteria</th>
        <th scope="col" class="col-highlight">PressCosmos</th>
        <th scope="col">PR Newswire</th>
        <th scope="col">EIN Presswire</th>
        <th scope="col">IssueWire</th>
        <th scope="col">24-7 Press Release</th>
        <th scope="col">OpenPR</th>
      </tr></thead>
      <tbody>
        ${[
      ['Entry price per release', '$149', 'Quote-based, typically $500+', '$149', 'Low-cost / freemium tiers', '$49', 'Free tier available'],
      ['Published list pricing', 'yes', 'no', 'yes', 'yes', 'yes', 'yes'],
      ['Human editorial review', 'All plans', 'Yes, premium tiers', 'Yes', 'Limited', 'Yes', 'Minimal'],
      ['AI answer-engine formatting', 'Included', 'Emerging, premium tiers', 'Marketed, limited', 'No', 'No', 'No'],
      ['AI citation tracking', '9 engines', 'No', 'Partial', 'No', 'No', 'No'],
      ['Branded newsroom hosting', 'Any plan add-on', 'Enterprise', 'Add-on', 'Add-on', 'No', 'No'],
      ['Terminal / analyst delivery', 'yes', 'yes', 'No', 'No', 'Partial', 'No'],
      ['Languages', '24', '40+', 'Multi', 'Limited', 'Limited', 'No'],
      ['Pickup map & sentiment', 'yes', 'yes', 'Basic', 'Basic', 'Basic', 'No'],
      ['Backlink reporting with follow status', 'yes', 'yes', 'Partial', 'Partial', 'No', 'No'],
      ['Crisis lane 24/7', 'yes', 'yes', 'No', 'No', 'No', 'No'],
      ['Best for', 'AI-era visibility at mid-market pricing', 'Regulated enterprise disclosure', 'Affordable broad syndication', 'Cheapest possible link', 'Low-cost volume distribution', 'Free announcement posting'],
    ].map((row) => `<tr><th scope="row" style="font-weight:600;font-size:var(--step--1)">${row[0]}</th>${row.slice(1).map((c) => {
      const cls = c === 'yes' ? 'yes' : c === 'no' ? 'no' : '';
      const display = c === 'yes' ? '✓' : c === 'no' ? '—' : c;
      const highlight = c === row[1] ? 'col-highlight' : '';
      return `<td class="${cls} ${highlight}">${display}</td>`;
    }).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>
  <p class="mono faint mt-3">Compiled from publicly available pricing and feature pages. Trademarks belong to their respective owners; PressCosmos is not affiliated with any platform listed above.</p>`,
  })}

${section({
    eyebrow: 'Fit',
    title: 'When you should not choose us',
    body: `<div class="grid g-3">
    ${[
      ['You need the absolute lowest price', 'If the goal is a syndicated link at minimum cost and nobody will read it, a free or freemium platform is a rational purchase. We will not pretend otherwise.'],
      ['You need a legacy wire name for a regulated filing', 'Some disclosure regimes and counsel teams expect a specific incumbent wire. That is a legitimate constraint, not a marketing problem.'],
      ['You want zero editorial involvement', 'We review every release. If your process requires publishing unread copy instantly with no gate, we are the wrong fit.'],
    ].map(([t, c]) => card({ iconName: 'shield', title: t, text: c })).join('')}
  </div>`,
  })}

${faqSection({ items: [
      { q: 'Which press release distribution service is best?', a: 'It depends on what you need. Legacy wires such as PR Newswire are strongest for regulated, large-scale corporate disclosure. Low-cost self-serve platforms such as IssueWire and OpenPR are best for volume at minimum cost. PressCosmos is built for teams who need distribution plus AI answer-engine visibility, with human editorial review on every release at mid-market pricing.' },
      { q: 'Is a cheaper wire good enough?', a: 'For a link you can show a client, often yes. For an announcement where the business outcome depends on a journalist or an AI assistant picking it up, distribution quality and formatting usually matter more than the fee difference.' },
      { q: 'Can I use more than one distribution service?', a: 'Yes, and plenty of teams do. Some run a premium wire for material news and a lower-cost lane for routine updates. PressCosmos reports citations and backlinks against any campaign, not only our own distribution.' },
      { q: 'What does PressCosmos do that legacy wires do not?', a: 'Answer-engine formatting is included on every plan rather than sold as an upgrade; AI citation tracking across nine engines is reported alongside traffic; and branded newsroom hosting is available on any plan so authority accrues to your own domain.' },
    ], title: 'Comparison questions', eyebrow: 'Answers' })}
${ctaBand({ title: 'The only fair test is one release.', text: 'Run the same announcement through us and your current provider, then compare the pickup maps.' })}`,
};

/* ------------------------------- INDUSTRIES ------------------------------ */
const industriesHub = {
  slug: 'industries',
  title: `Press Release Distribution by Industry | ${site.name}`,
  description:
    'Industry-specific press release distribution with dedicated media lists, keyword guidance and specialist reviewers across twelve sectors.',
  keywords: ['press release distribution by industry', 'industry PR distribution', 'trade media distribution'],
  breadcrumbs: [{ label: 'Industries' }],
  priority: 0.9,
  body: `
${pageHero({
    eyebrow: 'Industries',
    h1: 'Every sector has its own definition of news.',
    lede: 'A clinical milestone and a store opening are both announcements. They do not read the same, they do not go to the same desks, and the editor who reviews them should not be the same person.',
    crumbItems: [{ label: 'Industries' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="pricing.html">See pricing</a>',
  })}

${section({
    body: answer('PressCosmos distributes press releases across twelve industry verticals: technology, SaaS, finance and banking, crypto and Web3, healthcare and life sciences, real estate, education and edtech, travel and hospitality, automotive and mobility, entertainment and media, legal and professional services, and e-commerce and retail. Each vertical has its own media list, keyword guidance and specialist reviewer.'),
    className: 'section-tight pt-0',
  })}

${section({
    body: `<div class="card-grid">
    ${industries.map((i) => `<article class="card spotlight" data-reveal>
      <h3>${i.name}</h3>
      <p>${i.intent.charAt(0).toUpperCase() + i.intent.slice(1)}.</p>
      <p class="mono faint mt-2">${i.stat}</p>
      <p class="mt-3"><a class="link-arrow" href="${i.slug}.html">${i.name} distribution ${icon('arrow')}</a></p>
    </article>`).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Not sure which route fits?', text: 'Send us the announcement. We will tell you which vertical and which tier we would run — and when the honest answer is a narrower send.' })}`,
};

export const corePages = [
  home, about, howItWorks, servicesPage, distribution, aiVisibility, seoPr, mediaMonitoring,
  analytics, newsroomHosting, crisis, investorRelations, pricing, compare, industriesHub,
];
