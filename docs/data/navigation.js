// export default [
//   {
//     title: 'Install',
//     children: ['NPM', 'CDN']
//   }, {
//     title: 'Features',
//     children: [
//       'Value Syncing',
//       'Single/Multiple',
//       'Tagging',
//       'Searching',
//       'TypeAhead',
//       'Ajax Support',
//       'Vuex Support'
//     ]
//   }, {
//     title: 'Component Events',
//     children: ['search:focus', 'search:blur', 'input', 'pointer:up', 'pointer:down']
//   }, {
//     title: 'Examples',
//     children: ['AJAX - Remote Options', 'Vuex Integration', 'Custom Labels']
//   }, {
//     title: 'Props',
//     children: []
//   }, {}, {
//     title: 'Mixins',
//     children: [
//       'AJAX', 'Scroll', 'Type Ahead'
//     ]
//   }, {
//     title: 'Parameters',
//     children: []
//   }
// ]

export function buildNavigation (element) {
  const nav = []
  let currentSection = null

  const headers = element.querySelectorAll('h1,h2')
  for (const header of Array.from(headers)) {
    if (header.tagName === 'H1') {
      currentSection = {title: header.textContent, id: header.id, children: []}
      nav.push(currentSection)
    } else if (header.tagName === 'H2' && currentSection) {
      currentSection.children.push({title: header.textContent, id: header.id})
    }
  }
  return nav
}
