export interface NavLink {
  title: string
  href: string
}

export interface NavSection {
  title: string
  links: NavLink[]
}

/** Pages that aren't versioned, shown in every version's sidebar. */
const community: NavSection = {
  title: 'Community',
  links: [
    { title: 'Sponsors 🎉', href: '/sponsors' },
    { title: 'Contributors', href: '/contributors' },
  ],
}

/** Sidebar for each docs version, keyed by version id. Hrefs are unversioned. */
const sidebars: Record<string, NavSection[]> = {
  v4: [
    {
      title: 'Getting Started',
      links: [
        { href: '/guide/install', title: 'Installation' },
        { href: '/guide/options', title: 'Dropdown Options' },
        { href: '/guide/values', title: 'Selecting Values' },
        { href: '/guide/tagging', title: 'Tagging' },
        { href: '/guide/upgrade', title: 'Upgrading from v3' },
      ],
    },
    {
      title: 'Templating & Styling',
      links: [
        { href: '/guide/css', title: 'CSS & Theming' },
        { href: '/guide/slots', title: 'Slots' },
      ],
    },
    {
      title: 'Headless',
      links: [{ href: '/guide/headless', title: 'Headless Primitives' }],
    },
    {
      title: 'Accessibility',
      links: [
        { href: '/guide/accessibility', title: 'Accessibility' },
        { href: '/guide/localization', title: 'Localization' },
      ],
    },
    {
      title: 'Use Cases',
      links: [
        { href: '/guide/validation', title: 'Validation' },
        { href: '/guide/selectable', title: 'Limiting Selections' },
        { href: '/guide/pagination', title: 'Pagination' },
        { href: '/guide/infinite-scroll', title: 'Infinite Scroll' },
        { href: '/guide/ajax', title: 'AJAX' },
        { href: '/guide/loops', title: 'Using in Loops' },
      ],
    },
    {
      title: 'Customizing',
      links: [
        { href: '/guide/keydown', title: 'Keydown Events' },
        { href: '/guide/positioning', title: 'Dropdown Position' },
        { href: '/guide/opening', title: 'Dropdown Opening' },
        { href: '/guide/filtering', title: 'Option Filtering' },
      ],
    },
    {
      title: 'API',
      links: [
        { href: '/api/props', title: 'Props' },
        { href: '/api/slots', title: 'Slots' },
        { href: '/api/events', title: 'Events' },
        { href: '/api/methods', title: 'Methods' },
        { href: '/api/css-variables', title: 'CSS Variables' },
      ],
    },
  ],
  v3: [
    {
      title: 'Getting Started',
      links: [
        { href: '/guide/install', title: 'Installation' },
        { href: '/guide/options', title: 'Dropdown Options' },
        { href: '/guide/values', title: 'Selecting Values' },
        { href: '/guide/upgrading', title: 'Upgrading 2.x to 3.x' },
      ],
    },
    {
      title: 'Templating & Styling',
      links: [
        { href: '/guide/components', title: 'Child Components' },
        { href: '/guide/css', title: 'CSS & Selectors' },
        { href: '/guide/slots', title: 'Slots' },
      ],
    },
    {
      title: 'Accessibility',
      links: [
        { href: '/guide/accessibility', title: 'WAI-ARIA Spec' },
        { href: '/guide/localization', title: 'Localization' },
      ],
    },
    {
      title: 'Use Cases',
      links: [
        { href: '/guide/validation', title: 'Validation' },
        { href: '/guide/selectable', title: 'Limiting Selections' },
        { href: '/guide/pagination', title: 'Pagination' },
        { href: '/guide/infinite-scroll', title: 'Infinite Scroll' },
        { href: '/guide/vuex', title: 'Vuex' },
        { href: '/guide/ajax', title: 'AJAX' },
        { href: '/guide/loops', title: 'Using in Loops' },
      ],
    },
    {
      title: 'Customizing',
      links: [
        { href: '/guide/keydown', title: 'Keydown Events' },
        { href: '/guide/positioning', title: 'Dropdown Position' },
        { href: '/guide/opening', title: 'Dropdown Opening' },
        { href: '/guide/filtering', title: 'Option Filtering' },
      ],
    },
    {
      title: 'API',
      links: [
        { href: '/api/props', title: 'Props' },
        { href: '/api/slots', title: 'Slots' },
        { href: '/api/events', title: 'Events' },
      ],
    },
  ],
}

/** The sidebar for a version, with hrefs resolved to that version's prefix. */
export function navigationFor(version: DocsVersion): NavSection[] {
  const sections = (sidebars[version.id] ?? []).map((section) => ({
    ...section,
    links: section.links.map((link) => ({
      ...link,
      href: version.prefix + link.href,
    })),
  }))
  return [community, ...sections]
}

/** Whether a version has a page at the given unversioned path. */
export function versionHasPage(version: DocsVersion, path: string): boolean {
  return (
    path === '/' ||
    (sidebars[version.id] ?? []).some((s) => s.links.some((l) => l.href === path))
  )
}
