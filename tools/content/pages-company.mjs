// PressCosmos — company, segment and utility pages.

import { site, faqs, plans, services, industries, legalPages, audienceSegments, testimonials } from '../site.mjs';
import {
  icon, section, card, pageHero, answer, faqSection, ctaBand, quote, listCheck,
  takeaways, callout, statRow, storyCard,
} from '../ui.mjs';

/* ------------------------------------------------------------------- submit */
const submit = {
  slug: 'submit',
  title: `Submit a Press Release | Publish in 42 Minutes | ${site.name}`,
  description:
    'Submit a press release for editorial review and distribution across 2,400+ media destinations with AI answer-engine formatting. From $149 with no subscription.',
  keywords: ['submit press release', 'publish press release', 'send a press release', 'press release submission'],
  breadcrumbs: [{ label: 'Submit a release' }],
  priority: 0.95,
  body: `
${pageHero({
    eyebrow: 'Submission',
    badge: { text: 'Median publish time: 42 minutes', class: 'pill-live' },
    h1: 'Submit your press release.',
    lede: 'Ten minutes to submit, one hour to a decision, and a pickup report once it goes out. Your draft is saved as you type.',
    crumbItems: [{ label: 'Submit a release' }],
  })}

<section class="section-tight">
  <div class="wrap">
    <ol class="stepper" aria-label="Submission steps">
      <li class="is-active">1. Choose a plan</li>
      <li>2. Write your release</li>
      <li>3. Set targeting</li>
      <li>4. Review and pay</li>
    </ol>

    <form class="panel panel-glass" data-form="submission" novalidate style="padding:clamp(1.25rem,3vw,2.25rem);border-radius:var(--r-xl)">
      <h2 style="font-size:var(--step-2)">1. Choose a plan</h2>
      <p class="muted" style="font-size:var(--step--1);margin-top:.5rem">You can change this later. Prices are per release unless stated otherwise.</p>
      <div class="grid g-2 mt-3">
        <div class="field">
          <label for="plan">Distribution plan</label>
          <select class="select" id="plan" name="plan" required>
            ${plans.map((p) => `<option value="${p.slug}"${p.popular ? ' selected' : ''}>${p.name} — $${p.price.toLocaleString('en-US')} ${p.unit}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="industry">Primary industry</label>
          <select class="select" id="industry" name="industry" required>
            ${industries.map((i) => `<option value="${i.slug}">${i.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <hr class="hr">

      <h2 style="font-size:var(--step-2)">2. Write your release</h2>
      <p class="muted" style="font-size:var(--step--1);margin-top:.5rem">Prefer to paste an existing release? Drop it into the body field and our editor will handle the structure.</p>
      <div class="grid mt-3" style="gap:1.1rem">
        <div class="field">
          <label for="headline">Headline <span class="hint">— state the news, under 100 characters</span></label>
          <input class="input" id="headline" name="headline" maxlength="120" required placeholder="Acme Corp opens 40-person engineering office in Lisbon">
          <p class="hint">Good: says what happened. Avoid: "Acme is excited to announce a new chapter".</p>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="dateline-city">Dateline city</label>
            <input class="input" id="dateline-city" name="datelineCity" required placeholder="San Francisco">
          </div>
          <div class="field">
            <label for="dateline-date">Dateline date</label>
            <input class="input" id="dateline-date" name="datelineDate" type="date" required>
          </div>
        </div>
        <div class="field">
          <label for="summary">Subheading <span class="hint">— one line of supporting detail</span></label>
          <input class="input" id="summary" name="summary" maxlength="200" placeholder="The office will hire 40 engineers by June 2027, the company said.">
        </div>
        <div class="field">
          <label for="body">Release body</label>
          <textarea class="textarea" id="body" name="body" required minlength="400" placeholder="Open with who, what, when, where and why. Include at least one specific number, one quote from a named person, and an About section."></textarea>
          <p class="hint">Minimum 400 characters. Aim for 400–600 words. The editor checks substantiation on every claim.</p>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="quote-name">Quote attribution name</label>
            <input class="input" id="quote-name" name="quoteName" placeholder="Priya Raghunathan">
          </div>
          <div class="field">
            <label for="quote-role">Quote attribution role</label>
            <input class="input" id="quote-role" name="quoteRole" placeholder="Chief Executive Officer, Acme Corp">
          </div>
        </div>
        <div class="field">
          <label for="media">Media assets <span class="hint">— images, video, PDF media kit</span></label>
          <input class="input" id="media" name="media" type="file" multiple accept="image/*,video/*,application/pdf">
          <p class="hint">You must hold the rights to everything you upload. Unlicensed imagery is the most common cause of rejection.</p>
        </div>
      </div>

      <hr class="hr">

      <h2 style="font-size:var(--step-2)">3. Set targeting</h2>
      <p class="muted" style="font-size:var(--step--1);margin-top:.5rem">Relevance beats volume. Choose the markets where the story is genuinely local.</p>
      <div class="form-grid mt-3">
        <div class="field">
          <label for="countries">Target countries</label>
          <select class="select" id="countries" name="countries" multiple size="4">
            ${['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'India', 'Australia', 'Singapore', 'United Arab Emirates', 'Brazil']
        .map((c) => `<option${c === 'United States' ? ' selected' : ''}>${c}</option>`).join('')}
          </select>
          <p class="hint">Hold Ctrl or Cmd to select more than one.</p>
        </div>
        <div class="field">
          <label for="language">Additional languages</label>
          <select class="select" id="language" name="language" multiple size="4">
            ${['Arabic', 'Chinese (Simplified)', 'Dutch', 'French', 'German', 'Hebrew', 'Hindi', 'Italian', 'Japanese', 'Portuguese', 'Spanish']
        .map((l) => `<option>${l}</option>`).join('')}
          </select>
          <p class="hint">$89 per language, native-speaker reviewed.</p>
        </div>
        <div class="field">
          <label for="embargo">Embargo until <span class="hint">— optional</span></label>
          <input class="input" id="embargo" name="embargo" type="datetime-local">
        </div>
        <div class="field">
          <label for="timezone">Embargo timezone</label>
          <select class="select" id="timezone" name="timezone">
            ${['UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Singapore', 'Australia/Sydney']
        .map((t) => `<option>${t}</option>`).join('')}
          </select>
        </div>
      </div>

      <hr class="hr">

      <h2 style="font-size:var(--step-2)">4. Contact and review</h2>
      <div class="form-grid mt-3">
        <div class="field">
          <label for="contact-name">Your name</label>
          <input class="input" id="contact-name" name="contactName" required autocomplete="name">
        </div>
        <div class="field">
          <label for="contact-email">Work email</label>
          <input class="input" id="contact-email" name="contactEmail" type="email" required autocomplete="email">
        </div>
        <div class="field">
          <label for="organisation">Organisation</label>
          <input class="input" id="organisation" name="organisation" required autocomplete="organization">
        </div>
        <div class="field">
          <label for="media-contact">Media contact email <span class="hint">— printed in the release</span></label>
          <input class="input" id="media-contact" name="mediaContact" type="email" required>
        </div>
      </div>

      <div class="grid mt-3" style="gap:.8rem">
        <label class="checkbox"><input type="checkbox" required><span>I confirm I have the rights to all submitted content and that the facts are accurate and verifiable.</span></label>
        <label class="checkbox"><input type="checkbox"><span>This release contains a paid placement or material relationship. <em>(Required disclosure — we will label it as such.)</em></span></label>
        <label class="checkbox"><input type="checkbox" required><span>I agree to the <a href="terms.html" style="color:var(--cyan)">terms of service</a> and <a href="privacy.html" style="color:var(--cyan)">privacy policy</a>.</span></label>
      </div>

      <div class="between mt-4">
        <div>
          <p class="mono faint">Selected: <span class="gradient-text" style="font-weight:700">Amplify — $349</span></p>
          <p class="mono faint">Editorial review in 60 minutes</p>
        </div>
        <button class="btn btn-lg" type="submit">Submit for editorial review ${icon('arrow')}</button>
      </div>
      <p class="form-status" data-form-status aria-live="polite"></p>
      <p class="mono faint mt-3">This build has no payment backend connected. Submissions are validated in the browser and confirmed on screen — connect an endpoint or your CRM before going live.</p>
    </form>
  </div>
</section>

${section({
    eyebrow: 'Before you submit',
    title: 'The four things that get a release approved faster',
    body: `<div class="grid g-4">
    ${[
      ['A number that matters', 'One specific, verifiable figure in the first paragraph. It is what reporters quote.'],
      ['A sourced claim', 'Superlatives need a citation. "Highest-rated" requires a source or it gets cut.'],
      ['A usable contact', 'A monitored inbox, not a form. Journalists work to deadlines.'],
      ['Rights-cleared assets', 'Media must be yours to distribute, or it is rejected on sight.'],
    ].map(([t, c]) => card({ iconName: 'check', title: t, text: c })).join('')}
  </div>
  <p class="mt-3"><a class="link-arrow" href="editorial-guidelines.html">Read the full editorial guidelines ${icon('arrow')}</a></p>`,
    className: 'section-tight',
  })}

${faqSection({ items: faqs.general.slice(0, 5), title: 'Submission questions', eyebrow: 'Answers', lede: 'The questions our editorial desk answers before every submission.' })}`,
};

/* ------------------------------------------------------------------ contact */
const contact = {
  slug: 'contact',
  title: `Contact PressCosmos | Sales, Editorial and Support | ${site.name}`,
  description:
    'Contact the PressCosmos team: sales and demos, editorial desk for corrections and submissions, support for account issues, and press enquiries.',
  keywords: ['contact press release service', 'PR distribution contact', 'editorial desk contact'],
  breadcrumbs: [{ label: 'Contact' }],
  priority: 0.7,
  body: `
${pageHero({
    eyebrow: 'Contact',
    h1: 'Talk to a person, not a ticket queue.',
    lede: 'Four routes, depending on what you need. Editorial and support go to humans who can actually change the outcome.',
    crumbItems: [{ label: 'Contact' }],
  })}

${section({
    body: `<div class="grid g-4">
    ${[
      ['Sales and demos', site.email, 'Volume pricing, agency workspaces, enterprise scoping and demos. Response within one business day.'],
      ['Editorial desk', site.pressEmail, 'Submission questions, corrections, retractions and embargo coordination.'],
      ['Customer support', site.supportEmail, 'Account access, billing, reporting and technical issues.'],
      ['Journalist enquiries', 'journalists.html', 'Media assets, executive interviews, data requests and comment.'],
    ].map(([t, a, c]) => `<article class="card spotlight" data-reveal>
      <div class="card-icon">${icon(t.includes('Sales') ? 'trend' : t.includes('Editorial') ? 'file' : t.includes('Journalist') ? 'mic' : 'mail')}</div>
      <h3>${t}</h3>
      <p>${c}</p>
      <p class="mt-3"><a class="link-arrow" href="${a.includes('@') ? `mailto:${a}` : a}">${a.includes('@') ? a : 'For journalists'} ${icon('arrow')}</a></p>
    </article>`).join('')}
  </div>

  <div class="split mt-4" style="align-items:start">
    <form class="panel panel-glass" data-form="contact" novalidate style="padding:clamp(1.25rem,3vw,2rem);border-radius:var(--r-xl)">
      <h2 style="font-size:var(--step-2)">Send us a message</h2>
      <div class="form-grid mt-3">
        <div class="field"><label for="c-name">Name</label><input class="input" id="c-name" name="name" required autocomplete="name"></div>
        <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="c-org">Organisation</label><input class="input" id="c-org" name="organisation" autocomplete="organization"></div>
        <div class="field"><label for="c-topic">Topic</label>
          <select class="select" id="c-topic" name="topic" required>
            <option>Pricing or a quote</option><option>Agency workspace</option><option>Enterprise or SSO</option>
            <option>Editorial or a correction</option><option>Technical support</option><option>Partnership</option><option>Something else</option>
          </select>
        </div>
        <div class="field span-2"><label for="c-message">Message</label><textarea class="textarea" id="c-message" name="message" required minlength="20" placeholder="Tell us what you are trying to do. If it is about a release, include the headline."></textarea></div>
      </div>
      <button class="btn mt-3" type="submit">Send message ${icon('arrow')}</button>
      <p class="form-status" data-form-status aria-live="polite"></p>
    </form>

    <div class="stack" style="--flow:1rem">
      <div class="panel panel-glass" style="padding:1.5rem">
        <h3>Head office</h3>
        <p class="muted mt-2" style="font-size:var(--step--1)">${site.legalName}<br>${site.address.street}<br>${site.address.city}, ${site.address.region} ${site.address.postalCode}<br>${site.address.country}</p>
        <p class="mt-3" style="font-size:var(--step--1)"><a href="tel:${site.phone.replace(/[^+\d]/g, '')}" style="color:var(--cyan)">${site.phone}</a></p>
      </div>
      <div class="panel panel-glass" style="padding:1.5rem">
        <h3>Editorial hours</h3>
        <p class="muted mt-2" style="font-size:var(--step--1)">Monday to Friday, 06:00–22:00 UTC. Crisis lane: 24 hours, every day, for Newsmaker and Studio customers.</p>
      </div>
      <div class="panel panel-glass" style="padding:1.5rem">
        <h3>Careers</h3>
        <p class="muted mt-2" style="font-size:var(--step--1)">We hire editors and engineers. <a href="careers.html" style="color:var(--cyan)">See open roles</a>.</p>
      </div>
    </div>
  </div>`,
  })}

${ctaBand({ title: 'Not sure which service you need?', text: 'Describe the announcement. We will tell you which lanes we would run and what it would cost — including when the answer is fewer lanes than you expected.', primary: 'See pricing', primaryHref: 'pricing.html', secondary: 'How it works', secondaryHref: 'how-it-works.html' })}`,
};

/* ---------------------------------------------------------------------- faq */
const faqPage = {
  slug: 'faq',
  title: `Frequently Asked Questions | ${site.name}`,
  description:
    'Answers on press release distribution, pricing, editorial review, AI visibility, syndication, corrections and reporting — collected in one place.',
  keywords: ['press release FAQ', 'newswire questions', 'distribution questions'],
  breadcrumbs: [{ label: 'FAQ' }],
  priority: 0.8,
  faqs: [...faqs.general, ...faqs.pricing, ...faqs.ai, ...faqs.distribution],
  body: `
${pageHero({
    eyebrow: 'FAQ',
    h1: 'Everything we get asked, answered properly.',
    lede: 'Four categories, thirty answers, no marketing deflection. If something is missing, ask us and we will add it.',
    crumbItems: [{ label: 'FAQ' }],
    actions: '<a class="btn" href="contact.html">Ask a question</a><a class="btn btn-ghost" href="submit.html">Submit a release</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos is a press release distribution and AI visibility platform. Releases cost from $149 with no subscription, are reviewed by human editors, publish to 2,400+ media destinations across 68 countries in a median of 42 minutes, and include pickup, backlink and AI citation reporting.'),
  })}

${section({
    body: `<div class="grid g-2" style="align-items:start;gap:clamp(1.5rem,4vw,3rem)">
    <div class="stack" style="--flow:2rem">
      <div>
        <p class="eyebrow" style="margin-bottom:1rem">General</p>
        <div class="faq-list" data-accordion="single">
          ${faqs.general.map((f) => `<div class="faq-item">
            <h3 style="margin:0"><button class="faq-q" type="button">${f.q}<span class="icon" aria-hidden="true"></span></button></h3>
            <div class="faq-a"><div class="faq-a-inner prose" style="font-size:var(--step-0)">${f.a}</div></div>
          </div>`).join('')}
        </div>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:1rem">AI visibility</p>
        <div class="faq-list" data-accordion="single">
          ${faqs.ai.map((f) => `<div class="faq-item">
            <h3 style="margin:0"><button class="faq-q" type="button">${f.q}<span class="icon" aria-hidden="true"></span></button></h3>
            <div class="faq-a"><div class="faq-a-inner prose" style="font-size:var(--step-0)">${f.a}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="stack" style="--flow:2rem">
      <div>
        <p class="eyebrow" style="margin-bottom:1rem">Pricing</p>
        <div class="faq-list" data-accordion="single">
          ${faqs.pricing.map((f) => `<div class="faq-item">
            <h3 style="margin:0"><button class="faq-q" type="button">${f.q}<span class="icon" aria-hidden="true"></span></button></h3>
            <div class="faq-a"><div class="faq-a-inner prose" style="font-size:var(--step-0)">${f.a}</div></div>
          </div>`).join('')}
        </div>
      </div>
      <div>
        <p class="eyebrow" style="margin-bottom:1rem">Distribution</p>
        <div class="faq-list" data-accordion="single">
          ${faqs.distribution.map((f) => `<div class="faq-item">
            <h3 style="margin:0"><button class="faq-q" type="button">${f.q}<span class="icon" aria-hidden="true"></span></button></h3>
            <div class="faq-a"><div class="faq-a-inner prose" style="font-size:var(--step-0)">${f.a}</div></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`,
  })}

${ctaBand({ title: 'Still have a question?', text: 'Ask it directly. We answer questions from people who have not bought anything, and we will tell you when we are not the right fit.' })}`,
};

/* ---------------------------------------------------------------- resources */
const resources = {
  slug: 'resources',
  title: `PR Resource Library | Templates, Guides & Tools | ${site.name}`,
  description:
    'Free press release templates, PR checklists, SEO and AI visibility guides, a glossary of industry terms and planning tools for comms teams.',
  keywords: ['press release template', 'PR resources', 'press release checklist', 'PR tools'],
  breadcrumbs: [{ label: 'Resources' }],
  priority: 0.8,
  body: `
${pageHero({
    eyebrow: 'Resources',
    h1: 'Everything you need before you hit publish.',
    lede: 'Templates, checklists and guides written by the editors who review releases every day. No email gate on any of it.',
    crumbItems: [{ label: 'Resources' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="glossary.html">Browse the glossary</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('The PressCosmos resource library contains press release templates for eight announcement types, pre-submission checklists, guides on writing, SEO PR and AI visibility, a glossary of more than 40 industry terms, and planning tools such as a distribution tier selector and a crisis statement builder.'),
  })}

${section({
    eyebrow: 'Templates',
    title: 'Press release templates',
    lede: 'Copy the structure, replace the specifics. Each template includes the headings an editor expects and the elements that most often go missing.',
    body: `<div class="grid g-3">
    ${[
      ['Funding announcement', 'Structure for a raise, with the disclosure items investors and reporters expect.', 'how-to-write-a-press-release.html'],
      ['Product launch', 'Lead with what changed and for whom, plus the substantiation an editor will ask for.', 'how-to-write-a-press-release.html'],
      ['Earnings release', 'Result framing, comparison basis and the analyst-facing elements.', 'investor-relations.html'],
      ['Appointment or hire', 'Executive announcements without the boilerplate biography padding.', 'how-to-write-a-press-release.html'],
      ['Partnership or contract win', 'Disclosable terms, customer naming and the numbers that make it material.', 'distribution.html'],
      ['Crisis holding statement', 'Six pre-approved statement shapes, ready to adapt under pressure.', 'crisis-communications.html'],
      ['Research or report launch', 'Methodology, sample size and the finding stated plainly in the first line.', 'ai-visibility.html'],
      ['Event or award', 'What to include so a listings desk can act on it without emailing you.', 'entertainment.html'],
    ].map(([t, c, h]) => `<a class="card spotlight" href="${h}" data-reveal>
      <div class="card-icon">${icon('file')}</div>
      <h3>${t}</h3><p>${c}</p>
    </a>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Checklists',
    title: 'Pre-submission checklists',
    body: `<div class="grid g-2">
    <div class="panel panel-glass" style="padding:1.6rem">
      <h3>Release quality</h3>
      ${listCheck([
      'Headline states the news and fits under 100 characters',
      'Dateline present with city and date',
      'First paragraph answers who, what, when, where, why',
      'At least one specific, verifiable number',
      'Quote from a named person with a real title',
      'Boilerplate current and factual',
      'Media contact monitored during working hours',
    ])}
    </div>
    <div class="panel panel-glass" style="padding:1.6rem">
      <h3>Search and AI readiness</h3>
      ${listCheck([
      'Answer block of 40–60 words near the top',
      'Organisation named consistently on every mention',
      'Subheadings phrased as real questions',
      'Image assets with descriptive alt text',
      'Canonical URL on the hosted release page',
      'No hidden text, cloaking or prompt injection',
    ])}
    </div>
  </div>`,
  })}

${section({
    eyebrow: 'Guides',
    title: 'In-depth guides',
    body: `<div class="card-grid">
    ${[
      ['How to write a press release that gets picked up', 'The structure, the openings that get rejected, and the checklist.', 'how-to-write-a-press-release.html', 0],
      ['Press release SEO: the complete guide', 'Keyword mapping, on-page structure and backlink realities.', 'press-release-seo-guide.html', 1],
      ['AEO, GEO and LLMO explained', 'What each discipline requires from a comms team.', 'aeo-geo-llmo-explained.html', 2],
      ['What distribution should cost in 2026', 'Price bands, cost drivers and how to spot a padded network.', 'press-release-pricing-guide.html', 3],
      ['How AI search changed PR', 'Fewer clicks, more summarised answers, and what to measure now.', 'ai-search-pr-2026.html', 4],
      ['Compare distribution platforms', 'PressCosmos against five alternatives, including where we lose.', 'compare.html', 5],
    ].map(([t, c, h, seed]) => storyCard({
      href: h, title: t, excerpt: c, category: 'Guide',
      date: { label: 'Updated ' + site.buildDate, iso: site.buildDate },
      readTime: 'Reference', seed,
    })).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Tools',
    title: 'Planning tools',
    body: `<div class="grid g-3">
    ${[
      ['Distribution tier selector', 'Answer four questions about your announcement and get a recommended tier ladder.', 'distribution.html'],
      ['Crisis statement builder', 'Assemble a holding statement from approved language in minutes.', 'crisis-communications.html'],
      ['AI visibility audit', 'We run your tracked question set across nine engines and send you the raw answers.', 'ai-visibility.html'],
    ].map(([t, c, h]) => card({ iconName: 'bolt', title: t, text: c, href: h, cta: 'Open' })).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Use the resources, then test one release.', text: 'The guides are free and ungated. If they help, the fastest way to check our work is one $149 distribution.' })}`,
};

/* ----------------------------------------------------------------- glossary */
const glossaryTerms = [
  ['AEO', 'Answer Engine Optimisation — structuring content so an answer engine can extract and present it as a direct answer, typically through summary blocks, question-shaped headings and FAQ structured data.'],
  ['AIO', 'AI Optimisation — an umbrella term covering AEO, GEO and LLMO. Often used loosely in vendor marketing; it has no precise technical definition.'],
  ['AMP', 'Accelerated Mobile Pages — a deprecated Google initiative that restricted markup. Rarely relevant to press releases in 2026.'],
  ['Anchor text', 'The visible, clickable text of a hyperlink. In press release SEO, natural anchor variation from syndicating outlets matters more than engineered anchors.'],
  ['Boilerplate', 'The standard "About" paragraph appended to a release, describing the issuing organisation. Reproduced verbatim by syndicating outlets, so it must be current.'],
  ['Canonical URL', 'The URL declared as the authoritative version of a page, preventing duplicate-content problems when a release is syndicated widely.'],
  ['Cost per pickup', 'Total distribution cost divided by the number of outlets with genuine audiences that carried the release. The most useful single comparison metric between providers.'],
  ['Dateline', 'The city and date at the start of a release, establishing geographic and temporal grounding.'],
  ['Distribution tier', 'A grouping of outlets by reach and type. Tier 1 is national and international newswire; Tier 4 is machine-readable feeds and AI retrieval systems.'],
  ['Dofollow', 'A link without the rel="nofollow" attribute, allowing search engines to count it as a ranking signal. Most syndicated press release links are nofollow.'],
  ['Embargo', 'An agreement that a release is not published before a specified time. Honoured to the minute and timezone when set explicitly.'],
  ['Earned media', 'Coverage produced by a journalist or outlet without payment. Distinct from paid placement, which must be labelled.'],
  ['Entity', 'A distinct thing — organisation, person, place, product — that search and AI systems model separately. Writing entities consistently is central to LLMO.'],
  ['GEO', 'Generative Engine Optimisation — optimising to be cited and attributed inside AI-generated responses, which depends on corroboration and authority more than formatting.'],
  ['Google News', 'A Google surface for news content. Inclusion depends on publisher status and technical signals rather than any single submission mechanism.'],
  ['Holding statement', 'A short, pre-approved public statement issued immediately after an incident, before full facts are established.'],
  ['Impressions', 'A count of potential exposures. Frequently inflated and largely unusable for decision-making in PR reporting.'],
  ['JSON-LD', 'A JSON format for embedding structured data in a web page, used here for Organization, NewsArticle, FAQPage and HowTo schema.'],
  ['Knowledge graph', 'A structured database of entities and relationships, such as the knowledge graph behind search engines\' entity understanding and many retrieval systems.'],
  ['LLMO', 'Large Language Model Optimisation — making an organisation factually retrievable and correctly described by language models, through entity clarity, structured data and an open crawler policy.'],
  ['llms.txt', 'A proposed convention for a plain-text file that summarises a site for language models, placed at the site root.'],
  ['Material news', 'Information a reasonable investor would consider important to a decision. Typically subject to disclosure rules and quiet-period controls.'],
  ['Media list', 'The set of journalists and outlets targeted for a story. In this context, the contracted distribution destinations for a release.'],
  ['Multichannel amplification', 'Distributing a single announcement across owned, earned and paid channels simultaneously.'],
  ['NewsArticle schema', 'Structured data markup describing a news article, including headline, date, author and publisher. Drives rich results and improves machine comprehension.'],
  ['Newsroom', 'An organisation\'s own press centre. A branded newsroom hosted on your domain compounds authority rather than donating it to a third-party site.'],
  ['Newswire', 'A service that distributes announcements to media organisations and data feeds. Historically satellite and teletype based, now entirely digital.'],
  ['Nofollow', 'An attribute telling search engines not to count a link as a ranking signal. Common on syndicated content and user-generated pages.'],
  ['Organization schema', 'Structured data describing an organisation\'s identity, location, contacts and profiles. The foundation of LLMO.'],
  ['Pickup', 'An instance of an outlet carrying your release or reporting from it. Pickup rate is the proportion of targeted outlets that carried the story.'],
  ['Pickup map', 'A geographic visualisation of where a release was carried, used to plan regional targeting for future campaigns.'],
  ['Press release', 'A written announcement distributed to media, now also read by search engines, aggregators and AI retrieval systems.'],
  ['Quiet period', 'A defined window in which an organisation restricts external communications, commonly around financial reporting.'],
  ['Share of answer', 'The proportion of responses to a fixed question set in which your brand appears, measured across AI answer engines.'],
  ['Share of voice', 'Your proportion of total category coverage or mentions compared with named competitors over a given period.'],
  ['Spam compliance', 'Adherence to search engine guidelines on paid links, cloaking and manipulative content. Violations create penalty risk on your domain, not the vendor\'s.'],
  ['Structured data', 'Machine-readable markup added to a page that describes its content, enabling rich results and better machine comprehension.'],
  ['Syndication', 'Republishing the same release across multiple outlets and feeds. The mechanism by which distribution creates reach and corroboration.'],
  ['Terminal delivery', 'Distribution to financial data terminals used by analysts and traders, required for material financial news.'],
  ['Tier 1 wire', 'The top tier of distribution, reaching national and international newswires and major financial media.'],
  ['Wire fee', 'A charge applied by some providers per additional outlet group or for premium placement lanes, often not shown in headline pricing.'],
  ['Zero-click', 'A search or AI interaction where the user gets their answer without visiting a website. Increasingly the norm for factual and comparative questions.'],
];

const glossary = {
  slug: 'glossary',
  title: `Press Release & PR Glossary | ${site.name}`,
  description:
    'A glossary of press release, SEO, AI visibility and media measurement terms — from AEO and GEO to pickup rate, share of answer and zero-click search.',
  keywords: ['PR glossary', 'press release terms', 'SEO glossary', 'AI visibility definitions'],
  breadcrumbs: [{ label: 'Resources', href: 'resources.html' }, { label: 'Glossary' }],
  priority: 0.7,
  body: `
${pageHero({
    eyebrow: 'Resources',
    h1: 'The vocabulary, defined without the sales pitch.',
    lede: 'Forty-two terms that appear in distribution contracts, SEO decks and AI visibility proposals — with definitions you can act on.',
    crumbItems: [{ label: 'Resources', href: 'resources.html' }, { label: 'Glossary' }],
    actions: '<a class="btn" href="resources.html">Back to resources</a><a class="btn btn-ghost" href="contact.html">Suggest a term</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('This glossary defines press release distribution, SEO and AI visibility terminology, including AEO, GEO, LLMO, canonical URL, pickup rate, share of answer, dofollow, nofollow, structured data, newsroom, newswire, embargo, boilerplate and zero-click search.'),
  })}

${section({
    className: 'section-tight',
    body: `<div class="card-grid" style="grid-template-columns:repeat(2,1fr)">
    ${glossaryTerms.map(([term, def], i) => `<article class="card spotlight" data-reveal="blur" id="term-${term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
      <h3 style="font-size:var(--step-1)">${term}</h3>
      <p>${def}</p>
    </article>`).join('')}
  </div>
  <p class="mono faint mt-3">${glossaryTerms.length} terms. Missing one? <a href="contact.html" style="color:var(--cyan)">Tell us</a> and we will add it with attribution.</p>`,
  })}

${ctaBand({ title: 'Definitions are easy. Pickup is not.', text: 'If you would rather the release just worked, submit one and read the report.' })}`,
};

/* ----------------------------------------------------------------- partners */
const partners = {
  slug: 'partners',
  title: `Distribution Partners & Channel Programme | ${site.name}`,
  description:
    'PressCosmos distribution partners, syndication network and channel programme for agencies, media monitoring vendors and PR software platforms.',
  keywords: ['press release distribution partners', 'syndication partners', 'PR technology partnership'],
  breadcrumbs: [{ label: 'Company', href: 'about.html' }, { label: 'Partners' }],
  priority: 0.6,
  body: `
${pageHero({
    eyebrow: 'Company',
    h1: 'The network behind the distribution.',
    lede: 'PressCosmos distributes through contracted editorial and feed partners. We publish the categories we contract with rather than a logo wall we cannot substantiate.',
    crumbItems: [{ label: 'Company', href: 'about.html' }, { label: 'Partners' }],
    actions: '<a class="btn" href="contact.html">Become a partner</a><a class="btn btn-ghost" href="distribution.html">Distribution details</a>',
  })}

${section({
    body: answer('PressCosmos contracts distribution through newswire partners, regional and metro press desks, industry trade publications, broadcaster and podcast networks, news aggregators, financial data feeds and AI retrieval systems. Partner names are disclosed to customers in the delivery log for each release.'),
  })}

${section({
    eyebrow: 'Network',
    title: 'Partner categories',
    body: `<div class="grid g-2">
    ${[
      ['Newswire and feed partners', 'Contracted lanes carrying releases to national and international newswire feeds and data terminals.'],
      ['Regional and metro press', 'Local dailies, business journals and city desks reached through regional routing.'],
      ['Industry trade publications', 'Sector-specific titles across twelve verticals, each with its own editorial gate.'],
      ['Broadcast and podcast networks', 'Audio and video desks that pick up newsworthy announcements for segments.'],
      ['Aggregators and news apps', 'Distribution platforms and news applications that surface releases to consumer audiences.'],
      ['AI and retrieval systems', 'Machine-readable feeds and open crawler access enabling citation inside AI answers.'],
    ].map(([t, c]) => card({ iconName: 'globe', title: t, text: c })).join('')}
  </div>
  <div class="callout mt-4" data-reveal>
    <strong>Why we do not list partner logos</strong>
    Using a media company's trademark to imply a commercial relationship that is not documented is a legal risk and a credibility risk. Every customer receives the actual delivery list for their own release, which is more useful than a logo wall anyway.
  </div>`,
  })}

${section({
    eyebrow: 'Channel programme',
    title: 'Partner with PressCosmos',
    body: `<div class="grid g-3">
    ${[
      ['PR agencies', 'White-label distribution, multi-client workspaces and reporting under your own brand. Volume pricing from ten releases a month.', 'agencies.html'],
      ['Media monitoring vendors', 'Add distribution to your monitoring product through our API, with revenue share on distributed releases.', 'contact.html'],
      ['PR software platforms', 'Embed distribution as a feature through the PressCosmos API, with embeddable reporting components.', 'contact.html'],
      ['Newswire and feed operators', 'Licence our AI visibility layer and answer-engine formatting for your existing distribution network.', 'contact.html'],
      ['Resellers and consultants', 'Referral and reseller terms for consultants who advise comms teams but do not distribute themselves.', 'contact.html'],
      ['Academic and non-profit', 'Reduced or free distribution for qualifying public-interest research and student journalism projects.', 'contact.html'],
    ].map(([t, c, h]) => card({ iconName: 'layers', title: t, text: c, href: h, cta: 'Learn more' })).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Interested in a channel agreement?', text: 'Tell us what you already do well and where distribution fits. Most partnership conversations start with one joint customer.', primary: 'Contact partnerships', primaryHref: 'contact.html' })}`,
};

/* ------------------------------------------------------------------ careers */
const careers = {
  slug: 'careers',
  title: `Careers at PressCosmos | ${site.name}`,
  description:
    'Open roles at PressCosmos across editorial, distribution operations, search and AI engineering, and customer success. Remote-first, with a published salary range on every role.',
  keywords: ['press release company jobs', 'PR tech careers', 'editorial jobs remote'],
  breadcrumbs: [{ label: 'Company', href: 'about.html' }, { label: 'Careers' }],
  priority: 0.5,
  body: `
${pageHero({
    eyebrow: 'Careers',
    h1: 'Small team, published salaries, unglamorous problems.',
    lede: 'We are building distribution infrastructure and editing other people\'s news. Both require people who care about details that nobody notices when they are right.',
    crumbItems: [{ label: 'Company', href: 'about.html' }, { label: 'Careers' }],
    actions: '<a class="btn" href="mailto:careers@presscosmos.com">Send an application</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos is a remote-first company headquartered in San Francisco. Every open role lists a published salary range. We hire across editorial, distribution operations, search and AI engineering, and customer success, with an interview process of four stages completed inside three weeks.'),
  })}

${section({
    eyebrow: 'Open roles',
    title: 'Currently hiring',
    body: `<div class="stack" style="--flow:0">
    ${[
      ['Senior Editor — Financial Services', 'Editorial', 'Remote (US/EU)', '$105,000 – $128,000', 'Own review quality for the finance vertical, and maintain the substantiation standards that decide whether a release goes out.'],
      ['Distribution Operations Manager', 'Operations', 'Remote (US)', '$92,000 – $115,000', 'Maintain partner relationships, monitor lane health, and own the disposition of any delivery failure.'],
      ['Search & AI Engineer', 'Engineering', 'Remote (EU/US)', '$140,000 – $175,000', 'Build the entity graph, structured-data pipeline and share-of-answer measurement across nine engines.'],
      ['Customer Success Lead', 'Success', 'San Francisco or remote (US)', '$98,000 – $122,000', 'Own onboarding and retention for Studio and enterprise accounts, including quarterly reporting reviews.'],
    ].map(([t, team, loc, salary, desc]) => `<article class="release-row">
      <div><p class="where">${team}</p><p class="mono faint" style="margin-top:.35rem">${loc}</p></div>
      <div>
        <h3 style="font-size:var(--step-1)">${t}</h3>
        <p class="muted" style="margin-top:.4rem;font-size:var(--step--1)">${desc}</p>
        <p class="mono" style="margin-top:.5rem;color:var(--lime)">${salary}</p>
      </div>
      <a class="btn btn-ghost btn-sm" href="mailto:careers@presscosmos.com?subject=Application: ${encodeURIComponent(t)}">Apply</a>
    </article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Process',
    title: 'How hiring works here',
    body: `<ol class="grid g-4" data-stagger>
    ${[
      ['Application review', 'A human reads every application. You get a decision either way within five business days.'],
      ['Craft conversation', 'Forty-five minutes with the hiring manager on how you actually work.'],
      ['Practical exercise', 'A paid, time-boxed exercise based on a real problem. Never free spec work.'],
      ['Team and offer', 'Two conversations with the people you would work with, then a decision within three days.'],
    ].map(([t, c], i) => `<li class="card spotlight"><p class="mono gradient-text" style="font-size:var(--step-2);font-weight:700">0${i + 1}</p><h3 style="margin-top:.5rem">${t}</h3><p>${c}</p></li>`).join('')}
  </ol>`,
  })}

${section({
    eyebrow: 'Benefits',
    title: 'What we offer',
    body: `<div class="grid g-3">
    ${[
      ['Published salary bands', 'Every role has a range in the advert. No negotiation lottery based on who asks hardest.'],
      ['Four-day publishing weeks in August', 'Editorial runs a reduced schedule for one month a year, fully paid.'],
      ['Remote-first with a real office', 'Work where you like; the San Francisco office exists for the people who want it.'],
      ['Health, dental and vision', 'Employer-funded for you and dependants in the US; equivalent stipend elsewhere.'],
      ['Learning budget', '$2,500 per year for conferences, courses and books, no approval theatre.'],
      ['Parental leave', 'Sixteen weeks at full pay for all parents, from day one of employment.'],
    ].map(([t, c]) => card({ iconName: 'star', title: t, text: c })).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Do not see your role?', text: 'If you have run a newsroom, a wire desk or a retrieval pipeline and you think we are doing something wrong, tell us. We read every message.', primary: 'Email careers@presscosmos.com', primaryHref: 'mailto:careers@presscosmos.com', secondary: 'About PressCosmos', secondaryHref: 'about.html' })}`,
};

/* ------------------------------------------------------------- case studies */
const caseStudies = {
  slug: 'case-studies',
  title: `PR Case Studies & Distribution Results | ${site.name}`,
  description:
    'Worked examples of press release campaigns with the numbers: pickup rates, backlinks earned, AI citation share and the routing decisions that made the difference.',
  keywords: ['PR case study', 'press release results', 'distribution case study'],
  breadcrumbs: [{ label: 'Newsroom', href: 'newsroom.html' }, { label: 'Case studies' }],
  priority: 0.6,
  body: `
${pageHero({
    eyebrow: 'Case studies',
    h1: 'What happened, with the numbers attached.',
    lede: 'Three worked examples. Each includes what we got wrong, because a case study without a mistake in it is a brochure.',
    crumbItems: [{ label: 'Newsroom', href: 'newsroom.html' }, { label: 'Case studies' }],
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('These case studies document press release campaigns distributed through PressCosmos, reporting pickup rates, referring domains earned, AI citation share change and the routing decisions behind the results. Figures are from client-approved reporting for illustrative campaigns.'),
  })}

${section({
    body: `<div class="stack" style="--flow:2.5rem">
    ${[
      {
        client: 'B2B software · Series B',
        title: 'A funding announcement that needed category authority, not volume',
        problem: 'A Series B raise was being framed as a funding story. The category, not the cheque, was the real news.',
        did: 'Reframed the release around a published benchmark on onboarding time inside a 21-country distribution with three language variants.',
        results: [['312', 'pickups in 72 hours'], ['47', 'referring domains earned'], ['3.1×', 'category AI citation share'], ['2,140', 'referral sessions']],
        wrong: 'The first draft buried the benchmark in paragraph six. Moving it to the first paragraph roughly doubled pickup rate on the second send.',
      },
      {
        client: 'Healthcare · Clinical milestone',
        title: 'Regulated results distribution without a compliance problem',
        problem: 'Phase 2 data required careful framing, and the legal team had blocked two previous release drafts.',
        did: 'Built the release inside the constraint: registry references, stage-labelled evidence, and fair-balance language agreed before drafting.',
        results: [['128', 'trade pickups'], ['19', 'clinical outlets'], ['0', 'compliance escalations'], ['64%', 'pickup rate in target tier']],
        wrong: 'We initially omitted the adverse-event rate. It was the first thing every clinical desk asked for, and adding it improved pickup rather than hurting it.',
      },
      {
        client: 'Consumer retail · Store openings',
        title: 'Twelve openings, twelve local stories, one national send avoided',
        problem: 'A national send for a regional store programme produced almost no coverage for three times the cost.',
        did: 'Switched to metro-level targeting around each opening, with local hiring numbers and community details in each release.',
        results: [['94%', 'openings covered locally'], ['11', 'regional business journals'], ['$31', 'cost per local pickup'], ['4.6×', 'regional pickup lift']],
        wrong: 'We sent the first two openings nationwide. Cost per pickup on those was $284 versus $31 once targeting was corrected.',
      },
    ].map((cs) => `<article class="panel panel-glass" style="padding:clamp(1.5rem,4vw,2.5rem);border-radius:var(--r-xl)" data-reveal>
      <p class="eyebrow" style="margin-bottom:1rem">${cs.client}</p>
      <h2 style="font-size:var(--step-2)">${cs.title}</h2>
      <div class="grid g-2 mt-3" style="align-items:start">
        <div class="stack prose" style="--flow:1rem;font-size:var(--step-0)">
          <p><strong>The problem.</strong> ${cs.problem}</p>
          <p><strong>What we did.</strong> ${cs.did}</p>
          <p><strong>What we got wrong.</strong> ${cs.wrong}</p>
        </div>
        <div class="stat-row" style="grid-template-columns:repeat(2,1fr)">
          ${cs.results.map(([v, l]) => `<div><p class="stat-value gradient-text" style="font-size:var(--step-2)">${v}</p><p class="stat-label">${l}</p></div>`).join('')}
        </div>
      </div>
    </article>`).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Want a report shaped like these?', text: 'It is the standard reporting included on Amplify and above. No extra charge, no separate analytics licence.' })}`,
};

/* ------------------------------------------------------------- testimonials */
const testimonialsPage = {
  slug: 'testimonials',
  title: `Customer Reviews & Testimonials | ${site.name}`,
  description:
    'What communications, marketing and investor relations teams say about PressCosmos distribution, editorial review, reporting and AI visibility tracking.',
  keywords: ['press release service reviews', 'PressCosmos testimonials', 'customer reviews PR'],
  breadcrumbs: [{ label: 'Newsroom', href: 'newsroom.html' }, { label: 'Testimonials' }],
  priority: 0.5,
  body: `
${pageHero({
    eyebrow: 'Customers',
    h1: 'What teams say once the report lands.',
    lede: 'Reviews from comms, marketing and investor relations teams who moved a campaign to PressCosmos. Names and organisations are shown as given.',
    crumbItems: [{ label: 'Newsroom', href: 'newsroom.html' }, { label: 'Testimonials' }],
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos customers are communications, marketing and investor relations teams ranging from funded startups to public companies and PR agencies. Reviews consistently cite editorial review speed, pickup reporting quality, and AI citation tracking as the reasons they switched or added PressCosmos alongside an incumbent wire.'),
  })}

${section({ body: `<div class="card-grid">${testimonials.map(quote).join('')}</div>` })}

${section({
    className: 'section-tight',
    body: `<div class="panel panel-glass" style="padding:clamp(1.5rem,4vw,2.5rem);border-radius:var(--r-xl)">
    ${statRow([
    { value: 4.8, suffix: '/5', label: 'Average customer rating' },
    { value: 91, suffix: '%', label: 'Would recommend' },
    { value: 87, suffix: '%', label: 'Renew on a Studio plan' },
    { value: 2400, suffix: '+', label: 'Teams served' },
  ])}
    <p class="mono faint mt-3">Ratings collected from post-campaign surveys. We publish unfavourable feedback on request — ask us for the raw file.</p>
  </div>`,
  })}

${ctaBand({ title: 'Add your own result to this page.', text: 'Run one release and judge the reporting against whatever you use today.' })}`,
};

/* ----------------------------------------------------------------- startups */
const startups = {
  slug: 'startups',
  title: `Press Release Distribution for Startups | ${site.name}`,
  description:
    'Affordable press release distribution for startups: funding announcements, product launches and hiring news, with editorial review and AI visibility from $149.',
  keywords: ['startup press release', 'funding announcement distribution', 'startup PR service'],
  breadcrumbs: [{ label: 'Company', href: 'about.html' }, { label: 'For startups' }],
  priority: 0.6,
  faqs: [
    { q: 'How much should a startup spend on press release distribution?', a: 'For a seed or Series A announcement, $149–$349 per release is usually the right band. Spend more only when you need terminal or broadcast lanes. A startup with no coverage history gets more return from three well-targeted releases than one expensive national blast.' },
    { q: 'Do I need a PR agency as well?', a: 'Not necessarily. Distribution plus a good release covers the publishing layer. Agencies add value in strategy, relationships and pitching — which matters more once you have a story that a journalist is already likely to take.' },
    { q: 'What is worth announcing as a startup?', a: 'Funding, meaningful product launches with numbers, first enterprise customers, notable hires, open-source releases and original data. Routine minor updates dilute attention and rarely travel.' },
    { q: 'Can I announce a raise before the round closes?', a: 'Only with the lead investor\'s consent and agreed language. Publishing a funding round prematurely is a genuine legal risk, and our editors will ask for confirmation.' },
  ],
  body: `
${pageHero({
    eyebrow: 'For startups',
    h1: 'One announcement, properly distributed, at a price a startup can absorb.',
    lede: 'You do not need a retainer to be taken seriously. You need a well-written release, routed to the right desks, with a report you can show your board.',
    crumbItems: [{ label: 'Company', href: 'about.html' }, { label: 'For startups' }],
    actions: '<a class="btn" href="submit.html">Submit a release</a><a class="btn btn-ghost" href="pricing.html">See pricing</a>',
    aside: `<div class="panel panel-glass" style="padding:1.5rem" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">Startup essentials</p>
      ${listCheck(['$149 entry price', 'No subscription or minimum', 'Editorial review included', 'AI visibility formatting included', 'Permanent hosted release page'])}
    </div>`,
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos offers startups pay-per-release distribution from $149 with no subscription, including human editorial review, AI answer-engine formatting, a permanent hosted release page and a pickup report. Typical startup announcements are funding rounds, product launches, significant hires and original data.'),
  })}

${section({
    eyebrow: 'Priorities',
    title: 'Where a startup should spend its announcement budget',
    body: `<div class="grid g-4">
    ${[
      ['1. The funding round', 'Your highest-leverage release. It creates a permanent public record of validation that investors and candidates both check.'],
      ['2. The product that changed something', 'Not every feature. The one that changes what a customer can do, with a number attached.'],
      ['3. Original data', 'A benchmark or survey nobody else has. This is the cheapest way for a small company to earn real links.'],
      ['4. The hire that signals direction', 'A senior hire from a recognisable company tells the market what you are building next.'],
    ].map(([t, c], i) => `<article class="card spotlight" data-reveal><p class="mono gradient-text" style="font-size:var(--step-1);font-weight:700">0${i + 1}</p><h3 style="margin-top:.5rem">${t}</h3><p>${c}</p></article>`).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Mistakes',
    title: 'What wastes a startup\'s first release',
    body: `<div class="split">
    <div class="stack prose" style="--flow:1rem">
      <p>Three patterns account for most disappointing startup campaigns, and none of them are about budget.</p>
    </div>
    <div class="grid" style="gap:1rem">
      ${callout({ title: 'Announcing everything', text: 'Six releases in a quarter for minor updates trains every desk to ignore you. Three meaningful ones build a pattern of being worth reading.' })}
      ${callout({ title: 'Sending nationwide to a local story', text: 'A city-level milestone sent nationally reaches nobody. Metro targeting is the single biggest improvement most startups can make.' })}
      ${callout({ title: 'Leading with the cheque', text: 'Investors are not the audience. Customers, candidates and partners are. Lead with what the money lets you do.' })}
    </div>
  </div>`,
  })}

${faqSection({ items: [
      { q: 'How much should a startup spend on press release distribution?', a: 'For a seed or Series A announcement, $149–$349 per release is usually the right band. Spend more only when you need terminal or broadcast lanes. Three well-targeted releases outperform one expensive national blast.' },
      { q: 'Do I need a PR agency as well?', a: 'Not necessarily. Distribution plus a good release covers the publishing layer. Agencies add strategy, relationships and pitching, which matter most once a journalist is already likely to take the story.' },
      { q: 'What is worth announcing as a startup?', a: 'Funding, meaningful product launches with numbers, first enterprise customers, notable hires, open-source releases and original data. Routine minor updates dilute attention.' },
      { q: 'Can I announce a raise before the round closes?', a: 'Only with lead-investor consent and agreed language. Premature funding announcements are a real legal risk, and our editors will ask for confirmation before publishing.' },
    ], title: 'Startup questions', eyebrow: 'Answers' })}
${ctaBand({ title: 'Your next announcement, properly done.', text: '$149, no subscription, and you keep the report.' })}`,
};

/* ----------------------------------------------------------------- agencies */
const agencies = {
  slug: 'agencies',
  title: `Press Release Distribution for PR Agencies | ${site.name}`,
  description:
    'White-label distribution, multi-client workspaces, shared routing presets and client-ready reporting for PR agencies. Volume pricing from ten releases a month.',
  keywords: ['white label press release distribution', 'PR agency distribution', 'agency PR platform'],
  breadcrumbs: [{ label: 'Company', href: 'about.html' }, { label: 'For agencies' }],
  priority: 0.6,
  faqs: [
    { q: 'Can we put our own branding on the reports?', a: 'Yes. White-label reporting is included on agency workspaces: your logo, your colours, your domain on shared report links. Clients never see PressCosmos branding.' },
    { q: 'How does multi-client separation work?', a: 'Each client gets an isolated workspace with its own media lists, routing presets, users and reporting. Assets and contact databases are not shared between client workspaces.' },
    { q: 'What is the volume discount?', a: 'Volume pricing starts at 22% below list from ten releases per month and scales from there. Agencies typically consolidate all client distribution into one billing entity.' },
    { q: 'Can we bill our clients directly through you?', a: 'Yes. Agency workspaces support pass-through billing with per-client line items, or consolidated invoicing with your own margin applied. Your choice.' },
  ],
  body: `
${pageHero({
    eyebrow: 'For agencies',
    h1: 'Run every client\'s distribution without rebuilding the workflow each time.',
    lede: 'Multi-client workspaces, saved routing presets and white-label reporting. The boring parts of agency distribution, done once.',
    crumbItems: [{ label: 'Company', href: 'about.html' }, { label: 'For agencies' }],
    actions: '<a class="btn" href="contact.html">Request a workspace quote</a><a class="btn btn-ghost" href="testimonials.html">Read agency reviews</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos agency workspaces provide white-label distribution and reporting, isolated multi-client workspaces, saved routing presets, volume pricing from ten releases per month at 22% below list, and consolidated or pass-through billing. Agency clients never see PressCosmos branding on reports.'),
  })}

${section({
    eyebrow: 'Workflow',
    title: 'What changes when you move agency distribution here',
    body: `<div class="bento" data-stagger>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('users')}</div><h3>Client workspaces</h3><p>Isolated media lists, presets, users and reporting per client. No accidental cross-client asset sharing, and no separate logins to administer.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('layers')}</div><h3>Routing presets</h3><p>Save a client's tier, verticals, metros and approval chain once, then reuse it. Agency teams typically halve submission time.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('file')}</div><h3>White-label reporting</h3><p>Your logo, colours and domain on shared report links. Includes the AI citation section clients ask about and competitors cannot show.</p></article>
    <article class="card b-2 spotlight"><div class="card-icon">${icon('clock')}</div><h3>Approval chains</h3><p>Route through your client's legal or compliance reviewer without leaving the platform, with read receipts for the record.</p></article>
    <article class="card b-4 spotlight"><div class="card-icon">${icon('bolt')}</div><h3>API and bulk submission</h3><p>Programmatic submission for high-volume accounts plus CSV bulk import, so a 40-client month does not become forty manual uploads.</p></article>
  </div>`,
  })}

${section({
    eyebrow: 'Economics',
    title: 'What agencies usually save',
    body: `<div class="grid g-3">
    ${[
      ['Margin on pass-through', 'Distribution is billed per client at your rate. Volume pricing below list is where agency margin comes from.'],
      ['Time recovered', 'Presets, bulk import and saved approval chains remove the repetitive work from every submission.'],
      ['Retention evidence', 'White-label reports with citation tracking give clients a reason to renew that a pickup list alone does not.'],
    ].map(([t, c]) => card({ iconName: 'trend', title: t, text: c })).join('')}
  </div>`,
  })}

${faqSection({ items: [
      { q: 'Can we put our own branding on the reports?', a: 'Yes. White-label reporting is included on agency workspaces: your logo, colours and domain on shared report links.' },
      { q: 'How does multi-client separation work?', a: 'Each client gets an isolated workspace with its own media lists, routing presets, users and reporting. Assets and databases are not shared between workspaces.' },
      { q: 'What is the volume discount?', a: 'Volume pricing starts 22% below list from ten releases per month and scales upward. Most agencies consolidate all client distribution into one billing entity.' },
      { q: 'Can we bill clients through PressCosmos?', a: 'Yes. Use pass-through billing with per-client line items, or consolidated invoicing with your own margin applied.' },
    ], title: 'Agency questions', eyebrow: 'Answers' })}
${ctaBand({ title: 'Get a workspace quote.', text: 'Tell us how many clients and how many releases a month. We will price it below list and show you the reporting first.', primary: 'Request a quote', primaryHref: 'contact.html' })}`,
};

/* --------------------------------------------------------------- enterprise */
const enterprise = {
  slug: 'enterprise',
  title: `Enterprise Press Release Distribution | ${site.name}`,
  description:
    'Enterprise distribution with SSO, approval chains, audit logging, quiet-period controls, custom retention, regional data residency and a signed DPA.',
  keywords: ['enterprise press release distribution', 'PR compliance workflow', 'SSO PR platform'],
  breadcrumbs: [{ label: 'Company', href: 'about.html' }, { label: 'For enterprise' }],
  priority: 0.6,
  body: `
${pageHero({
    eyebrow: 'For enterprise',
    h1: 'Distribution that survives a compliance review.',
    lede: 'SSO, approval chains, append-only audit logs, quiet-period controls and regional data residency. The controls your legal and security teams will ask about before you sign.',
    crumbItems: [{ label: 'Company', href: 'about.html' }, { label: 'For enterprise' }],
    actions: '<a class="btn" href="contact.html">Book a technical review</a><a class="btn btn-ghost" href="investor-relations.html">Investor relations</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos enterprise plans add SAML SSO and SCIM provisioning, configurable approval chains with read receipts, append-only audit logging, quiet-period distribution controls, custom data retention, EU or US data residency, a signed data processing agreement, and a named account team.'),
  })}

${section({
    eyebrow: 'Controls',
    title: 'Security and compliance features',
    body: `<div class="grid g-3">
    ${[
      ['SSO and provisioning', 'SAML 2.0 single sign-on with SCIM user provisioning, enforced MFA and session policies.'],
      ['Approval chains', 'Multi-stage approval with named approvers, read receipts and an immutable record of who signed off and when.'],
      ['Audit logging', 'Append-only logs of every submission, edit, approval and distribution event, exportable for regulators.'],
      ['Quiet-period controls', 'Lock distribution during defined windows, with named-authority override only.'],
      ['Data residency', 'EU-only or US storage for account data and drafts, with documented subprocessor locations.'],
      ['Retention policy', 'Configurable retention for drafts and analytics; published releases are permanent by design.'],
    ].map(([t, c]) => card({ iconName: 'lock', title: t, text: c })).join('')}
  </div>`,
  })}

${section({
    eyebrow: 'Integration',
    title: 'Fits the stack you already have',
    body: `<div class="split">
    <div class="grid" style="gap:1rem">
      ${callout({ title: 'API and webhooks', text: 'Submit releases, poll status and receive pickup events programmatically. Webhooks fire on approval, publication and each detected pickup.' })}
      ${callout({ title: 'SIEM and data export', text: 'Audit and distribution events stream to your SIEM or data warehouse, so PR activity appears in the same place as everything else.' })}
      ${callout({ title: 'CRM and attribution', text: 'UTM conventions, CRM sync and assisted-conversion reporting for teams that need PR to appear in the pipeline model.' })}
    </div>
    <div class="panel panel-glass" style="padding:1.6rem" data-reveal="right">
      <p class="eyebrow" style="margin-bottom:1rem">Procurement checklist</p>
      ${listCheck([
      'SOC 2 Type II report available under NDA',
      'Signed DPA and subprocessor list',
      'Penetration test summary on request',
      'Security questionnaire turnaround: five business days',
      'Regional data residency options',
      '99.9% uptime commitment with service credits',
      'Named account and escalation contacts',
    ])}
    </div>
  </div>`,
  })}

${ctaBand({ title: 'Start with the security review.', text: 'We will send the questionnaire answers, DPA and subprocessor list before anyone talks pricing.', primary: 'Request documentation', primaryHref: 'contact.html', secondary: 'See pricing', secondaryHref: 'pricing.html' })}`,
};

/* -------------------------------------------------------------- journalists */
const journalists = {
  slug: 'journalists',
  title: `For Journalists | Media Resources & Expert Access | ${site.name}`,
  description:
    'Journalist resources from PressCosmos: a searchable release feed, RSS, expert and data requests, media assets, and a direct editorial desk that answers fast.',
  keywords: ['journalist resources', 'press release feed for journalists', 'media resources'],
  breadcrumbs: [{ label: 'Company', href: 'about.html' }, { label: 'For journalists' }],
  priority: 0.5,
  body: `
${pageHero({
    eyebrow: 'For journalists',
    h1: 'Story material, without the paywall or the signup.',
    lede: 'Every release we distribute is public and free to use with attribution. If you need data, an interview or a document, ask the desk directly.',
    crumbItems: [{ label: 'Company', href: 'about.html' }, { label: 'For journalists' }],
    actions: '<a class="btn" href="newsroom.html">Browse the feed</a><a class="btn btn-ghost" href="rss.xml">RSS</a>',
  })}

${section({
    className: 'section-tight pt-0',
    body: answer('PressCosmos provides journalists with a free, searchable press release feed, an RSS subscription, filterable archives by industry and date, media asset access, and a direct editorial desk at newsroom@presscosmos.com for data requests, interviews and verification.'),
  })}

${section({
    body: `<div class="grid g-2">
    ${[
      ['Searchable release feed', 'Filter by industry, company, date or keyword. No account required, no paywall, and no scraping restrictions on the pages themselves.', 'newsroom.html'],
      ['RSS subscription', 'Standard RSS 2.0 feed of every distributed release, updated continuously.', 'rss.xml'],
      ['Data and access requests', 'Original datasets, executive interviews and verification requests handled by a human editor.', 'contact.html'],
      ['Media assets', 'Logos, headshots and product imagery from releases that include them, with usage terms stated.', 'resources.html'],
    ].map(([t, c, h]) => card({ iconName: 'file', title: t, text: c, href: h, cta: 'Open' })).join('')}
  </div>

  <div class="callout mt-4" data-reveal>
    <strong>Our commitment to the desk</strong>
    We label paid placements, we publish corrections with timestamps, we honour embargoes we set, and we do not send you a release that we know is unverifiable. If we get that wrong, email the editorial desk and a person will answer.
  </div>`,
  })}

${section({
    eyebrow: 'Tips',
    title: 'Getting the most out of our feed',
    body: `<div class="grid g-3">
    ${[
      ['Filter, do not scroll', 'Industry and date filters plus keyword search cover the full archive. The feed runs to thousands of releases a year.'],
      ['Subscribe to a slice', 'The RSS feed is the whole firehose. Contact us if you want a filtered feed for a specific beat or region.'],
      ['Ask for the primary source', 'For any figure in a release, the desk can usually provide the underlying source document.'],
    ].map(([t, c]) => card({ iconName: 'search', title: t, text: c })).join('')}
  </div>`,
  })}

${ctaBand({ title: 'Need something today?', text: 'The editorial desk answers journalist requests within two hours during working hours.', primary: `Email ${site.pressEmail}`, primaryHref: `mailto:${site.pressEmail}`, secondary: 'Browse releases', secondaryHref: 'newsroom.html' })}`,
};

/* ---------------------------------------------------------------- sitemap */
const sitemapPage = {
  slug: 'sitemap',
  title: `Sitemap | All Pages on ${site.name}`,
  description: 'Every page on PressCosmos, grouped by section: platform services, industries, pricing, newsroom, resources, company and legal.',
  keywords: ['sitemap', 'PressCosmos pages'],
  breadcrumbs: [{ label: 'Sitemap' }],
  priority: 0.4,
  changefreq: 'weekly',
  body: `
${pageHero({
    eyebrow: 'Sitemap',
    h1: 'Every page, in one place.',
    lede: 'A human-readable index of the site. The machine-readable version is at sitemap.xml, and the AI guidance file is at llms.txt.',
    crumbItems: [{ label: 'Sitemap' }],
    actions: '<a class="btn btn-ghost" href="sitemap.xml">sitemap.xml</a><a class="btn btn-ghost" href="llms.txt">llms.txt</a><a class="btn btn-ghost" href="rss.xml">rss.xml</a>',
  })}

${section({
    body: `<div class="grid g-3" style="gap:clamp(1.5rem,3vw,2.5rem)">
    ${[
      ['Main', [['Home', 'index.html'], ['About', 'about.html'], ['How it works', 'how-it-works.html'], ['Services', 'services.html'], ['Pricing', 'pricing.html'], ['Compare platforms', 'compare.html'], ['Industries', 'industries.html'], ['Contact', 'contact.html'], ['FAQ', 'faq.html'], ['Submit a release', 'submit.html']]],
      ['Platform services', services.map((s) => [s.name, s.href])],
      ['Industries', industries.map((i) => [i.name, `${i.slug}.html`])],
      ['Newsroom', [['Latest releases', 'newsroom.html'], ['Northwind Robotics Series B', 'northwind-robotics-series-b.html'], ['Ledgerline launch', 'ledgerline-reconciliation-launch.html'], ['Halcyon Phase 2', 'halcyon-hlx-204-phase-2.html'], ['Verso Living Portland', 'verso-living-portland-timber.html'], ['Arcline COO appointment', 'arcline-logistics-coo-appointment.html'], ['AI Visibility Suite launch', 'presscosmos-ai-visibility-suite.html']]],
      ['Insights', [['Insights hub', 'blog.html'], ['How to write a press release', 'how-to-write-a-press-release.html'], ['Press release SEO guide', 'press-release-seo-guide.html'], ['AEO, GEO and LLMO explained', 'aeo-geo-llmo-explained.html'], ['What distribution should cost', 'press-release-pricing-guide.html'], ['How AI search changed PR', 'ai-search-pr-2026.html']]],
      ['Resources', [['Resource library', 'resources.html'], ['Glossary', 'glossary.html'], ['Case studies', 'case-studies.html'], ['Testimonials', 'testimonials.html'], ['For journalists', 'journalists.html']]],
      ['Company', [['About', 'about.html'], ['For startups', 'startups.html'], ['For agencies', 'agencies.html'], ['For enterprise', 'enterprise.html'], ['Partners', 'partners.html'], ['Careers', 'careers.html'], ['Contact', 'contact.html']]],
      ['Legal', legalPages.map((l) => [l.name, `${l.slug}.html`])],
    ].map(([title, links]) => `<nav aria-label="${title}">
      <h2 style="font-size:var(--step-1)">${title}</h2>
      <ul class="mt-2" style="display:grid;gap:.45rem">
        ${links.map(([label, href]) => `<li><a href="${href}" style="color:var(--muted);font-size:var(--step--1)">${label}</a></li>`).join('')}
      </ul>
    </nav>`).join('')}
  </div>`,
  })}

${section({
    className: 'section-tight',
    body: `<div class="panel panel-glass" style="padding:clamp(1.5rem,4vw,2.25rem);border-radius:var(--r-xl)">
    ${takeaways([
    'Machine-readable index: <a href="sitemap.xml" style="color:var(--cyan)">sitemap.xml</a>',
    'AI/LLM guidance: <a href="llms.txt" style="color:var(--cyan)">llms.txt</a>',
    'Release feed: <a href="rss.xml" style="color:var(--cyan)">rss.xml</a>',
    'Crawler policy: <a href="robots.txt" style="color:var(--cyan)">robots.txt</a>',
  ])}
  </div>`,
  })}

${ctaBand({ title: 'Found something missing?', text: 'Tell us which page you expected and did not find. We add pages that customers actually look for.' })}`,
};

export const companyPages = [
  submit, contact, faqPage, resources, glossary, partners, careers, caseStudies,
  testimonialsPage, startups, agencies, enterprise, journalists, sitemapPage,
];
