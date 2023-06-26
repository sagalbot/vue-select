export default {
  mounted(el, { instance }) {
    if (instance.appendToBody) {
      const {
        height,
        top,
        left,
        width,
      } = instance.$refs.toggle.getBoundingClientRect()
      let scrollX = window.scrollX || window.pageXOffset
      let scrollY = window.scrollY || window.pageYOffset
      el.unbindPosition = instance.calculatePosition(el, instance, {
        width: width + 'px',
        left: scrollX + left + 'px',
        top: scrollY + top + height + 'px',
      })

      document.body.appendChild(el)
    }
  },

  unmounted(el, { instance }) {
    if (instance.appendToBody) {
      if (el.unbindPosition && typeof el.unbindPosition === 'function') {
        el.unbindPosition()
      }
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
