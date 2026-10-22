// PressCosmos — policy pages. Written as clear, readable templates you should
// have reviewed by counsel before relying on them commercially.

import { site } from '../site.mjs';
import { section, pageHero, callout, ctaBand, listCheck } from '../ui.mjs';

const d = site.buildDate;
const legalNotes = `
<div class="callout" data-reveal style="margin-bottom:2rem">
  <strong>Template notice</strong>
  This page is a working template written for the PressCosmos launch build. It is drafted to be accurate and readable, but it is not legal advice. Have your counsel review it against the jurisdictions you operate in before you rely on it commercially. Last reviewed: ${d}.
</div>`;

const doc = ({ slug, name, title, description, eyebrow, h1, lede, sections, faqs }) => ({
  slug,
  title: `${title} | ${site.name}`,
  description,
  keywords: [name.toLowerCase(), 'PressCosmos policy', 'legal'],
  breadcrumbs: [{ label: 'Legal' }, { label: name }],
  priority: 0.3,
  changefreq: 'yearly',
  faqs,
  modifiedISO: `${d}T00:00:00Z`,
  body: `
${pageHero({
    eyebrow: eyebrow || 'Legal',
    h1,
    lede,
    crumbItems: [{ label: 'Legal' }, { label: name }],
    badge: { text: `Last updated ${d}` },
  })}

${section({
    className: 'section-tight pt-0',
    body: `<div class="wrap-narrow mx-auto">
    ${legalNotes}
    <div class="prose">
      ${sections.map((s) => `<h2 id="${s.id}">${s.h}</h2>${s.html}`).join('')}
    </div>
    <div class="callout mt-4">
      <strong>Questions about this policy?</strong>
      Write to <a href="mailto:${site.supportEmail}" style="color:var(--cyan)">${site.supportEmail}</a> or post to ${site.legalName}, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}.
    </div>
  </div>`,
  })}

${ctaBand({ title: 'Sign up for press release distribution.', text: 'Pricing is published, review is human, and you can leave whenever you like.', primary: 'See pricing', primaryHref: 'pricing.html', secondary: 'Contact us', secondaryHref: 'contact.html' })}`,
});

const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

/* ----------------------------------------------------------------- privacy */
const privacy = doc({
  slug: 'privacy',
  name: 'Privacy Policy',
  title: 'Privacy Policy',
  description: 'How PressCosmos collects, uses, shares and retains personal data, including the rights available to you and how to exercise them.',
  h1: 'Privacy Policy',
  lede: 'What we collect, why we collect it, how long we keep it, and how to make us stop.',
  sections: [
    {
      id: 'scope', h: '1. Scope of this policy',
      html: `<p>This policy covers personal data processed by ${site.legalName} ("PressCosmos", "we") when you visit ${site.domain}, submit a press release, create an account, subscribe to a newsletter or contact us. It does not cover third-party sites we link to, including outlets that syndicate your release — those organisations have their own policies.</p>`,
    },
    {
      id: 'collect', h: '2. What we collect',
      html: `${ul([
        '<strong>Account data</strong> — name, work email, organisation, role, billing country.',
        '<strong>Submission data</strong> — the content of press releases and media assets you upload, including any personal data you include in them.',
        '<strong>Billing data</strong> — processed by our payment processor. We do not store full card numbers.',
        '<strong>Usage data</strong> — pages viewed, features used, referring source, approximate location derived from IP address.',
        '<strong>Communications</strong> — support tickets, emails and editorial correspondence.',
      ])}`,
    },
    {
      id: 'why', h: '3. Why we use it',
      html: `${ul([
        '<strong>To provide the service</strong> — reviewing, distributing and hosting your release, and reporting results. Legal basis: performance of a contract.',
        '<strong>To operate the network</strong> — syndicating releases to contracted distribution partners. Legal basis: performance of a contract.',
        '<strong>To improve the product</strong> — aggregated analytics on how features are used. Legal basis: legitimate interests.',
        '<strong>To send marketing</strong> — where you opted in, or where we have a legitimate interest based on an existing customer relationship. Legal basis: consent or legitimate interests.',
        '<strong>To meet legal obligations</strong> — tax, accounting, sanctions screening and lawful requests from authorities. Legal basis: legal obligation.',
      ])}`,
    },
    {
      id: 'sharing', h: '4. Who we share data with',
      html: `<p>We share data with distribution partners, hosting and infrastructure providers, payment processors, analytics providers and professional advisers. When we distribute a release, the release content — including any personal data in it, such as a named spokesperson and contact details — is transmitted to receiving outlets and feed partners. That transmission is the service you are buying.</p>
      <p>We do not sell personal data, and we do not resell media contact databases or use your campaign data to pitch your competitors.</p>`,
    },
    {
      id: 'retention', h: '5. How long we keep it',
      html: `${ul([
        'Published releases and hosted pages: retained permanently, because a distributed release cannot be retracted from partners. You can request de-indexing of a hosted page where law permits.',
        'Account data: retained while the account is open, then for seven years to meet financial record-keeping obligations.',
        'Analytics data: aggregated after 26 months; raw event data retained for 14 months.',
        'Marketing consent records: retained until withdrawn plus three years as evidence of the withdrawal.',
      ])}`,
    },
    {
      id: 'rights', h: '6. Your rights',
      html: `<p>Depending on where you live, you may have the right to access, correct, delete, restrict, port, or object to our processing of your personal data, and to withdraw consent. You may also have the right not to be subject to solely automated decisions with legal effect — we do not make any such decisions.</p>
      <p>To exercise a right, email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a>. We respond within 30 days. You can complain to your local supervisory authority; in the EU that is your national data protection authority, and in the UK the Information Commissioner's Office.</p>`,
    },
    {
      id: 'transfers', h: '7. International transfers',
      html: `<p>We operate infrastructure in the United States and the European Union. Where personal data is transferred outside the EEA or UK, we rely on the European Commission's Standard Contractual Clauses with supplementary technical and organisational measures, including encryption in transit and at rest.</p>`,
    },
    {
      id: 'ai', h: '8. AI processing',
      html: `<p>We use language models to help draft and tighten copy and to measure how answer engines describe your organisation. Drafting assistance runs on your submitted content only when you enable it, and is not used to train third-party models under our enterprise agreements. Share-of-answer measurement queries public AI systems and stores the responses and citations, not your private data. Release pages are intentionally published to the open web and are available to search and AI crawlers — that is the purpose of distribution.</p>`,
    },
    {
      id: 'security', h: '9. Security',
      html: `<p>We encrypt data in transit and at rest, enforce least-privilege access with mandatory multi-factor authentication, log administrative access, and review our subprocessors annually. Nobody can promise absolute security; if a breach affects your personal data we will notify you and the relevant authority within 72 hours of becoming aware.</p>`,
    },
    {
      id: 'children', h: '10. Children',
      html: `<p>PressCosmos is a business service and is not directed at children under 16. We do not knowingly collect their data. If you believe a child has provided us personal data, contact us and we will delete it.</p>`,
    },
  ],
  faqs: [
    { q: 'Does PressCosmos sell my data?', a: 'No. We do not sell personal data, and we do not resell media contact databases or use your campaign performance data to market to your competitors.' },
    { q: 'Can I delete a press release after it is distributed?', a: 'We can remove it from our own hosted pages and feeds. We cannot guarantee removal from independent outlets that syndicated or reported on it, because those are separate organisations. We will pass on removal requests where a partner agreement allows.' },
    { q: 'Do you use my content to train AI models?', a: 'Not for third-party training under our enterprise terms. AI drafting assistance processes your content to generate suggestions and does not retain it for model training.' },
  ],
});

/* ------------------------------------------------------------------- terms */
const terms = doc({
  slug: 'terms',
  name: 'Terms of Service',
  title: 'Terms of Service',
  description: 'The terms governing your use of PressCosmos press release distribution, AI visibility, monitoring and newsroom services.',
  h1: 'Terms of Service',
  lede: 'The agreement between you and PressCosmos when you submit a release or use the platform.',
  sections: [
    { id: 'agreement', h: '1. Agreement', html: `<p>By submitting a press release, creating an account or using the platform you agree to these terms. If you are agreeing on behalf of an organisation, you confirm you have authority to bind it. If you do not agree, do not use the service.</p>` },
    { id: 'service', h: '2. What the service is', html: `<p>PressCosmos reviews submissions editorially and distributes approved releases to contracted network lanes, hosts release pages, and reports pickup, backlink and AI citation data. We are a distributor, not a publisher: we do not commission, edit beyond review, or endorse the claims in your release.</p>` },
    {
      id: 'your-obligations', h: '3. Your obligations',
      html: `${ul([
        'You own or have permission to distribute everything you submit, including images, video, quotes and trademarks.',
        'Everything you state as fact is true and verifiable, and you can substantiate it if challenged.',
        'You disclose material relationships, paid arrangements and conflicts of interest that a reader would reasonably consider relevant.',
        'You have consent to publish any personal data about individuals named or quoted.',
        'You comply with applicable law, including securities, health, gambling, financial-promotion and consumer-protection rules in the markets you target.',
      ])}`,
    },
    {
      id: 'prohibited', h: '4. Prohibited content',
      html: `<p>We reject and may remove: content promoting illegal activity; undisclosed paid content; guaranteed-return investment or token promotion; health claims without cited substantiation; adult or gambling content without compliance documentation; content infringing third-party rights; malware or deceptive links; and anything designed to manipulate search engines or AI systems through cloaking, hidden text or prompt injection.</p>`,
    },
    {
      id: 'editorial', h: '5. Editorial control',
      html: `<p>We may edit for clarity, length, formatting, headline accuracy and legal compliance, or decline a submission. Where we decline, you receive a written reason and a full credit. We may remove published content if it breaches these terms or applicable law, and we will notify you where we are legally able to.</p>`,
    },
    {
      id: 'fees', h: '6. Fees and payment',
      html: `<p>Prices are published on the pricing page and charged in US dollars unless agreed otherwise. Per-release plans are charged at submission. Monthly plans renew automatically until cancelled. Volume, agency and enterprise terms are set in a separate order form. Taxes are additional where applicable.</p>`,
    },
    {
      id: 'no-guarantee', h: '7. No guarantee of coverage',
      html: `<p>We guarantee delivery to contracted distribution lanes and publish a record of that delivery. We do not and cannot guarantee that a specific outlet, journalist or AI system will publish or cite your release. Any vendor promising specific editorial coverage is describing advertising, which must be labelled as such.</p>`,
    },
    {
      id: 'ip', h: '8. Intellectual property',
      html: `<p>You keep ownership of your release content and grant us a worldwide, non-exclusive licence to host, reproduce, distribute and syndicate it for the purpose of providing the service. We keep ownership of the platform, our templates, our data and our brand. You may not resell platform access without a written agreement.</p>`,
    },
    {
      id: 'liability', h: '9. Liability',
      html: `<p>To the maximum extent permitted by law, our total liability arising from the service is limited to the fees you paid in the twelve months before the claim. We are not liable for indirect or consequential loss, lost profit or lost reputation. Nothing in these terms limits liability for fraud, death or personal injury caused by negligence, or any other liability that cannot lawfully be limited.</p>`,
    },
    { id: 'term', h: '10. Term and termination', html: `<p>Per-release engagements end when the release is distributed and the reporting period closes. Monthly plans can be cancelled at any time, effective at the end of the current billing period. We may suspend an account for breach of these terms, and will tell you why.</p>` },
    { id: 'law', h: '11. Governing law', html: `<p>These terms are governed by the laws of the State of California, United States, and the courts of San Francisco County have exclusive jurisdiction, except that either party may seek injunctive relief in any competent court to protect intellectual property.</p>` },
  ],
  faqs: [
    { q: 'Can PressCosmos refuse to publish my release?', a: 'Yes. We decline submissions that breach our editorial guidelines or terms, for example unverifiable claims, undisclosed paid content, prohibited categories or material that infringes third-party rights. Declined paid submissions are credited in full.' },
    { q: 'Do I keep the copyright to my press release?', a: 'Yes. You retain ownership and grant us a non-exclusive licence to host, distribute and syndicate the release for the purpose of providing the service.' },
  ],
});

/* ----------------------------------------------------------------- cookies */
const cookies = doc({
  slug: 'cookies',
  name: 'Cookie Policy',
  title: 'Cookie Policy',
  description: 'The cookies and similar technologies PressCosmos uses, what each is for, and how to control them.',
  h1: 'Cookie Policy',
  lede: 'What we store on your device, why, and how to turn the optional parts off.',
  sections: [
    { id: 'what', h: '1. What cookies we use', html: `<p>We use a small number of first-party cookies and local storage keys. We do not use third-party advertising cookies.</p>` },
    {
      id: 'table', h: '2. The list',
      html: `<div class="table-scroll"><table class="compare">
        <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
        <tbody>
          <tr><td>presscosmos:theme</td><td>Essential (local storage)</td><td>Remembers light or dark mode</td><td>Persistent</td></tr>
          <tr><td>presscosmos:consent</td><td>Essential (local storage)</td><td>Records your cookie choice so we stop asking</td><td>12 months</td></tr>
          <tr><td>pc_session</td><td>Essential</td><td>Keeps you signed in and protects forms against cross-site request forgery</td><td>Session</td></tr>
          <tr><td>pc_analytics</td><td>Optional</td><td>Aggregated, IP-truncated page analytics</td><td>13 months</td></tr>
          <tr><td>pc_referral</td><td>Optional</td><td>Attributes referral traffic from earned coverage</td><td>90 days</td></tr>
        </tbody></table></div>`,
    },
    { id: 'control', h: '3. Controlling cookies', html: `<p>Essential cookies cannot be disabled because the site cannot function without them. You can decline optional cookies in the consent banner, or change your mind at any time by clearing site data in your browser. Browser-wide cookie blocking is available in every major browser and will not break the core site.</p>` },
    { id: 'signals', h: '4. Global Privacy Control', html: `<p>We honour the Global Privacy Control signal. If your browser sends GPC, optional analytics and referral cookies are not set.</p>` },
    { id: 'third', h: '5. Third parties', html: `<p>Our payment processor and font provider may set their own cookies when you interact with them. Our analytics is first-party and IP-truncated, and we do not run advertising pixels or session-recording tools.</p>` },
  ],
  faqs: [
    { q: 'Does PressCosmos use advertising cookies?', a: 'No. We do not run third-party advertising pixels, and we do not sell data derived from cookies.' },
    { q: 'What happens if I decline optional cookies?', a: 'Essential functionality continues to work. We will not record aggregated analytics or referral attribution for your visit.' },
  ],
});

/* -------------------------------------------------------------------- gdpr */
const gdpr = doc({
  slug: 'gdpr',
  name: 'GDPR & Data Processing',
  title: 'GDPR and Data Processing',
  description: 'How PressCosmos supports GDPR compliance: lawful bases, the DPA, subprocessors, data residency and data subject requests.',
  h1: 'GDPR and Data Processing',
  lede: 'What we do for customers who need a data processing agreement, and what you can tell your own DPO.',
  sections: [
    { id: 'roles', h: '1. Who is the controller', html: `<p>For account and billing data, ${site.legalName} is the controller. For release content and any personal data you include in it, you are the controller and PressCosmos acts as your processor. That distinction is what the Data Processing Agreement (DPA) formalises.</p>` },
    { id: 'dpa', h: '2. The Data Processing Agreement', html: `<p>A DPA is available on request and is incorporated into enterprise and agency agreements automatically. It covers subject matter, duration, nature and purpose of processing, categories of data and data subjects, our obligations, and audit rights. Email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a> for a countersigned copy.</p>` },
    {
      id: 'subprocessors', h: '3. Subprocessors',
      html: `<p>The current list, with purpose and location, is maintained on request and updated 30 days before any change is effective, giving you a right to object.</p>
      ${ul(['Cloud hosting and CDN — United States and European Union', 'Payment processing — United States', 'Transactional email delivery — United States and European Union', 'Analytics — first-party, European Union', 'Answer-engine measurement — queries public AI systems only'])}`,
    },
    { id: 'uen', h: '4. Data residency', html: `<p>EU customers can select EU-only storage for account data and release drafts. Published releases are, by nature, globally distributed — that is the purpose of the service, and it is the customer\'s decision to publish.</p>` },
    { id: 'dpia', h: '5. DPIAs and consultations', html: `<p>We support your Data Protection Impact Assessment with technical and organisational measures documentation, a description of the processing, and reasonable assistance with supervisory authority consultations at our standard professional rates.</p>` },
    { id: 'requests', h: '6. Data subject requests', html: `<p>If you receive a request relating to data you hold in PressCosmos, forward it and we will respond within five business days with the information needed to fulfil it. Our own subject request process is described in the <a href="privacy.html">privacy policy</a>.</p>` },
    { id: 'breach', h: '7. Breach notification', html: `<p>We notify affected controllers without undue delay and within 72 hours of becoming aware of a personal data breach, with the information required by Article 33(3).</p>` },
  ],
  faqs: [
    { q: 'Do you offer a Data Processing Agreement?', a: 'Yes. A DPA is available on request and included automatically in enterprise and agency agreements. Email support@presscosmos.com for a countersigned copy.' },
    { q: 'Where is my data stored?', a: 'Account data is stored in the United States by default, with an EU-only option for account data and release drafts. Distributed releases are published globally by design.' },
  ],
});

/* -------------------------------------------------------------------- dmca */
const dmca = doc({
  slug: 'dmca',
  name: 'Copyright & DMCA',
  title: 'Copyright Policy and DMCA',
  description: 'How to report copyright infringement on PressCosmos, how counter-notices work, and our repeat-infringer policy.',
  h1: 'Copyright Policy and DMCA',
  lede: 'If your work appears on a PressCosmos page without permission, here is exactly how to get it removed.',
  sections: [
    { id: 'respect', h: '1. Our position', html: `<p>We respect intellectual property rights and expect submitters to do the same. Releases frequently include images, footage and third-party data, and responsibility for having the rights to that material sits with the submitter under our <a href="terms.html">terms of service</a>.</p>` },
    {
      id: 'notice', h: '2. Filing a notice',
      html: `<p>Send a written notice to our designated agent: <strong>${site.legalName}, DMCA Agent, ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}</strong>, or email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a> with the subject line "DMCA Notice". The notice must include:</p>
      ${ul([
        'Identification of the copyrighted work you claim has been infringed',
        'The exact URL of the allegedly infringing material',
        'Your name, address, telephone number and email address',
        'A statement that you have a good-faith belief the use is not authorised by the owner, its agent or the law',
        'A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorised to act for the owner',
        'Your physical or electronic signature',
      ])}`,
    },
    { id: 'action', h: '3. What we do next', html: `<p>We remove or disable access to the identified material promptly, notify the submitter, and forward a copy of the notice to them. Removal does not erase the inbox record: notices are retained as evidence.</p>` },
    { id: 'counter', h: '4. Counter-notice', html: `<p>If your release was removed and you believe the removal was wrong — for example because you hold a valid licence or the use is fair — you may send a counter-notice with the same level of detail and consent to the jurisdiction of a competent court. We may restore the material after ten business days unless the original complainant notifies us of a filed action.</p>` },
    { id: 'repeat', h: '5. Repeat infringers', html: `<p>Accounts that receive repeated substantiated notices are suspended, and persistent offenders are terminated. We do not accept a submission from a suspended account under a different name.</p>` },
    { id: 'syndication', h: '6. Syndicated copies', html: `<p>Releases are distributed to independent outlets. If your content is removed here but appears elsewhere, that outlet is a separate organisation and the request must be made to it. We will provide you with the delivery list for the release in question so you know where to look.</p>` },
  ],
  faqs: [
    { q: 'How quickly do you remove infringing content?', a: 'Promptly on receipt of a valid notice — in practice within one business day, and immediately for clear commercial infringement.' },
    { q: 'What if my release was removed unfairly?', a: 'You can file a counter-notice with the same level of detail as the original complaint. We may restore the material after ten business days unless court action is notified.' },
  ],
});

/* ----------------------------------------------------------------- refunds */
const refunds = doc({
  slug: 'refunds',
  name: 'Refund & Cancellation Policy',
  title: 'Refund and Cancellation Policy',
  description: 'When PressCosmos refunds a press release distribution, how monthly plan cancellation works, and what happens if we decline a submission.',
  h1: 'Refund and Cancellation Policy',
  lede: 'Our default is to credit anything we decline, and to charge only for distribution we actually performed.',
  sections: [
    { id: 'declined', h: '1. Submissions we decline', html: `<p>If we decline your release for editorial or compliance reasons, you receive a full credit or refund, your choice, plus a written explanation. This is the most common refund case and it is handled automatically.</p>` },
    { id: 'undistributed', h: '2. Not yet distributed', html: `<p>If your release is approved but not yet distributed, you can cancel for a full refund at any time before the first syndication fires. Once distribution begins, the cost has been incurred and cannot be recovered from the network.</p>` },
    { id: 'distributed', h: '3. Already distributed', html: `<p>After distribution we do not refund, because the service has been delivered and cannot be undone. If the result did not meet your expectations, tell us — we will review the campaign, explain what happened and, where the shortfall was ours (a routing error, a missed lane), we will re-distribute at no cost.</p>` },
    { id: 'subscriptions', h: '4. Monthly plans', html: `<p>Studio plans can be cancelled at any time through the dashboard or by email. Cancellation takes effect at the end of the current billing period; we do not pro-rate partial months. Releases already included in a paid period remain published permanently.</p>` },
    { id: 'errors', h: '5. Our errors', html: `<p>If we publish an incorrect fact that we introduced, or deliver to the wrong lanes, we correct and re-distribute at our cost, including any correction distribution fees. If you supplied the incorrect information, correction distribution is charged at the standard rate of $49.</p>` },
    { id: 'howto', h: '6. How to request a refund', html: `<p>Email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a> with your release ID and the reason. We respond within two business days and process approved refunds to the original payment method within five to ten business days.</p>` },
  ],
  faqs: [
    { q: 'Can I get a refund if my release was already distributed?', a: 'No. Distribution is performed and cannot be reversed once it has fired. If the failure was ours — a routing error or missed lane — we re-distribute at no charge.' },
    { q: 'What happens if my release is rejected?', a: 'You receive a full credit or refund plus a written explanation. Declined submissions are always credited.' },
    { q: 'Do you prorate cancelled monthly plans?', a: 'No. Cancellation takes effect at the end of the current billing period, and you keep the releases already included in that period.' },
  ],
});

/* ------------------------------------------------------- editorial guidelines */
const editorial = doc({
  slug: 'editorial-guidelines',
  name: 'Editorial Guidelines',
  title: 'Editorial Guidelines',
  description: 'What PressCosmos publishes, what we reject, how our reviewers decide, and how corrections and embargoes are handled.',
  eyebrow: 'Standards',
  h1: 'Editorial Guidelines',
  lede: 'The rules our reviewers apply to every submission — published so you can predict the decision before you pay.',
  sections: [
    { id: 'standard', h: '1. The standard we apply', html: `<p>Two questions decide every review: is there a genuine news element, and can the claims be substantiated? A release that answers both is approved. Formatting problems are fixed, not grounds for rejection.</p>` },
    {
      id: 'publish', h: '2. What we publish',
      html: `${ul([
        'Corporate and financial announcements: funding, results, appointments, transactions',
        'Product, platform and service launches with substantive detail',
        'Research findings, reports and datasets with methodology available',
        'Partnerships, contracts, expansions and facility news',
        'Awards, recognitions, event and community announcements with specifics',
        'Public-interest, non-profit and regulatory announcements',
      ])}`,
    },
    {
      id: 'reject', h: '3. What we reject',
      html: `${ul([
        'Unverifiable superlatives — "world\'s leading", "best in class" without a citable basis',
        'Undisclosed paid content, or advertising presented as editorial',
        'Guaranteed-return investment, token or trading promotion',
        'Health or efficacy claims without a cited source',
        'Adult and gambling content without compliance documentation',
        'Duplicate submissions of the same news to inflate coverage counts',
        'Content infringing third-party rights, including unlicensed imagery',
        'Anything designed to manipulate search or AI systems through cloaking, hidden text or prompt injection',
      ])}`,
    },
    { id: 'claims', h: '4. Substantiation', html: `<p>One number in the first paragraph is worth more than a page of adjectives, but every number needs a source. If we cannot identify where a figure came from, we either remove it or ask you to cite it.</p>` },
    { id: 'disclosure', h: '5. Disclosure', html: `<p>Material relationships must be stated: client relationships, paid placements, affiliate arrangements, and insider positions where a reader would reasonably consider them relevant. Undisclosed arrangements are the fastest route to a rejection, and to a permanent ban for repeat offences.</p>` },
    { id: 'embargo', h: '6. Embargoes', html: `<p>Embargoes are honoured to the minute and timezone you specify. Breaking an embargo you set is not our failure, but breaking one we agreed with a partner is — so we prefer unambiguous times over "morning of".</p>` },
    { id: 'corrections', h: '7. Corrections', html: `<p>Corrections are published as visible, timestamped updates with the original text retained. Corrections for errors we introduced are free; corrections for information supplied incorrectly are charged at $49. We do not silently edit published releases — a distributed release has already been syndicated, and pretending otherwise is dishonest.</p>` },
    { id: 'review-process', h: '8. How review works', html: `<p>A named human editor reads every release. Automated checks catch formatting and disclosure gaps first. Review turnaround is 60 minutes on priority plans and four business hours standard. Every decision comes back with a written reason, including approvals.</p>` },
    { id: 'appeals', h: '9. Appeals', html: `<p>If you disagree with a rejection, reply to the decision email. A different editor reviews the appeal. We reverse roughly one in five rejections on appeal, usually because the first submission omitted substantiation that existed.</p>` },
  ],
  faqs: [
    { q: 'Will PressCosmos edit my press release?', a: 'We may suggest or apply changes for clarity, headline accuracy, formatting and legal compliance. Substantive changes to your claims are proposed rather than imposed, and you always see the final version before distribution.' },
    { q: 'What is the approval rate?', a: 'Currently 98% of submissions are approved, usually with suggested improvements. Rejections are almost always about missing substantiation or undisclosed arrangements.' },
    { q: 'Can I appeal a rejection?', a: 'Yes. Reply to the decision email and a different editor reviews it. Around one in five rejections are reversed on appeal.' },
  ],
});

/* -------------------------------------------------------------- accessibility */
const accessibility = doc({
  slug: 'accessibility',
  name: 'Accessibility Statement',
  title: 'Accessibility Statement',
  description: 'PressCosmos is built to WCAG 2.2 AA: keyboard navigation, reduced-motion support, contrast targets and our known limitations.',
  h1: 'Accessibility Statement',
  lede: 'A press release service that some journalists cannot read is a broken press release service.',
  sections: [
    { id: 'commitment', h: '1. Our commitment', html: `<p>We aim to meet WCAG 2.2 Level AA across the public site, the newsroom and the submission flow. Accessibility is treated as a release requirement, not a backlog item.</p>` },
    {
      id: 'measures', h: '2. What we have implemented',
      html: `${ul([
        'Semantic HTML landmarks, one h1 per page, and a valid heading hierarchy',
        'Full keyboard operation, including skip links and visible focus indicators',
        'Respect for <code>prefers-reduced-motion</code> — every animation is disabled, not merely shortened',
        'Contrast targets of 4.5:1 for body text and 3:1 for large text and interface components',
        'A dark theme and a light theme, both contrast-checked independently',
        'Text that scales to 200% without loss of content or function',
        'Colour never used as the only means of conveying information',
        'Descriptive alt text on meaningful images and empty alt on decorative ones',
        'Labelled form fields with associated error messaging and aria-live status regions',
      ])}`,
    },
    { id: 'known', h: '3. Known limitations', html: `<p>Honest list of what we know is not finished: the interactive coverage map relies on a canvas-based library that is not fully screen-reader navigable, and we publish a table alternative alongside it. Some third-party embeds in submitted releases are outside our control and may not be accessible — we flag these to submitters.</p>` },
    { id: 'testing', h: '4. How we test', html: `<p>Automated checks in the build pipeline on every deployment, manual keyboard and screen-reader testing on each major release, and an annual third-party audit. Testing covers NVDA with Firefox and VoiceOver with Safari.</p>` },
    { id: 'feedback', h: '5. Feedback and enforcement', html: `<p>If you encounter a barrier, email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a>. We acknowledge within two business days and aim to resolve or provide an accessible alternative within ten. If you are not satisfied with our response, you can escalate your complaint to your national accessibility enforcement body.</p>` },
    { id: 'alt', h: '6. Alternative formats', html: `<p>Any published release can be provided as a plain-text document on request, and our editors will describe charts or data visualisations in words if you need them for assistive technology or print.</p>` },
  ],
  faqs: [
    { q: 'Does the PressCosmos website support reduced motion?', a: 'Yes. If your operating system or browser requests reduced motion, all decorative animation is disabled and content appears in its final state.' },
    { q: 'What accessibility standard does PressCosmos target?', a: 'WCAG 2.2 Level AA across the public site, newsroom and submission flow, verified by automated pipeline checks and manual screen-reader testing.' },
  ],
});

export const legalContentPages = [privacy, terms, cookies, gdpr, dmca, refunds, editorial, accessibility];
