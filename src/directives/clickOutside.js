export default {
  beforeMount: (el, binding) => {
    el.clickOutsideEvent = (event) => {
      event.stopPropagation()

      if (event.target !== el && !el.contains(event.target)) {
        binding.value(event)
      }
    }
    const clickHandler =
      'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
    setTimeout(() => {
      document.addEventListener(clickHandler, el.clickOutsideEvent)
    }, 0)
  },
  unmounted: (el) => {
    const clickOutsideEvent = el.clickOutsideEvent
    delete el.clickOutsideEvent
    const clickHandler =
      'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
    document.removeEventListener(clickHandler, clickOutsideEvent)
  },
}
