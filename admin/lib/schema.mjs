// PressCosmos admin — editable content schema.
//
// This describes every field the admin panel exposes. The browser renders its
// forms straight from this spec, so there is exactly one definition of what is
// editable, and adding a field here is all it takes to surface it in the UI.
//
// Field types: text | number | bool | textarea | lines | pairs | select

import { icons } from '../../tools/ui.mjs';

const ICON_OPTIONS = Object.keys(icons.ICONS).sort();

const iconField = (key = 'icon', label = 'Icon') => ({ key, label, type: 'select', options: ICON_OPTIONS });

export const SECTIONS = [
  {
    key: 'site',
    label: 'Brand & contact',
    kind: 'object',
    help: 'Used site-wide: header, footer, contact details, structured data and llms.txt.',
    fields: [
      { key: 'name', label: 'Site name' },
      { key: 'legalName', label: 'Legal entity name' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'domain', label: 'Domain (no protocol)' },
      { key: 'baseUrl', label: 'Canonical base URL' },
      { key: 'email', label: 'Sales email' },
      { key: 'pressEmail', label: 'Editorial email' },
      { key: 'supportEmail', label: 'Support email' },
      { key: 'phone', label: 'Phone' },
      { key: 'founded', label: 'Founded year' },
      { key: 'defaultOgImage', label: 'Default social share image' },
      { key: 'locale', label: 'Locale (e.g. en_US)' },
      { key: 'language', label: 'Language code (e.g. en)' },
      { key: 'address.street', label: 'Street address' },
      { key: 'address.city', label: 'City' },
      { key: 'address.region', label: 'Region / state' },
      { key: 'address.postalCode', label: 'Postal code' },
      { key: 'address.country', label: 'Country code' },
      { key: 'social.x', label: 'X / Twitter URL' },
      { key: 'social.linkedin', label: 'LinkedIn URL' },
      { key: 'social.youtube', label: 'YouTube URL' },
      { key: 'social.instagram', label: 'Instagram URL' },
    ],
  },
  {
    key: 'stats',
    label: 'Statistics',
    kind: 'list',
    itemName: 'statistic',
    titleField: 'label',
    help: 'The headline numbers shown in stat rows across the site.',
    fields: [
      { key: 'value', label: 'Number', type: 'number' },
      { key: 'suffix', label: 'Suffix', placeholder: '+ or min' },
      { key: 'label', label: 'Label' },
    ],
  },
  {
    key: 'plans',
    label: 'Pricing plans',
    kind: 'list',
    itemName: 'plan',
    titleField: 'name',
    help: 'Drives the pricing page, the submit form dropdown and llms.txt.',
    fields: [
      { key: 'name', label: 'Plan name' },
      { key: 'slug', label: 'Slug' },
      { key: 'price', label: 'Price', type: 'number' },
      { key: 'unit', label: 'Price unit', placeholder: 'per release' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'popular', label: 'Highlight as most popular', type: 'bool' },
      { key: 'features', label: 'Features (one per line)', type: 'lines' },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    kind: 'list',
    itemName: 'service',
    titleField: 'name',
    help: 'Platform services. Each one also appears in the Services menu and the sitemap.',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'short', label: 'Short name' },
      { key: 'slug', label: 'Slug' },
      { key: 'href', label: 'Page file', placeholder: 'distribution.html' },
      iconField(),
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'bullets', label: 'Bullets (one per line)', type: 'lines' },
    ],
  },
  {
    key: 'industries',
    label: 'Industries',
    kind: 'list',
    itemName: 'industry',
    titleField: 'name',
    help: 'Renaming an industry updates its page, the Industries menu and the footer together.',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'h1', label: 'Page headline' },
      { key: 'intent', label: 'What it covers' },
      { key: 'stat', label: 'Highlighted statistic' },
      { key: 'keywords', label: 'Keywords (one per line)', type: 'lines' },
    ],
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    kind: 'list',
    itemName: 'testimonial',
    titleField: 'name',
    fields: [
      { key: 'name', label: 'Person' },
      { key: 'role', label: 'Role' },
      { key: 'company', label: 'Company' },
      { key: 'quote', label: 'Quote', type: 'textarea' },
    ],
  },
  {
    key: 'faqs',
    label: 'FAQs',
    kind: 'groups',
    titleField: 'q',
    help: 'Answer groups reused across the FAQ page, service pages and structured data.',
    groups: ['general', 'pricing', 'ai', 'distribution'],
    fields: [
      { key: 'q', label: 'Question' },
      { key: 'a', label: 'Answer', type: 'textarea' },
    ],
  },
  {
    key: 'primaryNav',
    label: 'Menu',
    kind: 'list',
    itemName: 'menu item',
    titleField: 'label',
    help: 'Top navigation. Leave the child links empty for a plain link with no dropdown.',
    fields: [
      { key: 'label', label: 'Label' },
      { key: 'href', label: 'Page file', placeholder: 'services.html' },
      { key: 'children', label: 'Dropdown links', type: 'pairs', pairFields: [
        { key: 'label', label: 'Label' },
        { key: 'href', label: 'Page file' },
      ] },
    ],
  },
  {
    key: 'footerColumns',
    label: 'Footer',
    kind: 'list',
    itemName: 'footer column',
    titleField: 'title',
    fields: [
      { key: 'title', label: 'Column heading' },
      { key: 'links', label: 'Links', type: 'pairs', pairFields: [
        { key: 'label', label: 'Label' },
        { key: 'href', label: 'Page file' },
      ] },
    ],
  },
  {
    key: 'legalPages',
    label: 'Legal page list',
    kind: 'list',
    itemName: 'legal page',
    titleField: 'name',
    help: 'Titles here feed the footer legal column. Page bodies are edited under Pages.',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
    ],
  },
  {
    key: 'audienceSegments',
    label: 'Audience segments',
    kind: 'list',
    itemName: 'segment',
    titleField: 'name',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'href', label: 'Page file' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
    ],
  },
  {
    key: 'networkChannels',
    label: 'Network channels',
    kind: 'strings',
    help: 'One channel name per line. Feeds the marquee and llms.txt.',
  },
];

export const SECTION_KEYS = SECTIONS.map((s) => s.key);

// Fields on a page that the editor is allowed to change.
export const PAGE_FIELDS = ['title', 'description', 'keywords', 'body'];
