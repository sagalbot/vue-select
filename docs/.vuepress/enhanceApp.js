import vSelect from '../../src/components/Select'

export default ({ Vue, options, router, siteData }) => {
  Vue.component('v-select', vSelect)

  /**
   * Remove service workers.
   */
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration
          .unregister()
          .then(() => console.log('Service worker unregistered.'))
          .catch(() => console.log('Error unregistering service worker.'))
      })
    })
  }
}
