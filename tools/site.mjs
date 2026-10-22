// PressCosmos — central site configuration and shared content data.
// Every page is rendered from this data by tools/build.mjs, so navigation,
// footer, SEO defaults and structured data stay consistent site-wide.

export const site = {
  name: 'PressCosmos',
  legalName: 'PressCosmos Media Network',
  tagline: 'Your story, across every cosmos of media.',
  domain: 'presscosmos.com',
  baseUrl: 'https://presscosmos.com',
  // GitHub Pages preview base (project site lives under a sub-path).
  previewUrl: 'https://nirajkate2023-prog.github.io/presscosmos',
  email: 'hello@presscosmos.com',
  pressEmail: 'newsroom@presscosmos.com',
  supportEmail: 'support@presscosmos.com',
  phone: '+1 (415) 555-0142',
  founded: '2026',
  address: {
    street: '2261 Market Street, Suite 4800',
    city: 'San Francisco',
    region: 'CA',
    postalCode: '94114',
    country: 'US',
  },
  social: {
    x: 'https://x.com/presscosmos',
    linkedin: 'https://www.linkedin.com/company/presscosmos',
    youtube: 'https://www.youtube.com/@presscosmos',
    instagram: 'https://www.instagram.com/presscosmos',
  },
  defaultOgImage: '/assets/img/og-image.png',
  locale: 'en_US',
  language: 'en',
  buildDate: new Date().toISOString().slice(0, 10),
};

export const stats = [
  { value: 2400, suffix: '+', label: 'Media destinations' },
  { value: 68, suffix: '', label: 'Countries syndicated' },
  { value: 42, suffix: 'min', label: 'Median time to publish' },
  { value: 98, suffix: '%', label: 'Copy approval rate' },
];

export const networkChannels = [
  'Global Financial Newswires',
  'Technology & Startup Media',
  'Regional Daily Press',
  'Trade & Industry Journals',
  'Broadcast & Podcast Desks',
  'AI Answer Engines',
  'News Aggregators',
  'Business Journals',
  'Healthcare Trade Press',
  'Real Estate Journals',
  'Higher-Education Media',
  'Travel & Hospitality Titles',
  'Automotive Trade Media',
  'Legal & Compliance Press',
  'Retail Sector Analysts',
  'Municipal & Civic Desks',
];

export const services = [
  {
    slug: 'distribution',
    href: 'distribution.html',
    name: 'Newswire Distribution',
    short: 'Distribution',
    icon: 'send',
    summary:
      'Tiered newswire delivery to 2,400+ media destinations, trade desks and aggregators, with translation, targeting and pickup reporting.',
    bullets: [
      'Tier 1 to Tier 4 distribution ladders',
      'Country, state and metro-level targeting',
      '24 languages including RTL scripts',
      'Multimedia embeds and PDF media kits',
    ],
  },
  {
    slug: 'ai-visibility',
    href: 'ai-visibility.html',
    name: 'AI Visibility Suite',
    short: 'AI visibility',
    icon: 'sparkle',
    summary:
      'AEO, GEO and LLMO engineering so your announcement is quotable by ChatGPT, Claude, Gemini, Perplexity and AI Overviews — not just indexed by search.',
    bullets: [
      'Entity and knowledge-graph optimisation',
      'Answer-engine formatted release blocks',
      'llms.txt and machine-readable syndication',
      'Share-of-answer tracking across 9 AI engines',
    ],
  },
  {
    slug: 'media-monitoring',
    href: 'media-monitoring.html',
    name: 'Media Monitoring',
    short: 'Monitoring',
    icon: 'radar',
    summary:
      'Real-time pickup tracking across 180,000+ sources with sentiment scoring, journalist alerts and competitive share-of-voice.',
    bullets: [
      'Live pickup map and coverage feed',
      'Sentiment and tone scoring',
      'Journalist and outlet alerts',
      'Competitor share-of-voice',
    ],
  },
  {
    slug: 'analytics',
    href: 'analytics.html',
    name: 'Analytics & Attribution',
    short: 'Analytics',
    icon: 'chart',
    summary:
      'Prove PR impact with referral traffic, backlink quality, AI citation share and revenue attribution in one dashboard.',
    bullets: [
      'Referral and backlink equity reporting',
      'AI citation and share-of-answer metrics',
      'Pipeline and revenue attribution',
      'Board-ready PDF exports',
    ],
  },
  {
    slug: 'newsroom-hosting',
    href: 'newsroom-hosting.html',
    name: 'Branded Newsroom',
    short: 'Newsroom',
    icon: 'building',
    summary:
      'A hosted, indexable newsroom on your own domain so every announcement compounds authority instead of scattering across the web.',
    bullets: [
      'Custom domain and full brand control',
      'NewsArticle and Organization schema',
      'Journalist resources and media assets',
      'Auto-generated RSS and JSON feeds',
    ],
  },
  {
    slug: 'seo-pr',
    href: 'seo-pr.html',
    name: 'SEO PR',
    short: 'SEO PR',
    icon: 'search',
    summary:
      'Keyword-mapped headlines, entity-rich body copy and contextual backlinks that earn rankings without reading like advertising.',
    bullets: [
      'Search-intent mapped headlines',
      'Natural anchor distribution',
      'Editorial review for spam compliance',
      'Rank tracking for target terms',
    ],
  },
  {
    slug: 'crisis-communications',
    href: 'crisis-communications.html',
    name: 'Crisis Communications',
    short: 'Crisis comms',
    icon: 'shield',
    summary:
      'Rapid-response statement distribution with 24/7 standby editors, holding statements and coordinated regional rollout.',
    bullets: [
      '60-minute emergency publishing lane',
      'Standby editor on every plan tier',
      'Holding statement templates',
      'Follow-up correction distribution',
    ],
  },
  {
    slug: 'investor-relations',
    href: 'investor-relations.html',
    name: 'Investor Relations',
    short: 'IR',
    icon: 'trend',
    summary:
      'Regulation-aware earnings, funding and material-news distribution built for analyst desks and financial data terminals.',
    bullets: [
      'Earnings window scheduling',
      'Analyst and terminal delivery',
      'Multilingual regulatory variants',
      'Quiet-period controls and approvals',
    ],
  },
];

export const industries = [
  {
    slug: 'technology',
    name: 'Technology',
    h1: 'Press release distribution for technology companies',
    intent: 'product launches, funding rounds and platform announcements',
    stat: '11,400+ tech desks and newsletters in network',
    keywords: ['AI', 'developer tools', 'cloud', 'cybersecurity', 'semiconductors'],
  },
  {
    slug: 'saas',
    name: 'SaaS & B2B Software',
    h1: 'Press release distribution for SaaS and B2B software brands',
    intent: 'feature releases, integrations, ARR milestones and category positioning',
    stat: '3,900+ B2B review sites and analyst blogs in network',
    keywords: ['product-led growth', 'integrations', 'enterprise software', 'ARR milestones'],
  },
  {
    slug: 'finance',
    name: 'Finance & Banking',
    h1: 'Press release distribution for finance and banking',
    intent: 'earnings, funding, appointments and regulatory announcements',
    stat: 'Terminal and analyst-desk delivery across 41 markets',
    keywords: ['earnings', 'fintech', 'capital markets', 'compliance'],
  },
  {
    slug: 'crypto-web3',
    name: 'Crypto & Web3',
    h1: 'Press release distribution for crypto and Web3 projects',
    intent: 'token listings, protocol upgrades, partnerships and exchange news',
    stat: '480+ crypto-native outlets and market-data feeds',
    keywords: ['token listings', 'DeFi', 'protocol upgrades', 'custody'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare & Life Sciences',
    h1: 'Press release distribution for healthcare and life sciences',
    intent: 'clinical milestones, device clearances, partnerships and research',
    stat: '2,100+ clinical, pharma and health-policy outlets',
    keywords: ['clinical trials', 'medtech', 'biotech', 'health policy'],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate & Property',
    h1: 'Press release distribution for real estate and property',
    intent: 'project launches, acquisitions, market reports and executive hires',
    stat: 'Metro and regional property desks in 900+ cities',
    keywords: ['development', 'acquisitions', 'market reports', 'proptech'],
  },
  {
    slug: 'education',
    name: 'Education & EdTech',
    h1: 'Press release distribution for education and edtech',
    intent: 'enrolment news, research findings, partnerships and campus projects',
    stat: '1,700+ higher-education and edtech publications',
    keywords: ['edtech', 'research', 'accreditation', 'student outcomes'],
  },
  {
    slug: 'travel-hospitality',
    name: 'Travel & Hospitality',
    h1: 'Press release distribution for travel and hospitality',
    intent: 'openings, route launches, awards and destination campaigns',
    stat: '1,250+ travel trade and consumer titles',
    keywords: ['openings', 'tourism boards', 'airlines', 'hotel groups'],
  },
  {
    slug: 'automotive',
    name: 'Automotive & Mobility',
    h1: 'Press release distribution for automotive and mobility',
    intent: 'model launches, EV programmes, supplier deals and fleet news',
    stat: '860+ automotive trade and enthusiast outlets',
    keywords: ['EV', 'mobility', 'aftermarket', 'fleet'],
  },
  {
    slug: 'entertainment',
    name: 'Entertainment & Media',
    h1: 'Press release distribution for entertainment and media',
    intent: 'releases, tours, festivals, streaming premieres and talent news',
    stat: '2,600+ entertainment, music and streaming outlets',
    keywords: ['premieres', 'touring', 'streaming', 'festivals'],
  },
  {
    slug: 'legal-professional-services',
    name: 'Legal & Professional Services',
    h1: 'Press release distribution for legal and professional services',
    intent: 'firm news, verdicts, hires, pro bono work and thought leadership',
    stat: '740+ legal trade and business-of-law outlets',
    keywords: ['litigation', 'firm growth', 'compliance', 'attorney hires'],
  },
  {
    slug: 'ecommerce-retail',
    name: 'E-commerce & Retail',
    h1: 'Press release distribution for e-commerce and retail',
    intent: 'store openings, product drops, funding and seasonal campaigns',
    stat: '1,900+ retail trade, DTC and consumer desks',
    keywords: ['DTC', 'store openings', 'marketplaces', 'seasonal campaigns'],
  },
];

export const plans = [
  {
    slug: 'launch',
    name: 'Launch',
    price: 149,
    unit: 'per release',
    tagline: 'For a single announcement that needs to land properly.',
    popular: false,
    features: [
      'Tier 2 regional + trade distribution',
      'AI answer-engine formatting (AEO/GEO/LLMO)',
      '1 image or video embed',
      'Basic pickup report',
      'Editorial review in 4 business hours',
      'Permanent hosted release page',
    ],
  },
  {
    slug: 'amplify',
    name: 'Amplify',
    price: 349,
    unit: 'per release',
    tagline: 'The plan most teams run for a full announcement cycle.',
    popular: true,
    features: [
      'Tier 1 national + international distribution',
      'Full AI Visibility Suite with share-of-answer tracking',
      'Unlimited multimedia and PDF media kit',
      '24-language translation credits (3 languages)',
      'Live pickup map, sentiment and backlink report',
      'Priority editorial review in 60 minutes',
      'Dedicated account manager',
    ],
  },
  {
    slug: 'newsmaker',
    name: 'Newsmaker',
    price: 899,
    unit: 'per release',
    tagline: 'Maximum reach for material news, launches and funding rounds.',
    popular: false,
    features: [
      'Everything in Amplify',
      'Terminal, analyst-desk and broadcast wire delivery',
      'Guaranteed top-tier placement lanes',
      '10-language syndication bundle',
      'Journalist outreach and pitch drafting',
      'Real-time monitoring alerts and crisis lane access',
      'Same-day strategy session with a PR lead',
    ],
  },
  {
    slug: 'studio',
    name: 'Studio',
    price: 1990,
    unit: 'per month',
    tagline: 'Ongoing newsroom operations for teams shipping news weekly.',
    popular: false,
    features: [
      'Up to 12 releases per month',
      'Branded custom newsroom on your domain',
      'Dedicated editorial and SEO strategist',
      'Quarterly share-of-answer and AI citation audit',
      'Agency multi-client workspace',
      'API access and Zapier automation',
      'Priority crisis lane, 24/7 standby',
    ],
  },
];

export const audienceSegments = [
  {
    slug: 'startups',
    name: 'Startups & Founders',
    href: 'startups.html',
    summary: 'Launch narratively, not just loudly. Funding, product and hiring news on a startup budget.',
  },
  {
    slug: 'agencies',
    name: 'PR Agencies',
    href: 'agencies.html',
    summary: 'White-label distribution, multi-client workspaces and reporting you can put your logo on.',
  },
  {
    slug: 'enterprise',
    name: 'Enterprise & Public Companies',
    href: 'enterprise.html',
    summary: 'Approval workflows, quiet periods, regulation-aware lanes and audit-ready records.',
  },
  {
    slug: 'investor-relations',
    name: 'Investor Relations Teams',
    href: 'investor-relations.html',
    summary: 'Earnings, material news and analyst-desk delivery on a predictable calendar.',
  },
];

export const testimonials = [
  {
    quote:
      'We ran the same funding announcement through two wires. PressCosmos got us quoted inside AI answers within 48 hours, which the other service never did.',
    name: 'Priya Raghunathan',
    role: 'Head of Communications',
    company: 'Northwind Robotics',
  },
  {
    quote:
      'The pickup map alone changed how we plan launches. We can see which metros actually care before we spend on the next one.',
    name: 'Daniel Okonkwo',
    role: 'VP Marketing',
    company: 'Ledgerline Financial',
  },
  {
    quote:
      'Editorial review is fast without being sloppy. They caught a compliance issue our legal team had missed.',
    name: 'Marta Alvés',
    role: 'Director of Investor Relations',
    company: 'Halcyon Therapeutics',
  },
  {
    quote:
      'As an agency we run 40 client releases a quarter through PressCosmos. The white-label reporting sold our retainer renewal on its own.',
    name: 'Tom Beaudry',
    role: 'Partner',
    company: 'Signal & Co.',
  },
  {
    quote:
      'Our newsroom on our own domain finally ranks for our category terms. It stopped being a press page and started being an asset.',
    name: 'Aisha Karim',
    role: 'Brand Director',
    company: 'Verso Living',
  },
  {
    quote:
      'Crisis lane published a holding statement for us at 2am. That response time is worth the plan on its own.',
    name: 'Greg Lindqvist',
    role: 'General Counsel',
    company: 'Arcline Logistics',
  },
];

export const faqs = {
  general: [
    {
      q: 'What is PressCosmos?',
      a: 'PressCosmos is a press release distribution and AI visibility platform. You write or upload an announcement, our editors review it, and we syndicate it to newswire partners, trade media, regional press and AI answer engines while tracking every pickup, backlink and AI citation you earn.',
    },
    {
      q: 'How is PressCosmos different from a traditional newswire?',
      a: 'Traditional wires optimise for a press release existing on the internet. PressCosmos optimises for your announcement being found, quoted and repeated — by journalists, by search engines and by AI assistants. Every release ships with answer-engine formatting, structured data and entity markup by default.',
    },
    {
      q: 'How long does it take to get published?',
      a: 'Median time from approved submission to first live pickup is 42 minutes on Amplify and Newsmaker plans. Launch plan releases go live within four business hours, and the crisis lane publishes in under 60 minutes at any hour.',
    },
    {
      q: 'Do you review press releases before publishing?',
      a: 'Yes. Every release passes a human editorial review for accuracy, newsworthiness, disclosure requirements and formatting. We approve 98% of submissions, usually with suggested improvements rather than rejections.',
    },
    {
      q: 'Can I distribute in multiple languages?',
      a: 'PressCosmos supports 24 languages including Arabic, Hebrew and Hindi in right-to-left and complex scripts. Translation is handled by specialist PR translators, not generic engines, and each language variant gets its own indexable page.',
    },
    {
      q: 'Is there a free option?',
      a: 'We offer a free review and a limited free tier for qualifying non-profits, student projects and public-interest announcements. Paid plans start at $149 per release with no subscription required.',
    },
    {
      q: 'What reporting do I get?',
      a: 'Every plan includes a hosted analytics dashboard with a live pickup map, syndicated URL list, backlink inventory, referral traffic, sentiment scoring and — on Amplify and above — AI share-of-answer tracking across nine answer engines.',
    },
    {
      q: 'Do you guarantee placement?',
      a: 'We guarantee delivery to our contracted network lanes and we publish a live pickup log for every release. We do not guarantee that an individual journalist will write about you, because no ethical distributor can honestly promise editorial coverage.',
    },
  ],
  pricing: [
    {
      q: 'Do I need a subscription?',
      a: 'No. Launch, Amplify and Newsmaker are pay-per-release with no recurring commitment. Studio is an optional monthly plan for teams publishing regularly.',
    },
    {
      q: 'What happens if my release is rejected?',
      a: 'You receive a credit for the full amount and a written explanation with suggestions for making the announcement publishable. Rejections are rare and almost always about missing disclosure or unverifiable claims.',
    },
    {
      q: 'Can I upgrade mid-campaign?',
      a: 'Yes. Upgrades apply instantly to any release not yet published, and the difference is prorated. Published releases cannot be retroactively upgraded because the syndication has already happened.',
    },
    {
      q: 'Do you offer agency or volume pricing?',
      a: 'Yes. Agencies distributing ten or more releases per month, and any organisation running a Studio plan, get volume pricing starting at 22% below list. Contact our sales team for a workspace quote.',
    },
  ],
  ai: [
    {
      q: 'What do AEO, GEO and LLMO actually mean?',
      a: 'AEO is Answer Engine Optimisation — structuring content so it can be lifted as a direct answer. GEO is Generative Engine Optimisation — being cited inside AI-generated responses. LLMO is Large Language Model Optimisation — making your brand factually retrievable and correctly described by models. PressCosmos applies all three to every release.',
    },
    {
      q: 'How do you get a press release cited by AI assistants?',
      a: 'We publish each release as clean semantic HTML with NewsArticle and Organization structured data, a plain-language summary block, stable canonical URLs and machine-readable feeds, then allow the major AI crawlers in robots.txt. Combined, those signals make your announcement retrievable, quotable and attributable.',
    },
    {
      q: 'Which AI engines do you track?',
      a: 'ChatGPT, Claude, Gemini, Perplexity, Copilot, Google AI Overviews, Meta AI, Grok and You.com. Share-of-answer tracking reports how often and how accurately your brand appears in responses for your tracked question set.',
    },
    {
      q: 'Does AI visibility replace traditional SEO?',
      a: 'No, it compounds it. Search rankings and AI citations draw on overlapping signals: authority, entity clarity, structured data and third-party corroboration. A press release strategy serves both at once.',
    },
  ],
  distribution: [
    {
      q: 'Which outlets will my release reach?',
      a: 'Delivery depends on your plan tier, industry and geography. Our network spans financial newswires, technology and trade media, regional dailies, broadcast desks, aggregators and AI answer engines. Every release includes a published list of the destinations it was delivered to.',
    },
    {
      q: 'Can I target specific countries or cities?',
      a: 'Yes. Targeting can be set by country, region, state or metro area, and combined with industry verticals. Localised targeting typically lifts regional pickup rates by 30-60% over untargeted distribution.',
    },
    {
      q: 'How long does my release stay online?',
      a: 'Hosted release pages are permanent and never expire, and syndicated copies live as long as the receiving outlet keeps them published. We never delete a release from our own index.',
    },
    {
      q: 'Can I add corrections or updates?',
      a: 'Yes. Corrections are published as clearly labelled updates with a visible revision note and updated timestamp, preserving the original record so journalists see exactly what changed and when.',
    },
  ],
};

export const legalPages = [
  { slug: 'privacy', name: 'Privacy Policy' },
  { slug: 'terms', name: 'Terms of Service' },
  { slug: 'cookies', name: 'Cookie Policy' },
  { slug: 'gdpr', name: 'GDPR & Data Processing' },
  { slug: 'dmca', name: 'Copyright & DMCA' },
  { slug: 'refunds', name: 'Refund & Cancellation Policy' },
  { slug: 'editorial-guidelines', name: 'Editorial Guidelines' },
  { slug: 'accessibility', name: 'Accessibility Statement' },
];

export const primaryNav = [
  {
    label: 'Services',
    href: 'services.html',
    children: [
      { label: 'Distribution', href: 'distribution.html' },
      { label: 'AI Visibility Suite', href: 'ai-visibility.html' },
      { label: 'Media Monitoring', href: 'media-monitoring.html' },
      { label: 'Analytics & Attribution', href: 'analytics.html' },
      { label: 'Branded Newsroom', href: 'newsroom-hosting.html' },
      { label: 'SEO PR', href: 'seo-pr.html' },
      { label: 'Crisis Communications', href: 'crisis-communications.html' },
      { label: 'Investor Relations', href: 'investor-relations.html' },
    ],
  },
  {
    label: 'Industries',
    href: 'industries.html',
    children: industries.map((i) => ({ label: i.name, href: `${i.slug}.html` })),
  },
  { label: 'Pricing', href: 'pricing.html' },
  {
    label: 'Newsroom',
    href: 'newsroom.html',
    children: [
      { label: 'Latest Releases', href: 'newsroom.html' },
      { label: 'Insights & Guides', href: 'blog.html' },
      { label: 'Case Studies', href: 'case-studies.html' },
      { label: 'Testimonials', href: 'testimonials.html' },
    ],
  },
  {
    label: 'Resources',
    href: 'resources.html',
    children: [
      { label: 'How It Works', href: 'how-it-works.html' },
      { label: 'Compare Platforms', href: 'compare.html' },
      { label: 'Resource Library', href: 'resources.html' },
      { label: 'Press Release Glossary', href: 'glossary.html' },
      { label: 'FAQ', href: 'faq.html' },
    ],
  },
  {
    label: 'Company',
    href: 'about.html',
    children: [
      { label: 'About PressCosmos', href: 'about.html' },
      { label: 'For Startups', href: 'startups.html' },
      { label: 'For PR Agencies', href: 'agencies.html' },
      { label: 'For Enterprise', href: 'enterprise.html' },
      { label: 'Partners', href: 'partners.html' },
      { label: 'Careers', href: 'careers.html' },
      { label: 'Contact', href: 'contact.html' },
    ],
  },
];

export const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'Distribution', href: 'distribution.html' },
      { label: 'AI Visibility Suite', href: 'ai-visibility.html' },
      { label: 'Media Monitoring', href: 'media-monitoring.html' },
      { label: 'Analytics & Attribution', href: 'analytics.html' },
      { label: 'Branded Newsroom', href: 'newsroom-hosting.html' },
      { label: 'SEO PR', href: 'seo-pr.html' },
      { label: 'Crisis Communications', href: 'crisis-communications.html' },
      { label: 'Investor Relations', href: 'investor-relations.html' },
      { label: 'Pricing', href: 'pricing.html' },
      { label: 'Submit a Release', href: 'submit.html' },
    ],
  },
  {
    title: 'Industries',
    links: industries.map((i) => ({ label: i.name, href: `${i.slug}.html` })),
  },
  {
    title: 'Resources',
    links: [
      { label: 'How It Works', href: 'how-it-works.html' },
      { label: 'Compare Platforms', href: 'compare.html' },
      { label: 'Resource Library', href: 'resources.html' },
      { label: 'Insights & Guides', href: 'blog.html' },
      { label: 'Case Studies', href: 'case-studies.html' },
      { label: 'Press Release Glossary', href: 'glossary.html' },
      { label: 'FAQ', href: 'faq.html' },
      { label: 'Sitemap', href: 'sitemap.html' },
      { label: 'RSS Feed', href: 'rss.xml' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: 'about.html' },
      { label: 'For Startups', href: 'startups.html' },
      { label: 'For PR Agencies', href: 'agencies.html' },
      { label: 'For Enterprise', href: 'enterprise.html' },
      { label: 'Partners', href: 'partners.html' },
      { label: 'Careers', href: 'careers.html' },
      { label: 'Contact', href: 'contact.html' },
      { label: 'For Journalists', href: 'journalists.html' },
    ],
  },
  {
    title: 'Legal',
    links: legalPages.map((p) => ({ label: p.name, href: `${p.slug}.html` })),
  },
];
