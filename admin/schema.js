// PressCosmos admin — content schema.
//
// One source of truth that drives every generated form in the dashboard.
// Field types: text, email, url, number, boolean, select, textarea, image,
// list (of primitives, or of objects when `fields` is present) and nested
// objects (when `fields` is present without `type: 'list'`).

export const ICON_OPTIONS = [
  'send', 'sparkle', 'radar', 'chart', 'building', 'search', 'shield', 'trend',
  'globe', 'clock', 'users', 'lock', 'bolt', 'layers', 'mail', 'phone', 'pin',
  'file', 'download', 'play', 'star', 'filter', 'quote', 'calendar', 'tag',
  'external', 'check', 'arrow', 'x', 'sun', 'moon', 'cpu', 'mic', 'camera',
];

export const CONTENT_GROUPS = [
  {
    key: 'site', label: 'Brand & contact', icon: 'building', type: 'object',
    hint: 'Site-wide details. They flow into the header, footer, structured data and llms.txt.',
    fields: [
      { name: 'name', label: 'Site name', type: 'text' },
      { name: 'legalName', label: 'Legal entity', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'domain', label: 'Domain (no protocol)', type: 'text' },
      { name: 'baseUrl', label: 'Canonical base URL', type: 'text' },
      { name: 'email', label: 'Sales email', type: 'email' },
      { name: 'pressEmail', label: 'Editorial email', type: 'email' },
      { name: 'supportEmail', label: 'Support email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'founded', label: 'Founded', type: 'text' },
      { name: 'defaultOgImage', label: 'Default share image', type: 'image' },
      { name: 'locale', label: 'Locale', type: 'text' },
      { name: 'language', label: 'Language code', type: 'text' },
      {
        name: 'address', label: 'Address', type: 'object', fields: [
          { name: 'street', label: 'Street', type: 'text' },
          { name: 'city', label: 'City', type: 'text' },
          { name: 'region', label: 'Region / state', type: 'text' },
          { name: 'postalCode', label: 'Postal code', type: 'text' },
          { name: 'country', label: 'Country code', type: 'text' },
        ],
      },
      {
        name: 'social', label: 'Social links', type: 'object', fields: [
          { name: 'x', label: 'X / Twitter', type: 'url' },
          { name: 'linkedin', label: 'LinkedIn', type: 'url' },
          { name: 'youtube', label: 'YouTube', type: 'url' },
          { name: 'instagram', label: 'Instagram', type: 'url' },
        ],
      },
    ],
  },
  {
    key: 'stats', label: 'Statistics', icon: 'chart', type: 'list', itemLabel: 'statistic',
    summary: 'label',
    fields: [
      { name: 'value', label: 'Number', type: 'number' },
      { name: 'suffix', label: 'Suffix', type: 'text' },
      { name: 'label', label: 'Label', type: 'text' },
    ],
  },
  {
    key: 'networkChannels', label: 'Network channels', icon: 'globe', type: 'list', itemType: 'text',
    itemLabel: 'channel', hint: 'Feeds the running marquee and llms.txt.',
  },
  {
    key: 'services', label: 'Services', icon: 'layers', type: 'list', itemLabel: 'service', summary: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'short', label: 'Short name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'href', label: 'Page file', type: 'text', hint: 'e.g. distribution.html' },
      { name: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'bullets', label: 'Bullets', type: 'list', itemType: 'text', itemLabel: 'bullet' },
    ],
  },
  {
    key: 'plans', label: 'Pricing plans', icon: 'tag', type: 'list', itemLabel: 'plan', summary: 'name',
    fields: [
      { name: 'name', label: 'Plan name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'price', label: 'Price', type: 'number' },
      { name: 'unit', label: 'Price unit', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'textarea' },
      { name: 'popular', label: 'Highlight as most popular', type: 'boolean' },
      { name: 'features', label: 'Features', type: 'list', itemType: 'text', itemLabel: 'feature' },
    ],
  },
  {
    key: 'industries', label: 'Industries', icon: 'globe', type: 'list', itemLabel: 'industry', summary: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'h1', label: 'Page headline', type: 'text' },
      { name: 'intent', label: 'What it covers', type: 'textarea' },
      { name: 'stat', label: 'Highlighted statistic', type: 'text' },
      { name: 'keywords', label: 'Keywords', type: 'list', itemType: 'text', itemLabel: 'keyword' },
    ],
  },
  {
    key: 'testimonials', label: 'Testimonials', icon: 'quote', type: 'list', itemLabel: 'testimonial', summary: 'name',
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea' },
      { name: 'name', label: 'Person', type: 'text' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
    ],
  },
  {
    key: 'faqs', label: 'FAQs', icon: 'file', type: 'object',
    hint: 'Reused across the FAQ page, service pages and structured data.',
    fields: [
      { name: 'general', label: 'General questions', type: 'list', itemLabel: 'question', summary: 'q', fields: [{ name: 'q', label: 'Question', type: 'text' }, { name: 'a', label: 'Answer', type: 'textarea' }] },
      { name: 'pricing', label: 'Pricing questions', type: 'list', itemLabel: 'question', summary: 'q', fields: [{ name: 'q', label: 'Question', type: 'text' }, { name: 'a', label: 'Answer', type: 'textarea' }] },
      { name: 'ai', label: 'AI visibility questions', type: 'list', itemLabel: 'question', summary: 'q', fields: [{ name: 'q', label: 'Question', type: 'text' }, { name: 'a', label: 'Answer', type: 'textarea' }] },
      { name: 'distribution', label: 'Distribution questions', type: 'list', itemLabel: 'question', summary: 'q', fields: [{ name: 'q', label: 'Question', type: 'text' }, { name: 'a', label: 'Answer', type: 'textarea' }] },
    ],
  },
  {
    key: 'legalPages', label: 'Legal page list', icon: 'file', type: 'list', itemLabel: 'legal page', summary: 'name',
    hint: 'Titles here feed the footer legal column.',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
    ],
  },
  {
    key: 'audienceSegments', label: 'Audience segments', icon: 'users', type: 'list', itemLabel: 'segment', summary: 'name',
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'href', label: 'Page file', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
    ],
  },
  {
    key: 'primaryNav', label: 'Navigation', icon: 'layers', type: 'list', itemLabel: 'menu item', summary: 'label',
    fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'href', label: 'Page file', type: 'text' },
      { name: 'children', label: 'Dropdown links', type: 'list', itemLabel: 'link', summary: 'label', fields: [{ name: 'label', label: 'Label', type: 'text' }, { name: 'href', label: 'Page file', type: 'text' }] },
    ],
  },
  {
    key: 'footerColumns', label: 'Footer', icon: 'layers', type: 'list', itemLabel: 'column', summary: 'title',
    fields: [
      { name: 'title', label: 'Column heading', type: 'text' },
      { name: 'links', label: 'Links', type: 'list', itemLabel: 'link', summary: 'label', fields: [{ name: 'label', label: 'Label', type: 'text' }, { name: 'href', label: 'Page file', type: 'text' }] },
    ],
  },
];

export const CONTENT_KEYS = CONTENT_GROUPS.map((g) => g.key);

export const PAGE_FIELDS = [
  { name: 'title', label: 'SEO title', type: 'text' },
  { name: 'description', label: 'Meta description', type: 'textarea', hint: 'Aim for 150–160 characters.' },
  { name: 'keywords', label: 'Keywords', type: 'list', itemType: 'text', itemLabel: 'keyword' },
  { name: 'type', label: 'Page type', type: 'select', options: ['website', 'article', 'release'] },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'noindex', label: 'Hide from search engines', type: 'boolean' },
  { name: 'priority', label: 'Sitemap priority', type: 'number' },
  { name: 'changefreq', label: 'Sitemap change frequency', type: 'select', options: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'] },
  { name: 'og_image', label: 'Share image', type: 'image' },
  { name: 'html', label: 'Body (HTML)', type: 'textarea', mono: true, hint: 'Editing the body detaches this page from the generated layout. Clear it to reset.' },
];

export const RELEASE_FIELDS = [
  { name: 'title', label: 'Headline', type: 'text' },
  { name: 'summary', label: 'Summary', type: 'textarea' },
  { name: 'body', label: 'Body', type: 'textarea', mono: true },
  { name: 'slug', label: 'Slug', type: 'text', hint: 'e.g. acme-raises-series-a' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'location', label: 'Dateline', type: 'text', hint: 'e.g. SAN FRANCISCO, CA, UNITED STATES' },
  { name: 'issuer', label: 'Issuer', type: 'text' },
];
