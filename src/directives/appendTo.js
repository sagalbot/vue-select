export default {
  mounted(el, { instance }) {
    if (instance.appendTo) {
      const {
        height,
        top,
        left,
        width,
      } = instance.$refs.toggle.getBoundingClientRect()
      const relEl = instance.appendTo instanceof Element ? instance.appendTo : document.querySelector(instance.appendTo)
      if (relEl instanceof Element) {
        const isBody = relEl === document.body
        const scrollX = isBody ? (window.scrollX || window.pageXOffset) : 0
        const scrollY = isBody ? (window.scrollY || window.pageYOffset) : 0
        const relRect = relEl.getBoundingClientRect()
        el.unbindPosition = instance.calculatePosition(el, instance, {
          width: width + 'px',
          left: scrollX + left - relRect.left + 'px',
          top: scrollY + top - relRect.top + height + 'px'
        })
        relEl.appendChild(el)
      }
    }
  },

  unmounted(el, { instance }) {
    if (instance.appendTo) {
      if (el.unbindPosition && typeof el.unbindPosition === 'function') {
        el.unbindPosition()
      }
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
