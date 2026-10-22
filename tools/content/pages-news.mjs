// PressCosmos — newsroom, sample releases and the insights library.

import { site, networkChannels } from '../site.mjs';
import {
  icon, section, pageHero, answer, faqSection, ctaBand, storyCard, releaseRow,
  quote, listCheck, takeaways, ticker, callout,
} from '../ui.mjs';

/* ---------------------------------------------------------------- helpers */
const articleShell = ({ toc, body, meta }) => `
<div class="wrap layout-article">
  <div data-article-body>
    <div class="article-head">${meta}</div>
    <div class="prose" style="margin-top:2rem">${body}</div>
  </div>
  <nav class="toc" data-toc aria-label="On this page">
    <h4>On this page</h4>
    <ol>${toc.map((t) => `<li><a href="#${t.id}">${t.label}</a></li>`).join('')}</ol>
  </nav>
</div>`;

const articleMeta = ({ author, role, published, updated, readTime, tag }) => `
<div class="article-meta">
  <span class="byline"><span class="avatar" aria-hidden="true">${author.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
  <span><strong style="display:block;font-size:var(--step--1)">${author}</strong><span class="muted" style="font-size:var(--step--1)">${role}</span></span></span>
  <time datetime="${published.iso}">${published.label}</time>
  <span>${readTime}</span>
  <span class="tag">${tag}</span>
</div>`;

const articleSchema = (p) => ({
  '@type': 'Article',
  headline: p.title.split('|')[0].trim(),
  description: p.description,
  datePublished: p.publishedISO,
  dateModified: p.modifiedISO || p.publishedISO,
  author: { '@type': 'Organization', name: site.legalName, url: site.baseUrl },
  publisher: { '@id': `${site.baseUrl}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.baseUrl}/${p.slug}.html` },
  image: `${site.baseUrl}${site.defaultOgImage}`,
  inLanguage: site.language,
  isAccessibleForFree: true,
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.callout-answer', 'h1'] },
});

const releaseSchema = (p) => ({
  '@type': 'NewsArticle',
  headline: p.title.split('|')[0].trim(),
  description: p.description,
  datePublished: p.publishedISO,
  dateModified: p.modifiedISO || p.publishedISO,
  dateline: p.location,
  articleSection: p.category,
  author: { '@type': 'Organization', name: p.issuer || site.legalName, url: site.baseUrl },
  publisher: { '@id': `${site.baseUrl}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.baseUrl}/${p.slug}.html` },
  image: `${site.baseUrl}${site.defaultOgImage}`,
  inLanguage: site.language,
});

/* --------------------------------------------------------------- releases */
const releasesRaw = [
  {
    slug: 'northwind-robotics-series-b',
    headline: 'Northwind Robotics raises $45M Series B to scale warehouse automation deployments',
    category: 'Technology',
    location: 'SEATTLE, WA, UNITED STATES',
    published: { label: 'October 22, 2026', iso: '2026-10-22T09:15:00-07:00' },
    issuer: 'Northwind Robotics, Inc.',
    summary: 'Northwind Robotics closed a $45 million Series B led by Candler Ventures to expand deployment capacity for its autonomous picking systems.',
    paragraphs: [
      'Northwind Robotics, Inc., a warehouse automation company, today announced it has raised $45 million in Series B funding led by Candler Ventures, with participation from Hollowbrook Capital and existing investors. The round brings total funding to $78 million.',
      'The company said the capital will fund deployment capacity for its NW-300 autonomous picking system, which it claims reduces manual pick time by 41% in customer facilities. Northwind currently operates in 62 warehouses across North America and Europe and expects to reach 150 sites by the end of 2027.',
      'Northwind also announced it is opening a second manufacturing facility in Guadalajara, Mexico, in the first quarter of 2027, creating approximately 180 roles.',
    ],
    quote: {
      text: 'The constraint on warehouse automation has never been demand. It has been the number of teams we can physically deploy. This round is about deployment capacity, not marketing.',
      name: 'Priya Raghunathan',
      role: 'Chief Executive Officer, Northwind Robotics',
    },
    boilerplate: 'Northwind Robotics builds autonomous picking systems for mid-size and enterprise warehouses. Founded in 2019, the company operates 62 deployed sites across North America and Europe.',
    faq: [
      ['How much did Northwind Robotics raise and who led the round?', 'Northwind Robotics raised $45 million in Series B funding led by Candler Ventures, with participation from Hollowbrook Capital and existing investors. Total funding to date is $78 million.'],
      ['What will Northwind do with the funding?', 'The company will expand deployment capacity for its NW-300 autonomous picking system and open a second manufacturing facility in Guadalajara, Mexico, creating around 180 roles.'],
      ['How many sites does Northwind Robotics operate?', 'Northwind currently operates in 62 warehouses across North America and Europe and expects to reach 150 sites by the end of 2027.'],
    ],
  },
  {
    slug: 'ledgerline-reconciliation-launch',
    headline: 'Ledgerline Financial launches real-time reconciliation for mid-market banks',
    category: 'Finance',
    location: 'NEW YORK, NY, UNITED STATES',
    published: { label: 'October 21, 2026', iso: '2026-10-21T08:00:00-04:00' },
    issuer: 'Ledgerline Financial',
    summary: 'Ledgerline Financial released a real-time reconciliation engine for banks with $1–20 billion in assets, cutting month-end close from nine days to two.',
    paragraphs: [
      'Ledgerline Financial today launched Ledgerline Reconcile, a real-time transaction reconciliation platform built for banks with between $1 billion and $20 billion in assets. The company said the platform reduces month-end close from a nine-day average to two days in pilot deployments with six institutions.',
      'The product connects to core banking systems and general ledgers, matching transactions continuously rather than in nightly batches. Pricing starts at $4,800 per month for institutions under $5 billion in assets.',
      'Ledgerline said it will publish a quarterly index of reconciliation exception rates across its customer base, beginning in January 2027.',
    ],
    quote: {
      text: 'Mid-market banks are running billion-dollar balance sheets on spreadsheet reconciliation. That is not a resourcing problem, it is a tooling problem.',
      name: 'Daniel Okonkwo',
      role: 'Chief Executive Officer, Ledgerline Financial',
    },
    boilerplate: 'Ledgerline Financial provides reconciliation and financial-close software to mid-market banks and credit unions. The company is headquartered in New York.',
    faq: [
      ['What does Ledgerline Reconcile do?', 'It reconciles transactions in real time by connecting core banking systems and general ledgers, replacing nightly batch reconciliation. Pilot customers reduced month-end close from nine days to two.'],
      ['How much does Ledgerline Reconcile cost?', 'Pricing starts at $4,800 per month for institutions with under $5 billion in assets.'],
      ['Which institutions is Ledgerline Reconcile built for?', 'Banks and credit unions with between $1 billion and $20 billion in assets.'],
    ],
  },
  {
    slug: 'halcyon-hlx-204-phase-2',
    headline: 'Halcyon Therapeutics reports positive Phase 2 results for HLX-204 in chronic kidney disease',
    category: 'Healthcare',
    location: 'BOSTON, MA, UNITED STATES',
    published: { label: 'October 20, 2026', iso: '2026-10-20T07:30:00-04:00' },
    issuer: 'Halcyon Therapeutics',
    summary: 'Halcyon Therapeutics reported topline Phase 2 data for HLX-204, with a 32% relative reduction in the primary composite endpoint over 24 weeks.',
    paragraphs: [
      'Halcyon Therapeutics today reported topline results from its Phase 2 trial of HLX-204 in adults with stage 3 chronic kidney disease and type 2 diabetes. The trial met its primary endpoint, with a 32% relative reduction in the composite of eGFR decline and hospitalisation over 24 weeks compared with placebo (p=0.0031).',
      'The trial enrolled 412 participants across 38 sites in the United States and Europe. Adverse events were reported in 41% of participants receiving HLX-204 versus 39% in the placebo arm, with the most common being mild gastrointestinal events.',
      'Halcyon said it will present the full dataset at the American Society of Nephrology annual meeting in November and plans to begin a Phase 3 programme in the first half of 2027.',
    ],
    quote: {
      text: 'These are mid-stage results in a population with few options and a well-documented rate of decline. The Phase 3 design is the next real question.',
      name: 'Dr. Elena Márquez',
      role: 'Chief Medical Officer, Halcyon Therapeutics',
    },
    boilerplate: 'Halcyon Therapeutics is a clinical-stage biotechnology company developing therapies for metabolic and renal disease. The company is headquartered in Boston.',
    faq: [
      ['What were the Phase 2 results for HLX-204?', 'The trial met its primary endpoint with a 32% relative reduction in a composite of eGFR decline and hospitalisation over 24 weeks versus placebo, with p=0.0031, in 412 participants.'],
      ['Was HLX-204 safe in the Phase 2 trial?', 'Adverse events were reported in 41% of participants receiving HLX-204 versus 39% on placebo, most commonly mild gastrointestinal events.'],
      ['When will Halcyon start Phase 3?', 'Halcyon plans to begin a Phase 3 programme in the first half of 2027 and will present the full dataset at the ASN annual meeting in November 2026.'],
    ],
  },
  {
    slug: 'verso-living-portland-timber',
    headline: 'Verso Living opens 120-unit mass timber development in Portland',
    category: 'Real Estate',
    location: 'PORTLAND, OR, UNITED STATES',
    published: { label: 'October 19, 2026', iso: '2026-10-19T06:45:00-07:00' },
    issuer: 'Verso Living',
    summary: 'Verso Living opened Albina Timber Works, a 120-unit mass timber residential building in Portland, with 30 units reserved for households earning below 60% of area median income.',
    paragraphs: [
      'Verso Living today opened Albina Timber Works, a 120-unit residential building in North Portland constructed with a cross-laminated timber frame. The development includes ground-floor retail and 30 income-restricted units reserved for households earning below 60% of area median income.',
      'The project was completed in 22 months at a reported cost of $61 million, roughly 11% below the firm\'s initial budget. Verso attributed the saving to prefabricated timber elements and an eight-week reduction in framing time.',
      'Leasing begins this month, with first move-ins scheduled for December.',
    ],
    quote: {
      text: 'Timber is not a marketing decision for us. It is an eight-week schedule saving and a lighter foundation, which is where a lot of multifamily budgets quietly go wrong.',
      name: 'Aisha Karim',
      role: 'Director of Development, Verso Living',
    },
    boilerplate: 'Verso Living develops residential and mixed-use properties in the Pacific Northwest, with a focus on low-carbon construction methods.',
    faq: [
      ['What did Verso Living open in Portland?', 'Albina Timber Works, a 120-unit mass timber residential building with ground-floor retail and 30 income-restricted units.'],
      ['How much did the project cost?', 'The project was completed in 22 months at a reported cost of $61 million, approximately 11% below the firm\'s initial budget.'],
      ['When do residents move in?', 'Leasing began in October 2026 with first move-ins scheduled for December 2026.'],
    ],
  },
  {
    slug: 'arcline-logistics-coo-appointment',
    headline: 'Arcline Logistics appoints Marta Alvés as Chief Operating Officer',
    category: 'Business',
    location: 'CHICAGO, IL, UNITED STATES',
    published: { label: 'October 17, 2026', iso: '2026-10-17T10:00:00-05:00' },
    issuer: 'Arcline Logistics',
    summary: 'Arcline Logistics appointed Marta Alvés as Chief Operating Officer, effective November 3, succeeding founder-led operations.',
    paragraphs: [
      'Arcline Logistics today announced the appointment of Marta Alvés as Chief Operating Officer, effective November 3. Alvés joins from a European freight group where she led network operations across 14 countries.',
      'The appointment follows a two-year period in which Arcline grew from 11 to 29 distribution centres. The company said Alvés will own network design, labour planning and the consolidation programme announced in June.',
      'Founder Gregory Lindqvist continues as Chief Executive, moving out of day-to-day operations.',
    ],
    quote: {
      text: 'We have built a network faster than we built the systems to run it. That is a solvable problem and it is the one I have been hired to solve.',
      name: 'Marta Alvés',
      role: 'Chief Operating Officer, Arcline Logistics',
    },
    boilerplate: 'Arcline Logistics operates 29 distribution centres across North America and Europe, serving industrial and consumer goods shippers.',
    faq: [
      ['Who is Arcline Logistics\' new Chief Operating Officer?', 'Marta Alvés, previously responsible for network operations across 14 countries at a European freight group. She starts on November 3, 2026.'],
      ['Why did Arcline Logistics hire a COO?', 'The company grew from 11 to 29 distribution centres in two years and said operations had outgrown its founder-led structure.'],
      ['Is the founder leaving?', 'No. Gregory Lindqvist continues as Chief Executive, moving out of day-to-day operations.'],
    ],
  },
  {
    slug: 'presscosmos-ai-visibility-suite',
    headline: 'PressCosmos launches AI Visibility Suite with share-of-answer tracking across nine engines',
    category: 'Product',
    location: 'SAN FRANCISCO, CA, UNITED STATES',
    published: { label: 'October 15, 2026', iso: '2026-10-15T06:00:00-07:00' },
    issuer: 'PressCosmos Media Network',
    summary: 'PressCosmos released an AI Visibility Suite that formats every press release for answer engines and reports how often a brand is cited across nine AI platforms.',
    paragraphs: [
      'PressCosmos today launched its AI Visibility Suite, a set of formatting and measurement features applied to every press release distributed through the platform. The suite includes answer-engine formatted summary blocks, Organization and NewsArticle structured data, and share-of-answer tracking across nine AI systems.',
      'Share-of-answer reporting measures how often, and how accurately, a brand appears in responses to a tracked question set on ChatGPT, Claude, Gemini, Perplexity, Copilot, Google AI Overviews, Meta AI, Grok and You.com.',
      'The company also published an open crawler policy and an llms.txt guidance file, and said the formatting features are included on all plans, including the $149 entry tier.',
    ],
    quote: {
      text: 'Distribution solved getting published. It never solved getting repeated. If an assistant answers a category question without naming you, the release did not finish its job.',
      name: 'Dr. Lian Chen',
      role: 'VP, Search and AI Products, PressCosmos',
    },
    boilerplate: 'PressCosmos is a press release distribution and AI visibility platform serving organisations in 68 countries. Founded in 2026 and headquartered in San Francisco, the company distributes releases on a pay-per-release basis from $149.',
    faq: [
      ['What is the PressCosmos AI Visibility Suite?', 'It is a set of formatting and measurement features applied to every release: answer-engine summary blocks, structured data, machine-readable feeds, share-of-answer tracking across nine AI engines, and an open crawler policy.'],
      ['Which AI engines does PressCosmos track?', 'ChatGPT, Claude, Gemini, Perplexity, Copilot, Google AI Overviews, Meta AI, Grok and You.com.'],
      ['Does AI visibility cost extra?', 'No. Answer-engine formatting is included on all plans including the $149 Launch tier. Detailed share-of-answer tracking is included from the Amplify plan upward.'],
    ],
  },
];
const releases = releasesRaw.map((r) => ({
  slug: r.slug,
  type: 'release',
  category: r.category,
  location: r.location,
  issuer: r.issuer,
  publishedISO: r.published.iso,
  modifiedISO: r.published.iso,
  title: `${r.headline.split(' ').slice(0, 8).join(' ')}… | ${site.name} Newsroom`,
  description: r.summary,
  keywords: [r.category.toLowerCase(), 'press release', 'newsroom', issuerSafe(r.issuer)],
  breadcrumbs: [{ label: 'Newsroom', href: 'newsroom.html' }, { label: r.category, href: `newsroom.html#${r.category.toLowerCase()}` }, { label: r.issuer }],
  priority: 0.6,
  changefreq: 'monthly',
  faqs: r.faq.map(([q, a]) => ({ q, a })),
  schema: [],
  body: `
${pageHero({
    eyebrow: `${r.category} release`,
    h1: r.headline,
    lede: r.summary,
    crumbItems: [{ label: 'Newsroom', href: 'newsroom.html' }, { label: r.category }],
    badge: { text: `Distributed via ${site.name}`, class: 'pill-live' },
    actions: '<a class="btn btn-ghost btn-sm" href="newsroom.html">All releases</a><a class="btn btn-ghost btn-sm" href="submit.html">Publish your own</a>',
  })}

${section({
    body: `<div class="wrap-narrow mx-auto">
    <p class="mono faint">${r.location} — ${r.published.label}</p>
    <div class="prose" style="margin-top:1.5rem">
      ${r.paragraphs.map((p) => `<p>${p}</p>`).join('')}
    </div>
    <blockquote class="callout" style="margin-top:2rem">
      <p style="font-family:var(--font-display);font-size:var(--step-1);color:var(--ink)">“${r.quote.text}”</p>
      <p class="mono faint mt-2">— ${r.quote.name}, ${r.quote.role}</p>
    </blockquote>
    <hr class="hr">
    <h2 style="font-size:var(--step-1)">About ${r.issuer}</h2>
    <p class="muted" style="margin-top:.6rem">${r.boilerplate}</p>
    <h2 style="font-size:var(--step-1);margin-top:2rem">Media contact</h2>
    <p class="muted" style="margin-top:.6rem">Media enquiries for this announcement: <a href="mailto:${site.pressEmail}" style="color:var(--cyan)">${site.pressEmail}</a></p>
    <div class="callout mt-4">
      <strong>Note on this page</strong>
      This is a demonstration release published on the PressCosmos newsroom. Company names, figures and quotations are illustrative sample content, not real announcements. Replace it with your own release via the <a href="submit.html" style="color:var(--cyan)">submission page</a>.
    </div>
  </div>`,
    className: 'section-tight pt-0',
  })}

${faqSection({ items: r.faq.map(([q, a]) => ({ q, a })), title: 'Release details', eyebrow: 'Questions' })}

${ctaBand({ title: 'Distribute an announcement like this.', text: 'Every release gets editorial review, syndication across the network, and pickup, backlink and AI citation reporting.', primary: 'Submit a press release', primaryHref: 'submit.html', secondary: 'See pricing', secondaryHref: 'pricing.html' })}`,
}));

function issuerSafe(s) { return s.replace(/[,.]/g, ''); }
releases.forEach((p) => { p.schema = [releaseSchema(p)]; });

/* -------------------------------------------------------------- insight posts */
const postsRaw = [
  {
    slug: 'how-to-write-a-press-release',
    tag: 'Writing',
    readTime: '9 min read',
    published: { label: 'October 18, 2026', iso: '2026-10-18T08:00:00-07:00' },
    title: `How to Write a Press Release That Actually Gets Picked Up (2026 Guide) | ${site.name}`,
    description: 'A practical, editor-reviewed guide to writing press releases: the structure that works, the openings that get rejected, and the formatting that makes AI systems cite you.',
    toc: [
      { id: 'structure', label: 'The structure that works' },
      { id: 'headline', label: 'Headlines' },
      { id: 'first-paragraph', label: 'The first paragraph' },
      { id: 'quotes', label: 'Quotes that do something' },
      { id: 'boilerplate', label: 'Boilerplate and contact' },
      { id: 'checklist', label: 'Pre-submission checklist' },
    ],
    body: `
<p class="lede">Most press releases fail before an editor reads the second sentence. Not because the news is weak, but because the release is organised around the sender's internal politics instead of the reader's question.</p>

${answer('A press release should state the news in the headline, answer who, what, when, where and why in the first two sentences, support it with one specific number, include a quote that adds perspective rather than repetition, and close with a boilerplate and usable media contact. Aim for 400–600 words.')}

${takeaways([
      'Lead with a verifiable fact, not a sentiment: "raises $45M" beats "is thrilled to announce".',
      'One number in the first paragraph is worth more than three paragraphs of adjectives.',
      'A quote should add context a reporter cannot get from the body copy.',
      'Every claim needs an attribution path, or an editor will cut it.',
    ])}

<h2 id="structure">The structure that works</h2>
<p>Six elements, in this order. Deviate and you are making an editor work to find the news.</p>
<ol>
  <li><strong>Dateline</strong> — city, state or country, then the date. It signals the release is geographically grounded.</li>
  <li><strong>Headline</strong> — the news, stated plainly, ideally under 100 characters.</li>
  <li><strong>Subheadline</strong> — one line of supporting detail. Optional, often where the number goes.</li>
  <li><strong>Opening paragraph</strong> — the who, what, when, where, why. Two sentences maximum.</li>
  <li><strong>Body</strong> — context, numbers, the quote, and what happens next.</li>
  <li><strong>Boilerplate and contact</strong> — who you are in two sentences, and an email address that a journalist can use today.</li>
</ol>

<h2 id="headline">Headlines</h2>
<p>The test is simple: could a subeditor scan this and know whether the story is for them? Specific nouns and a number in the headline outperform clever phrasing almost every time.</p>
<blockquote>Weak: Company announces exciting new chapter in its growth journey. Strong: Company opens 40-person engineering office in Lisbon, hiring by June.</blockquote>
<p>Keep search intent in mind, but never at the cost of accuracy. If the phrase you want to rank for makes the headline false or clumsy, change the phrase, not the fact. Our <a href="press-release-seo-guide.html">SEO PR guide</a> covers that trade-off in detail.</p>

<h2 id="first-paragraph">The first paragraph</h2>
<p>This is the paragraph that gets quoted, syndicated, summarised by search engines and lifted into AI answers. It should stand alone if everything after it were deleted.</p>
<ul>
  <li>Name the organisation exactly as you want to be named elsewhere.</li>
  <li>State the action with an active verb.</li>
  <li>Include the number that makes the news material.</li>
  <li>Skip the scene-setting preamble entirely.</li>
</ul>

<h2 id="quotes">Quotes that do something</h2>
<p>A quote is not a place to repeat the body copy with the words "we are excited" in front of it. It is the one place a reader hears a human explain significance, motive or what happens next.</p>
<p>Include attribution with a real title, and include a second quote only if it brings a genuinely different perspective — a customer, a partner, an independent expert. Two quotes making the same point is one quote.</p>

<h2 id="boilerplate">Boilerplate and contact</h2>
<p>The boilerplate is your about section, capped at two sentences: what the organisation does, how big it is, where it is based. Pickup pages reproduce it verbatim, so keep it current and consistent with what your website and structured data say.</p>
<p>The contact should be a monitored mailbox, not a generic form. Journalists work on deadlines and will abandon a story rather than fill in a contact form.</p>

<h2 id="checklist">Pre-submission checklist</h2>
${listCheck([
      'Headline states the news and is under 100 characters',
      'Dateline present with city and date',
      'First paragraph is quotable on its own',
      'At least one specific, verifiable number',
      'At least one quote from a named person with a title',
      'Every comparative or superlative claim has a source',
      'Boilerplate is current and factual',
      'Media contact is monitored during working hours',
      'Media assets are licensed and captioned',
    ])}

${callout({ title: 'What gets a release rejected', text: 'Undisclosed paid content, unverifiable superlatives, missing client consent on legal matters, health claims without a cited source, and anything implying guaranteed returns. Our <a href="editorial-guidelines.html" style="color:var(--cyan)">editorial guidelines</a> list the full policy.' })}

<h2>Format it for machines as well as people</h2>
<p>In 2026, part of your audience is a retrieval system. That means clean heading hierarchy, a summary block near the top, stable URLs, and structured data describing the article and your organisation. None of that conflicts with good writing — it is the same discipline applied to a different reader.</p>`,
    faqs: [
      ['How long should a press release be?', 'Between 400 and 600 words for most announcements. Anything under 300 usually lacks support for its claims; anything over 700 usually contains context the reader did not ask for.'],
      ['Do press releases still work in 2026?', 'Yes. What changed is who reads them. Journalists still use them, but search engines, aggregators and AI answer engines now also index and quote them, which makes structure and structured data more important than they were a decade ago.'],
      ['Should I include a quote in every press release?', 'Include one. A quote from a named person with a real title adds credibility and gives syndicating outlets a pull-quote. Only add a second if it brings a different perspective.'],
    ],
  },
  {
    slug: 'press-release-seo-guide',
    tag: 'SEO',
    readTime: '10 min read',
    published: { label: 'October 12, 2026', iso: '2026-10-12T08:00:00-07:00' },
    title: `Press Release SEO: The Complete 2026 Guide | ${site.name}`,
    description: 'How to optimise a press release for search without turning it into an advert: keyword mapping, headline phrasing, backlink realities and what actually ranks.',
    toc: [
      { id: 'what-works', label: 'What actually ranks' },
      { id: 'keywords', label: 'Mapping keywords' },
      { id: 'structure', label: 'On-page structure' },
      { id: 'backlinks', label: 'Backlink realities' },
      { id: 'measure', label: 'Measuring results' },
    ],
    body: `
<p class="lede">Press release SEO has a bad reputation, largely deserved. Somewhere along the way it became shorthand for buying keyword-stuffed links. That version of it stopped working years ago, and it was never good PR.</p>

${answer('Press release SEO means matching an announcement to how people search for it, stating the news clearly in the headline and first paragraph, naming entities precisely, earning editorial links rather than buying them, and reporting rankings and referral traffic. It does not mean stuffing keywords or purchasing dofollow anchors.')}

${takeaways([
      'Target search intent — the question someone asks when ready to act — not the highest-volume phrase.',
      'The headline and first 60 words carry most of the on-page weight.',
      'Earned editorial links outperform purchased syndication links, and carry no penalty risk.',
      'Branded search lift is often the clearest signal that PR worked.',
    ])}

<h2 id="what-works">What actually ranks</h2>
<p>Press release ranking is dominated by three factors that have nothing to do with keyword density:</p>
<ol>
  <li><strong>The authority of the publishing domain.</strong> A release hosted on a strong domain will outrank an identical one hosted on a weak domain, regardless of wording.</li>
  <li><strong>Corroboration.</strong> When several independent outlets carry the same facts, retrieval systems treat the claim as more reliable. This is why distribution breadth still matters.</li>
  <li><strong>Clarity of entities.</strong> The organisation, product, place and category named unambiguously, consistently, and in structured data.</li>
</ol>

<h2 id="keywords">Mapping keywords</h2>
<p>Start from intent categories rather than a keyword tool export:</p>
<ul>
  <li><strong>Announcement intent</strong> — "X raises Series B", "X launches Y". High specificity, low volume, high conversion.</li>
  <li><strong>Category intent</strong> — "best warehouse automation software". High volume, competitive, rarely won by a press release alone.</li>
  <li><strong>Discovery intent</strong> — "what is warehouse automation". Best served by a guide, not a release.</li>
</ul>
<p>Pick one or two announcement-intent phrases. Use them where a human editor would have used them anyway. If the phrase cannot be placed naturally, it does not belong in this release.</p>

<h2 id="structure">On-page structure</h2>
${listCheck([
      'Descriptive title tag including the organisation and the news',
      'H2 subheadings that ask or answer questions real readers have',
      'A 40–60 word summary block near the top for extraction',
      'Consistent naming of the organisation on every mention',
      'NewsArticle and Organization structured data',
      'Canonical URL on the hosted release page',
      'Original image assets with descriptive alt text',
    ])}
<p>The same structure serves search crawlers and AI answer engines. Our <a href="aeo-geo-llmo-explained.html">AEO, GEO and LLMO guide</a> goes deeper on the answer-engine side.</p>

<h2 id="backlinks">Backlink realities</h2>
<p>Here is what nobody selling links will tell you: most syndicated copies of a press release carry a nofollow attribute or are duplicates that search engines consolidate. The link equity from a single distribution is usually small.</p>
<p>What produces durable links is a story good enough that writers link to it voluntarily — a dataset, a category benchmark, a genuinely novel claim. Distribution gets the story in front of them; it does not manufacture the incentive to link.</p>
${callout({ title: 'If a vendor guarantees dofollow links', text: 'They are either buying links, operating a private network, or counting nofollow syndication as links. All three are penalty risks on your domain. We publish follow status on every link we report, including when the answer is unfavourable.' })}

<h2 id="measure">Measuring results</h2>
<div class="grid g-2">
  ${[['Rankings', 'Track the announcement-intent phrases for 90 days. Expect movement within 2–4 weeks.'], ['Referral traffic', 'Sessions from earned coverage, segmented by outlet quality rather than volume.'], ['Backlinks', 'New referring domains, with authority and follow status.'], ['Branded search', 'Volume change in the four weeks after distribution — often the strongest PR signal.']]
        .map(([t, c]) => `<article class="card"><h3 style="font-size:var(--step-0)">${t}</h3><p style="font-size:var(--step--1)">${c}</p></article>`).join('')}
</div>`,
    faqs: [
      ['Do press releases help SEO?', 'They help when they earn editorial links, are hosted on strong domains, and use structured data. They help less when the only outcome is duplicated content on syndication partners. Referral traffic and backlinks are the metrics that matter, not impressions.'],
      ['How do I optimise a headline for SEO?', 'State the news with the noun that describes it — company, product, action. Include the target phrase only if a human editor would have written it that way. Under 100 characters where possible.'],
      ['Should I put keywords in my press release?', 'Use the terms your audience would use, placed naturally. Keyword density is not a ranking factor in any meaningful sense, and stuffing makes an editor cut the release.'],
      ['Is it worth paying for a high-authority wire?', 'It depends on the announcement. For material news where you want the release indexed quickly and syndicated widely, a stronger distribution lane typically outperforms a cheaper one. For routine updates, it usually does not.'],
    ],
  },
  {
    slug: 'aeo-geo-llmo-explained',
    tag: 'AI search',
    readTime: '11 min read',
    published: { label: 'October 8, 2026', iso: '2026-10-08T08:00:00-07:00' },
    title: `AEO, GEO and LLMO Explained for PR and Comms Teams | ${site.name}`,
    description: 'The difference between answer engine optimisation, generative engine optimisation and LLM optimisation — and the concrete work each one requires from a comms team.',
    toc: [
      { id: 'definitions', label: 'The three definitions' },
      { id: 'how-answers-built', label: 'How an AI answer is built' },
      { id: 'aeo', label: 'AEO in practice' },
      { id: 'geo', label: 'GEO in practice' },
      { id: 'llmo', label: 'LLMO in practice' },
      { id: 'measure', label: 'Measuring it' },
    ],
    body: `
<p class="lede">Four acronyms arrived in comms decks at once, and most of them were used interchangeably by the end of the meeting. They are not the same thing, and the work each one requires is different.</p>

${answer('AEO (Answer Engine Optimisation) structures content to be lifted as a direct answer. GEO (Generative Engine Optimisation) makes a brand likely to be cited inside a generated response. LLMO (Large Language Model Optimisation) makes an organisation factually retrievable and correctly described by a model. They overlap in practice but target different stages of the retrieval pipeline.')}

${takeaways([
      'AEO is content formatting: answer blocks, question subheads, FAQ schema.',
      'GEO is corroboration: independent sources repeating the same facts, attributable to you.',
      'LLMO is entity hygiene: consistent naming, structured data, open crawl policy.',
      'Measure all three with share-of-answer, not traffic alone.',
    ])}

<h2 id="definitions">The three definitions</h2>
<div class="grid g-3" data-stagger>
  ${[['AEO', 'Answer Engine Optimisation', 'Optimising for the moment a system needs to produce a direct answer to a question. Formatting problem.'],
        ['GEO', 'Generative Engine Optimisation', 'Optimising for being selected and attributed inside generated output. Trust and corroboration problem.'],
        ['LLMO', 'Large Language Model Optimisation', 'Optimising what a model has learned or can retrieve about your organisation. Identity and retrieval problem.']]
        .map(([a, f, d]) => `<article class="card"><p class="eyebrow">${a}</p><h3 style="margin-top:.5rem">${f}</h3><p>${d}</p></article>`).join('')}
</div>

<h2 id="how-answers-built">How an AI answer is actually built</h2>
<p>Simplified, most assistant answers follow the same shape:</p>
<ol>
  <li><strong>Interpret the question</strong> and decide whether it needs fresh retrieval at all.</li>
  <li><strong>Retrieve candidate passages</strong> from whatever the system can access — an index, a live search, or cached pages.</li>
  <li><strong>Rank passages</strong> by relevance, authority and corroboration.</li>
  <li><strong>Generate an answer</strong>, citing sources when the product surfaces them.</li>
</ol>
<p>Your release only matters at stages 2 and 3. That is why "we published a release" is not a strategy, and why a release that cannot be retrieved, or that no independent source repeats, produces no citations.</p>

<h2 id="aeo">AEO in practice</h2>
${listCheck([
      'Open with a 40–60 word answer block that stands alone without context',
      'Write subheadings as the questions readers actually ask',
      'Pair every question subheading with a direct answer underneath',
      'Add FAQPage structured data to FAQ sections',
      'Use tables and lists for anything comparative — they survive extraction',
      'Avoid pronoun-heavy openings; name the subject explicitly',
    ])}

<h2 id="geo">GEO in practice</h2>
<p>Generative engines prefer claims they can corroborate. That is a distribution problem more than a formatting one.</p>
${listCheck([
      'Get the same core facts repeated across independent outlets, attributed to you',
      'Publish original data — benchmarks, indices, survey results — that others must cite',
      'Keep canonical URLs stable so citations do not decay into 404s',
      'Name your organisation identically everywhere, including in boilerplates',
      'Label paid placements clearly, because undisclosed ones erode the trust GEO depends on',
    ])}

<h2 id="llmo">LLMO in practice</h2>
${listCheck([
      'Publish Organization structured data with legal name, address, contacts and sameAs profiles',
      'Provide an llms.txt file summarising your organisation for retrieval systems',
      'Allow the major AI crawlers explicitly in robots.txt rather than blocking them',
      'Keep machine-readable feeds (RSS, JSON) current',
      'State facts plainly — models reproduce hedging poorly and invent less when text is precise',
    ])}

<h2 id="measure">Measuring it</h2>
<p>Traffic analytics cannot see most AI citations, because the referral is often unattributed or absent entirely. You need a direct method:</p>
<ul>
  <li>Define a fixed question set — 20 to 40 questions your buyers actually ask.</li>
  <li>Query each engine on a schedule and record whether you appear, citing which source.</li>
  <li>Score accuracy: whether the model's statements about you are correct and current.</li>
  <li>Track competitor share for the same questions, so movement is relative rather than absolute.</li>
</ul>
<p>This is what our <a href="ai-visibility.html">AI Visibility Suite</a> automates across nine engines, and the methodology is the same one you would run manually.</p>`,
    faqs: [
      ['What is the difference between AEO and GEO?', 'AEO is about formatting content so it can be extracted as a direct answer. GEO is about being chosen and attributed inside generated responses, which depends more on corroboration and authority than on formatting.'],
      ['What does LLMO stand for?', 'Large Language Model Optimisation: the practice of making an organisation factually retrievable and correctly described by language models, through consistent entity naming, structured data and open retrieval policies.'],
      ['How do I get my brand cited by ChatGPT?', 'Be retrievable and corroborated: publish structured data describing your organisation, allow AI crawlers, keep canonical URLs stable, and get independent outlets repeating the same facts about you. There is no mechanism to force a citation.'],
      ['How long until AI visibility improves?', 'Expect two to eight weeks before a change in retrievability shows up reliably in citation share, because model indexes and caches refresh on varying schedules.'],
    ],
  },
  {
    slug: 'press-release-pricing-guide',
    tag: 'Pricing',
    readTime: '8 min read',
    published: { label: 'October 4, 2026', iso: '2026-10-04T08:00:00-07:00' },
    title: `What Press Release Distribution Should Cost in 2026 | ${site.name}`,
    description: 'A breakdown of press release distribution pricing in 2026: what drives cost, what you are actually buying at each price point, and how to tell a real network from padding.',
    toc: [
      { id: 'range', label: 'The actual price range' },
      { id: 'drivers', label: 'What drives cost' },
      { id: 'tiers', label: 'What each tier buys' },
      { id: 'red-flags', label: 'Red flags' },
      { id: 'choosing', label: 'Choosing well' },
    ],
    body: `
<p class="lede">Distribution pricing in this industry spans two orders of magnitude, from free to five figures per release. The gap is not explained by quality alone — it is also explained by what is being counted.</p>

${answer('In 2026, self-serve press release distribution ranges from free tiers to roughly $1,000 per release. Low-cost platforms sit between $0 and $200, mid-market services between $150 and $500, and enterprise wires above $500 with quote-based pricing. Cost is driven by tier breadth, translation, terminal delivery, editorial depth and reporting quality.')}

${takeaways([
      'Below $200 you are buying syndication and a link, usually with minimal review.',
      'Between $150 and $500 you should expect real editorial review and usable reporting.',
      'Above $500 you are buying scale, terminals and compliance-grade process.',
      'Impressions are the least useful number on any invoice.',
    ])}

<h2 id="range">The actual price range</h2>
<div class="table-scroll">
  <table class="compare">
    <thead><tr><th scope="col">Segment</th><th scope="col">Typical price</th><th scope="col">What you generally get</th></tr></thead>
    <tbody>
      <tr><td><strong>Free / freemium</strong></td><td>$0</td><td>Syndication to a small network, little or no review, watermarks or upsells, weak reporting.</td></tr>
      <tr><td><strong>Low cost</strong></td><td>$49–$200</td><td>Broader syndication, automated review, basic pickup list. Good for routine updates.</td></tr>
      <tr><td><strong>Mid market</strong></td><td>$150–$500</td><td>Human review, tiered distribution, monitoring, backlink reporting, AI formatting.</td></tr>
      <tr><td><strong>Enterprise wire</strong></td><td>$500–$5,000+</td><td>National and international scale, terminal and analyst delivery, compliance workflows, account management.</td></tr>
    </tbody>
  </table>
</div>

<h2 id="drivers">What drives cost</h2>
<ul>
  <li><strong>Distribution breadth</strong> — the number of contracted lanes, and whether top-tier financial or broadcast lanes are included.</li>
  <li><strong>Editorial depth</strong> — automated checks cost almost nothing; a human editor with sector knowledge costs real money.</li>
  <li><strong>Translation</strong> — native-speaker PR translation is typically $80–$150 per language.</li>
  <li><strong>Terminal and analyst delivery</strong> — regulated, expensive infrastructure. This is most of the enterprise premium.</li>
  <li><strong>Reporting quality</strong> — live monitoring, sentiment and AI citation tracking carry ongoing compute and licensing costs.</li>
  <li><strong>Guarantees</strong> — if a vendor promises specific placements, you are paying for an advertising arrangement, not distribution.</li>
</ul>

<h2 id="tiers">What each tier should include</h2>
<p>If a $149 release and a $899 release both claim "national distribution", ask which lanes, how many destinations, and what is measured. The answer is usually the whole difference.</p>
${callout({ title: 'Ask this one question', text: '"List the destinations my release will be sent to, before I pay." A vendor with a real network can answer immediately. A vendor counting auto-generated domains cannot.' })}

<h2 id="red-flags">Red flags</h2>
${listCheck([
      '"Guaranteed placement" — you are buying advertising, and it should be labelled as such',
      'Destination lists that include domains you cannot find organically',
      'Impression counts with no methodology behind them',
      '"Syndicated to 300+ sites" with no follow-status reporting',
      'No named human accountable for editorial decisions',
      'Pricing only available through a sales call for a $200 product',
    ])}

<h2 id="choosing">Choosing well</h2>
<p>Run one announcement through two providers and compare the pickup maps. Cost per genuine pickup — an outlet with a real audience that carried the story — is the only comparison that holds up. Everything else is a brochure.</p>
<p>Our own pricing is published on the <a href="pricing.html">pricing page</a>, and we will happily tell you when a cheaper option is the sensible purchase for a particular announcement.</p>`,
    faqs: [
      ['How much should I pay for press release distribution?', 'For routine announcements, $100–$200 per release is a reasonable range. For material news where pickup quality matters, $300–$900 is typical if you need human review, broad tiering and usable reporting.'],
      ['Why is PR Newswire so expensive?', 'Mostly distribution infrastructure: national and international lanes, terminal and analyst delivery, compliance workflows and account management. That infrastructure is genuinely costly to operate, though it is not always what a mid-market company needs.'],
      ['Are free press release sites worth it?', 'For a low-priority announcement where the only goal is a syndicated link, sometimes. They typically offer minimal review, narrow distribution and reporting that cannot support a business case.'],
      ['What is cost per pickup?', 'Total distribution cost divided by the number of outlets with real audiences that carried the story. It is the most useful single metric for comparing providers.'],
    ],
  },
  {
    slug: 'ai-search-pr-2026',
    tag: 'Strategy',
    readTime: '9 min read',
    published: { label: 'September 29, 2026', iso: '2026-09-29T08:00:00-07:00' },
    title: `How AI Search Changed PR in 2026 | ${site.name}`,
    description: 'Fewer clicks, more summarised answers, and a new question for comms teams: if the assistant answers without linking, did your announcement land?',
    toc: [
      { id: 'shift', label: 'What shifted' },
      { id: 'clicks', label: 'The click decline' },
      { id: 'new-questions', label: 'New questions for comms' },
      { id: 'playbook', label: 'A practical playbook' },
    ],
    body: `
<p class="lede">For twenty years, the PR measurement question was whether your link got clicked. Increasingly, the answer is that there was no link and no click — the assistant simply told the user what you announced, and may or may not have named you.</p>

${answer('AI search reduced referral clicks while increasing the number of places an announcement can be repeated. Comms teams now need to optimise for attribution and accuracy inside summarised answers, not only for traffic, and to measure citation share alongside referrals.')}

${takeaways([
      'Referral traffic from search is declining for informational queries.',
      'Being named in an answer is now a distinct outcome from being clicked.',
      'Accuracy of what a model says about you is a comms responsibility, not an SEO one.',
      'Distribution breadth is the main lever for corroboration, which drives citation.',
    ])}

<h2 id="shift">What shifted</h2>
<p>Three changes arrived close enough together to be mistaken for one:</p>
<ol>
  <li><strong>Answers replaced result lists.</strong> For factual and comparative questions, a generated summary now answers without a click.</li>
  <li><strong>Retrieval replaced recall.</strong> Assistants increasingly fetch live sources rather than relying on training data, which makes current, well-structured pages matter again.</li>
  <li><strong>Attribution became inconsistent.</strong> Some engines cite sources prominently, others do not. The same question can produce a cited answer on one platform and an uncited one on another.</li>
</ol>

<h2 id="clicks">The click decline</h2>
<p>If your PR reporting still leads with sessions, it will show a decline that is not a failure of the campaign. The audience did not disappear; the interaction changed from a click to a summary.</p>
<p>That does not make referrals irrelevant — referral quality from earned coverage remains one of the strongest signals available. It means referrals are no longer a complete scoreboard.</p>

<h2 id="new-questions">New questions for comms teams</h2>
<div class="grid g-2">
  ${[['Were we named?', 'Did the assistant attribute the news to us, or describe it anonymously?'],
        ['Were we accurate?', 'Did it state the right figures, product, and organisation?'],
        ['Which source did it use?', 'Our release, a syndicated copy, or a competitor\'s coverage?'],
        ['Who was named instead?', 'If a competitor appeared in our category answer, why?']]
        .map(([t, c]) => `<article class="card"><h3 style="font-size:var(--step-0)">${t}</h3><p style="font-size:var(--step--1)">${c}</p></article>`).join('')}
</div>

<h2 id="playbook">A practical playbook</h2>
${listCheck([
      'Publish releases as clean, indexable pages with structured data — not PDFs or images of text',
      'Put a standalone answer block in the first 60 words of every release',
      'Say your organisation\'s name the way you want it repeated, every time',
      'Get the same facts into independent outlets so they can be corroborated',
      'Track a fixed question set across engines on a schedule, and record accuracy as well as presence',
      'Publish corrections quickly — a model repeating a stale error is a long-term problem',
    ])}
<p>The uncomfortable implication: PR output that exists purely to generate links is worth less than it was. PR output that establishes facts clearly, and gets them repeated, is worth more.</p>
<p>Our <a href="ai-visibility.html">AI Visibility Suite</a> applies this to every release we distribute, and the <a href="aeo-geo-llmo-explained.html">AEO, GEO and LLMO guide</a> covers the mechanics.</p>`,
    faqs: [
      ['Is PR still effective if AI answers reduce clicks?', 'Yes, but the outcome has changed. Value increasingly sits in being named and accurately described inside an answer, and in the credibility that follows, rather than in referral volume alone.'],
      ['How do I measure AI search visibility?', 'Run a fixed question set across the major engines on a schedule, then record whether your brand appears, which source was cited, and whether the statements about you are accurate.'],
      ['Should I block AI crawlers?', 'Most organisations should not, if their goal is visibility. Blocking removes you from retrieval and therefore from citations. The exception is content you monetise directly through pageviews or licensing.'],
      ['Does AI search replace traditional SEO?', 'No. The underlying signals — authority, entity clarity, structured data and corroboration — overlap heavily. What changes is the surface you are optimising for, not the fundamentals.'],
    ],
  },
];
const posts = postsRaw.map((p) => ({
  slug: p.slug,
  type: 'article',
  category: p.tag,
  readingProgress: true,
  publishedISO: p.published.iso,
  modifiedISO: p.published.iso,
  title: p.title,
  description: p.description,
  keywords: [p.tag.toLowerCase(), 'press release', 'PR strategy'],
  breadcrumbs: [{ label: 'Insights', href: 'blog.html' }, { label: p.tag }],
  priority: 0.7,
  faqs: p.faqs.map(([q, a]) => ({ q, a })),
  schema: [],
  body: `
${pageHero({
    eyebrow: `Insight · ${p.tag}`,
    h1: p.title.split('|')[0].trim(),
    lede: p.description,
    crumbItems: [{ label: 'Insights', href: 'blog.html' }, { label: p.tag }],
  })}
${articleShell({
    toc: p.toc,
    meta: articleMeta({ author: 'Stefan Ferreira', role: 'Head of Editorial, PressCosmos', published: p.published, updated: p.published, readTime: p.readTime, tag: p.tag }),
    body: p.body,
  })}
${faqSection({ items: p.faqs, title: 'Questions on this guide', eyebrow: 'Answers' })}
${ctaBand({ title: 'Put the guide into practice.', text: 'Submit a release and our editors will apply these standards to it — including telling you what they would cut.' })}`,
}));

posts.forEach((p) => { p.schema = [articleSchema(p)]; });

/* ------------------------------------------------------------- newsroom hub */
const newsroom = {
  slug: 'newsroom',
  title: `Press Release Newsroom | Latest Releases | ${site.name}`,
  description: 'The live PressCosmos newsroom: the latest distributed press releases across technology, finance, healthcare, real estate and more, updated continuously.',
  keywords: ['press release newsroom', 'latest press releases', 'news release feed'],
  breadcrumbs: [{ label: 'Newsroom' }],
  priority: 0.95,
  changefreq: 'hourly',
  body: `
${pageHero({
    eyebrow: 'Newsroom',
    badge: { text: '2,395 releases in the last 24 hours', class: 'pill-live' },
    h1: 'The live release feed.',
    lede: 'Every announcement distributed through PressCosmos lands here permanently — structured, indexable, and searchable by anyone including journalists and retrieval systems.',
    crumbItems: [{ label: 'Newsroom' }],
    actions: '<a class="btn" href="submit.html">Publish a release</a><a class="btn btn-ghost" href="rss.xml">Subscribe via RSS</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('The PressCosmos newsroom is the permanent public archive of press releases distributed through the platform. It is searchable, filterable by industry, published as structured NewsArticle pages, and available as an RSS feed for journalists, aggregators and AI retrieval systems.'),
  })}

<section class="section-tight">
  <div class="wrap" data-filter-root>
    <div class="between mb-3">
      <div class="cluster">
        <label class="visually-hidden" for="news-search">Search releases</label>
        <input class="input" id="news-search" type="search" placeholder="Search releases, companies or topics…" data-filter-search style="min-width:min(420px,80vw)">
      </div>
      <p class="mono faint"><span data-filter-count>6</span> releases shown</p>
    </div>
    <div class="chip-row mb-3" role="group" aria-label="Filter by industry">
      ${['all', 'Technology', 'Finance', 'Healthcare', 'Real Estate', 'Business', 'Product']
        .map((c, i) => `<button class="tag${i === 0 ? ' is-active' : ''}" type="button" data-filter-chip="${c}" style="cursor:pointer">${c === 'all' ? 'All industries' : c}</button>`).join('')}
    </div>
    <div class="stack" style="--flow:0">
      ${releases.map((r, i) => releaseRow({
          href: `${r.slug}.html`,
          title: r.title.split('|')[0].trim(),
          summary: r.description,
          category: r.category,
          date: { label: new Date(r.publishedISO).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }), iso: r.publishedISO },
          location: r.location,
          seed: i,
        })).join('')}
    </div>
    <p class="center muted mt-4" data-filter-empty hidden>No releases match that search. Try a broader term or browse all industries.</p>
    <p class="center mt-3"><a class="link-arrow" href="blog.html">Read the insights library instead ${icon('arrow')}</a></p>
  </div>
</section>

${section({ className: 'section-tight', body: ticker(networkChannels) })}

${section({
    eyebrow: 'Briefing',
    title: 'Distribute your own announcement here',
    body: `<div class="grid g-3">
    ${[['Publish in 42 minutes', 'Median time from approved submission to first syndicated pickup.', 'how-it-works.html'],
        ['Get cited, not just indexed', 'Every release ships with answer-engine formatting and structured data.', 'ai-visibility.html'],
        ['See where it landed', 'Live pickup map, backlink inventory and sentiment on every plan.', 'media-monitoring.html']]
        .map(([t, c, h]) => `<a class="card spotlight" href="${h}" data-reveal><h3>${t}</h3><p>${c}</p></a>`).join('')}
  </div>`,
  })}`,
};

/* ---------------------------------------------------------------- blog hub */
const blog = {
  slug: 'blog',
  title: `Insights & Guides on PR, SEO and AI Visibility | ${site.name}`,
  description: 'Practical guides on press release writing, SEO PR, AI answer-engine visibility and distribution pricing — written by the editors who review releases every day.',
  keywords: ['PR insights', 'press release guide', 'AI visibility guide', 'PR blog'],
  breadcrumbs: [{ label: 'Insights' }],
  priority: 0.85,
  body: `
${pageHero({
    eyebrow: 'Insights',
    h1: 'Guides written by the people who review the releases.',
    lede: 'No thought-leadership filler. Each guide is written or reviewed by a PressCosmos editor and reflects what we actually do when a release crosses our desk.',
    crumbItems: [{ label: 'Insights' }],
    actions: '<a class="btn" href="resources.html">Browse the resource library</a><a class="btn btn-ghost" href="rss.xml">RSS feed</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('The PressCosmos insights library publishes practical guides on press release writing, SEO PR, AI answer-engine optimisation (AEO, GEO, LLMO), distribution pricing and media measurement. All guides are maintained and updated by our editorial team.'),
  })}

${section({
    body: `<div class="card-grid">
    ${posts.map((p, i) => storyCard({
      href: `${p.slug}.html`,
      title: p.title.split('|')[0].trim(),
      excerpt: p.description,
      category: p.tag,
      date: { label: new Date(p.publishedISO).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }), iso: p.publishedISO },
      readTime: p.readTime,
      seed: i + 2,
    })).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Coming up',
    title: 'In the editorial queue',
    body: `<div class="grid g-3">
    ${['Building a media list that reporters do not delete', 'Press release measurement: what to put in a board deck', 'Multi-market launches without translating badly into six languages']
        .map((t, i) => `<article class="card" data-reveal>
      <p class="mono faint">Draft · ${['November 2026', 'November 2026', 'December 2026'][i]}</p>
      <h3 style="margin-top:.5rem;font-size:var(--step-0)">${t}</h3>
    </article>`).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Ready to apply it to a real announcement?', text: 'Submit a release and our editors will review it against the standards in these guides.' })}`,
};

export const newsPages = [newsroom, blog, ...posts, ...releases];
