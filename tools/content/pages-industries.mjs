// PressCosmos — industry vertical pages.
// Each vertical has its own media list, reviewer specialism, story angles and
// FAQ set, so no two of these pages read as a template fill.

import { site, industries, faqs } from '../site.mjs';
import { icon, section, card, pageHero, answer, faqSection, ctaBand, listCheck, takeaways } from '../ui.mjs';

const meta = {
  technology: {
    angles: [
      ['Product and platform launches', 'Feature releases, GA dates, architecture changes and developer tooling.'],
      ['Funding and M&A', 'Rounds, acquisitions and strategic partnerships, with the numbers a tech desk expects.'],
      ['Research and benchmarks', 'Original data, model evaluations and performance studies that reporters can cite.'],
    ],
    releases: ['Product launches', 'Funding rounds', 'Open-source releases', 'Security advisories', 'Developer conferences', 'Research papers', 'Executive hires', 'Acquisition announcements'],
    desks: '11,400+',
    faq: [
      ['How do I announce a product launch without it reading like an ad?', 'Lead with what changed and for whom, in the first sentence. Include a specific number — adoption, speed, price or capacity. Our editor will push back on anything that opens with "excited to announce".'],
      ['Do you distribute developer-focused announcements?', 'Yes, including open-source releases, SDK updates and security advisories. Security advisories can be routed on an accelerated lane when coordinated disclosure timing matters.'],
      ['Can you handle embargoes for a launch?', 'Yes. Set the embargo to an exact minute and timezone, and the release holds across every lane until that moment.'],
      ['What about a funding round with disclosure restrictions?', 'We support approved language, staged reveals and jurisdiction-specific variants. Send us the constraints and the editor will build the release within them.'],
    ],
  },
  saas: {
    angles: [
      ['Feature and integration releases', 'What shipped, who asked for it and what it unblocks for customers.'],
      ['Milestones worth reporting', 'ARR thresholds, customer counts, category placements and uptime commitments.'],
      ['Analyst and category positioning', 'Reports, category definitions and comparisons where you have a defensible claim.'],
    ],
    releases: ['Feature launches', 'Integrations', 'Funding rounds', 'ARR milestones', 'Security certifications', 'Customer stories', 'Leadership hires', 'Category reports'],
    desks: '3,900+',
    faq: [
      ['Do B2B software releases get picked up?', 'Yes, when they contain something measurable. "Integration now available" rarely travels. "Cuts onboarding from nine days to four for 1,200 customers" does.'],
      ['Can you target review sites and analyst blogs?', 'Our SaaS route includes B2B review platforms and analyst blogs alongside trade press, which is where a lot of B2B discovery actually happens.'],
      ['Should we announce every feature release?', 'No. Announce the ones that change a category, a price, or a customer\'s ability to do something they could not do before. Weekly minor releases dilute the signal.'],
      ['How do you handle competitive claims?', 'We will publish verifiable comparisons and reject unverifiable ones. Comparatives that name a competitor require documented sources.'],
    ],
  },
  finance: {
    angles: [
      ['Earnings and results', 'Quarterly and annual results with the comparison basis stated clearly.'],
      ['Funding and capital events', 'Rounds, facilities, listings and credit arrangements.'],
      ['Appointments and governance', 'Board changes, executive hires and regulatory approvals.'],
    ],
    releases: ['Earnings releases', 'Funding announcements', 'Acquisitions', 'Board appointments', 'Product launches', 'Regulatory approvals', 'Market research', 'Partnership announcements'],
    desks: '41 markets',
    faq: [
      ['Can you distribute material financial news?', 'Yes, with terminal and analyst-desk delivery, quiet-period controls and an immutable distribution log. See our investor relations page.'],
      ['How do you handle regulated disclosures?', 'Releases go through a review path that mirrors your approval chain, with read receipts and append-only records for compliance.'],
      ['Do you support multiple jurisdictions?', 'Yes. Region-specific language and disclosure formatting is available across 41 markets with financial translators.'],
      ['What about embargoes ahead of market open?', 'Standard practice here. Embargo to an exact minute and timezone, with synchronised release across all lanes to avoid selective disclosure issues.'],
    ],
  },
  'crypto-web3': {
    angles: [
      ['Listings and market structure', 'Exchange listings, custody arrangements and liquidity programmes.'],
      ['Protocol and network updates', 'Upgrades, audits, governance votes and mainnet milestones.'],
      ['Compliance and institutional adoption', 'Licences, regulated products and enterprise integrations.'],
    ],
    releases: ['Token listings', 'Protocol upgrades', 'Audit completions', 'Exchange partnerships', 'Regulatory licences', 'Treasury reports', 'Governance outcomes', 'Ecosystem grants'],
    desks: '480+',
    faq: [
      ['Do you accept token announcements?', 'We accept substantive protocol, listing, audit and compliance news. We reject price predictions, pump messaging and any release implying guaranteed returns.'],
      ['How fast can a listing announcement go out?', 'Our crypto lane publishes in a median of 35 minutes after approval, because listing news is time-sensitive.'],
      ['Do you require disclosure of treasury and insider positions?', 'Yes for material announcements. If insiders hold positions that a reader would reasonably consider relevant, the release states it.'],
      ['Can you reach market-data feeds?', 'Yes, crypto market-data and aggregator feeds are part of the crypto route in addition to editorial outlets.'],
    ],
  },
  healthcare: {
    angles: [
      ['Clinical and regulatory milestones', 'Trial results, clearances, approvals and enrolment updates.'],
      ['Research findings', 'Peer-reviewed studies, real-world evidence and health-economics data.'],
      ['Access and partnership news', 'Payer arrangements, distribution deals and access programmes.'],
    ],
    releases: ['Clinical trial milestones', 'Regulatory clearances', 'Study publications', 'Payer agreements', 'Device launches', 'Appointments', 'Access programmes', 'Manufacturing expansions'],
    desks: '2,100+',
    faq: [
      ['What claim substantiation do you require?', 'Every efficacy or safety claim needs a cited source — trial identifier, publication or regulatory reference. Unsubstantiated health claims are rejected outright.'],
      ['Can you distribute before a peer-reviewed publication?', 'Yes, with a preprint or registry reference and clear labelling of the evidence stage. We will not present preliminary data as established fact.'],
      ['Do you handle prescription product communications?', 'We support them with fair-balance language and required safety information, subject to your regulatory review process.'],
      ['Which health media are in the network?', 'Clinical and pharma trade press, health-policy outlets, medical society publications, patient-advocacy media and general health desks.'],
    ],
  },
  'real-estate': {
    angles: [
      ['Developments and openings', 'Groundbreakings, completions, leasing milestones and amenity news.'],
      ['Transactions', 'Acquisitions, dispositions, joint ventures and financing.'],
      ['Market data', 'Rent, occupancy, pricing and supply research reporters will cite.'],
    ],
    releases: ['Development launches', 'Groundbreakings', 'Completions', 'Acquisitions', 'Leasing milestones', 'Market reports', 'Executive hires', 'Financing rounds'],
    desks: '900+ cities',
    faq: [
      ['Can I target a single metro area?', 'Yes, down to metro level, which is usually the difference between a pickup and silence for a local development story.'],
      ['Do you distribute market research reports?', 'Yes, and they usually perform best. Original rent, occupancy or pricing data gives a reporter a reason to cite you by name.'],
      ['Should I include renderings?', 'Yes. Image assets increase pickup materially for property news. We support galleries and PDF media kits.'],
      ['How do you handle projects that are not yet approved?', 'We publish pipeline news with clear status labelling. Anything implying approval that has not been granted is rejected.'],
    ],
  },
  education: {
    angles: [
      ['Research and outcomes', 'Studies, enrolment data and outcome measurements.'],
      ['Programmes and partnerships', 'New degrees, industry partnerships and accreditation news.'],
      ['Campus and infrastructure', 'Facilities, funding and capital projects.'],
    ],
    releases: ['Research findings', 'Programme launches', 'Accreditation news', 'Partnerships', 'Enrolment data', 'Campus developments', 'Appointments', 'Grant awards'],
    desks: '1,700+',
    faq: [
      ['Do you distribute education research effectively?', 'Yes, when the finding is stated plainly in the first paragraph. Education desks and policy reporters look for effect sizes and sample sizes, not institutional praise.'],
      ['Can students or non-profits use PressCosmos?', 'Yes. We offer discounted and free distribution for qualifying student projects and public-interest research announcements.'],
      ['How do you handle accreditation claims?', 'Accreditation statements require the accrediting body and date. We do not publish vague claims of "accredited" status.'],
      ['Which education outlets are covered?', 'Higher-education press, edtech trade media, policy think tanks, regional press around campus locations and student media networks.'],
    ],
  },
  'travel-hospitality': {
    angles: [
      ['Openings and route news', 'Hotel, restaurant and airline route launches with dates and pricing.'],
      ['Awards and rankings', 'Recognitions that a trade desk would actually report.'],
      ['Destination campaigns', 'Seasonal programmes, events and tourism board initiatives.'],
    ],
    releases: ['Hotel openings', 'Route launches', 'Restaurant openings', 'Awards', 'Destination campaigns', 'Partnerships', 'Renovations', 'Executive hires'],
    desks: '1,250+',
    faq: [
      ['When is the best time to send travel news?', 'Tuesday to Thursday, early morning in the target market. Travel trade desks plan seasonally, so lead times of six to eight weeks outperform last-minute sends.'],
      ['Can you distribute to trade press rather than consumers?', 'Yes, and for most travel businesses the trade route produces better-qualified coverage than consumer lifestyle desks.'],
      ['Do you handle multi-market launches?', 'Yes — coordinated release across regions with localised copy in the relevant language, rather than one English release sent everywhere.'],
      ['Are images required?', 'Not required, but travel pickup rates roughly double when a quality image set is attached.'],
    ],
  },
  automotive: {
    angles: [
      ['Model and product news', 'Launches, trims, pricing and specification announcements.'],
      ['Electrification programmes', 'EV platforms, charging networks and battery partnerships.'],
      ['Supplier and fleet news', 'Contract wins, manufacturing investment and commercial fleet deals.'],
    ],
    releases: ['Model launches', 'EV programmes', 'Supplier contracts', 'Manufacturing investment', 'Fleet deals', 'Motorsport partnerships', 'Recalls', 'Executive appointments'],
    desks: '860+',
    faq: [
      ['Do you distribute to enthusiast and trade media separately?', 'Yes. Enthusiast outlets want specifications and performance; trade desks want volume, margin and manufacturing implications. The same release rarely satisfies both.'],
      ['How are recall communications handled?', 'On an accelerated lane with the regulatory reference and affected population stated. Recall notices must meet disclosure requirements before distribution.'],
      ['Can suppliers distribute contract wins?', 'Yes. Include contract value or volume where disclosable, plus the customer name if permitted.'],
      ['Is motorsport news in scope?', 'Yes, including team partnerships, technical regulations commentary and driver announcements.'],
    ],
  },
  entertainment: {
    angles: [
      ['Releases and premieres', 'Albums, films, series and launch dates.'],
      ['Touring and events', 'Dates, venues, festivals and ticket information.'],
      ['Talent and production news', 'Casting, signings, production companies and distribution deals.'],
    ],
    releases: ['Album releases', 'Film premieres', 'Streaming launches', 'Tour announcements', 'Festival lineups', 'Casting news', 'Signings', 'Award nominations'],
    desks: '2,600+',
    faq: [
      ['How quickly can a tour announcement go out?', 'Same day on standard plans. Announcements tied to ticket on-sale times can be scheduled to publish at a precise minute.'],
      ['Do you support music and film separately?', 'Yes, with distinct outlet lists for music press, film trade and streaming/tech entertainment media.'],
      ['Can independent artists use PressCosmos?', 'Yes, and the Launch plan is designed for exactly this. One release, properly formatted, at a price an independent can absorb.'],
      ['Do you require rights confirmation?', 'For music and footage assets, yes. You must have the right to distribute any media included in the release.'],
    ],
  },
  'legal-professional-services': {
    angles: [
      ['Verdicts and settlements', 'Results with jurisdiction, matter type and any client-consent requirements met.'],
      ['Firm growth', 'Mergers, lateral hires, office openings and practice expansions.'],
      ['Thought leadership', 'Regulatory analysis and commentary where the firm has genuine expertise.'],
    ],
    releases: ['Verdicts', 'Settlements', 'Firm mergers', 'Lateral hires', 'Office openings', 'Practice launches', 'Pro bono initiatives', 'Appointments'],
    desks: '740+',
    faq: [
      ['What consent is required for client matters?', 'Client consent or anonymisation, per your professional conduct rules. Our editors will not publish identifying details without confirmation.'],
      ['Do legal announcements get coverage?', 'Business-of-law desks cover firm news and significant verdicts. Legal trade press covers practice-specific developments. Generic "we are a leading firm" releases do not travel.'],
      ['Can you publish commentary on pending matters?', 'Only where it does not create a risk to the matter or breach conduct rules. Our reviewers will flag anything that looks like it might.'],
      ['How do you handle multi-jurisdiction firms?', 'Region-specific releases with jurisdiction-appropriate framing and, where useful, language variants.'],
    ],
  },
  'ecommerce-retail': {
    angles: [
      ['Store and market expansion', 'Openings, market entries and channel launches.'],
      ['Product drops and seasonal moments', 'Launches, collections and campaign milestones.'],
      ['Commercial performance news', 'Funding, profitability milestones and partnership announcements.'],
    ],
    releases: ['Store openings', 'Product launches', 'Seasonal campaigns', 'Funding rounds', 'Marketplace launches', 'Sustainability initiatives', 'Partnerships', 'Appointments'],
    desks: '1,900+',
    faq: [
      ['What makes a retail opening newsworthy?', 'Numbers — jobs created, square footage, investment, or a first of its kind in a market. A store opening with no figures is a local notice, not news.'],
      ['Can you target local press for store openings?', 'Yes, and this is the highest-return use of the retail route. Metro-level targeting around each opening typically outperforms a national send.'],
      ['Do you distribute DTC brand news?', 'Yes, including funding, category reports and sustainability programmes, to consumer and retail trade media.'],
      ['How do you handle seasonal timing?', 'Schedule against the retail calendar. Christmas campaigns sent in December are already late; trade desks plan them in July.'],
    ],
  },
};

const slugToMeta = (slug) => meta[slug];

export const industryPages = industries.map((ind, idx) => {
  const m = slugToMeta(ind.slug);
  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 3);
  const faqItems = m.faq.map(([q, a]) => ({ q, a }));

  return {
    slug: ind.slug,
    title: `${ind.name} Press Release Distribution | ${site.name}`,
    description: `Press release distribution for ${ind.name.toLowerCase()} — ${ind.intent}. ${m.desks} relevant outlets, specialist reviewers and AI answer-engine formatting on every release.`,
    keywords: [`${ind.name.toLowerCase()} press release distribution`, ...ind.keywords, 'press release service'],
    breadcrumbs: [{ label: 'Industries', href: 'industries.html' }, { label: ind.name }],
    priority: 0.7,
    faqs: faqItems,
    body: `
${pageHero({
      eyebrow: 'Industry',
      h1: ind.h1,
      lede: `Reach ${m.desks} desks, trade titles and aggregators that actually cover ${ind.name.toLowerCase()}. Every release is reviewed by an editor who reads this sector daily, then formatted so search and AI systems can quote it.`,
      crumbItems: [{ label: 'Industries', href: 'industries.html' }, { label: ind.name }],
      actions: `<a class="btn" href="submit.html?industry=${ind.slug}">Submit a ${ind.name.toLowerCase()} release</a><a class="btn btn-ghost" href="pricing.html">See pricing</a>`,
      aside: `<div class="panel panel-glass" style="padding:1.5rem" data-reveal="right">
        <p class="eyebrow" style="margin-bottom:1rem">Sector snapshot</p>
        <p class="stat-value" style="font-size:var(--step-2)">${m.desks}</p>
        <p class="stat-label">relevant desks &amp; outlets</p>
        <div class="chip-row mt-3">${ind.keywords.map((k) => `<span class="tag">${k}</span>`).join('')}</div>
      </div>`,
    })}

${section({
      body: answer(`PressCosmos distributes ${ind.name.toLowerCase()} press releases to ${m.desks} relevant outlets, covering ${ind.intent}. Every release gets specialist editorial review, industry keyword guidance and AI answer-engine formatting as standard. Per-release pricing starts at $149.`),
      className: 'section-tight pt-0',
    })}

${section({
      eyebrow: 'Angles',
      title: `What actually gets picked up in ${ind.name.toLowerCase()}`,
      lede: 'Most releases in this sector fail for the same reason: they describe the organisation instead of the news. These are the angles that travel.',
      body: `<div class="grid g-3" data-stagger>
      ${m.angles.map(([t, c]) => `<article class="card spotlight">
        <div class="card-icon">${icon('bolt')}</div>
        <h3>${t}</h3><p>${c}</p>
      </article>`).join('')}
    </div>`,
    })}

${section({
      eyebrow: 'Coverage',
      title: 'Release types we handle',
      body: `<div class="split">
      <div class="panel panel-glass" style="padding:1.6rem" data-reveal>
        <p class="eyebrow" style="margin-bottom:1rem">Common ${ind.name.toLowerCase()} releases</p>
        ${listCheck(m.releases)}
      </div>
      <div class="stack prose" style="--flow:1rem" data-reveal="right">
        <h3 class="mt-0">How this route is built</h3>
        <p>Our ${ind.name.toLowerCase()} route combines national and international newswires with sector trade press, regional desks in the metros that matter to you, and the AI answer engines that handle industry questions. You choose the tier; we handle the routing.</p>
        <p>Reviews are handled by editors who work this beat, which matters most when a claim needs qualifying or a number needs a source.</p>
        <p><a class="link-arrow" href="distribution.html">How distribution routing works ${icon('arrow')}</a></p>
      </div>
    </div>`,
    })}

${section({
      className: 'section-tight',
      body: `<div class="panel panel-glass" style="padding:clamp(1.5rem,4vw,2.25rem);border-radius:var(--r-xl)" data-reveal>
      ${takeaways([
      `Median first pickup for ${ind.name.toLowerCase()} releases: 38 minutes on priority plans.`,
      `${m.desks} sector-relevant outlets, plus AI answer engines on every plan.`,
      'Specialist editorial review — not a generic queue.',
      'Metro and country-level targeting included at no extra cost.',
    ])}
    </div>`,
    })}

${faqSection({ items: faqItems, title: `${ind.name} distribution questions`, eyebrow: 'Answers' })}

${section({
      eyebrow: 'Related industries',
      title: 'Other sectors we cover',
      body: `<div class="grid g-3">${others.map((o) => `<a class="card spotlight" href="${o.slug}.html" data-reveal><h3>${o.name}</h3><p class="muted" style="font-size:var(--step--1)">${o.stat}</p></a>`).join('')}</div>`,
    })}

${ctaBand({
      title: `Send your next ${ind.name.toLowerCase()} announcement to the desks that cover it.`,
      text: 'Editorial review, sector targeting, monitoring and AI visibility reporting included.',
    })}`,
  };
});
