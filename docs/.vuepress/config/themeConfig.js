module.exports = {
  repo: 'sagalbot/vue-select',
  editLinks: true,
  docsDir: 'docs',
  nav: [
    {text: 'Sandbox', link: '/sandbox'},
  ],
  sidebar: {
    '/': [
      {
        title: 'Community',
        collapsable: false,
        children: [
          ['sponsors', 'Sponsors 🎉'],
          ['contributors', 'Contributors'],
        ],
      },
      {
        title: 'Getting Started',
        collapsable: false,
        children: [
          ['guide/install', 'Installation'],
          ['guide/options', 'Dropdown Options'],
          ['guide/values', 'Selecting Values'],
          ['guide/upgrading', 'Upgrading 2.x to 3.x'],
        ],
      },
      {
        title: 'Templating & Styling',
        collapsable: false,
        children: [
          ['guide/components', 'Child Components'],
          ['guide/css', 'CSS & Selectors'],
          ['guide/slots', 'Slots'],
        ],
      },
      {
        title: 'Accessibility',
        collapsable: false,
        children: [
          ['guide/accessibility', 'WAI-ARIA Spec'],
          ['guide/localization', 'Localization'],
        ],
      },
      {
        title: 'Use Cases',
        collapsable: false,
        children: [
          ['guide/validation', 'Validation'],
          ['guide/selectable', 'Limiting Selections'],
          ['guide/pagination', 'Pagination'],
          ['guide/infinite-scroll', 'Infinite Scroll'],
          ['guide/vuex', 'Vuex'],
          ['guide/ajax', 'AJAX'],
          ['guide/loops', 'Using in Loops'],
        ],
      },
      {
        title: 'Customizing',
        collapsable: false,
        children: [
          ['guide/keydown', 'Keydown Events'],
          ['guide/positioning', 'Dropdown Position'],
          ['guide/filtering', 'Option Filtering'],
        ],
      },
      {
        title: 'API',
        collapsable: false,
        children: [
          ['api/props', 'Props'],
          ['api/slots', 'Slots'],
          ['api/events', 'Events'],
        ],
      },
    ],
  },
};
